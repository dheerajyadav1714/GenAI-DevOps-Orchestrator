import os
import requests
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from jira import JIRA
from google.cloud import secretmanager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

def get_secret(secret_name):
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/genai-hackathon-491712/secrets/{secret_name}/versions/latest"
    try:
        response = client.access_secret_version(request={"name": name})
        return response.payload.data.decode("UTF-8").strip()
    except Exception as e:
        logger.error(f"Failed to fetch secret {secret_name}: {e}")
        return ""

JIRA_URL = get_secret("jira-url").rstrip('/')
JIRA_EMAIL = get_secret("jira-email")
JIRA_TOKEN = get_secret("jira-token")

# JIRA library for basic operations (still works for get_issue, update)
jira = JIRA(server=JIRA_URL, basic_auth=(JIRA_EMAIL, JIRA_TOKEN))

class UpdateIssueRequest(BaseModel):
    key: str
    status: Optional[str] = None
    comment: Optional[str] = None

class IssueCreate(BaseModel):
    project_key: str
    summary: str
    description: Optional[str] = ""
    issue_type: str = "Task"

# ========== GET ISSUE ==========
@app.get("/issue/{key}")
def get_issue(key: str):
    try:
        issue = jira.issue(key)
        return {
            "key": issue.key,
            "summary": issue.fields.summary,
            "description": issue.fields.description,
            "status": issue.fields.status.name,
            "assignee": issue.fields.assignee.displayName if issue.fields.assignee else None,
            "comments": [{"body": c.body, "author": c.author.displayName} for c in issue.fields.comment.comments]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== UPDATE ISSUE ==========
@app.post("/update")
def update_issue(req: UpdateIssueRequest):
    try:
        issue = jira.issue(req.key)
        if req.status:
            transitions = jira.transitions(issue)
            for t in transitions:
                if t['name'].lower() == req.status.lower():
                    jira.transition_issue(issue, t['id'])
                    break
        if req.comment:
            jira.add_comment(issue, req.comment)
        return {"status": "updated", "key": req.key}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== SEARCH ISSUES (API v3) ==========
@app.get("/search")
def search_issues(jql: str, max_results: int = 50):
    try:
        url = f"{JIRA_URL}/rest/api/3/search/jql"
        auth = (JIRA_EMAIL, JIRA_TOKEN)
        params = {"jql": jql, "maxResults": max_results, "fields": "summary,status,description,assignee"}
        headers = {"Accept": "application/json"}
        resp = requests.get(url, auth=auth, params=params, headers=headers, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        issues = data.get("issues", [])
        return [{
            "key": i.get("key"),
            "summary": i.get("fields", {}).get("summary"),
            "status": i.get("fields", {}).get("status", {}).get("name"),
            "description": i.get("fields", {}).get("description"),
            "assignee": i.get("fields", {}).get("assignee", {}).get("displayName") if i.get("fields", {}).get("assignee") else "Unassigned"
        } for i in issues]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== CREATE ISSUE ==========
@app.post("/issue")
def create_issue(issue: IssueCreate):
    try:
        new_issue = jira.create_issue(
            project=issue.project_key,
            summary=issue.summary,
            description=issue.description,
            issuetype={'name': issue.issue_type}
        )
        return {"key": new_issue.key, "url": f"{JIRA_URL}/browse/{new_issue.key}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== ASSIGN TO SPRINT (Agile API) ==========
@app.post("/issue/{key}/sprint")
def assign_sprint(key: str, sprint_name: str):
    try:
        # Find sprint ID by name
        boards = jira.boards()
        sprint_id = None
        for board in boards:
            try:
                sprints = jira.sprints(board.id, maxResults=100)
                for sprint in sprints:
                    if sprint.name == sprint_name:
                        sprint_id = sprint.id
                        break
            except:
                continue
            if sprint_id:
                break
        
        if not sprint_id:
            raise HTTPException(status_code=404, detail=f"Sprint '{sprint_name}' not found")
        
        # Add issue to sprint using Agile API
        url = f"{JIRA_URL}/rest/agile/1.0/sprint/{sprint_id}/issue"
        auth = (JIRA_EMAIL, JIRA_TOKEN)
        payload = {"issues": [key]}
        headers = {"Accept": "application/json", "Content-Type": "application/json"}
        resp = requests.post(url, auth=auth, json=payload, headers=headers, timeout=30)
        resp.raise_for_status()  # 204 No Content on success
        
        return {"status": "assigned", "key": key, "sprint": sprint_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== HEALTH ==========
@app.get("/health")
def health():
    return {"status": "ok"}
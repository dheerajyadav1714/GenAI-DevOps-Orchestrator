from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from requests.auth import HTTPBasicAuth
from google.cloud import secretmanager
import json
import markdown

app = FastAPI()

def get_secret(secret_name):
    # Try fetching from GCP Secret Manager for real deployment
    try:
        client = secretmanager.SecretManagerServiceClient()
        name = f"projects/genai-hackathon-491712/secrets/{secret_name}/versions/latest"
        response = client.access_secret_version(request={"name": name})
        return response.payload.data.decode("UTF-8").strip()
    except Exception:
        return ""

# Since Atlassian uses the same unified token for Jira and Confluence, we re-use the Jira secrets!
CONFLUENCE_DOMAIN = "djyadav1714.atlassian.net"

class PageRequest(BaseModel):
    space: str
    title: str
    content: str

@app.post("/pages")
def create_page(req: PageRequest):
    conf_email = get_secret("jira-email")
    conf_token = get_secret("jira-token")
    if not conf_token or not conf_email:
        raise HTTPException(status_code=500, detail="Atlassian credentials missing in Secret Manager")
    
    url = f"https://{CONFLUENCE_DOMAIN}/wiki/rest/api/content"
    
    # Convert markdown to compliant HTML for Confluence storage format
    html_content = markdown.markdown(req.content, extensions=['fenced_code', 'tables'])
    
    payload = {
        "type": "page",
        "title": req.title,
        "space": {"key": req.space},
        "body": {
            "storage": {
                "value": html_content,
                "representation": "storage"
            }
        }
    }
    
    resp = requests.post(
        url,
        json=payload,
        auth=HTTPBasicAuth(conf_email, conf_token),
        headers={"Content-Type": "application/json"}
    )
    
    if resp.status_code == 200:
        page_id = resp.json()["id"]
        return {"id": page_id, "url": f"https://{CONFLUENCE_DOMAIN}/wiki/pages/viewpage.action?pageId={page_id}"}
    else:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)

@app.get("/search")
def search_pages(query: str):
    conf_email = get_secret("jira-email")
    conf_token = get_secret("jira-token")
    if not conf_token or not conf_email:
        raise HTTPException(status_code=500, detail="Atlassian credentials missing in Secret Manager")
    
    # Use CQL to search content body or title
    cql = f"(text ~ \"{query}\" OR title ~ \"{query}\") AND type=page"
    url = f"https://{CONFLUENCE_DOMAIN}/wiki/rest/api/content/search"
    
    resp = requests.get(
        url,
        params={"cql": cql, "limit": 3, "expand": "body.plain,body.storage"},
        auth=HTTPBasicAuth(conf_email, conf_token),
        headers={"Accept": "application/json"}
    )
    
    if resp.status_code == 200:
        results = []
        for item in resp.json().get("results", []):
            body = item.get("body", {})
            # Try to grab plain text, fallback to storage format
            content = body.get("plain", {}).get("value") or body.get("storage", {}).get("value") or ""
            
            # Clean up excessively long content for AI memory
            if len(content) > 1500:
                content = content[:1500] + "... (truncated)"
                
            results.append({
                "id": item.get("id"),
                "title": item.get("title"),
                "content": content,
                "url": f"https://{CONFLUENCE_DOMAIN}/wiki/pages/viewpage.action?pageId={item.get('id')}"
            })
        return {"results": results}
    else:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)

@app.get("/health")
def health():
    return {"status": "ok"}

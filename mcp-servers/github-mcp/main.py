import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from github import Github, GithubException
from google.cloud import secretmanager

app = FastAPI()

def get_secret(secret_name):
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/genai-hackathon-491712/secrets/{secret_name}/versions/latest"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")

GITHUB_TOKEN = get_secret("github-token")
g = Github(GITHUB_TOKEN)

class CommitRequest(BaseModel):
    repo: str
    branch: str
    path: str
    content: str
    message: str

class PRRequest(BaseModel):
    repo: str
    title: str
    body: str
    head: str
    base: str = "main"

class BranchRequest(BaseModel):
    repo: str
    branch: str
    base: str = "main"

class MergeRequest(BaseModel):
    repo: str
    pr_number: int
    merge_method: str = "merge"

@app.get("/read")
def read_file(repo: str, path: str, branch: str = "main"):
    try:
        repo_obj = g.get_repo(repo)
        contents = repo_obj.get_contents(path, ref=branch)
        content = contents.decoded_content.decode("utf-8")
        return {"path": path, "content": content, "branch": branch, "repo": repo}
    except GithubException as e:
        raise HTTPException(status_code=e.status, detail=e.data.get("message", str(e)))

@app.post("/commit")
def commit_file(req: CommitRequest):
    try:
        repo_obj = g.get_repo(req.repo)
        try:
            existing = repo_obj.get_contents(req.path, ref=req.branch)
            repo_obj.update_file(req.path, req.message, req.content, existing.sha, branch=req.branch)
        except GithubException as e:
            if e.status == 404:
                repo_obj.create_file(req.path, req.message, req.content, branch=req.branch)
            else:
                raise
        return {"status": "committed", "path": req.path, "branch": req.branch}
    except GithubException as e:
        raise HTTPException(status_code=e.status, detail=e.data.get("message", str(e)))

@app.post("/create-pr")
def create_pr(req: PRRequest):
    try:
        repo_obj = g.get_repo(req.repo)
        pr = repo_obj.create_pull(title=req.title, body=req.body, head=req.head, base=req.base)
        return {"number": pr.number, "url": pr.html_url}
    except GithubException as e:
        if e.status == 422:
            try:
                owner = req.repo.split('/')[0]
                existing_prs = list(repo_obj.get_pulls(state="open", head=f"{owner}:{req.head}"))
                for pr in existing_prs:
                    if pr.head.ref == req.head:
                        return {"number": pr.number, "url": pr.html_url, "existing": True}
            except:
                pass
        raise HTTPException(status_code=e.status, detail=e.data.get("message", str(e)))

@app.post("/create-branch")
def create_branch(req: BranchRequest):
    try:
        repo_obj = g.get_repo(req.repo)
        base_branch = repo_obj.get_branch(req.base)
        repo_obj.create_git_ref(ref=f"refs/heads/{req.branch}", sha=base_branch.commit.sha)
        return {"status": "created", "branch": req.branch}
    except GithubException as e:
        raise HTTPException(status_code=e.status, detail=e.data.get("message", str(e)))

@app.post("/merge-pr")
def merge_pr(req: MergeRequest):
    try:
        repo_obj = g.get_repo(req.repo)
        pr = repo_obj.get_pull(req.pr_number)
        pr.merge(merge_method=req.merge_method)
        return {"status": "merged", "pr_number": req.pr_number}
    except GithubException as e:
        raise HTTPException(status_code=e.status, detail=e.data.get("message", str(e)))

# ========== NEW: List branches ==========
@app.get("/branches")
def list_branches(repo: str):
    try:
        repo_obj = g.get_repo(repo)
        branches = [b.name for b in repo_obj.get_branches()]
        return {"repo": repo, "branches": branches, "count": len(branches)}
    except GithubException as e:
        raise HTTPException(status_code=e.status, detail=e.data.get("message", str(e)))

# ========== NEW: List PRs ==========
@app.get("/prs")
def list_prs(repo: str, state: str = "open"):
    try:
        repo_obj = g.get_repo(repo)
        prs = repo_obj.get_pulls(state=state, sort="created", direction="desc")
        result = []
        for pr in prs[:20]:
            result.append({
                "number": pr.number,
                "title": pr.title,
                "state": pr.state,
                "url": pr.html_url,
                "author": pr.user.login,
                "created_at": pr.created_at.isoformat(),
                "head": pr.head.ref,
                "base": pr.base.ref
            })
        return {"repo": repo, "state": state, "prs": result, "count": len(result)}
    except GithubException as e:
        raise HTTPException(status_code=e.status, detail=e.data.get("message", str(e)))

# ========== NEW: Get PR details ==========
@app.get("/pr/{repo_owner}/{repo_name}/{pr_number}")
def get_pr_details(repo_owner: str, repo_name: str, pr_number: int):
    try:
        repo_obj = g.get_repo(f"{repo_owner}/{repo_name}")
        pr = repo_obj.get_pull(pr_number)
        files = [{"filename": f.filename, "status": f.status, "additions": f.additions,
                  "deletions": f.deletions, "patch": f.patch[:500] if f.patch else ""} for f in pr.get_files()]
        return {
            "number": pr.number, "title": pr.title, "state": pr.state,
            "url": pr.html_url, "author": pr.user.login,
            "body": pr.body or "", "merged": pr.merged,
            "head": pr.head.ref, "base": pr.base.ref,
            "created_at": pr.created_at.isoformat(),
            "files_changed": files, "additions": pr.additions,
            "deletions": pr.deletions, "changed_files": pr.changed_files
        }
    except GithubException as e:
        raise HTTPException(status_code=e.status, detail=e.data.get("message", str(e)))

# ========== NEW: List repo contents ==========
@app.get("/list")
def list_contents(repo: str, path: str = "", branch: str = "main"):
    try:
        repo_obj = g.get_repo(repo)
        contents = repo_obj.get_contents(path, ref=branch)
        if not isinstance(contents, list):
            contents = [contents]
        result = [{"name": c.name, "path": c.path, "type": c.type, "size": c.size} for c in contents]
        return {"repo": repo, "path": path, "branch": branch, "contents": result}
    except GithubException as e:
        raise HTTPException(status_code=e.status, detail=e.data.get("message", str(e)))

@app.get("/health")
def health():
    return {"status": "ok"}

# ========== NEW: Post PR Review Comment ==========
class PRCommentRequest(BaseModel):
    repo: str
    pr_number: int
    body: str

@app.post("/pr/comment")
def comment_on_pr(req: PRCommentRequest):
    try:
        repo_obj = g.get_repo(req.repo)
        pr = repo_obj.get_pull(req.pr_number)
        comment = pr.create_issue_comment(req.body)
        return {"status": "commented", "comment_id": comment.id, "url": comment.html_url}
    except GithubException as e:
        raise HTTPException(status_code=e.status, detail=e.data.get("message", str(e)))

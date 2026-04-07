import os
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from slack_sdk.webhook import WebhookClient
from google.cloud import secretmanager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

def get_secret(secret_name):
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/genai-hackathon-491712/secrets/{secret_name}/versions/latest"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")

SLACK_WEBHOOK_URL = get_secret("slack-webhook")
webhook = WebhookClient(SLACK_WEBHOOK_URL)


# ========== SEND MESSAGE (now supports blocks for interactive buttons) ==========
class MessageRequest(BaseModel):
    text: str
    channel: Optional[str] = None      # ignored by webhook, kept for API compat
    blocks: Optional[list] = None      # NEW: forward blocks to Slack

@app.post("/send")
def send_message(req: MessageRequest):
    try:
        kwargs = {"text": req.text}
        if req.blocks:
            kwargs["blocks"] = req.blocks
            logger.info(f"Sending message with {len(req.blocks)} blocks")
        response = webhook.send(**kwargs)
        if response.status_code == 200:
            return {"status": "sent", "message": req.text}
        else:
            logger.error(f"Slack send failed: {response.status_code} {response.body}")
            raise HTTPException(status_code=response.status_code, detail=response.body)
    except Exception as e:
        logger.exception(f"Slack send error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ========== SEND APPROVAL (Approve/Reject PR buttons) ==========
class ApprovalRequest(BaseModel):
    pr_url: str
    pr_number: int
    repo: str
    jira_key: str
    workflow_id: str
    channel: Optional[str] = None  # ignored by webhook, kept for API compat

@app.post("/send-approval")
def send_approval(req: ApprovalRequest):
    try:
        approve_value = f"approve|{req.pr_url}|{req.pr_number}|{req.repo}|{req.jira_key}|{req.workflow_id}"
        reject_value = f"reject|{req.pr_url}|{req.pr_number}|{req.repo}|{req.jira_key}|{req.workflow_id}"
        blocks = [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*PR #{req.pr_number} is ready to merge!*\nRepo: {req.repo}\nJira: {req.jira_key}\n<{req.pr_url}|View Pull Request>"
                }
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {"type": "plain_text", "text": "✅ Approve"},
                        "style": "primary",
                        "value": approve_value,
                        "action_id": "approve_pr"
                    },
                    {
                        "type": "button",
                        "text": {"type": "plain_text", "text": "❌ Reject"},
                        "style": "danger",
                        "value": reject_value,
                        "action_id": "reject_pr"
                    }
                ]
            }
        ]
        response = webhook.send(blocks=blocks)
        if response.status_code == 200:
            return {"status": "sent"}
        else:
            logger.error(f"Slack approval send failed: {response.status_code} {response.body}")
            raise HTTPException(status_code=response.status_code, detail=response.body)
    except Exception as e:
        logger.exception(f"Slack approval error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    return {"status": "ok"}
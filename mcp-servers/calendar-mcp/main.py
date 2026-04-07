import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google.oauth2 import service_account
from googleapiclient.discovery import build
from google.cloud import secretmanager

app = FastAPI()

def get_secret_json(secret_name):
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/genai-hackathon-491712/secrets/{secret_name}/versions/latest"
    response = client.access_secret_version(request={"name": name})
    return json.loads(response.payload.data.decode("UTF-8"))

creds_dict = get_secret_json("calendar-sa-key")
credentials = service_account.Credentials.from_service_account_info(
    creds_dict, scopes=["https://www.googleapis.com/auth/calendar"]
)
service = build("calendar", "v3", credentials=credentials)

class EventRequest(BaseModel):
    summary: str
    description: str = ""
    start_time: str
    end_time: str
    attendees: list[str] = []

@app.post("/create-event")
def create_event(req: EventRequest):
    try:
        import urllib.parse
        
        # Format dates for Google Template: YYYYMMDDTHHMMSSZ
        def fmt_dt(dt_str):
            clean = dt_str.replace("-", "").replace(":", "")
            if not clean.endswith("Z"):
                clean += "Z"
            return clean

        start_fmt = fmt_dt(req.start_time)
        end_fmt = fmt_dt(req.end_time)
        
        # Build "Add to Calendar" link (Public Template)
        base_url = "https://www.google.com/calendar/render?action=TEMPLATE"
        params = {
            "text": req.summary,
            "dates": f"{start_fmt}/{end_fmt}",
            "details": req.description,
            "trp": "true"
        }
        template_link = f"{base_url}&{urllib.parse.urlencode(params)}"

        event = {
            'summary': req.summary,
            'description': req.description,
            'start': {'dateTime': req.start_time, 'timeZone': 'UTC'},
            'end': {'dateTime': req.end_time, 'timeZone': 'UTC'},
            'attendees': [{'email': email} for email in req.attendees],
        }
        
        created = service.events().insert(calendarId='primary', body=event, sendUpdates='all').execute()
        return {"event_id": created['id'], "html_link": template_link}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health():
    return {"status": "ok"}

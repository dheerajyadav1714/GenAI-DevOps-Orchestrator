import os
import re
import time
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import jenkins
import requests
from google.cloud import secretmanager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

def get_secret(secret_name):
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/genai-hackathon-491712/secrets/{secret_name}/versions/latest"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")

JENKINS_URL = get_secret("jenkins-url")
JENKINS_USER = get_secret("jenkins-username")
JENKINS_TOKEN = get_secret("jenkins-token")
server = jenkins.Jenkins(JENKINS_URL, username=JENKINS_USER, password=JENKINS_TOKEN)


class TriggerRequest(BaseModel):
    job_name: str
    parameters: dict = {}


@app.post("/trigger")
def trigger_job(req: TriggerRequest):
    try:
        logger.info(f"Triggering {req.job_name} with {req.parameters}")

        # Step 1: Record lastBuild BEFORE trigger
        pre_last = 0
        try:
            info = server.get_job_info(req.job_name)
            pre_last = info.get('lastBuild', {}).get('number', 0)
            logger.info(f"Pre-trigger lastBuild: #{pre_last}")
        except Exception as e:
            logger.warning(f"Pre-trigger check failed: {e}")

        # Step 2: Get crumb
        crumb_r = requests.get(
            f"{JENKINS_URL}/crumbIssuer/api/json",
            auth=(JENKINS_USER, JENKINS_TOKEN), timeout=10
        )
        crumb_r.raise_for_status()
        crumb_data = crumb_r.json()
        crumb_field = crumb_data["crumbRequestField"]
        crumb = crumb_data["crumb"]

        # Step 3: Trigger build
        params = {
            k: (str(v).lower() if isinstance(v, bool) else str(v))
            for k, v in req.parameters.items()
        }
        trigger_r = requests.post(
            f"{JENKINS_URL}/job/{req.job_name}/buildWithParameters",
            auth=(JENKINS_USER, JENKINS_TOKEN),
            data=params,
            headers={crumb_field: crumb},
            timeout=15
        )
        trigger_r.raise_for_status()
        logger.info(f"Trigger response: {trigger_r.status_code}")

        # Step 4: Poll until lastBuild advances past pre_last (max 60s)
        build_number = None
        for attempt in range(30):
            time.sleep(2)
            try:
                info = server.get_job_info(req.job_name)
                last_num = info.get('lastBuild', {}).get('number', 0)
                logger.info(f"Poll {attempt+1}: lastBuild=#{last_num} (pre=#{pre_last})")
                if last_num > pre_last:
                    build_number = last_num
                    logger.info(f"New build confirmed: #{build_number}")
                    break
            except Exception as e:
                logger.warning(f"Poll error: {e}")

        if build_number is None:
            build_number = pre_last + 1
            logger.warning(f"Timeout - using #{build_number}")

        return {"status": "triggered", "job": req.job_name, "build_number": build_number}

    except Exception as e:
        logger.exception("Trigger failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/status/{job_name}/{build_number}")
def get_status(job_name: str, build_number: int):
    try:
        info = server.get_build_info(job_name, build_number)
        return {"building": info["building"], "result": info.get("result")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/logs/{job_name}/{build_number}")
def get_logs(job_name: str, build_number: int):
    try:
        logs = server.get_build_console_output(job_name, build_number)
        return {"logs": logs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/lastfailed/{job_name}")
def get_last_failed(job_name: str):
    try:
        info = server.get_job_info(job_name)
        last_failed = info.get("lastFailedBuild")
        if not last_failed:
            return {"build_number": None}
        bn = last_failed["number"]
        build_info = server.get_build_info(job_name, bn)
        logs = server.get_build_console_output(job_name, bn)
        return {"build_number": bn, "result": build_info.get("result"), "logs": logs[-3000:]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    return {"status": "ok"}

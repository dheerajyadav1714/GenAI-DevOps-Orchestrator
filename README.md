# 🚀 Autonomous DevOps Assistant

An AI-powered, multi-agent DevOps Orchestrator built to automate SDLC workflows, incident response, and infrastructure management. This platform serves as a powerful "virtual SRE" that integrates natively with Jira, GitHub, Jenkins, Confluence, Slack, and Google Calendar.

## ✨ Key Features
- **Multi-Persona Functionality**: Acts as a Pair Programmer for Developers (ticket scoping, automatic bug fixes, PR reviews) and an Autonomous SRE for DevOps (CI/CD auto-healing, log analysis, DORA metrics).
- **Zero-Touch Auto-Healing**: Listens to Jenkins failures, diagnoses root causes via logs, consults company Confluence runbooks via RAG, automatically writes the code fix, merges the Pull Request, and restarts the pipeline.
- **Dual-Layer RAG System**: Combines AlloyDB Vector Search (for historical memory of past incident fixes) with Confluence MCP (for official company policies).
- **Auto-Release Notes**: Automatically synchronizes GitHub merged PRs and Jira tickets to synthesize and publish beautiful Release Notes directly to the company Wiki.
- **Cross-Platform Chain Reactions**: A single natural language prompt ("Production is down!") can generate a P1 Jira ticket, notify your Slack on-call channel, and schedule a Google Calendar War Room seamlessly.

## 🏗️ Architecture Stack
1. **Frontend**: Streamlit UX for Chat, Logs, and Dashboard Metrics.
2. **Brain**: Gemini 1.5 Pro/Flash orchestration engine processing multi-agent function calls.
3. **Database**: AlloyDB (PostgreSQL + pgvector) for conversation state, telemetry, and vector embeddings.
4. **Integration Layer (MCP Servers)**: Microservice constellation deployed on Cloud Run allowing secure access to Jira API, Jenkins API, GitHub API, Atlassian CQL Search, Google Workspace, and Slack Webhooks.
5. **Infrastructure**: Serverless deployment entirely on Google Cloud Platform. (Cloud Run)

## 📁 Repository Structure
```
devops-assistant/
│
├── orchestrator/          # The main Brain deployed on Cloud Run
│   ├── main.py            # Gemini routing, auto-healing loop, tool execution
│   ├── Dockerfile
│   └── requirements.txt
│
├── ui/                    # Streamlit Frontend
│   ├── app.py             # Chat interface and workflow monitoring
│   ├── Dockerfile
│   └── requirements.txt
│
├── mcp-servers/           # Model Context Protocol Servers
│   ├── confluence-mcp/    # Atlassian Wiki RAG endpoints
│   ├── github-mcp/        # PR/Commit/Review management
│   ├── jenkins-mcp/       # CI/CD trigger and log endpoints
│   ├── jira-mcp/          # Ticket management and JQL search
│   ├── slack-mcp/         # Alerting and channel messaging
│   └── calendar-mcp/      # Calendar events and scheduling
│
├── workflows/             # (Optional) Pre-defined scripts or manual runbooks
└── project_summary.md     # Full feature capability matrix
```

## 🚀 Quick Deploy

1. Ensure you have GCP credentials (`GOOGLE_APPLICATION_CREDENTIALS`) configured.
2. Update the `orchestrator/main.py` to point `MCP_SERVERS` dictionary to your deployed URLs.
3. Build and deploy using Google Cloud Run:
```bash
# E.g., Deploying the Orchestrator
cd orchestrator
gcloud builds submit --tag gcr.io/[PROJECT_ID]/devops-orchestrator
gcloud run deploy devops-orchestrator --image gcr.io/[PROJECT_ID]/devops-orchestrator \
    --set-env-vars "DATABASE_URL=postgresql+asyncpg://[USER]:[PASS]@[IP]/postgres"
```

## 🔐 Security Note
This repository uses `google.cloud.secretmanager` for handling tokens natively via IAM permissions. No API keys or OAuth tokens are hardcoded. Ensure your Cloud Run service accounts hold the `Secret Manager Secret Accessor` role.

---
*Built for the GenAI DevOps Hackathon.*

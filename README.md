# 🚀 GenAI DevOps Orchestrator

An **AI-powered, multi-agent DevOps platform** that autonomously manages CI/CD pipelines, remediates failures, and coordinates across Jira, GitHub, Jenkins, Confluence, Slack, and Google Calendar — all from a single natural language interface.

> Built with **Gemini 2.5 Flash** on **Google Cloud Platform** for the GenAI Hackathon.

---

## ✨ Core Capabilities

### 🛡️ For DevOps Engineers (Autonomous SRE)

| Capability | What It Does | Example Prompt |
| :--- | :--- | :--- |
| **Self-Healing CI/CD** | Detects Jenkins failures, diagnoses root cause via AI + RAG, writes code fix, creates PR, merges, restarts pipeline — all autonomously. | `"Trigger test-pipeline with FAIL=true"` |
| **RAG-Powered Log Analysis** | Extracts error signatures from pasted logs, searches Confluence Wiki for internal runbooks, and provides company-specific remediation. | `"Analyze this log: MemoryError loading customer dataset"` |
| **Auto Release Notes** | Fetches all merged PRs from GitHub, cross-references Jira tickets, synthesizes release notes via AI, publishes to Confluence, and notifies Slack. | `"Generate release notes for v1.0.0"` |
| **Natural Language DB Queries** | Converts plain English questions into PostgreSQL queries against AlloyDB metrics tables (DORA Metrics). | `"Show me build success rate for the last 7 days"` |
| **Autonomous Post-Mortem** | After an auto-fix, automatically schedules a Google Calendar post-mortem meeting and auto-generates a Runbook in Confluence. | *(Triggers automatically)* |
| **Jenkins Webhook** | Zero-touch integration — Jenkins calls the orchestrator webhook on build completion for fully passive monitoring. | `POST /webhook/jenkins` |
| **DORA Metrics Dashboard** | Live Streamlit dashboard tracking MTTR, fix rate, confidence scores, pipeline pass rate, and incident history. | *(Visit Dashboard page)* |

### 🛠️ For Software Developers (Pair Programmer)

| Capability | What It Does | Example Prompt |
| :--- | :--- | :--- |
| **AI Bug Fixing** | Reads Jira ticket + source code from GitHub, generates a fix, commits to a feature branch, creates a PR, and posts an AI code review. | `"Fix ticket SCRUM-11 in the ci_cd repo"` |
| **AI Code Review** | Reviews any PR for bugs, security vulnerabilities (hardcoded secrets, SQL injection, XSS), code quality, and posts the review as a GitHub PR comment. | `"Review PR #18"` |
| **Jira Management** | Full ticket lifecycle — create, search (JQL), update status, add comments, assign to sprints. | `"Show all open bugs in SCRUM project"` |
| **GitHub Operations** | Read files, list branches/PRs, create branches, commit code, create PRs, merge PRs. | `"List all open PRs in ci_cd repo"` |
| **Slack Notifications** | Context-aware messages — the AI resolves placeholders and sends actual data, not templates. | `"Tell the team on Slack that SCRUM-5 is fixed"` |
| **Calendar Scheduling** | Create Google Calendar events for deployments, syncs, or war rooms. | `"Schedule a deployment review for tomorrow at 2pm"` |
| **Knowledge Search** | Query Confluence Wiki and AlloyDB vector store for past incidents, runbooks, and internal policies. | `"Search runbooks for divide by zero error"` |

---

## 🏗️ Architecture

```
┌──────────────┐     ┌──────────────────────────────────────────┐
│  Streamlit   │────▶│         Orchestrator (Gemini 2.5)        │
│  Chat + Dash │     │  Plan → Execute → Synthesize (2-Pass)    │
└──────────────┘     └────┬────┬────┬────┬────┬────┬────────────┘
                          │    │    │    │    │    │
                    ┌─────▼┐ ┌▼───┐ ┌▼──┐ ┌▼──┐ ┌▼────┐ ┌▼─────────┐
                    │Jenkin│ │Git │ │Jir│ │Sla│ │Cal  │ │Confluence│
                    │s MCP │ │Hub │ │ a │ │ ck│ │ndar │ │  MCP     │
                    └──────┘ └────┘ └───┘ └───┘ └─────┘ └──────────┘
                                                              │
                          ┌───────────────────────────────────▼───┐
                          │          AlloyDB (PostgreSQL)          │
                          │  workflows │ incidents │ embeddings   │
                          │  runbooks  │ pipeline_runs │ chat     │
                          └──────────────────────────────────────-┘
```

### Technology Stack
- **AI Engine**: Gemini 2.5 Flash via Vertex AI
- **Embeddings**: Vertex AI `text-embedding-005` (768 dimensions)
- **Database**: AlloyDB (PostgreSQL) + `pgvector` for semantic search
- **Compute**: Google Cloud Run (serverless)
- **Secrets**: GCP Secret Manager (zero hardcoded credentials)
- **Frontend**: Streamlit (Chat UI + Metrics Dashboard)
- **CI/CD**: Jenkins on GCE VM

---

## 📁 Repository Structure

```
GenAI-DevOps-Orchestrator/
│
├── orchestrator/              # The AI Brain (1,622 lines)
│   ├── main.py                # Gemini routing, auto-healing, tool execution
│   ├── Dockerfile
│   └── requirements.txt
│
├── ui/                        # Streamlit Frontend
│   ├── app.py                 # Chat interface with live polling
│   ├── pages/
│   │   └── dashboard.py       # DORA Metrics & Incident Dashboard
│   ├── .streamlit/
│   │   └── config.toml        # UI theme configuration
│   ├── Dockerfile
│   └── requirements.txt
│
├── mcp-servers/               # Model Context Protocol Microservices
│   ├── jenkins-mcp/           # Trigger, status, logs, lastfailed
│   ├── github-mcp/            # Read, commit, PRs, branches, reviews
│   ├── jira-mcp/              # CRUD, JQL search, sprint management
│   ├── slack-mcp/             # Messages + interactive approve/reject buttons
│   ├── calendar-mcp/          # Google Calendar event creation
│   └── confluence-mcp/        # Wiki page creation + CQL search (RAG)
│
├── .gitignore
└── README.md
```

---

## 🔐 Security

- **Zero hardcoded credentials** — all tokens stored in GCP Secret Manager
- **IAM-based access** — Cloud Run service accounts with least-privilege roles
- **GitHub Push Protection** — repository-level secret scanning enabled
- **AI Security Scanning** — PR reviews check for hardcoded secrets, SQL injection, XSS, path traversal

---

## 🎬 Demo Workflow: Self-Healing Pipeline

1. **Trigger**: User says `"Trigger test-pipeline with FAIL=true"`
2. **Detect**: Orchestrator polls Jenkins, detects `FAILURE`
3. **Analyze**: AI reads build logs + searches Confluence runbooks + queries AlloyDB RAG
4. **Fix**: Auto-generates corrected code, commits to `auto-fix/build-N` branch
5. **PR**: Creates Pull Request with full description
6. **Review**: AI posts code review + security scan as PR comment
7. **Merge**: High-confidence fixes (≥90%) auto-merge; others get Slack approve/reject buttons
8. **Close**: Jira ticket auto-closed with PR link
9. **Learn**: Incident stored in pgvector for future RAG; Runbook auto-generated
10. **Document**: Troubleshooting guide published to Confluence Wiki
11. **Schedule**: Post-mortem meeting auto-created on Google Calendar
12. **Notify**: Full summary sent to Slack channel

---

## 🚀 Quick Start

```bash
# Deploy the Orchestrator
cd orchestrator
gcloud builds submit --tag gcr.io/[PROJECT_ID]/devops-orchestrator
gcloud run deploy devops-orchestrator --image gcr.io/[PROJECT_ID]/devops-orchestrator \
    --set-env-vars "DATABASE_URL=postgresql+asyncpg://[USER]:[PASS]@[IP]/postgres"
```

---

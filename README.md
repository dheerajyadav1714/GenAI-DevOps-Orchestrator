<div align="center">

# ⚡ D.A.M.I — DevOps Autonomous Multi-agent Intelligence

### *One Prompt. Entire Infrastructure. Zero Toil.*

An **AI-powered, multi-agent platform** that autonomously designs cloud architectures, provisions infrastructure via Terraform, self-heals CI/CD pipelines, and orchestrates across **9+ enterprise tools** — all from a single natural language interface.

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-dami--ui-00C853?style=for-the-badge)](https://dami-ui-688623456290.us-central1.run.app)

[![Built on GCP](https://img.shields.io/badge/Built%20on-Google%20Cloud-4285F4?logo=google-cloud&logoColor=white)](https://cloud.google.com)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini%202.5-8E75B2?logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Cloud Run](https://img.shields.io/badge/Deployed%20on-Cloud%20Run-4285F4?logo=google-cloud&logoColor=white)](https://cloud.google.com/run)
[![MCP Architecture](https://img.shields.io/badge/Architecture-MCP%20Microservices-FF6F00)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Hackathon](https://img.shields.io/badge/Gen%20AI%20Academy-APAC%20Edition-E91E63)](https://hack2skill.com)

</div>

---

## 📋 Hackathon Submission

| Requirement | Link |
|:---|:---|
| **Cloud Run Deployment** | [https://dami-ui-688623456290.us-central1.run.app](https://dami-ui-688623456290.us-central1.run.app) |
| **GitHub Repository** | [https://github.com/dheerajyadav1714/D.A.M.I](https://github.com/dheerajyadav1714/D.A.M.I) |
| **Demo Video** | [Coming Soon](#) |

> **Problem Statement:** Build a multi-agent AI system that helps users manage tasks, schedules, and information by interacting with multiple tools and data sources.

---

## 🧠 What is D.A.M.I?

**D.A.M.I** (**D**evOps **A**utonomous **M**ulti-agent **I**ntelligence) is a production-grade, multi-agent AI system that autonomously manages the entire Software Development Lifecycle (SDLC). A single primary **Gemini-powered orchestrator** coordinates **6 specialized MCP sub-agents** to detect CI/CD failures, auto-fix code bugs, design cloud architectures, provision infrastructure, and manage the complete DevOps workflow — all through a natural language chat interface.

### The Key Innovation

**Self-healing CI/CD pipelines.** When a Jenkins build fails, D.A.M.I autonomously:

1. 🔍 Reads and analyzes build logs via the **Jenkins MCP**
2. 🧠 Searches past incidents via **RAG** (AlloyDB + pgvector) and **Confluence runbooks**
3. 🔧 Generates an AI-powered code fix with a **confidence score**
4. 📝 Creates a branch, commits, and opens a **Pull Request** via **GitHub MCP**
5. 🛡️ Runs an **AI security review** (hardcoded secrets, SQL injection, XSS)
6. ✅ **Auto-merges** if confidence ≥ 90%; sends **Slack approval buttons** if < 90%
7. 📋 Closes the **Jira ticket** and generates a **Confluence runbook**
8. 📅 Schedules a **post-mortem** on **Google Calendar**
9. 💾 Stores the fix as a **768-dim vector embedding** for future RAG retrieval

**Every resolved incident makes D.A.M.I smarter.** The system literally learns from experience.

```
"Design a HIPAA-compliant GKE architecture on GCP with Cloud SQL and 99.99% availability"
```

↓ D.A.M.I automatically:

✅ Runs a **multi-agent debate** (Architect → SecOps → FinOps) to design the optimal architecture  
✅ Generates a **Mermaid architecture diagram** with full network topology  
✅ Publishes the **architecture draft to Confluence** for team review  
✅ Waits for **human approval** (Human-in-the-Loop)  
✅ Generates **production-ready Terraform** code  
✅ Opens a **GitHub Pull Request** with the IaC  
✅ Creates a **Final Migration Runbook** in Confluence  
✅ Notifies the team on **Slack** at every stage  

---

## 🏛️ How D.A.M.I Meets the Hackathon Criteria

| Requirement | D.A.M.I Implementation |
|:---|:---|
| **Primary agent coordinating sub-agents** | Gemini 2.5 orchestrator coordinates 6 MCP sub-agents (Jenkins, GitHub, Jira, Slack, Calendar, Confluence) |
| **Store and retrieve structured data from a database** | AlloyDB PostgreSQL stores workflows, incidents, chat history, DORA metrics + pgvector for RAG semantic search |
| **Integrate multiple tools via MCP** | 6 independent MCP servers deployed as Cloud Run microservices |
| **Handle multi-step workflows** | Two-Pass Architecture (Plan → Execute → Synthesize) with up to 15-step autonomous workflows |
| **Deploy as an API-based system** | Full REST API with 10+ endpoints, deployed on Google Cloud Run |

---

## 🏗️ Multi-Agent Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         D.A.M.I ORCHESTRATOR                           │
│                    (Gemini 2.5 Pro + Flash)                            │
│                                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  🏗️ Principal │  │  🛡️ SecOps   │  │  💰 FinOps   │  │ 📐 Diagram │ │
│  │  Architect   │──▶│  Reviewer    │──▶│  Optimizer   │──▶│ Generator  │ │
│  │  (Design)    │  │  (Harden)    │  │  (Optimize)  │  │ (Visualize)│ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘ │
│         │                                                       │      │
│         ▼                                                       ▼      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │              HUMAN-IN-THE-LOOP APPROVAL GATEWAY                 │   │
│  │         (Review in UI → Approve → Auto-Provision)               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│         │                                                              │
│         ▼                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │
│  │ 📝 Terraform │  │ 🔀 GitHub PR │  │ 📚 Confluence│                 │
│  │  Generator   │──▶│  Creator     │──▶│  Runbook     │                │
│  └──────────────┘  └──────────────┘  └──────────────┘                 │
└─────────────────────────────────────────────────────────────────────────┘
         │           │           │           │           │
   ┌─────▼──┐  ┌─────▼──┐  ┌────▼───┐  ┌───▼────┐  ┌──▼──────┐  ┌──────────┐
   │Jenkins │  │GitHub  │  │ Jira   │  │ Slack  │  │Calendar │  │Confluence│
   │  MCP   │  │  MCP   │  │  MCP   │  │  MCP   │  │  MCP    │  │   MCP    │
   └────────┘  └────────┘  └────────┘  └────────┘  └─────────┘  └──────────┘
                                    │
                          ┌─────────▼──────────┐
                          │  AlloyDB PostgreSQL │
                          │  + pgvector (RAG)   │
                          └────────────────────┘
```

---

## ✨ Feature Matrix

### 🏗️ Cloud Architecture & Provisioning

| Feature | Description |
|:--------|:------------|
| **AI Architecture Design** | Describe requirements in plain English → get a full enterprise-grade GCP architecture |
| **Multi-Agent Debate** | Principal Architect designs → SecOps hardens → FinOps optimizes — 3 AI agents collaborate |
| **Mermaid Diagrams** | Auto-generated, color-coded architecture diagrams with network topology and CIDR ranges |
| **CSV Inventory Migration** | Upload a CSV of on-prem servers → AI maps each workload to optimal GCP services |
| **Terraform Generation** | Approved architectures auto-generate production-ready Terraform (VPC, GKE, Cloud SQL, IAM) |
| **GitHub PR Creation** | Terraform code committed to a feature branch with a Pull Request opened automatically |
| **Human-in-the-Loop** | Architectures require explicit human approval before any infrastructure is provisioned |
| **Confluence Documentation** | Hierarchical documentation: Architecture Draft → Final Migration Runbook |

### 🛡️ Self-Healing CI/CD (Autonomous SRE)

| Feature | Description |
|:--------|:------------|
| **Self-Healing Pipelines** | Detects Jenkins failures → diagnoses root cause → writes fix → creates PR → merges → restarts |
| **RAG-Powered Analysis** | Semantic search across past incidents (pgvector) + Confluence runbooks for context-aware fixes |
| **AI Code Review** | Reviews PRs for bugs, security vulnerabilities (secrets, SQL injection, XSS), and code quality |
| **Confidence-Based Merging** | ≥ 90% confidence: auto-merge. < 90%: Slack approval buttons for human review |
| **Auto Release Notes** | Fetches merged PRs + Jira tickets → synthesizes release notes → publishes to Confluence |
| **DORA Metrics** | Live dashboard tracking Deployment Frequency, Lead Time, MTTR, and Change Failure Rate |

### 🛠️ Developer Productivity

| Feature | Description |
|:--------|:------------|
| **Natural Language Ops** | Talk to your infrastructure: *"Show me build success rate for the last 7 days"* |
| **Jira Management** | Create, search (JQL), update tickets, assign to sprints — all via chat |
| **GitHub Operations** | Read files, list branches/PRs, create branches, commit code, merge PRs |
| **Slack Notifications** | Context-aware messages at every workflow stage with interactive buttons |
| **Calendar Scheduling** | Auto-schedule post-mortem meetings and deployment reviews |
| **Confluence Knowledge Search** | Query Wiki and vector store for past incidents and runbooks |
| **Chaos Engineering** | One-click chaos injection — inject bugs, trigger pipeline, watch self-healing in action |

---

## 🛠️ Technology Stack

| Layer | Technology |
|:------|:-----------|
| **AI Engine** | Gemini 2.5 Pro (deep architecture reasoning) + Gemini 2.5 Flash (speed & fallback) |
| **Smart Model Routing** | Complex tasks → Pro; routine tasks → Flash (automatic) |
| **Embeddings** | Vertex AI `text-embedding-005` (768 dimensions) |
| **Database** | AlloyDB PostgreSQL + `pgvector` for semantic search (RAG) |
| **Compute** | Google Cloud Run (serverless, auto-scaling, 9 services) |
| **IaC** | Terraform (auto-generated by AI) |
| **Secrets** | GCP Secret Manager (zero hardcoded credentials) |
| **Frontend** | Next.js 15 (React) — glassmorphism UI with dark/light mode |
| **Backend** | FastAPI (Python) — async, production-grade |
| **CI/CD** | Jenkins on GCE + GitHub |
| **Integrations** | 6 MCP microservices: Jenkins, GitHub, Jira, Slack, Calendar, Confluence |

---

## 📁 Repository Structure

```
D.A.M.I/
│
├── orchestrator/                  # 🧠 D.A.M.I Brain (~4,000 lines)
│   ├── main.py                   # Multi-agent orchestration, tool routing, RAG, Mermaid sanitization
│   ├── Dockerfile
│   └── requirements.txt
│
├── ui-v2/                         # 🎨 Next.js Frontend (Glassmorphism UI)
│   ├── app/
│   │   ├── page.js               # Main application shell
│   │   ├── layout.js             # Root layout with fonts and metadata
│   │   ├── globals.css           # Design system tokens
│   │   └── components/
│   │       ├── ChatView.js       # AI chat interface with Mermaid rendering
│   │       ├── AgentHubView.js   # Multi-agent visualization & quick actions
│   │       ├── DashboardView.js  # DORA metrics & system health
│   │       ├── ActivityFeedView.js # Live workflow step tracking
│   │       ├── EtherealSidebar.js # Responsive navigation sidebar
│   │       ├── SettingsPanel.js   # Configuration & preferences
│   │       ├── MetricsPanel.js   # Slide-in metrics detail
│   │       └── MegaMenu.js       # Protocol browser
│   ├── Dockerfile
│   └── package.json
│
├── mcp-servers/                   # 🔌 Model Context Protocol Microservices
│   ├── jenkins-mcp/              # Pipeline trigger, status, logs, failure detection
│   ├── github-mcp/               # PRs, commits, branches, code review
│   ├── jira-mcp/                 # Tickets, JQL search, sprint management
│   ├── slack-mcp/                # Notifications + interactive approve/reject
│   ├── calendar-mcp/             # Google Calendar event creation
│   └── confluence-mcp/           # Wiki pages (hierarchical) + CQL search (RAG)
│
├── DEPLOYMENT_GUIDE.md            # End-to-end deployment instructions
├── AI_FEATURES.md                 # Comprehensive AI capabilities document
├── DEMO_VIDEO_SCRIPT.md           # 3-minute hackathon demo script
├── SHOWCASE_VIDEO_SCRIPT.md       # Full showcase video script (no time limit)
├── LICENSE                        # MIT License with trademark protection
└── README.md                      # ← You are here
```

---

## 🔐 Security

- **Zero hardcoded credentials** — all tokens stored in GCP Secret Manager
- **IAM-based access** — Cloud Run service accounts with least-privilege roles
- **Two-project isolation** — MCP servers and secrets isolated from Orchestrator project
- **GitHub Push Protection** — repository-level secret scanning enabled
- **AI Security Scanning** — PR reviews check for hardcoded secrets, SQL injection, XSS, path traversal
- **Human-in-the-Loop** — no infrastructure is provisioned without explicit human approval
- **Confidence gating** — only high-confidence fixes (≥90%) auto-merge; others require human approval

---

## 🎬 Demo Scenarios

### Scenario 1: Self-Healing Pipeline (Chaos Engineering)

```
User: "Inject chaos into the repository dheerajyadav1714/ci_cd"

→ 🌪️ AI injects a realistic bug into src/bug.py
→ 🔨 Jenkins pipeline triggered automatically
→ 🔴 Build fails
→ 🔍 AI reads logs, extracts error signatures
→ 🧠 RAG searches past incidents + Confluence runbooks
→ 🔧 AI generates code fix (confidence: 95%)
→ 🔀 Branch created, code committed, PR opened
→ 🛡️ AI security review posted on PR
→ ✅ Auto-merged (≥90% confidence)
→ 📋 Jira ticket closed, Runbook published to Confluence
→ 📅 Post-mortem scheduled on Calendar
→ 💬 Team notified on Slack
→ 💾 Incident stored as vector embedding for future RAG

MTTR: ~60 seconds (vs 30-45 minutes manually)
```

### Scenario 2: End-to-End Cloud Architecture Provisioning

```
User: "Design a HIPAA-compliant telemedicine architecture on GCP with GKE, 
       Cloud SQL, and 99.99% availability for 20,000 concurrent users"

→ 🏗️ Principal Architect designs full architecture
→ 🛡️ SecOps Agent hardens security (VPC-SC, Cloud Armor, CMEK)
→ 💰 FinOps Agent optimizes costs (CUDs, Spot VMs, right-sizing)
→ 📐 Mermaid diagram auto-generated
→ 📚 Architecture Draft published to Confluence
→ ⏸️ AWAITING HUMAN APPROVAL in UI

User: Clicks "Approve" button

→ 📝 Terraform code generated (VPC, GKE, Cloud SQL, IAM, NAT)
→ 🔀 GitHub PR created on feature branch
→ ⚙️ CI/CD pipeline generated (Jenkinsfile)
→ 💰 Cost optimization applied to Kubernetes manifests
→ 📚 Final Migration Runbook published to Confluence
→ 💬 Slack notification sent to team
```

### Scenario 3: Multi-Tool Workflow

```
User: "Fix ticket SCRUM-11 in the ci_cd repo, review the PR, and notify Slack"

→ 📋 Reads Jira ticket for bug details
→ 📄 Reads source code from GitHub
→ 🔧 Generates AI-powered fix
→ 🔀 Creates branch, commits code, opens PR
→ 🛡️ Posts AI code review on PR
→ 💬 Sends Slack notification with fix summary
```

---

## 🚀 Deployment

All services run on **Google Cloud Run** (serverless) across two GCP projects:

| Project | Services |
|:---|:---|
| `gcp-experiments-490315` | D.A.M.I Orchestrator, D.A.M.I UI, AlloyDB |
| `genai-hackathon-491712` | 6 MCP Servers (Jenkins, GitHub, Jira, Slack, Calendar, Confluence), Jenkins VM |

```bash
# Deploy the Orchestrator
cd orchestrator
gcloud run deploy dami-orchestrator --source . \
    --region us-central1 --allow-unauthenticated \
    --cpu=2 --memory=2Gi --timeout=600

# Deploy the UI
cd ui-v2
gcloud run deploy dami-ui --source . \
    --region us-central1 --allow-unauthenticated \
    --cpu=2 --memory=2Gi --min-instances=1

# Deploy MCP Servers (repeat for each)
cd mcp-servers/github-mcp
gcloud run deploy github-mcp --source . \
    --region us-central1 --allow-unauthenticated
```

> 📘 For the complete step-by-step deployment guide, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## 📊 System Metrics

| Metric | Value |
|:-------|:------|
| **Orchestrator Lines of Code** | ~4,000 |
| **MCP Microservices** | 6 (Jenkins, GitHub, Jira, Slack, Calendar, Confluence) |
| **AI Agents** | 4 (Architect, SecOps, FinOps, Diagram Generator) |
| **Integrated Tools** | 9+ (Jenkins, GitHub, Jira, Slack, Calendar, Confluence, Terraform, AlloyDB, Vertex AI) |
| **Cloud Run Services** | 9 (Orchestrator + UI + 6 MCP + AlloyDB NL Query) |
| **AI Models** | Gemini 2.5 Pro + Gemini 2.5 Flash (smart routing) |
| **Vector Dimensions** | 768 (text-embedding-005) |
| **Database Tables** | 8 (auto-created on startup) |
| **Supported Prompts** | 59+ natural language commands |
| **Deployment Model** | Fully serverless (Google Cloud Run) |

---

## 📚 Documentation

| Document | Description |
|:---|:---|
| [AI_FEATURES.md](AI_FEATURES.md) | Comprehensive AI capabilities and functionality |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | End-to-end deployment from scratch |
| [DEMO_VIDEO_SCRIPT.md](DEMO_VIDEO_SCRIPT.md) | 3-minute hackathon demo script |
| [SHOWCASE_VIDEO_SCRIPT.md](SHOWCASE_VIDEO_SCRIPT.md) | Full showcase video script |

---

<div align="center">

**D.A.M.I — Built with ❤️ on Google Cloud Platform**

*Gen AI Academy APAC Edition — hack2skill*

*Because infrastructure shouldn't require a war room.*

© 2026 Dheeraj Yadav | [MIT License](LICENSE)

</div>

<div align="center">

# ⚡ D.A.M.I — DevOps Autonomous Multi-agent Intelligence

### *One Prompt. Entire Infrastructure. Zero Toil.*

An **AI-powered, multi-agent platform** that autonomously designs cloud architectures, provisions infrastructure via Terraform, self-heals CI/CD pipelines, and orchestrates across **9+ enterprise tools** — all from a single natural language interface.

[![Built on GCP](https://img.shields.io/badge/Built%20on-Google%20Cloud-4285F4?logo=google-cloud&logoColor=white)](https://cloud.google.com)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini%202.5-8E75B2?logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Cloud Run](https://img.shields.io/badge/Deployed%20on-Cloud%20Run-4285F4?logo=google-cloud&logoColor=white)](https://cloud.google.com/run)
[![MCP Architecture](https://img.shields.io/badge/Architecture-MCP%20Microservices-FF6F00)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

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

## ✨ AI Features & Capabilities

### 🧠 Core Intelligence
- **Two-Pass Workflow Engine**: Eliminates hallucination by separating the "Planning" pass (AI reasoning) from the "Execution" pass (actual API calls).
- **Smart Model Routing**: Automatically routes complex architectural tasks to Gemini 2.5 Pro, while using Gemini 2.5 Flash for speed-critical bug fixes.
- **RAG Pipeline (Retrieval-Augmented Generation)**: Uses AlloyDB with `pgvector` to store 768-dimensional embeddings of all past incidents. The system natively searches its own memory and your Confluence wiki to solve new bugs based on historical context.

### 🏗️ Cloud Architecture & Provisioning
- **AI Architecture Design**: Describe requirements in plain English ("telemedicine app for 20k users") → get a full enterprise-grade GCP architecture.
- **Multi-Agent Debate**: Three AI personas collaborate on design: Principal Architect (designs), SecOps Reviewer (hardens), and FinOps Optimizer (reduces cost).
- **Mermaid Diagrams**: Auto-generated, color-coded architecture diagrams with network topology and CIDR ranges.
- **CSV Inventory Migration**: Upload a CSV of on-prem servers → AI maps each workload to optimal GCP services.
- **Terraform Generation**: Approved architectures auto-generate production-ready Terraform (VPC, GKE, Cloud SQL, IAM).
- **Zero-Touch Provisioning**: Creates GitHub PRs with the IaC, generates CI/CD pipelines, and publishes Migration Runbooks.

### 🛡️ Self-Healing CI/CD (Autonomous SRE)
- **Autonomous Loop**: Detects Jenkins failures → diagnoses root cause → writes fix → creates PR → merges → restarts pipeline.
- **AI Code Review**: Scans PRs for hardcoded secrets, SQL injection, XSS, path traversal, and code quality issues.
- **Confidence-Based Merging**: High confidence fixes (≥90%) auto-merge; others generate Slack approval buttons for human review.
- **Human-in-the-Loop**: Absolute control. No infrastructure is provisioned without explicit human approval via the UI or Slack.
- **Auto Release Notes**: Fetches merged PRs + Jira tickets → synthesizes release notes → publishes to Confluence.
- **Chaos Engineering**: Built-in chaos injection mode to demonstrate the self-healing loop in live environments.

### 📊 Operations & Analytics
- **DORA Metrics Engine**: Live dashboard tracking Deployment Frequency, Lead Time, MTTR, and Change Failure Rate directly from database events.
- **Natural Language to SQL**: Talk to your database. ("What's our build success rate for the last 7 days?")
- **FinOps Optimization**: Analyzes Kubernetes manifests and generates PRs to right-size CPU/Memory limits based on best practices.

### 🛠️ Tool Integrations (MCP Microservices)
- **GitHub**: Read files, commit code, manage branches, create/merge PRs.
- **Jenkins**: Trigger builds, stream logs, detect failures.
- **Jira**: Create, update, assign, and search tickets (JQL).
- **Slack**: Send context-aware notifications and interactive approval buttons.
- **Confluence**: Query the wiki (RAG) and publish hierarchical runbooks.
- **Calendar**: Auto-schedule post-mortem meetings and deployment reviews.

---

## 🛠️ Technology Stack

| Layer | Technology |
|:------|:-----------|
| **AI Engine** | Gemini 2.5 Pro (deep architecture reasoning) + Gemini 2.5 Flash (speed & fallback) |
| **Embeddings** | Vertex AI `text-embedding-005` (768 dimensions) |
| **Database** | AlloyDB PostgreSQL + `pgvector` for semantic search (RAG) |
| **Compute** | Google Cloud Run (serverless, auto-scaling, 9 services) |
| **IaC** | Terraform (auto-generated by AI) |
| **Secrets** | GCP Secret Manager (zero hardcoded credentials) |
| **Frontend** | Next.js 15 (React) — glassmorphism UI with dark/light mode |
| **Backend** | FastAPI (Python) — async, production-grade |
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
└── LICENSE                        # MIT License with trademark protection
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

## 🎬 Example Scenarios

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

<div align="center">

**D.A.M.I — Built with ❤️ on Google Cloud Platform**

*Because infrastructure shouldn't require a war room.*

© 2026 Dheeraj Yadav | [MIT License](LICENSE)

</div>

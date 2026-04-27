<div align="center">

# ⚡ D.A.M.I — DevOps Autonomous Multi-agent Intelligence

### *One Prompt. Entire Infrastructure. Zero Toil.*

An **AI-powered, multi-agent platform** that autonomously designs cloud architectures, provisions infrastructure via Terraform, self-heals CI/CD pipelines, and orchestrates across **9+ enterprise tools** — all from a single natural language interface.

[![Built on GCP](https://img.shields.io/badge/Built%20on-Google%20Cloud-4285F4?logo=google-cloud&logoColor=white)](https://cloud.google.com)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini%202.5-8E75B2?logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Cloud Run](https://img.shields.io/badge/Deployed%20on-Cloud%20Run-4285F4?logo=google-cloud&logoColor=white)](https://cloud.google.com/run)
[![MCP Architecture](https://img.shields.io/badge/Architecture-MCP%20Microservices-FF6F00)](https://modelcontextprotocol.io)
[![D.A.M.I](https://img.shields.io/badge/Agent-D.A.M.I-00C853?style=flat&logo=robot&logoColor=white)](https://github.com/dheerajyadav1714/GenAI-DevOps-Orchestrator)

</div>

---

## 🧠 What is D.A.M.I?

**D.A.M.I** (**D**evOps **A**utonomous **M**ulti-agent **I**ntelligence) is an autonomous DevOps orchestrator that replaces manual infrastructure workflows with **AI-driven, multi-agent collaboration**. Instead of writing Terraform by hand, configuring CI/CD pipelines manually, or triaging incidents at 3 AM — you simply describe what you need in plain English.

**The AI handles the rest — end to end.**

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

## 🏛️ D.A.M.I Multi-Agent Architecture

D.A.M.I uses a **collaborative multi-agent system** where specialized AI personas debate and refine each design:

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
| **AI Architecture Design** | Describe your requirements in plain English → get a full enterprise-grade GCP architecture with networking, compute, databases, security, and monitoring |
| **Multi-Agent Debate** | Principal Architect designs → SecOps hardens → FinOps optimizes costs — 3 AI agents collaborate on every design |
| **Mermaid Diagrams** | Auto-generated, color-coded architecture diagrams with full network topology, CIDR ranges, and service connections |
| **CSV Inventory Migration** | Upload or reference a CSV of on-prem servers → AI maps each workload to optimal GCP managed services |
| **Terraform Generation** | Approved architectures automatically generate production-ready Terraform (VPC, GKE, Cloud SQL, IAM, etc.) |
| **GitHub PR Creation** | Terraform code is committed to a feature branch and a Pull Request is opened automatically |
| **Human-in-the-Loop** | Architecture designs require explicit human approval before any infrastructure is provisioned |
| **Confluence Documentation** | Hierarchical documentation: Parent Project Page → Architecture Draft → Final Migration Runbook |

### 🛡️ Self-Healing CI/CD (Autonomous SRE)

| Feature | Description |
|:--------|:------------|
| **Self-Healing Pipelines** | Detects Jenkins failures → diagnoses root cause via AI + RAG → writes code fix → creates PR → merges → restarts pipeline |
| **RAG-Powered Analysis** | Semantic search across past incidents (pgvector) + Confluence runbooks for context-aware remediation |
| **Auto Code Review** | AI reviews PRs for bugs, security vulnerabilities (hardcoded secrets, SQL injection, XSS), and code quality |
| **Auto Release Notes** | Fetches merged PRs + Jira tickets → synthesizes release notes → publishes to Confluence → notifies Slack |
| **DORA Metrics** | Live dashboard tracking Deployment Frequency, Lead Time, MTTR, and Change Failure Rate |

### 🛠️ Developer Productivity

| Feature | Description |
|:--------|:------------|
| **Natural Language Ops** | Talk to your infrastructure: *"Show me build success rate for the last 7 days"* → auto-generates SQL |
| **Jira Management** | Create, search (JQL), update tickets, assign to sprints — all via chat |
| **GitHub Operations** | Read files, list branches/PRs, create branches, commit code, merge PRs |
| **Slack Notifications** | Context-aware messages at every workflow stage |
| **Calendar Scheduling** | Auto-schedule post-mortem meetings and deployment reviews |
| **Knowledge Search** | Query Confluence Wiki and vector store for past incidents and runbooks |

---

## 🛠️ Technology Stack

| Layer | Technology |
|:------|:-----------|
| **AI Engine** | Gemini 2.5 Pro (architecture reasoning) + Gemini 2.5 Flash (fallback & speed) |
| **Embeddings** | Vertex AI `text-embedding-005` (768 dimensions) |
| **Database** | AlloyDB PostgreSQL + `pgvector` for semantic search (RAG) |
| **Compute** | Google Cloud Run (serverless, auto-scaling) |
| **IaC** | Terraform (auto-generated) |
| **Secrets** | GCP Secret Manager (zero hardcoded credentials) |
| **Frontend** | Next.js (React) — modern glassmorphism UI |
| **CI/CD** | Jenkins on GCE + GitHub Actions |
| **Integrations** | 6 MCP microservices: Jenkins, GitHub, Jira, Slack, Calendar, Confluence |

---

## 📁 Repository Structure

```
D.A.M.I/
│
├── orchestrator/                  # 🧠 D.A.M.I Brain (~4,000 lines)
│   ├── main.py                   # Multi-agent orchestration, tool routing, Mermaid sanitization
│   ├── Dockerfile
│   └── requirements.txt
│
├── ui-v2/                         # 🎨 Next.js Frontend (Glassmorphism UI)
│   ├── app/
│   │   ├── page.js               # Main application shell
│   │   └── components/
│   │       ├── ChatView.js       # AI chat interface with Mermaid rendering
│   │       ├── AgentHubView.js   # Multi-agent visualization
│   │       ├── DashboardView.js  # DORA metrics & system health
│   │       ├── SettingsPanel.js  # Configuration & preferences
│   │       └── ...
│   ├── package.json
│   └── Dockerfile
│
├── mcp-servers/                   # 🔌 Model Context Protocol Microservices
│   ├── jenkins-mcp/              # Pipeline trigger, status, logs, failure detection
│   ├── github-mcp/               # PRs, commits, branches, code review
│   ├── jira-mcp/                 # Tickets, JQL search, sprint management
│   ├── slack-mcp/                # Notifications + interactive approve/reject
│   ├── calendar-mcp/             # Google Calendar event creation
│   └── confluence-mcp/           # Wiki pages (hierarchical) + CQL search (RAG)
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
- **Human-in-the-Loop** — no infrastructure is provisioned without explicit human approval

---

## 🎬 Demo Scenarios

### Scenario 1: End-to-End Cloud Architecture Provisioning

```
User: "Design a HIPAA-compliant telemedicine architecture on GCP with GKE, 
       Cloud SQL, and 99.99% availability for 20,000 concurrent users"

→ 🏗️ Principal Architect designs full architecture
→ 🛡️ SecOps Agent hardens security (VPC-SC, Cloud Armor, CMEK)
→ 💰 FinOps Agent optimizes costs (CUDs, Spot VMs, right-sizing)
→ 📐 Mermaid diagram auto-generated
→ 📚 Architecture Draft published to Confluence
→ ⏸️ AWAITING HUMAN APPROVAL in UI

User: "Approve and provision this architecture"

→ 📝 Terraform code generated (VPC, GKE, Cloud SQL, IAM, NAT)
→ 🔀 GitHub PR created on feature branch
→ 📚 Final Migration Runbook published to Confluence
→ 💬 Slack notification sent to team
```

### Scenario 2: CSV-Based Migration

```
User: "Analyze inventory.csv from my repo and migrate to GCP"

→ 📊 AI reads CSV (hostnames, OS, CPU, RAM, roles)
→ 🗺️ Maps each workload: app-servers → GKE, db-master → Cloud SQL, cache → Memorystore
→ 🏗️ Full migration architecture designed with phased rollout
→ ⏸️ Awaits human approval before provisioning
```

### Scenario 3: Self-Healing Pipeline

```
User: "Trigger test-pipeline with FAIL=true"

→ 🔴 Jenkins build fails
→ 🔍 AI reads logs + searches RAG for similar past incidents
→ 🔧 Auto-generates code fix, commits to branch
→ 🔀 Creates PR with AI code review
→ ✅ High-confidence fixes auto-merge; others get Slack approve/reject
→ 📚 Runbook + post-mortem auto-generated
```

### Scenario 4: Discovery Mode

```
User: "Design a cloud architecture for a social media startup"

→ 🤔 AI detects vague requirements
→ ❓ Asks 10+ clarifying questions (scale, budget, compliance, regions...)
→ User provides answers
→ 🏗️ Full architecture designed based on answers
```

---

## 🚀 Deployment

All services run on **Google Cloud Run** (serverless):

```bash
# Deploy the Orchestrator
cd orchestrator
gcloud run deploy dami-orchestrator --source . \
    --region us-central1 --allow-unauthenticated

# Deploy the UI
cd ui-v2
gcloud run deploy dami-ui --source . \
    --region us-central1 --allow-unauthenticated

# Deploy MCP Servers (repeat for each)
cd mcp-servers/github-mcp
gcloud run deploy github-mcp --source . \
    --region us-central1 --allow-unauthenticated
```

---

## 📊 System Metrics

| Metric | Value |
|:-------|:------|
| **Orchestrator Lines of Code** | ~4,000 |
| **MCP Microservices** | 6 (Jenkins, GitHub, Jira, Slack, Calendar, Confluence) |
| **AI Agents** | 4 (Architect, SecOps, FinOps, Diagram Generator) |
| **Integrated Tools** | 9+ (Jenkins, GitHub, Jira, Slack, Calendar, Confluence, Terraform, AlloyDB, Vertex AI) |
| **Deployment Model** | Fully serverless (Cloud Run) |
| **AI Models Used** | Gemini 2.5 Pro + Gemini 2.5 Flash |

---

<div align="center">

**D.A.M.I — Built with ❤️ on Google Cloud Platform for the GenAI Hackathon**

*Because infrastructure shouldn't require a war room.*

</div>

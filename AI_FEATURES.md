<div align="center">

# 🧠 D.A.M.I — AI Features & Capabilities

### Complete Technical Guide to the AI Engine

</div>

---

## Table of Contents

1. [Multi-Agent Architecture](#1-multi-agent-architecture)
2. [Two-Pass Workflow Engine](#2-two-pass-workflow-engine)
3. [Smart Model Routing](#3-smart-model-routing)
4. [Self-Healing CI/CD Pipeline](#4-self-healing-cicd-pipeline)
5. [RAG Pipeline (Retrieval-Augmented Generation)](#5-rag-pipeline)
6. [Multi-Agent Architecture Debate](#6-multi-agent-architecture-debate)
7. [Human-in-the-Loop Approval Gateway](#7-human-in-the-loop-approval-gateway)
8. [AI Security Reviews](#8-ai-security-reviews)
9. [Chaos Engineering](#9-chaos-engineering)
10. [DORA Metrics Engine](#10-dora-metrics-engine)
11. [Natural Language to SQL](#11-natural-language-to-sql)
12. [Auto-Documentation & Release Notes](#12-auto-documentation--release-notes)
13. [FinOps Cost Optimization](#13-finops-cost-optimization)
14. [Tool Integration Matrix](#14-tool-integration-matrix)
15. [Prompt Catalog](#15-prompt-catalog)

---

## 1. Multi-Agent Architecture

D.A.M.I operates as a **coordinator-agent system** where one primary Gemini-powered orchestrator delegates tasks to 6 specialized MCP (Model Context Protocol) sub-agents. Each MCP server is an independent Cloud Run microservice with its own API surface.

### The Orchestrator (Primary Agent)

The orchestrator is a 4,000-line FastAPI application that:

- **Receives** natural language requests from the UI or webhooks
- **Plans** a sequence of tool calls using Gemini's reasoning capabilities
- **Executes** each tool call by routing to the appropriate MCP server
- **Synthesizes** results into a coherent, human-readable response
- **Stores** all workflow data in AlloyDB for auditing and RAG

### The 6 MCP Sub-Agents

| MCP Server | Capabilities | Key Endpoints |
|:---|:---|:---|
| **Jenkins MCP** | Trigger builds, read logs, check status, detect failures | `/trigger`, `/status/{job}/{build}`, `/logs/{job}/{build}`, `/lastfailed/{job}` |
| **GitHub MCP** | Read files, commit code, manage branches/PRs, merge | `/read`, `/commit`, `/create-pr`, `/merge-pr`, `/pr/comment` |
| **Jira MCP** | Create/update/search tickets, manage sprints | `/issue`, `/search`, `/update`, `/issue/{key}/sprint` |
| **Slack MCP** | Send messages, interactive approval buttons | `/send`, `/send-approval` |
| **Calendar MCP** | Create events (post-mortems, reviews) | `/create-event` |
| **Confluence MCP** | Search wiki (RAG), create/publish pages | `/search`, `/pages` |

### Why MCP?

The Model Context Protocol provides a **standard interface** for AI-to-tool communication. Each MCP server:

- Is **independently deployable** and scalable
- Has a **consistent REST API** surface
- Can be **swapped** without changing the orchestrator (e.g., replace GitHub MCP with GitLab MCP)
- Handles its **own authentication** via GCP Secret Manager

---

## 2. Two-Pass Workflow Engine

D.A.M.I uses a **Two-Pass Architecture** for every request:

```
Pass 1: PLANNING
  User Request → Gemini analyzes intent → Generates JSON execution plan
  (Which tools to call, in what order, with what parameters)

Pass 2: EXECUTION + SYNTHESIS
  For each step in the plan:
    → Resolve parameter placeholders from previous step results
    → Call the MCP server
    → Store the result in context
  
  After all steps:
    → Gemini synthesizes all results into a human-readable response
    → Response includes thinking steps, diffs, action cards, suggestions
```

### Why Two Passes?

**Anti-hallucination guarantee.** In Pass 1, the AI only *plans* — it doesn't fabricate data. In Pass 2, actual API calls provide **ground truth** data. The final response is generated from real data, not AI imagination.

### Placeholder Resolution

Steps can reference results from previous steps using placeholders:

```json
{
  "tool": "jira",
  "action": "create",
  "params": {
    "summary": "Fix for build #{{step1.build_number}}",
    "description": "{{step2.log_analysis}}"
  }
}
```

D.A.M.I includes a robust placeholder resolver that handles:
- `{{variable.path}}` notation
- `[[variable.path]]` notation (Gemini sometimes generates this)
- `PREVIOUS_STEP_RESULT.key` patterns
- Fallback heuristics for common LLM hallucination patterns

---

## 3. Smart Model Routing

D.A.M.I uses **two Gemini models** and automatically routes requests:

| Model | Use Case | Routing Trigger |
|:---|:---|:---|
| **Gemini 2.5 Pro** | Complex reasoning: architecture design, security audits, migration planning, postmortems | Keywords: `architect`, `design`, `migration`, `terraform`, `kubernetes`, `compliance` |
| **Gemini 2.5 Flash** | Speed-critical tasks: bug fixes, ticket creation, status checks, notifications | All other requests |

### Rate Limit Protection

- **Global semaphore**: Max 2 concurrent Gemini calls to prevent 429 rate limits
- **Exponential backoff**: Automatic retry with 2s, 4s, 8s delays on rate limits
- **Per-call timeout**: 25-second timeout with 3 retry attempts
- **Transient error handling**: Auto-retry on 500/503 server errors

---

## 4. Self-Healing CI/CD Pipeline

The flagship feature — a fully autonomous incident response loop:

```
Jenkins Build Fails
        │
        ▼
Webhook → D.A.M.I Orchestrator
        │
        ▼
┌─────────────────────────────┐
│  1. Read Build Logs          │ ← Jenkins MCP
│  2. Extract Error Signatures │ ← AI + Regex
│  3. Search Confluence        │ ← Confluence MCP (RAG)
│  4. Search Past Fixes        │ ← AlloyDB pgvector
│  5. Generate Code Fix        │ ← Gemini 2.5 Flash
│  6. Create Branch            │ ← GitHub MCP
│  7. Commit Fix               │ ← GitHub MCP
│  8. Create PR                │ ← GitHub MCP
│  9. AI Security Review       │ ← Gemini 2.5 Flash
│ 10. Auto-Merge (≥90%)        │ ← GitHub MCP
│ 11. Close Jira Ticket        │ ← Jira MCP
│ 12. Generate Runbook         │ ← Gemini + Confluence MCP
│ 13. Schedule Post-Mortem     │ ← Calendar MCP
│ 14. Notify Team              │ ← Slack MCP
│ 15. Store for RAG            │ ← AlloyDB pgvector
└─────────────────────────────┘
        │
        ▼
   Incident Resolved
   MTTR: ~60 seconds
```

### Confidence Scoring

Every fix receives a confidence score (0-100%):

| Score | Action | Reasoning |
|:---|:---|:---|
| 90-100% | **Auto-merge** + close Jira | Simple, obvious fix (null check, division by zero, missing import) |
| 70-89% | **Slack approval buttons** | Clear fix but needs review (logic change, API update) |
| 50-69% | **Slack notification only** | Likely fix but uncertain (complex logic, multiple causes) |
| <50% | **Human investigation** | Needs manual analysis |

---

## 5. RAG Pipeline

D.A.M.I implements **Retrieval-Augmented Generation** using AlloyDB with pgvector:

### How It Works

1. **Embedding Generation**: Every resolved incident is converted to a 768-dimensional vector using Vertex AI's `text-embedding-005` model
2. **Storage**: The vector, error signature, fix description, repo, and file path are stored in the `incident_embeddings` table
3. **Retrieval**: When a new error occurs, the error text is embedded and a cosine similarity search finds the top 3 most similar past incidents
4. **Augmentation**: The past fixes are injected into the Gemini prompt as additional context

### Dual RAG Sources

| Source | Type | Purpose |
|:---|:---|:---|
| **AlloyDB pgvector** | Vector embeddings (768-dim) | Semantic search across all past incidents |
| **Confluence Wiki** | Full-text CQL search | Internal runbooks, troubleshooting guides, team knowledge |

### Database Schema (Auto-Created)

| Table | Purpose |
|:---|:---|
| `workflows` | Workflow requests, status, JSON execution plans |
| `tool_calls` | Audit log of every MCP tool call |
| `incidents` | Incident tracking with MTTR, severity, confidence scores |
| `incident_embeddings` | pgvector 768-dim embeddings for RAG |
| `pending_fixes` | Queued code fixes awaiting approval |
| `runbooks` | Auto-generated troubleshooting documentation |
| `pipeline_runs` | Jenkins build history for DORA metrics |
| `chat_messages` | Persistent conversational memory |

---

## 6. Multi-Agent Architecture Debate

When designing cloud architectures, D.A.M.I orchestrates a **multi-agent debate** between specialized AI personas:

### The Debate Flow

1. **Principal Architect** (Gemini Pro) — Designs the initial architecture based on requirements: compute, networking, databases, monitoring, regions, CIDR ranges

2. **SecOps Reviewer** (Gemini Pro) — Reviews the design for security: VPC Service Controls, Cloud Armor, CMEK encryption, IAM least-privilege, network policies

3. **FinOps Optimizer** (Gemini Pro) — Optimizes costs: Committed Use Discounts, Spot VMs, right-sizing, auto-scaling recommendations, estimated monthly costs

4. **Diagram Generator** (Gemini Flash) — Produces a Mermaid.js diagram with:
   - Color-coded nodes (compute, database, security, monitoring)
   - Network topology with CIDR ranges
   - Service connections and data flows
   - Bulletproof sanitization (no syntax-breaking characters)

### Discovery Mode

If the user provides vague requirements, D.A.M.I enters **Discovery Mode**:

```
User: "Design a cloud architecture for a startup"

D.A.M.I: "I need more details. Please answer:
1. What type of application? (web, mobile, API, data pipeline)
2. Expected concurrent users?
3. Compliance requirements? (HIPAA, PCI-DSS, SOC2)
4. Budget constraints?
5. Preferred regions?
..."
```

---

## 7. Human-in-the-Loop Approval Gateway

D.A.M.I enforces **human approval checkpoints** for high-impact actions:

| Action | Approval Required? | Mechanism |
|:---|:---|:---|
| Architecture provisioning | ✅ Always | UI "Approve" button |
| PR merge (confidence < 90%) | ✅ Yes | Slack interactive buttons |
| PR merge (confidence ≥ 90%) | ❌ Auto-merges | Automatic |
| Jira ticket creation | ❌ Automatic | No approval needed |
| Slack notifications | ❌ Automatic | No approval needed |

### Post-Approval Workflow

When a user clicks "Approve" on an architecture design:

1. Terraform code is generated for all approved services
2. A GitHub PR is created with the `.tf` files
3. A CI/CD pipeline (Jenkinsfile) is generated
4. Kubernetes manifests are cost-optimized
5. A Migration Runbook is published to Confluence
6. The team is notified on Slack

---

## 8. AI Security Reviews

Every Pull Request gets an automated AI security review:

### What D.A.M.I Scans For

| Vulnerability | Detection Method |
|:---|:---|
| **Hardcoded Secrets** | API keys, passwords, tokens in source code |
| **SQL Injection** | Unsanitized user inputs in database queries |
| **XSS (Cross-Site Scripting)** | Unescaped HTML output |
| **Path Traversal** | File access patterns using `../` |
| **Insecure Dependencies** | Known CVEs in `requirements.txt` / `package.json` |
| **Infrastructure Misconfig** | Open ports, permissive IAM, public buckets |

### Review Output

```markdown
## AI Code Review (Gemini)

### Summary
Modified `src/bug.py` to add input validation for division operations.

### Code Quality: ✅ Good
- Proper error handling with try-except
- Input validation added

### Security: ✅ No Issues
- No hardcoded secrets detected
- No injection vulnerabilities

### Verdict: APPROVE ✅
```

---

## 9. Chaos Engineering

D.A.M.I includes a built-in **Chaos Engineering** mode for testing self-healing:

```
User: "Inject chaos into dheerajyadav1714/ci_cd"

→ AI generates a realistic but fixable bug
→ Commits the broken code to src/bug.py
→ Triggers the Jenkins pipeline
→ Pipeline fails
→ Self-healing loop activates automatically
→ Bug detected → Fix generated → PR created → Auto-merged
→ Full cycle completes in ~60 seconds
```

This creates a **closed-loop demonstration** perfect for live demos.

---

## 10. DORA Metrics Engine

D.A.M.I automatically calculates the **4 key DORA metrics**:

| Metric | Calculation | Source |
|:---|:---|:---|
| **Deployment Frequency** | Count of successful pipeline runs per week | `pipeline_runs` table |
| **Lead Time for Changes** | Time from commit to production deployment | Git timestamps + build duration |
| **Mean Time to Recovery (MTTR)** | `fixed_at - detected_at` per incident | `incidents` table |
| **Change Failure Rate** | Failed builds / total builds × 100 | `pipeline_runs` table |

### Performance Grading

| Grade | MTTR | Deploy Frequency |
|:---|:---|:---|
| **Elite** | < 1 hour | Multiple per day |
| **High** | < 1 day | Daily to weekly |
| **Medium** | < 1 week | Weekly to monthly |
| **Low** | > 1 month | Monthly or less |

---

## 11. Natural Language to SQL

Users can query the AlloyDB database using natural language:

```
"Show me all incidents with confidence score above 90"
→ SELECT * FROM incidents WHERE confidence_score > 90 ORDER BY detected_at DESC

"What's our build success rate for the last 7 days?"
→ SELECT COUNT(*) FILTER (WHERE status = 'SUCCESS') * 100.0 / COUNT(*) 
   FROM pipeline_runs WHERE created_at > NOW() - INTERVAL '7 days'

"Show me the average MTTR"
→ SELECT AVG(mttr_seconds) / 60.0 AS avg_mttr_minutes FROM incidents WHERE status = 'fixed'
```

The AI generates SQL from natural language, executes it against AlloyDB, and formats the results into readable tables.

---

## 12. Auto-Documentation & Release Notes

### Release Notes Generation

```
User: "Generate release notes for v1.0.0"

→ Fetches all merged PRs from GitHub
→ Cross-references linked Jira tickets
→ AI synthesizes structured release notes:
    - New Features
    - Bug Fixes
    - Security Patches
    - Breaking Changes
→ Publishes to Confluence Wiki
→ Sends summary to Slack
```

### Repository Documentation

```
User: "Generate API documentation for dheerajyadav1714/ci_cd"

→ Reads repository structure
→ Analyzes source code files
→ Generates comprehensive docs
→ Creates PR with documentation
```

---

## 13. FinOps Cost Optimization

D.A.M.I includes a **FinOps optimization agent** that:

1. **Analyzes** Kubernetes manifests for over-provisioning
2. **Right-sizes** CPU/Memory limits based on best practices
3. **Recommends** cost savings (Spot VMs, CUDs, auto-scaling)
4. **Generates** optimized YAML files
5. **Creates** a PR with the changes

```
User: "Optimize kubernetes/deployment.yaml in ci_cd for cost"

→ Reads the YAML file
→ Identifies over-provisioned resources
→ Generates optimized manifest
→ Creates PR: "FinOps: Right-size Kubernetes resources"
→ Estimated savings: $X/month
```

---

## 14. Tool Integration Matrix

### Complete Capability Map

| Tool | Create | Read | Update | Delete | Search | Execute |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Jenkins** | - | ✅ Logs | - | - | - | ✅ Trigger |
| **GitHub** | ✅ Branch, PR, Commit | ✅ Files, PRs | ✅ Merge | - | ✅ List | ✅ Review |
| **Jira** | ✅ Tickets | ✅ Details | ✅ Status, Comment | - | ✅ JQL | ✅ Sprint |
| **Slack** | ✅ Messages | - | - | - | - | ✅ Approval |
| **Calendar** | ✅ Events | - | - | - | - | - |
| **Confluence** | ✅ Pages | - | - | - | ✅ CQL | - |
| **AlloyDB** | ✅ Records | ✅ Query | ✅ Status | ✅ Clear | ✅ Vector | - |
| **Terraform** | ✅ Generate | - | - | - | - | - |
| **Vertex AI** | - | - | - | - | - | ✅ Embed |

---

## 15. Prompt Catalog

D.A.M.I understands **59+ natural language commands** across 10 categories:

### Quick Reference

| Category | Example Prompt |
|:---|:---|
| **Jira** | `Create a bug ticket in SCRUM: API returns 500 on /users endpoint` |
| **GitHub** | `Show me the contents of src/bug.py in the ci_cd repo` |
| **Jenkins** | `Trigger test-pipeline with FAIL=true` |
| **Self-Healing** | `Fix ticket SCRUM-11 in the ci_cd repo` |
| **Slack** | `Notify the team on Slack that SCRUM-11 has been resolved` |
| **Calendar** | `Schedule a post-mortem meeting for tomorrow at 3pm` |
| **Confluence** | `Search Confluence for MemoryError troubleshooting` |
| **RAG** | `Search for similar past incidents about "ZeroDivisionError"` |
| **Release Notes** | `Generate release notes for v1.0.0` |
| **Architecture** | `Design a HIPAA-compliant GKE architecture on GCP` |
| **Database** | `What's our build success rate for the last 7 days?` |
| **FinOps** | `Optimize kubernetes/deployment.yaml for cost` |
| **Multi-Tool** | `Fix the bug, create a PR, review it, and notify Slack` |

> **Tip:** You don't need exact syntax — D.A.M.I understands natural language. "Show tickets" and "List all Jira issues" both work.

---

<div align="center">

*D.A.M.I — DevOps Autonomous Multi-agent Intelligence*

*© 2026 Dheeraj Yadav*

</div>

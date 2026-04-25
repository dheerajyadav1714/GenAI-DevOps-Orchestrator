# Autonomous DevOps Orchestrator — Complete E2E Test Plan

> **Instructions:** Open the UI, go to Focused Chat, paste each prompt one-by-one.  
> Mark each test: ✅ Pass | ❌ Fail | ⏭️ Skipped  
> At the end, we fix all failures together.

**UI:** https://devops-ai-ui-v3-688623456290.us-central1.run.app/

---

## 1. JIRA — Ticket Management

### Search & List Tickets
| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 1.1 | `Show all tickets in SCRUM project` | | |
| 1.2 | `Show all open tickets in SCRUM project` | | |
| 1.3 | `List all bugs in SCRUM project` | | |
| 1.4 | `Show tickets assigned to me in SCRUM` | | |
| 1.5 | `Show all in-progress tickets` | | |
| 1.6 | `Show done/completed tickets in SCRUM` | | |

### Get Specific Ticket
| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 1.7 | `Show details of SCRUM-11` | | |

### Create Ticket
| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 1.8 | `Create a Jira ticket in SCRUM project: Fix login page CSS alignment issue` | | |
| 1.9 | `Create a bug ticket in SCRUM: API returns 500 on /users endpoint when payload is empty` | | |

### Update Ticket
| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 1.10 | `Update SCRUM-11 status to In Progress` | | |
| 1.11 | `Mark SCRUM-43 as Done` | | |
| 1.12 | `Add a comment to SCRUM-11: Working on the fix, PR will be ready by EOD` | | |

### Sprint Management
| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 1.13 | `Assign SCRUM-11 to Sprint 1` | | |

---

## 2. GITHUB — Code & PR Operations

### Read Files
| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 2.1 | `Show me the contents of src/bug.py in the ci_cd repo` | | |
| 2.2 | `Read README.md from dheerajyadav1714/ci_cd` | | |

### List Files & Branches
| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 2.3 | `List all files in the ci_cd repo` | | |
| 2.4 | `List all branches in ci_cd repo` | | |

### Pull Requests
| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 2.5 | `List all open PRs in ci_cd repo` | | |
| 2.6 | `List all closed PRs in ci_cd repo` | | |

### AI Code Review
| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 2.7 | `Review PR #18 in ci_cd repo` | | |

---

## 3. JENKINS — CI/CD Pipelines

### Trigger Builds
| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 3.1 | `Trigger test-pipeline` | | |
| 3.2 | `Trigger test-pipeline with FAIL=true` | | |

### Check Build Status
| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 3.3 | `What's the status of test-pipeline build #96?` | | |

### Read Build Logs
| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 3.4 | `Show logs for test-pipeline build #96` | | |

### Last Failed Build
| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 3.5 | `Show the last failed build of test-pipeline` | | |

---

## 4. SELF-HEALING — Autonomous Remediation

### Manual Log Analysis
| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 4.1 | `Analyze this log: Traceback (most recent call last): File "src/bug.py", line 5, in <module> result = 10 / 0 ZeroDivisionError: division by zero` | | |
| 4.2 | `Analyze this error: ModuleNotFoundError: No module named 'fastapi'` | | |

### AI-Powered Bug Fix
| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 4.3 | `Fix ticket SCRUM-11 in the ci_cd repo` | | |

### Chaos Engineering (Full Auto-Heal Loop)
| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 4.4 | `Inject chaos into dheerajyadav1714/ci_cd — break src/bug.py and test self-healing` | | |

> **What to verify for 4.4:**  
> - [ ] Bug injected into src/bug.py  
> - [ ] Jenkins pipeline triggered  
> - [ ] Pipeline fails  
> - [ ] Webhook fires to orchestrator  
> - [ ] SRE agent detects failure in Activity Feed  
> - [ ] Jira incident ticket created  
> - [ ] Fix PR opened automatically  
> - [ ] Slack notification sent  

---

## 5. SLACK — Notifications

| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 5.1 | `Send a message to Slack: Build test-pipeline #97 passed successfully` | | |
| 5.2 | `Notify the team on Slack that SCRUM-11 has been resolved` | | |
| 5.3 | `Tell the team on Slack: Deployment v1.0.0 is live` | | |

---

## 6. GOOGLE CALENDAR — Scheduling

| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 6.1 | `Schedule a deployment review meeting for tomorrow at 2pm` | | |
| 6.2 | `Schedule a post-mortem meeting for April 28 at 3pm to 4pm` | | |

---

## 7. CONFLUENCE — Knowledge Base

| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 7.1 | `Search Confluence for MemoryError troubleshooting` | | |
| 7.2 | `Search our wiki for Jenkins pipeline best practices` | | |

---

## 8. RAG — Past Incidents & Vector Search

| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 8.1 | `Search for similar past incidents about divide by zero error` | | |
| 8.2 | `Have we seen a MemoryError like this before?` | | |
| 8.3 | `Find past fixes for Jenkins build failures` | | |
| 8.4 | `Show me all runbooks` | | |

---

## 9. RELEASE NOTES — Auto-Generation

| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 9.1 | `Generate release notes for v1.0.0` | | |
| 9.2 | `Generate release notes for v2.0.0 of ci_cd repo` | | |

---

## 10. DATABASE — Natural Language Queries

| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 10.1 | `Show me all workflows` | | |
| 10.2 | `How many incidents have we had?` | | |
| 10.3 | `What's the average MTTR?` | | |
| 10.4 | `Show me the last 5 failed builds` | | |
| 10.5 | `Show all incidents with confidence score above 90` | | |
| 10.6 | `Show me pipeline runs where duration was more than 60 seconds` | | |

---

## 11. CLOUD MIGRATION & ARCHITECTURE

| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 11.1 | `Design a cloud-native architecture for an e-commerce app on GCP` | | |
| 11.2 | `Read the file ci_cd/inventory.csv from dheerajyadav1714/ci_cd and design a cloud migration plan to GCP` | | |

> **What to verify for 11.2:**  
> - [ ] Multi-agent debate triggered (Architect, SecOps, FinOps)  
> - [ ] Mermaid diagram generated  

---

## 12. FINOPS — Cost Optimization

| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 12.1 | `Optimize kubernetes/deployment.yaml in dheerajyadav1714/ci_cd for cost` | | |

---

## 13. AUTO-DOCUMENTATION

| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 13.1 | `Generate API documentation for dheerajyadav1714/ci_cd` | | |
| 13.2 | `Create Architecture docs for ci_cd repo` | | |

---

## 14. AGILE & SPRINT MANAGEMENT

| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 14.1 | `Generate a sprint health report for SCRUM project` | | |
| 14.2 | `Generate a Jira ticket in SCRUM project: As a user I want to reset my password via email` | | |

---

## 15. GCP RESOURCE EXPLORER

| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 15.1 | `List all Cloud Run services in GCP` | | |

---

## 16. DORA METRICS

| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 16.1 | `Show me the DORA metrics` | | |
| 16.2 | `What is our current Deployment Frequency and MTTR?` | | |

---

## 17. PIPELINE GENERATION

| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 17.1 | `Generate a CI/CD Jenkinsfile for dheerajyadav1714/ci_cd` | | |

---

## 18. TEST GENERATION

| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 18.1 | `Generate pytest tests for src/bug.py in dheerajyadav1714/ci_cd` | | |

---

## 19. SECURITY SCANNING

| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 19.1 | `Scan dependencies in dheerajyadav1714/ci_cd for vulnerabilities` | | |

---

## 20. POSTMORTEM

| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 20.1 | `Generate a postmortem for the recent Jenkins pipeline failure in dheerajyadav1714/ci_cd` | | |

---

## 21. ADVANCED — Multi-Tool Combos

| # | Prompt | Result | Notes |
|---|--------|--------|-------|
| 21.1 | `Fix ticket SCRUM-11 in the ci_cd repo, create a PR, review it, and notify the team on Slack` | | |
| 21.2 | `Jenkins build test-pipeline #96 failed. Analyze the failure, create a Jira ticket, and notify Slack` | | |
| 21.3 | `Show all open tickets and assign SCRUM-43 to Sprint 2` | | |
| 21.4 | `Review PR #18 in ci_cd repo and send the review summary to Slack` | | |
| 21.5 | `Generate release notes for v1.0.0, publish to Confluence, and notify Slack` | | |
| 21.6 | `Show the last failed build of test-pipeline, analyze the logs, and create a Jira ticket for the fix` | | |
| 21.7 | `Search for past incidents similar to "ModuleNotFoundError" and show me related runbooks` | | |

---

## 22. UI VERIFICATION (Manual Check)

| # | Check | Result | Notes |
|---|-------|--------|-------|
| 22.1 | Dashboard — DORA metrics cards showing numbers | | |
| 22.2 | Dashboard — Agent Fleet cards showing 8 agents ONLINE | | |
| 22.3 | Agent Hub — All 8 agent cards with quick actions | | |
| 22.4 | Activity Feed — Shows workflow steps after running prompts | | |
| 22.5 | Chat — Robot icon fully visible (not cut off) | | |
| 22.6 | Sidebar — Tooltips only appear on hover, not on active | | |
| 22.7 | Sidebar — Settings gear and profile avatar at bottom | | |
| 22.8 | Header — "DevOps AI" title not cut off at top | | |
| 22.9 | Mermaid diagrams render visually in chat | | |
| 22.10 | Dark/Light mode toggle in Settings panel | | |

---

## Summary

| Category | Total Tests | ✅ Pass | ❌ Fail | ⏭️ Skip |
|----------|-------------|---------|---------|----------|
| Jira | 13 | | | |
| GitHub | 7 | | | |
| Jenkins | 5 | | | |
| Self-Healing | 4 | | | |
| Slack | 3 | | | |
| Calendar | 2 | | | |
| Confluence | 2 | | | |
| RAG | 4 | | | |
| Release Notes | 2 | | | |
| Database | 6 | | | |
| Architecture | 2 | | | |
| FinOps | 1 | | | |
| Auto-Docs | 2 | | | |
| Agile/Sprint | 2 | | | |
| GCP Explorer | 1 | | | |
| DORA Metrics | 2 | | | |
| Pipeline Gen | 1 | | | |
| Test Gen | 1 | | | |
| Security | 1 | | | |
| Postmortem | 1 | | | |
| Multi-Tool | 7 | | | |
| UI Checks | 10 | | | |
| **TOTAL** | **79** | | | |

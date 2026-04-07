import streamlit as st
import requests
import time
import json

ORCHESTRATOR_URL = "https://devops-orchestrator-688623456290.us-central1.run.app"

st.set_page_config(page_title="DevOps Assistant", page_icon="🤖", layout="wide")

# Custom CSS for Maximum Clarity (Light Mode)
st.markdown("""
<style>
    /* Global Background reset to white */
    .main, .stApp {
        background-color: #ffffff !important;
        color: #1a1a1a !important;
    }
    
    /* Header Styling */
    h1, h2, h3, h4, h5 {
        color: #1a1a1a !important;
        font-weight: 800 !important;
    }
    
    /* Chat Message Bubbles - High Contrast */
    [data-testid="stChatMessage"] {
        background-color: #f1f5f9 !important;
        border-radius: 12px !important;
        border: 1px solid #e2e8f0 !important;
        padding: 15px !important;
        margin-bottom: 12px !important;
    }
    
    [data-testid="stChatMessage"] p, [data-testid="stChatMessage"] li {
        color: #1e293b !important;
        font-size: 1.05rem !important;
        line-height: 1.6 !important;
    }
    
    /* Metadata and icons */
    [data-testid="stChatMessageContent"] {
        color: #1e293b !important;
    }
    
    /* Sidebar reset */
    [data-testid="stSidebar"] {
        background-color: #f8fafc !important;
        border-right: 1px solid #e2e8f0 !important;
    }
    
    /* Input Box styling */
    [data-testid="stChatInput"] {
        border-top: 1px solid #e2e8f0 !important;
        background-color: #ffffff !important;
    }
</style>
""", unsafe_allow_html=True)

st.title("🤖 DevOps Multi-Agent Assistant")
st.markdown("##### Autonomous Incident Remediation & CI/CD Orchestration")

# Load chat history from DB on first load
if "messages" not in st.session_state:
    st.session_state.messages = []
    try:
        resp = requests.get(f"{ORCHESTRATOR_URL}/messages", params={"user_id": "ui_user", "limit": 50}, timeout=5)
        if resp.status_code == 200:
            saved = resp.json().get("messages", [])
            if saved:
                st.session_state.messages = saved
    except:
        pass

# Sidebar: Clear chat button
with st.sidebar:
    if st.button("🗑️ Clear Chat History"):
        try:
            requests.delete(f"{ORCHESTRATOR_URL}/messages", params={"user_id": "ui_user"}, timeout=5)
        except:
            pass
        st.session_state.messages = []
        st.rerun()

for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

def format_step(step):
    tool = step.get("tool")
    if tool == "jira":
        action = step.get("action")
        if action == "search_issues":
            return "⏳ Searching Jira issues..."
        elif action == "create_issue":
            return "⏳ Creating Jira ticket..."
        elif action == "get_issue":
            return "⏳ Fetching Jira ticket..."
        elif action == "assign_to_sprint":
            return "⏳ Assigning to sprint..."
        else:
            return "⏳ Jira operation..."
    elif tool == "slack":
        return "⏳ Sending Slack notification..."
    elif tool == "jenkins":
        return "⏳ Triggering Jenkins job..."
    elif tool == "github":
        action = step.get("action")
        if action == "read":
            return "⏳ Reading file from GitHub..."
        elif action == "create_branch":
            return "⏳ Creating branch..."
        elif action == "commit":
            return "⏳ Committing changes..."
        elif action == "create_pr":
            return "⏳ Creating pull request..."
        elif action == "merge_pr":
            return "⏳ Merging pull request..."
        else:
            return "⏳ GitHub operation..."
    elif tool == "calendar":
        return "⏳ Creating calendar event..."
    elif tool == "code":
        return "⏳ Generating code fix with AI..."
    elif tool == "log_analysis":
        return "⏳ Analyzing logs with AI..."
    elif tool == "database":
        return "⏳ Querying database..."
    elif tool == "reply":
        return None
    return None

def format_result(step):
    tool = step.get("tool") or "unknown"
    action = step.get("action") or "task"
    params = step.get("params", {})
    result = step.get("result", {})
    text = params.get("text", "")

    if tool == "reply":
        return text

    # Helper to clean up results
    if isinstance(result, str):
        try: result = json.loads(result)
        except: pass

    # If result is a list (e.g., jira.search_issues returns raw list), handle it before calling .get()
    if isinstance(result, list):
        if tool == "jira" and action == "search_issues":
            return f"✅ **Jira Search**: Found {len(result)} issues."
        if tool == "github" and action == "list_prs":
            return f"✅ **GitHub PRs**: Found {len(result)} pull requests."
        if tool == "github" and action == "list_branches":
            return f"✅ **GitHub Branches**: Found {len(result)} branches."
        return f"✅ **{tool.capitalize()} {action}**: {len(result)} results"

    # At this point result should be a dict (or something with .get)
    if not isinstance(result, dict):
        return f"✅ **{tool.capitalize()} {action}** completed"

    if tool == "jira":
        key = result.get("key") or result.get("issue_key")
        summary = result.get("summary") or params.get("summary", "")
        if action == "create_issue":
            return f"✅ **Jira Ticket Created**: [{key}](https://genai-hackathon.atlassian.net/browse/{key}) - {summary}"
        if action == "search_issues":
            count = result.get("count", 0)
            return f"✅ **Jira Search**: Found {count} issues."
        if key:
            return f"✅ **Jira {action}**: {key}"

    if tool == "jenkins":
        bn = result.get("build_number")
        job = params.get("job_name")
        res = result.get("result", "")
        if action == "trigger" and bn:
            return f"✅ **Jenkins Build #{bn}** triggered for `{job}`"
        if res:
            return f"✅ **Jenkins Build #{bn}** finished with `{res}`"

    if tool == "github":
        pr = result.get("pr_number") or result.get("number")
        repo = params.get("repo", "")
        if action == "create_pr" and pr:
            return f"✅ **GitHub PR #{pr}** created in `{repo}`"
        if action == "review_pr":
            return f"✅ **GitHub Review** posted on PR #{pr}"

    if tool == "log_analysis":
        analysis = result.get("analysis", "")
        if analysis:
            summary = analysis.split("\n")[0].replace("Summary:", "").strip()
            return f"🔬 **Log Analysis**: {summary[:150]}..."

    if tool == "slack":
        return f"💬 **Slack Message** sent to `{params.get('channel', 'default')}`"

    if tool == "calendar":
        return "📅 **Calendar Event** added to your schedule"

    if tool == "code":
        return "🤖 **AI Code Fix** generated for the detected issue"

    if tool == "database":
        return f"🗄️ **Database Query** executed: `{params.get('question', 'Query')[:50]}...`"

    if tool == "rag":
        count = result.get("count", 0)
        if action == "search":
            return f"🔍 **RAG Search**: Found {count} similar past incidents."
        if action == "runbooks":
            rbs = result.get("runbooks", [])
            return f"📝 **Runbooks**: Found {len(rbs)} runbooks."

    return f"✅ **{tool.capitalize()} {action}** completed"

if prompt := st.chat_input("What would you like to do?"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    try:
        requests.post(f"{ORCHESTRATOR_URL}/messages", json={"user_id": "ui_user", "role": "user", "content": prompt}, timeout=3)
    except:
        pass

    with st.chat_message("user"):
        st.markdown(prompt)

    # Assistant message starts immediately
    with st.chat_message("assistant"):
        placeholder = st.empty()
        displayed_output = []
        placeholder.markdown("🚀 Starting workflow...")

        try:
            resp = requests.post(f"{ORCHESTRATOR_URL}/run", json={"request": prompt, "user_id": "ui_user"}, timeout=120)
            resp.raise_for_status()
            workflow_id = resp.json()["workflow_id"]

            placeholder.markdown("⏳ Initializing agents...")
            
            workflow_data = None
            max_wait = 180
            poll_interval = 2
            for i in range(max_wait // poll_interval):
                time.sleep(poll_interval)
                try:
                    status_resp = requests.get(f"{ORCHESTRATOR_URL}/workflow/{workflow_id}", timeout=15)
                    status_resp.raise_for_status()
                    workflow_data = status_resp.json()
                    status = workflow_data.get("status", "unknown")
                    
                    # Update dots
                    dots = "." * ((i % 3) + 1)
                    placeholder.markdown(f"⏳ Processing{dots} ({i * poll_interval}s)")

                    if status in ["completed", "failed"]:
                        break
                except:
                    continue

            if not workflow_data or workflow_data.get("status") not in ["completed", "failed"]:
                displayed_output.append("⏰ Workflow is still running. Check Slack for updates.")
            elif workflow_data.get("status") == "failed":
                displayed_output.append("❌ Workflow execution encountered an issue.")
            else:
                plan = workflow_data.get("plan", [])
                steps = plan if isinstance(plan, list) else json.loads(plan)
                if not steps:
                    displayed_output.append("No actions performed.")
                else:
                    for idx, step in enumerate(steps):
                        step_msg = format_step(step)
                        if step_msg:
                            displayed_output.append(step_msg)
                            placeholder.markdown("\n\n".join(displayed_output), unsafe_allow_html=True)
                            time.sleep(0.3)
                        
                        result_msg = format_result(step)
                        if step_msg:
                            displayed_output[-1] = result_msg
                        else:
                            displayed_output.append(result_msg)
                        placeholder.markdown("\n\n".join(displayed_output), unsafe_allow_html=True)

                if steps and any(step.get("tool") != "reply" for step in steps):
                    displayed_output.append("🎉 Workflow completed successfully")

            final_text = "\n\n".join(displayed_output)
            placeholder.markdown(final_text, unsafe_allow_html=True)
            st.session_state.messages.append({"role": "assistant", "content": final_text})
            # Orchestrator securely saves this to DB autonomously now

        except Exception as e:
            error_msg = f"❌ Error: {e}"
            st.error(error_msg)
            st.session_state.messages.append({"role": "assistant", "content": error_msg})
    
    st.rerun() # Refresh to solidify history after the long-running task

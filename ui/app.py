import streamlit as st
import requests
import time
import json

ORCHESTRATOR_URL = "https://devops-orchestrator-688623456290.us-central1.run.app"

st.set_page_config(page_title="DevOps Assistant", page_icon="🤖", layout="wide")

st.markdown("""
<style>
    .main, .stApp {
        background-color: #ffffff !important;
        color: #1a1a1a !important;
    }
    h1, h2, h3, h4, h5 {
        color: #1a1a1a !important;
        font-weight: 800 !important;
    }
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
    [data-testid="stChatMessageContent"] {
        color: #1e293b !important;
    }
    [data-testid="stSidebar"] {
        background-color: #f8fafc !important;
        border-right: 1px solid #e2e8f0 !important;
    }
    [data-testid="stChatInput"] {
        border-top: 1px solid #e2e8f0 !important;
        background-color: #ffffff !important;
    }
</style>
""", unsafe_allow_html=True)

st.title("🤖 DevOps Multi-Agent Assistant")
st.markdown("##### Autonomous Incident Remediation & CI/CD Orchestration")


# ========== HELPERS ==========

def safe_parse_plan(raw_plan):
    if raw_plan is None:
        return []
    if isinstance(raw_plan, list):
        return raw_plan
    if isinstance(raw_plan, str):
        try:
            parsed = json.loads(raw_plan)
            return parsed if isinstance(parsed, list) else []
        except Exception:
            return []
    return []


def format_result(step):
    tool = step.get("tool") or "unknown"
    action = step.get("action") or "task"
    params = step.get("params", {})
    result = step.get("result", {})

    if tool == "reply":
        return params.get("text", "")

    if isinstance(result, str):
        try:
            result = json.loads(result)
        except Exception:
            pass

    if isinstance(result, list):
        if tool == "jira" and action == "search_issues":
            return f"✅ **Jira Search**: Found {len(result)} issues."
        if tool == "github" and action == "list_prs":
            return f"✅ **GitHub PRs**: Found {len(result)} pull requests."
        if tool == "github" and action == "list_branches":
            return f"✅ **GitHub Branches**: Found {len(result)} branches."
        return f"✅ **{tool.capitalize()} {action}**: {len(result)} results"

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
        return f"💬 **Slack Message** sent"

    if tool == "calendar":
        return "📅 **Calendar Event** added to your schedule"

    if tool == "code":
        return "🤖 **AI Code Fix** generated for the detected issue"

    if tool == "database":
        return f"🗄️ **Database Query** executed"

    if tool == "rag":
        count = result.get("count", 0) if isinstance(result, dict) else 0
        if action == "search":
            return f"🔍 **RAG Search**: Found {count} similar past incidents."
        if action == "runbooks":
            rbs = result.get("runbooks", []) if isinstance(result, dict) else []
            return f"📝 **Runbooks**: Found {len(rbs)} runbooks."

    return f"✅ **{tool.capitalize()} {action}** completed"


def run_workflow_and_wait(prompt):
    """Submit a workflow and poll until it completes. Returns the final response string."""
    try:
        resp = requests.post(
            f"{ORCHESTRATOR_URL}/run",
            json={"request": prompt, "user_id": "ui_user"},
            timeout=120
        )
        resp.raise_for_status()
        workflow_id = resp.json()["workflow_id"]
    except Exception as e:
        return f"❌ Failed to start workflow: {e}"

    # Poll until done (max 3 minutes)
    for _ in range(90):
        time.sleep(2)
        try:
            poll = requests.get(f"{ORCHESTRATOR_URL}/workflow/{workflow_id}", timeout=15)
            poll.raise_for_status()
            data = poll.json()

            if data.get("status") in ["completed", "failed"]:
                steps = safe_parse_plan(data.get("plan"))
                output_parts = []
                for step in steps:
                    if step.get("tool") == "reply":
                        reply_text = step.get("params", {}).get("text", "")
                        if reply_text:
                            output_parts.append(reply_text)
                    elif step.get("result"):
                        msg = format_result(step)
                        if msg:
                            output_parts.append(msg)

                if output_parts:
                    return "\n\n".join(output_parts)
                elif data.get("status") == "failed":
                    return "❌ Workflow failed."
                else:
                    return "✅ Workflow completed."
        except Exception:
            continue

    return "⏰ Workflow is still running in the background. Check Slack for updates."


# ========== INIT ==========
if "messages" not in st.session_state:
    st.session_state.messages = []
    try:
        resp = requests.get(f"{ORCHESTRATOR_URL}/messages", params={"user_id": "ui_user", "limit": 50}, timeout=5)
        if resp.status_code == 200:
            saved = resp.json().get("messages", [])
            if saved:
                st.session_state.messages = saved
    except Exception:
        pass

# Sidebar
with st.sidebar:
    if st.button("🗑️ Clear Chat History"):
        try:
            requests.delete(f"{ORCHESTRATOR_URL}/messages", params={"user_id": "ui_user"}, timeout=5)
        except Exception:
            pass
        st.session_state.messages = []
        st.rerun()

# ========== RENDER ALL MESSAGES ==========
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"], unsafe_allow_html=True)

# ========== HANDLE NEW INPUT ==========
if prompt := st.chat_input("What would you like to do?"):
    # 1. Save user message
    st.session_state.messages.append({"role": "user", "content": prompt})
    try:
        requests.post(f"{ORCHESTRATOR_URL}/messages", json={"user_id": "ui_user", "role": "user", "content": prompt}, timeout=3)
    except Exception:
        pass

    # 2. Show user message
    with st.chat_message("user"):
        st.markdown(prompt)

    # 3. Process with a visible spinner (blocks UI until done)
    with st.chat_message("assistant"):
        with st.spinner("🤖 Working on it... please wait"):
            assistant_response = run_workflow_and_wait(prompt)
        st.markdown(assistant_response, unsafe_allow_html=True)

    # 4. Save assistant response
    st.session_state.messages.append({"role": "assistant", "content": assistant_response})
    try:
        requests.post(f"{ORCHESTRATOR_URL}/messages", json={"user_id": "ui_user", "role": "assistant", "content": assistant_response}, timeout=3)
    except Exception:
        pass

    # 5. Rerun to solidify all messages as permanent elements
    st.rerun()

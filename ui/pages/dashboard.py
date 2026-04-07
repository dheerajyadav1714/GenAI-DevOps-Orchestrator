import streamlit as st
import requests
import json
from datetime import datetime, timedelta

ORCHESTRATOR_URL = "https://devops-orchestrator-688623456290.us-central1.run.app"

st.set_page_config(page_title="DevOps Agent Dashboard", page_icon="🤖", layout="wide")

# Custom CSS for Modern Light Professional Aesthetic
st.markdown("""
<style>
    /* Main Background */
    [data-testid="stAppViewContainer"] {
        background-color: #f8fafc;
        color: #1e293b;
    }
    
    /* Metric Cards: Clean & High Contrast */
    div[data-testid="stMetric"] {
        background-color: #ffffff !important;
        padding: 20px;
        border-radius: 12px !important;
        border: 1px solid #e2e8f0 !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    div[data-testid="stMetric"] label {
        color: #64748b !important;
        font-weight: 600 !important;
        text-transform: uppercase;
    }
    div[data-testid="stMetric"] div[data-testid="stMetricValue"] {
        color: #0f172a !important;
        font-weight: 800 !important;
    }
    
    /* Incident Cards */
    .incident-card {
        background-color: #ffffff;
        padding: 18px;
        border-radius: 10px;
        margin-bottom: 12px;
        border-left: 5px solid #2563eb;
        border-right: 1px solid #e2e8f0;
        border-top: 1px solid #e2e8f0;
        border-bottom: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .incident-card b { color: #1e293b; }
    .incident-card code { background: #f1f5f9; color: #2563eb; padding: 2px 6px; border-radius: 4px; }
</style>
""", unsafe_allow_html=True)

st.title("🤖 DevOps Autonomous Remediation Agent")
st.caption("Powered by Gemini 2.5 Flash • AlloyDB + pgvector • Cloud Run MCP Architecture")

# Fetch metrics
@st.cache_data(ttl=15)
def fetch_metrics():
    try:
        resp = requests.get(f"{ORCHESTRATOR_URL}/metrics", timeout=10)
        if resp.status_code == 200:
            return resp.json()
    except:
        pass
    return {}

metrics = fetch_metrics()

# ========== TOP METRICS ROW ==========
st.markdown("---")
row1_col1, row1_col2, row1_col3, row1_col4 = st.columns(4)

with row1_col1:
    st.metric("⏳ Hours Saved", f"{metrics.get('fixed_incidents', 0) * 1.5:.1f}", help="Estimated engineering hours saved by automation")

with row1_col2:
    mttr = metrics.get("avg_mttr_seconds")
    if mttr:
        if mttr < 60:
            mttr_display = f"{mttr:.0f}s"
        else:
            mttr_display = f"{mttr/60:.1f}m"
    else:
        mttr_display = "—"
    st.metric("⏱️ Avg MTTR", mttr_display, help="Mean Time To Recovery")

with row1_col3:
    st.metric("🔴 Total Incidents", metrics.get("total_incidents", 0))

with row1_col4:
    fixed = metrics.get("fixed_incidents", 0)
    auto = metrics.get("auto_merged", 0)
    st.metric("✅ Fixed (Auto-Merged)", f"{fixed} ({auto} Auto)")

st.write("") # Spacer
row2_col1, row2_col2, row2_col3 = st.columns(3)

with row2_col1:
    fix_rate = metrics.get("fix_rate_pct", 0)
    st.metric("📈 Fix Rate", f"{fix_rate}%")

with row2_col2:
    total_pipes = metrics.get("total_pipelines", 0)
    passed_pipes = metrics.get("passed_pipelines", 0)
    logic_passed = max(passed_pipes, metrics.get("fixed_incidents", 0))
    raw_rate = (logic_passed / total_pipes * 100) if total_pipes > 0 else 0
    pipe_rate = round(min(100.0, raw_rate), 1)
    st.metric("🚀 Pass Rate", f"{pipe_rate}%", help="Includes Auto-Fixed builds")

with row2_col3:
    avg_conf = metrics.get("avg_confidence")
    st.metric("🎯 Avg Confidence", f"{avg_conf:.0f}%" if avg_conf else "—")

# ========== SECOND ROW ==========
st.markdown("---")
left, right = st.columns([2, 1])

with left:
    st.subheader("📋 Recent Incidents")
    incidents = metrics.get("recent_incidents", [])
    if incidents:
        for inc in incidents:
            status_icon = "✅" if inc["status"] == "fixed" else "⏳"
            severity_color = {"High": "🔴", "Medium": "🟡", "Low": "🟢"}.get(inc.get("severity", ""), "⚪")
            
            mttr_text = ""
            if inc.get("mttr_seconds"):
                secs = inc["mttr_seconds"]
                if secs < 60:
                    mttr_text = f" | MTTR: <b>{secs:.0f}s</b>"
                else:
                    mttr_text = f" | MTTR: <b>{secs/60:.1f}min</b>"
            
            conf_text = f" | Confidence: <b>{inc['confidence']}%</b>" if inc.get("confidence") else ""
            # IST Conversion (+5:30)
            detected_dt = datetime.fromisoformat(inc.get("detected_at").replace("Z", "+00:00")) if inc.get("detected_at") else None
            if detected_dt:
                detected_ist = (detected_dt + timedelta(hours=5, minutes=30)).strftime("%Y-%m-%d %H:%M:%S")
            else:
                detected_ist = ""
            
            st.markdown(f"""
            <div class="incident-card">
                <span style="font-size:1.2rem">{status_icon}</span> {severity_color} <b>Build #{inc.get('build', '?')}</b> — <code>{inc.get('job', '')}</code>
                <br>Status: <span style="color:#4facfe">{inc.get('status', '').upper()}</span> {mttr_text} {conf_text}
                <br><span style="color:#64748b; font-size:0.8rem">📅 {detected_ist}</span>
            </div>
            """, unsafe_allow_html=True)
            st.markdown("---")
    else:
        st.info("No incidents recorded yet. Trigger a build to see data here!")

with right:
    st.subheader("📊 System Health")
    
    # RAG & Runbooks
    rag_count = metrics.get("rag_incidents", 0)
    runbook_count = metrics.get("total_runbooks", 0)
    
    st.metric("🧠 RAG Incidents Learned", rag_count)
    st.metric("📝 Runbooks Generated", runbook_count)
    
    if metrics.get("min_mttr") and metrics.get("max_mttr"):
        st.markdown(f"""
        **MTTR Range:**
        - Fastest: `{metrics['min_mttr']:.0f}s`
        - Slowest: `{metrics['max_mttr']:.0f}s`
        """)

# ========== CAPABILITIES ==========
st.markdown("---")
st.subheader("🛠️ Agent Capabilities")

cap_col1, cap_col2, cap_col3, cap_col4 = st.columns(4)

with cap_col1:
    st.markdown("""
    **🔨 Jenkins**
    - Trigger builds
    - Auto-detect failures
    - Analyze build logs
    - Webhook integration
    """)
    
    st.markdown("""
    **📢 Slack**
    - Failure notifications
    - Interactive Fix/Approve buttons
    - Confidence scores
    """)

with cap_col2:
    st.markdown("""
    **🐙 GitHub**
    - Read files & branches
    - Auto-commit fixes
    - Create PRs
    - AI code review
    """)
    
    st.markdown("""
    **🧠 RAG Learning**
    - pgvector embeddings
    - Find similar past failures
    - Suggest proven fixes
    """)

with cap_col3:
    st.markdown("""
    **🎫 Jira**
    - Create/update tickets
    - Assign to sprints
    - Auto-close on merge
    - Search with JQL
    """)
    
    st.markdown("""
    **📝 Runbooks**
    - Auto-generated from incidents
    - Stored in AlloyDB
    - Searchable knowledge base
    """)

with cap_col4:
    st.markdown("""
    **🔒 Security**  
    - AI PR security scan
    - Secret detection
    - Injection vulnerabilities
    - Severity scoring
    """)
    
    st.markdown("""
    **📊 Metrics**
    - MTTR tracking
    - Fix confidence scores
    - Incident timeline
    - Success rate
    """)

# ========== ARCHITECTURE ==========
st.markdown("---")
st.subheader("🏗️ Architecture")
st.markdown("""
```
┌──────────────┐     ┌──────────────────────────────────────────┐
│  Streamlit   │────▶│         Orchestrator (Gemini 2.5)        │
│  Dashboard   │     │  Plan → Execute → Synthesize (2-Pass)    │
└──────────────┘     └────┬────┬────┬────┬────┬────┬────────────┘
                          │    │    │    │    │    │
┌──────────────┐     ┌────▼─┐ ┌▼──┐ ┌▼──┐ ┌▼──┐ ┌▼────┐  ┌──────┐
│    Slack     │◀───▶│Jenkin│ │Git│ │Jir│ │Sla│ │Cal  │  │ RAG  │
│  (Buttons)   │     │ MCP  │ │Hub│ │ a │ │ ck│ │ndar │  │pgvec │
└──────────────┘     └──────┘ └───┘ └───┘ └───┘ └─────┘  └──┬───┘
                                                             │
                          ┌──────────────────────────────────▼───┐
                          │        AlloyDB (PostgreSQL)           │
                          │  workflows│incidents│embeddings│runs │
                          └─────────────────────────────────────-┘
```
""")

# ========== DEMO FLOW ==========
st.markdown("---")
st.subheader("🎬 Demo: Self-Healing Pipeline")
st.markdown("""
1. **Trigger**: `Trigger test-pipeline with FAIL=true`
2. **Detect**: Agent analyzes failure, posts to Slack with confidence score
3. **Fix**: Click "🔧 Fix it" → auto-creates branch, commits fix, raises PR
4. **Review**: AI reviews PR for code quality + security vulnerabilities
5. **Approve**: Click "✅ Approve" in Slack → merges PR, closes Jira
6. **Learn**: RAG stores incident, runbook auto-generated
7. **Metrics**: MTTR recorded, dashboard updates in real-time
""")

# ========== WEBHOOK INFO ==========
st.markdown("---")
st.subheader("🔗 Webhook Integration")
st.code(f"POST {ORCHESTRATOR_URL}/webhook/jenkins", language="bash")
st.caption("Configure Jenkins to POST build results to this endpoint for zero-touch remediation.")

# Footer
st.markdown("---")
ist_now = datetime.now() + timedelta(hours=5, minutes=30)
st.caption(f"DevOps Autonomous Remediation Agent • Last refreshed: {ist_now.strftime('%H:%M:%S')} IST")

# Auto-refresh
if st.button("🔄 Refresh Metrics"):
    st.cache_data.clear()
    st.rerun()

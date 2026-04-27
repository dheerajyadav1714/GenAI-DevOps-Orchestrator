"use client";
import { useState, useEffect, useRef } from "react";
import DashboardView from "./components/DashboardView";
import AgentHubView from "./components/AgentHubView";
import ChatView from "./components/ChatView";
import ActivityFeedView from "./components/ActivityFeedView";
import EtherealSidebar from "./components/EtherealSidebar";
import MegaMenu from "./components/MegaMenu";
import MetricsPanel from "./components/MetricsPanel";
import SettingsPanel from "./components/SettingsPanel";

const API_BASE = "https://devops-orchestrator-v2-688623456290.us-central1.run.app";

export default function Home() {
  const [activeView, setActiveView] = useState("DASHBOARD");
  const [messages, setMessages] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [showMetrics, setShowMetrics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [activeAgent, setActiveAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [workflowActivities, setWorkflowActivities] = useState([]);
  const [liveSteps, setLiveSteps] = useState([]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    fetchMessages();
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  // Sync dark mode to the <html> tag for robust global CSS variable inheritance
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Reset scroll position when changing views
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  async function fetchMessages() {
    try {
      const res = await fetch(`${API_BASE}/messages?user_id=ui_user&limit=30`);
      if (res.ok) {
        const data = await res.json();
        // Backend returns { messages: [...] }
        const msgList = data.messages || data;
        if (Array.isArray(msgList) && msgList.length > 0) {
          setMessages(msgList.map((m) => ({ 
            role: m.role, 
            content: m.content,
            thought: m.thought || []
          })));
        }
      }
    } catch (e) { /* silent */ }
  }

  async function fetchMetrics() {
    try {
      const res = await fetch(`${API_BASE}/metrics`);
      if (res.ok) setMetrics(await res.json());
    } catch (e) { /* silent */ }
  }

  const handleAgentClick = (agent) => {
    setActiveAgent(agent);
    if (agent.initialPrompt) {
      // Quick action from Agent Hub — switch to chat and send the prompt
      setActiveView("CHAT");
      setTimeout(() => sendMessage(agent.initialPrompt), 100);
    } else {
      // Agent card click — switch to chat with agent context
      setActiveView("CHAT");
    }
  };

  const handleProtocolSelect = (protocol) => {
    setActiveView("CHAT");
  };

  const clearMessages = async () => {
    setMessages([]);
    setActiveAgent(null);
    try {
      await fetch(`${API_BASE}/messages?user_id=ui_user`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to clear backend messages:", e);
    }
  };

  async function sendMessage(userMsg) {
    if (!userMsg.trim() || isLoading) return;
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);
    setLiveSteps([]);
    const workflowStartTime = Date.now();

    try {
      await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "user", content: userMsg, user_id: "ui_user" }),
      });

      // Track: Orchestrator received request
      setLiveSteps([{ tool: 'reply', action: 'Planning', timestamp: Date.now(), params: {} }]);

      const runRes = await fetch(`${API_BASE}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: userMsg, user_id: "ui_user" }),
      });
      const { workflow_id } = await runRes.json();

      let completed = false;
      let previousStepCount = 0;
      const pollStartTime = Date.now();
      const MAX_POLL_TIMEOUT = 900000; // 900 seconds safety timeout (15 minutes) for deep multi-agent tasks
      let pollErrors = 0;

      while (!completed) {
        await new Promise((r) => setTimeout(r, 1500));

        // Safety timeout: if polling exceeds 90s, stop and show a timeout message
        if (Date.now() - pollStartTime > MAX_POLL_TIMEOUT) {
          setMessages((prev) => [...prev, {
            role: "assistant",
            content: "⏱️ The request is taking longer than expected. The workflow is still processing in the background. Please wait a moment and refresh the chat to see the response.",
          }]);
          setLiveSteps([]);
          break;
        }

        try {
          const statusRes = await fetch(`${API_BASE}/workflow/${workflow_id}`);
          const statusData = await statusRes.json();
          pollErrors = 0; // Reset on success

          // Parse the plan to show incremental live steps
          let plan = [];
          try { plan = typeof statusData.plan === "string" ? JSON.parse(statusData.plan) : statusData.plan || []; } catch { plan = []; }

          // Update live steps if new steps appeared
          if (plan.length > previousStepCount) {
            const newLiveSteps = plan.map((s) => ({
              tool: s.tool,
              action: s.action,
              timestamp: Date.now(),
              params: s.params || {},
              result: s.result || null,
            }));
            setLiveSteps(newLiveSteps);
            previousStepCount = plan.length;
          }

          if (statusData.status === "completed" || statusData.status === "failed") {
            completed = true;
            const replyStep = plan.find((s) => s.tool === "reply" && s.action === "send");
            const replyText = replyStep?.params?.text || "Workflow completed.";
            
            // Extract thinking steps from the workflow plan (all tools except the final reply)
            const thoughtSteps = plan
              .filter((s) => s.tool !== "reply")
              .map((s) => `Triggered ${s.tool}.${s.action} with parameters: ${JSON.stringify(s.params)}`);

            let diff = null;
            let actionCard = null;
            let diffs = [];
            let actionCards = [];

            for (const step of plan) {
              if (step.result) {
                if (step.result.oldCode !== undefined && step.result.newCode !== undefined) {
                  const d = {
                    filename: step.result.file_path || "file",
                    oldCode: step.result.oldCode || "",
                    newCode: step.result.newCode || ""
                  };
                  diff = d;
                  diffs.push(d);
                }
                
                if (step.result.status?.includes("created") || step.result.status === "provisioned" || step.result.status === "remediated" || step.result.status === "optimized" || step.result.status === "architecture_drafted" || step.result.status === "generated") {
                  const a = { 
                     status: 'pending', 
                     actionType: step.result.status === "architecture_drafted" ? 'approve_architecture' : 'approve',
                     prNumber: step.result.pr_number || null,
                     prUrl: step.result.pr_url || null,
                     repo: step.result.repo || null,
                     jiraKey: step.result.jira_key || null,
                     workflowId: workflow_id
                  };
                  actionCard = a;
                  actionCards.push(a);
                }
              }
            }

            // Extract suggestions from the reply step
            const replySuggestions = replyStep?.params?.suggestions || [];

            setMessages((prev) => [...prev, { 
              role: "assistant", 
              content: replyText,
              thought: thoughtSteps,
              diff,
              diffs,
              actionCard,
              actionCards,
              suggestions: replySuggestions
            }]);

            // Record completed workflow in activity feed
            const activitySteps = plan.filter(s => s.tool !== 'reply').map(s => ({
              tool: s.tool,
              action: s.action,
              timestamp: Date.now(),
              params: s.params || {},
              result: s.result || null,
            }));
            setWorkflowActivities(prev => [{
              id: workflow_id,
              request: userMsg,
              status: statusData.status,
              startTime: workflowStartTime,
              endTime: Date.now(),
              steps: activitySteps,
            }, ...prev]);

            setLiveSteps([]);
            fetchMetrics();
          }
        } catch (pollErr) {
          pollErrors++;
          if (pollErrors >= 5) {
            setMessages((prev) => [...prev, {
              role: "assistant",
              content: "⚠️ Connection to the server was lost. The workflow may still be processing. Please refresh the page to see results.",
            }]);
            setLiveSteps([]);
            break;
          }
        }
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${err.message}` }]);
      setLiveSteps([]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleApproveAction = async (idx) => {
    const msg = messages[idx];
    if (!msg || !msg.actionCard) return;

    try {
      // Set status to approved immediately for UX, but we'll revert if it fails
      setMessages(prev => {
        const newM = [...prev];
        newM[idx] = { ...newM[idx], actionCard: { ...newM[idx].actionCard, status: 'approved' } };
        return newM;
      });

      const response = await fetch(`${API_BASE}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action_type: msg.actionCard.actionType || 'approve',
          repo: msg.actionCard.repo || "dheerajyadav1714/ci_cd",
          pr_number: msg.actionCard.prNumber || 0,
          jira_key: msg.actionCard.jiraKey || "",
          workflow_id: msg.actionCard.workflowId || "",
          pr_url: msg.actionCard.prUrl || ""
        })
      });

      if (!response.ok) throw new Error("Approval failed");
      const appData = await response.json();

      if (msg.actionCard.actionType !== 'approve_architecture') {
        // Success reply
        const replyMsg = `✅ Approval confirmed. PR #${msg.actionCard.prNumber || ''} has been merged and the CI/CD pipeline is now deploying the fix.`;
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: replyMsg,
          thought: ['API Call: POST /approve', 'GitHub: Merged pull request', 'Jira: Status updated to Done', 'Slack: Merge notification sent']
        }]);
        return;
      }

      // For architecture approval, poll the backend provisioning workflow
      setMessages(prev => [...prev, { role: "assistant", content: "Thinking..." }]);
      const new_workflow_id = appData.workflow_id;
      let completed = false;
      let attempts = 0;

      while (!completed && attempts < 90) {
        attempts++;
        await new Promise((r) => setTimeout(r, 2000));
        try {
          const statusRes = await fetch(`${API_BASE}/workflow/${new_workflow_id}`);
          const statusData = await statusRes.json();
          if (statusData.status === "completed" || statusData.status === "failed") {
            completed = true;
            let plan = [];
            try { plan = typeof statusData.plan === "string" ? JSON.parse(statusData.plan) : statusData.plan || []; } catch { plan = []; }
            const replyStep = plan.find((s) => s.tool === "reply" && s.action === "send");
            const replyText = replyStep?.params?.text || "Architecture provisioned successfully.";
            
            const thoughtSteps = plan.filter(s => s.tool !== "reply").map(s => `Executed: ${s.tool}.${s.action}`);
            
            let diff = null;
            let diffs = [];
            const provStep = plan.find((s) => s.tool === "migration" && s.action === "provision");
            if (provStep && provStep.result && provStep.result.newCode) {
              const d = { oldCode: provStep.result.oldCode || "# Target Architecture Placeholder", newCode: provStep.result.newCode || "", filename: provStep.result.file_path || "main.tf" };
              diff = d;
              diffs.push(d);
            }
            const pipeStep = plan.find((s) => s.tool === "pipeline" && s.action === "generate");
            if (pipeStep && pipeStep.result && pipeStep.result.newCode) {
              const d = { oldCode: pipeStep.result.oldCode || "", newCode: pipeStep.result.newCode || "", filename: pipeStep.result.file_path || "Jenkinsfile" };
              diff = d;
              diffs.push(d);
            }
            const finStep = plan.find((s) => s.tool === "finops" && s.action === "optimize");
            if (finStep && finStep.result && finStep.result.newCode) {
              const d = { oldCode: finStep.result.oldCode || "", newCode: finStep.result.newCode || "", filename: finStep.result.file_path || "kubernetes/deployment.yaml" };
              diff = d;
              diffs.push(d);
            }

            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { 
                role: "assistant", 
                content: replyText,
                thought: thoughtSteps.length > 0 ? thoughtSteps : ['Autonomously executed Provisioning'],
                diff,
                diffs
              };
              return updated;
            });
            fetchMetrics();
          }
        } catch (pollErr) { /* ignore to retry */ }
      }
    } catch (err) {
      console.error("Approval error:", err);
      // Revert status
      setMessages(prev => {
        const newM = [...prev];
        newM[idx] = { ...newM[idx], actionCard: { ...newM[idx].actionCard, status: 'pending' } };
        return newM;
      });
      alert("Failed to approve. Check console or backend logs.");
    }
  };

  const injectChaos = () => {
    sendMessage("Inject chaos into the repository dheerajyadav1714/ci_cd. Break the code in src/bug.py and then trigger the Jenkins pipeline to test self-healing.");
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${isDark ? 'dark bg-background text-on-surface' : 'bg-background text-on-surface'}`}>
      
      {/* Dynamic Sidebar */}
      <EtherealSidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isDark={isDark}
        onToggleSettings={() => setShowSettings(!showSettings)}
        onNewChat={clearMessages}
      />

      {/* Main Container */}
      <main className={`flex-1 flex flex-col md:ml-20 relative transition-all duration-500 ${activeView === 'CHAT' ? 'h-screen overflow-hidden' : 'min-h-screen pb-24 md:pb-0'}`}>
        
        {/* Top App Bar — Ultra Premium Glass */}
        <header className="flex justify-between items-center w-full px-6 md:px-10 h-[72px] pt-2 backdrop-blur-2xl border-b sticky top-0 z-50 flex-shrink-0 transition-all bg-surface-container-low/80 border-outline-variant/20 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-4">
             <div className="flex flex-col">
                <h1 className="font-['Inter'] font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container tracking-tighter text-xl">
                  DevOps AI
                </h1>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase opacity-50 text-on-surface">
                    SRE Control Plane
                  </span>
                  <div className="w-1 h-1 rounded-full bg-secondary animate-pulse" />
                </div>
             </div>
          </div>

          <div className="flex items-center gap-4">
             {/* Theme Toggle */}
             <button 
               onClick={() => setIsDark(!isDark)}
               className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 text-on-surface-variant hover:bg-on-surface/5 hover:text-primary"
             >
                <span className="material-symbols-outlined text-[20px]">
                  {isDark ? 'light_mode' : 'dark_mode'}
                </span>
             </button>

             <button 
               onClick={() => setShowMetrics(!showMetrics)}
               className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full border transition-all cursor-pointer hover:border-primary/50 bg-surface-container-low border-outline-variant/30 text-primary"
             >
               <span className="material-symbols-outlined text-sm">sensors</span>
               <span className="font-mono text-[10px] font-black uppercase tracking-widest">
                  {metrics?.total_workflows || 0} Workflows
               </span>
             </button>
          </div>
        </header>

        {/* Dynamic View Content */}
        <div className={`flex-1 flex relative z-10 transition-all duration-300 ${activeView === 'CHAT' ? 'overflow-hidden' : ''}`}>
          <div className={`flex-1 relative flex ${activeView === 'CHAT' ? 'h-full overflow-hidden' : 'flex-col'}`}>
            {activeView === "DASHBOARD" && <DashboardView metrics={metrics} />}
            {activeView === "HUB" && <AgentHubView onAgentClick={handleAgentClick} />}
            {activeView === "ACTIVITY" && (
              <ActivityFeedView
                activities={workflowActivities}
                isLoading={isLoading}
                liveSteps={liveSteps}
              />
            )}
            {activeView === "CHAT" && (
              <ChatView 
                activeAgent={activeAgent} 
                messages={messages} 
                isLoading={isLoading} 
                liveSteps={liveSteps}
                onSendMessage={sendMessage}
                onClearChat={clearMessages}
                onApproveAction={handleApproveAction}
                onChaosInject={injectChaos}
              />
            )}
          </div>
          {/* Slide-in Metrics Panel */}
          {showMetrics && (
            <div className="w-80 h-full border-l shrink-0 transition-all bg-surface-container-lowest border-outline-variant/30 overflow-y-auto z-20">
               <MetricsPanel metrics={metrics} />
            </div>
          )}
        </div>

        {/* Global Mega Menu */}
        <MegaMenu 
          isOpen={isMegaMenuOpen} 
          onClose={() => setIsMegaMenuOpen(false)} 
          onSelect={handleProtocolSelect}
        />

        {/* Settings Panel */}
        <SettingsPanel
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          isDark={isDark}
          setIsDark={setIsDark}
        />

        {/* Overlay Background Gradients (Aether Style) */}
        {isDark && (
          <>
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/5 rounded-full blur-[150px] pointer-events-none" />
          </>
        )}
      </main>
    </div>
  );
}

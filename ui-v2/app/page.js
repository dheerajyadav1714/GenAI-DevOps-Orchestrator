"use client";
import { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import ChatMessage from "./components/ChatMessage";
import MetricsPanel from "./components/MetricsPanel";

const API_BASE = "https://devops-orchestrator-v2-688623456290.us-central1.run.app";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [showMetrics, setShowMetrics] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchMessages() {
    try {
      const res = await fetch(`${API_BASE}/messages?user_id=ui_user&limit=50`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data.map((m) => ({ role: m.role, content: m.content })));
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

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "user", content: userMsg, user_id: "ui_user" }),
      });
      const runRes = await fetch(`${API_BASE}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: userMsg, user_id: "ui_user" }),
      });
      const { workflow_id } = await runRes.json();

      let completed = false;
      while (!completed) {
        await new Promise((r) => setTimeout(r, 2000));
        try {
          const statusRes = await fetch(`${API_BASE}/workflow/${workflow_id}`);
          const statusData = await statusRes.json();
          if (statusData.status === "completed" || statusData.status === "failed") {
            completed = true;
            let plan = [];
            try { plan = typeof statusData.plan === "string" ? JSON.parse(statusData.plan) : statusData.plan || []; } catch { plan = []; }
            const replyStep = plan.find((s) => s.tool === "reply" && s.action === "send");
            const replyText = replyStep?.params?.text || "Workflow completed.";
            setMessages((prev) => [...prev, { role: "assistant", content: replyText }]);
            fetchMetrics();
          }
        } catch (pollErr) { /* retry */ }
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  }

  const quickActions = [
    { icon: "🔍", label: "Show Incidents", desc: "View all incidents & MTTR", prompt: "Show all incidents and their MTTR" },
    { icon: "⚙️", label: "Generate Pipeline", desc: "Auto-create a Jenkinsfile", prompt: "Generate a CI/CD pipeline for dheerajyadav1714/ci_cd" },
    { icon: "🌪️", label: "Chaos Mode", desc: "Inject bug & self-heal", prompt: "Inject chaos into dheerajyadav1714/ci_cd and trigger self-healing" },
    { icon: "🏛️", label: "Provision Infra", desc: "Zero-touch Terraform", prompt: "Provision infrastructure for my-auth-service" },
    { icon: "📊", label: "Build Stats", desc: "Pipeline success rates", prompt: "Show build success rate for the last 7 days" },
    { icon: "🔧", label: "Trigger Pipeline", desc: "Run Jenkins job now", prompt: "Trigger test-pipeline" },
  ];
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar onNewChat={() => setMessages([])} />

      <main className="flex-1 flex flex-col relative z-10 bg-white">
        {/* Header */}
        <header
          className="flex items-center justify-between px-6 h-14 shrink-0 bg-white border-b border-gray-100"
        >
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold text-slate-800">
              DevOps Orchestrator
            </h1>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 uppercase tracking-widest">
              v2.0
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
              style={{
                background: showMetrics ? "var(--accent-dim)" : "transparent",
                color: showMetrics ? "var(--accent-light)" : "var(--text-muted)",
                border: `1px solid ${showMetrics ? "var(--border-accent)" : "var(--border)"}`,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
              Metrics
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Chat */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {messages.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center h-full animate-slide-up">
                  {/* Hero */}
                  <div className="mb-10 text-center">
                    <h2 className="text-4xl font-semibold tracking-tight mb-3 text-slate-800">
                      What would you like to build?
                    </h2>
                    <p className="text-base max-w-md text-slate-500 mx-auto">
                      Use DevOps AI to orchestrate pipelines, query metrics, or provision infrastructure.
                    </p>
                  </div>

                  {/* Quick Actions Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl w-full">
                    {quickActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(action.prompt)}
                        className="action-card"
                      >
                        <div className="text-xl mb-2">{action.icon}</div>
                        <div className="text-[13px] font-semibold text-slate-800 mb-0.5">
                          {action.label}
                        </div>
                        <div className="text-[11px] text-slate-500 leading-tight">
                          {action.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-w-3xl mx-auto">
                  {messages.map((msg, i) => (
                    <ChatMessage key={i} message={msg} index={i} />
                  ))}

                  {isLoading && (
                    <div className="flex items-start gap-4 animate-slide-up max-w-4xl mx-auto w-full">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 avatar-ai">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      </div>
                      <div className="flex-1 mt-1">
                        <div className="flex flex-col gap-3 max-w-md">
                           <div className="h-3 w-full rounded-full shimmer" />
                           <div className="h-3 w-4/5 rounded-full shimmer" />
                           <div className="h-3 w-2/3 rounded-full shimmer" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            {/* Floating Input Pill Box */}
            <div className="px-6 pb-6 pt-4 shrink-0 mt-auto bg-gradient-to-t from-white to-transparent">
              <form onSubmit={sendMessage} className="max-w-3xl mx-auto">
                <div className="flex items-center bg-[#f4f4f5] border border-gray-200 shadow-sm rounded-full pl-5 pr-2 py-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Message DevOps AI..."
                    disabled={isLoading}
                    className="flex-1 bg-transparent border-none outline-none text-[15px] text-slate-800 placeholder-slate-500 py-1"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 ml-3 transition-colors text-white disabled:opacity-40"
                    style={{ background: input.trim() ? "#000000" : "#d1d5db" }}
                  >
                    {isLoading ? <span className="text-xs text-white">...</span> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>}
                  </button>
                </div>
                <p className="text-center mt-3 text-xs text-slate-400">
                  DevOps AI can make mistakes. Consider verifying critical actions.
                </p>
              </form>
            </div>
          </div>

          {showMetrics && <MetricsPanel metrics={metrics} />}
        </div>
      </main>
    </div>
  );
}

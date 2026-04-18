"use client";
import { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import ChatMessage from "./components/ChatMessage";
import MetricsPanel from "./components/MetricsPanel";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
    { icon: "📝", label: "Release Notes", desc: "Generate from PRs & Jira", prompt: "Generate release notes for v2.0.0" },
    { icon: "📊", label: "Build Stats", desc: "Pipeline success rates", prompt: "Show build success rate for the last 7 days" },
    { icon: "🔧", label: "Trigger Pipeline", desc: "Run Jenkins job now", prompt: "Trigger test-pipeline" },
  ];

  return (
    <div className="flex h-screen overflow-hidden relative">
      <div className="bg-mesh" />
      <div className="dot-grid" />

      <Sidebar metrics={metrics} />

      <main className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <header
          className="flex items-center justify-between px-6 h-14 shrink-0"
          style={{ borderBottom: "1px solid var(--border)", background: "rgba(9,9,11,0.8)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full" style={{ background: "var(--success)" }} />
            <h1 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              GenAI DevOps Orchestrator
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent-dim)", color: "var(--accent-light)", fontSize: "0.65rem" }}>
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
                  <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5" style={{ background: "var(--accent-dim)", border: "1px solid var(--border-accent)" }}>
                      <div className="w-1.5 h-1.5 rounded-full status-live" style={{ background: "var(--success)" }} />
                      <span className="text-xs font-medium" style={{ color: "var(--accent-light)" }}>All systems operational</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">
                      <span className="gradient-text">DevOps Orchestrator</span>
                    </h2>
                    <p className="text-sm max-w-md" style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
                      Autonomous CI/CD management powered by Gemini. Fix bugs, generate pipelines, analyze logs, or run chaos experiments.
                    </p>
                  </div>

                  {/* Quick Actions Grid */}
                  <div className="grid grid-cols-3 gap-2.5 max-w-xl w-full">
                    {quickActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(action.prompt)}
                        className="surface-glow rounded-xl p-3.5 text-left cursor-pointer group"
                      >
                        <div className="text-lg mb-1.5">{action.icon}</div>
                        <div className="text-xs font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>
                          {action.label}
                        </div>
                        <div className="text-xs" style={{ color: "var(--text-muted)", lineHeight: "1.4" }}>
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
                    <div className="flex items-start gap-3 animate-slide-up">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "var(--accent-dim)", color: "var(--accent-light)" }}>
                        AI
                      </div>
                      <div className="surface rounded-xl rounded-tl-sm px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full think-dot" style={{ background: "var(--accent-light)" }} />
                            <span className="w-1.5 h-1.5 rounded-full think-dot" style={{ background: "var(--accent-light)" }} />
                            <span className="w-1.5 h-1.5 rounded-full think-dot" style={{ background: "var(--accent-light)" }} />
                          </div>
                          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Orchestrating workflow...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-6 py-3 shrink-0" style={{ borderTop: "1px solid var(--border)", background: "rgba(9,9,11,0.6)", backdropFilter: "blur(8px)" }}>
              <form onSubmit={sendMessage} className="max-w-3xl mx-auto">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Message DevOps Orchestrator..."
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 rounded-xl chat-input"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="btn-primary px-5 py-2.5 rounded-xl text-sm"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </div>
                <p className="text-center mt-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  Powered by <span style={{ color: "var(--accent-light)" }}>Gemini 2.5 Flash</span> &middot; 6 MCP Agents &middot; AlloyDB RAG
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

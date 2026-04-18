"use client";
import { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import ChatMessage from "./components/ChatMessage";
import MetricsPanel from "./components/MetricsPanel";

// IMPORTANT: Update this to your Cloud Run URL when deploying
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [showMetrics, setShowMetrics] = useState(false);
  const chatEndRef = useRef(null);

  // Load chat history & metrics
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
    } catch (e) {
      console.log("Could not load chat history:", e);
    }
  }

  async function fetchMetrics() {
    try {
      const res = await fetch(`${API_BASE}/metrics`);
      if (res.ok) setMetrics(await res.json());
    } catch (e) {
      console.log("Could not load metrics:", e);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      // Save user message
      await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "user", content: userMsg, user_id: "ui_user" }),
      });

      // Trigger workflow
      const runRes = await fetch(`${API_BASE}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: userMsg, user_id: "ui_user" }),
      });
      const { workflow_id } = await runRes.json();

      // Poll for completion
      let completed = false;
      while (!completed) {
        await new Promise((r) => setTimeout(r, 2000));
        try {
          const statusRes = await fetch(`${API_BASE}/workflow/${workflow_id}`);
          const statusData = await statusRes.json();

          if (statusData.status === "completed" || statusData.status === "failed") {
            completed = true;
            let plan = [];
            try {
              plan = typeof statusData.plan === "string" ? JSON.parse(statusData.plan) : statusData.plan || [];
            } catch { plan = []; }

            const replyStep = plan.find((s) => s.tool === "reply" && s.action === "send");
            const replyText = replyStep?.params?.text || "Workflow completed. No reply generated.";

            setMessages((prev) => [...prev, { role: "assistant", content: replyText }]);
            fetchMetrics();
          }
        } catch (pollErr) {
          console.log("Poll error:", pollErr);
        }
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  }

  const quickActions = [
    { label: "🔍 Show Incidents", prompt: "Show all incidents and their MTTR" },
    { label: "⚙️ Generate Pipeline", prompt: "Generate a CI/CD pipeline for dheerajyadav1714/ci_cd" },
    { label: "🌪️ Chaos Mode", prompt: "Inject chaos into dheerajyadav1714/ci_cd and trigger self-healing" },
    { label: "📝 Release Notes", prompt: "Generate release notes for v2.0.0" },
    { label: "📊 Build Stats", prompt: "Show build success rate for the last 7 days" },
    { label: "🔧 Trigger Pipeline", prompt: "Trigger test-pipeline" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar metrics={metrics} />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col" style={{ background: "var(--bg-primary)" }}>
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h1 className="text-xl font-bold">
              <span className="glow-text">GenAI DevOps Orchestrator</span>
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
              Autonomous CI/CD • Self-Healing • DORA Metrics
            </p>
          </div>
          <button
            onClick={() => setShowMetrics(!showMetrics)}
            className="glass-card px-4 py-2 text-sm font-medium cursor-pointer"
            style={{ color: "var(--accent)" }}
          >
            {showMetrics ? "Hide Metrics" : "📊 Show Metrics"}
          </button>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Chat Section */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full animate-fade-in">
                  <div className="text-5xl mb-4">🚀</div>
                  <h2 className="text-2xl font-bold glow-text mb-2">DevOps Orchestrator</h2>
                  <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
                    Ask me to fix bugs, generate pipelines, analyze logs, or run chaos experiments.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl">
                    {quickActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => { setInput(action.prompt); }}
                        className="glass-card px-4 py-3 text-left text-sm cursor-pointer transition-all hover:scale-[1.02]"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} index={i} />
              ))}

              {isLoading && (
                <div className="flex items-start gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: "var(--accent)", color: "white" }}>
                    AI
                  </div>
                  <div className="glass-card px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      </div>
                      <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                        Orchestrating workflow...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="px-6 py-4" style={{ borderTop: "1px solid var(--border)" }}>
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask: 'Trigger test-pipeline', 'Generate pipeline for my repo', 'Inject chaos'..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-xl text-sm input-glow"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-40"
                  style={{
                    background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                    color: "white",
                  }}
                >
                  Send
                </button>
              </div>
            </form>
          </div>

          {/* Metrics Panel (Toggle) */}
          {showMetrics && <MetricsPanel metrics={metrics} />}
        </div>
      </main>
    </div>
  );
}

"use client";

const integrations = [
  { name: "Jenkins", icon: "🔧", color: "#ef4444" },
  { name: "GitHub", icon: "🐙", color: "#a78bfa" },
  { name: "Jira", icon: "📋", color: "#3b82f6" },
  { name: "Slack", icon: "💬", color: "#22c55e" },
  { name: "Confluence", icon: "📖", color: "#3b82f6" },
  { name: "Calendar", icon: "📅", color: "#eab308" },
  { name: "AlloyDB", icon: "🗄️", color: "#6366f1" },
];

export default function Sidebar({ onNewChat }) {
  return (
    <aside
      className="w-64 flex flex-col h-full shrink-0 relative z-10 bg-white"
      style={{ borderRight: "1px solid var(--border)", boxShadow: "0 0 20px rgba(0,0,0,0.02)" }}
    >
      <div className="p-4" style={{ paddingBottom: "1rem" }}>
        <button 
          onClick={onNewChat}
          className="w-full btn-liquid-blue py-2.5 flex items-center justify-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Chat
        </button>
      </div>

      <div className="px-3 flex-1 overflow-y-auto">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 mt-2">
          Conversations
        </div>
        <div className="text-sm px-3 py-2 text-slate-500 rounded-lg bg-slate-50">
          New session
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 mt-auto" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>DevOps AI</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--success)" }} />
              <span className="text-[10px] font-medium truncate" style={{ color: "var(--text-muted)" }}>
                Gemini 2.5 Flash
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

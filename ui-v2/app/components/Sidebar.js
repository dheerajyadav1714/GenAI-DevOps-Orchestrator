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

export default function Sidebar({ metrics }) {
  return (
    <aside
      className="w-64 flex flex-col h-full shrink-0 relative z-10 bg-white"
      style={{ borderRight: "1px solid var(--border)", boxShadow: "0 0 20px rgba(0,0,0,0.02)" }}
    >
      <div className="p-4" style={{ paddingBottom: "1rem" }}>
        <button className="w-full btn-liquid-blue py-2.5 flex items-center justify-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Chat
        </button>
      </div>
        <div>
          <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>DevOps AI</div>
          <div className="text-xs" style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}>Autonomous Platform</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-3 py-3 flex-1 overflow-y-auto">
        {/* MCP Agents */}
        <div className="mb-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}>
              MCP Agents
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--success-dim)", color: "var(--success)", fontSize: "0.55rem", fontWeight: 700 }}>
              7/7
            </span>
          </div>
          <div className="space-y-1">
            {integrations.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg sidebar-item cursor-pointer"
              >
                <span className="text-sm">{item.icon}</span>
                <span className="text-sm flex-1 font-medium">
                  {item.name}
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full status-live"
                  style={{ background: "var(--success)" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mx-2 mb-4" style={{ borderTop: "1px solid var(--border)" }} />

        {/* Stats */}
        {metrics && (
          <div>
            <div className="px-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}>
                Live Stats
              </span>
            </div>
            <div className="space-y-1">
              <SidebarStat label="Incidents" value={metrics.total_incidents || 0} icon="⚠️" trend="down" />
              <SidebarStat label="Auto-Fixed" value={metrics.fixed_incidents || 0} icon="✅" trend="up" />
              <SidebarStat label="Workflows" value={metrics.total_workflows || 0} icon="⚡" />
              <SidebarStat label="Runbooks" value={metrics.total_runbooks || 0} icon="📝" />
              <SidebarStat label="RAG Entries" value={metrics.rag_incidents || 0} icon="🧠" />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 mt-auto" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>DevOps AI</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--success)" }} />
              <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
                Gemini 2.5 Flash
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarStat({ label, value, icon, trend }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg sidebar-item cursor-pointer">
      <span className="text-sm">{icon}</span>
      <span className="text-sm flex-1 font-medium">{label}</span>
      <span className="text-sm font-bold font-mono" style={{ color: "var(--text-primary)" }}>
        {value}
      </span>
    </div>
  );
}

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
      className="w-56 flex flex-col h-full shrink-0 relative z-10"
      style={{ background: "var(--bg-secondary)", borderRight: "1px solid var(--border)" }}
    >
      {/* Logo */}
      <div className="px-4 py-4 flex items-center gap-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-extrabold"
          style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "white" }}
        >
          ⚡
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
          <div className="space-y-0.5">
            {integrations.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-colors"
                style={{ cursor: "default" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-hover)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <span className="text-sm" style={{ filter: "grayscale(0.2)" }}>{item.icon}</span>
                <span className="text-xs flex-1 font-medium" style={{ color: "var(--text-secondary)" }}>
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
      <div className="px-4 py-3" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--success)" }} />
          <span className="text-xs" style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>
            Gemini 2.5 Flash • GCP
          </span>
        </div>
      </div>
    </aside>
  );
}

function SidebarStat({ label, value, icon, trend }) {
  return (
    <div
      className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
      style={{ cursor: "default" }}
      onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-hover)"}
      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
    >
      <span className="text-xs">{icon}</span>
      <span className="text-xs flex-1" style={{ color: "var(--text-muted)" }}>{label}</span>
      <span className="text-xs font-bold font-mono" style={{ color: "var(--text-primary)" }}>
        {value}
      </span>
    </div>
  );
}

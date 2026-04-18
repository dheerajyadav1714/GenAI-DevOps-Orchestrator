"use client";

const integrations = [
  { name: "Jenkins", icon: "🔧", status: "connected" },
  { name: "GitHub", icon: "🐙", status: "connected" },
  { name: "Jira", icon: "📋", status: "connected" },
  { name: "Slack", icon: "💬", status: "connected" },
  { name: "Confluence", icon: "📖", status: "connected" },
  { name: "Calendar", icon: "📅", status: "connected" },
  { name: "AlloyDB", icon: "🗄️", status: "connected" },
];

export default function Sidebar({ metrics }) {
  return (
    <aside
      className="w-64 flex flex-col h-full shrink-0"
      style={{
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
            style={{
              background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
              color: "white",
            }}
          >
            ⚡
          </div>
          <div>
            <div className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
              DevOps AI
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              v2.0 Refinement
            </div>
          </div>
        </div>
      </div>

      {/* MCP Integrations */}
      <div className="px-4 py-4 flex-1 overflow-y-auto">
        <div
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          MCP Integrations
        </div>
        <div className="space-y-1.5">
          {integrations.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:scale-[1.01]"
              style={{ background: "rgba(99, 102, 241, 0.04)" }}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-sm flex-1" style={{ color: "var(--text-secondary)" }}>
                {item.name}
              </span>
              <span
                className="w-2 h-2 rounded-full pulse-green"
                style={{ background: "var(--success)" }}
              />
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        {metrics && (
          <div className="mt-6">
            <div
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              Quick Stats
            </div>
            <div className="space-y-2">
              <StatItem
                label="Incidents"
                value={metrics.total_incidents || 0}
                color="var(--danger)"
              />
              <StatItem
                label="Auto-Fixed"
                value={metrics.fixed_incidents || 0}
                color="var(--success)"
              />
              <StatItem
                label="Workflows"
                value={metrics.total_workflows || 0}
                color="var(--accent)"
              />
              <StatItem
                label="Runbooks"
                value={metrics.total_runbooks || 0}
                color="var(--warning)"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="px-4 py-3 text-xs"
        style={{
          borderTop: "1px solid var(--border)",
          color: "var(--text-muted)",
        }}
      >
        Powered by Gemini 2.5 Flash
      </div>
    </aside>
  );
}

function StatItem({ label, value, color }) {
  return (
    <div
      className="flex items-center justify-between px-3 py-2 rounded-lg"
      style={{ background: "rgba(99, 102, 241, 0.04)" }}
    >
      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
      <span className="text-sm font-bold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

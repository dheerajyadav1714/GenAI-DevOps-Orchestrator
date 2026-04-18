"use client";

export default function MetricsPanel({ metrics }) {
  if (!metrics) {
    return (
      <div
        className="w-80 shrink-0 p-4 overflow-y-auto"
        style={{ borderLeft: "1px solid var(--border)", background: "var(--bg-secondary)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading metrics...</p>
      </div>
    );
  }

  const mttrMinutes = metrics.avg_mttr_seconds
    ? (metrics.avg_mttr_seconds / 60).toFixed(1)
    : "—";

  const fixRate = metrics.fix_rate_pct || 0;

  return (
    <div
      className="w-80 shrink-0 overflow-y-auto p-4 space-y-4"
      style={{ borderLeft: "1px solid var(--border)", background: "var(--bg-secondary)" }}
    >
      {/* Title */}
      <div>
        <h2 className="text-sm font-bold glow-text">DORA Metrics Dashboard</h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          Real-time performance tracking
        </p>
      </div>

      {/* MTTR Card */}
      <MetricCard
        label="Mean Time to Repair"
        value={`${mttrMinutes} min`}
        subtitle="Average across all incidents"
        color="var(--accent)"
        icon="⏱️"
      />

      {/* Fix Rate Card */}
      <MetricCard
        label="Auto-Fix Success Rate"
        value={`${fixRate}%`}
        subtitle={`${metrics.fixed_incidents || 0} of ${metrics.total_incidents || 0} incidents`}
        color="var(--success)"
        icon="✅"
      >
        {/* Progress Bar */}
        <div className="mt-3 w-full h-2 rounded-full" style={{ background: "rgba(99, 102, 241, 0.1)" }}>
          <div
            className="h-2 rounded-full transition-all duration-1000"
            style={{
              width: `${Math.min(fixRate, 100)}%`,
              background: "linear-gradient(90deg, var(--gradient-start), var(--success))",
            }}
          />
        </div>
      </MetricCard>

      {/* Pipeline Stats */}
      <MetricCard
        label="Pipeline Runs"
        value={metrics.total_pipelines || 0}
        color="var(--warning)"
        icon="🔄"
      >
        <div className="flex gap-4 mt-3">
          <MiniStat label="Passed" value={metrics.passed_pipelines || 0} color="var(--success)" />
          <MiniStat label="Failed" value={metrics.failed_pipelines || 0} color="var(--danger)" />
          <MiniStat label="Auto-Merged" value={metrics.auto_merged || 0} color="var(--accent)" />
        </div>
      </MetricCard>

      {/* Confidence Score */}
      <MetricCard
        label="Avg AI Confidence"
        value={metrics.avg_confidence ? `${metrics.avg_confidence}%` : "—"}
        subtitle="Gemini diagnosis accuracy"
        color="var(--gradient-end)"
        icon="🧠"
      />

      {/* Knowledge Base */}
      <div className="glass-card p-4">
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
          Knowledge Base
        </div>
        <div className="grid grid-cols-2 gap-3">
          <KBStat label="RAG Incidents" value={metrics.rag_incidents || 0} icon="🔍" />
          <KBStat label="Runbooks" value={metrics.total_runbooks || 0} icon="📝" />
          <KBStat label="Workflows" value={metrics.total_workflows || 0} icon="⚡" />
          <KBStat
            label="MTTR Range"
            value={
              metrics.min_mttr && metrics.max_mttr
                ? `${(metrics.min_mttr / 60).toFixed(0)}-${(metrics.max_mttr / 60).toFixed(0)}m`
                : "—"
            }
            icon="📊"
          />
        </div>
      </div>

      {/* Recent Incidents */}
      {metrics.recent_incidents && metrics.recent_incidents.length > 0 && (
        <div className="glass-card p-4">
          <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
            Recent Incidents
          </div>
          <div className="space-y-2">
            {metrics.recent_incidents.slice(0, 5).map((inc, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-2 py-2 rounded-lg text-xs"
                style={{ background: "rgba(99, 102, 241, 0.04)" }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: inc.status === "fixed" ? "var(--success)" : "var(--danger)",
                    }}
                  />
                  <span style={{ color: "var(--text-secondary)" }}>
                    {inc.job || "—"} #{inc.build || "—"}
                  </span>
                </div>
                <span
                  className="font-mono"
                  style={{
                    color: inc.status === "fixed" ? "var(--success)" : "var(--warning)",
                  }}
                >
                  {inc.mttr_seconds ? `${(inc.mttr_seconds / 60).toFixed(1)}m` : "pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, subtitle, color, icon, children }) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          {icon} {label}
        </span>
      </div>
      <div className="metric-value" style={{ color }}>
        {value}
      </div>
      {subtitle && (
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div className="text-center">
      <div className="text-lg font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
    </div>
  );
}

function KBStat({ label, value, icon }) {
  return (
    <div className="text-center py-2 rounded-lg" style={{ background: "rgba(99, 102, 241, 0.04)" }}>
      <div className="text-sm">{icon}</div>
      <div className="text-sm font-bold mt-0.5" style={{ color: "var(--text-primary)" }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
    </div>
  );
}

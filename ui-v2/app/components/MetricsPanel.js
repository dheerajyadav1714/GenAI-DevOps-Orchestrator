"use client";

export default function MetricsPanel({ metrics }) {
  if (!metrics) {
    return (
      <div className="w-72 shrink-0 p-4 overflow-y-auto" style={{ borderLeft: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="shimmer h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const mttr = metrics.avg_mttr_seconds ? (metrics.avg_mttr_seconds / 60).toFixed(1) : "—";
  const fixRate = metrics.fix_rate_pct || 0;

  return (
    <div className="w-72 shrink-0 overflow-y-auto p-4 space-y-3" style={{ borderLeft: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
      {/* Title */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xs font-bold gradient-text uppercase tracking-wider">DORA Metrics</h2>
        <span className="w-1.5 h-1.5 rounded-full status-live" style={{ background: "var(--success)" }} />
      </div>

      {/* MTTR */}
      <div className="surface rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Mean Time to Repair</span>
          <span className="text-xs">⏱️</span>
        </div>
        <div className="metric-number gradient-text">{mttr}<span className="text-sm font-normal" style={{ WebkitTextFillColor: "var(--text-muted)" }}> min</span></div>
      </div>

      {/* Fix Rate */}
      <div className="surface rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Auto-Fix Rate</span>
          <span className="text-xs font-bold" style={{ color: "var(--success)" }}>{fixRate}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full" style={{ background: "var(--bg-primary)" }}>
          <div
            className="h-1.5 rounded-full transition-all duration-1000"
            style={{
              width: `${Math.min(fixRate, 100)}%`,
              background: "linear-gradient(90deg, #7c3aed, #22c55e)",
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{metrics.fixed_incidents || 0} fixed</span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{metrics.total_incidents || 0} total</span>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="surface rounded-xl p-4">
        <div className="text-xs font-medium mb-3" style={{ color: "var(--text-muted)" }}>Pipeline Runs</div>
        <div className="grid grid-cols-3 gap-2">
          <MiniBlock label="Total" value={metrics.total_pipelines || 0} color="var(--text-primary)" />
          <MiniBlock label="Pass" value={metrics.passed_pipelines || 0} color="var(--success)" />
          <MiniBlock label="Fail" value={metrics.failed_pipelines || 0} color="var(--danger)" />
        </div>
      </div>

      {/* AI Confidence */}
      <div className="surface rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>AI Confidence</span>
          <span className="text-xs">🧠</span>
        </div>
        <div className="metric-number" style={{ color: "var(--accent-light)" }}>
          {metrics.avg_confidence || "—"}<span className="text-sm font-normal" style={{ color: "var(--text-muted)" }}>%</span>
        </div>
      </div>

      {/* Knowledge Base */}
      <div className="surface rounded-xl p-4">
        <div className="text-xs font-medium mb-3" style={{ color: "var(--text-muted)" }}>Knowledge Base</div>
        <div className="grid grid-cols-2 gap-2">
          <KBBlock label="RAG" value={metrics.rag_incidents || 0} icon="🔍" />
          <KBBlock label="Runbooks" value={metrics.total_runbooks || 0} icon="📝" />
          <KBBlock label="Workflows" value={metrics.total_workflows || 0} icon="⚡" />
          <KBBlock label="Merged" value={metrics.auto_merged || 0} icon="✅" />
        </div>
      </div>

      {/* Recent Incidents */}
      {metrics.recent_incidents?.length > 0 && (
        <div className="surface rounded-xl p-4">
          <div className="text-xs font-medium mb-2.5" style={{ color: "var(--text-muted)" }}>Recent Incidents</div>
          <div className="space-y-1.5">
            {metrics.recent_incidents.slice(0, 4).map((inc, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-lg" style={{ background: "var(--bg-primary)" }}>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: inc.status === "fixed" ? "var(--success)" : "var(--danger)" }} />
                  <span className="text-xs font-mono" style={{ color: "var(--text-secondary)", fontSize: "0.65rem" }}>
                    {inc.job || "—"} #{inc.build || "—"}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold" style={{ color: inc.status === "fixed" ? "var(--success)" : "var(--warning)", fontSize: "0.65rem" }}>
                  {inc.mttr_seconds ? `${(inc.mttr_seconds / 60).toFixed(1)}m` : "..."}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MiniBlock({ label, value, color }) {
  return (
    <div className="text-center py-2 rounded-lg" style={{ background: "var(--bg-primary)" }}>
      <div className="text-sm font-bold font-mono" style={{ color }}>{value}</div>
      <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}>{label}</div>
    </div>
  );
}

function KBBlock({ label, value, icon }) {
  return (
    <div className="text-center py-2 rounded-lg" style={{ background: "var(--bg-primary)" }}>
      <div style={{ fontSize: "0.7rem" }}>{icon}</div>
      <div className="text-xs font-bold mt-0.5 font-mono" style={{ color: "var(--text-primary)" }}>{value}</div>
      <div style={{ color: "var(--text-muted)", fontSize: "0.55rem" }}>{label}</div>
    </div>
  );
}

"use client";

export default function MetricsPanel({ metrics }) {
  if (!metrics) {
    return (
      <div className="w-full shrink-0 p-4 overflow-y-auto">
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => <div key={i} className="animate-pulse bg-surface-container-high h-24 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const mttr = metrics.avg_mttr_seconds ? (metrics.avg_mttr_seconds / 60).toFixed(1) : "—";
  const fixRate = metrics.fix_rate_pct || 0;

  return (
    <div className="w-full shrink-0 overflow-y-auto p-5 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-bold text-on-surface uppercase tracking-wider">DORA Metrics</h2>
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(142,213,255,0.6)]" />
      </div>

      {/* MTTR */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 shadow-sm hover:border-primary/30 transition-colors group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Mean Time to Repair</span>
          <span className="text-xs opacity-80 group-hover:scale-110 transition-transform">⏱️</span>
        </div>
        <div className="font-mono text-2xl font-black text-on-surface group-hover:text-primary transition-colors">
          {mttr}<span className="text-sm font-semibold text-on-surface-variant ml-1">min</span>
        </div>
      </div>

      {/* Fix Rate */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 shadow-sm hover:border-primary/30 transition-colors group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Auto-Fix Rate</span>
          <span className="text-xs font-black text-primary">{fixRate}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-primary to-primary-container"
            style={{ width: `${Math.min(fixRate, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">{metrics.fixed_incidents || 0} fixed</span>
          <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">{metrics.total_incidents || 0} total</span>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 shadow-sm hover:border-primary/30 transition-colors group">
        <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Pipeline Runs</div>
        <div className="grid grid-cols-3 gap-3">
          <MiniBlock label="Total" value={metrics.total_pipelines || 0} colorClass="text-on-surface" />
          <MiniBlock label="Pass" value={metrics.passed_pipelines || 0} colorClass="text-primary-container" />
          <MiniBlock label="Fail" value={metrics.failed_pipelines || 0} colorClass="text-error" />
        </div>
      </div>

      {/* AI Confidence */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 shadow-sm hover:border-primary/30 transition-colors group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">AI Confidence</span>
          <span className="text-xs opacity-80 group-hover:scale-110 transition-transform">🧠</span>
        </div>
        <div className="font-mono text-2xl font-black text-primary group-hover:text-primary-container transition-colors">
          {metrics.avg_confidence || "—"}<span className="text-sm font-semibold text-on-surface-variant ml-1">%</span>
        </div>
      </div>

      {/* Knowledge Base */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 shadow-sm hover:border-primary/30 transition-colors group">
        <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Knowledge Base</div>
        <div className="grid grid-cols-2 gap-3">
          <KBBlock label="RAG" value={metrics.rag_incidents || 0} icon="🔍" />
          <KBBlock label="Runbooks" value={metrics.total_runbooks || 0} icon="📝" />
          <KBBlock label="Workflows" value={metrics.total_workflows || 0} icon="⚡" />
          <KBBlock label="Merged" value={metrics.auto_merged || 0} icon="✅" />
        </div>
      </div>

      {/* Recent Incidents */}
      {metrics.recent_incidents?.length > 0 && (
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 shadow-sm hover:border-primary/30 transition-colors group">
          <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Recent Incidents</div>
          <div className="space-y-2">
            {metrics.recent_incidents.slice(0, 4).map((inc, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-container border border-outline-variant/20 hover:border-outline-variant/50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${inc.status === "fixed" ? "bg-primary-container" : "bg-error animate-pulse"}`} />
                  <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider">
                    {inc.job || "—"} #{inc.build || "—"}
                  </span>
                </div>
                <span className={`text-[11px] font-mono font-bold uppercase tracking-widest ${inc.status === "fixed" ? "text-primary-container" : "text-error"}`}>
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

function MiniBlock({ label, value, colorClass }) {
  return (
    <div className="text-center py-2.5 rounded-xl bg-surface-container border border-outline-variant/20 transition-colors hover:border-outline-variant/40">
      <div className={`text-base font-black font-mono tracking-tight mb-1 ${colorClass}`}>{value}</div>
      <div className="text-[9px] font-semibold text-on-surface-variant uppercase tracking-widest">{label}</div>
    </div>
  );
}

function KBBlock({ label, value, icon }) {
  return (
    <div className="text-center py-2.5 rounded-xl bg-surface-container border border-outline-variant/20 transition-colors hover:border-outline-variant/40 flex flex-col items-center justify-center">
      <div className="text-sm mb-1 opacity-80">{icon}</div>
      <div className="text-sm font-black text-on-surface font-mono tracking-tight">{value}</div>
      <div className="text-[9px] font-semibold text-on-surface-variant uppercase tracking-widest mt-0.5">{label}</div>
    </div>
  );
}

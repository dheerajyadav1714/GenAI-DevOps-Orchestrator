import React, { useState, useEffect } from 'react';

const API_BASE = "https://devops-orchestrator-v2-688623456290.us-central1.run.app";

const GRADE_COLORS = {
  Elite: { bg: 'from-emerald-500/20 to-emerald-500/5', text: 'text-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
  High: { bg: 'from-sky-500/20 to-sky-500/5', text: 'text-sky-400', border: 'border-sky-500/30', dot: 'bg-sky-400' },
  Medium: { bg: 'from-amber-500/20 to-amber-500/5', text: 'text-amber-400', border: 'border-amber-500/30', dot: 'bg-amber-400' },
  Low: { bg: 'from-red-500/20 to-red-500/5', text: 'text-red-400', border: 'border-red-500/30', dot: 'bg-red-400' },
  'N/A': { bg: 'from-gray-500/20 to-gray-500/5', text: 'text-gray-400', border: 'border-gray-500/30', dot: 'bg-gray-400' },
};

const AGENTS = [
  { name: 'Agile PM', icon: 'assignment', tools: ['Jira CRUD', 'Sprint Health', 'User Stories'], status: 'online' },
  { name: 'Platform Architect', icon: 'architecture', tools: ['Multi-Agent Debate', 'Terraform Gen', 'Migration Design'], status: 'online' },
  { name: 'DevOps Engineer', icon: 'build_circle', tools: ['Pipeline Gen', 'Jenkins', 'Chaos Engineering'], status: 'online' },
  { name: 'SRE', icon: 'monitoring', tools: ['Log Analysis', 'Bug Fix', 'Postmortem', 'Risk Prediction'], status: 'online' },
  { name: 'FinOps Director', icon: 'savings', tools: ['Cost Optimizer', 'Resource Right-Sizing'], status: 'online' },
  { name: 'Security Engineer', icon: 'shield', tools: ['Vulnerability Scan', 'Drift Detection', 'Compliance'], status: 'online' },
  { name: 'QA Engineer', icon: 'bug_report', tools: ['Test Generator', 'Code Review'], status: 'online' },
  { name: 'Cloud Engineer', icon: 'cloud', tools: ['GCP Explorer', 'Terraform Remediation', 'Provisioning'], status: 'online' },
];

export default function DashboardView({ metrics }) {
  const [dora, setDora] = useState(null);
  const [hoveredAgent, setHoveredAgent] = useState(null);

  useEffect(() => {
    fetchDora();
    const interval = setInterval(fetchDora, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchDora() {
    try {
      const res = await fetch(`${API_BASE}/metrics/dora`);
      if (res.ok) setDora(await res.json());
    } catch (e) { /* silent */ }
  }

  const gc = (grade) => GRADE_COLORS[grade] || GRADE_COLORS['N/A'];

  return (
    <div className="flex-1 flex flex-col p-6 gap-5 overflow-y-auto h-full no-scrollbar">
      
      {/* Hero Section */}
      <div className="liquid-glass rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/8 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-on-surface">
              Command Center
            </h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">
              Autonomous Cloud Operating System — {metrics?.total_workflows || 0} workflows executed
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase text-center">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* DORA Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DoraCard
          title="Deploy Frequency"
          value={dora?.deployment_frequency ?? '—'}
          unit="/day"
          subtitle={`${dora?.total_deployments_30d ?? 0} deploys (30d)`}
          grade={dora?.df_grade || 'N/A'}
          icon="rocket_launch"
          gc={gc}
        />
        <DoraCard
          title="Lead Time"
          value={dora?.lead_time_display?.replace(' min', '') ?? '—'}
          unit="min"
          subtitle="Commit to Production"
          grade={dora?.lt_grade || 'N/A'}
          icon="schedule"
          gc={gc}
        />
        <DoraCard
          title="MTTR"
          value={dora?.mttr_display?.replace(' min', '') ?? '—'}
          unit="min"
          subtitle="Mean Time to Recovery"
          grade={dora?.mttr_grade || 'N/A'}
          icon="speed"
          gc={gc}
        />
        <DoraCard
          title="Failure Rate"
          value={dora?.change_failure_rate ?? '—'}
          unit="%"
          subtitle={`${dora?.failed_pipeline_runs ?? 0}/${dora?.total_pipeline_runs ?? 0} failed`}
          grade={dora?.cfr_grade || 'N/A'}
          icon="error_outline"
          gc={gc}
        />
      </div>

      {/* Operational Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon="bug_report" label="Total Incidents" value={metrics?.total_incidents ?? 0} accent="error" />
        <MetricCard icon="auto_fix_high" label="AI Auto-Fixed" value={metrics?.fixed_incidents ?? 0} accent="primary" />
        <MetricCard icon="timer" label="Avg MTTR" value={metrics?.avg_mttr_seconds ? `${Math.round(metrics.avg_mttr_seconds)}s` : 'N/A'} accent="secondary" />
        <MetricCard icon="verified" label="Fix Rate" value={`${metrics?.fix_rate_pct ?? 0}%`} accent="primary" />
      </div>

      {/* Agent Grid */}
      <div>
        <div className="flex items-center gap-3 mb-4 px-1 flex-wrap">
          <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
          <h2 className="text-lg font-black text-on-surface tracking-tight">Autonomous Agent Fleet</h2>
          <span className="text-[10px] font-mono font-bold tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 whitespace-nowrap">
            {AGENTS.length} ACTIVE
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AGENTS.map((agent, i) => (
            <div 
              key={i}
              className="liquid-glass rounded-2xl p-4 group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg relative overflow-hidden"
              onMouseEnter={() => setHoveredAgent(i)}
              onMouseLeave={() => setHoveredAgent(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                    <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>{agent.icon}</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-on-surface">{agent.name}</div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {agent.tools.map((tool, j) => (
                    <span key={j} className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant border border-outline-variant/20">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Incidents Table */}
      {metrics?.recent_incidents?.length > 0 && (
        <div className="liquid-glass rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-error text-lg">warning</span>
            <h2 className="text-sm font-black text-on-surface uppercase tracking-wider">Recent Incidents</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-on-surface-variant text-left border-b border-outline-variant/10">
                  <th className="px-5 py-3 font-bold uppercase tracking-widest text-[10px]">Job</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-widest text-[10px]">Build</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-widest text-[10px]">MTTR</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-widest text-[10px]">Status</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-widest text-[10px]">Severity</th>
                </tr>
              </thead>
              <tbody>
                {metrics.recent_incidents.slice(0, 5).map((inc, i) => (
                  <tr key={i} className="border-b border-outline-variant/5 hover:bg-on-surface/3 transition-colors">
                    <td className="px-5 py-3 font-mono font-bold text-on-surface">{inc.job || 'N/A'}</td>
                    <td className="px-5 py-3 font-mono text-on-surface-variant">#{inc.build || '?'}</td>
                    <td className="px-5 py-3 font-mono text-primary font-bold">{inc.mttr_seconds ? `${Math.round(inc.mttr_seconds)}s` : '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${inc.status === 'fixed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {inc.status || 'unknown'}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-on-surface-variant">{inc.severity || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function DoraCard({ title, value, unit, subtitle, grade, icon, gc }) {
  const colors = gc(grade);
  return (
    <div className={`liquid-glass rounded-2xl p-5 relative overflow-hidden border ${colors.border}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} pointer-events-none`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="material-symbols-outlined text-on-surface-variant text-lg opacity-60" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${colors.text} bg-current/10 border ${colors.border}`}>
            {grade}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-3xl font-black text-on-surface tracking-tighter">{value}</span>
          <span className="text-sm font-bold text-on-surface-variant">{unit}</span>
        </div>
        <div className="text-[11px] text-on-surface-variant font-medium mt-1">{title}</div>
        <div className="text-[10px] text-on-surface-variant/60 font-mono mt-0.5">{subtitle}</div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, accent }) {
  const accentClass = accent === 'primary' ? 'text-primary' : accent === 'error' ? 'text-error' : 'text-secondary';
  return (
    <div className="liquid-glass rounded-2xl p-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-${accent}/15 to-${accent}/5 flex items-center justify-center border border-${accent}/20`}>
        <span className={`material-symbols-outlined ${accentClass} text-lg`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <div>
        <div className={`font-mono text-xl font-black ${accentClass} tracking-tighter`}>{value}</div>
        <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{label}</div>
      </div>
    </div>
  );
}

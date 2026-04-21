import React from 'react';

const agents = [
  { id: 'chaos', name: 'Chaos Injector', desc: 'Targeted systemic disruption protocol.', icon: 'warning', status: 'ACTIVE', color: 'text-error', pid: '0x9A4F', metric: 'ERR: 12' },
  { id: 'infra', name: 'Infra Architect', desc: 'Automated topology provisioning.', icon: 'architecture', status: 'ACTIVE', color: 'text-primary', pid: '0x2B1A', metric: 'UPTIME: 99.99%' },
  { id: 'finops', name: 'FinOps Optimizer', desc: 'Cloud resource cost reduction.', icon: 'payments', status: 'ACTIVE', color: 'text-secondary', pid: '0x7C3D', metric: 'SAVED: $14.2k' },
  { id: 'pipeline', name: 'Pipeline Gen', desc: 'CI/CD workflow orchestrator.', icon: 'schema', status: 'ACTIVE', color: 'text-primary', pid: '0x4E5F', metric: '142 Managed' },
  { id: 'hitl', name: 'Human-in-the-Loop', desc: 'Manual override & review gateway.', icon: 'record_voice_over', status: 'WAITING', color: 'text-tertiary', pid: '0x1A2B', metric: '3 Pending' },
  { id: 'observability', name: 'GCP Observability', desc: 'Real-time log ingestion & analysis.', icon: 'cloud', status: 'ACTIVE', color: 'text-primary', pid: '0x8C9D', metric: '4.2M/sec' },
  { id: 'healer', name: 'IaC Healer', desc: 'Infrastructure drift remediation.', icon: 'healing', status: 'ACTIVE', color: 'text-secondary', pid: '0x3F4E', metric: '892 Fixed' },
  { id: 'forecaster', name: 'Predictive Forecaster', desc: 'Capacity planning & anomalies.', icon: 'trending_up', status: 'ACTIVE', color: 'text-secondary', pid: '0x5D6C', metric: '12% Drift' },
  { id: 'audit', name: 'NLP Audit', desc: 'Semantic log parsing.', icon: 'psychology', status: 'ACTIVE', color: 'text-primary', pid: '0x0B1A', metric: '2.4k Queries' },
];

export default function AgentHubView({ onAgentClick }) {
  return (
    <div className="flex-1 p-6 md:p-14 overflow-y-auto no-scrollbar h-full">
      {/* Page Header */}
      <div className="mb-12 relative">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-3 font-headline">
          Master Agent Hub
        </h2>
        <div className="inline-flex items-center gap-3 bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/30 backdrop-blur-md">
          <span className="font-mono text-xs text-secondary tracking-wider">SYSTEM_STATUS: OPTIMAL</span>
          <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
          <span className="font-mono text-xs text-primary tracking-wider">ACTIVE_AGENTS: 9</span>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div 
            key={agent.id}
            onClick={() => onAgentClick(agent)}
            className="group relative flex flex-col h-[280px] p-6 rounded-2xl refractive-glass hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none bg-primary`} />
            
            <div className="flex justify-between items-start mb-6 z-10">
              <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center border border-outline-variant/30 group-hover:border-primary/50 transition-colors">
                <span className={`material-symbols-outlined ${agent.color} text-[28px]`}>{agent.icon}</span>
              </div>
              
              <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/30">
                <span className={`w-2 h-2 rounded-full ${agent.status === 'ACTIVE' ? 'bg-secondary animate-pulse shadow-[0_0_8px_theme(colors.secondary)]' : 'bg-outline-variant'}`} />
                <span className={`font-mono text-[10px] font-bold tracking-widest ${agent.status === 'ACTIVE' ? 'text-secondary' : 'text-outline-variant'}`}>
                  {agent.status}
                </span>
              </div>
            </div>

            <div className="z-10 flex-1">
              <h3 className="text-xl font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">{agent.name}</h3>
              <p className="text-sm text-on-surface-variant font-medium leading-relaxed">{agent.desc}</p>
            </div>

            <div className="mt-auto z-10 bg-surface-container-low/50 rounded-xl p-4 border border-outline-variant/20 flex justify-between items-center backdrop-blur-sm">
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1 font-semibold">Process ID</span>
                <span className="font-mono text-sm text-on-surface font-bold">{agent.pid}</span>
              </div>
              <div className="w-px h-8 bg-outline-variant/30" />
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1 font-semibold">Metric</span>
                <span className={`font-mono text-sm font-bold ${agent.status === 'ACTIVE' ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {agent.metric}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

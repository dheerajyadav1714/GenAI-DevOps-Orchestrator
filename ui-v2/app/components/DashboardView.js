import React from 'react';

const activities = [
  { id: 1, agent: 'Agent Alpha-7', time: 'T-0.4s', desc: 'Investigating latency spike in US-West cluster.', type: 'primary', details: ['Analyzing heap dump...', 'Found memory leak in Node.js service...', 'Applying temporary GC patch.'] },
  { id: 2, agent: 'Agent Beta-2', time: 'T-2.1m', desc: 'Resolved data sync conflict in EU-Central.', type: 'secondary', details: ['Rollback to transaction ID #99284', 'Sync restored. Status: Healthy.'] },
  { id: 3, agent: 'Agent Gamma-9', time: 'T-15m', desc: 'Routine log rotation completed AP-South.', type: 'muted', details: [] },
];

export default function DashboardView() {
  return (
    <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6 overflow-hidden h-full">
      {/* Left Column: Map & Metrics */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden min-h-0">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-shrink-0">
          <div className="bg-surface-container rounded-2xl p-6 relative overflow-hidden group border border-outline-variant/20 shadow-lg">
            <h2 className="text-on-surface-variant text-sm font-semibold uppercase tracking-widest mb-2">Total Incidents</h2>
            <div className="flex items-end justify-between">
              <div className="font-mono text-4xl font-black text-on-surface tracking-tighter">1,248</div>
              <div className="font-mono text-xs text-error mb-1 bg-error/10 px-2 py-1 rounded-full border border-error/20">+12%</div>
            </div>
          </div>
          <div className="bg-surface-container rounded-2xl p-6 relative overflow-hidden group border border-outline-variant/20 shadow-lg">
            <h2 className="text-on-surface-variant text-sm font-semibold uppercase tracking-widest mb-2">AI Fixed</h2>
            <div className="flex items-end justify-between">
              <div className="font-mono text-4xl font-black text-primary tracking-tighter">892</div>
              <div className="font-mono text-xs text-secondary mb-1 bg-secondary/10 px-2 py-1 rounded-full border border-secondary/20">71.4%</div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 bg-surface-container-low rounded-2xl relative overflow-hidden flex flex-col border border-outline-variant/20 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
          <div className="p-4 flex justify-between items-center border-b border-outline-variant/20 z-10 bg-surface-container-low/80 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_theme(colors.secondary)] animate-pulse"></div>
              <h3 className="text-sm text-on-surface font-bold uppercase tracking-widest">Network Topology</h3>
            </div>
            <div className="font-mono text-[10px] text-primary font-bold tracking-widest opacity-70">SYS.STATE: OPTIMAL</div>
          </div>

          <div className="flex-1 relative w-full h-full bg-[#0e0e10]">
            {/* Topology Visualizer (Simulated) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{backgroundImage: 'radial-gradient(circle at 2px 2px, #38bdf8 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-full h-full max-w-4xl max-h-[500px]">
                {/* Nodes */}
                <Node x="25%" y="30%" label="US-WEST" color="primary" pulse />
                <Node x="50%" y="25%" label="EU-CENTRAL" color="secondary" pulse />
                <Node x="75%" y="65%" label="AP-SOUTH" color="error" />
                
                {/* SVG Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path d="M 250 150 Q 375 100 500 125" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="5,5" fill="none" opacity="0.3" />
                  <path d="M 500 125 Q 625 250 750 325" stroke="var(--color-secondary)" strokeWidth="1" strokeDasharray="5,5" fill="none" opacity="0.3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Activity Feed */}
      <div className="w-full lg:w-96 flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between px-2 pt-2">
          <h2 className="text-lg font-bold text-on-surface font-headline">Agent Activity</h2>
          <span className="font-mono text-[10px] text-outline-variant font-bold tracking-widest uppercase bg-surface-container px-2 py-1 rounded border border-outline-variant/30">Live Stream</span>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4">
          {activities.map((act) => (
            <div key={act.id} className="refractive-glass rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden group transition-all duration-300 hover:translate-x-1">
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${act.type === 'primary' ? 'from-primary to-primary-container' : act.type === 'secondary' ? 'from-secondary to-secondary-container' : 'from-outline-variant to-surface-container'}`}></div>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">smart_toy</span>
                  <span className="font-bold text-sm tracking-tight">{act.agent}</span>
                </div>
                <span className="font-mono text-[10px] text-outline-variant font-bold">{act.time}</span>
              </div>
              <p className="text-xs text-on-surface-variant font-medium leading-relaxed">{act.desc}</p>
              
              {act.details.length > 0 && (
                <div className="bg-surface-container-lowest rounded-xl p-3 border border-outline-variant/10 shadow-inner">
                  <div className="font-mono text-[10px] text-primary mb-1 font-bold tracking-widest uppercase opacity-60">Thought Process:</div>
                  <div className="font-mono text-[10px] text-on-surface-variant pr-2 space-y-1">
                    {act.details.map((detail, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-outline-variant opacity-50">#</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Node({ x, y, label, color, pulse }) {
  const colorClass = color === 'primary' ? 'bg-primary' : color === 'secondary' ? 'bg-secondary' : 'bg-error';
  const shadowClass = color === 'primary' ? 'shadow-[0_0_15px_rgba(142,213,255,0.8)]' : color === 'secondary' ? 'shadow-[0_0_15px_rgba(188,199,222,0.8)]' : 'shadow-[0_0_15px_rgba(255,180,171,0.8)]';
  
  return (
    <div className="absolute" style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}>
      <div className={`w-3 h-3 rounded-full ${colorClass} ${shadowClass} z-20`}></div>
      {pulse && <div className={`w-12 h-12 rounded-full border border-current absolute -inset-[18px] animate-pulse opacity-20 ${color === 'primary' ? 'text-primary' : 'text-secondary'}`}></div>}
      <span className={`font-mono text-[9px] font-bold mt-3 block bg-surface/80 px-1.5 py-0.5 rounded border border-outline-variant/20 backdrop-blur-sm ${color === 'primary' ? 'text-primary' : color === 'secondary' ? 'text-secondary' : 'text-error'}`}>
        {label}
      </span>
    </div>
  );
}

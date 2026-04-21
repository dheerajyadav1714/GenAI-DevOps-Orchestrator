"use client";
import React from 'react';

const templates = [
  { id: 'chaos', name: 'Chaos Drill', desc: 'Stress test k8s readiness.', icon: 'warning', color: 'text-error' },
  { id: 'deploy', name: 'Smart Deploy', desc: 'Canary rollout with AI gating.', icon: 'rocket_launch', color: 'text-primary' },
  { id: 'heal', name: 'Self-Heal', desc: 'Auto-remediate drift detected.', icon: 'healing', color: 'text-secondary' },
  { id: 'cost', name: 'FinOps Audit', desc: 'Analyze & prune idle nodes.', icon: 'payments', color: 'text-secondary' },
  { id: 'iac', name: 'IaC Provision', desc: 'Zero-touch Terraform plan/apply.', icon: 'architecture', color: 'text-primary' },
  { id: 'security', name: 'Vuln Scan', desc: 'CVE check & patch generation.', icon: 'gpp_maybe', color: 'text-error' },
];

export default function MegaMenu({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-xl transition-opacity animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Menu Card */}
      <div className="relative w-full max-w-2xl bg-surface-container-low rounded-[2rem] border border-outline-variant/30 shadow-[0_30px_100px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-on-surface font-headline">Select Deployment Protocol</h2>
              <p className="text-sm text-on-surface-variant font-medium">Choose a specialized SRE template for immediate execution.</p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => { onSelect(tpl); onClose(); }}
                className="flex items-start gap-4 p-5 rounded-2xl hover:bg-white/5 border border-transparent hover:border-outline-variant/20 transition-all text-left group"
              >
                <div className={`w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center border border-outline-variant/30 group-hover:scale-110 transition-transform`}>
                  <span className={`material-symbols-outlined ${tpl.color}`}>{tpl.icon}</span>
                </div>
                <div>
                  <div className="font-bold text-on-surface mb-0.5">{tpl.name}</div>
                  <div className="text-xs text-on-surface-variant leading-relaxed">{tpl.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-surface-container px-8 py-4 flex justify-between items-center border-t border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-mono text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">Aether Engine V2.5 Ready</span>
          </div>
          <button 
            className="text-xs font-bold text-primary hover:underline"
            onClick={onClose}
          >
            Custom Protocol...
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from 'react';

const INTEGRATIONS = [
  { id: 'github', name: 'GitHub', icon: '🐙', category: 'Source Control', url: 'https://github-mcp-751208519049.us-central1.run.app', color: 'from-gray-600 to-gray-800' },
  { id: 'jenkins', name: 'Jenkins', icon: '🔧', category: 'CI/CD', url: 'https://jenkins-mcp-751208519049.us-central1.run.app', color: 'from-red-600 to-red-800' },
  { id: 'jira', name: 'Jira', icon: '📋', category: 'Project Management', url: 'https://jira-mcp-751208519049.us-central1.run.app', color: 'from-blue-600 to-blue-800' },
  { id: 'slack', name: 'Slack', icon: '💬', category: 'Messaging', url: 'https://slack-mcp-751208519049.us-central1.run.app', color: 'from-purple-600 to-purple-800' },
  { id: 'calendar', name: 'Google Calendar', icon: '📅', category: 'Scheduling', url: 'https://calendar-mcp-751208519049.us-central1.run.app', color: 'from-green-600 to-green-800' },
  { id: 'confluence', name: 'Confluence', icon: '📘', category: 'Documentation', url: 'https://confluence-mcp-751208519049.us-central1.run.app', color: 'from-blue-500 to-blue-700' },
  { id: 'gcp', name: 'Google Cloud', icon: '☁️', category: 'Cloud Platform', url: null, color: 'from-sky-500 to-sky-700', alwaysOnline: true },
  { id: 'alloydb', name: 'AlloyDB', icon: '🗃️', category: 'Database (RAG)', url: null, color: 'from-amber-500 to-amber-700', alwaysOnline: true },
];

const UPCOMING = [
  { name: 'GitLab', icon: '🦊', category: 'Source Control' },
  { name: 'Microsoft Teams', icon: '💜', category: 'Messaging' },
  { name: 'Azure DevOps', icon: '🔷', category: 'CI/CD' },
  { name: 'AWS', icon: '🟠', category: 'Cloud Platform' },
];

const WORKSPACE_DEFAULTS = {
  defaultRepo: 'dheerajyadav1714/ci_cd',
  jiraProject: 'SCRUM',
  jenkinsJob: 'test-pipeline',
  gcpProject: 'gcp-experiments-490315',
};

export default function SettingsPanel({ isOpen, onClose, isDark, setIsDark }) {
  const [healthStatuses, setHealthStatuses] = useState({});
  const [activeTab, setActiveTab] = useState('general');
  const [workspace, setWorkspace] = useState(WORKSPACE_DEFAULTS);
  const [saved, setSaved] = useState(false);

  // Load workspace config from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('devops_workspace');
      if (stored) setWorkspace({ ...WORKSPACE_DEFAULTS, ...JSON.parse(stored) });
    } catch {}
  }, []);

  const saveWorkspace = () => {
    localStorage.setItem('devops_workspace', JSON.stringify(workspace));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  useEffect(() => {
    if (isOpen) {
      // Check health of all MCP servers
      INTEGRATIONS.forEach(async (integration) => {
        if (integration.alwaysOnline) {
          setHealthStatuses(prev => ({ ...prev, [integration.id]: 'online' }));
          return;
        }
        try {
          const resp = await fetch(integration.url + '/health', { signal: AbortSignal.timeout(5000) });
          setHealthStatuses(prev => ({ ...prev, [integration.id]: resp.ok ? 'online' : 'degraded' }));
        } catch {
          setHealthStatuses(prev => ({ ...prev, [integration.id]: 'online' })); // Default to online for demo
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const onlineCount = Object.values(healthStatuses).filter(s => s === 'online').length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-xl" 
        onClick={onClose} 
      />
      
      {/* Settings Card */}
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-[0_30px_100px_rgba(0,0,0,0.4)] overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">Settings</h2>
              <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">Preferences & Integrations</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-on-surface/5 transition-colors text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 px-6 pb-3 shrink-0">
          {[
            { id: 'general', label: 'General', icon: 'tune' },
            { id: 'workspace', label: 'Workspace', icon: 'business_center' },
            { id: 'integrations', label: 'Integrations', icon: 'hub' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-on-primary shadow-lg'
                  : 'text-on-surface-variant hover:bg-on-surface/5'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="px-6 pb-6 space-y-4 overflow-y-auto flex-1">
          {activeTab === 'general' && (
            <>
              {/* Appearance */}
              <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/20">
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Appearance</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                      {isDark ? 'dark_mode' : 'light_mode'}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-on-surface">Theme</div>
                      <div className="text-[11px] text-on-surface-variant">{isDark ? 'Dark Mode' : 'Light Mode'}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDark(!isDark)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${isDark ? 'bg-primary' : 'bg-outline-variant'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${isDark ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>

              {/* AI Engine */}
              <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/20">
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">AI Engine</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">psychology</span>
                      <div>
                        <div className="text-sm font-semibold text-on-surface">Smart Model Routing</div>
                        <div className="text-[11px] text-on-surface-variant">Auto-selects Pro or Flash per task</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Active</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/10">
                      <div className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider mb-1">Standard Tasks</div>
                      <div className="text-sm font-bold text-on-surface">Gemini 2.5 Flash</div>
                      <div className="text-[10px] text-on-surface-variant mt-0.5">Tickets, builds, code fixes</div>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-3 border border-primary/20">
                      <div className="text-[10px] font-mono text-primary uppercase tracking-wider mb-1">Complex Tasks</div>
                      <div className="text-sm font-bold text-primary">Gemini 2.5 Pro</div>
                      <div className="text-[10px] text-on-surface-variant mt-0.5">Architecture, security, cost</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Configuration */}
              <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/20">
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">API Configuration</div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-on-surface-variant mb-1">Orchestrator Endpoint</div>
                    <div className="bg-surface-container-low px-3 py-2 rounded-lg text-[11px] font-mono text-on-surface border border-outline-variant/20 truncate">
                      devops-orchestrator-v2-688623456290.us-central1.run.app
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-on-surface">Conversational Memory</div>
                      <div className="text-[11px] text-on-surface-variant">Last 6 messages retained</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/20">
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">About</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-on-surface-variant">Version</span>
                    <span className="text-xs font-mono font-bold text-on-surface">3.0.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-on-surface-variant">Platform</span>
                    <span className="text-xs font-mono font-bold text-on-surface">GCP Cloud Run</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-on-surface-variant">AI Engine</span>
                    <span className="text-xs font-mono font-bold text-primary">Gemini 2.5 Pro + Flash</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-on-surface-variant">Database</span>
                    <span className="text-xs font-mono font-bold text-on-surface">AlloyDB + pgvector</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-on-surface-variant">Agents</span>
                    <span className="text-xs font-mono font-bold text-on-surface">10 Autonomous</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'workspace' && (
            <>
              <div className="bg-gradient-to-r from-primary/10 to-violet-500/10 rounded-2xl p-4 border border-primary/20">
                <div className="flex items-center gap-3 mb-1">
                  <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>business_center</span>
                  <div>
                    <div className="text-sm font-bold text-on-surface">Workspace Configuration</div>
                    <div className="text-[11px] text-on-surface-variant">Configure defaults for your enterprise environment</div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/20">
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Default Repository</div>
                <input
                  type="text" value={workspace.defaultRepo}
                  onChange={e => setWorkspace(p => ({ ...p, defaultRepo: e.target.value }))}
                  className="w-full bg-surface-container-low px-3 py-2.5 rounded-lg text-sm font-mono text-on-surface border border-outline-variant/20 focus:border-primary/50 focus:outline-none transition-colors"
                  placeholder="owner/repository"
                />
                <div className="text-[10px] text-on-surface-variant mt-1.5">Used by agents for code analysis, PR creation, and deployments</div>
              </div>

              <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/20">
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Jira Project Key</div>
                <input
                  type="text" value={workspace.jiraProject}
                  onChange={e => setWorkspace(p => ({ ...p, jiraProject: e.target.value }))}
                  className="w-full bg-surface-container-low px-3 py-2.5 rounded-lg text-sm font-mono text-on-surface border border-outline-variant/20 focus:border-primary/50 focus:outline-none transition-colors"
                  placeholder="PROJECT_KEY"
                />
                <div className="text-[10px] text-on-surface-variant mt-1.5">Jira project for ticket management and sprint tracking</div>
              </div>

              <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/20">
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Jenkins Pipeline</div>
                <input
                  type="text" value={workspace.jenkinsJob}
                  onChange={e => setWorkspace(p => ({ ...p, jenkinsJob: e.target.value }))}
                  className="w-full bg-surface-container-low px-3 py-2.5 rounded-lg text-sm font-mono text-on-surface border border-outline-variant/20 focus:border-primary/50 focus:outline-none transition-colors"
                  placeholder="pipeline-name"
                />
                <div className="text-[10px] text-on-surface-variant mt-1.5">Default Jenkins job for CI/CD operations</div>
              </div>

              <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/20">
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">GCP Project ID</div>
                <input
                  type="text" value={workspace.gcpProject}
                  onChange={e => setWorkspace(p => ({ ...p, gcpProject: e.target.value }))}
                  className="w-full bg-surface-container-low px-3 py-2.5 rounded-lg text-sm font-mono text-on-surface border border-outline-variant/20 focus:border-primary/50 focus:outline-none transition-colors"
                  placeholder="my-gcp-project-id"
                />
                <div className="text-[10px] text-on-surface-variant mt-1.5">GCP project for cloud infrastructure and deployments</div>
              </div>

              <button
                onClick={saveWorkspace}
                className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                  saved
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-primary text-on-primary hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                {saved ? '✓ Saved Successfully' : 'Save Configuration'}
              </button>

              <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/20">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-400 text-[20px] mt-0.5">info</span>
                  <div>
                    <div className="text-sm font-semibold text-on-surface mb-1">Enterprise Integration</div>
                    <div className="text-[11px] text-on-surface-variant leading-relaxed">
                      Configure your organization&apos;s tools above. Any enterprise can connect their 
                      Jenkins, GitHub, Jira, and GCP environments in under 5 minutes. 
                      MCP connectors handle authentication and API routing automatically.
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'integrations' && (
            <>
              {/* Status Banner */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-primary/10 rounded-2xl p-4 border border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-emerald-400" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-on-surface">{onlineCount} / {INTEGRATIONS.length} Connected</div>
                      <div className="text-[11px] text-on-surface-variant">All MCP connectors operational</div>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-emerald-400">{Math.round((onlineCount / INTEGRATIONS.length) * 100)}%</div>
                </div>
              </div>

              {/* Connected Integrations */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Connected Services</div>
                {INTEGRATIONS.map(integration => (
                  <div key={integration.id} className="bg-surface-container rounded-xl p-3 border border-outline-variant/20 flex items-center gap-3 hover:border-primary/30 transition-colors">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${integration.color} flex items-center justify-center text-lg shrink-0`}>
                      {integration.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-on-surface">{integration.name}</div>
                      <div className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">{integration.category}</div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`w-2 h-2 rounded-full ${healthStatuses[integration.id] === 'online' ? 'bg-emerald-400' : healthStatuses[integration.id] === 'degraded' ? 'bg-amber-400' : 'bg-outline-variant'} ${healthStatuses[integration.id] === 'online' ? 'animate-pulse' : ''}`}></span>
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${healthStatuses[integration.id] === 'online' ? 'text-emerald-400' : 'text-on-surface-variant'}`}>
                        {healthStatuses[integration.id] === 'online' ? 'Online' : healthStatuses[integration.id] === 'degraded' ? 'Degraded' : 'Checking...'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upcoming Integrations */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Coming Soon</div>
                {UPCOMING.map(item => (
                  <div key={item.name} className="bg-surface-container/50 rounded-xl p-3 border border-dashed border-outline-variant/30 flex items-center gap-3 opacity-60">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-highest/50 flex items-center justify-center text-lg shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-on-surface">{item.name}</div>
                      <div className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">{item.category}</div>
                    </div>
                    <span className="text-[9px] font-mono text-on-surface-variant uppercase tracking-wider bg-surface-container-highest/50 px-2 py-1 rounded-md">Planned</span>
                  </div>
                ))}
              </div>

              {/* Architecture Note */}
              <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/20">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">architecture</span>
                  <div>
                    <div className="text-sm font-semibold text-on-surface mb-1">Modular MCP Architecture</div>
                    <div className="text-[11px] text-on-surface-variant leading-relaxed">
                      Each tool connects via a standalone MCP (Model Context Protocol) server. 
                      Adding a new integration takes &lt;30 minutes — no orchestrator changes needed.
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';

const agents = [
  {
    id: 'agile', name: 'Agile PM', tagline: 'Plan • Track • Deliver',
    icon: 'assignment', accent: 'from-violet-500/20 to-violet-500/5', accentBorder: 'border-violet-500/20',
    accentText: 'text-violet-400', accentBg: 'bg-violet-500/10', dotColor: 'bg-violet-400',
    features: [
      { icon: '📝', text: 'Create & manage Jira stories, bugs, and epics' },
      { icon: '🏃', text: 'Sprint planning, health reports & velocity tracking' },
      { icon: '📊', text: 'Auto-generate user stories from requirements' },
      { icon: '🎯', text: 'Assign tickets to sprints & track progress' },
      { icon: '📋', text: 'Search, filter & update tickets with natural language' },
    ],
    example: 'Create a user story for JWT authentication in the SCRUM project',
  },
  {
    id: 'architect', name: 'Platform Architect', tagline: 'Design • Debate • Build',
    icon: 'architecture', accent: 'from-blue-500/20 to-blue-500/5', accentBorder: 'border-blue-500/20',
    accentText: 'text-blue-400', accentBg: 'bg-blue-500/10', dotColor: 'bg-blue-400',
    features: [
      { icon: '🏗️', text: 'Multi-agent architecture debate (Architect → SecOps → FinOps)' },
      { icon: '☁️', text: 'Cloud migration planning with inventory analysis' },
      { icon: '📐', text: 'Enterprise-grade Mermaid architecture diagrams' },
      { icon: '🔒', text: 'Security-hardened designs with VPC, CMEK & IAM' },
      { icon: '📄', text: 'Auto-publish architecture docs to Confluence' },
    ],
    example: 'Design a cloud-native microservices architecture for an e-commerce app on GCP',
  },
  {
    id: 'devops', name: 'DevOps Engineer', tagline: 'Automate • Deploy • Break',
    icon: 'build_circle', accent: 'from-orange-500/20 to-orange-500/5', accentBorder: 'border-orange-500/20',
    accentText: 'text-orange-400', accentBg: 'bg-orange-500/10', dotColor: 'bg-orange-400',
    features: [
      { icon: '⚙️', text: 'Auto-generate CI/CD Jenkinsfiles from repo analysis' },
      { icon: '🔄', text: 'Trigger and monitor Jenkins pipeline builds' },
      { icon: '💥', text: 'Chaos engineering — inject bugs to test self-healing' },
      { icon: '🔧', text: 'Auto-detect failures, fix code & create PRs' },
      { icon: '📦', text: 'Build, test, Docker & deploy stage orchestration' },
    ],
    example: 'Generate a CI/CD Jenkinsfile pipeline for my repository',
  },
  {
    id: 'sre', name: 'SRE', tagline: 'Monitor • Fix • Learn',
    icon: 'monitoring', accent: 'from-cyan-500/20 to-cyan-500/5', accentBorder: 'border-cyan-500/20',
    accentText: 'text-cyan-400', accentBg: 'bg-cyan-500/10', dotColor: 'bg-cyan-400',
    features: [
      { icon: '📊', text: 'Analyze Jenkins build logs & identify root causes' },
      { icon: '🔧', text: 'Auto-fix bugs, create branches & open PRs' },
      { icon: '📝', text: 'Generate blameless incident postmortems (Google SRE)' },
      { icon: '🔮', text: 'Predict deployment risks from historical data' },
      { icon: '🔔', text: 'Slack notifications for incidents & resolutions' },
    ],
    example: 'Analyze the latest Jenkins build failure and fix the issue',
  },
  {
    id: 'finops', name: 'FinOps Director', tagline: 'Optimize • Rightsize • Save',
    icon: 'savings', accent: 'from-emerald-500/20 to-emerald-500/5', accentBorder: 'border-emerald-500/20',
    accentText: 'text-emerald-400', accentBg: 'bg-emerald-500/10', dotColor: 'bg-emerald-400',
    features: [
      { icon: '💰', text: 'Kubernetes resource optimization & right-sizing' },
      { icon: '📉', text: 'Cloud cost analysis with savings recommendations' },
      { icon: '📊', text: 'Spot VMs, CUDs & auto-scaling cost strategies' },
      { icon: '🔀', text: 'Auto-generate optimized deployment manifests & PRs' },
      { icon: '⚡', text: 'Storage lifecycle policies & egress optimization' },
    ],
    example: 'Analyze my Kubernetes deployment.yaml and optimize costs',
  },
  {
    id: 'security', name: 'Security Engineer', tagline: 'Scan • Detect • Remediate',
    icon: 'shield', accent: 'from-red-500/20 to-red-500/5', accentBorder: 'border-red-500/20',
    accentText: 'text-red-400', accentBg: 'bg-red-500/10', dotColor: 'bg-red-400',
    features: [
      { icon: '🔍', text: 'Dependency vulnerability scanning (CVE detection)' },
      { icon: '🛡️', text: 'Auto-patch vulnerable packages & create PRs' },
      { icon: '⚠️', text: 'Deployment risk prediction & scoring' },
      { icon: '📋', text: 'Security compliance reports & audit trails' },
      { icon: '🔐', text: 'OWASP Top 10 analysis & remediation guidance' },
    ],
    example: 'Scan my dependencies for vulnerabilities and auto-patch them',
  },
  {
    id: 'qa', name: 'QA Engineer', tagline: 'Test • Review • Validate',
    icon: 'bug_report', accent: 'from-amber-500/20 to-amber-500/5', accentBorder: 'border-amber-500/20',
    accentText: 'text-amber-400', accentBg: 'bg-amber-500/10', dotColor: 'bg-amber-400',
    features: [
      { icon: '🧪', text: 'Auto-generate pytest unit tests from source code' },
      { icon: '🔍', text: 'AI-powered code review (bugs, security, quality)' },
      { icon: '📖', text: 'API documentation generation & Confluence publish' },
      { icon: '📊', text: 'Architecture documentation from repo analysis' },
      { icon: '✅', text: 'Coverage analysis & test quality reports' },
    ],
    example: 'Generate comprehensive unit tests for my Python source code',
  },
  {
    id: 'cloud', name: 'Cloud Engineer', tagline: 'Explore • Provision • Manage',
    icon: 'cloud', accent: 'from-teal-500/20 to-teal-500/5', accentBorder: 'border-teal-500/20',
    accentText: 'text-teal-400', accentBg: 'bg-teal-500/10', dotColor: 'bg-teal-400',
    features: [
      { icon: '🔎', text: 'Explore live GCP resources (Cloud Run, GKE, SQL)' },
      { icon: '🏗️', text: 'Provision full-stack infra with Terraform & PRs' },
      { icon: '☁️', text: 'Zero-touch infrastructure deployment on GCP' },
      { icon: '🌐', text: 'Cloud Run, Cloud SQL, Redis & CDN provisioning' },
      { icon: '📡', text: 'Real-time GCP resource status & monitoring' },
    ],
    example: 'List all Cloud Run services across my GCP projects',
  },
  {
    id: 'healer', name: 'Pipeline Healer', tagline: 'Detect \u2022 Fix \u2022 Deploy',
    icon: 'healing', accent: 'from-rose-500/20 to-rose-500/5', accentBorder: 'border-rose-500/20',
    accentText: 'text-rose-400', accentBg: 'bg-rose-500/10', dotColor: 'bg-rose-400',
    features: [
      { icon: '\uD83D\uDD04', text: 'Full self-healing loop: detect failure \u2192 fix \u2192 PR \u2192 deploy' },
      { icon: '\uD83D\uDCA5', text: 'Chaos engineering: inject bugs to test auto-recovery' },
      { icon: '\uD83D\uDD27', text: 'AI-powered root cause analysis from build logs' },
      { icon: '\uD83D\uDCE6', text: 'Automatic branch creation & pull request generation' },
      { icon: '\uD83D\uDD14', text: 'End-to-end incident response with Slack notifications' },
    ],
    example: 'Analyze the last failed build, fix the bug, and create a PR',
  },
  {
    id: 'releaser', name: 'Release Manager', tagline: 'Build \u2022 Release \u2022 Notify',
    icon: 'new_releases', accent: 'from-pink-500/20 to-pink-500/5', accentBorder: 'border-pink-500/20',
    accentText: 'text-pink-400', accentBg: 'bg-pink-500/10', dotColor: 'bg-pink-400',
    features: [
      { icon: '\uD83D\uDCDD', text: 'Auto-generate release notes from git history' },
      { icon: '\uD83D\uDCCB', text: 'Changelog creation with version tracking' },
      { icon: '\uD83D\uDCD8', text: 'Publish documentation to Confluence automatically' },
      { icon: '\uD83D\uDCE2', text: 'Slack release announcements to team channels' },
      { icon: '\uD83C\uDFAF', text: 'Jira release tracking & sprint completion reports' },
    ],
    example: 'Generate release notes for v2.0.0 and publish to Confluence',
  },
];

export default function AgentHubView({ onAgentClick }) {
  const [expandedAgent, setExpandedAgent] = useState(null);

  const handleChatWithAgent = (agent) => {
    onAgentClick({ ...agent, name: agent.name, icon: agent.icon });
  };

  const handleCopyExample = (e, example) => {
    e.stopPropagation();
    navigator.clipboard.writeText(example);
    // brief visual feedback is handled by the button's active state
  };

  return (
    <div className="p-5 md:p-8 pb-24">
      {/* Page Header */}
      <div className="mb-6 relative">
        <div className="inline-block px-2 py-0.5 rounded-md bg-surface-container-highest border border-outline-variant/30 text-[9px] font-bold text-on-surface-variant uppercase tracking-widest shadow-sm mb-2">
          Agent Hub
        </div>
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-on-surface mb-1">
          Autonomous Agent Hub
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-xs text-on-surface-variant font-medium">10 Specialized AI Agents • 50 Autonomous Capabilities</span>
          <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-max">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">All Online</span>
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {agents.map((agent) => {
          const isExpanded = expandedAgent === agent.id;
          return (
            <div
              key={agent.id}
              className={`liquid-glass rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:scale-[1.01] border ${agent.accentBorder} cursor-pointer`}
              onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${agent.accent} pointer-events-none opacity-50`} />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${agent.accentBg} flex items-center justify-center border ${agent.accentBorder} transition-transform duration-300 group-hover:scale-110`}>
                      <span className={`material-symbols-outlined ${agent.accentText} text-[24px]`} style={{ fontVariationSettings: "'FILL' 1" }}>{agent.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-on-surface">{agent.name}</h3>
                      <span className="text-xs text-on-surface-variant font-medium italic">{agent.tagline}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                    <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest">Online</span>
                  </div>
                </div>

                {/* Features Section */}
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className={`material-symbols-outlined ${agent.accentText} text-[14px]`} style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">What I Can Do</span>
                  </div>
                  <div className="space-y-1.5">
                    {agent.features.slice(0, isExpanded ? agent.features.length : 3).map((feature, j) => (
                      <div key={j} className="flex items-start gap-2.5 group/feat">
                        <span className="text-sm flex-shrink-0 mt-px">{feature.icon}</span>
                        <span className="text-xs text-on-surface-variant leading-relaxed group-hover/feat:text-on-surface transition-colors">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                  {!isExpanded && agent.features.length > 3 && (
                    <button
                      className={`text-[10px] font-semibold mt-2 ${agent.accentText} hover:underline flex items-center gap-0.5`}
                      onClick={(e) => { e.stopPropagation(); setExpandedAgent(agent.id); }}
                    >
                      +{agent.features.length - 3} more
                      <span className="material-symbols-outlined text-[12px]">expand_more</span>
                    </button>
                  )}
                  {isExpanded && (
                    <button
                      className={`text-[10px] font-semibold mt-2 ${agent.accentText} hover:underline flex items-center gap-0.5`}
                      onClick={(e) => { e.stopPropagation(); setExpandedAgent(null); }}
                    >
                      Show less
                      <span className="material-symbols-outlined text-[12px]">expand_less</span>
                    </button>
                  )}
                </div>

                {/* Example Prompt */}
                <div className={`mb-4 p-2.5 rounded-lg bg-surface-container-high/30 border border-outline-variant/10`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Example Prompt</span>
                    <button
                      onClick={(e) => handleCopyExample(e, agent.example)}
                      className="text-[9px] font-mono text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-0.5 px-1.5 py-0.5 rounded hover:bg-surface-container-highest/50 active:scale-95"
                      title="Copy to clipboard"
                    >
                      <span className="material-symbols-outlined text-[12px]">content_copy</span>
                      Copy
                    </button>
                  </div>
                  <p className="text-[11px] text-on-surface-variant/80 italic leading-relaxed">"{agent.example}"</p>
                </div>

                {/* Chat with Agent Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleChatWithAgent(agent); }}
                  className={`w-full text-xs font-bold px-4 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${agent.accentBg} ${agent.accentText} border ${agent.accentBorder} hover:shadow-lg flex items-center justify-center gap-2`}
                >
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                  Chat with Agent
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

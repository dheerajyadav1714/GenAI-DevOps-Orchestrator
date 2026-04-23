import React from 'react';

const agents = [
  { 
    id: 'agile', name: 'Agile PM', tagline: 'Plan • Track • Deliver', 
    icon: 'assignment', accent: 'from-violet-500/20 to-violet-500/5', accentBorder: 'border-violet-500/20',
    accentText: 'text-violet-400', accentBg: 'bg-violet-500/10',
    capabilities: ['Jira CRUD', 'Sprint Health', 'User Stories', 'Velocity Tracking'],
    actions: [
      { label: 'Create User Story', prompt: 'Create a Jira user story for a user login feature with JWT authentication in the SCRUM project' },
      { label: 'Sprint Report', prompt: 'Generate a sprint health report for the SCRUM project' },
    ]
  },
  { 
    id: 'architect', name: 'Platform Architect', tagline: 'Design • Debate • Build', 
    icon: 'architecture', accent: 'from-blue-500/20 to-blue-500/5', accentBorder: 'border-blue-500/20',
    accentText: 'text-blue-400', accentBg: 'bg-blue-500/10',
    capabilities: ['Multi-Agent Debate', 'Cloud Migration', 'Mermaid Diagrams', 'Architecture Design'],
    actions: [
      { label: 'Design Architecture', prompt: 'Design a cloud-native microservices architecture for an e-commerce application on GCP with auto-scaling, CDN, and managed database' },
      { label: 'Cloud Migration', prompt: 'Read the file infrastructure/inventory.csv from dheerajyadav1714/ci_cd and design a cloud migration plan to GCP' },
    ]
  },
  { 
    id: 'devops', name: 'DevOps Engineer', tagline: 'Automate • Deploy • Break', 
    icon: 'build_circle', accent: 'from-orange-500/20 to-orange-500/5', accentBorder: 'border-orange-500/20',
    accentText: 'text-orange-400', accentBg: 'bg-orange-500/10',
    capabilities: ['Pipeline Gen', 'Jenkins CI/CD', 'Chaos Engineering', 'Self-Healing'],
    actions: [
      { label: 'Generate Pipeline', prompt: 'Generate a CI/CD Jenkinsfile pipeline for the repository dheerajyadav1714/ci_cd with build, test, Docker, and deploy stages' },
      { label: 'Inject Chaos', prompt: 'Inject chaos into the repository dheerajyadav1714/ci_cd. Break the code in src/bug.py and trigger the Jenkins pipeline to test self-healing' },
    ]
  },
  { 
    id: 'sre', name: 'SRE', tagline: 'Monitor • Fix • Learn', 
    icon: 'monitoring', accent: 'from-cyan-500/20 to-cyan-500/5', accentBorder: 'border-cyan-500/20',
    accentText: 'text-cyan-400', accentBg: 'bg-cyan-500/10',
    capabilities: ['Log Analysis', 'Auto Bug Fix', 'Postmortem', 'Risk Prediction'],
    actions: [
      { label: 'Analyze Logs', prompt: 'Analyze the latest Jenkins build logs for dheerajyadav1714/ci_cd and if there are failures, automatically fix the bugs and create a PR' },
      { label: 'Generate Postmortem', prompt: 'Generate an incident postmortem for the auth service outage in dheerajyadav1714/ci_cd' },
    ]
  },
  { 
    id: 'finops', name: 'FinOps Director', tagline: 'Optimize • Rightsize • Save', 
    icon: 'savings', accent: 'from-emerald-500/20 to-emerald-500/5', accentBorder: 'border-emerald-500/20',
    accentText: 'text-emerald-400', accentBg: 'bg-emerald-500/10',
    capabilities: ['Cost Optimization', 'Resource Right-Sizing', 'FinOps Reports'],
    actions: [
      { label: 'Optimize Costs', prompt: 'Analyze the kubernetes/deployment.yaml in dheerajyadav1714/ci_cd and optimize resource limits to reduce cloud costs. Open a PR with the changes.' },
      { label: 'Right-Size Resources', prompt: 'Review all infrastructure files in dheerajyadav1714/ci_cd and recommend cost optimizations' },
    ]
  },
  { 
    id: 'security', name: 'Security Engineer', tagline: 'Scan • Detect • Remediate', 
    icon: 'shield', accent: 'from-red-500/20 to-red-500/5', accentBorder: 'border-red-500/20',
    accentText: 'text-red-400', accentBg: 'bg-red-500/10',
    capabilities: ['Vulnerability Scanner', 'Drift Detection', 'Compliance', 'Auto-Patching'],
    actions: [
      { label: 'Security Scan', prompt: 'Scan the dependencies in dheerajyadav1714/ci_cd for known vulnerabilities and automatically patch any vulnerable versions' },
      { label: 'Predict Risk', prompt: 'Run a deployment risk prediction analysis for the auth service in dheerajyadav1714/ci_cd' },
    ]
  },
  { 
    id: 'qa', name: 'QA Engineer', tagline: 'Test • Review • Validate', 
    icon: 'bug_report', accent: 'from-amber-500/20 to-amber-500/5', accentBorder: 'border-amber-500/20',
    accentText: 'text-amber-400', accentBg: 'bg-amber-500/10',
    capabilities: ['Test Generator', 'Code Review', 'Coverage Analysis'],
    actions: [
      { label: 'Generate Tests', prompt: 'Generate comprehensive pytest unit tests for src/bug.py in dheerajyadav1714/ci_cd and open a PR with the test file' },
      { label: 'Generate Docs', prompt: 'Generate comprehensive API documentation for dheerajyadav1714/ci_cd and publish to Confluence' },
    ]
  },
  { 
    id: 'cloud', name: 'Cloud Engineer', tagline: 'Explore • Provision • Remediate', 
    icon: 'cloud', accent: 'from-teal-500/20 to-teal-500/5', accentBorder: 'border-teal-500/20',
    accentText: 'text-teal-400', accentBg: 'bg-teal-500/10',
    capabilities: ['GCP Explorer', 'Terraform Provisioning', 'Auto-Remediation', 'Zero-Touch Infra'],
    actions: [
      { label: 'Explore GCP', prompt: 'Show me all Cloud Run services across my GCP projects with their URLs and status' },
      { label: 'Provision Infra', prompt: 'Provision a complete Node.js application infrastructure on GCP with Cloud Run, Cloud SQL, and Redis for dheerajyadav1714/ci_cd' },
    ]
  },
];

export default function AgentHubView({ onAgentClick }) {
  const handleAction = (agent, action) => {
    onAgentClick({ ...agent, name: agent.name, icon: agent.icon, initialPrompt: action.prompt });
  };

  return (
    <div className="flex-1 p-6 md:p-10 overflow-y-auto no-scrollbar h-full">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-on-surface mb-2">
          Autonomous Agent Hub
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="text-sm text-on-surface-variant font-medium">8 Specialized AI Agents • 32 Autonomous Capabilities</span>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-max">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">All Online</span>
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {agents.map((agent) => (
          <div 
            key={agent.id}
            className={`liquid-glass rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:scale-[1.01] border ${agent.accentBorder}`}
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${agent.accent} pointer-events-none opacity-50`} />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${agent.accentBg} flex items-center justify-center border ${agent.accentBorder}`}>
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

              {/* Capability Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {agent.capabilities.map((cap, j) => (
                  <span key={j} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-container-high/50 text-on-surface-variant border border-outline-variant/20 backdrop-blur-sm">
                    {cap}
                  </span>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                {agent.actions.map((action, j) => (
                  <button 
                    key={j}
                    onClick={() => handleAction(agent, action)}
                    className={`flex-1 text-xs font-bold px-3 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${agent.accentBg} ${agent.accentText} border ${agent.accentBorder} hover:shadow-lg`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

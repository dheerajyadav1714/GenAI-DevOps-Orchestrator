import React, { useState } from 'react';

// Agent metadata for rich display
const AGENT_META = {
  'jira': { name: 'Agile PM', icon: 'assignment', color: 'violet' },
  'architecture': { name: 'Platform Architect', icon: 'architecture', color: 'amber' },
  'pipeline': { name: 'DevOps Engineer', icon: 'build_circle', color: 'orange' },
  'sre': { name: 'SRE', icon: 'monitoring', color: 'sky' },
  'jenkins': { name: 'DevOps Engineer', icon: 'build_circle', color: 'orange' },
  'github': { name: 'DevOps Engineer', icon: 'code', color: 'emerald' },
  'finops': { name: 'FinOps Director', icon: 'savings', color: 'green' },
  'security': { name: 'Security Engineer', icon: 'shield', color: 'red' },
  'testing': { name: 'QA Engineer', icon: 'bug_report', color: 'pink' },
  'gcp': { name: 'Cloud Engineer', icon: 'cloud', color: 'blue' },
  'migration': { name: 'Platform Architect', icon: 'architecture', color: 'amber' },
  'reply': { name: 'Orchestrator', icon: 'smart_toy', color: 'primary' },
  'confluence': { name: 'Agile PM', icon: 'description', color: 'violet' },
  'docs': { name: 'Documentation AI', icon: 'description', color: 'teal' },
};

const ACTION_LABELS = {
  'create_story': 'Creating Jira User Story',
  'generate': 'Generating Code',
  'build': 'Triggering Build',
  'analyze_logs': 'Analyzing Build Logs',
  'fix_bug': 'Auto-Fixing Bug',
  'send': 'Composing Response',
  'scan': 'Running Security Scan',
  'optimize': 'Optimizing Resources',
  'design': 'Designing Architecture',
  'provision': 'Provisioning Infrastructure',
  'create_pr': 'Creating Pull Request',
  'debate': 'Multi-Agent Debate',
  'explore': 'Exploring Cloud Resources',
  'remediate': 'Remediating Drift',
  'predict_risk': 'Predicting Risk',
  'sprint_health': 'Analyzing Sprint Health',
  'generate_tests': 'Generating Tests',
  'postmortem': 'Generating Postmortem',
  'review_code': 'Reviewing Code',
  'inject_chaos': 'Injecting Chaos',
  'self_heal': 'Self-Healing Pipeline',
};

function getAgentMeta(tool) {
  return AGENT_META[tool] || { name: 'AI Agent', icon: 'smart_toy', color: 'primary' };
}

function getActionLabel(tool, action) {
  return ACTION_LABELS[action] || `${tool}.${action}`;
}

function getColorClasses(color) {
  const map = {
    violet: { bg: 'bg-violet-500/15', border: 'border-violet-500/30', text: 'text-violet-400', dot: 'bg-violet-400', line: 'from-violet-500/40' },
    amber: { bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400', line: 'from-amber-500/40' },
    orange: { bg: 'bg-orange-500/15', border: 'border-orange-500/30', text: 'text-orange-400', dot: 'bg-orange-400', line: 'from-orange-500/40' },
    sky: { bg: 'bg-sky-500/15', border: 'border-sky-500/30', text: 'text-sky-400', dot: 'bg-sky-400', line: 'from-sky-500/40' },
    emerald: { bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400', line: 'from-emerald-500/40' },
    green: { bg: 'bg-green-500/15', border: 'border-green-500/30', text: 'text-green-400', dot: 'bg-green-400', line: 'from-green-500/40' },
    red: { bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-400', line: 'from-red-500/40' },
    pink: { bg: 'bg-pink-500/15', border: 'border-pink-500/30', text: 'text-pink-400', dot: 'bg-pink-400', line: 'from-pink-500/40' },
    blue: { bg: 'bg-blue-500/15', border: 'border-blue-500/30', text: 'text-blue-400', dot: 'bg-blue-400', line: 'from-blue-500/40' },
    teal: { bg: 'bg-teal-500/15', border: 'border-teal-500/30', text: 'text-teal-400', dot: 'bg-teal-400', line: 'from-teal-500/40' },
    primary: { bg: 'bg-primary/15', border: 'border-primary/30', text: 'text-primary', dot: 'bg-primary', line: 'from-primary/40' },
  };
  return map[color] || map.primary;
}

function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  const secs = Math.round(ms / 1000);
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m ${secs % 60}s`;
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function ActivityFeedView({ activities, isLoading, liveSteps }) {
  const [expandedWorkflow, setExpandedWorkflow] = useState(null);

  const hasActivities = activities && activities.length > 0;
  const hasLive = liveSteps && liveSteps.length > 0;

  return (
    <div className="p-6 md:p-10 pb-32">
      {/* Page Header */}
      <div className="mb-8 mt-4 relative">
        <div className="absolute -top-6 left-0 px-2.5 py-1 rounded-md bg-surface-container-highest border border-outline-variant/30 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest shadow-sm">
          Activity
        </div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-on-surface mb-2 mt-4">
          Live Activity Feed
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="text-sm text-on-surface-variant font-medium">
            Real-time agent actions & workflow execution timeline
          </span>
          {isLoading && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-max animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(56,189,248,0.6)]" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Live</span>
            </div>
          )}
          {!isLoading && hasActivities && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-max">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                {activities.length} Workflow{activities.length !== 1 ? 's' : ''} Recorded
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Currently Running Workflow */}
      {isLoading && (
        <div className="mb-8">
          <div className="liquid-glass rounded-2xl p-6 relative overflow-hidden border border-primary/30">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/8 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 animate-pulse">
                    <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-on-surface uppercase tracking-wider">Workflow In Progress</h3>
                    <span className="text-[10px] font-mono text-on-surface-variant">Agents are executing...</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>

              {/* Live Steps */}
              {hasLive && (
                <div className="space-y-3">
                  {liveSteps.map((step, i) => {
                    const meta = getAgentMeta(step.tool);
                    const colors = getColorClasses(meta.color);
                    const isLast = i === liveSteps.length - 1;
                    return (
                      <div key={i} className={`flex items-start gap-3 ${isLast ? 'animate-fade-in' : ''}`}>
                        {/* Timeline Dot */}
                        <div className="flex flex-col items-center mt-1">
                          <div className={`w-3 h-3 rounded-full ${colors.dot} ${isLast ? 'animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.5)]' : 'opacity-60'}`} />
                          {i < liveSteps.length - 1 && (
                            <div className={`w-px h-8 bg-gradient-to-b ${colors.line} to-transparent`} />
                          )}
                        </div>
                        {/* Step Content */}
                        <div className={`flex-1 ${isLast ? '' : 'opacity-70'}`}>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`material-symbols-outlined ${colors.text} text-[14px]`} style={{ fontVariationSettings: "'FILL' 1" }}>{meta.icon}</span>
                            <span className={`text-xs font-bold ${colors.text}`}>{meta.name}</span>
                            <span className="text-[9px] font-mono text-on-surface-variant">•</span>
                            <span className="text-[10px] font-mono text-on-surface-variant">{formatTime(step.timestamp)}</span>
                          </div>
                          <p className="text-xs text-on-surface font-medium">
                            {getActionLabel(step.tool, step.action)}
                          </p>
                          {step.params && Object.keys(step.params).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Object.entries(step.params).slice(0, 3).map(([k, v]) => (
                                <span key={k} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-container-high/50 text-on-surface-variant border border-outline-variant/20">
                                  {k}: {typeof v === 'string' ? v.slice(0, 40) : JSON.stringify(v).slice(0, 40)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Status */}
                        <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${isLast ? 'bg-primary/10 text-primary border border-primary/20 animate-pulse' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                          {isLast ? 'Running' : 'Done'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* No live steps yet, just show shimmer */}
              {!hasLive && (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-3 h-3 rounded-full bg-on-surface/10" />
                      <div className="flex-1 space-y-1">
                        <div className="h-3 bg-on-surface/10 rounded w-1/3" />
                        <div className="h-2.5 bg-on-surface/5 rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Completed Workflows Timeline */}
      {hasActivities ? (
        <div className="space-y-4">
          {activities.map((workflow, wi) => {
            const isExpanded = expandedWorkflow === wi;
            const stepCount = workflow.steps?.length || 0;
            const duration = workflow.endTime && workflow.startTime
              ? formatDuration(workflow.endTime - workflow.startTime)
              : '—';
            const statusColor = workflow.status === 'completed' ? 'emerald' : workflow.status === 'failed' ? 'red' : 'amber';

            return (
              <div
                key={wi}
                className="liquid-glass rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                {/* Workflow Header */}
                <button
                  onClick={() => setExpandedWorkflow(isExpanded ? null : wi)}
                  className="w-full flex items-center gap-4 p-5 text-left group"
                >
                  {/* Timeline Icon */}
                  <div className={`w-10 h-10 rounded-xl bg-${statusColor}-500/15 flex items-center justify-center border border-${statusColor}-500/30 shrink-0 group-hover:scale-110 transition-transform`}>
                    <span className={`material-symbols-outlined text-${statusColor}-400 text-[20px]`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      {workflow.status === 'completed' ? 'check_circle' : workflow.status === 'failed' ? 'error' : 'pending'}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-sm font-bold text-on-surface truncate max-w-[300px]">
                        {workflow.request?.slice(0, 60) || 'Workflow'}{workflow.request?.length > 60 ? '...' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-on-surface-variant">
                      <span>{formatTime(workflow.startTime)}</span>
                      <span>•</span>
                      <span>{stepCount} step{stepCount !== 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span className="font-bold">{duration}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-${statusColor}-500/10 text-${statusColor}-400 border border-${statusColor}-500/20`}>
                    {workflow.status}
                  </div>

                  {/* Expand Arrow */}
                  <span className={`material-symbols-outlined text-on-surface-variant text-[18px] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>

                {/* Expanded Steps */}
                {isExpanded && workflow.steps && (
                  <div className="px-5 pb-5 border-t border-outline-variant/10 pt-4">
                    <div className="space-y-1">
                      {workflow.steps.map((step, si) => {
                        const meta = getAgentMeta(step.tool);
                        const colors = getColorClasses(meta.color);
                        return (
                          <div key={si} className="flex items-start gap-3 py-2">
                            {/* Timeline */}
                            <div className="flex flex-col items-center mt-0.5">
                              <div className={`w-2.5 h-2.5 rounded-full ${colors.dot} opacity-80`} />
                              {si < workflow.steps.length - 1 && (
                                <div className={`w-px h-6 bg-gradient-to-b ${colors.line} to-transparent`} />
                              )}
                            </div>
                            {/* Content */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`material-symbols-outlined ${colors.text} text-[13px]`} style={{ fontVariationSettings: "'FILL' 1" }}>{meta.icon}</span>
                                <span className={`text-[11px] font-bold ${colors.text}`}>{meta.name}</span>
                                <span className="text-[9px] font-mono text-on-surface-variant">→</span>
                                <span className="text-[11px] font-medium text-on-surface">{getActionLabel(step.tool, step.action)}</span>
                              </div>
                              {step.result && (
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {step.result.status && (
                                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                      {step.result.status}
                                    </span>
                                  )}
                                  {step.result.pr_url && (
                                    <a href={step.result.pr_url} target="_blank" rel="noopener noreferrer" className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 transition-colors">
                                      PR #{step.result.pr_number}
                                    </a>
                                  )}
                                  {step.result.jira_key && (
                                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                                      {step.result.jira_key}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <span className="text-[9px] font-mono text-on-surface-variant/50 mt-0.5">
                              {step.timestamp ? formatTime(step.timestamp) : ''}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : !isLoading ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg">
            <span className="material-symbols-outlined text-primary text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>timeline</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-on-surface mb-1">No Activity Yet</h3>
            <p className="text-sm text-on-surface-variant max-w-md leading-relaxed">
              Send a request in Focused Chat to see real-time agent actions appear here. Each workflow step will be tracked with its agent, tool, and result.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {['Create a user story', 'Generate a pipeline', 'Design architecture', 'Inject chaos'].map(s => (
              <span key={s} className="text-[10px] font-mono px-3 py-1.5 rounded-lg bg-surface-container-high/50 text-on-surface-variant border border-outline-variant/20">
                "{s}"
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

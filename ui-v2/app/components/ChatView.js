import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ReactDiffViewer from 'react-diff-viewer-continued';

// ─── Mermaid Renderer ───────────────────────────────────────────────────────
function MermaidDiagram({ code }) {
  const ref = useRef(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('visual');

  useEffect(() => {
    let cancelled = false;
    async function render() {
      try {
        // Dynamically import to avoid SSR issues
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#6750A4',
            primaryTextColor: '#E6E1E5',
            primaryBorderColor: '#9A82DB',
            lineColor: '#CAC4D0',
            secondaryColor: '#21005D',
            tertiaryColor: '#1C1B1F',
            background: '#1C1B1F',
            mainBkg: '#2B2930',
            nodeBorder: '#9A82DB',
            clusterBkg: '#211F26',
            titleColor: '#CAC4D0',
            edgeLabelBackground: '#2B2930',
          },
          flowchart: { htmlLabels: true, curve: 'basis' },
          securityLevel: 'loose',
        });
        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, code);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          // Make SVG responsive
          const svgEl = ref.current.querySelector('svg');
          if (svgEl) {
            svgEl.style.maxWidth = '100%';
            svgEl.style.height = 'auto';
          }
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Diagram render error');
      }
    }
    render();
    return () => { cancelled = true; };
  }, [code]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div className="my-3 rounded-xl border border-outline-variant/30 overflow-hidden bg-surface-container-lowest">
      <div className="flex items-center justify-between px-4 py-2 bg-surface-container border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[14px]">account_tree</span>
          <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">Architecture Diagram (Mermaid)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'visual' ? 'code' : 'visual')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-highest text-on-surface-variant text-[10px] font-bold hover:bg-on-surface/10 transition-all"
            title="Toggle View Mode"
          >
            <span className="material-symbols-outlined text-[12px]">{viewMode === 'visual' ? 'code' : 'visibility'}</span>
            {viewMode === 'visual' ? 'View Code' : 'View Diagram'}
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold hover:bg-primary/20 transition-all"
            title="Copy diagram source"
          >
            <span className="material-symbols-outlined text-[12px]">{copied ? 'check' : 'content_copy'}</span>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      {error ? (
        <div className="p-4">
          <div className="text-xs text-error font-mono mb-2">⚠ Diagram parse error: {error}</div>
          <pre className="text-[11px] text-on-surface-variant overflow-x-auto whitespace-pre-wrap">{code}</pre>
        </div>
      ) : viewMode === 'code' ? (
        <div className="p-4 overflow-x-auto bg-[#1C1B1F] min-h-[100px]">
          <pre className="text-[11px] text-[#CAC4D0] whitespace-pre-wrap font-mono"><code>{code}</code></pre>
        </div>
      ) : (
        <div ref={ref} className="p-4 overflow-x-auto flex items-center justify-center min-h-[100px]" />
      )}
    </div>
  );
}

// ─── Copy Button for Code ────────────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);
  return (
    <button
      onClick={handle}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold hover:bg-primary/20 transition-all"
      title="Copy code"
    >
      <span className="material-symbols-outlined text-[12px]">{copied ? 'check' : 'content_copy'}</span>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

// ─── Custom Markdown Components ──────────────────────────────────────────────
const markdownComponents = {
  table: ({ children }) => (
    <div className="overflow-x-auto my-3 rounded-xl border border-outline-variant/30">
      <table className="w-full text-xs font-mono">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-surface-container-high text-on-surface-variant">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-bold text-[11px] uppercase tracking-wider border-b border-outline-variant/30">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2.5 border-b border-outline-variant/15 text-on-surface text-[11px] leading-relaxed">{children}</td>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-surface-container-low/50 transition-colors">{children}</tr>
  ),
  p: ({ children }) => (
    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-on-surface">{children}</strong>
  ),
  code: ({ children, className }) => {
    const lang = className?.replace('language-', '') || '';
    const isBlock = !!className?.includes('language-');
    const content = String(children).replace(/\n$/, '');

    // Render Mermaid diagrams inline
    if (isBlock && (lang === 'mermaid' || content.trim().startsWith('graph '))) {
      return <MermaidDiagram code={content} />;
    }

    if (isBlock) {
      return (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 my-3 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-surface-container border-b border-outline-variant/20">
            <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">{lang || 'code'}</span>
            <CopyButton text={content} />
          </div>
          <pre className="p-4 overflow-x-auto">
            <code className="text-[12px] font-mono text-on-surface leading-relaxed">{children}</code>
          </pre>
        </div>
      );
    }
    return (
      <code className="bg-surface-container-high px-1.5 py-0.5 rounded-md text-[12px] font-mono text-primary border border-outline-variant/20">{children}</code>
    );
  },
  pre: ({ children }) => <>{children}</>,
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-1 my-2 ml-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-1 my-2 ml-1">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-on-surface leading-relaxed">{children}</li>
  ),
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary-container transition-colors">{children}</a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-primary/50 pl-3 my-2 text-on-surface-variant italic">{children}</blockquote>
  ),
  h1: ({ children }) => <h1 className="text-lg font-bold text-on-surface mt-3 mb-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-base font-bold text-on-surface mt-3 mb-1.5">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-bold text-on-surface mt-2 mb-1">{children}</h3>,
  hr: () => <hr className="border-outline-variant/30 my-3" />,
};

// ─── Main ChatView ───────────────────────────────────────────────────────────
export default function ChatView({ activeAgent, messages, isLoading, onSendMessage, onClearChat, onApproveAction }) {
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const hasMessages = messages && messages.length > 0;

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-container-low overflow-hidden relative">
      
      {/* Chat Header Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-outline-variant/20 bg-surface-container-low/80 backdrop-blur-md shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
            <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {activeAgent?.icon || 'smart_toy'}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-on-surface">
              {activeAgent?.name || 'DevOps AI Assistant'}
            </h3>
            <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">
              {activeAgent ? 'Specialized Agent' : 'General Purpose'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearChat}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-on-surface/5 transition-all text-xs font-semibold"
            title="New Chat"
          >
            <span className="material-symbols-outlined text-[16px]">add_comment</span>
            <span className="hidden sm:inline">New Chat</span>
          </button>

          {hasMessages && (
            <button
              onClick={onClearChat}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/5 transition-all text-xs font-semibold"
              title="Clear History"
            >
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pt-6 pb-36 px-4 md:px-8 flex flex-col items-center no-scrollbar"
      >
        <div className="w-full max-w-3xl flex flex-col gap-6">
          
          {/* Welcome State */}
          {!hasMessages && !isLoading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg">
                <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface mb-1">
                  {activeAgent ? activeAgent.name : 'DevOps AI Assistant'}
                </h3>
                <p className="text-sm text-on-surface-variant max-w-md leading-relaxed">
                  {activeAgent 
                    ? `Ready to execute ${activeAgent.name} protocols. What would you like me to do?`
                    : 'I can help with Jira, GitHub, Jenkins, Slack, and more. Ask me anything about your DevOps infrastructure.'
                  }
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {['Show me the incidents', 'Run pipeline status', 'Check deployment health'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => onSendMessage(suggestion)}
                    className="px-4 py-2 rounded-full bg-surface-container border border-outline-variant/30 text-xs font-semibold text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Bubbles */}
          {hasMessages && messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            
            return (
              <div key={msg.id || idx} className={`flex gap-3 w-full ${isUser ? 'justify-end' : ''}`}>
                {/* AI Avatar */}
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 mt-1">
                    <span className="material-symbols-outlined text-primary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                  </div>
                )}
                
                {/* Message Content */}
                <div className={`flex flex-col gap-1 ${isUser ? 'items-end max-w-[85%]' : 'items-start max-w-[95%]'} min-w-0`}>
                  {/* Role Label */}
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-1">
                    {isUser ? 'You' : (activeAgent?.name || 'DevOps AI')}
                  </span>

                  {/* Bubble */}
                  {isUser ? (
                    <div className="bg-primary text-on-primary px-5 py-3 rounded-2xl rounded-tr-sm shadow-lg">
                      <p className="text-[13px] leading-relaxed font-medium">{msg.content}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 w-full">
                      {/* Thought Process (Explainable AI) */}
                      {msg.thought && msg.thought.length > 0 && (
                        <div className="bg-surface-container-low border border-outline-variant/15 rounded-xl overflow-hidden mb-1">
                          <details className="group">
                            <summary className="flex items-center gap-2 px-4 py-2 cursor-pointer list-none hover:bg-on-surface/5 transition-colors">
                              <span className="material-symbols-outlined text-[14px] text-primary group-open:rotate-180 transition-transform">psychology</span>
                              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-mono">Thought Process</span>
                              <span className="ml-auto w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[8px] font-bold">{msg.thought.length}</span>
                            </summary>
                            <div className="px-4 pb-3 pt-1 border-t border-outline-variant/10 bg-surface-container-lowest/50">
                              <div className="space-y-2">
                                {msg.thought.map((step, sIdx) => {
                                  const isTool = step.includes('Running') || step.includes('Triggered') || step.includes('Searching') || step.includes('Executed');
                                  return (
                                    <div key={sIdx} className="flex gap-3">
                                      <div className={`w-1 h-auto rounded-full ${isTool ? 'bg-primary/40' : 'bg-outline-variant/20'}`} />
                                      <div className="flex flex-col">
                                        <p className={`text-[11px] leading-relaxed font-mono ${isTool ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                                          {step}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </details>
                        </div>
                      )}

                      {/* Main Answer */}
                      <div className="bg-surface-container border border-outline-variant/20 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm text-on-surface text-[13px] leading-relaxed w-full min-w-0 overflow-x-auto">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]} 
                          components={markdownComponents}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>

                      {/* Interactive Code Diff Viewer */}
                      {msg.diff && (
                        <div className="mt-2 border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
                          <div className="bg-surface-container-high px-4 py-2 border-b border-outline-variant/30 flex justify-between items-center gap-2">
                            <span className="text-[10px] font-bold font-mono text-on-surface-variant uppercase tracking-widest truncate">{msg.diff.filename || 'infra/main.tf'}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <CopyButton text={msg.diff.newCode || ''} />
                              <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded uppercase font-bold">Proposed Patch</span>
                            </div>
                          </div>
                          <div className="max-h-[400px] overflow-y-auto w-full overflow-x-auto border-t border-outline-variant/10">
                            <div className="min-w-[800px]">
                              <ReactDiffViewer 
                                oldValue={msg.diff.oldCode} 
                                newValue={msg.diff.newCode} 
                                splitView={false} 
                                useDarkTheme={true}
                                hideLineNumbers={false}
                                styles={{
                                  diffContainer: { borderRadius: '0' },
                                  titleBlock: { display: 'none' },
                                  contentText: { fontSize: '11px', fontFamily: 'monospace' },
                                  lineNumber: { fontSize: '10px' }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Cards (Human-in-the-Loop) */}
                      {msg.actionCard && (
                        <div className="mt-2 p-4 rounded-xl border border-primary/20 bg-primary/5">
                          {/* Architecture Decision Header */}
                          {msg.actionCard.actionType === 'approve_architecture' && (
                            <div className="flex items-center gap-2 mb-3">
                              <span className="material-symbols-outlined text-primary text-[18px]">architecture</span>
                              <span className="text-xs font-bold text-on-surface">Architecture Review Required</span>
                              <span className="ml-auto text-[10px] text-on-surface-variant font-mono">Multi-Agent Design Complete</span>
                            </div>
                          )}
                          <div className="flex flex-col sm:flex-row gap-3">
                            <button 
                              className="flex-1 flex items-center justify-center gap-2 bg-primary text-on-primary py-2.5 px-4 rounded-xl text-xs font-bold hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 shadow-sm disabled:opacity-50 disabled:active:scale-100"
                              onClick={() => onApproveAction && onApproveAction(idx)}
                              disabled={msg.actionCard.status !== 'pending'}
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                {msg.actionCard.status === 'approved' ? 'check_circle' : 'rocket_launch'}
                              </span>
                              {msg.actionCard.status === 'approved' ? 'Approved & Merged' : 'Approve & Provision'}
                            </button>
                            {msg.actionCard.status === 'pending' && (
                              <button 
                                className="flex items-center justify-center gap-2 bg-error/10 text-error px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-error/20 transition-all active:scale-95"
                              >
                                <span className="material-symbols-outlined text-[16px]">cancel</span>
                                Reject
                              </button>
                            )}
                          </div>
                          {msg.actionCard.prUrl && (
                            <a href={msg.actionCard.prUrl} target="_blank" rel="noopener noreferrer"
                               className="mt-2 flex items-center gap-1.5 text-[11px] text-primary hover:underline">
                              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                              View PR on GitHub
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0 mt-1 shadow-md">
                    <span className="material-symbols-outlined text-on-primary text-[14px]">person</span>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 w-full">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 mt-1">
                <span className="material-symbols-outlined text-primary text-[14px] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-1">
                  {activeAgent?.name || 'DevOps AI'}
                </span>
                <div className="bg-surface-container border border-outline-variant/20 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="text-xs text-on-surface-variant font-medium">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-0 left-0 w-full p-4 pb-6 flex justify-center pointer-events-none bg-gradient-to-t from-surface-container-low via-surface-container-low/80 to-transparent">
        <form onSubmit={handleSubmit} className="w-full max-w-3xl rounded-2xl flex items-center px-2 py-2 pointer-events-auto shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-outline-variant/30 bg-surface-container-lowest backdrop-blur-xl group focus-within:border-primary/50 transition-all">
          <button type="button" className="p-2.5 text-on-surface-variant hover:text-primary transition-colors rounded-xl hover:bg-on-surface/5">
            <span className="material-symbols-outlined text-[20px]">attach_file</span>
          </button>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-transparent border-none text-on-surface placeholder:text-on-surface-variant/40 focus:ring-0 font-medium text-sm px-3 outline-none disabled:opacity-50"
            placeholder={activeAgent ? `Instruct ${activeAgent.name}...` : "Ask DevOps AI anything..."}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-gradient-btn w-9 h-9 rounded-xl text-on-primary hover:scale-105 transition-transform flex items-center justify-center shadow-md disabled:opacity-30 disabled:hover:scale-100"
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_upward</span>
          </button>
        </form>
      </div>
    </div>
  );
}

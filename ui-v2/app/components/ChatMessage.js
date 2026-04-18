"use client";

export default function ChatMessage({ message, index }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-start gap-3 animate-slide-up ${isUser ? "flex-row-reverse" : ""}`}
      style={{ animationDelay: `${Math.min(index * 40, 200)}ms` }}
    >
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
        style={{
          background: isUser ? "var(--bg-elevated)" : "var(--accent-dim)",
          color: isUser ? "var(--text-muted)" : "var(--accent-light)",
          border: `1px solid ${isUser ? "var(--border)" : "var(--border-accent)"}`,
        }}
      >
        {isUser ? "U" : "AI"}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${isUser ? "" : "surface"}`}
        style={{
          background: isUser ? "var(--bg-elevated)" : undefined,
          border: isUser ? "1px solid var(--border)" : undefined,
          borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
        }}
      >
        {isUser ? (
          <p style={{ color: "var(--text-primary)", fontSize: "0.875rem" }}>{message.content}</p>
        ) : (
          <div
            className="md-content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
          />
        )}
      </div>
    </div>
  );
}

function renderMarkdown(text) {
  if (!text) return "";

  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
      `<pre><code class="language-${lang}">${code.trim()}</code></pre>`
    )
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split("|").filter(Boolean).map((c) => c.trim());
      if (cells.every((c) => /^[-:]+$/.test(c))) return "";
      return `<tr>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`;
    })
    .replace(/^---$/gm, "<hr/>")
    .replace(/^[\-\*] (.+)$/gm, "<li>$1</li>")
    .replace(/\n/g, "<br />");

  html = html.replace(
    /(<tr>[\s\S]*?<\/tr>(?:<br \/>)?)+/g,
    (m) => `<table>${m.replace(/<br \/>/g, "")}</table>`
  );
  html = html.replace(
    /(<li>[\s\S]*?<\/li>(?:<br \/>)?)+/g,
    (m) => `<ul>${m.replace(/<br \/>/g, "")}</ul>`
  );
  return html;
}

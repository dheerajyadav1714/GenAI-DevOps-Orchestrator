"use client";

export default function ChatMessage({ message, index }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-start gap-3 animate-fade-in ${isUser ? "flex-row-reverse" : ""}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
        style={{
          background: isUser
            ? "var(--bg-card)"
            : "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
          color: isUser ? "var(--text-secondary)" : "white",
          border: isUser ? "1px solid var(--border)" : "none",
        }}
      >
        {isUser ? "You" : "AI"}
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser ? "" : "glass-card"
        }`}
        style={{
          background: isUser ? "var(--bg-card)" : undefined,
          border: isUser ? "1px solid var(--border)" : undefined,
          borderRadius: isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
        }}
      >
        {isUser ? (
          <p style={{ color: "var(--text-primary)" }}>{message.content}</p>
        ) : (
          <div className="markdown-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }} />
        )}
      </div>
    </div>
  );
}

// Lightweight markdown renderer
function renderMarkdown(text) {
  if (!text) return "";

  let html = text
    // Escape HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

    // Code blocks (```...```)
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
    })

    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")

    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")

    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")

    // Headers
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")

    // Tables
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split("|").filter(Boolean).map((c) => c.trim());
      if (cells.every((c) => /^[-:]+$/.test(c))) return ""; // separator row
      const isHeader = cells.some((c) => c.includes("---"));
      if (isHeader) return "";
      const tag = "td";
      return `<tr>${cells.map((c) => `<${tag}>${c}</${tag}>`).join("")}</tr>`;
    })

    // Horizontal rules
    .replace(/^---$/gm, "<hr style='border-color: var(--border); margin: 1rem 0;' />")

    // Unordered lists  
    .replace(/^[\-\*] (.+)$/gm, "<li>$1</li>")

    // Line breaks
    .replace(/\n/g, "<br />");

  // Wrap consecutive <tr> in <table>
  html = html.replace(
    /(<tr>[\s\S]*?<\/tr>(?:<br \/>)?)+/g,
    (match) => `<table>${match.replace(/<br \/>/g, "")}</table>`
  );

  // Wrap consecutive <li> in <ul>
  html = html.replace(
    /(<li>[\s\S]*?<\/li>(?:<br \/>)?)+/g,
    (match) => `<ul>${match.replace(/<br \/>/g, "")}</ul>`
  );

  return html;
}

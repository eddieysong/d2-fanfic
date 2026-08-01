import React from "react";

function inline(text: string) {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return tokens.map((token, index) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={index}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("*") && token.endsWith("*")) {
      return <em key={index}>{token.slice(1, -1)}</em>;
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      return <code key={index}>{token.slice(1, -1)}</code>;
    }
    return <React.Fragment key={index}>{token}</React.Fragment>;
  });
}

export function MarkdownProse({ markdown }: { markdown: string }) {
  const blocks = markdown.replace(/\r\n/g, "\n").split(/\n\s*\n/);

  return (
    <div className="prose">
      {blocks.map((block, index) => {
        const normalized = block.trim();
        if (!normalized) return null;
        const heading = normalized.match(/^(#{2,4})\s+(.+)$/s);
        if (heading) {
          const level = heading[1].length;
          const text = heading[2].replace(/\n/g, " ");
          if (level === 2) return <h2 key={index}>{inline(text)}</h2>;
          if (level === 3) return <h3 key={index}>{inline(text)}</h3>;
          return <h4 key={index}>{inline(text)}</h4>;
        }
        return <p key={index}>{inline(normalized.replace(/\n/g, " "))}</p>;
      })}
    </div>
  );
}

import React from "react";

/**
 * Minimal markdown renderer for the portfolio content.
 * Supports: h2/h3 headings, bold, blockquotes, bullet lists, and paragraphs.
 * No external deps — the source content only uses these features.
 */

function renderInline(text: string, keyBase: string): React.ReactNode[] {
  // Split on **bold** segments.
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyBase}-b-${i}`}>{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={`${keyBase}-t-${i}`}>{part}</React.Fragment>;
  });
}

export function Markdown({ source }: { source: string }) {
  const lines = source.split("\n");
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  let quote: string[] = [];
  let key = 0;

  const flushList = () => {
    if (list.length) {
      const items = [...list];
      blocks.push(
        <ul className="md-list" key={`ul-${key++}`}>
          {items.map((it, i) => (
            <li key={i}>{renderInline(it, `li-${key}-${i}`)}</li>
          ))}
        </ul>
      );
      list = [];
    }
  };

  const flushQuote = () => {
    if (quote.length) {
      const text = quote.join(" ");
      blocks.push(
        <blockquote className="md-quote" key={`bq-${key++}`}>
          {renderInline(text, `bq-${key}`)}
        </blockquote>
      );
      quote = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (line.startsWith("### ")) {
      flushList();
      flushQuote();
      blocks.push(<h4 className="md-h4" key={`h-${key++}`}>{renderInline(line.slice(4), `h4-${key}`)}</h4>);
    } else if (line.startsWith("## ")) {
      flushList();
      flushQuote();
      blocks.push(<h3 className="md-h3" key={`h-${key++}`}>{renderInline(line.slice(3), `h3-${key}`)}</h3>);
    } else if (line.startsWith("# ")) {
      flushList();
      flushQuote();
      blocks.push(<h3 className="md-h3" key={`h-${key++}`}>{renderInline(line.slice(2), `h1-${key}`)}</h3>);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      flushQuote();
      list.push(line.slice(2));
    } else if (line.startsWith(">")) {
      flushList();
      quote.push(line.replace(/^>\s?/, ""));
    } else if (line.trim() === "") {
      flushList();
      flushQuote();
    } else {
      flushList();
      flushQuote();
      blocks.push(<p className="md-p" key={`p-${key++}`}>{renderInline(line, `p-${key}`)}</p>);
    }
  }
  flushList();
  flushQuote();

  return <div className="md">{blocks}</div>;
}

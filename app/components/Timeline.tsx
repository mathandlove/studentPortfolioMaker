"use client";

import { useMemo, useState } from "react";
import { Markdown } from "./Markdown";

export interface ClientArtifact {
  slug: string;
  title: string;
  kind: string;
  kindLabel: string;
  kindBlurb: string;
  dateLabel: string;
  body: string;
  words: number;
}

interface Props {
  artifacts: ClientArtifact[];
  kinds: { kind: string; label: string; count: number }[];
}

export function Timeline({ artifacts, kinds }: Props) {
  const [active, setActive] = useState<string | null>(null); // active kind filter
  const [open, setOpen] = useState<Set<string>>(new Set());

  const visible = useMemo(
    () => (active ? artifacts.filter((a) => a.kind === active) : artifacts),
    [active, artifacts]
  );

  const allOpen = visible.length > 0 && visible.every((a) => open.has(a.slug));

  const toggle = (slug: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const toggleAll = () => {
    if (allOpen) setOpen(new Set());
    else setOpen(new Set(visible.map((a) => a.slug)));
  };

  return (
    <section>
      <div className="gallery-title">
        <p className="eyebrow">The Collection</p>
        <h2>Every piece, in the order it was made</h2>
      </div>

      <div className="controls">
        <div className="filters">
          <button
            className={`chip ${active === null ? "chip-on" : ""}`}
            onClick={() => setActive(null)}
          >
            All work <span className="chip-count">{artifacts.length}</span>
          </button>
          {kinds.map((k) => (
            <button
              key={k.kind}
              className={`chip chip-${k.kind} ${active === k.kind ? "chip-on" : ""}`}
              onClick={() => setActive(active === k.kind ? null : k.kind)}
            >
              {k.label} <span className="chip-count">{k.count}</span>
            </button>
          ))}
        </div>
        <button className="expand-all" onClick={toggleAll}>
          {allOpen ? "Collapse all" : "Read everything"}
        </button>
      </div>

      <ol className="timeline">
        {visible.map((a, i) => {
          const isOpen = open.has(a.slug);
          return (
            <li
              className="tl-item"
              key={a.slug}
              style={{ animationDelay: `${Math.min(i, 12) * 60}ms` }}
            >
              <span className={`tl-dot dot-${a.kind}`} aria-hidden />
              <div className={`tl-card card-${a.kind}`}>
                <button
                  className="tl-head"
                  onClick={() => toggle(a.slug)}
                  aria-expanded={isOpen}
                >
                  <span className="tl-index" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="tl-head-main">
                    <span className="tl-plaque">
                      <span className={`tag tag-${a.kind}`}>{a.kindLabel}</span>
                      <span className="tl-title">{a.title}</span>
                    </span>
                    <span className="tl-head-meta">
                      <span className="tl-date">{a.dateLabel}</span>
                      <span className="tl-sep">·</span>
                      <span className="tl-words">{a.words} words</span>
                      <span className="tl-sep">·</span>
                      <span className="tl-blurb">{a.kindBlurb}</span>
                    </span>
                  </span>
                  <span className={`caret ${isOpen ? "caret-open" : ""}`} aria-hidden>
                    ›
                  </span>
                </button>
                {isOpen && (
                  <div className="tl-body">
                    <Markdown source={a.body} />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";

export interface SelfReflection {
  throughLine: string;
  topTheme: string;
}

interface Props {
  firstName: string;
  /** Called once the student commits their first-pass reflection. */
  onCommit: (r: SelfReflection) => void;
  /** A committed reflection restored from storage, if any. */
  committed: SelfReflection | null;
  /** Let the student reopen and revise what they wrote. */
  onReopen: () => void;
}

/**
 * The student-first reflection gate. Before any AI synthesis is shown, the
 * student writes their own one-line through-line and names their own top
 * theme. Only after they commit does the AI reading unlock — so the student
 * does the meaning-making first and the AI responds to them, not the reverse.
 * This is the autonomy hinge of the whole tool.
 */
export function SelfReflectionGate({ firstName, onCommit, committed, onReopen }: Props) {
  const [throughLine, setThroughLine] = useState(committed?.throughLine ?? "");
  const [topTheme, setTopTheme] = useState(committed?.topTheme ?? "");

  // Keep the draft in sync if a reopen hands us the committed values back.
  useEffect(() => {
    if (committed) {
      setThroughLine(committed.throughLine);
      setTopTheme(committed.topTheme);
    }
  }, [committed]);

  const ready = throughLine.trim().length >= 12 && topTheme.trim().length >= 3;

  // If already committed, show a compact "your first read" summary with a way back in.
  if (committed) {
    return (
      <section className="selfref selfref-done">
        <div className="selfref-lead">
          <span className="you-badge">✎ Your first read — written before the AI&apos;s</span>
          <button className="selfref-edit" onClick={onReopen}>
            Revise mine
          </button>
        </div>
        <div className="selfref-pair">
          <div className="selfref-field">
            <span className="selfref-label">Your through-line</span>
            <p className="selfref-value">{committed.throughLine}</p>
          </div>
          <div className="selfref-field">
            <span className="selfref-label">Your top theme</span>
            <p className="selfref-value">{committed.topTheme}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="selfref">
      <div className="selfref-lead">
        <span className="you-badge">✎ Start here — your read, first</span>
      </div>
      <h2 className="selfref-title">Before the AI weighs in, {firstName}, what do you see?</h2>
      <p className="selfref-hint">
        Scroll your own work below if you need to. Then say it in your own words. The AI&apos;s
        reading stays hidden until you&apos;ve written yours — so the thinking is yours first, and
        the conversation starts from where the two of you agree and disagree.
      </p>

      <label className="selfref-q">
        <span className="selfref-qlabel">
          In one sentence, what&apos;s the through-line of your work this unit?
        </span>
        <textarea
          className="selfref-input"
          value={throughLine}
          onChange={(e) => setThroughLine(e.target.value)}
          rows={2}
          placeholder="Over this unit I moved from… toward…"
        />
      </label>

      <label className="selfref-q">
        <span className="selfref-qlabel">
          Name the one theme you think shows up most across everything you made.
        </span>
        <input
          className="selfref-input"
          value={topTheme}
          onChange={(e) => setTopTheme(e.target.value)}
          placeholder="e.g. Wanting to connect vs. wanting to be the expert"
        />
      </label>

      <div className="selfref-actions">
        <button
          className="selfref-commit"
          disabled={!ready}
          onClick={() => onCommit({ throughLine: throughLine.trim(), topTheme: topTheme.trim() })}
        >
          Lock in my read &amp; reveal the AI&apos;s →
        </button>
        {!ready && (
          <span className="selfref-nudge">
            Write both in your own words to unlock the comparison.
          </span>
        )}
      </div>
    </section>
  );
}

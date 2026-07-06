"use client";

import { useMemo, useState } from "react";
import type { Cohort, CohortThread } from "../lib/cohort";

interface Props {
  cohort: Cohort;
}

export function ClassMeta({ cohort }: Props) {
  const { threads, members, teacherSignals } = cohort;

  // "Find peers working on what you are." Start on the biggest cluster so the
  // page opens on a crowded, alive place rather than empty.
  const [activeThread, setActiveThread] = useState<string>(threads[0]?.id ?? "");
  const [teacherOpen, setTeacherOpen] = useState(false);

  const threadById = useMemo(() => {
    const m = new Map<string, CohortThread>();
    for (const t of threads) m.set(t.id, t);
    return m;
  }, [threads]);

  const active = threadById.get(activeThread);
  const peers = useMemo(
    () => members.filter((m) => m.threads.includes(activeThread)),
    [members, activeThread]
  );

  // Inspiration wall: one signature quote per student, whole cohort.
  const wall = useMemo(() => members.filter((m) => m.signatureQuote), [members]);

  return (
    <>
      {/* ---- Global trends: where the whole class is thinking ---- */}
      <section className="block">
        <h2>Where the class is thinking</h2>
        <p className="notice-hint" style={{ marginTop: "-0.4rem" }}>
          Every student is pulling on the same big questions from a different angle. Here&apos;s how
          the {members.length} of you cluster across them — the taller the bar, the more of your
          peers are wrestling with it right now.
        </p>
        <div className="trendbars">
          {threads.map((t) => {
            const isActive = t.id === activeThread;
            return (
              <button
                key={t.id}
                className={`trendbar${isActive ? " trendbar-active" : ""}`}
                onClick={() => setActiveThread(t.id)}
                aria-pressed={isActive}
              >
                <span className="trendbar-head">
                  <span className="trendbar-label">{t.label}</span>
                  <span className="trendbar-count">{t.count}</span>
                </span>
                <span className="trendbar-track">
                  <span
                    className="trendbar-fill"
                    style={{ width: `${t.pct}%`, background: t.color }}
                  />
                </span>
                <span className="trendbar-blurb">{t.blurb}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ---- Find your people: peers on the selected thread ---- */}
      {active && (
        <section className="block block-peers">
          <div className="peers-head">
            <span
              className="peers-dot"
              style={{ background: active.color }}
              aria-hidden
            />
            <div>
              <h2 style={{ marginBottom: 0 }}>Who else is here: “{active.label}”</h2>
              <p className="notice-hint" style={{ margin: "0.25rem 0 0" }}>
                {peers.length} students are working this thread — {active.primaryCount} of them are
                making it the center of their unit. See where they are, and borrow a question.
              </p>
            </div>
          </div>

          <div className="peergrid">
            {peers.map((m) => (
              <article className={`peercard${m.isReal ? " peercard-real" : ""}`} key={m.id}>
                <header className="peercard-top">
                  <span className="peercard-avatar" style={{ background: active.color }}>
                    {m.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <span className="peercard-name">
                    {m.name}
                    {m.isReal && <span className="peercard-you">that&apos;s the sample portfolio</span>}
                  </span>
                </header>
                <p className="peercard-quote">“{m.signatureQuote}”</p>
                <p className="peercard-arc">{m.throughLine}</p>
                <p className="peercard-goal">
                  <span className="peercard-goal-lbl">Carrying forward</span>
                  {m.goal}
                </p>
                {m.isReal && (
                  <a className="peercard-link" href="/">
                    Open the full portfolio →
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ---- Inspiration wall: the whole cohort, in their own words ---- */}
      <section className="block">
        <h2>The wall</h2>
        <p className="notice-hint" style={{ marginTop: "-0.4rem" }}>
          One line from every student&apos;s work this unit. Not scores, not rankings — just the
          class thinking out loud. Find one that pulls at you.
        </p>
        <div className="wall">
          {wall.map((m) => {
            const t = threadById.get(m.primaryThread);
            return (
              <figure
                className={`wallnote${m.isReal ? " wallnote-real" : ""}`}
                key={m.id}
                style={{ borderTopColor: t?.color ?? "var(--accent)" }}
              >
                <blockquote>“{m.signatureQuote}”</blockquote>
                <figcaption>
                  <span className="wall-name">{m.name}</span>
                  <span className="wall-thread" style={{ color: t?.color }}>
                    {t?.label}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      {/* ---- Teacher's meta-analysis: folded down, present but not primary ---- */}
      <section className="block block-teacher">
        <button
          className="teacher-toggle"
          onClick={() => setTeacherOpen((o) => !o)}
          aria-expanded={teacherOpen}
        >
          <span className="teacher-badge">For the teacher</span>
          <span className="teacher-title">
            Cross-cohort patterns &amp; syllabus alignment
          </span>
          <span className="teacher-chevron">{teacherOpen ? "▾" : "▸"}</span>
        </button>
        {teacherOpen && (
          <div className="teacher-body">
            <div className="signal">
              <h3>Where the class clusters</h3>
              <p>{teacherSignals.clustering}</p>
            </div>
            <div className="signal">
              <h3>What&apos;s thin</h3>
              <p>{teacherSignals.thin}</p>
            </div>
            <div className="signal signal-flag">
              <h3>Possible misalignment</h3>
              <p>{teacherSignals.alignment}</p>
            </div>
            <p className="teacher-foot">
              Every number here is aggregated from the same portfolios the students see — nothing
              hidden, so any pattern can be checked against the work itself.
            </p>
          </div>
        )}
      </section>
    </>
  );
}

import { getArtifacts, getConversation, getInsight, getStats, KIND_META, STUDENT } from "./lib/portfolio";
import { Portfolio } from "./components/Portfolio";
import { type ClientArtifact } from "./components/Timeline";

export default function Home() {
  const artifacts = getArtifacts();
  const stats = getStats(artifacts);
  const insight = getInsight();
  const conversation = getConversation();

  const clientArtifacts: ClientArtifact[] = artifacts.map((a) => ({
    slug: a.slug,
    title: a.title,
    kind: a.kind,
    kindLabel: KIND_META[a.kind].label,
    kindBlurb: KIND_META[a.kind].blurb,
    dateLabel: a.dateLabel,
    body: a.body,
    words: a.words,
  }));

  const kinds = stats.byKind
    .map((k) => ({ kind: k.kind, label: KIND_META[k.kind].label, count: k.count }))
    .sort((a, b) => b.count - a.count);

  const initials = STUDENT.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <main className="portfolio">
      <header className="hero">
        <div className="hero-inner">
          <div className="avatar">{initials}</div>
          <div className="hero-text">
            <p className="eyebrow">Learning Portfolio · {STUDENT.unit} · {STUDENT.term}</p>
            <h1>{STUDENT.name}</h1>
            <p className="course">{STUDENT.course}</p>
          </div>
        </div>

        <div className="stats">
          <div className="stat">
            <span className="stat-num">{stats.total}</span>
            <span className="stat-label">pieces of work</span>
          </div>
          <div className="stat">
            <span className="stat-num">{stats.spanLabel}</span>
            <span className="stat-label">spanning the unit</span>
          </div>
          <div className="stat">
            <span className="stat-num">{stats.totalWords.toLocaleString()}</span>
            <span className="stat-label">words written</span>
          </div>
        </div>

        <p className="hero-note">
          Everything {STUDENT.name.split(" ")[0]} produced this unit, in one place and in
          order — one shared artifact for the student and their teacher to read together, showing
          the arc of the learning rather than assignment-by-assignment scores, ahead of the
          one-on-one conversation.
        </p>
      </header>

      <Portfolio
        studentName={STUDENT.name}
        artifacts={clientArtifacts}
        kinds={kinds}
        insight={insight}
        conversation={conversation}
      />

      <footer className="foot">
        <p>Student Portfolio Maker · a whole-student view of a unit of work</p>
      </footer>
    </main>
  );
}

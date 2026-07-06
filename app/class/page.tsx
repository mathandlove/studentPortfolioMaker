import { getCohort } from "../lib/cohort";
import { ClassMeta } from "../components/ClassMeta";

export const metadata = {
  title: "The Class — Intelligent Leadership",
  description:
    "A meta-analysis of a whole cohort's learning: global trends, peers to learn from, and the class thinking out loud.",
};

export default function ClassPage() {
  const cohort = getCohort();
  const { meta } = cohort;

  return (
    <main className="portfolio">
      <header className="hero">
        <div className="hero-inner">
          <div className="avatar avatar-class">◇</div>
          <div className="hero-text">
            <p className="eyebrow">Class Meta-Analysis · {meta.unit} · {meta.term}</p>
            <h1>The Class</h1>
            <p className="course">{meta.course}</p>
          </div>
        </div>

        <div className="stats">
          <div className="stat">
            <span className="stat-num">{meta.studentCount}</span>
            <span className="stat-label">learners in the room</span>
          </div>
          <div className="stat">
            <span className="stat-num">{meta.totalArtifacts.toLocaleString()}</span>
            <span className="stat-label">pieces of work between them</span>
          </div>
          <div className="stat">
            <span className="stat-num">{cohort.threads.length}</span>
            <span className="stat-label">shared questions</span>
          </div>
        </div>

        <p className="hero-note">
          Not a leaderboard — a mirror for the whole group. If seeing a peer wrestle with the same
          thing helps you name your own, this is where you find them. Observe the global trends,
          learn from each other, and get a little inspired.
        </p>
        <p className="hero-note class-provenance">
          {meta.generated}. <a href="/">See one portfolio in full →</a>{" "}
          <a href="/vision">Read the vision →</a>
        </p>
      </header>

      <ClassMeta cohort={cohort} />

      <footer className="foot">
        <p>Student Portfolio Maker · the class as one collective intelligence</p>
      </footer>
    </main>
  );
}

export const metadata = {
  title: "The Vision — Student Portfolio Maker",
  description:
    "Where this is going: students use Claude Code to gather their own writing, get honest feedback, see how the whole class is thinking, and reshape the evaluation software itself.",
};

/* The four movements of the vision, drawn from the recorded conversation
   between the teacher and the builder. Each is a plain-language "why". */
const MOVES = [
  {
    n: "01",
    title: "Gather the whole self, not the assignment",
    body: [
      "Today's learning tools are built around the assignment: a stack of scores, one submission at a time. You can't ask them to “show me everything one student made this month.”",
      "So the first move is to flip it. A student pulls four weeks of their own work into one place, in order — logs, reflections, memos, plans — and it becomes a single artifact the student and teacher read together, before the one-on-one conversation. Not five points here and four points there. The arc.",
    ],
    link: { href: "/", label: "See one student's portfolio →" },
  },
  {
    n: "02",
    title: "Get feedback that surfaces the real pattern",
    body: [
      "With everything in one place, the AI can read across it and name what a busy teacher might miss: a recurring tension, a place the student is quietly thriving, the questions actually worth talking about.",
      "But the student reads first and writes down what they see — before the AI shows its read. Then the two are placed side by side. The point isn't to be told the answer; it's to notice where your own read and the machine's diverge, and to start there.",
    ],
    link: null,
  },
  {
    n: "03",
    title: "Compare — the class as one collective intelligence",
    body: [
      "Learning is social. When you can see a peer wrestling with the same thing, you can finally name your own. So every portfolio can feed a shared, living view of the whole cohort: the questions people are clustering around, the outliers with the nutty idea, one honest line from every student.",
      "Not a leaderboard — a mirror for the group. A place to find your people, get inspired, and see that the class is a thing you build together.",
    ],
    link: { href: "/class", label: "See how the whole class is thinking →" },
  },
  {
    n: "04",
    title: "Reshape the evaluation software itself",
    body: [
      "Here's the part that makes it different from any product a company could ship: the students don't just use the tool — they change it. Through Claude Code, they upload their writing, ask for the analysis, and then edit the very thing doing the evaluating.",
      "What reflection questions are useful? What's missing? A class assignment can be “make this better for the next class.” The software becomes an ongoing, shared negotiation — versioned in GitHub, so nothing is ever truly lost, and everyone is accountable to each other's learning.",
    ],
    link: null,
  },
];

/* How a student actually drives the whole thing — the mechanics, in plain terms. */
const HOW = [
  {
    step: "Describe it, don't code it",
    text: "You talk to Claude Code in plain language — “here's my work, here's what I care about.” It writes the software. No syntax, no punctuation to get wrong.",
  },
  {
    step: "Build messy, then react",
    text: "You don't need the whole plan in your head. Build something in seconds, look at it, and say what's off. Reacting to something real beats guessing in the abstract.",
  },
  {
    step: "Have it critique its own work",
    text: "Ask Claude to grade the page — as a designer, as an educator — then tell it to fix what it found. The feedback loop is part of the tool.",
  },
  {
    step: "Ship it, keep it living",
    text: "Deploy to the web in one line. Every version is saved in GitHub, so the whole class can keep upgrading the same living page together.",
  },
];

export default function VisionPage() {
  return (
    <main className="portfolio">
      <header className="hero">
        <div className="hero-inner">
          <div className="avatar avatar-class">✦</div>
          <div className="hero-text">
            <p className="eyebrow">The Vision · Student Portfolio Maker</p>
            <h1>Learning, documented by the learner</h1>
            <p className="course">
              A different way to document learning — built in an afternoon, by describing it
            </p>
          </div>
        </div>

        <p className="hero-note">
          This started as a conversation between a teacher and a builder. The teacher wanted
          something an LMS could never give her: a way to see the <em>student</em> over a whole
          unit, not the assignment. By the end of the afternoon it existed — and the bigger idea
          had grown well past a portfolio. This page is that idea, with a bow on it.
        </p>

        <nav className="vision-links">
          <a className="class-link" href="/">
            ◇ A student's portfolio
          </a>
          <a className="class-link" href="/class">
            ◇ The whole class
          </a>
        </nav>
      </header>

      <section className="vision-moves">
        <div className="gallery-title">
          <p className="eyebrow">The idea, in four movements</p>
          <h2>Gather · Feedback · Compare · Reshape</h2>
        </div>

        {MOVES.map((m) => (
          <article key={m.n} className="vmove">
            <div className="vmove-num">{m.n}</div>
            <div className="vmove-main">
              <h3>{m.title}</h3>
              {m.body.map((p, i) => (
                <p key={i} className="vmove-p">
                  {p}
                </p>
              ))}
              {m.link && (
                <a className="vmove-link" href={m.link.href}>
                  {m.link.label}
                </a>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="vision-how block">
        <p className="eyebrow" style={{ marginBottom: "0.6rem" }}>
          How a student drives it — through Claude Code
        </p>
        <p className="vmove-p" style={{ marginTop: 0 }}>
          The whole thing runs on one skill: describing what you want to a coding agent. No
          engineering degree required. That's the shift — from waiting for a company to build the
          tool, to building your own, customized to your class and your goals.
        </p>
        <ol className="how-list">
          {HOW.map((h, i) => (
            <li key={i}>
              <span className="how-step">{h.step}</span>
              <span className="how-text">{h.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="vision-close">
        <blockquote>
          “A living place where things get upgraded and change all the time — where everyone has
          their own page, and together we build the meta-page that sees the bigger picture.”
        </blockquote>
        <p className="vision-close-note">
          That's the future this points at: learning as a shared, evolving artifact — owned by the
          students who make it.
        </p>
      </section>

      <footer className="foot">
        <p>Student Portfolio Maker · a whole-student view of a unit of work</p>
      </footer>
    </main>
  );
}

// Deterministic synthetic cohort generator.
//
// We only have ONE real, anonymized portfolio (Jordan Miller). To prototype the
// class-level meta-analysis page — where students observe global trends, learn
// from each other, and get inspired — we imagine ~30 students "like Jordan":
// same class (Intelligent Leadership), same kinds of artifacts, but each pulling
// on a different edge of the same big questions.
//
// This is intentionally deterministic (no API, no randomness that drifts between
// runs) so builds are instant and reproducible. It writes content/cohort.json,
// which the /class page reads. Jordan himself is included as one member of the
// cohort so the individual portfolio and the meta view line up.
//
// Run: node scripts/generate-cohort.mjs

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "content", "cohort.json");
const JORDAN = JSON.parse(
  fs.readFileSync(path.join(ROOT, "content", "insight.json"), "utf8")
);

// A small, seeded PRNG so the "random" cohort is identical on every run.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20250929);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const pickN = (arr, n) => {
  const copy = [...arr];
  const out = [];
  while (out.length < n && copy.length) {
    out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  }
  return out;
};

// ---- The shared "big questions" of this unit -------------------------------
// These are the through-lines the class as a whole is wrestling with. Each is a
// cluster a student can belong to. Jordan's real work maps onto several of them.
const THREADS = [
  {
    id: "well-rounded-vs-expert",
    label: "Well-roundedness vs. expertise",
    blurb:
      "What actually counts as intelligence — breadth and adaptability, or deep technical mastery?",
    color: "#0ea5e9",
  },
  {
    id: "fitting-the-mold",
    label: "Fitting (or not) the engineering mold",
    blurb:
      "Wrestling with belonging: does valuing people over pure technical skill make you an outsider?",
    color: "#8b5cf6",
  },
  {
    id: "toll-of-leadership",
    label: "The toll & responsibility of leadership",
    blurb:
      "Leadership always extracts a cost — through empathy, through ownership, or both.",
    color: "#f59e0b",
  },
  {
    id: "followership",
    label: "Followership as the engine of teams",
    blurb:
      "Rethinking whether teams rise and fall on leaders — or on how people follow and self-lead.",
    color: "#10b981",
  },
  {
    id: "adaptability",
    label: "Adaptability as the growth edge",
    blurb:
      "Old study habits and instincts no longer meet the demand — change is named but hard to enact.",
    color: "#ef4444",
  },
  {
    id: "empathy-vs-rationality",
    label: "Empathy vs. rational ownership",
    blurb:
      "Holding the pull between reading the room and coldly owning a hard call.",
    color: "#ec4899",
  },
];

// Interview sources students draw on (mirrors Jordan's mother/father/mentor interviews).
const INTERVIEWEES = [
  "a parent", "a former coach", "a mentor at work", "an older sibling",
  "a professor", "a team captain", "a grandparent", "a co-op supervisor",
  "a startup founder", "a military officer", "a nurse", "a high-school teacher",
];

const FIRST = [
  "Amara", "Diego", "Priya", "Marcus", "Lena", "Tariq", "Sofia", "Noah",
  "Yuki", "Elena", "Kwame", "Chloe", "Raj", "Maya", "Ivan", "Zara",
  "Owen", "Naomi", "Hassan", "Grace", "Leo", "Fatima", "Caleb", "Ada",
  "Mateo", "Nina", "Omar", "Rosa", "Finn",
];
const LAST = [
  "Okafor", "Reyes", "Sharma", "Bennett", "Novak", "Haddad", "Rossi", "Kim",
  "Tanaka", "Petrova", "Mensah", "Dubois", "Patel", "Nguyen", "Volkov",
  "Ahmed", "Walsh", "Cohen", "Ali", "Osei", "Marino", "Karimi", "Wright",
  "Lovelace", "Silva", "Larsen", "Farah", "Delgado", "Gallagher",
];

// Reusable fragments so 30 through-lines feel distinct without an LLM.
const OPENING = [
  "arrives sure that {t0} is settled for them",
  "starts the unit quietly anxious about {t0}",
  "opens confident, almost dismissive, about {t0}",
  "enters skeptical that {t0} even matters",
  "begins by leaning hard into {t0} as their whole identity",
  "comes in curious but unformed about {t0}",
];
const MIDDLE = [
  "then an interview with {who} cracks it open",
  "but the readings keep snagging on {t1}",
  "until a group conversation reframes it around {t1}",
  "then a hard week forces {t1} into the open",
  "before {who} offers a story that complicates it",
  "as {t1} quietly becomes the real question",
];
const CLOSING = [
  "and lands on holding the tension rather than resolving it",
  "and ends more honest than certain",
  "and leaves with a sharper question than they came in with",
  "and finally names something they'd been avoiding",
  "and turns self-affirmation into genuine inquiry",
  "and closes proud, though the growth edge is still raw",
];

// Short, quotable lines students might write — varied by thread so the
// inspiration wall reads like 30 different voices. (Jordan's are real.)
const QUOTES = {
  "well-rounded-vs-expert": [
    "Knowing everything about one thing has started to feel lonelier than knowing a little about people.",
    "I used to think the smartest person answered fastest. Now I think they ask the better question.",
    "Depth impressed me for years. This unit, breadth is what kept surprising me.",
  ],
  "fitting-the-mold": [
    "I keep waiting to feel like a 'real' engineer. Maybe the waiting is the tell.",
    "Not fitting the mold stopped feeling like a flaw and started feeling like information.",
    "I dim the part of me that needs people so I read as competent. That trade is expensive.",
  ],
  "toll-of-leadership": [
    "Every leader I admire paid for it somewhere. I'm only now asking where I'll pay.",
    "Owning the call and feeling the cost turned out to be the same muscle.",
    "I wanted authority without the ache. This unit told me that's not on the menu.",
  ],
  followership: [
    "I spent the whole unit studying leaders and got upstaged by followers.",
    "Following well is a decision, not a default. That reframed the whole team for me.",
    "The best thing I did on my team last month was choose to elevate someone else.",
  ],
  adaptability: [
    "My old habits are a comfortable pair of shoes I've clearly outgrown.",
    "I can name exactly what I need to change. Doing it is the part with no shortcut.",
    "Adaptability isn't a trait I have — it's a bill that comes due every busy week.",
  ],
  "empathy-vs-rationality": [
    "Reading the room and making the cold call are pulling my hands in two directions.",
    "I keep erasing myself to stay kind. That isn't leadership either.",
    "Empathy without ownership is just being liked. I want more than that.",
  ],
};

// Goals students carry forward (echoes Jordan's "what we decided together").
const GOALS = {
  "well-rounded-vs-expert": "Find one place to go genuinely deep without losing the breadth I value.",
  "fitting-the-mold": "Stop dimming the relational side of how I work and test what happens.",
  "toll-of-leadership": "Name, out loud, which cost of leadership I'm most avoiding.",
  followership: "Practice deliberate, self-leading followership on my project team.",
  adaptability: "Change one concrete study habit and track whether it holds.",
  "empathy-vs-rationality": "Own one hard call fully — no deferring to be liked.",
};

const THRIVING = [
  "Turns interviews into real inquiry, not just quote-collection",
  "Holds unresolved tensions instead of flattening them",
  "Strong, consistent metacognition across the logs",
  "Connects readings to concrete engineering-leadership stakes",
  "Genuinely lets a belief get overturned mid-unit",
  "Writes to think, not just to submit",
];
const WATCH = [
  "Self-portrait can tip into self-affirmation",
  "Final self-assessment reads more polished than honest",
  "Insight named but concrete follow-through still thin",
  "An unresolved anxiety they gesture at but don't open",
  "Leans on breadth to avoid committing anywhere",
  "Defers so hard the actual view disappears",
];

function fill(tmpl, t0, t1, who) {
  return tmpl.replace("{t0}", t0).replace("{t1}", t1).replace("{who}", who);
}

// ---- Build the 30 members ---------------------------------------------------
const members = [];

// Jordan is member #0 — the one real portfolio, linked to his page.
members.push({
  id: "jordan-miller",
  name: "Jordan Miller",
  isReal: true,
  primaryThread: "well-rounded-vs-expert",
  threads: ["well-rounded-vs-expert", "fitting-the-mold", "toll-of-leadership", "followership", "adaptability"],
  throughLine: JORDAN.throughLine.split(". ").slice(0, 2).join(". ") + ".",
  signatureQuote: JORDAN.heroQuote.text,
  interviewedWith: "a parent and a mentor",
  goal: "Carry the empathy-vs-expert tension into Unit 2 instead of resolving it too fast.",
  thriving: JORDAN.thriving[0].point,
  watchFor: JORDAN.watchFors[0].point,
  artifactCount: 12,
});

const usedNames = new Set(["Jordan Miller"]);
for (let i = 0; i < 29; i++) {
  let name;
  do {
    name = `${pick(FIRST)} ${pick(LAST)}`;
  } while (usedNames.has(name));
  usedNames.add(name);

  const threadCount = 2 + Math.floor(rand() * 3); // 2–4 threads each
  const threads = pickN(THREADS, threadCount);
  const primary = threads[0];
  const secondary = threads[1] ?? threads[0];
  const who = pick(INTERVIEWEES);

  const throughLine =
    fill(pick(OPENING), primary.label.toLowerCase(), secondary.label.toLowerCase(), who) +
    ", " +
    fill(pick(MIDDLE), primary.label.toLowerCase(), secondary.label.toLowerCase(), who) +
    ", " +
    pick(CLOSING) +
    ".";

  members.push({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    isReal: false,
    primaryThread: primary.id,
    threads: threads.map((t) => t.id),
    throughLine: throughLine[0].toUpperCase() + throughLine.slice(1),
    signatureQuote: pick(QUOTES[primary.id]),
    interviewedWith: who,
    goal: GOALS[primary.id],
    thriving: pick(THRIVING),
    watchFor: pick(WATCH),
    artifactCount: 8 + Math.floor(rand() * 7), // 8–14 artifacts
  });
}

// ---- Aggregate into class-level trends -------------------------------------
const threadStats = THREADS.map((t) => {
  const belong = members.filter((m) => m.threads.includes(t.id));
  const primary = members.filter((m) => m.primaryThread === t.id);
  return {
    ...t,
    count: belong.length,
    primaryCount: primary.length,
    pct: Math.round((belong.length / members.length) * 100),
    // A few representative voices per cluster for the inspiration wall.
    voices: belong.slice(0, 4).map((m) => ({
      name: m.name,
      quote: m.signatureQuote,
      isReal: m.isReal,
      id: m.id,
    })),
  };
});
threadStats.sort((a, b) => b.count - a.count);

const totalArtifacts = members.reduce((s, m) => s + m.artifactCount, 0);

// Teacher-facing signals: where the class clusters, and a plausible
// syllabus-vs-reality note (the transcript's "misalignment" idea).
const dominant = threadStats[0];
const thinnest = threadStats[threadStats.length - 1];

const cohort = {
  meta: {
    course: "ENLP 3000 — Intelligent Leadership",
    unit: "Unit 1",
    term: "Fall 2025",
    studentCount: members.length,
    totalArtifacts,
    generated: "synthetic cohort — 1 real portfolio (Jordan Miller) + 29 imagined peers",
  },
  threads: threadStats,
  members,
  teacherSignals: {
    clustering: `${dominant.count} of ${members.length} students are pulling on “${dominant.label}.” It's the gravitational center of the unit — worth a whole-class conversation, and worth asking whether the prompts are steering everyone there.`,
    thin: `Only ${thinnest.count} students engaged “${thinnest.label}” meaningfully. If the syllabus treats it as central, that's a gap between what was assigned and what actually landed.`,
    alignment:
      "Across the cohort, the interviews consistently did more to shift beliefs than the readings did. If the unit's stated goal is engaging the assigned texts, the real learning may be happening in the conversations — a possible misalignment worth naming.",
  },
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(cohort, null, 2));
console.log(`Wrote ${members.length} students and ${threadStats.length} threads to ${path.relative(ROOT, OUT)}`);

import "server-only";
import fs from "node:fs";
import path from "node:path";

export type ArtifactKind = "log" | "reflection" | "memo" | "plan" | "assessment";

export interface Artifact {
  slug: string;
  title: string;
  kind: ArtifactKind;
  /** ISO date for sorting; null if undated */
  date: string | null;
  /** Human label for the date, e.g. "Aug 22, 2025" */
  dateLabel: string;
  /** Raw markdown body (title heading stripped) */
  body: string;
  /** Word count of the body */
  words: number;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "portfolio");

/** The student this portfolio belongs to (from the anonymized data). */
export const STUDENT = {
  name: "Jordan Miller",
  course: "ENLP 3000 — Intelligent Leadership",
  unit: "Unit 1",
  term: "Fall 2025",
};

const MONTHS: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
};

function classify(fileName: string): ArtifactKind {
  const n = fileName.toLowerCase();
  if (n.includes("captain")) return "log";
  if (n.includes("self-reflection") || n.includes("self-assessment")) return "assessment";
  if (n.includes("reflection")) return "reflection";
  if (n.includes("memo")) return "memo";
  if (n.includes("plan")) return "plan";
  return "memo";
}

function iso(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function label(year: number, month: number, day: number): string {
  const names = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[month]} ${day}, ${year}`;
}

/**
 * Extract a date from either the filename (e.g. "Captain's Log (August 22)")
 * or the body (e.g. "Date: 9/16/2025", "DATE: 10/03/2025").
 * Files without a year assume 2025 (the term of this data set).
 */
/**
 * A few artifacts carry no date in their filename or body. We place them in the
 * arc using context from the logs (e.g. the Aug 27 log references "our first
 * Personal Autoethnographic Reflection"). Marked as inferred so it's honest.
 */
const INFERRED_DATES: Record<string, { date: string; note: string }> = {
  "Personal Autoethnographic Reflection": { date: "2025-08-26", note: "date inferred" },
  "Speaker for the Dead Discussion Leadership Preparation": { date: "2025-09-04", note: "date inferred" },
};

function extractDate(fileName: string, body: string): { date: string | null; dateLabel: string } {
  // Filename form: "(August 22)"
  const fnMatch = fileName.match(/\(([A-Za-z]+)\s+(\d{1,2})\)/);
  if (fnMatch) {
    const month = MONTHS[fnMatch[1].toLowerCase()];
    const day = Number(fnMatch[2]);
    if (month) return { date: iso(2025, month, day), dateLabel: label(2025, month, day) };
  }

  // Body form: "**Date:** 9/16/2025", "DATE: 10/03/2025", "Date: 8/28/2025".
  // Allow markdown bold, a colon, and whitespace between the keyword and the date.
  const bodyMatch = body.match(/\bdate\b[*:\s]*(\d{1,2})\/(\d{1,2})\/(\d{2,4})/i);
  if (bodyMatch) {
    const month = Number(bodyMatch[1]);
    const day = Number(bodyMatch[2]);
    let year = Number(bodyMatch[3]);
    if (year < 100) year += 2000;
    return { date: iso(year, month, day), dateLabel: label(year, month, day) };
  }

  return { date: null, dateLabel: "Undated" };
}

/** Strip the leading top-level "# Title" heading from the body. */
function stripTitle(body: string): { title: string | null; rest: string } {
  const m = body.match(/^\s*#\s+(.+?)\s*\n/);
  if (m) {
    return { title: m[1].trim(), rest: body.slice(m[0].length) };
  }
  return { title: null, rest: body };
}

function countWords(text: string): number {
  return text.replace(/[#*>_`\-]/g, " ").split(/\s+/).filter(Boolean).length;
}

export const KIND_META: Record<ArtifactKind, { label: string; blurb: string }> = {
  log: { label: "Captain's Log", blurb: "In-class reflection" },
  reflection: { label: "Reflection", blurb: "Personal essay" },
  memo: { label: "Interview Memo", blurb: "Interview & analysis" },
  plan: { label: "Discussion Plan", blurb: "Discussion leadership prep" },
  assessment: { label: "Self-Assessment", blurb: "Unit self-evaluation" },
};

let cache: Artifact[] | null = null;

export function getArtifacts(): Artifact[] {
  if (cache) return cache;

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"));

  const artifacts: Artifact[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { title: headingTitle, rest } = stripTitle(raw);
    const baseName = file.replace(/\.md$/, "");
    let { date, dateLabel } = extractDate(baseName, raw);

    // Fall back to context-inferred dates for undated artifacts.
    if (!date && headingTitle && INFERRED_DATES[headingTitle]) {
      const hint = INFERRED_DATES[headingTitle];
      const [y, m, d] = hint.date.split("-").map(Number);
      date = hint.date;
      dateLabel = `${label(y, m, d)} · ${hint.note}`;
    }

    return {
      slug: baseName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      title: headingTitle ?? baseName,
      kind: classify(file),
      date,
      dateLabel,
      body: rest.trim(),
      words: countWords(rest),
    };
  });

  // Chronological: dated first (ascending), undated at the end.
  artifacts.sort((a, b) => {
    if (a.date && b.date) return a.date.localeCompare(b.date);
    if (a.date) return -1;
    if (b.date) return 1;
    return a.title.localeCompare(b.title);
  });

  cache = artifacts;
  return artifacts;
}

export interface Insight {
  heroQuote: { text: string; source: string };
  throughLine: string;
  themes: { title: string; summary: string; evidence: { quote: string; source: string }[] }[];
  questions: { question: string; rationale: string }[];
  thriving: { point: string; evidence: string }[];
  watchFors: { point: string; evidence: string }[];
}

export function getInsight(): Insight {
  const raw = fs.readFileSync(path.join(process.cwd(), "content", "insight.json"), "utf8");
  return JSON.parse(raw) as Insight;
}

export interface ConversationTurn {
  speaker: "teacher" | "student";
  text: string;
}

export interface Conversation {
  date: string;
  summary: string;
  transcript: ConversationTurn[];
  goals: { text: string; connectsTo: string }[];
}

export function getConversation(): Conversation {
  const raw = fs.readFileSync(path.join(process.cwd(), "content", "conversation.json"), "utf8");
  return JSON.parse(raw) as Conversation;
}

export interface PortfolioStats {
  total: number;
  totalWords: number;
  spanLabel: string;
  byKind: { kind: ArtifactKind; count: number }[];
}

export function getStats(artifacts: Artifact[]): PortfolioStats {
  const dated = artifacts.filter((a) => a.date).map((a) => a.date!) as string[];
  const first = dated[0];
  const last = dated[dated.length - 1];

  const counts = new Map<ArtifactKind, number>();
  for (const a of artifacts) counts.set(a.kind, (counts.get(a.kind) ?? 0) + 1);

  const firstLabel = artifacts.find((a) => a.date === first)?.dateLabel ?? "";
  const lastLabel = [...artifacts].reverse().find((a) => a.date === last)?.dateLabel ?? "";

  return {
    total: artifacts.length,
    totalWords: artifacts.reduce((s, a) => s + a.words, 0),
    spanLabel: first && last ? `${firstLabel} – ${lastLabel}` : "",
    byKind: [...counts.entries()].map(([kind, count]) => ({ kind, count })),
  };
}

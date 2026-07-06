import "server-only";
import fs from "node:fs";
import path from "node:path";

export interface CohortThreadVoice {
  name: string;
  quote: string;
  isReal: boolean;
  id: string;
}

export interface CohortThread {
  id: string;
  label: string;
  blurb: string;
  color: string;
  count: number;
  primaryCount: number;
  pct: number;
  voices: CohortThreadVoice[];
}

export interface CohortMember {
  id: string;
  name: string;
  isReal: boolean;
  primaryThread: string;
  threads: string[];
  throughLine: string;
  signatureQuote: string;
  interviewedWith: string;
  goal: string;
  thriving: string;
  watchFor: string;
  artifactCount: number;
}

export interface Cohort {
  meta: {
    course: string;
    unit: string;
    term: string;
    studentCount: number;
    totalArtifacts: number;
    generated: string;
  };
  threads: CohortThread[];
  members: CohortMember[];
  teacherSignals: {
    clustering: string;
    thin: string;
    alignment: string;
  };
}

let cache: Cohort | null = null;

export function getCohort(): Cohort {
  if (cache) return cache;
  const raw = fs.readFileSync(path.join(process.cwd(), "content", "cohort.json"), "utf8");
  cache = JSON.parse(raw) as Cohort;
  return cache;
}

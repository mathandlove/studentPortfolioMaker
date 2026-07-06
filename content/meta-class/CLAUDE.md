# Meta Class — Instructions for Claude

This file tells you (Claude) how to build and update the meta class: each
student's individual portfolio + meta-analysis, and the class-wide meta-analysis
that rolls up across every student.

Only act on this when the user explicitly asks — e.g. "build my portfolio for
`jordan-miller`", "update `jordan-miller`'s portfolio", or "regenerate the class
meta-analysis". Don't rebuild on your own.

---

## Layout

```
content/meta-class/
├── README.md            ← student-facing guide (don't rewrite unless asked)
├── CLAUDE.md            ← this file
├── _template/           ← copy this to seed a new student (never edit as data)
│   ├── student.json
│   ├── uploads/
│   └── portfolio/
├── <student-id>/        ← one folder per student
│   ├── student.json     ← identity: { id, name, course, unit, term }
│   ├── uploads/         ← RAW source files the student dropped in (input)
│   ├── portfolio/       ← cleaned Markdown artifacts (you generate these)
│   └── insight.json     ← that student's meta-analysis (you generate this)
└── cohort.json          ← class-wide meta-analysis across all students (you generate)
```

`<student-id>` is lowercase `firstname-lastname` and matches `student.json.id`.

### How this relates to the existing top-level `content/`

The repo already ships one worked example at the top level:
`content/portfolio/`, `content/insight.json`, `content/cohort.json`. That is the
Jordan Miller reference and is what the Next.js app reads today
([app/lib/portfolio.ts](../../app/lib/portfolio.ts) and
[app/lib/cohort.ts](../../app/lib/cohort.ts)). Treat those files as the
**canonical schema examples** — match their shape exactly. The `meta-class/`
tree is the multi-student generalization of that same pattern.

---

## Task A — Build or update ONE student's portfolio

Trigger: "build/update the portfolio for `<student-id>`".

1. **Read the inputs.** List `content/meta-class/<student-id>/uploads/` and read
   every file. Accept `.md`, `.txt`, `.docx`, `.pdf`. If a `.docx`/`.pdf` can't
   be read as text, convert it first (e.g. `textutil` / a pdf-to-text tool) —
   do not guess at contents. Read `student.json` for identity.
2. **Never invent content.** Every quote, theme, date, and claim must trace to a
   real source file. If a date isn't in the filename or body, either leave it
   `null` or mark it inferred (see the `INFERRED_DATES` pattern in
   [app/lib/portfolio.ts](../../app/lib/portfolio.ts)). Do not fabricate
   backlinks, peers, or evidence.
3. **Write cleaned artifacts** into `content/meta-class/<student-id>/portfolio/`,
   one Markdown file per assignment. Keep a top-level `# Title` heading and any
   `Date:` line — the app's parser uses filename `(Month Day)` and body
   `Date: M/D/YYYY` to date and classify each artifact. Classification is by
   filename keyword: `captain`→log, `self-reflection`/`self-assessment`→
   assessment, `reflection`→reflection, `memo`→memo, `plan`→plan.
4. **Write the meta-analysis** to `content/meta-class/<student-id>/insight.json`,
   matching the `Insight` type exactly:

   ```jsonc
   {
     "heroQuote": { "text": "...", "source": "<artifact title>" },
     "throughLine": "one paragraph: where they started → what shifted → where they landed",
     "themes": [
       { "title": "...", "summary": "...",
         "evidence": [ { "quote": "verbatim", "source": "<artifact title>" } ] }
     ],
     "questions":  [ { "question": "...", "rationale": "why this is worth asking" } ],
     "thriving":   [ { "point": "...", "evidence": "..." } ],
     "watchFors":  [ { "point": "...", "evidence": "..." } ]
   }
   ```

   Every `source` must be an artifact title that actually exists in that
   student's `portfolio/`. Every `quote` must appear in the source.
5. **Confirm what you did** — list the artifacts written and note anything you
   couldn't date or read. Then remind the user that the class-wide `cohort.json`
   is now stale if this student's analysis changed (see Task B).

## Task B — Build or update the class-wide meta-analysis

Trigger: "regenerate/update the class meta-analysis" (or after several students
change).

1. **Read every student's `insight.json` and `student.json`** under
   `content/meta-class/*/` (skip `_template/`).
2. **Write `content/meta-class/cohort.json`** matching the existing
   `content/cohort.json` schema:
   - `meta`: `{ course, unit, term, studentCount, totalArtifacts, generated }`.
     Compute `studentCount` and `totalArtifacts` from real folders — don't
     round or invent. Note in `generated` how many portfolios are real.
   - `threads`: the recurring themes **across** students. Each thread has
     `{ id, label, blurb, color, count, primaryCount, pct, voices[] }`, where
     `count` = students touching the thread, `primaryCount` = students for whom
     it's primary, `pct` = round(count / studentCount * 100). `voices` are real
     `{ name, quote, isReal, id }` entries pulled from students' insights.
   - `members`: one entry per student — `{ id, name, isReal, primaryThread,
     threads[], throughLine, signatureQuote, interviewedWith, goal, thriving,
     watchFor, artifactCount }`. Pull these from each `insight.json`; don't
     re-derive from scratch.
   - `teacherSignals`: `{ clustering, thin, alignment }` — honest observations
     about where the cohort clusters, what's thin, and any misalignment between
     what was assigned and what actually landed.
3. **Grounding rule:** every quote and count must trace to a real student file.
   Mark synthetic/example students with `isReal: false`. Never inflate counts.
4. **Confirm** the counts and the threads you found.

## Task C — Add a new student

Trigger: "add a student `<name>`".

1. Copy `_template/` to `content/meta-class/<student-id>/`.
2. Fill `student.json` (`id`, `name`, course/unit/term).
3. Tell the user to drop files in `uploads/`, then run Task A.

---

## Guardrails (always)

- **Source of truth is `uploads/`.** Generated files (`portfolio/`,
  `insight.json`, `cohort.json`) are derived and safe to overwrite. Never treat a
  hand-edit of a generated file as canonical — if it conflicts with `uploads/`,
  surface the conflict.
- **State the exact file you're writing before you write it**, per the repo's
  global rules.
- **No hallucinated data** — no invented quotes, peers, dates, or backlinks. If a
  source is missing or unreadable, say so instead of filling the gap.
- **Match the shipped schemas** in `content/insight.json` and
  `content/cohort.json` exactly, so the app can render meta-class data with the
  same components.
- **One student at a time for Task A.** Only touch the folder you were asked
  about; don't rebuild the whole class unless asked (Task B).

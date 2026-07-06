# How the Best Tools Surface a "Whole-Student" View — and Turn It Into a Conversation

**Research date:** 2026-07-06
**Method:** Deep-research harness — 5 search angles, 21 sources fetched, 95 claims extracted, 25 verified by 3-vote adversarial verification (24 confirmed, 1 refuted). Every claim below is source-cited; caveats and confidence are preserved.

---

## 0. The headline finding (read this first)

**No shipping education product was found that does the full pipeline this project targets** — ingest a whole unit of work → produce a through-line + themes-with-evidence + thriving/watch-fors → generate conversation-ready 1:1 questions. That is the gap this tool fills.

What *does* exist is a set of proven, separable mechanics, each best-in-class in one layer. The winning strategy is to **borrow the mechanic from whoever does it best in each layer and compose them:**

| Layer | Borrow the mechanic from | What they prove works |
|---|---|---|
| **Synthesis** (themes, summaries, theme-naming) | **ScholarMate** (research prototype) | Mixed-initiative: AI *suggests*, human *validates*; theme names derived from evidence keywords |
| **Evidence → source traceability** | **ScholarMate** + **PebblePad** | Interactive links from claim → exact snippet; forced "justification" tying reasoning to artifact |
| **Anti-hallucination / keep student's words** | RAG / citation-faithfulness research | Never trust AI-surfaced sources; verify against real artifacts; LLMs fabricate citations on demand |
| **AI-dialogue guardrails** | **TASD "Classroom Teaching Aide"** (empirical study) | Two-layer prompts + 5-component taxonomy; measurable behavior control |
| **Conversation structure** | **Carl Anderson**, **Stanford PWR**, **Gateway** | Assess-then-teach; student sets agenda first; co-construct feedback |
| **Ingestion & evidence anchoring** | **Seesaw**, **PebblePad**, **Brisk** | Multimodal capture; asset stores; inline source-anchored comments; teacher-approval gate |

The rest of this document is the mechanics, per layer, with citations.

---

## 1. The AI synthesis pipeline — ScholarMate

**Source:** ScholarMate, arXiv:2504.14406 (primary, research prototype). *Caveat: this is a general qualitative-research/sensemaking tool, NOT an education product. It is a **transferable-technique** source, not proof that a deployed ed tool does this.*

### What it ingests
A large document collection arranged as text snippets on a **non-linear canvas** (demonstrated on a 24-paper case study).

### How the synthesis works (the mechanic to copy)
- **Mixed-initiative, not full automation.** AI provides *theme suggestions, multi-level summarization, and evidence-based theme naming*; the human dynamically arranges and validates. Human oversight is an explicit design goal (DG3) **specifically because AI "can introduce errors through biases or hallucinations."**
- **Theme names are derived from the evidence, not invented.** Theme descriptions "automatically incorporate salient, evidence-derived keywords." This is the anti-hallucination lever at the synthesis layer: the *label* is grounded in words that actually appear in the sources.
- **Multi-level summarization** — summarize at the snippet level, then roll up into themes, then into an overarching structure. (This maps directly to: quote → theme → through-line.)

> ⚠️ **One related claim was REFUTED (0-3):** the specific assertion that "users found the mixed-initiative *balance* crucial for trust" did not hold up to verification. The mixed-initiative *design* is real and cited; the specific user-trust finding about the balance is not. Don't cite that particular claim.

### How evidence ties back to source
Theme descriptions carry **evidence-derived keywords that are interactively linked to the source evidence nodes, with hover interactions providing immediate visual feedback.** The design explicitly ensures "transparency through traceability to source documents." *(Caveat: the source frames this as building trust/interpretability, not explicitly as a hallucination guardrail.)*

**→ Apply to this project:** In `insight.json`, every theme already carries `evidence: [{quote, source}]`. The borrowable upgrade is to make those quotes **click/hover-linkable back to the exact artifact and location** in the timeline — the mechanic ScholarMate found "crucial for interpretability."

---

## 2. Anti-hallucination & keeping the student's own words

**Sources:** arXiv:2602.17671v1 (student-use hallucination study, primary); corroborating RAG/citation-faithfulness literature.

### The core risk
- **LLMs fabricate citations/sources on demand.** In a study of student AI use, invented sources were the **most-reported hallucination type (~24% of comments).** Direct student quote: *"It gave me some insights and when I asked about the sources, it sent me fake ones that don't exist."*
- Corroborated broadly: an early study found **55% of GPT-3.5 and 18% of GPT-4** literature-review citations fabricated; a large-scale analysis found **~146,932 hallucinated citations** across 2025 references.

### The guardrails to implement
1. **Never surface an AI-generated source as if real.** Any "source" attached to a quote must resolve to an actual artifact in the ingested corpus. Verify, don't trust.
2. **Keep the student's verbatim words.** Extract quotes with their exact source spans rather than letting the model paraphrase. (This is exactly what `insight.json` does — quotes are lifted verbatim with a `source` field. Preserve that discipline; it is the single most important anti-hallucination mechanic for this product.)
3. **Grounding = conditioning generation on supplied evidence, with provenance logged** (chunk IDs, source, similarity) so any output can be traced back. Groundedness is measurable — an automated evaluator can check whether each generated claim is supported by the provided context before the response is returned.

> **Open question flagged by the research:** the verified sources cover *source-traceability* well but not *verbatim-quote preservation* specifically. This project's quote-with-source-span approach is ahead of what the literature documents — worth treating as a differentiator, not just a checkbox.

---

## 3. Controlling AI dialogue — the TASD study

**Source:** "Classroom Teaching Aide" (TASD), arXiv:2604.16738 (primary). Empirical: **20 teachers, 39 classrooms, 1,479 conversations, spring 2025.** *Caveat: effect sizes are observational/regression associations from one pilot, not randomized causal estimates.*

### Two-layer prompt architecture (copy this)
Teachers author **both**:
1. A **teacher-to-AI setup prompt** — the instructional scaffold (behavior config the student never sees).
2. A **student-facing conversation starter** — launches the AI-mediated discussion.

### The 5-component prompt taxonomy (a reusable config schema)
The study enumerates exactly five prompt components, each with a concrete example clause:

| Component | Purpose | Example clause |
|---|---|---|
| **AI role** | Set the persona/stance | "Act as a coach; do not give final answers" |
| **Discourse moves** | Shape the dialogue rhythm | "Ask one question at a time; require the student to justify" |
| **Constraints** | Bound the output | "Keep responses to 1–2 sentences" |
| **Evidence / rigor** | Force grounding | "When the student makes a claim, ask for evidence from the text or a worked step" |
| **Finish line** | Define done | "Stop after the student produces two evidence-backed discussion points" |

### Measured effects (these clauses actually work)
- **"No direct answers"** constraint → AI final-answer rate dropped **16.2% → 7.7% (−8.5 pp).**
- **Explicit "finish line"** → **−0.22** reduction in the cognitive-demand (DOK) gap, 95% CI [−0.33, −0.12], *p* < .001.

**→ Apply to this project:** The generated 1:1 questions and any AI-mediated student dialogue should be built from this taxonomy. The "evidence/rigor" clause ("ask for evidence from the text") is precisely what makes the conversation stay anchored to the student's real work.

---

## 4. The conversation structure — Anderson, Stanford PWR, Gateway

This is the most thoroughly verified layer (multiple primary sources, all 3-0 confirmations). It defines what the *output artifact should feed into*.

### 4a. Assess-then-teach — Carl Anderson's two-part conference
**Source:** Anderson, NESA/SEC handout (primary).

**Part 1 — the teacher *researches*:**
1. Invite the child to **set the agenda** by describing their own writing work
2. Ask assessment questions
3. Read the student's writing
4. Make a teaching decision

**Part 2 — the teacher *teaches*:**
5. Give critical feedback
6. Teach
7. Nudge the student to "have-a-go" (try it immediately)
8. Link the conference to the student's independent work

### 4b. Anatomy of an effective "teaching point" (7 parts)
A template for the *teach* half:
1. Clear, precise feedback
2. Explicit teaching cue
3. Name the skill
4. Explain what it is and why it matters
5. Show *how* — via examples from teacher's/published writing
6. Student tries it immediately
7. Link to future work

### 4c. Student sets the agenda first — and talks more
**Sources:** Anderson + Stanford PWR (both primary, merged 3-0).

- The conference **opens with the student, not the teacher**, describing their work in their own words *before* the teacher assesses — this preserves ownership. (Echoed across Anderson, Stanford, and Gateway.)
- Stanford: "the student should be talking **as much, if not more, than the instructor**… make sure the meeting is dialogic." Teachers are told **NOT** to "simply giv[e] a step-by-step review of your comments on the draft. Instead, invite the student to reflect."
- Over Zoom, students **share screens and "take control,"** walking the instructor through their revisions — which "levels the playing field."

### 4d. Ready-made question bank (adapt into `questions[]`)
**Source:** Stanford PWR (primary). Metacognition-eliciting prompts you can template:
- "Where do you articulate your claim? Do you feel your claim stays consistent?"
- "What area of the draft are you **most proud of? Why?**"
- "What particular **rhetorical strategies** did you try to use, and **where**?"
- "What feedback have you received from peers? **How does that align with your own assessment**?"

> **This is exactly what `insight.json.questions[]` already does** — each question paired with a `rationale`. The Stanford bank validates the pattern and supplies more question *shapes* (proudest/why, strategy+location, peer-vs-self reconciliation).

### 4e. Co-construct the summative feedback
**Source:** Stanford PWR (primary). The instructor **writes the end comment *during/after* the conference**, incorporating the student's input and the trajectory of the conversation — "the student is helping construct the end comment." Don't deliver fully-formed feedback prepared in advance.

### 4f. Framing: formative, not evaluative
**Source:** Stanford PWR (primary). "I'm not providing feedback to justify an already determined grade, but rather to help them grow as writers. The students really recognize and appreciate this distinction."

**→ This is the project's whole thesis.** The hero note already says "see the arc of the learning, not just assignment-by-assignment scores." That's the formative frame, verified as best practice.

### 4g. Longitudinal, student-led conferences — Gateway model
**Source:** Gateway Impact (primary).
- A **written reflection/goal-setting document is the centerpiece** of reflection before and during the conference.
- Students **first select work samples and reflect** in individual classes, *then* set broader "global" goals.
- Teachers **surface students' previous goals** to scaffold new reflection — growth is measured against prior documented goals.
- Portfolios are **longitudinal**: one 30–40 min student-led conference per year; three years of accumulated work by end of middle school.
- Agency is framed around three skill areas: **Self-Awareness & Growth Mindset, Self-Advocacy, Collaboration & Community Skills.**

**→ Apply:** The `conversation.json` `goals[]` (with `connectsTo`) is the Gateway centerpiece document. The borrowable upgrade is **carrying goals forward across units** so the next portfolio opens with "last unit you set these goals — here's the evidence of what happened."

---

## 5. Ingestion & evidence anchoring — Seesaw, PebblePad, Brisk

### 5a. Multimodal capture — Seesaw
**Source:** seesaw.com (primary/vendor; capability corroborated by KQED, teachnet.ie).
Captures **photos, videos, audio recordings** of any assignment type (math manipulatives, science experiments, art) plus drawings, text, links, PDFs — the raw evidence that populates a portfolio. *Ingestion should not assume text-only work.*

### 5b. Separate raw evidence from curation — PebblePad
**Source:** OSU PebblePad guide (primary; corroborated by PebblePad docs).
Three-tier architecture:
- **Assets Store** — individual files the student uploads for later use (raw evidence)
- **Workbooks** — instructor-created templates where students add evidence
- **Portfolio Pages** — curated collections

### 5c. Forced justification ties reasoning to artifact — PebblePad
**Source:** OSU PebblePad guide (primary). When a student attaches an asset as evidence, an **"Add a Justification" editor appears automatically**, asking *why the asset constitutes evidence* of the understanding they were asked to show. This binds student reasoning directly to the source artifact — a strong pattern for **evidence + student's own words** in one move.

### 5d. Source-anchored AI feedback + teacher gate — Brisk
**Source:** briskteaching.com (primary/vendor; behavior corroborated by third parties). *Caveat: feature existence verified; feedback quality not independently validated. Precise anchoring & draft-gate are the premium "Targeted Feedback" mode.*
- **Inline, source-anchored comments:** feedback appears as **Google Docs comments in the margin next to the relevant passage**, "guiding them precisely where to revise," alignable to a rubric or standards.
- **Teacher-approval gate:** AI comments **stay in draft mode and only post after teacher approval** — students never get AI feedback directly. "Ensuring that feedback is authentic and meaningful."
- **"Glow & Grow" structure:** pairs celebration (Glow) with areas to improve (Grow) — a direct parallel to this project's **thriving / watch-fors** framing.

---

## 6. Direct implications for this project

Mapping verified mechanics onto the existing artifacts (`content/insight.json`, `content/conversation.json`, the timeline):

1. **Make evidence quotes click-to-source (ScholarMate §1).** Every `evidence.quote` should link/hover back to the exact artifact and location in the timeline. This is the single highest-value borrowable UX pattern for trust.
2. **Keep verbatim quotes with source spans; never let AI paraphrase evidence (§2).** Already the approach — protect it. Treat AI-invented sources as a hard failure.
3. **Derive theme *names* from evidence keywords (§1), not free invention** — grounds the label in the student's actual words.
4. **Structure generated questions on the TASD taxonomy (§3)** — especially the evidence/rigor clause ("ask for evidence from the text") and a finish line.
5. **Order the artifact assess-then-teach (§4a):** through-line + themes (assess) come before questions + goals (teach). The current layout already does this.
6. **Open the 1:1 with the student's own words first (§4c).** The tool should prompt the *student* to react before showing the teacher's synthesis — preserve agency.
7. **Frame thriving/watch-fors as Glow & Grow, formative not evaluative (§4f, §5d).** Watch-fors must be growth-oriented and non-labeling (see open question below).
8. **Carry goals forward across units (§4g).** Next portfolio opens against last unit's goals + evidence of follow-through — the Gateway longitudinal mechanic.
9. **Co-construct the summary during the conversation (§4e)** — leave room for the teacher to finalize the end comment *with* the student, not deliver it pre-baked.
10. **Add a teacher-approval gate before anything reaches the student (§5d).** Keep the human in the loop; AI output is a draft until a teacher signs off.

---

## 7. Open questions the research could NOT answer

1. **Is there a real (non-prototype) ed product doing the full through-line + themes + watch-fors + questions pipeline?** None verified. Likely a genuine market gap.
2. **Best mechanic for preserving the student's verbatim words vs. AI paraphrase?** Sources cover source-traceability but not verbatim-quote preservation specifically. This project is ahead here.
3. **How to derive & phrase "thriving vs. watch-for" so they're growth-oriented and non-labeling (avoid deficit framing)?** No evidence found on how students react to AI-surfaced vs. teacher-surfaced "watch-fors." Worth user-testing.
4. **UX/pedagogy of other named AI tools (Khanmigo, MagicSchool, Writable, Amira)?** None survived into the verified claim set — their synthesis/conference mechanics remain undocumented here and are candidates for a follow-up research pass.

---

## Appendix — Sources (verified)

| # | Source | Layer | Quality |
|---|---|---|---|
| 1 | ScholarMate — arXiv:2504.14406 | AI synthesis | primary (prototype) |
| 2 | TASD Classroom Teaching Aide — arXiv:2604.16738 | AI dialogue guardrails | primary (empirical) |
| 3 | Student-use hallucination study — arXiv:2602.17671v1 | Anti-hallucination | primary |
| 4 | Carl Anderson, Conferring (NESA/SEC handout) | Conference structure | primary |
| 5 | Stanford PWR — best-practices for student-centered conferences | Conference structure | primary |
| 6 | Stanford PWR — Zoom conferences / 1:1 meetings | Conference structure | primary |
| 7 | Gateway Impact — student-led conference goal-setting | Conference structure | primary |
| 8 | PebblePad student guide (OSU) | ePortfolio ingestion | primary |
| 9 | Seesaw digital portfolio | Ingestion (multimodal) | primary (vendor) |
| 10 | Brisk Teaching — Give Feedback | AI feedback anchoring | primary (vendor) |
| + | RAG/grounding & citation-faithfulness literature (arXiv:1908.01992, 2502.10881, 2504.18225, 2412.18004, 2404.15845) | Anti-hallucination corroboration | primary |

*Verification: 24 of 25 claims confirmed by 3-vote adversarial verification; 1 refuted (ScholarMate "mixed-initiative balance → trust" specific claim, 0-3, excluded). Several vendor claims (Brisk, Seesaw) rest partly on marketing pages — feature existence corroborated by third parties, efficacy not independently validated. TASD effect sizes are observational associations from one spring-2025 pilot, not randomized causal estimates.*

// One-off: read all portfolio artifacts, ask Claude to synthesize the teacher
// "What I'm Noticing" insight layer + a student-voice hero quote, and write the
// result to content/insight.json (baked in, so the app needs no live API).
//
// Run: CLAUDE_API_KEY=... node scripts/generate-insight.mjs
import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content", "portfolio");
const OUT = path.join(ROOT, "content", "insight.json");

const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error("Set CLAUDE_API_KEY or ANTHROPIC_API_KEY");
  process.exit(1);
}

const client = new Anthropic({ apiKey });

// Load every artifact as labeled text for the model.
const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
const corpus = files
  .map((f) => {
    const body = fs.readFileSync(path.join(CONTENT_DIR, f), "utf8");
    return `\n===== FILE: ${f} =====\n${body}`;
  })
  .join("\n");

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    heroQuote: {
      type: "object",
      additionalProperties: false,
      description:
        "One striking, verbatim line from the student's own writing that captures the identity of the whole collection. Student voice, first person.",
      properties: {
        text: { type: "string" },
        source: { type: "string", description: "Which artifact it came from" },
      },
      required: ["text", "source"],
    },
    throughLine: {
      type: "string",
      description:
        "1-2 paragraph narrative of the arc: how this student's thinking evolved across the unit. Written to brief the teacher before a one-on-one.",
    },
    themes: {
      type: "array",
      description: "3-5 emerging threads that recur across the work.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string", description: "Short name for the theme" },
          summary: { type: "string", description: "1-2 sentences on the thread" },
          evidence: {
            type: "array",
            description: "1-3 short verbatim pull-quotes from the work supporting this theme",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                quote: { type: "string" },
                source: { type: "string" },
              },
              required: ["quote", "source"],
            },
          },
        },
        required: ["title", "summary", "evidence"],
      },
    },
    questions: {
      type: "array",
      description:
        "4-6 tailored, grounded questions the teacher could ask in the one-on-one. Each tied to specific evidence. This is the headline output.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          question: { type: "string" },
          rationale: {
            type: "string",
            description: "One sentence: why ask this, grounded in the work",
          },
        },
        required: ["question", "rationale"],
      },
    },
    thriving: {
      type: "array",
      description: "2-4 places the student is clearly thriving.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          point: { type: "string" },
          evidence: { type: "string", description: "brief supporting detail or quote" },
        },
        required: ["point", "evidence"],
      },
    },
    watchFors: {
      type: "array",
      description:
        "2-4 gentle flags: where the student seems stuck, self-doubting, or has an unmet goal. Supportive, not judgmental.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          point: { type: "string" },
          evidence: { type: "string", description: "brief supporting detail or quote" },
        },
        required: ["point", "evidence"],
      },
    },
  },
  required: ["heroQuote", "throughLine", "themes", "questions", "thriving", "watchFors"],
};

const system = `You are helping a leadership professor prepare for a one-on-one conversation with a student about a unit of work. You are reading the student's complete portfolio for the unit — Captain's Logs (short in-class reflections), interview memos, a personal reflection, a discussion-leadership plan, and a final self-assessment.

Your job is bold, confident synthesis: name the real arc of this student's learning, the themes they keep returning to, where they're thriving, and where they seem to be struggling — then turn that into specific questions the teacher can open the conversation with. Ground every observation in the actual work; use verbatim quotes for evidence. Do NOT hedge or pad. The student is "Jordan Miller" (a pseudonym). Write about them by first name.`;

const userPrompt = `Here is Jordan's complete portfolio for the unit. Synthesize the insight layer.\n${corpus}`;

console.log(`Reading ${files.length} artifacts, calling Claude (claude-opus-4-8)...`);

const response = await client.messages.parse({
  model: "claude-opus-4-8",
  max_tokens: 16000,
  thinking: { type: "adaptive" },
  output_config: { effort: "high", format: { type: "json_schema", schema: SCHEMA } },
  system,
  messages: [{ role: "user", content: userPrompt }],
});

const parsed = response.parsed_output;
if (!parsed) {
  console.error("No parsed output. stop_reason:", response.stop_reason);
  console.error(JSON.stringify(response.content, null, 2));
  process.exit(1);
}

fs.writeFileSync(OUT, JSON.stringify(parsed, null, 2));
console.log(`Wrote ${OUT}`);
console.log(`Themes: ${parsed.themes.length}, Questions: ${parsed.questions.length}`);

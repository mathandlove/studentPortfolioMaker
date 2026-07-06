# Meta Class — Student Guide

Welcome! This is the shared space for our class. Every student has their **own
folder** here. You drop your coursework into your folder, and it gets turned
into a polished portfolio plus a personal "meta-analysis" — a summary of the
themes, questions, and growth edges across everything you wrote.

You never edit anyone else's folder. You only work inside your own.

---

## 1. Find (or make) your folder

Your folder lives at:

```
content/meta-class/<your-name>/
```

for example `content/meta-class/jordan-miller/`.

If your folder doesn't exist yet, **copy the `_template` folder** and rename the
copy to your name in lowercase with a hyphen (`firstname-lastname`). The template
already has the right structure inside it.

Each student folder looks like this:

```
your-name/
├── student.json      ← your name + course info (edit this once)
├── uploads/          ← YOU put your files here
└── portfolio/        ← generated for you — leave it alone
```

## 2. Fill in `student.json`

Open `student.json` and replace the placeholder values with your real name and
the course/unit/term. Do this once. Example:

```json
{
  "id": "jordan-miller",
  "name": "Jordan Miller",
  "course": "ENLP 3000 — Intelligent Leadership",
  "unit": "Unit 1",
  "term": "Fall 2025"
}
```

The `id` should match your folder name.

## 3. Upload your files

Put **everything you want in your portfolio** into the `uploads/` folder inside
your folder. That includes:

- Captain's Logs / in-class reflections
- Reflection essays
- Interview memos
- Discussion / leadership plans
- Your self-assessment

Accepted formats: Markdown (`.md`), plain text (`.txt`), Word (`.docx`), or PDF
(`.pdf`). Give files clear names — the assignment name is perfect, e.g.
`Followership Memo.docx` or `Captain's Log (August 22).md`. Good names help your
work get sorted and dated correctly.

You can add more files any time. Just drop them in `uploads/` and ask for your
portfolio to be regenerated.

## 4. Get your portfolio built

Once your files are in `uploads/`, tell Claude:

> "Build my portfolio for `jordan-miller`."

Claude will read your uploads and generate:

- A cleaned-up **portfolio** (one file per assignment) in your `portfolio/` folder
- A personal **meta-analysis** (`insight.json`) — your through-line, recurring
  themes, questions worth reflecting on, what's thriving, and what to watch for

When you add new work later, just ask again — it re-reads everything and updates.

## 5. What NOT to touch

- **Don't edit the `portfolio/` folder or `insight.json` by hand.** They're
  generated. Any hand edits get overwritten next time your portfolio is rebuilt.
- **Don't edit other students' folders.**
- **Don't edit `_template/`** — it's the starting point everyone copies.

---

## Questions?

If something looks wrong in your generated portfolio or meta-analysis, don't fix
the generated files yourself — instead, fix or re-upload the source file in
`uploads/`, then ask for a rebuild. The generated output always comes from what's
in `uploads/`.

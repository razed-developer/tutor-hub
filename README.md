# Tutor Hub Worksheet Studio

A React + Vite + TypeScript foundation for generating printable and digitally writable math worksheets.

## Current features

- Cloudflare Pages-compatible static build
- Fraction and exponent examples
- Grade metadata
- Difficulty levels 1–5
- Four-option hint mode with one correct choice
- Simple answer key containing final answers only
- Detailed, step-by-step worked solutions
- Print and Save as PDF
- Digital pen
- Stroke eraser
- Straight-line tool
- Hold Shift while drawing to create a straight line
- Insertable coordinate grid
- Clear digital writing

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Cloudflare Pages settings:

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`

## Question structure

Questions are stored in `src/data/questions.ts`.

Each question includes:

- grade
- difficulty
- topic
- skill
- curriculum tags
- prompt
- final answer
- four hint choices
- correct choice ID
- detailed solution steps

## Publishing new questions with ChatGPT and GitHub

Ask ChatGPT to add questions directly to this repository. For example:

> Add 20 Grade 7 fraction-division questions to razed-developer/tutor-hub. Use difficulty levels 1–3, four plausible answer choices, final answers, and detailed worked solutions.

After the commit reaches the branch connected to Cloudflare Pages, Cloudflare will rebuild and publish the site.

## Important next steps

- Add undo and redo for annotations
- Save editable worksheet sessions to local storage
- Export annotations with the worksheet as PNG or PDF
- Add movable/resizable graph objects
- Add student and tutor accounts
- Split question banks into topic-specific JSON files
- Add automated validation to ensure exactly one hint choice matches each final answer

# Handoff: Praxis — AI Exam Practice Test Generator

## Overview

Praxis is an AI-powered study tool. The user uploads source material (lecture notes, slides, textbooks, past exams), the system parses it, and generates a multiple-choice practice test with worked explanations.

This handoff documents two screens:

1. **Library / Upload Hub** — file ingestion + a "Generate test" control strip.
2. **Practice Test** — question viewer with MCQ choices, mark-for-review, justification composer, per-question explanation reveal, and a question index pager. Ends in a finish/score screen.

## About the Design Files

The files in this bundle are **design references created in HTML** — interactive prototypes (React via Babel-in-browser, CSS in `styles.css`, mock data in `data.js`) demonstrating intended look and behavior. **They are not production code to copy directly.**

The task is to **recreate these designs in your target codebase using its existing environment** — React/Next.js, Vue, SwiftUI, native, etc. Use your codebase's established patterns: routing, state management, form libraries, design tokens. If no codebase exists yet, choose the framework appropriate to the project (Next.js + Tailwind is a reasonable default for this kind of dashboard).

The prototype uses inline-Babel JSX and CSS variables purely for prototyping convenience. In a real implementation:
- Replace the Babel-in-browser setup with a real build (Vite / Next).
- Replace the global `window.PRAXIS_DATA` with API calls / loaders.
- Replace the file-status simulation in `upload.jsx` (the `setInterval` that promotes `queued → processing → analyzed`) with real upload + parsing endpoints.
- Wire the "Generate test" button to your actual model/inference endpoint instead of the canned questions in `data.js`.

## Fidelity

**High-fidelity (hifi).** Final colors, typography, spacing, and interactions are all in the prototype. Recreate pixel-perfectly using your codebase's component primitives and styling system.

## Screens / Views

### 1. Library / Upload Hub

**Purpose:** Upload study materials, monitor ingestion, configure and trigger test generation.

**Layout:** Two-column app shell.
- **Sidebar** — fixed 260px wide, full height, `--bg-2` background, right border `1px solid --hairline`. Sections, top to bottom: brand mark, Navigation, Progress, user card pinned to bottom (via `margin-top: auto`).
- **Main column** — flex column. Topbar (18px × 32px padding, 1px bottom border) over a scrolling content area (`padding: 32px 40px 80px`).

**Content stack inside the scroller, top to bottom:**

1. **Hero** — `h1` "Upload your study materials" (32px, weight 600, letter-spacing -0.025em), body paragraph (`--ink-2`, 14.5px, max-width 680px), small-text "Supported: PDF, DOCX, TXT, MD, PPTX" (`--muted`, 12.5px). Margin-bottom 22px.

2. **Dropzone panel** — full-width `.panel` with internal `.dropzone-inner`. The inner div is a 1.5px dashed border (`--hairline-strong`), 36px top padding, centered icon + title + sub + buttons. Drag-over state swaps the border to `--accent` and tints the background `--accent-soft`. Click "Select files" or "browse your computer" → native `<input type=file multiple>`.

3. **Generate strip** — a wide card, slightly elevated (`--surface-2` → `--surface` gradient, 1px border `--hairline-strong`), with a subtle radial-glow `::before`. Left: small "Practice test" eyebrow with `Sparkles` icon (accent), `h3` "Generate a test from your materials", small body line showing analyzed count. Right: three `.mini-control` selects (Questions: 10/20/40/60, Difficulty: Mixed/Foundational/Advanced/Exam-grade, Style: Multiple choice/Short answer/Mixed format) and the primary CTA "Generate test →". CTA is disabled when `analyzedCount === 0`.

4. **Recent uploads table** — `.panel` with header row ("Recent uploads" + Filter / Refresh icon buttons) and a 6-column table: Filename, Size, Type, Status, Timestamp, row-action (`…`). Hover row tints to `oklch(24% 0.016 240)`. Status column uses `.status-pill` with a colored dot — `analyzed` (green, `--good`), `processing` (cyan, `--accent`, pulses via `@keyframes pulse`), `queued` (amber, `--warn`).

### 2. Practice Test

**Purpose:** Step through generated questions one at a time, pick an answer, optionally write justification, submit to reveal explanation, navigate to next.

**Content stack inside the scroller:**

1. **Test status bar** — `.test-bar`, dark `--bg-2`, 1px `--hairline`, rounded `--r-lg`. Three meta groups (Question N of total, Topic, Answered N of total) separated by 1px dividers. Right side: "Mark for review" toggle button (flag icon). When flagged, button border + text turn `--warn` and background tints amber-soft.

2. **Question card** — `.qcard` (a `.panel` with 32px padding).
   - Eyebrow `.module-tag`: "Question {id} · {topic}", accent color, 13px weight 500.
   - `h2.qtitle`: 28px weight 600, line-height 1.18, letter-spacing -0.025em, `text-wrap: balance`.
   - `.qbody`: 15px `--ink-2`, line-height 1.65. May include a `.code-block` (dark `--bg`, 1px border, Geist Mono 13px, white-space pre-wrap).
   - **Choices grid** — 2-column CSS grid, 14px gap. Each `.choice` is a `<button>` with a 28×28 letter badge + text. States:
     - default → `--bg-2` background, `--hairline` border
     - hover → background `--surface`, border `--hairline-strong`
     - `is-selected` (picked but not yet submitted) → accent border, `--accent-soft` background, accent letter badge, inset accent shadow
     - `is-correct` (after submit) → `--good` border, soft green background, green letter badge
     - `is-incorrect` (after submit, only on the user's wrong pick) → `--danger` border, soft red, red letter badge
   - **Explanation card** `.explain` — appears only after submit. Header row has Sparkles + "Explanation" + a right-aligned verdict pill (`.ok` green or `.no` red). Body is `--ink-2`, 14px, line-height 1.6.
   - **Composer** — `display: grid; grid-template-columns: auto 1fr auto auto; gap: 10px`. Children in order: `.prefix` (`>` glyph, accent), the `<input>` (transparent background, no border), `.submit` button (accent fill), `.skip` button (ghost arrow). Submit is disabled when no answer is picked. After submit, the submit button morphs to "Next →" / "Finish" and the input is disabled.
   - **Footer** — empty left, prev/next icon buttons on the right.

3. **Question pager** `.pager` — bottom-of-page strip. Label "Questions" + a row of 30×30 `.pill` buttons numbered 1..N. Pill states:
   - default → `--bg` background, `--hairline` border
   - `.answered` → border + text `--accent`
   - `.current` → solid `--accent` fill, ink-color text
   - `.flagged` → adds an amber 5px dot, top-right corner
   - (post-submit reveal not used in current flow, but classes `.correct` / `.incorrect` exist)

### 3. Finish Screen

Replaces the test view when `finished === true`. Centered `.panel` with:
- Huge `.score` — 80px Geist Mono, `--accent`, with a soft glow shadow.
- `h2` "Session complete" + a body paragraph.
- 3-column stat grid: Correct / Incorrect / Skipped (each in `--bg-2` mini-cards).
- Action row: "Review Answers" (ghost) + "New Session →" (primary).

## Interactions & Behavior

### Routing
- App-level state `route: 'upload' | 'test'`.
- Sidebar links call `setRoute`. They are buttons, not anchors — keep this as buttons unless you wire real URLs (e.g. `/library`, `/test`) via your router.

### Upload page
- Drag-and-drop: `onDragOver` + `setOver(true)`, `onDragLeave` → false, `onDrop` reads `e.dataTransfer.files`.
- New files are added at the head of the list with `status: 'queued'`. A `setInterval(5500ms)` simulates progression: `queued → processing → analyzed`. Replace this with real upload/parsing status from your backend.
- Generate CTA resets test state (`answers`, `flags`, `current`, `finished`) then sets `route: 'test'`.

### Test page
- Picking a choice writes `answers[q.id] = idx`. Choices are locked once `submittedThisQ` is true (per-question local state, recomputed on navigation from `answers[q.id] !== undefined`).
- Submit reveals the explanation card and flips the composer button to Next/Finish.
- Mark-for-review toggles `flags[q.id]`.
- Pager pill clicks jump to that question.
- Reaching the last question + Next → `finished = true`.

### Animations / Transitions
- All button + choice hover transitions: `transition: background .15s ease, color .15s ease, border-color .15s ease`.
- Processing status dot: `pulse` keyframes, 1.4s ease-in-out infinite (opacity 1 → 0.35 → 1).
- Progress bars: `width` with `transition: width .35s cubic-bezier(.3,.7,.4,1)`.
- Active button tap: `transform: translateY(1px)` on `:active` for 50ms.

### Accessibility notes
- Choices are real `<button>` elements with their letter inside. Consider adding `role="radiogroup"` on the container and `role="radio"` + `aria-checked` on each choice when reimplementing.
- The pager pills should also be buttons (they are in the prototype).
- Color is never the only signal of correct/incorrect — pair with the verdict pill text ("Correct" / "Review").

## State Management

App-level state (currently `useState` in `app.jsx`):

| State | Type | Purpose |
| --- | --- | --- |
| `route` | `'upload' \| 'test'` | which page is showing |
| `files` | `File[]` | the table on the upload page (`{ name, size, type, status, timestamp }`) |
| `generateConfig` | `{ count, difficulty, style }` | settings for the generate strip |
| `answers` | `Record<questionId, choiceIndex>` | user picks |
| `flags` | `Record<questionId, boolean>` | "mark for review" |
| `current` | `number` | current question index |
| `finished` | `boolean` | flips to the finish screen |
| `t` (tweaks) | object | demo-only — accent hue, density |

In a real app, lift the test state into a route-scoped store (Zustand / Redux / TanStack Query cache) and treat `files` + `generateConfig` as server state. The tweaks panel is a prototyping affordance — don't ship it.

## Design Tokens

Defined as CSS custom properties on `:root` in `styles.css`. Reproduce as design tokens in your styling system.

### Surface ladder (dark)
```
--bg              oklch(17% 0.012 240)   /* app background          */
--bg-2            oklch(20% 0.014 240)   /* sidebar / table header  */
--surface         oklch(23% 0.016 240)   /* card top stop           */
--surface-2       oklch(26% 0.018 240)   /* elevated card top stop  */
--hairline        oklch(32% 0.020 240)   /* default 1px borders     */
--hairline-strong oklch(38% 0.024 240)   /* emphasised borders      */
```

### Ink ladder
```
--ink    oklch(96% 0.005 240)   /* headings, primary text */
--ink-2  oklch(82% 0.012 240)   /* body text              */
--muted  oklch(62% 0.018 240)   /* labels, secondary      */
--faint  oklch(48% 0.018 240)   /* placeholder / hint     */
```

### Accent (cyan, hue 200) — tweakable
```
--accent       oklch(80% 0.115 200)
--accent-2     oklch(72% 0.115 200)   /* hover / 2nd stop       */
--accent-ink   oklch(20% 0.04 240)    /* text on accent fill    */
--accent-soft  oklch(80% 0.115 200 / 0.12)
--accent-glow  oklch(80% 0.115 200 / 0.18)
```
Optional alternative hues exposed in the prototype's Tweaks panel: 290 (violet), 130 (lime), 70 (amber). Drop these from production unless you want themable accents.

### Status
```
--warn    oklch(80% 0.13 70)
--good    oklch(78% 0.13 155)
--danger  oklch(72% 0.16 25)
```

### Typography
- Family: **Geist** (single family, weights 300/400/500/600/700) for everything except monospace.
- Mono family: **Geist Mono** (used only for the `.code-block` and the big score on the finish screen).
- Body letter-spacing: `-0.005em` to `-0.025em` for headings.
- `font-feature-settings: "ss01", "cv11"` enabled on body.
- Numeric values use `font-variant-numeric: tabular-nums`.

Type scale used:
- Display (finish-screen score): 80px, mono, weight 400, letter-spacing -0.04em
- H1 (page title): 32px, weight 600, letter-spacing -0.025em, line-height 1.05
- H2 (question title): 28px, weight 600, letter-spacing -0.025em, line-height 1.18
- H3 (card heading): 18px, weight 600, letter-spacing -0.02em
- Body lede: 14.5px, line-height 1.55
- Body: 14px, line-height 1.6–1.65
- UI / label / small body: 13–13.5px
- Caption / meta: 11.5–12.5px

### Spacing scale
The prototype uses ad-hoc values; closest semantic scale:
- 4, 6, 8, 10, 12, 14, 18, 22, 24, 32, 40 (px)

### Border radius
```
--r-sm   6px   /* tags, small inputs           */
--r-md  10px   /* default cards, buttons, pills */
--r-lg  14px   /* panels, top-level cards       */
--r-xl  18px   /* (unused — reserve)            */
```
Tweaks panel also exposes `compact` (8/10) and `comfy` (12/16) ratios — pick one for production.

### Shadows / glows
- Accent CTA selected state inset: `0 0 0 1px var(--accent) inset, 0 8px 24px oklch(80% 0.115 200 / 0.08)`.
- Score glow: `0 0 40px var(--accent-glow)`.
- Scroller background has a single soft radial accent glow at top-right (200×600px) — purely decorative.

## Assets

No image assets. All icons are inline SVGs in `shell.jsx` (`Icon.Folder`, `Beaker`, `Gear`, `Bell`, `Cloud`, `File`, `Filter`, `Refresh`, `More`, `Flag`, `ArrowLeft`, `ArrowRight`, `Send`, `Check`, `X`, `Sparkles`, `Node`, `Plus`, `Empty`). They're hand-drawn at 24px viewBox with 1.6 stroke. Replace with your icon system (lucide-react ships near-identical equivalents and is the easiest swap).

Fonts are loaded from Google Fonts in the HTML head:
```
https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap
```

## Files in this bundle

- `Praxis Exam Engine.html` — entry point. Loads Google Fonts, React 18 + Babel standalone (prototype-only), then the JSX modules.
- `styles.css` — the entire design system. All CSS custom properties, layout, and component styles.
- `data.js` — mock data: file list + 6 sample neural-networks questions with explanations.
- `shell.jsx` — `<Sidebar>`, `<Topbar>`, and the `Icon` SVG set.
- `upload.jsx` — `<UploadPage>` (dropzone, generate strip, recent-uploads table).
- `test.jsx` — `<TestPage>`, `<FinishScreen>` (question card, choices, composer, pager, finish screen).
- `app.jsx` — root `<App>`, routing state, test-state container, tweaks-panel wiring.
- `tweaks-panel.jsx` — prototype-only tweak UI. Do **not** port to production; it's there for design exploration.

## Implementation Tips

1. Start by translating `styles.css` into your styling system's design tokens (Tailwind config, CSS-in-JS theme, etc.). The token names map directly.
2. Build `<Sidebar>` and `<Topbar>` as a layout primitive — both screens reuse them identically.
3. Build the upload page next: hero + dropzone + generate strip + table. The table can wait on real data — start with the empty state.
4. Build the test page after wiring routing. The choice button is the most reusable component (5 states) — make it once and reuse.
5. The composer grid needs `grid-template-columns: auto 1fr auto auto` (in that order). Earlier prototype iterations used 3 columns and the prefix `>` ballooned to fill the `1fr` — make sure your reimplementation has the input on the flexible column.
6. The pulsing "processing" status dot is just a CSS `@keyframes pulse` on opacity. Don't over-engineer it.
7. The score-screen number uses Geist Mono at 80px with `text-shadow: 0 0 40px var(--accent-glow)` for the glow — pure CSS, no canvas or filter tricks.

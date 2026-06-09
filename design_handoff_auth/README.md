# Handoff: Auth — Sign In / Create Account

## Overview
A split-screen authentication page for **Praxis (Exam Engine)** that lets users sign in or
create an account. A single screen toggles between two modes (`signin` / `signup`) via a
segmented control. It includes Google SSO, email/password fields, password reveal, a
signup-only password-strength meter, a terms checkbox, and "keep me signed in" on signin.

This is a **front-end-only mock** — there is no real authentication, network call, or routing
wired up. Submitting the form does nothing (`e.preventDefault()`). The integration task is to
recreate this UI in the existing app and wire it to the real auth backend + post-login route.

## About the Design Files
The files in this bundle are **design references created in HTML/React-via-Babel** — a prototype
showing the intended look and behavior, **not production code to ship directly**. The Praxis app
in this project is a browser-Babel React prototype (no build step, no bundler). Recreate this
auth screen using the target codebase's **real** environment and conventions (e.g. a proper
React + bundler setup, or whatever framework the production app uses), reusing its existing
design tokens, component library, form primitives, and routing.

If the production codebase is the same browser-Babel prototype seen here, you can integrate the
files almost as-is (see **Integration Notes**).

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and interactions are all specified.
Recreate the UI pixel-accurately using the codebase's existing primitives where they exist;
fall back to the exact token values below where they don't.

---

## Screens / Views

### Single screen: Auth (two modes)
Two-column CSS grid filling the viewport. Below 880px the left panel is hidden and the form
panel is centered full-width.

```
.auth { display:grid; grid-template-columns: 1.05fr 1fr; height:100vh; min-height:680px; }
@media (max-width:880px){ .auth{ grid-template-columns:1fr } .auth-aside{ display:none } }
```

#### Left panel — `.auth-aside` (brand / context)
- **Purpose:** brand reinforcement + value proposition. Non-interactive.
- **Layout:** flex column, `justify-content: space-between`, padding `44px 48px`,
  `border-right: 1px solid var(--hairline)`.
- **Background:** two stacked layers —
  `radial-gradient(900px 500px at 18% -10%, var(--accent-soft), transparent 60%)`
  over `linear-gradient(180deg, var(--bg-2) 0%, var(--bg) 100%)`.
- **Decorative grid** (`::before`): 46×46px grid of 1px `--hairline` lines, faded with a
  radial mask `radial-gradient(620px 620px at 16% 30%, #000 0%, transparent 72%)`, `opacity:.5`.
- **Contents top→bottom:**
  1. **Brand row:** 30×30px rounded-8px gradient glyph
     (`linear-gradient(135deg, var(--accent), var(--accent-2))`) + "Praxis" (19px/600) +
     a mono tag chip "EXAM ENGINE" (10px mono, 0.18em tracking, uppercase, `--faint`,
     1px `--hairline` border, radius 5px, padding `4px 8px`).
  2. **Pitch block (`max-width:440px`):**
     - Eyebrow: "PRACTICE TESTS, GENERATED" — mono 11px, 0.16em tracking, uppercase, `--accent`.
     - H1: "Turn your study material into exams that actually prepare you." — 40px / line-height
       1.06 / weight 600 / letter-spacing −0.03em / `text-wrap: balance`.
     - Paragraph (`max-width:400px`, 15px / 1.6 / `--ink-2`): "Drop in your sources and Praxis
       synthesizes calibrated practice tests — with explanations, scoring, and review built in."
     - **Feature list** (3 rows, gap 14px). Each row: 26×26px rounded-7px tick chip
       (`--accent-soft` bg, 1px `--hairline`, `--accent` check icon) + title (14px/500/`--ink`)
       + description (12.5px/`--muted`/1.5):
       - "Upload any source material" — "PDFs, notes, slide decks — the engine reads them all."
       - "Exam-grade question synthesis" — "Calibrated multiple-choice sets with worked explanations."
       - "Track accuracy across sessions" — "Per-module mastery, flagged items, and review queues."
  3. **Footer:** mono 11px `--faint` row: shield icon · "SOC 2 Type II" · "/" separator
     (`--hairline-strong`) · "Your sources stay private".

#### Right panel — `.auth-main` / `.auth-card` (form)
- **Layout:** flex centered, padding 40px, `overflow-y:auto`. Card `max-width: 392px`, flex column.
- **Header (`.auth-head`):**
  - H2 (25px / weight 600 / letter-spacing −0.025em): "Welcome back" (signin) /
    "Create your account" (signup).
  - Sub (13.5px / `--muted`): "Sign in to pick up where you left off." (signin) /
    "Start generating practice tests in minutes." (signup).
- **Segmented toggle (`.auth-seg`):** 2-col grid, gap 4px, padding 4px, `--bg-2` bg,
  1px `--hairline`, radius `--r-md`. Buttons 9px/10px padding, radius `--r-sm`, 13px/500.
  Inactive: transparent + `--muted`. Active (`.on`): `--surface` bg, `--ink` text,
  1px `--hairline-strong` border. Labels: "Sign in" / "Create account".
- **SSO (`.auth-sso`):** one full-width button — 18px Google "G" glyph + "Continue with Google".
  `--surface` bg, 1px `--hairline-strong`, radius `--r-md`, padding `11px 16px`, 13.5px/500.
  Hover → `--surface-2`.
- **Divider (`.auth-or`):** two 1px `--hairline` rules flanking a mono 10px / 0.14em / uppercase
  / `--faint` label "OR WITH EMAIL".
- **Form (`.auth-form`, flex column gap 15px):**
  - **Full name** *(signup only, mounts with `.field-anim` entrance)* — user icon, placeholder
    "Ada Lovelace", `autocomplete="name"`.
  - **Email** — mail icon, placeholder "you@institution.edu", `type="email"`,
    `autocomplete="email"`.
  - **Password** — lock icon; label row shows a "Forgot?" link **on signin only**;
    reveal (eye / eye-off) button toggles `type` between `password`/`text`;
    placeholder "••••••••••" (signin) / "At least 8 characters" (signup);
    `autocomplete` = `current-password` (signin) / `new-password` (signup).
    - **Strength meter** *(signup only, shown once a password is typed)* — 3 segment bars +
      mono 10px right-aligned label. Levels: Weak (`--danger`), Fair (`--warn`), Strong (`--good`).
  - **Options row (`.auth-row`):**
    - signin → checkbox "Keep me signed in" (default **checked**).
    - signup → checkbox "I agree to the Terms & Privacy" (default **unchecked**); "Terms"/"Privacy"
      are `--accent` links.
  - **Submit (`.auth-submit`):** full-width `--accent` button, `--accent-ink` text, 14px/600,
    radius `--r-md`, padding `13px 22px`, shadow `0 8px 24px oklch(80% 0.115 200 / 0.12)`,
    trailing arrow icon. Label "Sign in" / "Create account". Hover → `--accent-2`;
    active → `translateY(1px)`.
- **Mode switch (`.auth-switch`, centered 13px/`--muted`):**
  "New to Praxis? **Create an account**" (signin) / "Already have an account? **Sign in**" (signup).
  Bold part is an `--accent` text button that flips mode.
- **Legal (`.auth-legal`, centered 11.5px/`--faint`):** "Protected by reCAPTCHA. Subject to the
  Praxis Terms of Service and Privacy Policy." (last two are `--muted` links).

---

## Interactions & Behavior
- **Mode toggle:** segmented control and the bottom switch link both set `mode` to
  `'signin'` | `'signup'`. All conditional fields/labels derive from `isUp = mode === 'signup'`.
- **Password reveal:** local `show` boolean toggles input `type` and the eye/eye-off icon.
- **Password strength (signup):** `strengthOf(pw)` returns `-1..2`:
  - +1 if length ≥ 8
  - +1 if has both upper- and lower-case
  - +1 if has a digit OR symbol
  - returns `min(score,3) - 1`. `-1` ⇒ meter hidden; `0/1/2` ⇒ Weak/Fair/Strong.
- **Field entrance:** the signup-only Full name field uses `.field-anim` — a **transform-only**
  keyframe (`translateY(-5px) → 0`, 0.26s, `cubic-bezier(.3,.7,.4,1)`), gated behind
  `@media (prefers-reduced-motion: no-preference)`. **Do not animate opacity here** — a
  throttled/backgrounded tab can pause a CSS animation at frame 0; if opacity were animated from
  0 the field would be invisible. Resting state must be fully visible. (This was a real bug found
  and fixed in the prototype — preserve the transform-only approach.)
- **Input focus:** border → `--accent`, bg → `--surface`,
  `box-shadow: 0 0 0 3px var(--accent-soft)`.
- **Submit:** currently `preventDefault()` only. **Wire to real auth** (see below).
- **Responsive:** ≤880px hides the left panel; form panel centers full-width (padding `28px 22px`).

## State Management
Local component state (no store needed for the screen itself):
- `mode: 'signin' | 'signup'`
- `name, email, pw: string`
- `show: boolean` (password visibility)
- `remember: boolean` (signin; default `true`)
- `agree: boolean` (signup; default `false`)

Derived: `isUp`, `lvl = strengthOf(pw)`, `lvlText`.

**To integrate:** replace the no-op `submit` with real calls:
- signin → POST credentials; on success set session, route to the app's Library/home.
- signup → validate `agree === true`, POST registration; handle existing-email + weak-password
  errors inline near the relevant field.
- Google SSO button → kick off the OAuth flow.
- "Forgot?" link → route to password-reset.
- Add server/inline error rendering (the prototype has none) and a loading/disabled state on the
  submit button.

---

## Design Tokens
All tokens already exist in `styles.css` (`:root`). Auth introduces **no new tokens** — only new
component classes in `auth.css`. Accent is themeable at runtime (the app swaps `--accent*` vars).

| Token | Value |
|---|---|
| `--bg` | `oklch(17% 0.012 240)` |
| `--bg-2` | `oklch(20% 0.014 240)` |
| `--surface` | `oklch(23% 0.016 240)` |
| `--surface-2` | `oklch(26% 0.018 240)` |
| `--hairline` | `oklch(32% 0.020 240)` |
| `--hairline-strong` | `oklch(38% 0.024 240)` |
| `--ink` | `oklch(96% 0.005 240)` |
| `--ink-2` | `oklch(82% 0.012 240)` |
| `--muted` | `oklch(62% 0.018 240)` |
| `--faint` | `oklch(48% 0.018 240)` |
| `--accent` | `oklch(80% 0.115 200)` (cyan; hue swappable: violet 290 / lime 130 / amber 70) |
| `--accent-2` | `oklch(72% 0.115 200)` |
| `--accent-ink` | `oklch(20% 0.04 240)` |
| `--accent-soft` | `oklch(80% 0.115 200 / 0.12)` |
| `--accent-glow` | `oklch(80% 0.115 200 / 0.18)` |
| `--good` | `oklch(78% 0.13 155)` |
| `--warn` | `oklch(80% 0.13 70)` |
| `--danger` | `oklch(72% 0.16 25)` |
| Fonts | Display/body `Geist`; mono `Geist Mono` (Google Fonts) |
| Radii | `--r-sm 6px`, `--r-md 10px`, `--r-lg 14px`, `--r-xl 18px` (compact/comfy density variants exist) |

## Assets
- **Icons:** inline SVGs defined in `auth.jsx` as the `AuthIcon` map (Mail, Lock, User, Eye,
  EyeOff, Check, Arrow, Shield) — 1.6 stroke, `currentColor`, `round` caps/joins. The Google
  glyph is the official 4-color "G". No icon library/dependency; swap for the codebase's icon set
  if it has equivalents.
- **Fonts:** Geist + Geist Mono via Google Fonts `<link>` (see HTML `<head>`).
- **Images:** none. No raster assets.

## Integration Notes (same-stack shortcut)
If integrating into the existing Praxis prototype as-is:
1. Add `<link rel="stylesheet" href="auth.css" />` after `styles.css`.
2. Load `auth.jsx`. It currently self-mounts to `#root`
   (`ReactDOM.createRoot(...).render(<AuthScreen/>)`). To use it inside the app router instead,
   **remove that bottom render line**, export `AuthScreen` (e.g. `Object.assign(window,{AuthScreen})`),
   and render it as a route/gate ahead of `<App/>` in `app.jsx`.
3. `AuthScreen` takes no props today — add an `onAuthed` callback prop and call it from `submit`
   to hand control back to the app shell.

## Files
- `Praxis Auth.html` — entry point (fonts, `styles.css` + `auth.css`, React/Babel, mounts `auth.jsx`).
- `auth.jsx` — the `AuthScreen` component, `AuthIcon` set, `FEATURES`, `strengthOf()`.
- `auth.css` — all auth-specific styles (consumes `styles.css` tokens).
- `styles.css` — the app-wide design system / token source (reference; not auth-specific).

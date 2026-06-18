# Handoff: Praxis Logo — “Mastery” mark

The selected logo for **Praxis (Exam Engine)**: an *ascending-nodes* mark — four nodes
connected by a rising polyline, reading as a knowledge-graph climb toward mastery / progress
across study sessions. The final node is solid and largest (the goal); earlier nodes are hollow
rings (steps along the way).

These are **production-ready vector assets**, not a prototype to rebuild. Drop the SVGs into the
app and use the tokens/specs below. Recreate the wordmark lockup with the codebase's real type
styles.

## Files in this bundle
| File | Use |
|---|---|
| `praxis-mark.svg` | **Primary** app icon — accent-gradient rounded tile, dark foreground. Use for the favicon, app icon, sidebar brand glyph. |
| `praxis-mark-line.svg` | On-dark-surface variant — dark tile, gradient-stroke foreground. Use inside dark UI where the solid accent tile is too heavy. |
| `praxis-mark-mono.svg` | Glyph only, no tile, `currentColor` — inline/monochrome use (print, watermark, single-color contexts). Inherits text color. |

All are 96×96 viewBox, fully scalable. The mark holds up down to ~16px (favicon) — verified.

## Geometry (single source of truth)
- **viewBox:** `0 0 96 96`
- **Tile:** `<rect x=2 y=2 width=92 height=92 rx=24>` (24px corner radius at 96 = 25%).
- **Polyline path:** points `26,66 → 42,50 → 60,56 → 72,30`, `stroke-width=5`,
  round caps/joins, `opacity=0.85`.
- **Nodes:** circles at each polyline point.
  - Nodes 1–3 (hollow): `r=5.5`, fill = tile background, `stroke=fg`, `stroke-width=4`.
  - Node 4 / top-right (solid): `r=8`, `fill=fg`, no stroke.
- **fg** = `ink` on the primary fill; = the accent gradient on the line variant; = `currentColor` on mono.

## Color tokens (match `styles.css`)
| Role | Token / value |
|---|---|
| Accent (gradient start) | `oklch(80% 0.115 200)` |
| Accent 2 (gradient end) | `oklch(72% 0.115 200)` |
| Gradient | `linear-gradient` / `linearGradient` diagonal `(0,0)→(96,96)`, start→end |
| Foreground on accent (`ink`) | `oklch(20% 0.04 240)` |
| Dark tile bg | `oklch(23% 0.016 240)` |
| Dark tile edge | `oklch(38% 0.024 240)` |
| Light surface (for on-light tests) | `oklch(96% 0.005 240)` |

> The app's accent is **runtime-themeable** (the Tweaks panel swaps `--accent*` hue: cyan 200,
> violet 290, lime 130, amber 70). For the logo to re-theme with it, render the SVG inline and
> drive the gradient stops + tile fill from the live `--accent` / `--accent-2` CSS vars instead of
> hardcoding. If the logo should stay fixed-cyan regardless of theme, keep the hardcoded values.

## Wordmark lockup
Horizontal lockup = mark + two stacked text lines, `gap: 13px`, vertically centered:
- **“Praxis”** — `Geist`, weight **600**, `letter-spacing: -0.03em`, size ≈ `0.52 × markHeight`,
  color `--ink` (`oklch(96% 0.005 240)` on dark / `oklch(24% 0.02 240)` on light).
- **“EXAM ENGINE”** — `Geist Mono`, size ≈ `0.19 × markHeight`, `letter-spacing: 0.22em`,
  `text-transform: uppercase`, color `--muted` (`oklch(62% 0.018 240)` on dark /
  `oklch(50% 0.02 240)` on light), `margin-top ≈ 0.12 × markHeight`.
- The tagline line is optional — drop it for compact placements (just mark + “Praxis”).

Clear space: keep ≥ half the tile height of padding on all sides. Minimum lockup mark size 28px;
minimum standalone icon 16px (favicon).

## Don’ts
- Don't recolor the foreground to a non-token color or add extra shadows/bevels.
- Don't change node counts or the rising direction — the climb is the concept.
- Don't place the accent-filled primary on a saturated/clashing background; use the line or mono
  variant instead.

---

## Prompt for Claude Code

> Add the Praxis “Mastery” logo to our app. Read `design_handoff_logo/README.md` for the full spec.
>
> 1. Add the three SVGs from `design_handoff_logo/` to our asset pipeline (`praxis-mark.svg`
>    primary, `praxis-mark-line.svg`, `praxis-mark-mono.svg`).
> 2. Replace the current brand glyph in the sidebar/topbar with the primary mark, and set the
>    favicon + app icons (incl. apple-touch-icon and a maskable PWA icon) from it.
> 3. Build a reusable `<Logo>` component supporting `variant="primary|line|mono"`,
>    `showWordmark` (mark only vs. full lockup), and `size`. Implement the wordmark lockup with
>    our real Geist / Geist Mono type styles exactly per the README (sizes, tracking, colors).
> 4. Our accent is theme-swappable via `--accent` / `--accent-2`. Render the mark **inline** and
>    drive the SVG gradient stops + tile fill from those live CSS variables so the logo re-themes
>    with the accent. (If product decides the logo should stay fixed-cyan, hardcode the token
>    values instead — flag this and ask.)
> 5. Use the `mono` variant (currentColor) anywhere a single-color logo is needed.
>
> Match the geometry and tokens in the README precisely; don't redraw the mark.

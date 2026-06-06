# Geometry Explorer

An interactive, scroll-driven educational website that guides students through the progression of geometric shapes — from a dimensionless point to an N-sided polygon — with animated SVG drawings, scroll-revealed formulas, mouse parallax, and bilingual support.

---

## Live Preview

Open `index.html` directly in any modern browser, or serve it locally:

```bash
npx serve .
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Structure | Semantic HTML5 |
| Styling | Vanilla CSS3 (custom properties, grid, scroll-snap, transitions) |
| Logic | Vanilla JavaScript (ES2020, no frameworks or bundlers) |
| Fonts | [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) + [Space Mono](https://fonts.google.com/specimen/Space+Mono) via Google Fonts |
| Graphics | Inline SVG (programmatically generated) |
| Animations | CSS `stroke-dashoffset`, `transform`, `opacity` transitions |
| Scroll | `IntersectionObserver` + manual scroll progress tracking |
| Snap | CSS `scroll-snap-type: y proximity` |
| Build | None — single `.html` file, zero dependencies |

---

## Features

- **8 shape sections** — Point, Line Segment, Triangle, Square, Pentagon, Hexagon, Heptagon, Octagon
- **Scroll-driven formula reveals** — each shape section is 260 vh tall; formulas appear progressively as you scroll through
- **SVG draw animation** — `stroke-dashoffset` animates from full length to `0` when a shape enters the viewport, drawing it stroke by stroke
- **Mouse parallax** — the shape canvas tracks cursor position and applies a subtle `rotateX / rotateY` tilt via CSS `perspective`
- **Sticky sections** — `position: sticky` keeps the shape + formulas locked on screen while the outer section scrolls
- **Scroll snap** — `scroll-snap-type: y proximity` creates a gentle magnetic pull at the start of each section
- **Interactive N-gon** — a range slider (3–30 sides) regenerates the SVG polygon and recalculates all formulas live
- **Hamburger navigation menu** — split-panel overlay with two tabs (**Shapes** and **Exercises**), inspired by the GTA VI site menu; each tab lists all 9 shapes and scrolls directly to the chosen section or exercise group; X to close, click-outside to dismiss
- **EN / ES bilingual toggle** — all labels, formula descriptions, shape names, tab labels, and exercise text switch instantly without a page reload
- **Night Sky color palette** — each section has a unique atmospheric background tint derived from the palette, gradients between adjacent sections
- **Interactive Exercises section** — 27 problems grouped by shape (3 per shape), live answer checking with ±0.015 tolerance for decimals, hint revealed after 2 wrong attempts, persistent score tracker, fully bilingual
- **Back-to-top button** — appears only after entering the N-gon or Exercises section

---

## File Structure

```
ciencias_naturales/
├── index.html          # Entire app — HTML + CSS + JS in one file
├── README.md           # This file (English)
├── README.es.md        # Spanish README
├── LESSON.md           # Step-by-step tutorial: how to build this from scratch
└── .git/               # Git repository
```

### Page sections (in scroll order)
1. **Hero** — full-screen title
2. **Shape sections × 8** — Point → Octagon, each 260 vh with sticky content
3. **N-Gon** — interactive polygon slider
4. **Exercises** — 27 practice problems grouped by shape
5. **Footer**

---

## How It Works — Quick Reference

### Shape sections
Each shape section is a `<section class="shape-section">` element that is **260 vh tall**. Inside it sits a `<div class="sticky-wrapper">` that is `position: sticky; top: 0; height: 100vh`. This means the content stays fixed on screen while the outer section scrolls past it — giving the scroll budget needed to reveal formulas one by one.

### Formula reveal
A `scroll` event listener calculates `progress = -rect.top / (section.height - viewport.height)` (0 → 1). Each formula card gets its `.visible` class at evenly spaced thresholds along that range.

### SVG draw
After a section enters the viewport, `path.getTotalLength()` measures the polygon perimeter and sets `stroke-dasharray = stroke-dashoffset = length`. A CSS transition then animates `stroke-dashoffset` to `0`, drawing the stroke.

### N-gon math
All regular polygon vertices are derived from:
```
x = cx + R · cos(2πi/n − π/2)
y = cy + R · sin(2πi/n − π/2)
```
Area, interior angle, and angle sum update reactively from the slider value.

---

## Inspiration

Visual design and scroll-animation pattern inspired by the [Rockstar Games GTA VI website](https://www.rockstargames.com/VI) — built with Next.js App Router, CSS scroll-driven animations, and sticky sections.

---

## License

MIT — free to use and modify for educational purposes.

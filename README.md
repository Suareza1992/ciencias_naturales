# Geometry Explorer

An interactive, scroll-driven educational website in three subjects — **Geometry**, **Pre-Calculus** and **Calculus** — with animated SVG drawings and graphs, scroll-revealed formulas, long-form Deep Dive explanations, interactive labs, checked exercises, mouse parallax, and English/Spanish support.

| Page | Subject | Contents |
|---|---|---|
| `index.html` | Geometry | Point → Octagon, N-gon slider, 27 exercises |
| `precalculus.html` | Pre-Calculus | 14 topics, Function Transformer lab, 42 exercises |
| `calculus.html` | Calculus | 15 topics, Derivative & Integral Lab, 45 exercises |

The three pages link to each other from the menu (subject switcher) and from a "Next subject" button at the end of each page. The language choice is remembered across pages.

---

## Live Preview

Open any of the three pages directly in a modern browser, or serve the folder locally:

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
| Build | None — no bundler, no npm packages, no math library |

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

### Pre-Calculus & Calculus pages

- **29 topics** — Pre-Calculus: Functions, Linear & Quadratic, Polynomials, Rational, Exponential, Logarithms, Unit Circle, Trig Graphs, Trig Identities, Law of Sines & Cosines, Vectors, Polar & Complex, Conic Sections, Sequences & Series. Calculus: Limits, Continuity, The Derivative, Differentiation Rules, Chain Rule & Implicit, Transcendental Derivatives, Curve Sketching, Optimization & Related Rates, L’Hôpital, Riemann Sums, Fundamental Theorem, Integration Techniques, Area & Volume, Differential Equations, Taylor Series
- **Same sticky-scroll pattern as Geometry** — each topic is 260 vh; its graph draws itself and 4 formula cards reveal as you scroll
- **Function graphs instead of polygons** — every topic has a plotted figure (asymptotes, tangent lines, Riemann rectangles, slope fields, Taylor polynomials…) drawn with `stroke-dashoffset`
- **Deep Dive after every topic** — The Big Idea, Why It Works, Common Mistakes, a step-by-step Worked Example, and Where You’ll See It
- **Function Transformer lab** (Pre-Calculus) — pick x², x³, √x, |x|, sin x, eˣ or 1/x and drag a, b, h, k in `y = a·f(b(x − h)) + k`; every change is explained in words
- **Derivative & Integral Lab** (Calculus) — slide x₀ to see the tangent line and f′(x₀); raise n to watch left/midpoint/right rectangles converge on the exact integral
- **Smarter answer checking** — accepts decimals, commas, fractions (`3/4`) and π (`pi`, `2pi`, `-pi/3`)

---

## File Structure

```
ciencias_naturales/
├── index.html              # Geometry — HTML + CSS + JS in one file (the original)
├── precalculus.html        # Pre-Calculus page: hero text + Explorer.init(...)
├── precalculus-topics.js   # Pre-Calculus data: 14 topics (graph, formulas, Deep Dive, exercises)
├── precalculus-lab.js      # Function Transformer lab
├── calculus.html           # Calculus page: hero text + Explorer.init(...)
├── calculus-topics.js      # Calculus data: 15 topics
├── calculus-lab.js         # Derivative & Integral Lab
├── shared/
│   ├── explorer.css        # Styles for both new pages (geometry look + graphs, Deep Dives, labs)
│   ├── explorer.js         # Engine: builds hero, topics, Deep Dives, exercises, menu, EN/ES
│   └── graph.js            # Tiny plotting helper: math coordinates → SVG
├── README.md               # This file (English)
├── README.es.md            # Spanish README
├── LESSON.md               # Step-by-step tutorial (Steps 16–19 cover the engine)
└── PLAN-precalc-calc.md    # The build plan for the Pre-Calculus & Calculus pages
```

### Adding a topic

Topics are plain data. To add one, append an object to `PRECALC_TOPICS` or `CALC_TOPICS`:

```js
{
  id: 'my-topic', color: '#8FB8E8',
  tag:  L('Eyebrow text', 'Texto superior'),
  name: L('My Topic', 'Mi Tema'),
  graph() {
    const g = Graph({ x: [-4, 4], y: [-3, 3] });
    g.grid(1).axes({ ticks: 1 });
    g.fn(x => Math.sin(x), { color: 1 });
    return g.svg();
  },
  formulas:  [{ label: L('…', '…'), expr: 'y = …', desc: L('…', '…') }],
  deep:      { idea: [L('…', '…')], why: [...], mistakes: [...], example: { prompt, steps: [...], answer }, real: [...] },
  exercises: [{ q: L('…', '…'), answer: 42, hint: L('…', '…') }],
}
```

The engine builds the section, the Deep Dive, the menu links and the exercise group automatically. Inside text, wrap math in backticks (`` `x²` ``) to style it as inline math.

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

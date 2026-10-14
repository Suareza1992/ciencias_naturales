# Geometry Explorer

An interactive, scroll-driven educational website in four subjects — **Geometry**, **Pre-Calculus**, **Calculus** and **Linear Algebra** — with animated SVG drawings and graphs, scroll-revealed formulas, long-form Deep Dive explanations, interactive labs, checked exercises, mouse parallax, and English/Spanish support.

| Page | Subject | Contents |
|---|---|---|
| `index.html` | Geometry | Point → Octagon, N-gon slider, 27 exercises |
| `precalculus.html` | Pre-Calculus | 14 topics, Function Transformer lab, 42 exercises |
| `calculus.html` | Calculus | 15 topics, Derivative & Integral Lab, 45 exercises |
| `linear-algebra.html` | Linear Algebra | 16 AR/VR-focused topics, Transform Playground, 192 generated fill-in-the-matrix exercises (unlimited with New ↻ / + More) |

The pages link to each other from the menu (subject switcher) and from a "Next subject" button at the end of each page. The language choice is remembered across pages.

---

## Live Preview

Open any of the pages directly in a modern browser, or serve the folder locally:

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

### Linear Algebra page (built for AR/VR and 3D graphics)

- **16 topics** — Vectors in 3D, Dot Product, Cross Product, Matrices & Operations, Matrix Multiplication, Systems & Elimination, Determinants, Inverse Matrices, 2D Transformations, 3D Rotations, Homogeneous Coordinates (4×4 / TRS), Change of Basis (local/world/view space), Orthogonality & Gram–Schmidt, Projection Matrices, Eigenvalues & Eigenvectors, Quaternions. Every Deep Dive ends with how the topic is used in AR/VR engines
- **Fill-in-the-matrix exercises** — each card shows the given matrices and an answer matrix with blank cells to type into. Check colors every cell green/red; **Show answer** fills the blanks; **Show steps** explains how every single entry is calculated (row-times-column sums, every Gauss–Jordan row operation with the intermediate matrix, cofactor and adjugate matrices, Hamilton products…)
- **Easy / Medium / Hard** — 4 of each per topic (192 total), with a difficulty filter. Easy leaves some cells as hints; Hard leaves none and combines ideas (e.g. T·R·S model matrices, 4×4 determinants, 3-vector Gram–Schmidt, perspective matrices)
- **Unlimited practice** — exercises are produced by **generators**, not typed by hand: **New ↻** replaces a card with a fresh problem and **+ More exercises** adds three more to a topic. A seeded random generator keeps the first set identical on every reload
- **Exact math** — solutions are computed with exact fractions (`shared/matrix-practice.js`), and every generator is fuzz-tested and checked (Ax = b, A·A⁻¹ = I, Av = λv, q·v·q* …)
- **Transform Playground lab** — an editable 4×4 matrix drives a 3D cube; presets (translate, scale, rotate X/Y/Z, shear, mirror, flatten, perspective) can be composed (M ← P·M), and the page explains the determinant, axes, translation and perspective of the current matrix

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
├── linear-algebra.html     # Linear Algebra page: hero text + Explorer.init(... practice ...)
├── linear-algebra-topics.js    # 16 topics (graphs, formulas, Deep Dives)
├── linear-algebra-exercises.js # Exercise GENERATORS: easy/medium/hard per topic, with steps
├── linear-algebra-lab.js       # Transform Playground (4×4 matrix + cube)
├── shared/
│   ├── explorer.css        # Styles for both new pages (geometry look + graphs, Deep Dives, labs)
│   ├── explorer.js         # Engine: builds hero, topics, Deep Dives, exercises, menu, EN/ES
│   ├── graph.js            # Tiny plotting helper: math coordinates → SVG
│   └── matrix-practice.js  # Fill-in-the-matrix UI, exact fractions, seeded randomness
├── README.md               # This file (English)
├── README.es.md            # Spanish README
├── LESSON.md               # Step-by-step tutorial (Steps 16–20 cover the engine)
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

### Adding a Linear Algebra exercise type

Add a generator to `LA_GENERATORS` in `linear-algebra-exercises.js` under the topic’s `id`:

```js
G.myTopic = {
  easy(r) {                          // r = seeded random: r.int(a, b), r.nz(), r.pick([...]), r.mat(rows, cols, a, b)
    const A = r.mat(2, 2, -5, 5);
    return {
      prompt: L('Compute 2A.', 'Calcula 2A.'),
      lhs:    [{ label: 'A', m: A }],
      answer: { label: '2A', m: A.map(row => row.map(x => 2 * x)) },   // blanks are chosen automatically
      steps:  [L('Multiply every entry by 2.', 'Multiplica cada entrada por 2.')],
    };
  },
  medium(r) { … }, hard(r) { … },
};
```

Return `null` to reject a bad draw (the engine draws again). Entries may be numbers or exact fractions (`new MX.Fr(3, 4)`).

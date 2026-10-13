# Plan — Adding Pre-Calculus & Calculus

> **Status (2026-10-13): all 5 parts built and checked in the browser** (desktop, mobile, EN/ES). Changes from the original plan: topic data lives in its own files (`precalculus-topics.js`, `calculus-topics.js`) and labs in `*-lab.js` instead of inline in the HTML; Calculus has **15** topics because Differential Equations and Taylor Series each got their own.

Goal: extend Geometry Explorer with two new subjects, **Pre-Calculus** and **Calculus**, built the same way as the geometry page: scroll-driven sticky sections, SVG graphs that draw themselves, formula cards revealed by scroll, mouse parallax, a hamburger menu with tabs, EN/ES toggle, an interactive lab, and checked exercises. On top of that, each topic gets a long-form **Deep Dive**: what it means, why it works, a step-by-step worked example and common mistakes.

---

## Architecture

| File | Role |
|---|---|
| `index.html` | Geometry (left as it is, apart from links to the new subjects in its menu + hero) |
| `precalculus.html` | Pre-Calculus page: hero text + `Explorer.init` (data in `precalculus-topics.js`, lab in `precalculus-lab.js`) |
| `calculus.html` | Calculus page: hero text + `Explorer.init` (data in `calculus-topics.js`, lab in `calculus-lab.js`) |
| `shared/explorer.css` | Styles shared by both new pages (copied from the geometry page + new Deep Dive, graph, lab and subject-switcher styles) |
| `shared/explorer.js` | Engine: builds sections from a `TOPICS` array, draws graphs, runs the scroll reveals, parallax, menu, language toggle and exercises |
| `shared/graph.js` | Small plotting helper: maps math coordinates to SVG, samples `f(x)` into a path, draws axes, grid, asymptotes, shaded areas |

The geometry page stays a single file with zero dependencies. The two new pages use the shared engine so the ~30 topics are mostly *data*. Adding a topic means adding one object to an array.

Each topic object:
```js
{
  id, color,
  name: {en, es}, tag: {en, es},          // header + eyebrow
  graph: (g) => { ... },                   // draws into the SVG via graph.js
  formulas: [{ label:{en,es}, expr, desc:{en,es} }],
  deep: { en: html, es: html },            // long-form explanation + worked example
  exercises: [{ q:{en,es}, answer, hint:{en,es} }],
}
```

Math is written in Unicode (`∫ ∑ lim √ π θ ′ ²`) in Space Mono, the same way the geometry page does it. No KaTeX, so there are still no external dependencies.

---

## Pre-Calculus — 14 topics

| # | Topic | Graph | Key formulas |
|---|---|---|---|
| 1 | Functions | f and f⁻¹ reflected across y = x | notation, domain/range, composition, inverse |
| 2 | Linear & Quadratic | parabola + vertex + axis | slope-intercept, vertex form, quadratic formula, discriminant |
| 3 | Polynomials | cubic with 3 roots | end behavior, factor/remainder theorem, max turning points |
| 4 | Rational Functions | hyperbola + asymptotes | vertical/horizontal/oblique asymptotes, holes |
| 5 | Exponentials | eˣ and 2ˣ | growth/decay, compound interest, continuous growth |
| 6 | Logarithms | ln x | definition, product/quotient/power laws, change of base |
| 7 | Unit Circle | circle + rotating radius | radians, arc length, (cos θ, sin θ) |
| 8 | Trig Graphs | sine wave | amplitude, period, phase shift, tan |
| 9 | Trig Identities | sin² + cos² stacked waves | Pythagorean, sum/difference, double angle |
| 10 | Law of Sines & Cosines | oblique triangle | both laws, SAS area |
| 11 | Vectors | two arrows + sum | magnitude, components, dot product, angle |
| 12 | Polar & Complex | rose curve | polar ↔ rectangular, polar form, De Moivre |
| 13 | Conic Sections | ellipse + foci | circle, parabola, ellipse, hyperbola |
| 14 | Sequences & Series | bars of a geometric series | arithmetic/geometric nth term & sums, infinite sum |

**Lab: Function Transformer.** Pick a parent function (x², x³, √x, |x|, sin x, eˣ, 1/x) and drag sliders for `a`, `h`, `k` in `y = a·f(x − h) + k`. The graph and the explanation of each transformation update live.

## Calculus — 15 topics

| # | Topic | Graph | Key formulas |
|---|---|---|---|
| 1 | Limits | curve with a hole, arrows approaching | definition, limit laws, special limits |
| 2 | Continuity | piecewise jump + IVT | 3 conditions, IVT, types of discontinuity |
| 3 | The Derivative | secant lines turning into a tangent | limit definition, notation, tangent line |
| 4 | Differentiation Rules | x³ and its derivative | power, product, quotient rules |
| 5 | Chain Rule & Implicit | circle with tangent | chain rule, implicit differentiation |
| 6 | Transcendental Derivatives | sin x / cos x pair | trig, eˣ, ln x, inverse trig |
| 7 | Curve Sketching | cubic with extrema + inflection | critical points, 1st/2nd derivative tests |
| 8 | Optimization & Related Rates | box volume curve | setup recipe, related rates, MVT |
| 9 | L'Hôpital's Rule | sin x / x → 1 | 0/0, ∞/∞ forms, other indeterminate forms |
| 10 | Riemann Sums | rectangles under a curve | left/right/midpoint, Σ notation |
| 11 | Fundamental Theorem | area accumulating | FTC 1 & 2, properties |
| 12 | Integration Techniques | — product curve | antiderivative table, u-substitution, by parts |
| 13 | Area & Volume | area between curves + disk | area between curves, disk & washer, average value |
| 14 | Differential Equations | slope field for y′ = x − y | separable ODEs, growth y′ = ky, Euler’s method |
| 15 | Taylor Series | Taylor polynomials hugging sin x | Taylor/Maclaurin, eˣ, sin, cos, ratio test |

**Lab: Derivative & Integral Lab.** Choose a function and drag the point `x₀` to see the tangent line and the slope f′(x₀). A second slider sets `n` rectangles for a Riemann sum and compares it to the exact integral.

---

## Build Parts

1. **Engine + Pre-Calculus 1–7.** `shared/` CSS, JS and graph helper; `precalculus.html` with hero, topics 1–7, Deep Dives, exercises, menu, EN/ES.
2. **Pre-Calculus 8–14 + Function Transformer lab.**
3. **Calculus 1–7.**
4. **Calculus 8–15 + Derivative & Integral Lab.**
5. **Wire-up & docs.** Subject switcher on all three pages (Geometry · Pre-Calc · Calculus), README/README.es updates, and a LESSON section on how the engine works. Check desktop, mobile and EN/ES.

Each part is checked in the browser preview before moving on.

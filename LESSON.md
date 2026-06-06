# How to Build Geometry Explorer — Step by Step

This lesson walks you through building the entire site from a blank file. Each step introduces one concept, builds on the previous one, and ends with something you can open in a browser and see working. No frameworks, no build tools — just HTML, CSS, and JavaScript.

---

## What You'll Learn

1. HTML skeleton and CSS custom properties
2. Typography with Google Fonts
3. Building a hero section
4. CSS Grid for two-column layouts
5. SVG — drawing shapes with math
6. The sticky scroll pattern
7. Animating SVG with `stroke-dashoffset`
8. Scroll progress tracking and formula reveals
9. Mouse parallax with CSS `perspective`
10. CSS scroll-snap
11. JavaScript-driven sections (generating HTML from data)
12. Bilingual toggle — swapping text without reloading
13. A hamburger navigation menu overlay with tabs
14. Atmospheric background palettes
15. Interactive exercises with live answer checking

---

## Step 1 — The HTML Shell

Every webpage starts with a declaration of what kind of document it is and some metadata.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Geometry Explorer</title>
</head>
<body>
  <h1>Hello, Geometry</h1>
</body>
</html>
```

**What each line does:**
- `<!DOCTYPE html>` — tells the browser this is modern HTML5, not an older format.
- `<meta charset="UTF-8">` — allows accented characters (é, ñ, π, √) to display correctly.
- `<meta name="viewport" ...>` — makes the page fit mobile screens instead of zooming out.
- `lang="en"` — tells screen readers and search engines the document language.

**Try it:** Save as `index.html`, double-click it, you'll see "Hello, Geometry" in the browser.

---

## Step 2 — CSS Custom Properties (Variables)

CSS custom properties let you define colors and fonts once and reuse them everywhere. If you want to change the accent color later, you change it in one place.

```html
<style>
  :root {
    --bg:     #07080f;
    --text:   #f0ede6;
    --accent: #d4a853;
    --muted:  rgba(240, 237, 230, 0.45);
    --sans:   'Space Grotesk', sans-serif;
    --mono:   'Space Mono', monospace;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
  }
</style>
```

**Concepts:**
- `:root` — the root element of the page (same as `html` but with higher specificity). Variables defined here are global.
- `var(--name)` — reads the value of a variable.
- `box-sizing: border-box` — makes width/height include padding and border, which is almost always what you want.
- The `*` selector — applies to every element. `*::before` and `*::after` cover pseudo-elements too.

---

## Step 3 — Google Fonts

Add this `<link>` inside `<head>` **before** your `<style>` tag:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
```

**What this does:** Downloads two font families from Google's CDN.
- `Space Grotesk` — a clean geometric sans-serif for headings and body text.
- `Space Mono` — a monospaced font for code-like formula expressions.
- `display=swap` — shows a fallback font while loading; swaps when the font arrives.
- `preconnect` — opens the network connection early, reducing load time.

After adding this, `font-family: 'Space Grotesk', sans-serif` will use the downloaded font.

---

## Step 4 — The Hero Section

A "hero" is the first full-screen section a visitor sees. The key technique is `height: 100vh` (100% of the viewport height) and flexbox to center everything.

```html
<section class="hero">
  <p class="eyebrow">An Interactive Journey</p>
  <h1>Geometry</h1>
  <p class="hero-sub">From a single point to infinite sides.</p>
</section>
```

```css
.hero {
  height: 100vh;                  /* Full screen height */
  display: flex;
  flex-direction: column;
  align-items: center;            /* Center horizontally */
  justify-content: center;        /* Center vertically */
  text-align: center;
  padding: 2rem;
}

.eyebrow {
  font-size: 0.7rem;
  letter-spacing: 0.28em;         /* Wide tracking for the label */
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 1.75rem;
}

h1 {
  font-size: clamp(4.5rem, 13vw, 11rem);  /* Responsive font size */
  font-weight: 700;
  text-transform: uppercase;
  line-height: 0.88;
}
```

**New concepts:**
- `100vh` — `vh` means "viewport height". `100vh` = the full height of the browser window.
- `display: flex` — turns the element into a flex container. Children line up along an axis.
- `flex-direction: column` — stacks children top to bottom instead of left to right.
- `align-items: center` — centers children perpendicular to the main axis (horizontally, here).
- `justify-content: center` — centers children along the main axis (vertically, here).
- `clamp(min, preferred, max)` — a responsive value: grows with the viewport but never below `min` or above `max`. This makes the title scale with screen size.

---

## Step 5 — Drawing Shapes with SVG and Math

SVG (Scalable Vector Graphics) lets you draw geometric shapes directly in HTML. For a **regular polygon** with `n` sides, every vertex can be found with trigonometry.

### The Formula

Place the polygon center at `(cx, cy)` with a circumradius of `R`. The `i`-th vertex is at:

```
angle = (2π × i / n) − π/2        ← −π/2 rotates so the first vertex points up
x     = cx + R × cos(angle)
y     = cy + R × sin(angle)
```

### In JavaScript

```js
function regularPolygonPath(n, cx, cy, R) {
  const points = [];
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i / n) - Math.PI / 2;
    points.push([
      cx + R * Math.cos(angle),
      cy + R * Math.sin(angle)
    ]);
  }
  // Build an SVG path string: M x,y L x,y L x,y ... Z
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`)
    .join(' ') + 'Z';
}
```

### Using it in HTML

```html
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <path id="hexagon" fill="none" stroke="#d4a853" stroke-width="2.5"/>
</svg>

<script>
  document.getElementById('hexagon').setAttribute(
    'd',
    regularPolygonPath(6, 200, 200, 148)
  );
</script>
```

**Concepts:**
- `viewBox="0 0 400 400"` — creates a 400×400 coordinate space. The SVG will scale to fill its CSS size while keeping proportions.
- `M` (moveto), `L` (lineto), `Z` (closepath) — SVG path commands.
- `toFixed(2)` — rounds to 2 decimal places to keep the output clean.

---

## Step 6 — The Sticky Scroll Pattern

This is the central technique of the site. The idea: make a section very tall so the user spends time "inside" it, but keep the visual content fixed to the screen the whole time.

```html
<section class="shape-section">      <!-- 260vh tall outer scroll container -->
  <div class="sticky-wrapper">       <!-- 100vh, sticks to top while scrolling -->
    <div class="shape-display"> ... </div>
    <div class="formula-panel"> ... </div>
  </div>
</section>
```

```css
.shape-section {
  position: relative;
  height: 260vh;           /* Tall enough to scroll through */
}

.sticky-wrapper {
  position: sticky;
  top: 0;                  /* Sticks to the top of the viewport */
  height: 100vh;           /* Occupies the full screen */
  display: grid;
  grid-template-columns: 1fr 1fr;  /* Two equal columns */
}
```

**How it works:** When `.sticky-wrapper` reaches `top: 0`, the browser "sticks" it there. As the user scrolls, the outer `.shape-section` scrolls normally (its height is 260vh), but the inner wrapper stays put. Once the bottom of the outer section reaches the bottom of the screen, the wrapper unsticks and scrolls away.

**This gives you 160vh of invisible scroll budget** — the difference between 260vh and 100vh — which you use to trigger animations.

---

## Step 7 — Animating SVG with `stroke-dashoffset`

This trick makes shapes appear to draw themselves.

### How it works

Every SVG path has two properties:
- `stroke-dasharray: L` — sets the dash pattern to one dash of length `L` (the whole path length).
- `stroke-dashoffset: L` — shifts the dash so the entire dash is "off screen" — invisible.

When you animate `stroke-dashoffset` from `L` to `0`, the dash slides into position, revealing the stroke progressively.

```js
function setupDrawAnimation(path) {
  const length = path.getTotalLength();  // Measure the path's total length
  path.style.strokeDasharray  = length;
  path.style.strokeDashoffset = length;  // Start invisible
  path.style.transition = 'stroke-dashoffset 1.5s ease';
}

function triggerDraw(path) {
  path.style.strokeDashoffset = '0';     // Animate to fully visible
}
```

### When to trigger it

Use `IntersectionObserver` to detect when the section enters the viewport:

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      triggerDraw(entry.target.querySelector('path'));
    }
  });
}, { threshold: 0.2 });  // Fire when 20% of the section is visible

observer.observe(document.querySelector('.shape-section'));
```

---

## Step 8 — Scroll Progress Tracking

To reveal formula cards one by one as the user scrolls through a section, you need to calculate how far through the section the scroll position is.

```js
window.addEventListener('scroll', () => {
  document.querySelectorAll('.shape-section').forEach(section => {
    const rect     = section.getBoundingClientRect();
    const vh       = window.innerHeight;
    const scrollable = rect.height - vh;          // The "budget" (260vh - 100vh = 160vh)

    // progress goes from 0 (section just entered) to 1 (section about to leave)
    const progress = Math.max(0, Math.min(1, -rect.top / scrollable));

    // Reveal each formula card at evenly-spaced thresholds
    const cards = section.querySelectorAll('.formula-card');
    cards.forEach((card, i) => {
      const threshold = (i + 1) / (cards.length + 1);  // e.g. 0.25, 0.5, 0.75
      card.classList.toggle('visible', progress >= threshold);
    });
  });
}, { passive: true });
```

**Breaking down the progress formula:**
- `rect.top` — distance from the top of the section to the top of the viewport. It is **negative** once the section starts scrolling past the viewport top.
- `-rect.top` — flips the sign so it goes from 0 to positive as we scroll down.
- `/ scrollable` — normalizes to 0–1.
- `Math.max(0, Math.min(1, ...))` — clamps to the 0–1 range (called "clamping").

**The `.visible` class** just changes `opacity` and `transform`:

```css
.formula-card {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}

.formula-card.visible {
  opacity: 1;
  transform: translateY(0);
}
```

---

## Step 9 — Mouse Parallax with CSS Perspective

When the mouse moves, the shape tilts slightly in 3D — giving it a tactile, "holographic" feel.

```js
document.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;

  // dx and dy are in the range -1 to 1
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  // Convert to rotation degrees (max 14°)
  const rotX = -dy * 14;
  const rotY =  dx * 14;

  document.querySelectorAll('.shape-inner').forEach(el => {
    el.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
});
```

The parent element needs `perspective` for the 3D rotation to look right:

```css
.shape-canvas {
  perspective: 900px;    /* Distance from the viewer to the screen plane */
}

.shape-inner {
  transform-style: preserve-3d;   /* Children inherit the 3D context */
  transition: transform 0.08s linear;  /* Lag-free tracking */
  will-change: transform;             /* Hint to the browser for GPU compositing */
}
```

**Key idea:** `perspective` doesn't rotate anything — it just sets up the "camera distance". The actual rotation happens on `.shape-inner`. The closer the perspective value, the more dramatic the 3D effect.

---

## Step 10 — CSS Scroll Snap

Scroll snap creates the subtle magnetic pull that locks each section to the viewport when you scroll near it.

```css
html {
  scroll-snap-type: y proximity;   /* Snap on the Y axis, only when close */
  scroll-behavior: smooth;
}

.hero          { scroll-snap-align: start; }
.shape-section { scroll-snap-align: start; }
.ngon-section  { scroll-snap-align: start; }
```

**The two values for `scroll-snap-type`:**
- `mandatory` — always snaps, even mid-scroll. Feels like a strict page-turner.
- `proximity` — only snaps when you're already near a snap point. Feels natural and subtle — the right choice here because sections are 260vh tall and you need free scrolling within them.

**`scroll-snap-align: start`** — aligns the top of the element to the top of the viewport when snapping.

---

## Step 11 — Generating HTML from Data (The Shapes Array)

Instead of writing 8 nearly identical HTML sections by hand, you define the data once and generate the HTML with JavaScript. This is the "separation of data and presentation" pattern.

```js
const SHAPES = [
  {
    id: 'triangle',
    name: 'Triangle',
    sides: 3,
    dimension: '2-Dimensional',
    sidesLabel: '3 Sides',
    formulas: [
      { label: 'Perimeter', expr: 'P = a + b + c', desc: 'Sum of all three sides.' },
      { label: 'Area',      expr: 'A = ½ · b · h', desc: 'Half base times height.' },
    ]
  },
  // ... more shapes
];

const container = document.getElementById('shapes-container');

SHAPES.forEach((shape, idx) => {
  const section = document.createElement('section');
  section.className = 'shape-section';

  // Generate SVG path
  const d = regularPolygonPath(shape.sides, 200, 200, 148);

  // Build formula cards HTML
  const cards = shape.formulas.map(f => `
    <div class="formula-card">
      <div class="f-label">${f.label}</div>
      <div class="f-expr">${f.expr}</div>
      <div class="f-desc">${f.desc}</div>
    </div>
  `).join('');

  section.innerHTML = `
    <div class="sticky-wrapper">
      <div class="shape-display">
        <h2>${shape.name}</h2>
        <svg viewBox="0 0 400 400">
          <path class="shape-path" d="${d}" fill="none" stroke="#d4a853" stroke-width="2.5"/>
        </svg>
      </div>
      <div class="formula-panel">${cards}</div>
    </div>
  `;

  container.appendChild(section);
});
```

**Why this matters:** If you need to add a shape, fix a typo, or add a new formula, you change the data — not the HTML-generation code. Keeping data and logic separate is one of the most important habits in software development.

---

## Step 12 — Bilingual Toggle

The toggle swaps every piece of user-facing text between English and Spanish without reloading the page. The pattern:

1. Store all text in a `TRANSLATIONS` object keyed by language code.
2. On toggle, read from the right language and update the DOM.

```js
const TRANSLATIONS = {
  en: {
    heroTitle: 'Geometry',
    heroSub: 'From a single point to infinite sides.',
    shapes: [
      { name: 'Triangle', sidesLabel: '3 Sides', /* formulas... */ },
    ]
  },
  es: {
    heroTitle: 'Geometría',
    heroSub: 'Desde un punto hasta infinitos lados.',
    shapes: [
      { name: 'Triángulo', sidesLabel: '3 Lados', /* formulas... */ },
    ]
  }
};

function setLang(lang) {
  const t = TRANSLATIONS[lang];

  // Update static elements
  document.querySelector('h1').textContent = t.heroTitle;
  document.querySelector('.hero-sub').textContent = t.heroSub;

  // Update dynamically-generated sections
  document.querySelectorAll('.shape-section').forEach((sec, i) => {
    sec.querySelector('h2').textContent = t.shapes[i].name;
    // ... update formula labels and descriptions
  });

  // Update toggle button states
  document.getElementById('btnEn').classList.toggle('active', lang === 'en');
  document.getElementById('btnEs').classList.toggle('active', lang === 'es');
}
```

**The key insight:** `textContent` replaces the text of a DOM node without touching its structure. You're not rebuilding the HTML — just swapping strings in place.

---

## Step 13 — The Hamburger Navigation Menu with Tabs

The menu is inspired by the Rockstar Games GTA VI site, which uses pill-shaped tabs at the top of its navigation panel to separate content categories (People · Places · Trailers · Downloads). Here the two tabs are **Shapes** and **Exercises** — same visual pattern, different destinations.

The menu is a full-screen overlay with two panels: a decorative left panel and a navigation right panel. It uses `position: fixed` to float above all content, and `transform: translateX(100%)` to hide off-screen, sliding in with a CSS transition.

### HTML structure
```html
<button id="navBtn">☰</button>

<div class="nav-overlay" id="navOverlay">
  <div class="nav-backdrop"></div>        <!-- Clickable dark area outside panel -->
  <div class="nav-panel">
    <div class="nav-left"> ... </div>     <!-- Decorative left pane -->
    <div class="nav-right">
      <button id="navClose">✕</button>

      <!-- Tab row — pill buttons like the GTA VI nav -->
      <div class="nav-tabs">
        <button class="nav-tab-btn active" id="tabShapes">Shapes</button>
        <button class="nav-tab-btn" id="tabExercises">Exercises</button>
      </div>

      <!-- One list per tab; only one shown at a time -->
      <nav class="nav-list" id="navListShapes"></nav>
      <nav class="nav-list hidden" id="navListExercises"></nav>
    </div>
  </div>
</div>
```

### Tab switching
Each tab button shows one list and hides the other using a `.hidden` class. No JavaScript animation needed — `display: none` is sufficient.

```js
function switchTab(tab) {
  document.getElementById('tabShapes').classList.toggle('active',    tab === 'shapes');
  document.getElementById('tabExercises').classList.toggle('active', tab === 'exercises');
  document.getElementById('navListShapes').classList.toggle('hidden',    tab !== 'shapes');
  document.getElementById('navListExercises').classList.toggle('hidden', tab !== 'exercises');
}

document.getElementById('tabShapes').addEventListener('click',    () => switchTab('shapes'));
document.getElementById('tabExercises').addEventListener('click', () => switchTab('exercises'));
```

### Two separate link builders
The Shapes links scroll to shape sections. The Exercises links scroll to exercise groups (each group has an `id` like `ex-group-triangle`).

```js
function buildNavLinks(lang) {
  // Shapes tab
  NAV_NAMES[lang].shapes.forEach((name, i) => {
    // link → .shape-section[data-idx="i"] or .ngon-section
  });

  // Exercises tab  
  NAV_NAMES[lang].exercises.forEach((name, i) => {
    // link → #ex-group-{shapeId}
  });
}
```

**Key insight:** the same shape name appears in both tabs, but the scroll target is different — the Shapes tab takes you to the interactive shape section, the Exercises tab takes you to the matching practice problems.

### CSS — hide and show
```css
.nav-overlay { position: fixed; inset: 0; visibility: hidden; }
.nav-overlay.open { visibility: visible; }

.nav-panel {
  transform: translateX(100%);   /* Off-screen right */
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-overlay.open .nav-panel {
  transform: translateX(0);      /* Slide in */
}

.nav-backdrop {
  opacity: 0;
  transition: opacity 0.4s ease;
}
.nav-overlay.open .nav-backdrop { opacity: 1; }
```

### JavaScript — open, close, outside-click
```js
function openNav()  {
  navOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';  // Prevent background scrolling
}

function closeNav() {
  navOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

navBtn.addEventListener('click', openNav);
navClose.addEventListener('click', closeNav);
navBackdrop.addEventListener('click', closeNav);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
```

### Scroll-to-section
```js
navLinks.forEach((link, i) => {
  link.addEventListener('click', e => {
    e.preventDefault();
    closeNav();
    setTimeout(() => {
      document.querySelector(`.shape-section[data-idx="${i}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);  // Wait for menu close animation to finish
  });
});
```

---

## Step 14 — Atmospheric Background Palettes

Each section gets a subtle, unique background tint from the Night Sky palette. The technique uses CSS `background-image` with layered `radial-gradient` and `linear-gradient`.

```js
const SHAPE_COLORS = ['#1E0F75', '#1C1DAB', '#3785D8', /* ... */];

function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

SHAPES.forEach((shape, idx) => {
  const [r1, g1, b1] = hexToRgb(SHAPE_COLORS[idx]);
  const [r2, g2, b2] = hexToRgb(SHAPE_COLORS[idx + 1] ?? SHAPE_COLORS[idx]);

  section.style.backgroundImage = `
    radial-gradient(ellipse 55% 40% at 25% 50%,
      rgba(${r1},${g1},${b1}, 0.07) 0%, transparent 70%),
    linear-gradient(to bottom,
      rgba(${r1},${g1},${b1}, 0.045) 0%,
      rgba(${r2},${g2},${b2}, 0.045) 100%)
  `;
});
```

**How to read this:**
- The `radial-gradient` creates a soft, circular glow centered in the left half of the section (where the shape is).
- The `linear-gradient` creates a subtle vertical fade from the section's color to the next section's color — so the transition between shapes feels smooth.
- The alpha values (0.07, 0.045) are very low on purpose. On a near-black background, even 5–8% opacity is enough to read as atmosphere.

---

## Step 15 — Interactive Exercises with Live Answer Checking

The exercises section gives students a way to test what they learned. Each exercise is a card with a question, a text input, a Check button, and optional hint.

### Data structure
Store all problems in a plain object keyed by language, so the bilingual toggle works the same way as for shape names:

```js
const EXERCISES = {
  en: [
    {
      shapeId: 'triangle', shapeName: 'Triangle', color: '#3785D8',
      questions: [
        { q: 'A triangle has sides 5, 12, and 13. What is its perimeter?',
          answer: 30, hint: 'P = 5 + 12 + 13' },
        { q: 'A triangle has base 8 and height 5. What is its area?',
          answer: 20, hint: 'A = ½ × 8 × 5' },
      ]
    },
    // ... more groups
  ],
  es: [ /* same structure, Spanish text */ ]
};
```

### Rendering
`renderExercises(lang)` clears the container and rebuilds it from `EXERCISES[lang]`. Each group gets a unique `id` so the nav menu can scroll directly to it:

```js
groupEl.id = 'ex-group-' + group.shapeId;  // e.g. "ex-group-triangle"
```

### Answer checking with tolerance
Floating-point answers like `14.14` (diagonal of a square) need a small tolerance:

```js
function parseAnswer(str) {
  return parseFloat(str.replace(',', '.').trim());  // accept "14,14" or "14.14"
}

function isClose(a, b) {
  return Math.abs(a - b) <= 0.015;  // ±0.015 tolerance
}
```

### Progressive hint reveal
After two wrong attempts the hint appears:

```js
let attempts = 0;

btn.addEventListener('click', () => {
  if (isClose(parseAnswer(input.value), q.answer)) {
    // mark correct, lock input
  } else {
    attempts++;
    if (attempts >= 2) hintEl.classList.add('show');
  }
});
```

### Persistent score across language switches
The score is stored in a `Map` keyed by exercise ID (`shapeId-index`), not in the DOM. When `renderExercises` rebuilds the cards after a language switch, it reads the map to restore the correct/locked state:

```js
const answered = new Map();  // e.g. "triangle-0" → true

// When re-rendering:
const wasCorrect = answered.get(id) === true;
// Restore green state and disabled input if already correct
```

## Putting It All Together

Here is the minimal full page that combines every concept above:

```
index.html
  <head>
    Google Fonts link            ← Step 3
    <style>
      CSS variables              ← Step 2
      Hero styles                ← Step 4
      Scroll snap                ← Step 10
      Sticky wrapper             ← Step 6
      formula-card transitions   ← Step 8
      Mouse parallax setup       ← Step 9
      Nav overlay + tabs         ← Step 13
      Exercises section          ← Step 15
    </style>
  </head>
  <body>
    <button id="navBtn">         ← Step 13
    <div class="nav-overlay">    ← Step 13 (tabs: Shapes | Exercises)
    <section class="hero">       ← Step 4
    <div id="shapes-container">  ← Step 11 (JS fills this)
    <section class="ngon-section">   ← Interactive slider (Step 5)
    <section class="exercises-section"> ← Step 15
    <button class="back-top">    ← Bonus

    <script>
      SHAPE_COLORS + hexToRgb    ← Step 14
      SHAPES data array          ← Step 11
      regularPolygonPath()       ← Step 5
      Build sections loop        ← Step 11
        Apply backgrounds        ← Step 14
        Setup strokeDashoffset   ← Step 7
      Scroll listener            ← Steps 7, 8
      Mouse parallax listener    ← Step 9
      NAV_NAMES (tabs)           ← Step 13
      Nav open/close/switchTab() ← Step 13
      buildNavLinks()            ← Step 13
      TRANSLATIONS object        ← Step 12
      setLang() function         ← Step 12
      N-gon slider               ← Step 5
      EXERCISES data             ← Step 15
      renderExercises()          ← Step 15
      answered Map + score       ← Step 15
      Back to top                ← Bonus
    </script>
  </body>
```

---

## Key Concepts to Memorize

| Concept | One-Line Summary |
|---|---|
| `100vh` | Full browser window height |
| `position: sticky` | Sticks to viewport while parent is in view |
| `stroke-dashoffset` | Offsets an SVG dash to animate a "drawing" effect |
| `getBoundingClientRect()` | Returns an element's position relative to the viewport |
| `scroll-snap-type: y proximity` | Gentle magnetic scroll alignment |
| `perspective` | Sets the camera distance for CSS 3D transforms |
| `clamp(min, val, max)` | Responsive value that respects limits |
| `IntersectionObserver` | Fires when an element enters or leaves the viewport |
| `textContent` | Replaces the text of a DOM node safely |
| `classList.toggle(name, bool)` | Adds the class if `bool` is true, removes it if false |
| Template literals `` `${var}` `` | Build HTML strings with embedded variables |
| `transform: translateX(100%)` | Moves an element completely off-screen to the right |
| `classList.toggle('hidden', bool)` | Shows/hides a nav list when switching tabs |
| `Map` | Key-value store; used here to persist exercise scores across language switches |
| `parseFloat` + `.replace(',','.')` | Normalize user input so both `14.14` and `14,14` are accepted |

---

## Exercises

Try these to solidify each concept:

1. **Colors** — Change `--accent` in `:root` and watch the entire site update.
2. **New shape** — Add a Nonagon (9 sides) to the `SHAPES` array with its formulas. The rest works automatically.
3. **Reveal speed** — Increase the section height from `260vh` to `320vh` to give more scroll breathing room between formula reveals.
4. **Parallax intensity** — Change `14` in the mouse parallax code to `5` (subtle) or `25` (dramatic).
5. **Snap behavior** — Change `proximity` to `mandatory` and feel the difference.
6. **Third language** — Add a Portuguese entry to `TRANSLATIONS` and wire up a PT button.
7. **N-gon limit** — Change the slider max from `30` to `100` and watch what happens to the shape at very high `n` values (it approaches a circle).
8. **New tab** — Add a third tab called "Formulas" to the nav menu that lists just the key formula for each shape's area.
9. **Exercises difficulty** — Add a "Hard" exercise for the Triangle group using Heron's formula: sides 7, 8, 9. The answer is `\√(12 × 5 × 4 × 3) = \√720 ≈ 26.83`.
10. **Score percentage** — Modify the score pill to show a percentage once at least one question has been attempted.

---

*Built with curiosity. Reviewed against the Rockstar Games GTA VI website for scroll-animation inspiration.*

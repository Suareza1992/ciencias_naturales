// precalculus-page.js — page setup for precalculus.html (Pre-Calculus): hero art, menu glyph, Explorer.init(...).
// Kept out of the HTML so the page can use a strict Content-Security-Policy.

// ─── Decorative hero curve: a sine wave riding an exponential ──────────────
function heroPath(f) {
  let d = '';
  for (let i = 0; i <= 240; i++) {
    const x = i * 5;
    d += (i ? 'L' : 'M') + x + ',' + f(x).toFixed(1);
  }
  return `<path d="${d}"/>`;
}
const HERO_CURVE =
  heroPath(x => 200 - 120 * Math.sin(x / 95)) +
  heroPath(x => 380 - 360 * Math.pow(x / 1200, 3));

const NAV_GLYPH = `
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="10" y1="120" x2="150" y2="120" stroke="#d4a853" stroke-width="0.8" opacity="0.4"/>
    <line x1="30" y1="150" x2="30" y2="10" stroke="#d4a853" stroke-width="0.8" opacity="0.4"/>
    <path d="M10,140 C50,140 60,20 90,30 S130,140 150,60" stroke="#d4a853" stroke-width="1.6"/>
    <path d="M10,90 Q40,40 80,80 T150,70" stroke="#8fb8ff" stroke-width="1" opacity="0.6"/>
    <circle cx="90" cy="30" r="4" fill="#d4a853"/>
  </svg>`;

Explorer.init({
  subject: 'precalc',
  ui: {
    docTitle: { en: 'Pre-Calculus — Functions to Series', es: 'Precálculo — De Funciones a Series' },
    eyebrow:  { en: 'The Bridge to Calculus', es: 'El Puente al Cálculo' },
    title:    { en: 'Pre-<br>Calculus', es: 'Pre-<br>cálculo' },
    navTitle: { en: 'Pre-Calculus', es: 'Precálculo' },
    heroSub:  { en: 'Functions are the language of change. Learn every family — polynomial, rational, exponential, logarithmic and trigonometric — and the tools that tie them together.',
                es: 'Las funciones son el lenguaje del cambio. Conoce cada familia — polinómica, racional, exponencial, logarítmica y trigonométrica — y las herramientas que las unen.' },
    footer:   { en: 'Geometry Explorer · Pre-Calculus — An Interactive Educational Experience',
                es: 'Explorador de Geometría · Precálculo — Una Experiencia Educativa Interactiva' },
  },
  heroCurve: HERO_CURVE,
  navGlyph:  NAV_GLYPH,
  topics:    PRECALC_TOPICS,
  lab:       typeof PRECALC_LAB !== 'undefined' ? PRECALC_LAB : null,
});

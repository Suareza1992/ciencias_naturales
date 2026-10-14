// ═══════════════════════════════════════════════════════════════════════════
// geometry.js — all JavaScript for the Geometry page (index.html).
// Moved out of the HTML so the page can use a strict Content-Security-Policy
// (script-src 'self'), which blocks any injected inline script.
// ═══════════════════════════════════════════════════════════════════════════

// ─── Shape Data ──────────────────────────────────────────────────────────────
const SHAPES = [
  {
    id: 'point',
    name: 'Point',
    dimension: '0-Dimensional',
    sidesLabel: 'Dimension Zero',
    formulas: [
      { label: 'Definition', expr: 'P = (x, y)',
        desc: 'A point has no length, width, or height. It is an exact location in space defined only by its coordinates.' },
      { label: 'Distance Between Two Points', expr: 'd = √((x₂−x₁)² + (y₂−y₁)²)',
        desc: 'The shortest straight-line distance between any two points, derived from the Pythagorean theorem.' },
      { label: 'Midpoint Formula', expr: 'M = ((x₁+x₂)/2, (y₁+y₂)/2)',
        desc: 'The point that lies exactly halfway between two given points.' },
    ]
  },
  {
    id: 'line',
    name: 'Line Segment',
    dimension: '1-Dimensional',
    sidesLabel: '1 Dimension',
    formulas: [
      { label: 'Length', expr: 'L = √((x₂−x₁)² + (y₂−y₁)²)',
        desc: 'The distance from one endpoint to the other — the defining measure of a line segment.' },
      { label: 'Slope', expr: 'm = (y₂−y₁) / (x₂−x₁)',
        desc: 'Rise over run. Describes the steepness and direction of the line segment.' },
      { label: 'Midpoint', expr: 'M = ((x₁+x₂)/2, (y₁+y₂)/2)',
        desc: 'The exact center of the line segment, equidistant from both endpoints.' },
    ]
  },
  {
    id: 'triangle',
    name: 'Triangle',
    dimension: '2-Dimensional',
    sidesLabel: '3 Sides',
    sides: 3,
    formulas: [
      { label: 'Perimeter', expr: 'P = a + b + c',
        desc: 'Sum of all three side lengths. For an equilateral triangle: P = 3s.' },
      { label: 'Area', expr: 'A = ½ · b · h',
        desc: 'Half the base times the perpendicular height from that base to the opposite vertex.' },
      { label: "Heron's Formula", expr: 'A = √(s(s−a)(s−b)(s−c))',
        desc: 'Compute area from side lengths alone. Here s = (a+b+c)/2 is the semi-perimeter.' },
      { label: 'Sum of Interior Angles', expr: 'α + β + γ = 180°',
        desc: 'The three interior angles of any triangle — regardless of shape — always sum to exactly 180°.' },
    ]
  },
  {
    id: 'square',
    name: 'Square',
    dimension: '2-Dimensional',
    sidesLabel: '4 Sides',
    sides: 4,
    formulas: [
      { label: 'Perimeter', expr: 'P = 4s',
        desc: 'Four equal sides, each of length s.' },
      { label: 'Area', expr: 'A = s²',
        desc: 'The side length squared — the origin of the word "square" as an algebraic operation.' },
      { label: 'Diagonal', expr: 'd = s√2',
        desc: 'Derived from the Pythagorean theorem: d² = s² + s², so d = s√2 ≈ 1.414s.' },
      { label: 'Interior Angles', expr: 'θ = 90°  (each)',
        desc: 'All four angles are right angles. Sum of all interior angles = 360°.' },
    ]
  },
  {
    id: 'pentagon',
    name: 'Pentagon',
    dimension: '2-Dimensional',
    sidesLabel: '5 Sides',
    sides: 5,
    formulas: [
      { label: 'Perimeter', expr: 'P = 5s',
        desc: 'Five equal sides of length s.' },
      { label: 'Area', expr: 'A = (s²/4)·√(25+10√5)',
        desc: 'Exact area of a regular pentagon. Approximately A ≈ 1.720s².' },
      { label: 'Interior Angle', expr: 'θ = 108°',
        desc: 'Each interior angle of a regular pentagon. Sum of all interior angles = 540°.' },
      { label: 'Apothem', expr: 'a = s / (2·tan(π/5))',
        desc: 'Perpendicular distance from the center to any side. Approximately a ≈ 0.688s.' },
    ]
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    dimension: '2-Dimensional',
    sidesLabel: '6 Sides',
    sides: 6,
    formulas: [
      { label: 'Perimeter', expr: 'P = 6s',
        desc: 'Six equal sides. Hexagons tile a plane perfectly — the basis of honeycomb structure.' },
      { label: 'Area', expr: 'A = (3√3 / 2) · s²',
        desc: 'Approximately A ≈ 2.598s². The most area-efficient shape for tiling a plane.' },
      { label: 'Interior Angle', expr: 'θ = 120°',
        desc: 'Each interior angle. Three hexagons meet at each vertex, summing to 360° — allowing perfect tiling.' },
      { label: 'Circumradius', expr: 'R = s',
        desc: 'A unique property: the circumradius of a regular hexagon equals its side length exactly.' },
    ]
  },
  {
    id: 'heptagon',
    name: 'Heptagon',
    dimension: '2-Dimensional',
    sidesLabel: '7 Sides',
    sides: 7,
    formulas: [
      { label: 'Perimeter', expr: 'P = 7s',
        desc: 'Seven equal sides.' },
      { label: 'Area', expr: 'A = (7s²/4) · cot(π/7)',
        desc: 'Approximately A ≈ 3.634s². The heptagon cannot be constructed with compass and straightedge alone.' },
      { label: 'Interior Angle', expr: 'θ ≈ 128.57°',
        desc: 'Each interior angle = (7−2)·180°/7. Sum of all interior angles = 900°.' },
      { label: 'Apothem', expr: 'a = s / (2·tan(π/7))',
        desc: 'Approximately a ≈ 1.038s.' },
    ]
  },
  {
    id: 'octagon',
    name: 'Octagon',
    dimension: '2-Dimensional',
    sidesLabel: '8 Sides',
    sides: 8,
    formulas: [
      { label: 'Perimeter', expr: 'P = 8s',
        desc: 'Eight equal sides. Recognized worldwide as the shape of a stop sign.' },
      { label: 'Area', expr: 'A = 2(1 + √2) · s²',
        desc: 'Exactly 2(1+√2)s² ≈ 4.828s². Can be visualized by cutting the four corners off a square.' },
      { label: 'Interior Angle', expr: 'θ = 135°',
        desc: 'Each interior angle. Sum of all interior angles = 1080°.' },
      { label: 'Circumradius', expr: 'R = s / (2·sin(π/8))',
        desc: 'Approximately R ≈ 1.307s. The octagon approximates a circle much more closely than earlier polygons.' },
    ]
  },
];

// ─── Palette ─────────────────────────────────────────────────────────────────
const SHAPE_COLORS = [
  '#1E0F75', // Point
  '#1C1DAB', // Line Segment
  '#3785D8', // Triangle
  '#ADC6E5', // Square
  '#BF8CE1', // Pentagon
  '#E893C5', // Hexagon
  '#EBB2C3', // Heptagon
  '#CBD8E8', // Octagon
];

function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1,3), 16),
    parseInt(hex.slice(3,5), 16),
    parseInt(hex.slice(5,7), 16),
  ];
}

function rgba(hex, a) {
  const [r,g,b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

// ─── SVG Helpers ──────────────────────────────────────────────────────────────
function regularPolygonPath(sideCount, cx, cy, circumradius) {
  const vertices = [];
  for (let i = 0; i < sideCount; i++) {
    // Subtract π/2 so the first vertex points straight up
    const angleRad = (2 * Math.PI * i / sideCount) - Math.PI / 2;
    vertices.push([
      cx + circumradius * Math.cos(angleRad),
      cy + circumradius * Math.sin(angleRad),
    ]);
  }
  return vertices.map((v, i) => `${i === 0 ? 'M' : 'L'}${v[0].toFixed(2)},${v[1].toFixed(2)}`).join(' ') + 'Z';
}

function regularPolygonPoints(sideCount, cx, cy, circumradius) {
  const vertices = [];
  for (let i = 0; i < sideCount; i++) {
    const angleRad = (2 * Math.PI * i / sideCount) - Math.PI / 2;
    vertices.push([
      cx + circumradius * Math.cos(angleRad),
      cy + circumradius * Math.sin(angleRad),
    ]);
  }
  return vertices;
}

// ─── Build Sections ───────────────────────────────────────────────────────────
const container = document.getElementById('shapes-container');
const total = SHAPES.length;

SHAPES.forEach((shape, idx) => {
  const section = document.createElement('section');
  section.className = 'shape-section';
  section.dataset.idx = idx;

  const currentColor = SHAPE_COLORS[idx];
  const nextColor    = SHAPE_COLORS[idx + 1] ?? currentColor;
  // Tint is applied to the sticky wrapper (not the section) so it stays
  // inside the solid background and never shows through to adjacent sections.
  const atmosphericTint =
    `radial-gradient(ellipse 55% 40% at 25% 50%, ${rgba(currentColor, 0.07)} 0%, transparent 70%),` +
    `linear-gradient(to bottom, ${rgba(currentColor, 0.045)} 0%, ${rgba(nextColor, 0.045)} 100%)`;

  // Build SVG
  let svgInner = '';
  if (shape.id === 'point') {
    svgInner = `
      <circle class="point-dot" cx="200" cy="200" r="7"/>
      <circle class="point-ring" cx="200" cy="200" r="32" stroke-width="1"/>
      <circle class="point-ring" cx="200" cy="200" r="65" stroke-width="1"/>`;
  } else if (shape.id === 'line') {
    svgInner = `
      <path class="shape-path" d="M60,200 L340,200"/>
      <circle class="vertex-dot" cx="60" cy="200" r="4"/>
      <circle class="vertex-dot" cx="340" cy="200" r="4"/>`;
  } else {
    const d = regularPolygonPath(shape.sides, 200, 200, 148);
    const vertices = regularPolygonPoints(shape.sides, 200, 200, 148);
    const vertDots = vertices.map(vertex =>
      `<circle class="vertex-dot" cx="${vertex[0].toFixed(2)}" cy="${vertex[1].toFixed(2)}" r="4"/>`
    ).join('');
    svgInner = `
      <path class="shape-fill" d="${d}"/>
      <path class="shape-path" d="${d}"/>
      ${vertDots}`;
  }

  const formulaCards = shape.formulas.map(f => `
    <div class="formula-card">
      <div class="f-label">${f.label}</div>
      <div class="f-expr">${f.expr}</div>
      <div class="f-desc">${f.desc}</div>
    </div>`).join('');

  section.innerHTML = `
    <div class="sticky-wrapper">
      <div class="shape-display">
        <div class="shape-label">
          <div class="shape-dimension">${shape.sidesLabel} · ${shape.dimension}</div>
          <h2>${shape.name}</h2>
        </div>
        <div class="shape-canvas" data-id="${shape.id}">
          <div class="shape-inner">
            <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
              ${svgInner}
            </svg>
          </div>
        </div>
        <div class="shape-counter">${String(idx + 1).padStart(2,'0')} / ${String(total).padStart(2,'0')}</div>
      </div>
      <div class="formula-panel">${formulaCards}</div>
    </div>`;

  container.appendChild(section);

  // Apply the tint to the sticky wrapper now that it exists in the DOM
  section.querySelector('.sticky-wrapper').style.backgroundImage = atmosphericTint;

  // Set up stroke-dashoffset after paint
  if (shape.id !== 'point') {
    requestAnimationFrame(() => {
      const path = section.querySelector('.shape-path');
      if (path && path.getTotalLength) {
        const len = Math.ceil(path.getTotalLength());
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
      }
    });
  }
});

// ─── Scroll: Shape Draw + Formula Reveals ─────────────────────────────────────
function onScroll() {
  document.querySelectorAll('.shape-section').forEach(shapeSection => {
    const rect             = shapeSection.getBoundingClientRect();
    const viewportHeight   = window.innerHeight;

    if (rect.top < viewportHeight * 0.72 && rect.bottom > 0) {
      shapeSection.classList.add('in-view');

      // On desktop the section is 260vh tall, giving a 0→1 scroll budget for
      // revealing formula cards. On mobile sections are natural height so
      // scrollable ≤ 0 and progress clamps to 1 (all cards shown at once).
      const scrollablePx = rect.height - viewportHeight;
      const progress     = scrollablePx > 0
        ? Math.max(0, Math.min(1, -rect.top / scrollablePx))
        : 1;

      revealFormulas(shapeSection, progress);
    }
  });
}

function revealFormulas(shapeSection, progress) {
  const cards = shapeSection.querySelectorAll('.formula-card');
  cards.forEach((card, cardIndex) => {
    // Space thresholds evenly across the scroll range, e.g. 0.25, 0.5, 0.75 for 3 cards
    const revealThreshold = (cardIndex + 1) / (cards.length + 1);
    card.classList.toggle('visible', progress >= revealThreshold);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
setTimeout(onScroll, 120); // initial pass

// ─── Mouse Parallax ───────────────────────────────────────────────────────────
// Touch devices never fire mousemove, so parallax is automatically disabled on mobile.
let parallaxRaf  = null;
let mouseX = window.innerWidth  / 2;
let mouseY = window.innerHeight / 2;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (!parallaxRaf) parallaxRaf = requestAnimationFrame(applyParallax);
});

function applyParallax() {
  parallaxRaf = null;
  const centerX = window.innerWidth  / 2;
  const centerY = window.innerHeight / 2;
  // Normalize cursor offset to the -1 → 1 range
  const normalizedX = (mouseX - centerX) / centerX;
  const normalizedY = (mouseY - centerY) / centerY;
  // Max tilt of 14 degrees; invert Y so moving up tilts the shape toward the viewer
  const tiltX = -normalizedY * 14;
  const tiltY =  normalizedX * 14;

  document.querySelectorAll('.shape-section.in-view .shape-inner').forEach(shapeInnerEl => {
    const parentSection = shapeInnerEl.closest('.shape-section');
    const sectionBounds = parentSection.getBoundingClientRect();
    if (sectionBounds.top < window.innerHeight && sectionBounds.bottom > 0) {
      shapeInnerEl.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }
  });
}

// ─── N-gon Slider ─────────────────────────────────────────────────────────────
const slider   = document.getElementById('nSlider');
const nDisplay = document.getElementById('nDisplay');
const ngonPath = document.getElementById('ngonPath');
const ngonAngle     = document.getElementById('ngonAngle');
const ngonAngleSum  = document.getElementById('ngonAngleSum');

function updateNgon(n) {
  nDisplay.textContent = n;
  ngonPath.setAttribute('d', regularPolygonPath(n, 150, 150, 125));
  const angle    = ((n - 2) * 180 / n).toFixed(2);
  const angleSum = (n - 2) * 180;
  ngonAngle.textContent    = `θ = (${n}−2)·180° / ${n} = ${angle}°`;
  ngonAngleSum.textContent = `(${n}−2) × 180° = ${angleSum}°`;
}

slider.addEventListener('input', () => updateNgon(+slider.value));
updateNgon(6);

// ─── Back to Top ─────────────────────────────────────────────────────────────
const backTop  = document.getElementById('backTop');
const ngonSec  = document.querySelector('.ngon-section');

function updateBackTop() {
  const ngonTop = ngonSec?.getBoundingClientRect().top ?? Infinity;
  const exTop   = document.querySelector('.exercises-section')?.getBoundingClientRect().top ?? Infinity;
  backTop.classList.toggle('visible', Math.min(ngonTop, exTop) < window.innerHeight * 0.85);
}

window.addEventListener('scroll', updateBackTop, { passive: true });
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ─── Exercises ────────────────────────────────────────────────────────────────
const EXERCISES = {
  en: [
    {
      shapeId: 'point', shapeName: 'Point', color: '#1E0F75',
      questions: [
        { q: 'Find the distance between P(0, 0) and Q(3, 4).', answer: 5, hint: 'Use d = √((x₂−x₁)² + (y₂−y₁)²)' },
        { q: 'Find the distance between A(1, 2) and B(4, 6).', answer: 5, hint: 'd = √((4−1)² + (6−2)²) = √(9+16)' },
        { q: 'What is the x-coordinate of the midpoint between (2, 8) and (6, 4)?', answer: 4, hint: 'Mₓ = (2 + 6) / 2' },
      ]
    },
    {
      shapeId: 'line', shapeName: 'Line Segment', color: '#1C1DAB',
      questions: [
        { q: 'Find the length of the segment from (0, 0) to (6, 8).', answer: 10, hint: 'L = √(6² + 8²)' },
        { q: 'Find the slope of the line through (1, 2) and (3, 8).', answer: 3, hint: 'm = (8−2) / (3−1)' },
        { q: 'What is the y-coordinate of the midpoint between (4, 2) and (4, 10)?', answer: 6, hint: 'Mᵧ = (2 + 10) / 2' },
      ]
    },
    {
      shapeId: 'triangle', shapeName: 'Triangle', color: '#3785D8',
      questions: [
        { q: 'A triangle has sides 5, 12, and 13. What is its perimeter?', answer: 30, hint: 'P = 5 + 12 + 13' },
        { q: 'A triangle has base 8 and height 5. What is its area?', answer: 20, hint: 'A = ½ × 8 × 5' },
        { q: 'Two angles of a triangle are 60° and 75°. What is the third angle?', answer: 45, hint: 'Angles must sum to 180°' },
      ]
    },
    {
      shapeId: 'square', shapeName: 'Square', color: '#ADC6E5',
      questions: [
        { q: 'A square has side 9. What is its area?', answer: 81, hint: 'A = s²' },
        { q: 'A square has area 144. What is its side length?', answer: 12, hint: 's = √144' },
        { q: 'A square has side 10. What is its diagonal? (round to 2 decimals)', answer: 14.14, hint: 'd = 10 × √2 ≈ 14.14' },
      ]
    },
    {
      shapeId: 'pentagon', shapeName: 'Pentagon', color: '#BF8CE1',
      questions: [
        { q: 'A regular pentagon has side 7. What is its perimeter?', answer: 35, hint: 'P = 5 × s' },
        { q: 'What is each interior angle of a regular pentagon, in degrees?', answer: 108, hint: 'θ = (5−2) × 180 / 5' },
        { q: 'What is the sum of all interior angles of a pentagon, in degrees?', answer: 540, hint: 'Sum = (n−2) × 180' },
      ]
    },
    {
      shapeId: 'hexagon', shapeName: 'Hexagon', color: '#E893C5',
      questions: [
        { q: 'A regular hexagon has side 5. What is its perimeter?', answer: 30, hint: 'P = 6 × s' },
        { q: 'What is each interior angle of a regular hexagon, in degrees?', answer: 120, hint: 'θ = (6−2) × 180 / 6' },
        { q: 'A regular hexagon has side 4. What is its circumradius?', answer: 4, hint: 'Unique property: R = s for a hexagon' },
      ]
    },
    {
      shapeId: 'heptagon', shapeName: 'Heptagon', color: '#EBB2C3',
      questions: [
        { q: 'A regular heptagon has side 4. What is its perimeter?', answer: 28, hint: 'P = 7 × s' },
        { q: 'What is each interior angle of a regular heptagon? (round to 2 decimals)', answer: 128.57, hint: 'θ = (7−2) × 180 / 7' },
        { q: 'What is the sum of all interior angles of a heptagon, in degrees?', answer: 900, hint: 'Sum = (n−2) × 180' },
      ]
    },
    {
      shapeId: 'octagon', shapeName: 'Octagon', color: '#CBD8E8',
      questions: [
        { q: 'A regular octagon has side 6. What is its perimeter?', answer: 48, hint: 'P = 8 × s' },
        { q: 'What is each interior angle of a regular octagon, in degrees?', answer: 135, hint: 'θ = (8−2) × 180 / 8' },
        { q: 'What is the sum of all interior angles of an octagon, in degrees?', answer: 1080, hint: 'Sum = (n−2) × 180' },
      ]
    },
    {
      shapeId: 'ngon', shapeName: 'N-Gon', color: '#d4a853',
      questions: [
        { q: 'What is each interior angle of a regular 12-sided polygon, in degrees?', answer: 150, hint: 'θ = (12−2) × 180 / 12' },
        { q: 'What is the sum of interior angles of a 15-sided polygon, in degrees?', answer: 2340, hint: 'Sum = (n−2) × 180' },
        { q: 'A regular polygon has interior angles of 144°. How many sides does it have?', answer: 10, hint: 'n = 360 / (180 − 144)' },
      ]
    },
  ],
  es: [
    {
      shapeId: 'point', shapeName: 'Punto', color: '#1E0F75',
      questions: [
        { q: 'Encuentra la distancia entre P(0, 0) y Q(3, 4).', answer: 5, hint: 'Usa d = √((x₂−x₁)² + (y₂−y₁)²)' },
        { q: 'Encuentra la distancia entre A(1, 2) y B(4, 6).', answer: 5, hint: 'd = √((4−1)² + (6−2)²) = √(9+16)' },
        { q: '¿Cuál es la coordenada x del punto medio entre (2, 8) y (6, 4)?', answer: 4, hint: 'Mₓ = (2 + 6) / 2' },
      ]
    },
    {
      shapeId: 'line', shapeName: 'Segmento', color: '#1C1DAB',
      questions: [
        { q: 'Encuentra la longitud del segmento de (0, 0) a (6, 8).', answer: 10, hint: 'L = √(6² + 8²)' },
        { q: 'Encuentra la pendiente de la recta que pasa por (1, 2) y (3, 8).', answer: 3, hint: 'm = (8−2) / (3−1)' },
        { q: '¿Cuál es la coordenada y del punto medio entre (4, 2) y (4, 10)?', answer: 6, hint: 'Mᵧ = (2 + 10) / 2' },
      ]
    },
    {
      shapeId: 'triangle', shapeName: 'Triángulo', color: '#3785D8',
      questions: [
        { q: 'Un triángulo tiene lados 5, 12 y 13. ¿Cuál es su perímetro?', answer: 30, hint: 'P = 5 + 12 + 13' },
        { q: 'Un triángulo tiene base 8 y altura 5. ¿Cuál es su área?', answer: 20, hint: 'A = ½ × 8 × 5' },
        { q: 'Dos ángulos de un triángulo miden 60° y 75°. ¿Cuánto mide el tercer ángulo?', answer: 45, hint: 'Los ángulos suman 180°' },
      ]
    },
    {
      shapeId: 'square', shapeName: 'Cuadrado', color: '#ADC6E5',
      questions: [
        { q: 'Un cuadrado tiene lado 9. ¿Cuál es su área?', answer: 81, hint: 'A = s²' },
        { q: 'Un cuadrado tiene área 144. ¿Cuánto mide su lado?', answer: 12, hint: 's = √144' },
        { q: 'Un cuadrado tiene lado 10. ¿Cuánto mide su diagonal? (redondea a 2 decimales)', answer: 14.14, hint: 'd = 10 × √2 ≈ 14.14' },
      ]
    },
    {
      shapeId: 'pentagon', shapeName: 'Pentágono', color: '#BF8CE1',
      questions: [
        { q: 'Un pentágono regular tiene lado 7. ¿Cuál es su perímetro?', answer: 35, hint: 'P = 5 × l' },
        { q: '¿Cuánto mide cada ángulo interior de un pentágono regular, en grados?', answer: 108, hint: 'θ = (5−2) × 180 / 5' },
        { q: '¿Cuál es la suma de los ángulos interiores de un pentágono, en grados?', answer: 540, hint: 'Suma = (n−2) × 180' },
      ]
    },
    {
      shapeId: 'hexagon', shapeName: 'Hexágono', color: '#E893C5',
      questions: [
        { q: 'Un hexágono regular tiene lado 5. ¿Cuál es su perímetro?', answer: 30, hint: 'P = 6 × l' },
        { q: '¿Cuánto mide cada ángulo interior de un hexágono regular, en grados?', answer: 120, hint: 'θ = (6−2) × 180 / 6' },
        { q: 'Un hexágono regular tiene lado 4. ¿Cuál es su circunradio?', answer: 4, hint: 'Propiedad única: R = l en el hexágono' },
      ]
    },
    {
      shapeId: 'heptagon', shapeName: 'Heptágono', color: '#EBB2C3',
      questions: [
        { q: 'Un heptágono regular tiene lado 4. ¿Cuál es su perímetro?', answer: 28, hint: 'P = 7 × l' },
        { q: '¿Cuánto mide cada ángulo interior de un heptágono regular? (redondea a 2 decimales)', answer: 128.57, hint: 'θ = (7−2) × 180 / 7' },
        { q: '¿Cuál es la suma de los ángulos interiores de un heptágono, en grados?', answer: 900, hint: 'Suma = (n−2) × 180' },
      ]
    },
    {
      shapeId: 'octagon', shapeName: 'Octágono', color: '#CBD8E8',
      questions: [
        { q: 'Un octágono regular tiene lado 6. ¿Cuál es su perímetro?', answer: 48, hint: 'P = 8 × l' },
        { q: '¿Cuánto mide cada ángulo interior de un octágono regular, en grados?', answer: 135, hint: 'θ = (8−2) × 180 / 8' },
        { q: '¿Cuál es la suma de los ángulos interiores de un octágono, en grados?', answer: 1080, hint: 'Suma = (n−2) × 180' },
      ]
    },
    {
      shapeId: 'ngon', shapeName: 'Polígono N', color: '#d4a853',
      questions: [
        { q: '¿Cuánto mide cada ángulo interior de un polígono regular de 12 lados, en grados?', answer: 150, hint: 'θ = (12−2) × 180 / 12' },
        { q: '¿Cuál es la suma de los ángulos interiores de un polígono de 15 lados, en grados?', answer: 2340, hint: 'Suma = (n−2) × 180' },
        { q: 'Un polígono regular tiene ángulos interiores de 144°. ¿Cuántos lados tiene?', answer: 10, hint: 'n = 360 / (180 − 144)' },
      ]
    },
  ],
};

const EX_UI = {
  en: {
    title: 'Exercises', subtitle: 'Test your understanding. Enter a numeric answer and press Check.',
    scoreLabel: 'correct', check: 'Check', correct: '✓ Correct!',
    wrong: '✗ Try again', hint: 'Hint', showHint: 'Show hint',
  },
  es: {
    title: 'Ejercicios', subtitle: 'Pon a prueba tu comprensión. Ingresa una respuesta numérica y presiona Verificar.',
    scoreLabel: 'correctas', check: 'Verificar', correct: '✓ ¡Correcto!',
    wrong: '✗ Inténtalo de nuevo', hint: 'Pista', showHint: 'Mostrar pista',
  },
};

// Score state — persists across language switches
const answered = new Map(); // id → true/false

function parseAnswer(str) {
  return parseFloat(str.replace(',', '.').trim());
}

function isClose(a, b) {
  return Math.abs(a - b) <= 0.015;
}

function renderExercises(lang) {
  const ui   = EX_UI[lang];
  const data = EXERCISES[lang];
  const container = document.getElementById('exercisesContainer');

  // Update header text
  document.getElementById('exTitle').textContent    = ui.title;
  document.getElementById('exSubtitle').textContent = ui.subtitle;
  document.getElementById('scoreLabel').textContent = ui.scoreLabel;

  container.innerHTML = '';
  let runningIndex = 0;

  data.forEach(group => {
    const groupEl    = document.createElement('div');
    groupEl.className = 'ex-group';
    groupEl.id        = 'ex-group-' + group.shapeId;

    groupEl.innerHTML = `
      <div class="ex-group-header">
        <div class="ex-shape-dot" style="background:${group.color}"></div>
        <span class="ex-group-title">${group.shapeName}</span>
      </div>`;

    group.questions.forEach((question, questionIndex) => {
      const exerciseId = `${group.shapeId}-${questionIndex}`;
      runningIndex++;
      const wasCorrect = answered.get(exerciseId) === true;

      const card = document.createElement('div');
      card.className    = `ex-card${wasCorrect ? ' correct' : ''}`;
      card.dataset.id   = exerciseId;

      card.innerHTML = `
        <div class="ex-num">Ex. ${runningIndex}</div>
        <div class="ex-question">${question.q}</div>
        <div class="ex-row">
          <input class="ex-input" type="text" placeholder="?"
            ${wasCorrect ? `disabled value="${question.answer}"` : ''}>
          <button class="ex-btn" ${wasCorrect ? 'disabled' : ''}>${ui.check}</button>
          <span class="ex-feedback ${wasCorrect ? 'ok' : ''}">${wasCorrect ? ui.correct : ''}</span>
        </div>
        <div class="ex-hint">${ui.hint}: ${question.hint}</div>`;

      const inputEl    = card.querySelector('.ex-input');
      const checkBtn   = card.querySelector('.ex-btn');
      const feedbackEl = card.querySelector('.ex-feedback');
      const hintEl     = card.querySelector('.ex-hint');
      let wrongAttempts = 0;

      checkBtn.addEventListener('click', () => {
        const parsedValue = parseAnswer(inputEl.value);
        if (isNaN(parsedValue)) {
          feedbackEl.textContent = '?';
          feedbackEl.className   = 'ex-feedback err';
          return;
        }

        if (isClose(parsedValue, question.answer)) {
          card.classList.add('correct');
          card.classList.remove('wrong');
          feedbackEl.textContent = ui.correct;
          feedbackEl.className   = 'ex-feedback ok';
          checkBtn.disabled      = true;
          inputEl.disabled       = true;
          if (!answered.get(exerciseId)) {
            answered.set(exerciseId, true);
            updateScore();
          }
        } else {
          card.classList.add('wrong');
          card.classList.remove('correct');
          feedbackEl.textContent = ui.wrong;
          feedbackEl.className   = 'ex-feedback err';
          answered.set(exerciseId, false);
          wrongAttempts++;
          // Reveal the hint after two failed attempts
          if (wrongAttempts >= 2) hintEl.classList.add('show');
        }
      });

      inputEl.addEventListener('keydown', evt => { if (evt.key === 'Enter') checkBtn.click(); });

      groupEl.appendChild(card);
    });

    container.appendChild(groupEl);
  });

  updateScore();
}

function updateScore() {
  const correct = [...answered.values()].filter(Boolean).length;
  const total   = [...answered.values()].length;
  document.getElementById('scoreCorrect').textContent = correct;
  document.getElementById('scoreTotal').textContent   = total;
}

// Initial render
renderExercises('en');

// ─── Nav Menu ────────────────────────────────────────────────────────────────
const navBtn     = document.getElementById('navBtn');
const navOverlay = document.getElementById('navOverlay');
const navBackdrop= document.getElementById('navBackdrop');
const navClose   = document.getElementById('navClose');
// navList split into navListShapes / navListExercises (see buildNavLinks)

// Shape names for each section (EN, updated by setLang)
const NAV_NAMES = {
  en: {
    shapes:    ['Point', 'Line Segment', 'Triangle', 'Square', 'Pentagon', 'Hexagon', 'Heptagon', 'Octagon', 'N-Gon'],
    exercises: ['Point', 'Line Segment', 'Triangle', 'Square', 'Pentagon', 'Hexagon', 'Heptagon', 'Octagon', 'N-Gon'],
    tabs:      ['Shapes', 'Exercises'],
  },
  es: {
    shapes:    ['Punto', 'Segmento', 'Triángulo', 'Cuadrado', 'Pentágono', 'Hexágono', 'Heptágono', 'Octágono', 'Polígono N'],
    exercises: ['Punto', 'Segmento', 'Triángulo', 'Cuadrado', 'Pentágono', 'Hexágono', 'Heptágono', 'Octágono', 'Polígono N'],
    tabs:      ['Figuras', 'Ejercicios'],
  },
};

const EXERCISE_IDS = ['point','line','triangle','square','pentagon','hexagon','heptagon','octagon','ngon'];

// Build both nav lists
function buildNavLinks(lang) {
  const n = NAV_NAMES[lang];

  // Update tab labels
  document.getElementById('tabShapes').textContent    = n.tabs[0];
  document.getElementById('tabExercises').textContent = n.tabs[1];

  // ── Shapes list ──
  const shapesListEl = document.getElementById('navListShapes');
  shapesListEl.innerHTML = '';
  n.shapes.forEach((shapeName, shapeIndex) => {
    const navLink = document.createElement('a');
    navLink.href      = '#';
    navLink.textContent = shapeName;
    navLink.dataset.navIdx = shapeIndex;
    navLink.addEventListener('click', evt => {
      evt.preventDefault();
      closeNav();
      // Wait for the panel slide-out animation before jumping
      setTimeout(() => {
        const scrollTarget = shapeIndex < 8
          ? document.querySelector(`.shape-section[data-idx="${shapeIndex}"]`)
          : document.querySelector('.ngon-section');
        scrollTarget?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    });
    shapesListEl.appendChild(navLink);
  });

  // ── Exercises list ──
  const exercisesListEl = document.getElementById('navListExercises');
  exercisesListEl.innerHTML = '';
  n.exercises.forEach((shapeName, shapeIndex) => {
    const navLink = document.createElement('a');
    navLink.href        = '#';
    navLink.textContent = shapeName;
    navLink.addEventListener('click', evt => {
      evt.preventDefault();
      closeNav();
      setTimeout(() => {
        const groupId      = EXERCISE_IDS[shapeIndex];
        const scrollTarget = document.getElementById('ex-group-' + groupId)
                          ?? document.querySelector('.exercises-section');
        scrollTarget?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    });
    exercisesListEl.appendChild(navLink);
  });
}

// ── Tab switching ──
let activeTab = 'shapes';
document.getElementById('tabShapes').addEventListener('click',    () => switchTab('shapes'));
document.getElementById('tabExercises').addEventListener('click', () => switchTab('exercises'));

function switchTab(tab) {
  activeTab = tab;
  document.getElementById('tabShapes').classList.toggle('active',    tab === 'shapes');
  document.getElementById('tabExercises').classList.toggle('active', tab === 'exercises');
  document.getElementById('navListShapes').classList.toggle('hidden',    tab !== 'shapes');
  document.getElementById('navListExercises').classList.toggle('hidden', tab !== 'exercises');
}

function updateActiveNavLink() {
  const navLinks     = document.querySelectorAll('#navListShapes a');
  const halfViewport = window.innerHeight * 0.5;
  let activeIndex    = 0;

  document.querySelectorAll('.shape-section').forEach((shapeSection, i) => {
    if (shapeSection.getBoundingClientRect().top < halfViewport) activeIndex = i;
  });

  const ngonSection = document.querySelector('.ngon-section');
  if (ngonSection && ngonSection.getBoundingClientRect().top < halfViewport) activeIndex = 8;

  navLinks.forEach((link, i) => link.classList.toggle('active-shape', i === activeIndex));
}

function openNav() {
  navOverlay.classList.add('open');
  navBtn.classList.add('open');
  document.body.style.overflow = 'hidden';
  updateActiveNavLink();
}


function closeNav() {
  navOverlay.classList.remove('open');
  navBtn.classList.remove('open');
  document.body.style.overflow = '';
}

navBtn.addEventListener('click', () => navOverlay.classList.contains('open') ? closeNav() : openNav());
navClose.addEventListener('click', closeNav);
navBackdrop.addEventListener('click', closeNav);

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

buildNavLinks('en');

// ─── Language Toggle ──────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    // Hero
    eyebrow: 'An Interactive Journey Through Space',
    heroSub: 'From a single point to infinite sides — explore shapes, dimensions, and the mathematics that defines them.',
    scrollCta: 'Scroll to begin',
    // N-gon section
    ngonTitle: 'N — Gon',
    ngonSub: 'The general regular polygon. Drag to choose any number of sides.',
    nLabel: 'sides',
    // N-gon formula labels
    ngonLabels: ['Perimeter', 'Area', 'Interior Angle', 'Sum of Interior Angles', 'Circumradius', 'Apothem'],
    // Footer
    footer: 'Geometry Explorer — An Interactive Educational Experience',
    // Shape names & metadata
    shapes: [
      { name: 'Point',        dimension: '0-Dimensional', sidesLabel: 'Dimension Zero' },
      { name: 'Line Segment', dimension: '1-Dimensional', sidesLabel: '1 Dimension' },
      { name: 'Triangle',     dimension: '2-Dimensional', sidesLabel: '3 Sides' },
      { name: 'Square',       dimension: '2-Dimensional', sidesLabel: '4 Sides' },
      { name: 'Pentagon',     dimension: '2-Dimensional', sidesLabel: '5 Sides' },
      { name: 'Hexagon',      dimension: '2-Dimensional', sidesLabel: '6 Sides' },
      { name: 'Heptagon',     dimension: '2-Dimensional', sidesLabel: '7 Sides' },
      { name: 'Octagon',      dimension: '2-Dimensional', sidesLabel: '8 Sides' },
    ],
    // Formula labels & descriptions per shape (same order as SHAPES array)
    formulas: [
      // Point
      [
        { label: 'Definition',                  desc: 'A point has no length, width, or height. It is an exact location in space defined only by its coordinates.' },
        { label: 'Distance Between Two Points', desc: 'The shortest straight-line distance between any two points, derived from the Pythagorean theorem.' },
        { label: 'Midpoint Formula',            desc: 'The point that lies exactly halfway between two given points.' },
      ],
      // Line
      [
        { label: 'Length',   desc: 'The distance from one endpoint to the other — the defining measure of a line segment.' },
        { label: 'Slope',    desc: 'Rise over run. Describes the steepness and direction of the line segment.' },
        { label: 'Midpoint', desc: 'The exact center of the line segment, equidistant from both endpoints.' },
      ],
      // Triangle
      [
        { label: 'Perimeter',              desc: 'Sum of all three side lengths. For an equilateral triangle: P = 3s.' },
        { label: 'Area',                   desc: 'Half the base times the perpendicular height from that base to the opposite vertex.' },
        { label: "Heron's Formula",        desc: 'Compute area from side lengths alone. Here s = (a+b+c)/2 is the semi-perimeter.' },
        { label: 'Sum of Interior Angles', desc: 'The three interior angles of any triangle — regardless of shape — always sum to exactly 180°.' },
      ],
      // Square
      [
        { label: 'Perimeter',        desc: 'Four equal sides, each of length s.' },
        { label: 'Area',             desc: 'The side length squared — the origin of the word "square" as an algebraic operation.' },
        { label: 'Diagonal',         desc: 'Derived from the Pythagorean theorem: d² = s² + s², so d = s√2 ≈ 1.414s.' },
        { label: 'Interior Angles',  desc: 'All four angles are right angles. Sum of all interior angles = 360°.' },
      ],
      // Pentagon
      [
        { label: 'Perimeter',        desc: 'Five equal sides of length s.' },
        { label: 'Area',             desc: 'Exact area of a regular pentagon. Approximately A ≈ 1.720s².' },
        { label: 'Interior Angle',   desc: 'Each interior angle of a regular pentagon. Sum of all interior angles = 540°.' },
        { label: 'Apothem',          desc: 'Perpendicular distance from the center to any side. Approximately a ≈ 0.688s.' },
      ],
      // Hexagon
      [
        { label: 'Perimeter',        desc: 'Six equal sides. Hexagons tile a plane perfectly — the basis of honeycomb structure.' },
        { label: 'Area',             desc: 'Approximately A ≈ 2.598s². The most area-efficient shape for tiling a plane.' },
        { label: 'Interior Angle',   desc: 'Each interior angle. Three hexagons meet at each vertex, summing to 360° — allowing perfect tiling.' },
        { label: 'Circumradius',     desc: 'A unique property: the circumradius of a regular hexagon equals its side length exactly.' },
      ],
      // Heptagon
      [
        { label: 'Perimeter',        desc: 'Seven equal sides.' },
        { label: 'Area',             desc: 'Approximately A ≈ 3.634s². The heptagon cannot be constructed with compass and straightedge alone.' },
        { label: 'Interior Angle',   desc: 'Each interior angle = (7−2)·180°/7. Sum of all interior angles = 900°.' },
        { label: 'Apothem',          desc: 'Approximately a ≈ 1.038s.' },
      ],
      // Octagon
      [
        { label: 'Perimeter',        desc: 'Eight equal sides. Recognized worldwide as the shape of a stop sign.' },
        { label: 'Area',             desc: 'Exactly 2(1+√2)s² ≈ 4.828s². Can be visualized by cutting the four corners off a square.' },
        { label: 'Interior Angle',   desc: 'Each interior angle. Sum of all interior angles = 1080°.' },
        { label: 'Circumradius',     desc: 'Approximately R ≈ 1.307s. The octagon approximates a circle much more closely than earlier polygons.' },
      ],
    ],
  },

  es: {
    eyebrow: 'Un Viaje Interactivo por el Espacio',
    heroSub: 'Desde un punto hasta infinitos lados — explora figuras, dimensiones y la matemática que las define.',
    scrollCta: 'Desplázate para comenzar',
    ngonTitle: 'Polígono N',
    ngonSub: 'El polígono regular general. Arrastra para elegir el número de lados.',
    nLabel: 'lados',
    ngonLabels: ['Perímetro', 'Área', 'Ángulo Interior', 'Suma de Ángulos Interiores', 'Circunradio', 'Apotema'],
    footer: 'Explorador de Geometría — Una Experiencia Educativa Interactiva',
    shapes: [
      { name: 'Punto',            dimension: '0-Dimensional',  sidesLabel: 'Dimensión Cero' },
      { name: 'Segmento',         dimension: '1-Dimensional',  sidesLabel: '1 Dimensión' },
      { name: 'Triángulo',        dimension: '2-Dimensional',  sidesLabel: '3 Lados' },
      { name: 'Cuadrado',         dimension: '2-Dimensional',  sidesLabel: '4 Lados' },
      { name: 'Pentágono',        dimension: '2-Dimensional',  sidesLabel: '5 Lados' },
      { name: 'Hexágono',         dimension: '2-Dimensional',  sidesLabel: '6 Lados' },
      { name: 'Heptágono',        dimension: '2-Dimensional',  sidesLabel: '7 Lados' },
      { name: 'Octágono',         dimension: '2-Dimensional',  sidesLabel: '8 Lados' },
    ],
    formulas: [
      // Punto
      [
        { label: 'Definición',                    desc: 'Un punto no tiene longitud, ancho ni altura. Es una ubicación exacta en el espacio definida únicamente por sus coordenadas.' },
        { label: 'Distancia Entre Dos Puntos',    desc: 'La distancia en línea recta más corta entre dos puntos, derivada del teorema de Pitágoras.' },
        { label: 'Fórmula del Punto Medio',       desc: 'El punto que se encuentra exactamente a la mitad entre dos puntos dados.' },
      ],
      // Segmento
      [
        { label: 'Longitud',       desc: 'La distancia de un extremo al otro — la medida esencial de un segmento.' },
        { label: 'Pendiente',      desc: 'Cambio vertical entre cambio horizontal. Describe la inclinación y dirección del segmento.' },
        { label: 'Punto Medio',    desc: 'El centro exacto del segmento, equidistante de ambos extremos.' },
      ],
      // Triángulo
      [
        { label: 'Perímetro',               desc: 'Suma de los tres lados. Para un triángulo equilátero: P = 3s.' },
        { label: 'Área',                    desc: 'La mitad de la base por la altura perpendicular desde esa base hasta el vértice opuesto.' },
        { label: 'Fórmula de Herón',        desc: 'Calcula el área solo con los lados. Aquí s = (a+b+c)/2 es el semiperímetro.' },
        { label: 'Suma de Ángulos Interiores', desc: 'Los tres ángulos interiores de cualquier triángulo siempre suman exactamente 180°.' },
      ],
      // Cuadrado
      [
        { label: 'Perímetro',         desc: 'Cuatro lados iguales, cada uno de longitud s.' },
        { label: 'Área',              desc: 'El lado al cuadrado — origen de la palabra "cuadrado" como operación algebraica.' },
        { label: 'Diagonal',          desc: 'Derivada del teorema de Pitágoras: d² = s² + s², por lo tanto d = s√2 ≈ 1.414s.' },
        { label: 'Ángulos Interiores',desc: 'Los cuatro ángulos son rectos. Suma de ángulos interiores = 360°.' },
      ],
      // Pentágono
      [
        { label: 'Perímetro',       desc: 'Cinco lados iguales de longitud s.' },
        { label: 'Área',            desc: 'Área exacta de un pentágono regular. Aproximadamente A ≈ 1.720s².' },
        { label: 'Ángulo Interior', desc: 'Cada ángulo interior del pentágono regular. Suma de ángulos = 540°.' },
        { label: 'Apotema',         desc: 'Distancia perpendicular del centro a cualquier lado. Aproximadamente a ≈ 0.688s.' },
      ],
      // Hexágono
      [
        { label: 'Perímetro',       desc: 'Seis lados iguales. Los hexágonos tesela un plano perfectamente — la base de la estructura de panal.' },
        { label: 'Área',            desc: 'Aproximadamente A ≈ 2.598s². La figura más eficiente en área para teselar un plano.' },
        { label: 'Ángulo Interior', desc: 'Cada ángulo interior. Tres hexágonos se encuentran en cada vértice sumando 360° — permitiendo la tesela perfecta.' },
        { label: 'Circunradio',     desc: 'Propiedad única: el circunradio de un hexágono regular es igual a su lado exactamente.' },
      ],
      // Heptágono
      [
        { label: 'Perímetro',       desc: 'Siete lados iguales.' },
        { label: 'Área',            desc: 'Aproximadamente A ≈ 3.634s². El heptágono no se puede construir con compás y regla.' },
        { label: 'Ángulo Interior', desc: 'Cada ángulo interior = (7−2)·180°/7. Suma de ángulos = 900°.' },
        { label: 'Apotema',         desc: 'Aproximadamente a ≈ 1.038s.' },
      ],
      // Octágono
      [
        { label: 'Perímetro',       desc: 'Ocho lados iguales. Reconocido mundialmente como la señal de Stop.' },
        { label: 'Área',            desc: 'Exactamente 2(1+√2)s² ≈ 4.828s². Se visualiza cortando las cuatro esquinas de un cuadrado.' },
        { label: 'Ángulo Interior', desc: 'Cada ángulo interior. Suma de ángulos = 1080°.' },
        { label: 'Circunradio',     desc: 'Aproximadamente R ≈ 1.307s. El octágono se aproxima mucho más a un círculo que los polígonos anteriores.' },
      ],
    ],
  },
};

let currentLang = 'en';

function setLang(lang) {
  currentLang = lang;
  const t = TRANSLATIONS[lang];

  // Toggle button states (nav + any other instances)
  document.querySelectorAll('#btnEn').forEach(b => b.classList.toggle('active', lang === 'en'));
  document.querySelectorAll('#btnEs').forEach(b => b.classList.toggle('active', lang === 'es'));

  // Rebuild nav list in new language
  buildNavLinks(lang);

  // Hero
  document.querySelector('.eyebrow').textContent = t.eyebrow;
  document.querySelector('.hero-sub').textContent = t.heroSub;
  document.querySelector('.scroll-cta').lastChild.textContent = ' ' + t.scrollCta;

  // N-gon section
  document.querySelector('.ngon-head h2').textContent = t.ngonTitle;
  document.querySelector('.ngon-head p').textContent  = t.ngonSub;
  document.querySelector('.n-label').textContent      = t.nLabel;

  // N-gon formula labels
  document.querySelectorAll('.ngon-formula-card .f-label').forEach((el, i) => {
    if (t.ngonLabels[i]) el.textContent = t.ngonLabels[i];
  });

  // Footer
  document.querySelector('footer').textContent = t.footer;

  // Nav lang label
  const langLabel = document.querySelector('.nav-lang-label');
  if (langLabel) langLabel.textContent = lang === 'es' ? 'Idioma' : 'Language';

  // Re-render exercises in new language (score state preserved)
  renderExercises(lang);

  // Shape sections
  document.querySelectorAll('.shape-section').forEach((sec, idx) => {
    const sm = t.shapes[idx];
    if (!sm) return;
    sec.querySelector('.shape-dimension').textContent = `${sm.sidesLabel} · ${sm.dimension}`;
    sec.querySelector('.shape-label h2').textContent  = sm.name;

    const cards = sec.querySelectorAll('.formula-card');
    const fts   = t.formulas[idx] || [];
    cards.forEach((card, fi) => {
      if (!fts[fi]) return;
      card.querySelector('.f-label').textContent = fts[fi].label;
      card.querySelector('.f-desc').textContent  = fts[fi].desc;
    });
  });

  // Subject switcher + next-subject link
  const subjectNames = lang === 'es' ? ['Geometría', 'Precálculo', 'Cálculo', 'Álgebra Lineal'] : ['Geometry', 'Pre-Calculus', 'Calculus', 'Linear Algebra'];
  document.querySelectorAll('.subject-switch a').forEach(a => { a.textContent = subjectNames[+a.dataset.subject]; });
  document.getElementById('nextEyebrow').textContent = lang === 'es' ? 'Siguiente materia' : 'Next subject';
  document.getElementById('nextName').textContent    = subjectNames[1];

  // Re-run N-gon angle labels with current n
  updateNgon(+slider.value);
  document.documentElement.lang = lang;

  // Remember the choice so Pre-Calculus and Calculus open in the same language
  try { localStorage.setItem(LANG_KEY, lang); } catch (_) { /* private mode */ }
}

// Restore the language chosen on any of the three subject pages
const LANG_KEY = 'geometry-explorer-lang';
try { if (localStorage.getItem(LANG_KEY) === 'es') setLang('es'); } catch (_) { /* private mode */ }

// Language buttons (were inline onclick= attributes; CSP blocks those)
document.getElementById('btnEn').addEventListener('click', () => setLang('en'));
document.getElementById('btnEs').addEventListener('click', () => setLang('es'));

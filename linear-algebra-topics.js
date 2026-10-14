// ═══════════════════════════════════════════════════════════════════════════
// Linear Algebra topics — pure data, rendered by shared/explorer.js.
// Same shape as precalculus-topics.js, except exercises come from the
// generators in linear-algebra-exercises.js (fill-in-the-matrix practice).
// L(en, es) is shorthand for a bilingual value. `backticks` = inline math.
// ═══════════════════════════════════════════════════════════════════════════

const L = (en, es) => ({ en, es });

// ─── 3D drawing helpers (isometric projection onto the 2D Graph) ───────────
// x goes right-down, z goes left-down, y goes straight up.
const ISO = ([x, y, z]) => [(x - z) * 0.866, y - (x + z) * 0.5];
const arrow3 = (g, a, b, o) => g.arrow(...ISO(a), ...ISO(b), o);
const line3  = (g, a, b, o) => g.line(...ISO(a), ...ISO(b), o);
function axes3(g, len = 3) {
  [[len, 0, 0, 'x'], [0, len, 0, 'y'], [0, 0, len, 'z']].forEach(([x, y, z, nm]) => {
    line3(g, [0, 0, 0], [x, y, z], { ghost: true, delay: 0.1 });
    const [px, py] = ISO([x * 1.08, y * 1.08, z * 1.08]);
    g.text(px, py, nm, { muted: true, anchor: 'middle', dy: 4, delay: 0.3 });
  });
}
const CUBE_V = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]];
const CUBE_E = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
function cube3(g, f, o) { const V = CUBE_V.map(f); CUBE_E.forEach(([a, b]) => line3(g, V[a], V[b], o)); }
const rotY3 = (t) => ([x, y, z]) => [x * Math.cos(t) + z * Math.sin(t), y, -x * Math.sin(t) + z * Math.cos(t)];

// Draw a small matrix of numbers with brackets at (x, y) = top-left, in graph units
function drawMat(g, m, x, y, { w = 1, h = 1, color, hiRow = -1, hiCol = -1, hiColor = 2 } = {}) {
  const rows = m.length, cols = m[0].length;
  if (hiRow >= 0) g.poly([[x, y - hiRow * h], [x + cols * w, y - hiRow * h], [x + cols * w, y - (hiRow + 1) * h], [x, y - (hiRow + 1) * h]], { close: true, fill: true, color: hiColor, thin: true, delay: 1 });
  if (hiCol >= 0) g.poly([[x + hiCol * w, y], [x + (hiCol + 1) * w, y], [x + (hiCol + 1) * w, y - rows * h], [x + hiCol * w, y - rows * h]], { close: true, fill: true, color: hiColor, thin: true, delay: 1 });
  m.forEach((row, i) => row.forEach((v, j) => g.text(x + (j + 0.5) * w, y - (i + 0.62) * h, String(v).replace('-', '−'), { anchor: 'middle', color, size: 14, delay: 0.6 })));
  const b = 0.18;
  g.poly([[x + b, y], [x, y], [x, y - rows * h], [x + b, y - rows * h]], { ghost: true, delay: 0.2 });
  g.poly([[x + cols * w - b, y], [x + cols * w, y], [x + cols * w, y - rows * h], [x + cols * w - b, y - rows * h]], { ghost: true, delay: 0.2 });
}

const LA_TOPICS = [

// ─── 01 · Vectors in 3D ─────────────────────────────────────────────────────
{
  id: 'vectors', color: '#1C1DAB',
  tag:  L('Position · Direction · Velocity', 'Posición · Dirección · Velocidad'),
  name: L('Vectors in 3D', 'Vectores en 3D'),
  graph() {
    const g = Graph({ x: [-3.2, 3.6], y: [-2.4, 4.4] });
    axes3(g);
    const u = [2.2, 0.6, 0.4], v = [0.3, 2, -1.2], s = u.map((x, i) => x + v[i]);
    line3(g, u, s, { dash: true, ghost: true }); line3(g, v, s, { dash: true, ghost: true });
    arrow3(g, [0, 0, 0], u, { color: 1 });
    arrow3(g, [0, 0, 0], v, { color: 2, delay: 0.4 });
    arrow3(g, [0, 0, 0], s, { color: 3, delay: 0.9 });
    g.text(...ISO(u), 'u', { dx: 8, dy: 12, color: 1 });
    g.text(...ISO(v), 'v', { dx: -14, color: 2 });
    g.text(...ISO(s), 'u + v', { dx: 8, dy: -6, color: 3 });
    return g.svg();
  },
  formulas: [
    { label: L('Components', 'Componentes'), expr: 'v = (x, y, z) = x·i + y·j + z·k',
      desc: L('Three numbers: how far along each axis. In a 3D engine every position, velocity and direction is one of these.',
              'Tres números: cuánto se avanza en cada eje. En un motor 3D cada posición, velocidad y dirección es uno de estos.') },
    { label: L('Add & Scale', 'Sumar y Escalar'), expr: 'u + v = (u₁+v₁, u₂+v₂, u₃+v₃)   k·v = (kv₁, kv₂, kv₃)',
      desc: L('Component by component. Adding chains movements tip-to-tail; scaling stretches (k < 0 flips).',
              'Componente a componente. Sumar encadena movimientos punta con cola; escalar estira (k < 0 voltea).') },
    { label: L('Length (Magnitude)', 'Longitud (Magnitud)'), expr: '|v| = √(x² + y² + z²)',
      desc: L('Pythagoras twice. The distance between points A and B is |B − A|.', 'Pitágoras dos veces. La distancia entre los puntos A y B es |B − A|.') },
    { label: L('Normalize', 'Normalizar'), expr: 'v̂ = v / |v|',
      desc: L('Same direction, length 1. Directions for lights, cameras and surface normals must be normalized.',
              'Misma dirección, longitud 1. Las direcciones de luces, cámaras y normales deben estar normalizadas.') },
  ],
  deep: {
    idea: [
      L('A vector is an arrow: it has a <b>length</b> and a <b>direction</b>, but no fixed location. In code it is just a list of numbers, `(x, y, z)`. The same data type stores a point’s position, a character’s velocity, the direction a camera looks and the normal of a surface — the meaning comes from how you use it.',
        'Un vector es una flecha: tiene <b>longitud</b> y <b>dirección</b>, pero no una ubicación fija. En código es solo una lista de números, `(x, y, z)`. El mismo tipo de dato guarda la posición de un punto, la velocidad de un personaje, hacia dónde mira una cámara y la normal de una superficie — el significado depende de cómo lo uses.'),
      L('Everything else in this page — matrices, transforms, quaternions — exists to <i>do things</i> to vectors.', 'Todo lo demás en esta página — matrices, transformaciones, cuaterniones — existe para <i>hacerle cosas</i> a los vectores.'),
    ],
    why: [
      L('<b>Length in 3D</b> is Pythagoras applied twice: the floor diagonal is `√(x² + z²)`, and with the height y on top, `√(x² + z² + y²)`.',
        '<b>La longitud en 3D</b> es Pitágoras aplicado dos veces: la diagonal del piso es `√(x² + z²)`, y con la altura y encima, `√(x² + z² + y²)`.'),
      L('<b>Normalizing</b> divides by the length, so the new length is `|v|/|v| = 1`. Many formulas (lighting, angles, reflections) assume unit vectors and silently give wrong answers otherwise.',
        '<b>Normalizar</b> divide entre la longitud, así que la nueva longitud es `|v|/|v| = 1`. Muchas fórmulas (iluminación, ángulos, reflejos) suponen vectores unitarios y dan respuestas erróneas en silencio si no lo son.'),
    ],
    mistakes: [
      L('Normalizing the zero vector `(0, 0, 0)` — division by zero, the classic NaN bug in games. Check the length first.', 'Normalizar el vector cero `(0, 0, 0)` — división entre cero, el clásico error NaN en los juegos. Revisa la longitud primero.'),
      L('Adding lengths instead of components: `|u + v| ≤ |u| + |v|`, usually strictly less.', 'Sumar longitudes en lugar de componentes: `|u + v| ≤ |u| + |v|`, normalmente estrictamente menor.'),
      L('Mixing coordinate systems: Unity is left-handed with y up, OpenGL/three.js right-handed with y up, Unreal left-handed with z up.', 'Mezclar sistemas de coordenadas: Unity es de mano izquierda con y arriba, OpenGL/three.js de mano derecha con y arriba, Unreal de mano izquierda con z arriba.'),
    ],
    example: {
      prompt: L('A player at `A = (1, 2, 3)` looks at a target at `B = (4, 6, 3)`. Find the distance and the unit direction to aim.', 'Un jugador en `A = (1, 2, 3)` mira un objetivo en `B = (4, 6, 3)`. Halla la distancia y la dirección unitaria para apuntar.'),
      steps: [
        L('Vector from A to B: `B − A = (3, 4, 0)`.', 'Vector de A a B: `B − A = (3, 4, 0)`.'),
        L('Distance: `|B − A| = √(9 + 16 + 0) = 5`.', 'Distancia: `|B − A| = √(9 + 16 + 0) = 5`.'),
        L('Direction: `(3, 4, 0) / 5 = (0.6, 0.8, 0)`.', 'Dirección: `(3, 4, 0) / 5 = (0.6, 0.8, 0)`.'),
        L('Check: `0.36 + 0.64 + 0 = 1` ✓. Moving at speed 2 means adding `2·(0.6, 0.8, 0)` each second.', 'Comprueba: `0.36 + 0.64 + 0 = 1` ✓. Moverse a velocidad 2 significa sumar `2·(0.6, 0.8, 0)` cada segundo.'),
      ],
      answer: L('distance `5`, direction `(0.6, 0.8, 0)`', 'distancia `5`, dirección `(0.6, 0.8, 0)`'),
    },
    real: [
      L('In AR/VR, the headset reports your head position and the controllers’ positions as 3D vectors many times per second. “Point at an object”, “teleport there”, “how far is my hand from the button” are all vector subtraction and length.',
        'En AR/VR, el casco reporta la posición de tu cabeza y la de los controles como vectores 3D muchas veces por segundo. “Apuntar a un objeto”, “teletransportarse allí”, “qué tan lejos está mi mano del botón” son resta de vectores y longitud.'),
    ],
  },
},

// ─── 02 · Dot Product ───────────────────────────────────────────────────────
{
  id: 'dot', color: '#2E4FC4',
  tag:  L('Angles · Projections · Lighting', 'Ángulos · Proyecciones · Iluminación'),
  name: L('Dot Product', 'Producto Punto'),
  graph() {
    const g = Graph({ x: [-0.8, 5.2], y: [-0.8, 5.2] });
    g.grid(1).axes({ ticks: 1 });
    const u = [2.4, 3.2], v = [4.4, 1.1], s = (u[0] * v[0] + u[1] * v[1]) / (v[0] ** 2 + v[1] ** 2), pr = v.map(x => x * s);
    g.line(...u, ...pr, { dash: true, color: 3, delay: 1 });
    g.arrow(0, 0, ...pr, { color: 3, delay: 1.2, thin: true });
    g.arrow(0, 0, ...u, { color: 1 });
    g.arrow(0, 0, ...v, { color: 2, delay: 0.4 });
    const a1 = Math.atan2(v[1], v[0]), a2 = Math.atan2(u[1], u[0]);
    g.param(t => 0.7 * Math.cos(t), t => 0.7 * Math.sin(t), a1, a2, { color: 1, thin: true, delay: 1.3 });
    g.text(...u, 'u', { dx: 6, dy: -4, color: 1 });
    g.text(...v, 'v', { dx: 6, color: 2 });
    g.text(0.75, 0.55, 'θ', { color: 1 });
    g.text(...pr, 'proj', { dx: -10, dy: 18, color: 3, size: 11 });
    g.text(-0.6, 4.8, 'u·v = |u||v| cos θ', { color: 1, size: 12 });
    return g.svg();
  },
  formulas: [
    { label: L('Definition', 'Definición'), expr: 'u · v = u₁v₁ + u₂v₂ + u₃v₃',
      desc: L('Multiply matching components and add. The result is a single number, not a vector.', 'Multiplica componentes correspondientes y suma. El resultado es un número, no un vector.') },
    { label: L('Geometric Meaning', 'Significado Geométrico'), expr: 'u · v = |u| |v| cos θ',
      desc: L('> 0: less than 90° apart · = 0: perpendicular · < 0: more than 90°. With unit vectors it IS cos θ.',
              '> 0: menos de 90° de separación · = 0: perpendiculares · < 0: más de 90°. Con vectores unitarios ES cos θ.') },
    { label: L('Projection', 'Proyección'), expr: 'proj_v(u) = (u·v / v·v) · v',
      desc: L('The shadow of u on the line of v. Used to slide along walls and to split forces.', 'La sombra de u sobre la recta de v. Se usa para deslizarse por paredes y descomponer fuerzas.') },
    { label: L('Diffuse Lighting', 'Iluminación Difusa'), expr: 'brightness = max(0, n̂ · l̂)',
      desc: L('Lambert’s law: a surface is brightest when its normal points straight at the light.', 'Ley de Lambert: una superficie es más brillante cuando su normal apunta directo a la luz.') },
  ],
  deep: {
    idea: [
      L('The dot product answers <b>“how much do two directions agree?”</b> Pointing the same way → large positive. Perpendicular → zero. Opposite → negative. It is the cheapest useful operation in 3D graphics: three multiplications and two additions.',
        'El producto punto responde <b>“¿cuánto coinciden dos direcciones?”</b> Mismo sentido → positivo grande. Perpendiculares → cero. Opuestos → negativo. Es la operación útil más barata de los gráficos 3D: tres multiplicaciones y dos sumas.'),
      L('Projection uses it to find the “shadow” of one vector on another (pink in the graph): how much of u goes in v’s direction.', 'La proyección lo usa para hallar la “sombra” de un vector sobre otro (rosa en la gráfica): cuánto de u va en la dirección de v.'),
    ],
    why: [
      L('Apply the Law of Cosines to the triangle u, v, u − v: `|u − v|² = |u|² + |v|² − 2|u||v|cos θ`. Expanding the left side with components leaves `u₁v₁ + u₂v₂ + u₃v₃ = |u||v|cos θ`. The algebra and the geometry agree.',
        'Aplica la Ley de Cosenos al triángulo u, v, u − v: `|u − v|² = |u|² + |v|² − 2|u||v|cos θ`. Al expandir el lado izquierdo con componentes queda `u₁v₁ + u₂v₂ + u₃v₃ = |u||v|cos θ`. El álgebra y la geometría coinciden.'),
    ],
    mistakes: [
      L('Forgetting to normalize before using `n·l` as brightness or `acos(u·v)` as an angle.', 'Olvidar normalizar antes de usar `n·l` como brillo o `acos(u·v)` como ángulo.'),
      L('Treating the result as a vector — it is a scalar.', 'Tratar el resultado como vector — es un escalar.'),
      L('Not clamping: negative `n·l` means the light is behind the surface; use `max(0, n·l)`.', 'No limitar: un `n·l` negativo significa que la luz está detrás de la superficie; usa `max(0, n·l)`.'),
    ],
    example: {
      prompt: L('Is an enemy in front of the player? The player faces `f = (0, 0, −1)`; the enemy is at offset `d = (3, 0, −4)`.', '¿Está un enemigo frente al jugador? El jugador mira hacia `f = (0, 0, −1)`; el enemigo está en el desplazamiento `d = (3, 0, −4)`.'),
      steps: [
        L('`f · d = 0·3 + 0·0 + (−1)(−4) = 4` → positive, so the enemy is in front.', '`f · d = 0·3 + 0·0 + (−1)(−4) = 4` → positivo, así que el enemigo está al frente.'),
        L('Angle: `|d| = 5`, `|f| = 1`, so `cos θ = 4/5 = 0.8` and `θ ≈ 36.9°`.', 'Ángulo: `|d| = 5`, `|f| = 1`, así que `cos θ = 4/5 = 0.8` y `θ ≈ 36.9°`.'),
        L('A 90° field of view covers ±45°, and 36.9° < 45°, so the enemy is on screen.', 'Un campo de visión de 90° cubre ±45°, y 36.9° < 45°, así que el enemigo está en pantalla.'),
      ],
      answer: L('in front, about `36.9°` off-center — visible', 'al frente, a unos `36.9°` del centro — visible'),
    },
    real: [
      L('Every pixel of a lit 3D scene computes `n·l`. VR uses dot products for gaze selection (“is the user looking at this button?”), for culling objects behind the head, and for haptics (“how directly did the hand hit the surface?”).',
        'Cada píxel de una escena 3D iluminada calcula `n·l`. La VR usa productos punto para la selección con la mirada (“¿está el usuario mirando este botón?”), para descartar objetos detrás de la cabeza y para la háptica (“¿qué tan de frente golpeó la mano la superficie?”).'),
    ],
  },
},

// ─── 03 · Cross Product ─────────────────────────────────────────────────────
{
  id: 'cross', color: '#3785D8',
  tag:  L('Normals · Right-Hand Rule · Area', 'Normales · Regla de la Mano Derecha · Área'),
  name: L('Cross Product', 'Producto Cruz'),
  graph() {
    const g = Graph({ x: [-3, 3.4], y: [-2.6, 3.8] });
    axes3(g, 2.6);
    const u = [0.4, 0, 2], v = [2, 0, 0.3];
    const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]].map(x => x * 0.75);
    g.poly([[0, 0, 0], u, u.map((x, i) => x + v[i]), v].map(ISO), { close: true, fill: true, color: 1, thin: true, delay: 0.6 });
    arrow3(g, [0, 0, 0], u, { color: 1 });
    arrow3(g, [0, 0, 0], v, { color: 2, delay: 0.3 });
    arrow3(g, [0, 0, 0], n, { color: 3, delay: 1 });
    g.text(...ISO(u), 'u', { dx: -14, dy: 6, color: 1 });
    g.text(...ISO(v), 'v', { dx: 8, dy: 6, color: 2 });
    g.text(...ISO(n), 'u × v', { dx: 8, color: 3 });
    g.text(-2.9, -2.3, L('area = |u × v|', 'área = |u × v|'), { muted: true, size: 11 });
    return g.svg();
  },
  formulas: [
    { label: L('Definition', 'Definición'), expr: 'u × v = (u₂v₃ − u₃v₂, u₃v₁ − u₁v₃, u₁v₂ − u₂v₁)',
      desc: L('Only in 3D. The result is a new vector perpendicular to both u and v.', 'Solo en 3D. El resultado es un vector nuevo perpendicular a u y a v.') },
    { label: L('Length = Area', 'Longitud = Área'), expr: '|u × v| = |u| |v| sin θ',
      desc: L('The area of the parallelogram they span. Half of it is the area of the triangle.', 'El área del paralelogramo que forman. La mitad es el área del triángulo.') },
    { label: L('Right-Hand Rule', 'Regla de la Mano Derecha'), expr: 'v × u = −(u × v)',
      desc: L('Curl your fingers from u to v; your thumb points along u × v. Swapping the order flips it.', 'Curva los dedos de u hacia v; el pulgar apunta en la dirección de u × v. Cambiar el orden lo voltea.') },
    { label: L('Triangle Normal', 'Normal del Triángulo'), expr: 'n = (B − A) × (C − A)',
      desc: L('How every mesh computes the direction a face points. Normalize it before lighting.', 'Así calcula cada malla hacia dónde apunta una cara. Normalízala antes de iluminar.') },
  ],
  deep: {
    idea: [
      L('Give the cross product two directions and it returns the direction <b>perpendicular to both</b>. That is exactly what a 3D engine needs to know which way a triangle faces, to build a camera’s “up” and “right” axes, and to compute torque and spin.',
        'Dale al producto cruz dos direcciones y devuelve la dirección <b>perpendicular a ambas</b>. Es justo lo que un motor 3D necesita para saber hacia dónde mira un triángulo, construir los ejes “arriba” y “derecha” de una cámara y calcular torque y giro.'),
      L('Its length is the area of the parallelogram (gold): parallel vectors give area 0, so `u × v = 0` exactly when u and v are parallel.', 'Su longitud es el área del paralelogramo (dorado): vectores paralelos dan área 0, así que `u × v = 0` exactamente cuando u y v son paralelos.'),
    ],
    why: [
      L('The formula is built so that `u·(u × v) = 0` and `v·(u × v) = 0`: expand `u₁(u₂v₃ − u₃v₂) + u₂(u₃v₁ − u₁v₃) + u₃(u₁v₂ − u₂v₁)` and every term cancels with another. Perpendicularity is guaranteed by the algebra.',
        'La fórmula está construida para que `u·(u × v) = 0` y `v·(u × v) = 0`: expande `u₁(u₂v₃ − u₃v₂) + u₂(u₃v₁ − u₁v₃) + u₃(u₁v₂ − u₂v₁)` y cada término se cancela con otro. La perpendicularidad la garantiza el álgebra.'),
      L('Memory trick: write the components twice (x y z x y) and use the “yz − zy, zx − xz, xy − yx” pattern.', 'Truco para recordar: escribe los componentes dos veces (x y z x y) y usa el patrón “yz − zy, zx − xz, xy − yx”.'),
    ],
    mistakes: [
      L('Swapping the order and getting a normal that points inward — the face turns invisible due to back-face culling.', 'Cambiar el orden y obtener una normal hacia adentro — la cara se vuelve invisible por el descarte de caras traseras.'),
      L('Mixing up signs in the middle (y) component: it is `u₃v₁ − u₁v₃`.', 'Confundir los signos en el componente del medio (y): es `u₃v₁ − u₁v₃`.'),
      L('Using it in 2D. There the “cross product” is just the scalar `u₁v₂ − u₂v₁` (a determinant).', 'Usarlo en 2D. Ahí el “producto cruz” es solo el escalar `u₁v₂ − u₂v₁` (un determinante).'),
    ],
    example: {
      prompt: L('Find the normal and area of the triangle `A = (0, 0, 0)`, `B = (2, 0, 0)`, `C = (0, 0, −3)`.', 'Halla la normal y el área del triángulo `A = (0, 0, 0)`, `B = (2, 0, 0)`, `C = (0, 0, −3)`.'),
      steps: [
        L('Edges: `e₁ = B − A = (2, 0, 0)`, `e₂ = C − A = (0, 0, −3)`.', 'Aristas: `e₁ = B − A = (2, 0, 0)`, `e₂ = C − A = (0, 0, −3)`.'),
        L('`x = 0·(−3) − 0·0 = 0`, `y = 0·0 − 2·(−3) = 6`, `z = 2·0 − 0·0 = 0` → `n = (0, 6, 0)`.', '`x = 0·(−3) − 0·0 = 0`, `y = 0·0 − 2·(−3) = 6`, `z = 2·0 − 0·0 = 0` → `n = (0, 6, 0)`.'),
        L('The normal points straight up (+y) — a floor tile facing the sky.', 'La normal apunta hacia arriba (+y) — una baldosa de piso que mira al cielo.'),
        L('Area: `|n| / 2 = 6 / 2 = 3` (a right triangle with legs 2 and 3 ✓).', 'Área: `|n| / 2 = 6 / 2 = 3` (un triángulo rectángulo de catetos 2 y 3 ✓).'),
      ],
      answer: L('normal `(0, 6, 0)` → unit `(0, 1, 0)`; area `3`', 'normal `(0, 6, 0)` → unitaria `(0, 1, 0)`; área `3`'),
    },
    real: [
      L('Every imported 3D model has its normals computed with cross products. In AR, plane detection finds a floor or wall from three detected points and their cross-product normal; that normal then orients the virtual objects you place on it.',
        'Cada modelo 3D importado tiene sus normales calculadas con productos cruz. En AR, la detección de planos encuentra un piso o pared a partir de tres puntos detectados y la normal de su producto cruz; esa normal orienta los objetos virtuales que colocas encima.'),
    ],
  },
},

// ─── 04 · Matrices & Operations ─────────────────────────────────────────────
{
  id: 'matrices', color: '#5B8FE0',
  tag:  L('Grids of Numbers · Transpose', 'Tablas de Números · Transpuesta'),
  name: L('Matrices & Operations', 'Matrices y Operaciones'),
  graph() {
    const g = Graph({ x: [0, 10], y: [0, 10] });
    drawMat(g, [[1, 4, -2], [0, 3, 5]], 0.4, 8.6, { w: 1.15, h: 1.15, color: 1, hiRow: 0, hiColor: 1 });
    drawMat(g, [[1, 0], [4, 3], [-2, 5]], 6.2, 9.2, { w: 1.15, h: 1.15, color: 2, hiCol: 0, hiColor: 1 });
    g.text(2.1, 5.6, 'A  (2×3)', { anchor: 'middle', color: 1, delay: 0.8 });
    g.text(7.35, 5.3, 'Aᵀ  (3×2)', { anchor: 'middle', color: 2, delay: 0.8 });
    g.arrow(4.2, 7.6, 5.8, 7.6, { color: 3, delay: 1.1 });
    g.text(5, 8, 'ᵀ', { anchor: 'middle', color: 3, size: 16 });
    g.text(5, 3.2, L('row 1 of A → column 1 of Aᵀ', 'fila 1 de A → columna 1 de Aᵀ'), { anchor: 'middle', muted: true, size: 12 });
    g.text(5, 2.2, 'm × n  →  rows × columns', { anchor: 'middle', muted: true, size: 12 });
    return g.svg();
  },
  formulas: [
    { label: L('Size', 'Tamaño'), expr: 'A is m × n  (m rows, n columns),  aᵢⱼ = row i, column j',
      desc: L('Always rows first. A 4×4 matrix stores a full 3D transform; a 3×1 matrix is a column vector.', 'Siempre primero las filas. Una matriz 4×4 guarda una transformación 3D completa; una 3×1 es un vector columna.') },
    { label: L('Add & Scale', 'Sumar y Escalar'), expr: '(A + B)ᵢⱼ = aᵢⱼ + bᵢⱼ    (kA)ᵢⱼ = k·aᵢⱼ',
      desc: L('Entry by entry, and only for matrices of the same size.', 'Entrada por entrada, y solo para matrices del mismo tamaño.') },
    { label: L('Transpose', 'Transpuesta'), expr: '(Aᵀ)ᵢⱼ = aⱼᵢ',
      desc: L('Rows become columns. (AB)ᵀ = BᵀAᵀ — note the order flips.', 'Las filas se vuelven columnas. (AB)ᵀ = BᵀAᵀ — fíjate que el orden se invierte.') },
    { label: L('Special Matrices', 'Matrices Especiales'), expr: 'I (identity) · 0 (zero) · symmetric: Aᵀ = A',
      desc: L('I has 1s on the diagonal and changes nothing: AI = IA = A.', 'I tiene 1 en la diagonal y no cambia nada: AI = IA = A.') },
  ],
  deep: {
    idea: [
      L('A matrix is a rectangular grid of numbers. On its own it is just storage, but in linear algebra a matrix is best thought of as a <b>machine that transforms vectors</b>: rotate, scale, shear, project, change coordinates. Graphics engines keep one 4×4 matrix per object.',
        'Una matriz es una tabla rectangular de números. Por sí sola es solo almacenamiento, pero en álgebra lineal una matriz se entiende mejor como una <b>máquina que transforma vectores</b>: rotar, escalar, cizallar, proyectar, cambiar coordenadas. Los motores gráficos guardan una matriz 4×4 por objeto.'),
      L('The transpose flips a matrix across its main diagonal. It will turn out to be the inverse of every rotation matrix — a huge shortcut.', 'La transpuesta voltea una matriz sobre su diagonal principal. Resultará ser la inversa de toda matriz de rotación — un atajo enorme.'),
    ],
    why: [
      L('Addition and scalar multiplication work entry by entry because a matrix represents a linear map: `(A + B)v = Av + Bv` and `(kA)v = k(Av)`. Defining them any other way would break that.',
        'La suma y el producto por escalar funcionan entrada por entrada porque una matriz representa una función lineal: `(A + B)v = Av + Bv` y `(kA)v = k(Av)`. Definirlas de otra forma rompería eso.'),
    ],
    mistakes: [
      L('Reading `aᵢⱼ` as column-then-row. It is row i, column j.', 'Leer `aᵢⱼ` como columna-fila. Es fila i, columna j.'),
      L('Adding matrices of different sizes — undefined.', 'Sumar matrices de distinto tamaño — no está definido.'),
      L('Row-major vs column-major storage: DirectX/HLSL and many C++ libraries store rows contiguously, OpenGL/GLSL stores columns. The same 16 floats can mean a matrix or its transpose.',
        'Almacenamiento por filas vs. por columnas: DirectX/HLSL y muchas librerías C++ guardan las filas contiguas, OpenGL/GLSL guarda columnas. Los mismos 16 números pueden ser una matriz o su transpuesta.'),
    ],
    example: {
      prompt: L('With `A = [[1, 4], [0, 3]]` and `B = [[2, −1], [5, 0]]`, compute `2A − Bᵀ`.', 'Con `A = [[1, 4], [0, 3]]` y `B = [[2, −1], [5, 0]]`, calcula `2A − Bᵀ`.'),
      steps: [
        L('`2A = [[2, 8], [0, 6]]`.', '`2A = [[2, 8], [0, 6]]`.'),
        L('`Bᵀ = [[2, 5], [−1, 0]]` (rows of B become columns).', '`Bᵀ = [[2, 5], [−1, 0]]` (las filas de B se vuelven columnas).'),
        L('Subtract entry by entry: `[[2 − 2, 8 − 5], [0 − (−1), 6 − 0]]`.', 'Resta entrada por entrada: `[[2 − 2, 8 − 5], [0 − (−1), 6 − 0]]`.'),
      ],
      answer: L('`[[0, 3], [1, 6]]`', '`[[0, 3], [1, 6]]`'),
    },
    real: [
      L('Shaders receive matrices as `uniform mat4` variables; Unity exposes them as `Matrix4x4`, three.js as `Matrix4`. When an AR object appears mirrored or rotated wrongly, a transposed matrix is the first suspect.',
        'Los shaders reciben matrices como variables `uniform mat4`; Unity las expone como `Matrix4x4`, three.js como `Matrix4`. Cuando un objeto de AR aparece reflejado o mal rotado, una matriz transpuesta es el primer sospechoso.'),
    ],
  },
},

// ─── 05 · Matrix Multiplication ─────────────────────────────────────────────
{
  id: 'matmul', color: '#7A6BE6',
  tag:  L('Row · Column · Composition', 'Fila · Columna · Composición'),
  name: L('Matrix Multiplication', 'Multiplicación de Matrices'),
  graph() {
    const g = Graph({ x: [0, 10], y: [0, 10] });
    drawMat(g, [[1, 2], [3, 4]], 0.3, 8.2, { w: 1.1, h: 1.1, color: 1, hiRow: 0, hiColor: 1 });
    g.text(2.95, 7.3, '·', { anchor: 'middle', size: 22, muted: true });
    drawMat(g, [[5, 6], [7, 8]], 3.5, 8.2, { w: 1.1, h: 1.1, color: 2, hiCol: 1, hiColor: 2 });
    g.text(6.15, 7.3, '=', { anchor: 'middle', size: 18, muted: true });
    g.poly([[7.9, 8.2], [9.0, 8.2], [9.0, 7.1], [7.9, 7.1]], { close: true, fill: true, color: 3, thin: true, delay: 1.3 });
    drawMat(g, [[19, 22], [43, 50]], 6.8, 8.2, { w: 1.1, h: 1.1, color: 3 });
    g.text(5, 4.6, 'c₁₂ = 1·6 + 2·8 = 22', { anchor: 'middle', color: 3, size: 15, delay: 1.5 });
    g.text(5, 3.3, L('row 1 of A · column 2 of B', 'fila 1 de A · columna 2 de B'), { anchor: 'middle', muted: true, size: 12 });
    g.text(5, 2.1, '(m×n)·(n×p) = m×p', { anchor: 'middle', muted: true, size: 12 });
    return g.svg();
  },
  formulas: [
    { label: L('Entry Rule', 'Regla de la Entrada'), expr: '(AB)ᵢⱼ = Σₖ aᵢₖ bₖⱼ = row i of A · column j of B',
      desc: L('Every entry of the product is a dot product.', 'Cada entrada del producto es un producto punto.') },
    { label: L('Sizes', 'Tamaños'), expr: '(m × n) · (n × p) = m × p',
      desc: L('The inner sizes must match. A 4×4 times a 4×1 point gives a 4×1 point.', 'Los tamaños internos deben coincidir. Una 4×4 por un punto 4×1 da un punto 4×1.') },
    { label: L('Not Commutative', 'No Conmutativa'), expr: 'AB ≠ BA  (in general)',
      desc: L('Rotate-then-move is not move-then-rotate. Order is everything in transforms.', 'Rotar y luego mover no es mover y luego rotar. El orden lo es todo en transformaciones.') },
    { label: L('Composition', 'Composición'), expr: '(AB)v = A(Bv)',
      desc: L('The product is the single transform “do B, then A”. Associative: (AB)C = A(BC).', 'El producto es la transformación única “haz B, luego A”. Asociativa: (AB)C = A(BC).') },
  ],
  deep: {
    idea: [
      L('Multiplying matrices <b>combines transformations</b>. If B rotates and A moves, then AB is one matrix that rotates and then moves. Engines multiply model, view and projection matrices once per object, then apply the single result to thousands of vertices.',
        'Multiplicar matrices <b>combina transformaciones</b>. Si B rota y A mueve, entonces AB es una sola matriz que rota y luego mueve. Los motores multiplican las matrices de modelo, vista y proyección una vez por objeto, y aplican el único resultado a miles de vértices.'),
      L('Mechanically: entry (i, j) of the product = row i of the left matrix · column j of the right matrix.', 'Mecánicamente: la entrada (i, j) del producto = fila i de la matriz izquierda · columna j de la derecha.'),
    ],
    why: [
      L('The rule is forced by composition. Apply B to a vector, then A: `A(Bv)`. Writing out each output component and grouping the terms gives exactly the row-times-column formula for `(AB)v`. Matrix multiplication was defined to make `(AB)v = A(Bv)` true.',
        'La regla la impone la composición. Aplica B a un vector y luego A: `A(Bv)`. Al escribir cada componente de salida y agrupar términos se obtiene exactamente la fórmula fila-por-columna de `(AB)v`. La multiplicación de matrices se definió para que `(AB)v = A(Bv)` sea cierto.'),
    ],
    mistakes: [
      L('Multiplying entry by entry (that is the Hadamard product, a different operation).', 'Multiplicar entrada por entrada (eso es el producto de Hadamard, otra operación).'),
      L('Assuming AB = BA. Order matters, and in transforms the one applied first goes on the right.', 'Suponer que AB = BA. El orden importa, y en transformaciones la que se aplica primero va a la derecha.'),
      L('Multiplying incompatible sizes: (2×3)(2×3) is undefined.', 'Multiplicar tamaños incompatibles: (2×3)(2×3) no está definido.'),
    ],
    example: {
      prompt: L('Compute `AB` and `BA` for `A = [[1, 2], [3, 4]]`, `B = [[0, 1], [1, 0]]`.', 'Calcula `AB` y `BA` para `A = [[1, 2], [3, 4]]`, `B = [[0, 1], [1, 0]]`.'),
      steps: [
        L('`AB`: row 1 · columns → `(1·0 + 2·1, 1·1 + 2·0) = (2, 1)`; row 2 → `(4, 3)`. So `AB = [[2, 1], [4, 3]]` (columns of A swapped).', '`AB`: fila 1 · columnas → `(1·0 + 2·1, 1·1 + 2·0) = (2, 1)`; fila 2 → `(4, 3)`. Así `AB = [[2, 1], [4, 3]]` (columnas de A intercambiadas).'),
        L('`BA`: row 1 of B is (0, 1) → picks row 2 of A: `(3, 4)`; row 2 picks row 1: `(1, 2)`. So `BA = [[3, 4], [1, 2]]` (rows swapped).', '`BA`: la fila 1 de B es (0, 1) → toma la fila 2 de A: `(3, 4)`; la fila 2 toma la fila 1: `(1, 2)`. Así `BA = [[3, 4], [1, 2]]` (filas intercambiadas).'),
        L('Different results — multiplication is not commutative.', 'Resultados diferentes — la multiplicación no es conmutativa.'),
      ],
      answer: L('`AB = [[2, 1], [4, 3]]`, `BA = [[3, 4], [1, 2]]`', '`AB = [[2, 1], [4, 3]]`, `BA = [[3, 4], [1, 2]]`'),
    },
    real: [
      L('The vertex shader of every 3D app runs `gl_Position = P · V · M · vertex`. In VR it runs twice per frame, once per eye, each with its own view and projection matrices — at 90 frames per second.',
        'El vertex shader de toda app 3D ejecuta `gl_Position = P · V · M · vértice`. En VR se ejecuta dos veces por cuadro, una por ojo, cada una con sus propias matrices de vista y proyección — a 90 cuadros por segundo.'),
    ],
  },
},

// ─── 06 · Systems & Gaussian Elimination ────────────────────────────────────
{
  id: 'systems', color: '#9C6FE0',
  tag:  L('Ax = b · Row Reduction', 'Ax = b · Reducción por Filas'),
  name: L('Systems & Elimination', 'Sistemas y Eliminación'),
  graph() {
    const g = Graph({ x: [-1.5, 5], y: [-2, 5] });
    g.grid(1).axes({ ticks: 1 });
    g.fn(x => 5 - 2 * x, { color: 1 });
    g.fn(x => x - 1, { color: 2, delay: 0.4 });
    g.fn(x => (x + 4) / 3, { color: 3, thin: true, delay: 0.8 });
    g.dot(2, 1, { color: 1, r: 6 });
    g.text(2, 1, '(2, 1)', { dx: 10, dy: 18, color: 1 });
    g.text(-1.3, 4.6, '2x + y = 5', { color: 1, size: 11 });
    g.text(3.3, 3.2, 'x − y = 1', { color: 2, size: 11 });
    g.text(3.1, 1.75, 'x − 3y = −1', { color: 3, size: 11 });
    return g.svg();
  },
  formulas: [
    { label: L('Matrix Form', 'Forma Matricial'), expr: 'A x = b  ↔  [A | b]',
      desc: L('A system of linear equations is one matrix equation. The augmented matrix keeps only the numbers.', 'Un sistema de ecuaciones lineales es una sola ecuación matricial. La matriz aumentada guarda solo los números.') },
    { label: L('Row Operations', 'Operaciones de Fila'), expr: 'Rᵢ ↔ Rⱼ   ·   Rᵢ → kRᵢ   ·   Rᵢ → Rᵢ + kRⱼ',
      desc: L('Swap, scale (k ≠ 0), add a multiple. None of them changes the solution.', 'Intercambiar, escalar (k ≠ 0), sumar un múltiplo. Ninguna cambia la solución.') },
    { label: L('Reduced Row Echelon Form', 'Forma Escalonada Reducida'), expr: '[A | b] → [I | x]',
      desc: L('Gauss–Jordan: make each pivot 1, clear its column. The last column is then the answer.', 'Gauss–Jordan: haz cada pivote 1 y limpia su columna. Entonces la última columna es la respuesta.') },
    { label: L('How Many Solutions', 'Cuántas Soluciones'), expr: 'det A ≠ 0 → exactly one',
      desc: L('Otherwise none (a row 0 = 5) or infinitely many (a row 0 = 0, a free variable).', 'Si no, ninguna (una fila 0 = 5) o infinitas (una fila 0 = 0, una variable libre).') },
  ],
  deep: {
    idea: [
      L('Each linear equation in two unknowns is a line; the solution of the system is where the lines meet (gold dot). In 3D each equation is a plane. <b>Gaussian elimination</b> is the systematic recipe to find that meeting point by combining equations until each one contains a single unknown.',
        'Cada ecuación lineal con dos incógnitas es una recta; la solución del sistema es donde se cruzan (punto dorado). En 3D cada ecuación es un plano. La <b>eliminación gaussiana</b> es la receta sistemática para hallar ese punto combinando ecuaciones hasta que cada una tenga una sola incógnita.'),
    ],
    why: [
      L('Row operations are things you could do to the equations themselves: swap two, multiply one by a non-zero number, add a multiple of one to another. Each is reversible, so the new system has exactly the same solutions as the old one.',
        'Las operaciones de fila son cosas que podrías hacerle a las ecuaciones mismas: intercambiar dos, multiplicar una por un número no nulo, sumarle a una un múltiplo de otra. Cada una es reversible, así que el sistema nuevo tiene exactamente las mismas soluciones que el viejo.'),
    ],
    mistakes: [
      L('Operating on only part of a row — the operation must apply to every entry, including the b column.', 'Operar solo una parte de una fila — la operación se aplica a toda la fila, incluida la columna b.'),
      L('Dividing by a pivot of 0. Swap with a row below first.', 'Dividir entre un pivote 0. Intercambia primero con una fila de abajo.'),
      L('Arithmetic sign slips. Check the final answer in the ORIGINAL equations.', 'Errores de signo. Comprueba la respuesta final en las ecuaciones ORIGINALES.'),
    ],
    example: {
      prompt: L('Solve `2x + y = 5`, `x − y = 1`.', 'Resuelve `2x + y = 5`, `x − y = 1`.'),
      steps: [
        L('Augmented: `[[2, 1 | 5], [1, −1 | 1]]`. Swap rows to get a 1 pivot: `[[1, −1 | 1], [2, 1 | 5]]`.', 'Aumentada: `[[2, 1 | 5], [1, −1 | 1]]`. Intercambia filas para tener pivote 1: `[[1, −1 | 1], [2, 1 | 5]]`.'),
        L('`R₂ → R₂ − 2R₁`: `[[1, −1 | 1], [0, 3 | 3]]`.', '`R₂ → R₂ − 2R₁`: `[[1, −1 | 1], [0, 3 | 3]]`.'),
        L('`R₂ → R₂ ÷ 3`: `[0, 1 | 1]`, then `R₁ → R₁ + R₂`: `[1, 0 | 2]`.', '`R₂ → R₂ ÷ 3`: `[0, 1 | 1]`, luego `R₁ → R₁ + R₂`: `[1, 0 | 2]`.'),
        L('Read off `x = 2`, `y = 1`. Check: `2·2 + 1 = 5` ✓, `2 − 1 = 1` ✓.', 'Lee `x = 2`, `y = 1`. Comprueba: `2·2 + 1 = 5` ✓, `2 − 1 = 1` ✓.'),
      ],
      answer: L('`(x, y) = (2, 1)`', '`(x, y) = (2, 1)`'),
    },
    real: [
      L('Physics engines solve large linear systems every frame to keep stacked objects and ragdoll joints from drifting apart. AR tracking solves least-squares systems to estimate the camera pose from feature points; inverse kinematics for VR avatars’ arms does the same.',
        'Los motores de física resuelven grandes sistemas lineales en cada cuadro para que los objetos apilados y las articulaciones de los ragdolls no se separen. El seguimiento de AR resuelve sistemas de mínimos cuadrados para estimar la pose de la cámara a partir de puntos característicos; la cinemática inversa de los brazos de los avatares de VR hace lo mismo.'),
    ],
  },
},

// ─── 07 · Determinants ──────────────────────────────────────────────────────
{
  id: 'determinant', color: '#BF8CE1',
  tag:  L('Area · Volume · Orientation', 'Área · Volumen · Orientación'),
  name: L('Determinants', 'Determinantes'),
  graph() {
    const g = Graph({ x: [-0.8, 4.2], y: [-0.8, 4.2] });
    g.grid(1).axes({ ticks: 1 });
    g.poly([[0, 0], [1, 0], [1, 1], [0, 1]], { close: true, fill: true, ghost: true, color: 2, delay: 0.1 });
    const a = [2, 0.5], b = [1, 1.5];
    g.poly([[0, 0], a, [a[0] + b[0], a[1] + b[1]], b], { close: true, fill: true, color: 1, delay: 0.5 });
    g.arrow(0, 0, ...a, { color: 3, delay: 1 }); g.arrow(0, 0, ...b, { color: 2, delay: 1 });
    g.text(...a, 'A·e₁', { dx: 6, dy: 14, color: 3, size: 11 });
    g.text(...b, 'A·e₂', { dx: -40, dy: -4, color: 2, size: 11 });
    g.text(0.5, 0.5, '1', { anchor: 'middle', dy: 4, muted: true });
    g.text(-0.6, 3.9, 'A = [[2, 1], [0.5, 1.5]]', { color: 1, size: 11 });
    g.text(-0.6, 3.4, L('area × det A = 2.5', 'área × det A = 2.5'), { color: 3, size: 11 });
    return g.svg();
  },
  formulas: [
    { label: L('2 × 2', '2 × 2'), expr: 'det [[a, b], [c, d]] = ad − bc',
      desc: L('The signed area of the parallelogram made by the columns.', 'El área con signo del paralelogramo que forman las columnas.') },
    { label: L('3 × 3 (Cofactors)', '3 × 3 (Cofactores)'), expr: 'det A = a₁₁M₁₁ − a₁₂M₁₂ + a₁₃M₁₃',
      desc: L('Mᵢⱼ = determinant after deleting row i and column j. Signs follow a checkerboard + − +.', 'Mᵢⱼ = determinante al borrar la fila i y la columna j. Los signos siguen un tablero + − +.') },
    { label: L('Meaning', 'Significado'), expr: '|det A| = volume scale factor',
      desc: L('det < 0: orientation flips (mirror). det = 0: space is squashed flat — no inverse.', 'det < 0: se invierte la orientación (espejo). det = 0: el espacio se aplasta — no hay inversa.') },
    { label: L('Product Rule', 'Regla del Producto'), expr: 'det(AB) = det A · det B',
      desc: L('Scale factors multiply. Also det(Aᵀ) = det A and det(A⁻¹) = 1/det A.', 'Los factores de escala se multiplican. También det(Aᵀ) = det A y det(A⁻¹) = 1/det A.') },
  ],
  deep: {
    idea: [
      L('The determinant is <b>one number that summarizes what a matrix does to size</b>. The unit square (blue) becomes a parallelogram (gold); its area is |det A|. In 3D, the unit cube becomes a slanted box whose volume is |det A|. The sign tells you whether the transform mirrors space.',
        'El determinante es <b>un número que resume lo que una matriz le hace al tamaño</b>. El cuadrado unitario (azul) se vuelve un paralelogramo (dorado); su área es |det A|. En 3D, el cubo unitario se vuelve una caja inclinada cuyo volumen es |det A|. El signo dice si la transformación refleja el espacio.'),
    ],
    why: [
      L('If det A = 0, the parallelogram has zero area: the columns are parallel, so A collapses the plane onto a line. Different inputs land on the same output, so the transform cannot be undone — that is why <b>det A ≠ 0 ⇔ A is invertible</b>.',
        'Si det A = 0, el paralelogramo tiene área cero: las columnas son paralelas, así que A colapsa el plano en una recta. Entradas diferentes caen en la misma salida, así que la transformación no se puede deshacer — por eso <b>det A ≠ 0 ⇔ A es invertible</b>.'),
    ],
    mistakes: [
      L('Forgetting the checkerboard signs in cofactor expansion.', 'Olvidar los signos de tablero en la expansión por cofactores.'),
      L('Using `ad − bc` thinking it is `ab − cd`.', 'Usar `ad − bc` pensando que es `ab − cd`.'),
      L('Assuming `det(A + B) = det A + det B` — false.', 'Suponer que `det(A + B) = det A + det B` — falso.'),
      L('Expanding along a dense row when one has zeros — more work and more errors.', 'Expandir por una fila llena cuando hay una con ceros — más trabajo y más errores.'),
    ],
    example: {
      prompt: L('Find `det A` for `A = [[2, 0, 1], [1, 3, 2], [1, 1, 1]]`.', 'Halla `det A` para `A = [[2, 0, 1], [1, 3, 2], [1, 1, 1]]`.'),
      steps: [
        L('Expand along row 1 (it has a 0): `det A = 2·M₁₁ − 0·M₁₂ + 1·M₁₃`.', 'Expande por la fila 1 (tiene un 0): `det A = 2·M₁₁ − 0·M₁₂ + 1·M₁₃`.'),
        L('`M₁₁ = det[[3, 2], [1, 1]] = 3 − 2 = 1`.', '`M₁₁ = det[[3, 2], [1, 1]] = 3 − 2 = 1`.'),
        L('`M₁₃ = det[[1, 3], [1, 1]] = 1 − 3 = −2`.', '`M₁₃ = det[[1, 3], [1, 1]] = 1 − 3 = −2`.'),
        L('`det A = 2·1 + 1·(−2) = 0` → A squashes space flat; it has no inverse.', '`det A = 2·1 + 1·(−2) = 0` → A aplasta el espacio; no tiene inversa.'),
      ],
      answer: L('`det A = 0` (singular)', '`det A = 0` (singular)'),
    },
    real: [
      L('Engines check `det(M) < 0` on a model matrix to detect mirrored objects and flip their triangle winding — otherwise the mirrored mesh renders inside-out. Physics uses determinants (Jacobians) to keep deforming soft bodies from inverting.',
        'Los motores revisan `det(M) < 0` en la matriz de modelo para detectar objetos reflejados y voltear el orden de sus triángulos — si no, la malla reflejada se dibuja al revés. La física usa determinantes (jacobianos) para que los cuerpos blandos que se deforman no se inviertan.'),
    ],
  },
},

// ─── 08 · Inverse Matrices ──────────────────────────────────────────────────
{
  id: 'inverse', color: '#D88BD0',
  tag:  L('Undo a Transform', 'Deshacer una Transformación'),
  name: L('Inverse Matrices', 'Matrices Inversas'),
  graph() {
    const F = [[0, 0], [0, 2], [1.2, 2], [1.2, 1.6], [0.4, 1.6], [0.4, 1.1], [1, 1.1], [1, 0.7], [0.4, 0.7], [0.4, 0]];
    const A = ([x, y]) => [1.2 * x + 0.6 * y, 0.3 * x + 0.9 * y];
    const g = Graph({ x: [-0.8, 4.4], y: [-0.8, 4.4] });
    g.grid(1).axes({ ticks: 1 });
    g.poly(F, { close: true, fill: true, color: 2, delay: 0.1 });
    g.poly(F.map(A).map(([x, y]) => [x + 1.6, y + 0.6]), { close: true, fill: true, color: 1, delay: 0.6 });
    g.param(t => 1.4 + 1.3 * Math.cos(t), t => 2.6 + 0.9 * Math.sin(t), 2.6, 0.55, { color: 3, thin: true, delay: 1.2 });
    g.param(t => 1.6 + 1.1 * Math.cos(t), t => 1.0 + 0.8 * Math.sin(t), -0.6, -2.7, { color: 2, thin: true, delay: 1.4 });
    g.text(1.6, 3.6, 'A', { color: 3 });
    g.text(1.5, -0.1, 'A⁻¹', { color: 2 });
    g.text(-0.6, 4.1, 'A⁻¹ A = I', { color: 1, size: 12 });
    return g.svg();
  },
  formulas: [
    { label: L('Definition', 'Definición'), expr: 'A A⁻¹ = A⁻¹ A = I',
      desc: L('The transform that undoes A. Exists only when det A ≠ 0.', 'La transformación que deshace A. Solo existe cuando det A ≠ 0.') },
    { label: L('2 × 2 Shortcut', 'Atajo 2 × 2'), expr: '[[a, b], [c, d]]⁻¹ = 1/(ad − bc) · [[d, −b], [−c, a]]',
      desc: L('Swap the diagonal, negate the off-diagonal, divide by the determinant.', 'Intercambia la diagonal, cambia el signo fuera de ella y divide entre el determinante.') },
    { label: L('Adjugate (any size)', 'Adjunta (cualquier tamaño)'), expr: 'A⁻¹ = adj(A) / det A,  adj(A) = Cᵀ',
      desc: L('C is the matrix of cofactors. Gauss–Jordan on [A | I] → [I | A⁻¹] also works.', 'C es la matriz de cofactores. Gauss–Jordan sobre [A | I] → [I | A⁻¹] también funciona.') },
    { label: L('Products', 'Productos'), expr: '(AB)⁻¹ = B⁻¹ A⁻¹',
      desc: L('Undo in reverse order — like taking off socks after shoes.', 'Se deshace en orden inverso — como quitarse los zapatos antes que las medias.') },
  ],
  deep: {
    idea: [
      L('If a matrix moves the gold F into place, its inverse moves it back. In 3D engines inverses are everywhere: the <b>view matrix</b> is the inverse of the camera’s transform, and converting a world-space hit point into an object’s local space uses the inverse of the object’s model matrix.',
        'Si una matriz lleva la F dorada a su lugar, su inversa la devuelve. En los motores 3D las inversas están en todas partes: la <b>matriz de vista</b> es la inversa de la transformación de la cámara, y convertir un punto de impacto del mundo al espacio local de un objeto usa la inversa de su matriz de modelo.'),
    ],
    why: [
      L('For 2×2, multiply `[[a, b], [c, d]]` by `[[d, −b], [−c, a]]`: you get `[[ad − bc, 0], [0, ad − bc]]` = `(det A)·I`. Dividing by det A gives exactly I. If det A = 0 you cannot divide — no inverse.',
        'Para 2×2, multiplica `[[a, b], [c, d]]` por `[[d, −b], [−c, a]]`: obtienes `[[ad − bc, 0], [0, ad − bc]]` = `(det A)·I`. Dividir entre det A da exactamente I. Si det A = 0 no se puede dividir — no hay inversa.'),
      L('The same trick generalizes: `A · adj(A) = (det A) · I` for any square size.', 'El mismo truco se generaliza: `A · adj(A) = (det A) · I` para cualquier tamaño cuadrado.'),
    ],
    mistakes: [
      L('Inverting entry by entry (`1/aᵢⱼ`) — completely wrong.', 'Invertir entrada por entrada (`1/aᵢⱼ`) — totalmente incorrecto.'),
      L('Forgetting to transpose the cofactor matrix.', 'Olvidar transponer la matriz de cofactores.'),
      L('Writing `(AB)⁻¹ = A⁻¹B⁻¹`. The order reverses.', 'Escribir `(AB)⁻¹ = A⁻¹B⁻¹`. El orden se invierte.'),
      L('Calling a general inverse when the matrix is a pure rotation — just transpose it (much faster, more precise).', 'Llamar a una inversa general cuando la matriz es una rotación pura — solo transpónla (mucho más rápido y preciso).'),
    ],
    example: {
      prompt: L('Invert `A = [[4, 7], [2, 6]]`.', 'Invierte `A = [[4, 7], [2, 6]]`.'),
      steps: [
        L('`det A = 4·6 − 7·2 = 10`.', '`det A = 4·6 − 7·2 = 10`.'),
        L('Swap/negate: `[[6, −7], [−2, 4]]`.', 'Intercambia/cambia signos: `[[6, −7], [−2, 4]]`.'),
        L('Divide by 10: `[[0.6, −0.7], [−0.2, 0.4]]`.', 'Divide entre 10: `[[0.6, −0.7], [−0.2, 0.4]]`.'),
        L('Check row 1 · column 1: `4·0.6 + 7·(−0.2) = 1` ✓.', 'Comprueba fila 1 · columna 1: `4·0.6 + 7·(−0.2) = 1` ✓.'),
      ],
      answer: L('`A⁻¹ = [[0.6, −0.7], [−0.2, 0.4]]`', '`A⁻¹ = [[0.6, −0.7], [−0.2, 0.4]]`'),
    },
    real: [
      L('When you grab a virtual object in VR, the engine stores the object’s pose relative to your hand: `inverse(hand) · object`. Every frame it re-applies `hand · offset`, so the object follows your hand perfectly. Normals are transformed with the inverse-transpose of the model matrix so lighting stays correct under non-uniform scale.',
        'Cuando agarras un objeto virtual en VR, el motor guarda la pose del objeto relativa a tu mano: `inversa(mano) · objeto`. Cada cuadro vuelve a aplicar `mano · desplazamiento`, así el objeto sigue tu mano perfectamente. Las normales se transforman con la inversa-transpuesta de la matriz de modelo para que la iluminación siga correcta con escalas no uniformes.'),
    ],
  },
},

// ─── 09 · 2D Transformations ────────────────────────────────────────────────
{
  id: 'transform2d', color: '#E893C5',
  tag:  L('Rotate · Scale · Shear · Reflect', 'Rotar · Escalar · Cizallar · Reflejar'),
  name: L('2D Transformations', 'Transformaciones 2D'),
  graph() {
    const M = [[1, 0.8], [0.25, 1.1]];
    const ap = ([x, y]) => [M[0][0] * x + M[0][1] * y, M[1][0] * x + M[1][1] * y];
    const g = Graph({ x: [-3.2, 3.2], y: [-3.2, 3.2] });
    g.grid(1).axes();
    for (let k = -3; k <= 3; k++) {
      g.line(...ap([k, -4]), ...ap([k, 4]), { color: 2, thin: true, ghost: k !== 0, delay: 0.3 });
      g.line(...ap([-4, k]), ...ap([4, k]), { color: 2, thin: true, ghost: k !== 0, delay: 0.3 });
    }
    g.poly([[0, 0], [1, 0], [1, 1], [0, 1]].map(ap), { close: true, fill: true, color: 1, delay: 0.7 });
    g.arrow(0, 0, ...ap([1, 0]), { color: 3, delay: 1 });
    g.arrow(0, 0, ...ap([0, 1]), { color: 1, delay: 1 });
    g.text(...ap([1, 0]), L('column 1', 'columna 1'), { dx: 6, dy: 14, color: 3, size: 11 });
    g.text(...ap([0, 1]), L('column 2', 'columna 2'), { dx: -70, dy: -4, color: 1, size: 11 });
    g.text(-3, 2.9, 'M = [[1, 0.8], [0.25, 1.1]]', { color: 1, size: 11 });
    return g.svg();
  },
  formulas: [
    { label: L('Columns = Images of the Axes', 'Columnas = Imágenes de los Ejes'), expr: 'M = [ M·e₁ | M·e₂ ]',
      desc: L('To build any 2×2 transform, ask where (1, 0) and (0, 1) go; those are the columns.', 'Para construir cualquier transformación 2×2, pregunta a dónde van (1, 0) y (0, 1); esas son las columnas.') },
    { label: L('Rotation', 'Rotación'), expr: 'R(θ) = [[cos θ, −sin θ], [sin θ, cos θ]]',
      desc: L('Counterclockwise by θ. det = 1: no stretching, no mirroring.', 'Antihoraria por θ. det = 1: sin estirar ni reflejar.') },
    { label: L('Scale & Shear', 'Escala y Cizalla'), expr: 'S = [[sx, 0], [0, sy]]    H = [[1, k], [0, 1]]',
      desc: L('Scale stretches each axis; shear slides x by k times y (italic text is a shear).', 'La escala estira cada eje; la cizalla desliza x por k veces y (el texto en cursiva es una cizalla).') },
    { label: L('Reflections', 'Reflexiones'), expr: 'x-axis [[1, 0], [0, −1]]   y = x  [[0, 1], [1, 0]]',
      desc: L('Mirror images. det = −1 always.', 'Imágenes de espejo. det = −1 siempre.') },
  ],
  deep: {
    idea: [
      L('A 2×2 matrix is completely described by <b>where it sends the two basis arrows</b>. The whole grid follows along: straight lines stay straight, parallel lines stay parallel, the origin stays put. That is the meaning of “linear” transformation.',
        'Una matriz 2×2 queda completamente descrita por <b>a dónde envía las dos flechas base</b>. Toda la cuadrícula las acompaña: las rectas siguen rectas, las paralelas siguen paralelas y el origen no se mueve. Ese es el significado de transformación “lineal”.'),
    ],
    why: [
      L('Any vector is `(x, y) = x·e₁ + y·e₂`. A linear map preserves sums and multiples, so `M(x, y) = x·M(e₁) + y·M(e₂)` — just the columns combined with weights x and y. That is literally matrix-times-vector.',
        'Todo vector es `(x, y) = x·e₁ + y·e₂`. Una función lineal conserva sumas y múltiplos, así que `M(x, y) = x·M(e₁) + y·M(e₂)` — solo las columnas combinadas con pesos x y y. Eso es literalmente matriz por vector.'),
      L('For rotation, e₁ goes to `(cos θ, sin θ)` on the unit circle, and e₂ (90° ahead) goes to `(−sin θ, cos θ)` — giving R(θ).', 'Para la rotación, e₁ va a `(cos θ, sen θ)` en el círculo unitario, y e₂ (90° adelante) va a `(−sen θ, cos θ)` — lo que da R(θ).'),
    ],
    mistakes: [
      L('Putting the image vectors in rows instead of columns (that builds the transpose — for rotations, the opposite rotation).', 'Poner los vectores imagen en filas en lugar de columnas (eso construye la transpuesta — para rotaciones, la rotación opuesta).'),
      L('Composing in the wrong order: “first A, then B” is `BA`.', 'Componer en el orden equivocado: “primero A, luego B” es `BA`.'),
      L('Expecting translation from a 2×2 matrix — impossible (the origin cannot move). That is why homogeneous coordinates exist.', 'Esperar una traslación de una matriz 2×2 — imposible (el origen no se puede mover). Por eso existen las coordenadas homogéneas.'),
    ],
    example: {
      prompt: L('Build the matrix that first rotates 90° counterclockwise and then scales x by 2.', 'Construye la matriz que primero rota 90° antihorario y luego escala x por 2.'),
      steps: [
        L('`R = [[0, −1], [1, 0]]`, `S = [[2, 0], [0, 1]]`.', '`R = [[0, −1], [1, 0]]`, `S = [[2, 0], [0, 1]]`.'),
        L('First R, then S → `M = S·R`.', 'Primero R, luego S → `M = S·R`.'),
        L('`S·R = [[2·0 + 0·1, 2·(−1) + 0·0], [0·0 + 1·1, 0·(−1) + 1·0]] = [[0, −2], [1, 0]]`.', '`S·R = [[2·0 + 0·1, 2·(−1) + 0·0], [0·0 + 1·1, 0·(−1) + 1·0]] = [[0, −2], [1, 0]]`.'),
        L('Check with e₁: rotate → (0, 1), scale x → (0, 1); column 1 of M is (0, 1) ✓.', 'Comprueba con e₁: rota → (0, 1), escala x → (0, 1); la columna 1 de M es (0, 1) ✓.'),
      ],
      answer: L('`M = [[0, −2], [1, 0]]`', '`M = [[0, −2], [1, 0]]`'),
    },
    real: [
      L('UI panels floating in VR, 2D sprites, texture coordinates and the CSS `transform: matrix(a, b, c, d, e, f)` property are all 2D transforms. AR filters warp faces with 2D affine and projective transforms.',
        'Los paneles de interfaz que flotan en VR, los sprites 2D, las coordenadas de textura y la propiedad CSS `transform: matrix(a, b, c, d, e, f)` son transformaciones 2D. Los filtros de AR deforman caras con transformaciones afines y proyectivas 2D.'),
    ],
  },
},

// ─── 10 · 3D Rotations ──────────────────────────────────────────────────────
{
  id: 'rotation3d', color: '#EBB2C3',
  tag:  L('Rx · Ry · Rz · Euler Angles', 'Rx · Ry · Rz · Ángulos de Euler'),
  name: L('3D Rotations', 'Rotaciones 3D'),
  graph() {
    const g = Graph({ x: [-3.2, 3.2], y: [-3, 3.4] });
    axes3(g, 2.9);
    const s = 1.1, base = ([x, y, z]) => [x * s, y * s, z * s];
    cube3(g, base, { ghost: true, delay: 0.1 });
    const R = rotY3(0.6);
    cube3(g, p => R(base(p)), { color: 1, delay: 0.4 });
    const arc = []; for (let k = 0; k <= 30; k++) { const t = 0.6 * k / 30; arc.push(ISO([2.2 * Math.sin(t), 2.4, 2.2 * Math.cos(t)])); }
    g.poly(arc, { color: 3, thin: true, delay: 1.2 });
    g.text(...ISO([1.2, 2.5, 2]), 'Ry(θ)', { color: 3 });
    return g.svg();
  },
  formulas: [
    { label: L('About x', 'Alrededor de x'), expr: 'Rx(θ) = [[1, 0, 0], [0, c, −s], [0, s, c]]',
      desc: L('c = cos θ, s = sin θ. Pitch (nodding “yes”). The x coordinate never changes.', 'c = cos θ, s = sen θ. Cabeceo (asentir “sí”). La coordenada x nunca cambia.') },
    { label: L('About y', 'Alrededor de y'), expr: 'Ry(θ) = [[c, 0, s], [0, 1, 0], [−s, 0, c]]',
      desc: L('Yaw (shaking “no”). Note the sign pattern is flipped compared to the others.', 'Guiñada (negar “no”). Fíjate que el patrón de signos está invertido respecto a las otras.') },
    { label: L('About z', 'Alrededor de z'), expr: 'Rz(θ) = [[c, −s, 0], [s, c, 0], [0, 0, 1]]',
      desc: L('Roll (tilting the head). It is the 2D rotation with z left alone.', 'Alabeo (inclinar la cabeza). Es la rotación 2D sin tocar z.') },
    { label: L('Properties', 'Propiedades'), expr: 'R⁻¹ = Rᵀ,   det R = 1',
      desc: L('Rotations are orthogonal: inverting one is just a transpose. They do not commute: RxRy ≠ RyRx.', 'Las rotaciones son ortogonales: invertir una es solo transponer. No conmutan: RxRy ≠ RyRx.') },
  ],
  deep: {
    idea: [
      L('A 3D rotation turns space around an axis through the origin. Rotations about the three coordinate axes are 2D rotations that leave one coordinate alone. Any orientation can be built from three of them — the <b>Euler angles</b> yaw, pitch and roll your head makes in a headset.',
        'Una rotación 3D gira el espacio alrededor de un eje que pasa por el origen. Las rotaciones alrededor de los tres ejes de coordenadas son rotaciones 2D que dejan una coordenada quieta. Cualquier orientación se construye con tres de ellas — los <b>ángulos de Euler</b> de guiñada, cabeceo y alabeo que hace tu cabeza en un casco.'),
    ],
    why: [
      L('The columns of a rotation matrix are where the x, y and z axes go. They stay unit length and perpendicular, which is exactly the condition `RᵀR = I` — so `R⁻¹ = Rᵀ`.',
        'Las columnas de una matriz de rotación son a dónde van los ejes x, y y z. Siguen siendo unitarias y perpendiculares, que es exactamente la condición `RᵀR = I` — así que `R⁻¹ = Rᵀ`.'),
      L('Ry looks “backwards” because the cyclic order is x → y → z → x: rotating about y turns z toward x, not x toward z.', 'Ry parece “al revés” porque el orden cíclico es x → y → z → x: rotar alrededor de y gira z hacia x, no x hacia z.'),
    ],
    mistakes: [
      L('Assuming rotation order does not matter. Yaw-then-pitch ≠ pitch-then-yaw.', 'Suponer que el orden de las rotaciones no importa. Guiñada y luego cabeceo ≠ cabeceo y luego guiñada.'),
      L('Degrees vs radians in code (`Math.cos(90)` is cos of 90 radians).', 'Grados vs radianes en código (`Math.cos(90)` es el coseno de 90 radianes).'),
      L('<b>Gimbal lock</b>: with Euler angles, when pitch hits ±90° the yaw and roll axes line up and one degree of freedom disappears. This is why VR uses quaternions.',
        '<b>Bloqueo de cardán (gimbal lock)</b>: con ángulos de Euler, cuando el cabeceo llega a ±90° los ejes de guiñada y alabeo se alinean y se pierde un grado de libertad. Por eso la VR usa cuaterniones.'),
    ],
    example: {
      prompt: L('Rotate `v = (1, 0, 0)` by 90° about y.', 'Rota `v = (1, 0, 0)` 90° alrededor de y.'),
      steps: [
        L('`cos 90° = 0`, `sin 90° = 1` → `Ry = [[0, 0, 1], [0, 1, 0], [−1, 0, 0]]`.', '`cos 90° = 0`, `sen 90° = 1` → `Ry = [[0, 0, 1], [0, 1, 0], [−1, 0, 0]]`.'),
        L('`Ry·v` = first column of Ry = `(0, 0, −1)`.', '`Ry·v` = primera columna de Ry = `(0, 0, −1)`.'),
        L('So +x turns into −z: in a right-handed, y-up world (three.js, OpenGL), turning left by 90° makes “right” point “forward”.', 'Así +x se vuelve −z: en un mundo de mano derecha con y arriba (three.js, OpenGL), girar 90° a la izquierda hace que “derecha” apunte “al frente”.'),
      ],
      answer: L('`(0, 0, −1)`', '`(0, 0, −1)`'),
    },
    real: [
      L('Head tracking reports orientation hundreds of times per second; turning it into a rotation matrix rotates the whole virtual world opposite to your head so objects appear fixed in space. Controllers, spinning turrets and orbit cameras all use these matrices.',
        'El seguimiento de la cabeza reporta la orientación cientos de veces por segundo; convertirla en matriz de rotación gira todo el mundo virtual en sentido opuesto a tu cabeza para que los objetos parezcan fijos en el espacio. Los controles, las torretas giratorias y las cámaras orbitales usan estas matrices.'),
    ],
  },
},

// ─── 11 · Homogeneous Coordinates ───────────────────────────────────────────
{
  id: 'homogeneous', color: '#F0C1A8',
  tag:  L('4×4 Matrices · Translation · TRS', 'Matrices 4×4 · Traslación · TRS'),
  name: L('Homogeneous Coordinates', 'Coordenadas Homogéneas'),
  graph() {
    const g = Graph({ x: [-3, 4.4], y: [-2.6, 4.8] });
    axes3(g, 2.6);
    const S = 0.55, R = rotY3(0.7), t = [1.5, 1.7, -1.3];
    cube3(g, ([x, y, z]) => [x * S, y * S, z * S], { ghost: true, delay: 0.1 });
    cube3(g, ([x, y, z]) => R([x * S * 1.4, y * S, z * S * 0.8]).map((c, i) => c + t[i]), { color: 1, delay: 0.5 });
    arrow3(g, [0, 0, 0], t, { color: 3, dash: true, delay: 1 });
    g.text(...ISO(t), 'M = T·R·S', { dy: -42, anchor: 'middle', color: 1 });
    g.text(-2.9, -2.3, '(x, y, z, 1)', { muted: true, size: 11 });
    return g.svg();
  },
  formulas: [
    { label: L('Homogeneous Point', 'Punto Homogéneo'), expr: 'p = (x, y, z, 1)    direction = (x, y, z, 0)',
      desc: L('A 4th coordinate w. Points (w = 1) can be moved; directions (w = 0) are only rotated and scaled.', 'Una 4.ª coordenada w. Los puntos (w = 1) se pueden mover; las direcciones (w = 0) solo se rotan y escalan.') },
    { label: L('Translation', 'Traslación'), expr: 'T = [[1,0,0,tx], [0,1,0,ty], [0,0,1,tz], [0,0,0,1]]',
      desc: L('Moving is now a matrix multiplication, so it can be combined with everything else.', 'Mover ahora es una multiplicación de matrices, así que se puede combinar con todo lo demás.') },
    { label: L('Model Matrix', 'Matriz de Modelo'), expr: 'M = T · R · S',
      desc: L('Scale first, then rotate, then translate (read right to left). The universal order in engines.', 'Primero escala, luego rota, luego traslada (se lee de derecha a izquierda). El orden universal en los motores.') },
    { label: L('Full Pipeline', 'Tubería Completa'), expr: 'clip = P · V · M · p',
      desc: L('Model (local → world), View (world → camera), Projection (camera → clip).', 'Modelo (local → mundo), Vista (mundo → cámara), Proyección (cámara → recorte).') },
  ],
  deep: {
    idea: [
      L('A 3×3 matrix can rotate, scale and shear, but it can never <b>move</b> anything — it always keeps the origin fixed. Adding a fourth coordinate, `w = 1`, fixes this: translation becomes the 4th column of a 4×4 matrix. Now every transform in a 3D engine is a single 4×4 matrix, and combining them is just multiplication.',
        'Una matriz 3×3 puede rotar, escalar y cizallar, pero nunca puede <b>mover</b> nada — siempre deja fijo el origen. Agregar una cuarta coordenada, `w = 1`, lo arregla: la traslación se vuelve la 4.ª columna de una matriz 4×4. Ahora cada transformación de un motor 3D es una sola matriz 4×4, y combinarlas es solo multiplicar.'),
    ],
    why: [
      L('Multiply T by `(x, y, z, 1)`: row 1 gives `1·x + 0·y + 0·z + tx·1 = x + tx`. The `1` in w is what pulls in the translation. With `w = 0` (a direction) the translation is multiplied by 0 and ignored — exactly right, because moving an object does not change which way “north” is.',
        'Multiplica T por `(x, y, z, 1)`: la fila 1 da `1·x + 0·y + 0·z + tx·1 = x + tx`. El `1` en w es lo que trae la traslación. Con `w = 0` (una dirección) la traslación se multiplica por 0 y se ignora — justo lo correcto, porque mover un objeto no cambia hacia dónde queda el “norte”.'),
    ],
    mistakes: [
      L('Using `T·S·R` or `S·R·T` — scaling after translating also scales the position.', 'Usar `T·S·R` o `S·R·T` — escalar después de trasladar también escala la posición.'),
      L('Transforming normals/directions with w = 1 so they get translated.', 'Transformar normales o direcciones con w = 1, de modo que se trasladan.'),
      L('Row-vector conventions (DirectX, Unity’s C# API in some places) write `p·M` and reverse every product order.', 'Las convenciones de vector fila (DirectX, en algunos lugares la API C# de Unity) escriben `p·M` e invierten el orden de todos los productos.'),
    ],
    example: {
      prompt: L('A cube is scaled by 2, rotated 90° about z, then moved by `(5, 0, 0)`. Where does its local corner `(1, 0, 0)` end up?', 'Un cubo se escala por 2, se rota 90° alrededor de z y luego se mueve `(5, 0, 0)`. ¿A dónde va su esquina local `(1, 0, 0)`?'),
      steps: [
        L('Scale: `(1, 0, 0) → (2, 0, 0)`.', 'Escala: `(1, 0, 0) → (2, 0, 0)`.'),
        L('Rotate 90° about z: `(x, y) → (−y, x)`, so `(2, 0, 0) → (0, 2, 0)`.', 'Rota 90° alrededor de z: `(x, y) → (−y, x)`, así `(2, 0, 0) → (0, 2, 0)`.'),
        L('Translate: `(0, 2, 0) + (5, 0, 0) = (5, 2, 0)`.', 'Traslada: `(0, 2, 0) + (5, 0, 0) = (5, 2, 0)`.'),
        L('One matrix does it all: `M = [[0, −2, 0, 5], [2, 0, 0, 0], [0, 0, 2, 0], [0, 0, 0, 1]]` and `M·(1, 0, 0, 1) = (5, 2, 0, 1)` ✓.', 'Una sola matriz lo hace todo: `M = [[0, −2, 0, 5], [2, 0, 0, 0], [0, 0, 2, 0], [0, 0, 0, 1]]` y `M·(1, 0, 0, 1) = (5, 2, 0, 1)` ✓.'),
      ],
      answer: L('`(5, 2, 0)`', '`(5, 2, 0)`'),
    },
    real: [
      L('Unity’s `Transform`, Unreal’s `FTransform` and three.js’s `Object3D` each store position, rotation and scale, and turn them into exactly this `T·R·S` matrix. Scene graphs multiply parent and child matrices: your VR hand’s world matrix is `rig · head-offset · controller-pose`.',
        'El `Transform` de Unity, el `FTransform` de Unreal y el `Object3D` de three.js guardan posición, rotación y escala, y las convierten exactamente en esta matriz `T·R·S`. Los grafos de escena multiplican matrices de padre e hijo: la matriz de mundo de tu mano en VR es `rig · desplazamiento-cabeza · pose-del-control`.'),
    ],
  },
},

// ─── 12 · Change of Basis & Coordinate Spaces ───────────────────────────────
{
  id: 'basis', color: '#E8C99A',
  tag:  L('Local · World · View Space', 'Espacio Local · Mundo · Vista'),
  name: L('Change of Basis', 'Cambio de Base'),
  graph() {
    const b1 = [2, 0.8], b2 = [-0.6, 1.5], P = ([a, b]) => [a * b1[0] + b * b2[0], a * b1[1] + b * b2[1]];
    const g = Graph({ x: [-3, 4], y: [-2.4, 4.6] });
    g.grid(1).axes();
    for (let k = -2; k <= 3; k++) {
      g.line(...P([k, -2]), ...P([k, 3]), { color: 2, thin: true, ghost: true, delay: 0.3 });
      g.line(...P([-2, k]), ...P([3, k]), { color: 2, thin: true, ghost: true, delay: 0.3 });
    }
    const p = P([1, 2]);
    g.line(0, 0, ...b1, { color: 1, dash: true, delay: 1 });
    g.line(...b1, ...p, { color: 3, dash: true, delay: 1.2 });
    g.arrow(0, 0, ...b1, { color: 1, delay: 0.5 });
    g.arrow(0, 0, ...b2, { color: 3, delay: 0.5 });
    g.dot(...p, { color: 1, r: 6 });
    g.text(...b1, 'b₁', { dx: 6, dy: 14, color: 1 });
    g.text(...b2, 'b₂', { dx: -18, color: 3 });
    g.text(...p, L('local (1, 2)', 'local (1, 2)'), { dx: 8, dy: -6, color: 1, size: 11 });
    g.text(...p, `world (${(p[0]).toFixed(1)}, ${(p[1]).toFixed(1)})`, { dx: 8, dy: 10, muted: true, size: 11 });
    return g.svg();
  },
  formulas: [
    { label: L('Local → World', 'Local → Mundo'), expr: 'p_world = B · p_local = x·b₁ + y·b₂ (+ z·b₃)',
      desc: L('B’s columns are the object’s axes written in world coordinates.', 'Las columnas de B son los ejes del objeto escritos en coordenadas de mundo.') },
    { label: L('World → Local', 'Mundo → Local'), expr: 'p_local = B⁻¹ · p_world',
      desc: L('Undo the basis. If the axes are orthonormal, B⁻¹ = Bᵀ — just dot products.', 'Deshaz la base. Si los ejes son ortonormales, B⁻¹ = Bᵀ — solo productos punto.') },
    { label: L('View Matrix', 'Matriz de Vista'), expr: 'V = (camera transform)⁻¹ ,  v = Rᵀ (p − c)',
      desc: L('Move the camera to the origin, then express the point on the camera’s right/up/back axes.', 'Lleva la cámara al origen y expresa el punto en los ejes derecha/arriba/atrás de la cámara.') },
    { label: L('Look-At', 'Mirar Hacia (Look-At)'), expr: 'f = norm(target − eye),  r = norm(f × up),  u = r × f',
      desc: L('Builds a camera basis from a position, a target and a rough “up”.', 'Construye una base de cámara a partir de una posición, un objetivo y un “arriba” aproximado.') },
  ],
  deep: {
    idea: [
      L('The same point has different coordinates depending on <b>who is measuring</b>. Your hand is at (0.3, −0.2, −0.4) relative to your head, but somewhere completely different in world coordinates. A basis is a set of axes; changing basis converts coordinates between them.',
        'El mismo punto tiene coordenadas diferentes según <b>quién lo mida</b>. Tu mano está en (0.3, −0.2, −0.4) respecto a tu cabeza, pero en un lugar totalmente distinto en coordenadas de mundo. Una base es un conjunto de ejes; cambiar de base convierte coordenadas entre ellos.'),
      L('In the graph the gold point is “1 step along b₁, 2 steps along b₂” in the skewed blue grid — and something else entirely in the normal grid.', 'En la gráfica el punto dorado es “1 paso por b₁, 2 pasos por b₂” en la cuadrícula azul inclinada — y algo completamente distinto en la cuadrícula normal.'),
    ],
    why: [
      L('Local coordinates are weights on the basis vectors, so `p_world = x·b₁ + y·b₂ = B·(x, y)`. Going back means solving `B·c = p`, i.e. `c = B⁻¹p`. When the basis is orthonormal (camera and rotation axes always are), `B⁻¹ = Bᵀ` and each local coordinate is simply a dot product with one axis.',
        'Las coordenadas locales son pesos sobre los vectores base, así que `p_mundo = x·b₁ + y·b₂ = B·(x, y)`. Regresar significa resolver `B·c = p`, es decir `c = B⁻¹p`. Cuando la base es ortonormal (los ejes de cámara y rotación siempre lo son), `B⁻¹ = Bᵀ` y cada coordenada local es simplemente un producto punto con un eje.'),
    ],
    mistakes: [
      L('Using B instead of B⁻¹ (or vice versa) — the object moves the wrong way.', 'Usar B en lugar de B⁻¹ (o al revés) — el objeto se mueve en sentido contrario.'),
      L('Forgetting to subtract the origin (camera position) before projecting onto the axes.', 'Olvidar restar el origen (la posición de la cámara) antes de proyectar sobre los ejes.'),
      L('In look-at, choosing “up” parallel to the forward direction → the cross product is 0 (camera looking straight up).', 'En look-at, elegir “arriba” paralelo a la dirección hacia adelante → el producto cruz es 0 (cámara mirando directo hacia arriba).'),
    ],
    example: {
      prompt: L('A camera at `c = (0, 2, 5)` uses the standard axes (right = x, up = y, back = z). Where is `p = (1, 2, 0)` in view space?', 'Una cámara en `c = (0, 2, 5)` usa los ejes estándar (derecha = x, arriba = y, atrás = z). ¿Dónde está `p = (1, 2, 0)` en el espacio de vista?'),
      steps: [
        L('`p − c = (1, 0, −5)`.', '`p − c = (1, 0, −5)`.'),
        L('Axes are the identity, so `v = (1, 0, −5)`.', 'Los ejes son la identidad, así que `v = (1, 0, −5)`.'),
        L('Negative z in view space means “in front of the camera” (OpenGL convention): the point is 5 units ahead and 1 unit to the right.', 'Una z negativa en el espacio de vista significa “frente a la cámara” (convención OpenGL): el punto está 5 unidades al frente y 1 a la derecha.'),
      ],
      answer: L('`(1, 0, −5)` — ahead and slightly right', '`(1, 0, −5)` — al frente y un poco a la derecha'),
    },
    real: [
      L('AR is mostly change of basis: the phone camera’s pose defines a basis, detected planes have their own, and virtual objects are anchored by converting between them every frame. In VR, each eye’s view matrix is the head pose inverted, offset by half the distance between your pupils.',
        'La AR es casi todo cambio de base: la pose de la cámara del teléfono define una base, los planos detectados tienen la suya, y los objetos virtuales se anclan convirtiendo entre ellas en cada cuadro. En VR, la matriz de vista de cada ojo es la pose de la cabeza invertida, desplazada media distancia entre tus pupilas.'),
    ],
  },
},

// ─── 13 · Orthogonality & Gram–Schmidt ──────────────────────────────────────
{
  id: 'orthogonal', color: '#ADC6E5',
  tag:  L('Perpendicular Bases · QᵀQ = I', 'Bases Perpendiculares · QᵀQ = I'),
  name: L('Orthogonality & Gram–Schmidt', 'Ortogonalidad y Gram–Schmidt'),
  graph() {
    const v1 = [4, 1], v2 = [1.6, 3], s = (v1[0] * v2[0] + v1[1] * v2[1]) / (v1[0] ** 2 + v1[1] ** 2), pr = v1.map(x => x * s), u2 = v2.map((x, i) => x - pr[i]);
    const g = Graph({ x: [-1.4, 4.6], y: [-0.8, 4.2] });
    g.grid(1).axes({ ticks: 1 });
    g.line(...pr, ...v2, { dash: true, color: 3, delay: 1 });
    g.arrow(0, 0, ...pr, { color: 3, thin: true, delay: 1 });
    g.arrow(0, 0, ...v1, { color: 1 });
    g.arrow(0, 0, ...v2, { color: 2, delay: 0.3 });
    g.arrow(0, 0, ...u2, { color: 3, delay: 1.4 });
    const k = 0.25, n1 = v1.map(x => x / Math.hypot(...v1) * k), n2 = u2.map(x => x / Math.hypot(...u2) * k);
    g.poly([n1, [n1[0] + n2[0], n1[1] + n2[1]], n2], { color: 3, thin: true, delay: 1.6 });
    g.text(...v1, 'v₁ = u₁', { dx: -20, dy: 18, color: 1, size: 11 });
    g.text(...v2, 'v₂', { dx: 6, color: 2 });
    g.text(...u2, 'u₂', { dx: -18, color: 3 });
    g.text(-1.3, 3.9, 'u₂ = v₂ − proj_u₁(v₂)', { color: 3, size: 11 });
    return g.svg();
  },
  formulas: [
    { label: L('Orthogonal Vectors', 'Vectores Ortogonales'), expr: 'u · v = 0',
      desc: L('Perpendicular. An orthonormal set is perpendicular AND unit length.', 'Perpendiculares. Un conjunto ortonormal es perpendicular Y de longitud unitaria.') },
    { label: L('Orthogonal Matrix', 'Matriz Ortogonal'), expr: 'QᵀQ = I  ⇔  Q⁻¹ = Qᵀ',
      desc: L('Columns are orthonormal. Preserves lengths and angles: rotations and reflections.', 'Columnas ortonormales. Conserva longitudes y ángulos: rotaciones y reflexiones.') },
    { label: L('Gram–Schmidt', 'Gram–Schmidt'), expr: 'uₖ = vₖ − Σⱼ<ₖ (vₖ·uⱼ / uⱼ·uⱼ) uⱼ',
      desc: L('Subtract from each new vector its shadows on the previous ones. Normalize at the end.', 'Resta a cada vector nuevo sus sombras sobre los anteriores. Normaliza al final.') },
    { label: L('Re-orthonormalize', 'Re-ortonormalizar'), expr: 'R ← GramSchmidt(R)',
      desc: L('Floating-point drift makes rotation matrices slowly skew; engines periodically clean them up this way.', 'El error de punto flotante hace que las matrices de rotación se deformen poco a poco; los motores las limpian así periódicamente.') },
  ],
  deep: {
    idea: [
      L('Perpendicular axes are the nicest possible coordinate system: coordinates are just dot products, inverses are just transposes, and nothing gets stretched. <b>Gram–Schmidt</b> turns any set of independent vectors into such a perpendicular set, one vector at a time.',
        'Los ejes perpendiculares son el mejor sistema de coordenadas posible: las coordenadas son solo productos punto, las inversas son solo transpuestas y nada se estira. <b>Gram–Schmidt</b> convierte cualquier conjunto de vectores independientes en un conjunto perpendicular, un vector a la vez.'),
    ],
    why: [
      L('In the graph, v₂ is split into a part along u₁ (its projection, pink) and the rest. Subtracting the projection leaves u₂, which has no component along u₁ — so it is perpendicular. For a third vector, subtract its shadows on both u₁ and u₂.',
        'En la gráfica, v₂ se divide en una parte en la dirección de u₁ (su proyección, rosa) y el resto. Al restar la proyección queda u₂, que no tiene componente en la dirección de u₁ — así que es perpendicular. Para un tercer vector, resta sus sombras sobre u₁ y u₂.'),
    ],
    mistakes: [
      L('Projecting onto the original v’s instead of the already-orthogonalized u’s.', 'Proyectar sobre los v originales en lugar de los u ya ortogonalizados.'),
      L('Forgetting that orthogonal ≠ orthonormal; normalize if unit vectors are needed.', 'Olvidar que ortogonal ≠ ortonormal; normaliza si se necesitan vectores unitarios.'),
      L('Feeding in dependent vectors — the result is the zero vector (and dividing by its length crashes).', 'Usar vectores dependientes — el resultado es el vector cero (y dividir entre su longitud falla).'),
    ],
    example: {
      prompt: L('Orthogonalize `v₁ = (1, 1, 0)`, `v₂ = (1, 0, 1)`.', 'Ortogonaliza `v₁ = (1, 1, 0)`, `v₂ = (1, 0, 1)`.'),
      steps: [
        L('`u₁ = v₁ = (1, 1, 0)`.', '`u₁ = v₁ = (1, 1, 0)`.'),
        L('`v₂·u₁ = 1`, `u₁·u₁ = 2` → coefficient `1/2`.', '`v₂·u₁ = 1`, `u₁·u₁ = 2` → coeficiente `1/2`.'),
        L('`u₂ = (1, 0, 1) − ½(1, 1, 0) = (1/2, −1/2, 1)`.', '`u₂ = (1, 0, 1) − ½(1, 1, 0) = (1/2, −1/2, 1)`.'),
        L('Check: `u₂·u₁ = 1/2 − 1/2 + 0 = 0` ✓.', 'Comprueba: `u₂·u₁ = 1/2 − 1/2 + 0 = 0` ✓.'),
      ],
      answer: L('`u₁ = (1, 1, 0)`, `u₂ = (1/2, −1/2, 1)`', '`u₁ = (1, 1, 0)`, `u₂ = (1/2, −1/2, 1)`'),
    },
    real: [
      L('The look-at camera is Gram–Schmidt in disguise: forward is fixed, the rough “up” has its forward part removed. Normal mapping builds an orthonormal tangent/bitangent/normal (TBN) frame per vertex the same way, and VR runtimes re-orthonormalize poses to stop drift.',
        'La cámara look-at es Gram–Schmidt disfrazado: el frente queda fijo y al “arriba” aproximado se le quita su parte frontal. El normal mapping construye de la misma forma un marco ortonormal tangente/bitangente/normal (TBN) por vértice, y los runtimes de VR re-ortonormalizan las poses para evitar la deriva.'),
    ],
  },
},

// ─── 14 · Projection Matrices ───────────────────────────────────────────────
{
  id: 'projection', color: '#8FB8E8',
  tag:  L('Frustum · Perspective · NDC', 'Frustum · Perspectiva · NDC'),
  name: L('Projection Matrices', 'Matrices de Proyección'),
  graph() {
    const g = Graph({ x: [-0.6, 6.4], y: [-3.4, 3.4] });
    g.grid(1);
    const n = 1.2, f = 6, k = 0.5;
    g.poly([[n, -n * k], [f, -f * k], [f, f * k], [n, n * k]], { close: true, fill: true, color: 2, thin: true, delay: 0.3 });
    g.line(0, 0, f, f * k, { ghost: true }); g.line(0, 0, f, -f * k, { ghost: true });
    const P = [4.2, 1.5], q = [n, 1.5 * n / 4.2];
    g.line(0, 0, ...P, { color: 3, dash: true, delay: 1 });
    g.dot(...P, { color: 1, r: 6 }); g.dot(...q, { color: 3, r: 5 });
    g.dot(0, 0, { color: 1, r: 5, delay: 0.5 });
    g.text(0, 0, L('eye', 'ojo'), { dx: -6, dy: 18, color: 1, size: 11 });
    g.text(n, -n * k, 'near', { dy: 16, anchor: 'middle', muted: true, size: 11 });
    g.text(f, -f * k, 'far', { dx: -10, dy: 16, anchor: 'middle', muted: true, size: 11 });
    g.text(...P, 'P', { dx: 8, color: 1 });
    g.text(...q, "P'", { dx: -16, dy: -6, color: 3 });
    g.text(1.8, -3.1, L('depth (−z) →', 'profundidad (−z) →'), { muted: true, size: 11 });
    return g.svg();
  },
  formulas: [
    { label: L('Pinhole Projection', 'Proyección Estenopeica'), expr: "x' = d · x / (−z),   y' = d · y / (−z)",
      desc: L('Similar triangles: farther points are divided by more, so they look smaller.', 'Triángulos semejantes: los puntos más lejanos se dividen entre más, así que se ven más pequeños.') },
    { label: L('Perspective Matrix', 'Matriz de Perspectiva'), expr: 'P = [[f/a,0,0,0],[0,f,0,0],[0,0,A,B],[0,0,−1,0]]',
      desc: L('f = cot(fov/2), a = aspect, A = −(far+near)/(far−near), B = −2·far·near/(far−near).', 'f = cot(fov/2), a = aspecto, A = −(far+near)/(far−near), B = −2·far·near/(far−near).') },
    { label: L('Perspective Divide', 'División de Perspectiva'), expr: 'NDC = (x/w, y/w, z/w)',
      desc: L('The GPU divides by w = −z after the matrix. Visible points land in the cube [−1, 1]³.', 'La GPU divide entre w = −z después de la matriz. Los puntos visibles caen en el cubo [−1, 1]³.') },
    { label: L('Orthographic', 'Ortográfica'), expr: 'no divide: parallel lines stay parallel',
      desc: L('Used for 2D UI, shadow maps and CAD views. Its bottom row is (0, 0, 0, 1).', 'Se usa para interfaces 2D, mapas de sombras y vistas CAD. Su fila inferior es (0, 0, 0, 1).') },
  ],
  deep: {
    idea: [
      L('A screen is flat; the world is not. The projection matrix squeezes the visible region — a truncated pyramid called the <b>frustum</b> (blue) — into a cube, and then the GPU flattens it onto the screen. The key effect is that distant things shrink: P lands on the near plane at P′, closer to the center.',
        'Una pantalla es plana; el mundo no. La matriz de proyección comprime la región visible — una pirámide truncada llamada <b>frustum</b> (azul) — en un cubo, y luego la GPU la aplana en la pantalla. El efecto clave es que lo lejano se encoge: P cae en el plano cercano en P′, más cerca del centro.'),
    ],
    why: [
      L('Division cannot be done with a matrix — but the bottom row `(0, 0, −1, 0)` copies `−z` into w, and the GPU divides by w afterwards. The matrix sets up the division; hardware performs it. That is the main reason 3D graphics uses 4D homogeneous coordinates.',
        'La división no se puede hacer con una matriz — pero la fila inferior `(0, 0, −1, 0)` copia `−z` en w, y la GPU divide entre w después. La matriz prepara la división; el hardware la ejecuta. Esa es la razón principal por la que los gráficos 3D usan coordenadas homogéneas 4D.'),
      L('A and B are chosen so that the near plane maps to depth −1 and the far plane to +1.', 'A y B se eligen para que el plano cercano vaya a profundidad −1 y el lejano a +1.'),
    ],
    mistakes: [
      L('Setting near = 0: B becomes 0 and depth precision collapses (z-fighting). Keep near as large as you can.', 'Poner near = 0: B se vuelve 0 y la precisión de profundidad colapsa (z-fighting). Mantén near lo más grande posible.'),
      L('Forgetting the aspect ratio → everything looks stretched.', 'Olvidar la relación de aspecto → todo se ve estirado.'),
      L('Mixing conventions: OpenGL NDC depth is [−1, 1]; DirectX, Vulkan and Metal use [0, 1]; VR runtimes often use reversed-Z.', 'Mezclar convenciones: la profundidad NDC de OpenGL es [−1, 1]; DirectX, Vulkan y Metal usan [0, 1]; los runtimes de VR suelen usar Z invertida.'),
    ],
    example: {
      prompt: L('With fov 90°, aspect 1, near 1, far 3, where does the point `(1, 1, −2)` land in NDC?', 'Con fov 90°, aspecto 1, near 1, far 3, ¿dónde cae el punto `(1, 1, −2)` en NDC?'),
      steps: [
        L('`f = cot 45° = 1`, `A = −(3 + 1)/(3 − 1) = −2`, `B = −2·3·1/2 = −3`.', '`f = cot 45° = 1`, `A = −(3 + 1)/(3 − 1) = −2`, `B = −2·3·1/2 = −3`.'),
        L('Clip: `x = 1`, `y = 1`, `z = A·(−2) + B = 4 − 3 = 1`, `w = −(−2) = 2`.', 'Recorte: `x = 1`, `y = 1`, `z = A·(−2) + B = 4 − 3 = 1`, `w = −(−2) = 2`.'),
        L('Divide by w: `(1/2, 1/2, 1/2)` — inside [−1, 1]³, so it is visible, up and to the right.', 'Divide entre w: `(1/2, 1/2, 1/2)` — dentro de [−1, 1]³, así que es visible, arriba a la derecha.'),
      ],
      answer: L('`NDC = (0.5, 0.5, 0.5)`', '`NDC = (0.5, 0.5, 0.5)`'),
    },
    real: [
      L('VR headsets give each eye its own <b>asymmetric</b> projection matrix (the lenses are off-center), provided by OpenXR every frame. AR on phones builds the projection from the camera’s calibrated focal length so virtual objects line up with the real video feed.',
        'Los cascos de VR dan a cada ojo su propia matriz de proyección <b>asimétrica</b> (los lentes están descentrados), que OpenXR entrega en cada cuadro. La AR en teléfonos construye la proyección con la distancia focal calibrada de la cámara para que los objetos virtuales coincidan con el video real.'),
    ],
  },
},

// ─── 15 · Eigenvalues & Eigenvectors ────────────────────────────────────────
{
  id: 'eigen', color: '#9FD3D8',
  tag:  L('Directions a Matrix Only Stretches', 'Direcciones que una Matriz Solo Estira'),
  name: L('Eigenvalues & Eigenvectors', 'Valores y Vectores Propios'),
  graph() {
    const A = [[2, 1], [1, 2]], ap = ([x, y]) => [A[0][0] * x + A[0][1] * y, A[1][0] * x + A[1][1] * y];
    const g = Graph({ x: [-3.6, 3.6], y: [-3.6, 3.6] });
    g.grid(1).axes();
    g.fn(x => x, { dash: true, color: 1, delay: 0.2 }); g.fn(x => -x, { dash: true, color: 2, delay: 0.2 });
    g.param(Math.cos, Math.sin, 0, 2 * Math.PI, { ghost: true, delay: 0.1 });
    g.param(t => ap([Math.cos(t), Math.sin(t)])[0], t => ap([Math.cos(t), Math.sin(t)])[1], 0, 2 * Math.PI, { color: 3, thin: true, delay: 0.5 });
    const e1 = [Math.SQRT1_2, Math.SQRT1_2], e2 = [Math.SQRT1_2, -Math.SQRT1_2], w = [1, 0];
    g.arrow(0, 0, ...ap(e1), { color: 1, delay: 1 }); g.arrow(0, 0, ...e1, { color: 1, thin: true, delay: 0.8 });
    g.arrow(0, 0, ...ap(e2), { color: 2, delay: 1 });
    g.arrow(0, 0, ...w, { ghost: true, delay: 1.2 }); g.arrow(0, 0, ...ap(w), { ghost: true, delay: 1.3 });
    g.text(...ap(e1), 'λ₁ = 3', { dx: 6, color: 1 });
    g.text(...ap(e2), 'λ₂ = 1', { dx: 6, dy: 12, color: 2 });
    g.text(-3.5, 3.3, 'A = [[2, 1], [1, 2]]', { color: 3, size: 11 });
    return g.svg();
  },
  formulas: [
    { label: L('Definition', 'Definición'), expr: 'A v = λ v   (v ≠ 0)',
      desc: L('v keeps its direction; A only scales it by λ (flips it if λ < 0).', 'v conserva su dirección; A solo lo escala por λ (lo voltea si λ < 0).') },
    { label: L('Characteristic Equation', 'Ecuación Característica'), expr: 'det(A − λI) = 0',
      desc: L('For 2×2: λ² − (trace)λ + det = 0. Its roots are the eigenvalues.', 'Para 2×2: λ² − (traza)λ + det = 0. Sus raíces son los valores propios.') },
    { label: L('Eigenvectors', 'Vectores Propios'), expr: '(A − λI) v = 0',
      desc: L('For each λ, solve this homogeneous system. Any nonzero multiple of v also works.', 'Para cada λ, resuelve este sistema homogéneo. Cualquier múltiplo no nulo de v también sirve.') },
    { label: L('Quick Checks', 'Comprobaciones Rápidas'), expr: 'λ₁ + λ₂ = trace,   λ₁ · λ₂ = det',
      desc: L('Symmetric matrices always have real eigenvalues and perpendicular eigenvectors.', 'Las matrices simétricas siempre tienen valores propios reales y vectores propios perpendiculares.') },
  ],
  deep: {
    idea: [
      L('Most vectors get both stretched and turned by a matrix (the grey arrow). <b>Eigenvectors</b> are the special directions that only get stretched — they stay on their own line (dashed). The stretch factor is the <b>eigenvalue</b>. They reveal a transform’s “natural axes”: the unit circle becomes an ellipse whose axes are exactly the eigenvectors.',
        'La mayoría de los vectores se estiran y se giran con una matriz (la flecha gris). Los <b>vectores propios</b> son las direcciones especiales que solo se estiran — se quedan en su propia recta (discontinua). El factor de estiramiento es el <b>valor propio</b>. Revelan los “ejes naturales” de una transformación: el círculo unitario se vuelve una elipse cuyos ejes son exactamente los vectores propios.'),
    ],
    why: [
      L('`Av = λv` rewrites as `(A − λI)v = 0`. A nonzero v can only satisfy this if `A − λI` squashes some direction to zero — that is, if `det(A − λI) = 0`. Solving that polynomial gives every λ.',
        '`Av = λv` se reescribe como `(A − λI)v = 0`. Un v no nulo solo cumple esto si `A − λI` aplasta alguna dirección a cero — es decir, si `det(A − λI) = 0`. Resolver ese polinomio da cada λ.'),
    ],
    mistakes: [
      L('Accepting v = 0 as an eigenvector — it is excluded by definition.', 'Aceptar v = 0 como vector propio — está excluido por definición.'),
      L('Subtracting λ from every entry instead of only the diagonal (`A − λI`).', 'Restar λ a todas las entradas en lugar de solo a la diagonal (`A − λI`).'),
      L('Expecting real eigenvalues for every matrix — a 2D rotation by 90° has none (λ = ±i).', 'Esperar valores propios reales para toda matriz — una rotación 2D de 90° no tiene (λ = ±i).'),
    ],
    example: {
      prompt: L('Find the eigenvalues and eigenvectors of `A = [[2, 1], [1, 2]]`.', 'Halla los valores y vectores propios de `A = [[2, 1], [1, 2]]`.'),
      steps: [
        L('`trace = 4`, `det = 3` → `λ² − 4λ + 3 = 0` → `(λ − 3)(λ − 1) = 0`.', '`traza = 4`, `det = 3` → `λ² − 4λ + 3 = 0` → `(λ − 3)(λ − 1) = 0`.'),
        L('`λ = 3`: `A − 3I = [[−1, 1], [1, −1]]` → `x = y` → `v₁ = (1, 1)`.', '`λ = 3`: `A − 3I = [[−1, 1], [1, −1]]` → `x = y` → `v₁ = (1, 1)`.'),
        L('`λ = 1`: `A − I = [[1, 1], [1, 1]]` → `x = −y` → `v₂ = (1, −1)`.', '`λ = 1`: `A − I = [[1, 1], [1, 1]]` → `x = −y` → `v₂ = (1, −1)`.'),
        L('A stretches the diagonal by 3 and leaves the anti-diagonal alone — exactly the ellipse in the graph.', 'A estira la diagonal por 3 y deja igual la antidiagonal — justo la elipse de la gráfica.'),
      ],
      answer: L('`λ = 3` with `(1, 1)`, `λ = 1` with `(1, −1)`', '`λ = 3` con `(1, 1)`, `λ = 1` con `(1, −1)`'),
    },
    real: [
      L('The axis of any 3D rotation is its eigenvector with λ = 1 — that is how rotation matrices are converted into axis-angle and quaternions. Principal Component Analysis (eigenvectors of a covariance matrix) fits oriented bounding boxes around meshes and finds the main direction of a hand gesture; physics engines use eigenvectors of the inertia tensor.',
        'El eje de cualquier rotación 3D es su vector propio con λ = 1 — así se convierten las matrices de rotación en eje-ángulo y en cuaterniones. El Análisis de Componentes Principales (vectores propios de una matriz de covarianza) ajusta cajas envolventes orientadas a las mallas y halla la dirección principal de un gesto de la mano; los motores de física usan los vectores propios del tensor de inercia.'),
    ],
  },
},

// ─── 16 · Quaternions ───────────────────────────────────────────────────────
{
  id: 'quaternion', color: '#CBD8E8',
  tag:  L('Rotation Without Gimbal Lock', 'Rotación sin Bloqueo de Cardán'),
  name: L('Quaternions', 'Cuaterniones'),
  graph() {
    const g = Graph({ x: [-3, 3.2], y: [-2.6, 3.6] });
    axes3(g, 2.4);
    const a = [0.35, 1, 0.25], na = Math.hypot(...a), u = a.map(x => x / na);
    const rot = (v, t) => {   // Rodrigues
      const c = Math.cos(t), s = Math.sin(t), d = u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
      const cr = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
      return v.map((x, i) => x * c + cr[i] * s + u[i] * d * (1 - c));
    };
    const v = [2, 0.6, 0.3], th = 1.9;
    const circ = []; for (let k = 0; k <= 60; k++) circ.push(ISO(rot(v, th * k / 60)));
    arrow3(g, [0, 0, 0], u.map(x => x * 2.6), { color: 3 });
    g.poly(circ, { color: 2, thin: true, delay: 0.8 });
    arrow3(g, [0, 0, 0], v, { color: 1, delay: 0.4 });
    arrow3(g, [0, 0, 0], rot(v, th), { color: 2, delay: 1.2 });
    g.text(...ISO(u.map(x => x * 2.6)), L('axis a', 'eje a'), { dx: 8, color: 3 });
    g.text(...ISO(v), 'v', { dx: 8, dy: 10, color: 1 });
    g.text(...ISO(rot(v, th)), "v'", { dx: -16, color: 2 });
    g.text(-2.9, -2.35, 'q = (cos θ/2, sin θ/2 · a)', { color: 1, size: 11 });
    return g.svg();
  },
  formulas: [
    { label: L('Unit Quaternion', 'Cuaternión Unitario'), expr: 'q = (w, x, y, z) = (cos θ/2, sin θ/2 · a)',
      desc: L('A rotation of θ about the unit axis a, packed into 4 numbers with w² + x² + y² + z² = 1.', 'Una rotación de θ alrededor del eje unitario a, empaquetada en 4 números con w² + x² + y² + z² = 1.') },
    { label: L('Hamilton Product', 'Producto de Hamilton'), expr: 'i² = j² = k² = ijk = −1',
      desc: L('q₁q₂ = “rotate by q₂, then by q₁”. Not commutative, like matrices.', 'q₁q₂ = “rota con q₂ y luego con q₁”. No conmutativo, como las matrices.') },
    { label: L('Rotating a Vector', 'Rotar un Vector'), expr: "v' = q v q*,   q* = (w, −x, −y, −z)",
      desc: L('Treat v as (0, v). Shortcut: v′ = v + sin θ (a × v) + (1 − cos θ) a × (a × v).', 'Trata v como (0, v). Atajo: v′ = v + sen θ (a × v) + (1 − cos θ) a × (a × v).') },
    { label: L('Smooth Interpolation', 'Interpolación Suave'), expr: 'slerp(q₀, q₁, t)',
      desc: L('Turns at constant speed along the shortest arc — used for animation blending and head-pose prediction.', 'Gira a velocidad constante por el arco más corto — se usa para mezclar animaciones y predecir la pose de la cabeza.') },
  ],
  deep: {
    idea: [
      L('A rotation matrix uses 9 numbers to store something with only 3 degrees of freedom, and Euler angles suffer gimbal lock. A <b>quaternion</b> stores an orientation in 4 numbers: an axis and (half) an angle. Combining rotations is one quaternion product, interpolating between them is smooth, and gimbal lock cannot happen.',
        'Una matriz de rotación usa 9 números para guardar algo con solo 3 grados de libertad, y los ángulos de Euler sufren bloqueo de cardán. Un <b>cuaternión</b> guarda una orientación en 4 números: un eje y (la mitad de) un ángulo. Combinar rotaciones es un producto de cuaterniones, interpolar entre ellas es suave y el bloqueo de cardán no puede ocurrir.'),
    ],
    why: [
      L('Why half angles? In `q v q*`, the vector gets multiplied by q on <i>both</i> sides, so it turns by θ/2 twice — a full θ. A side effect: q and −q give the same rotation (the “double cover”), so interpolation should flip one when their dot product is negative to take the short way around.',
        '¿Por qué medio ángulo? En `q v q*`, el vector se multiplica por q en <i>ambos</i> lados, así que gira θ/2 dos veces — un θ completo. Un efecto secundario: q y −q dan la misma rotación (el “doble recubrimiento”), así que al interpolar hay que voltear uno cuando su producto punto es negativo para ir por el camino corto.'),
    ],
    mistakes: [
      L('Forgetting the half angle: a 90° turn is `(cos 45°, sin 45°·a)`, not `(cos 90°, sin 90°·a)`.', 'Olvidar el medio ángulo: un giro de 90° es `(cos 45°, sen 45°·a)`, no `(cos 90°, sen 90°·a)`.'),
      L('Using a non-unit axis or letting q drift from unit length — renormalize after many products.', 'Usar un eje no unitario o dejar que q se aleje de la longitud 1 — renormaliza después de muchos productos.'),
      L('Component order: some APIs write (x, y, z, w) — Unity and three.js — others (w, x, y, z).', 'Orden de componentes: algunas API escriben (x, y, z, w) — Unity y three.js — otras (w, x, y, z).'),
      L('Multiplying in the wrong order: `q₂q₁` means “q₁ first”.', 'Multiplicar en el orden equivocado: `q₂q₁` significa “primero q₁”.'),
    ],
    example: {
      prompt: L('Rotate `v = (1, 0, 0)` by 90° about the y-axis using quaternions.', 'Rota `v = (1, 0, 0)` 90° alrededor del eje y con cuaterniones.'),
      steps: [
        L('`q = (cos 45°, 0, sin 45°, 0) ≈ (0.707, 0, 0.707, 0)`.', '`q = (cos 45°, 0, sen 45°, 0) ≈ (0.707, 0, 0.707, 0)`.'),
        L('Shortcut with `a = (0, 1, 0)`: `a × v = (0·0 − 0·0, 0·1 − 0·0, 0·0 − 1·1) = (0, 0, −1)`.', 'Atajo con `a = (0, 1, 0)`: `a × v = (0·0 − 0·0, 0·1 − 0·0, 0·0 − 1·1) = (0, 0, −1)`.'),
        L('`a × (a × v) = (−1, 0, 0)`; `sin 90° = 1`, `1 − cos 90° = 1`.', '`a × (a × v) = (−1, 0, 0)`; `sen 90° = 1`, `1 − cos 90° = 1`.'),
        L('`v′ = (1, 0, 0) + (0, 0, −1) + (−1, 0, 0) = (0, 0, −1)` — the same answer as the Ry(90°) matrix ✓.', '`v′ = (1, 0, 0) + (0, 0, −1) + (−1, 0, 0) = (0, 0, −1)` — la misma respuesta que la matriz Ry(90°) ✓.'),
      ],
      answer: L('`(0, 0, −1)`', '`(0, 0, −1)`'),
    },
    real: [
      L('OpenXR, Unity (`Quaternion`), Unreal (`FQuat`) and three.js (`Quaternion`) all store headset and controller orientations as quaternions. Predicting where your head will be 20 ms from now, blending animations, and smoothing a shaky AR anchor all use slerp.',
        'OpenXR, Unity (`Quaternion`), Unreal (`FQuat`) y three.js (`Quaternion`) guardan la orientación del casco y los controles como cuaterniones. Predecir dónde estará tu cabeza dentro de 20 ms, mezclar animaciones y suavizar un ancla de AR temblorosa usan slerp.'),
    ],
  },
},

];

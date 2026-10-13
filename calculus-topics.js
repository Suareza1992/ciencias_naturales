// ═══════════════════════════════════════════════════════════════════════════
// Calculus topics — pure data, rendered by shared/explorer.js.
// Same shape as precalculus-topics.js (see the header comment there).
// L(en, es) is shorthand for a bilingual value. `backticks` = inline math.
// Integral limits use HTML: ∫<sub>a</sub><sup>b</sup>.
// ═══════════════════════════════════════════════════════════════════════════

const L = (en, es) => ({ en, es });

const CALC_TOPICS = [

// ─── 01 · Limits ────────────────────────────────────────────────────────────
{
  id: 'limits', color: '#1C1DAB',
  tag:  L('Approaching · The Foundation', 'Acercarse · La Base'),
  name: L('Limits', 'Límites'),
  graph() {
    const f = x => x * x + x + 1;           // (x³ − 1)/(x − 1) with the hole removed
    const g = Graph({ x: [-2.2, 2.6], y: [-0.6, 6.4] });
    g.grid(1).axes({ ticks: 1 });
    g.hline(3, { color: 3, delay: 0.3 });
    g.vline(1, { ghost: true, delay: 0.3 });
    g.fn(f, { color: 1 });
    [0.3, 0.6, 0.85].forEach((x, i) => g.dot(x, f(x), { color: 2, r: 3.5, delay: 1.3 + i * 0.25 }));
    [1.7, 1.4, 1.15].forEach((x, i) => g.dot(x, f(x), { color: 3, r: 3.5, delay: 1.3 + i * 0.25 }));
    g.dot(1, 3, { color: 1, hollow: true, r: 5.5, delay: 2.2 });
    g.text(-2.05, 5.9, 'f(x) = (x³ − 1)/(x − 1)', { color: 1, size: 11 });
    g.text(-2.05, 3, 'L = 3', { dy: -6, color: 3 });
    g.text(1, 3, L('hole', 'hueco'), { dx: 10, dy: 16, color: 1, size: 10 });
    return g.svg();
  },
  formulas: [
    { label: L('The Limit', 'El Límite'), expr: 'lim<sub>x→a</sub> f(x) = L',
      desc: L('As x gets closer and closer to a (from both sides), f(x) gets closer and closer to L. What happens AT a does not matter.',
              'Cuando x se acerca cada vez más a a (por ambos lados), f(x) se acerca cada vez más a L. Lo que pasa EN a no importa.') },
    { label: L('One-Sided Limits', 'Límites Laterales'), expr: 'lim<sub>x→a⁻</sub> f = lim<sub>x→a⁺</sub> f = L  ⇔  lim<sub>x→a</sub> f = L',
      desc: L('The limit exists only if the left and right approaches agree.', 'El límite existe solo si los acercamientos por la izquierda y por la derecha coinciden.') },
    { label: L('Limit Laws', 'Leyes de Límites'), expr: 'lim(f ± g) = lim f ± lim g,   lim(f·g) = lim f · lim g',
      desc: L('Limits pass through +, −, ×, ÷ (nonzero denominator) and powers. For polynomials, just substitute.',
              'Los límites pasan a través de +, −, ×, ÷ (denominador no nulo) y potencias. Para polinomios, solo sustituye.') },
    { label: L('Two Special Limits', 'Dos Límites Especiales'), expr: 'lim<sub>x→0</sub> sin x / x = 1     lim<sub>x→∞</sub> (1 + 1/x)ˣ = e',
      desc: L('Both show up constantly: the first gives the derivative of sine, the second defines e.',
              'Ambos aparecen siempre: el primero da la derivada del seno, el segundo define e.') },
  ],
  deep: {
    idea: [
      L('A limit asks where a function is <b>heading</b>, not where it <b>is</b>. The function on the left, `(x³ − 1)/(x − 1)`, is undefined at x = 1 (it would be 0/0). But the blue points from the left and the pink points from the right are all closing in on the height 3. So the limit is 3, even though f(1) does not exist.',
        'Un límite pregunta hacia dónde <b>va</b> una función, no dónde <b>está</b>. La función de la izquierda, `(x³ − 1)/(x − 1)`, no está definida en x = 1 (sería 0/0). Pero los puntos azules por la izquierda y los rosados por la derecha se acercan todos a la altura 3. Así que el límite es 3, aunque f(1) no exista.'),
      L('Everything in Calculus is built on this idea: derivatives are limits of slopes, integrals are limits of sums.',
        'Todo en Cálculo se construye sobre esta idea: las derivadas son límites de pendientes, las integrales son límites de sumas.'),
    ],
    why: [
      L('<b>The precise version (ε–δ):</b> “`lim f(x) = L`” means: for any tolerance `ε > 0` you choose, I can find a distance `δ > 0` so that whenever `0 < |x − a| < δ`, we get `|f(x) − L| < ε`. In words: you can force f(x) as close to L as you like by taking x close enough to a.',
        '<b>La versión precisa (ε–δ):</b> “`lim f(x) = L`” significa: para cualquier tolerancia `ε > 0` que elijas, puedo hallar una distancia `δ > 0` tal que cuando `0 < |x − a| < δ`, se cumple `|f(x) − L| < ε`. En palabras: puedes hacer que f(x) esté tan cerca de L como quieras tomando x suficientemente cerca de a.'),
      L('<b>Why 0/0 is not an answer:</b> it is a signal that the top and bottom share a factor that is hiding the real behavior. Factor, cancel, or rationalize to reveal it.',
        '<b>Por qué 0/0 no es una respuesta:</b> es una señal de que arriba y abajo comparten un factor que esconde el comportamiento real. Factoriza, cancela o racionaliza para revelarlo.'),
    ],
    mistakes: [
      L('Concluding a limit is 0 or “undefined” because substitution gives 0/0. It is <i>indeterminate</i> — more work is needed.',
        'Concluir que un límite es 0 o “indefinido” porque la sustitución da 0/0. Es <i>indeterminado</i> — hace falta más trabajo.'),
      L('Thinking `lim f(x)` must equal `f(a)`. That is only true for continuous functions (next topic).',
        'Pensar que `lim f(x)` tiene que ser igual a `f(a)`. Eso solo es cierto para funciones continuas (siguiente tema).'),
      L('Writing “= ∞” as if it were a value. A limit of ∞ means the function grows without bound — the limit does not exist as a number.',
        'Escribir “= ∞” como si fuera un valor. Un límite de ∞ significa que la función crece sin cota — el límite no existe como número.'),
    ],
    example: {
      prompt: L('Evaluate `lim(x→0) (√(x + 4) − 2) / x`.', 'Evalúa `lim(x→0) (√(x + 4) − 2) / x`.'),
      steps: [
        L('Substitute: `(√4 − 2)/0 = 0/0`. Indeterminate — keep going.', 'Sustituye: `(√4 − 2)/0 = 0/0`. Indeterminado — sigue.'),
        L('Multiply top and bottom by the conjugate `√(x + 4) + 2`.', 'Multiplica arriba y abajo por el conjugado `√(x + 4) + 2`.'),
        L('Top becomes `(x + 4) − 4 = x`, so the expression is `x / (x(√(x + 4) + 2))`.', 'Arriba queda `(x + 4) − 4 = x`, así que la expresión es `x / (x(√(x + 4) + 2))`.'),
        L('Cancel x (allowed because x ≠ 0 while approaching): `1/(√(x + 4) + 2)`. Now substitute: `1/(2 + 2) = 1/4`.',
          'Cancela x (válido porque x ≠ 0 mientras se acerca): `1/(√(x + 4) + 2)`. Ahora sustituye: `1/(2 + 2) = 1/4`.'),
      ],
      answer: L('`1/4`', '`1/4`'),
    },
    real: [
      L('Your speedometer shows a limit: distance over time for a time interval shrinking toward zero. Engineers use limits at infinity to describe long-run behavior (a circuit settling to a steady current), and computer scientists use them to compare how algorithms scale.',
        'El velocímetro muestra un límite: distancia entre tiempo para un intervalo que se reduce hacia cero. Los ingenieros usan límites al infinito para describir el comportamiento a largo plazo (un circuito que se estabiliza en una corriente constante), y los informáticos los usan para comparar cómo escalan los algoritmos.'),
    ],
  },
  exercises: [
    { q: L('Find lim(x→2) (3x² − 1).', 'Halla lim(x→2) (3x² − 1).'), answer: 11,
      hint: L('Polynomial → substitute: 3·4 − 1.', 'Polinomio → sustituye: 3·4 − 1.') },
    { q: L('Find lim(x→4) (x² − 16)/(x − 4).', 'Halla lim(x→4) (x² − 16)/(x − 4).'), answer: 8,
      hint: L('Factor: (x − 4)(x + 4)/(x − 4) = x + 4.', 'Factoriza: (x − 4)(x + 4)/(x − 4) = x + 4.') },
    { q: L('Find lim(x→∞) (5x² + 3)/(2x² − x).', 'Halla lim(x→∞) (5x² + 3)/(2x² − x).'), answer: 2.5,
      hint: L('Divide everything by x²: the limit is 5/2.', 'Divide todo entre x²: el límite es 5/2.') },
  ],
},

// ─── 02 · Continuity ────────────────────────────────────────────────────────
{
  id: 'continuity', color: '#2E4FC4',
  tag:  L('No Breaks · Intermediate Values', 'Sin Cortes · Valores Intermedios'),
  name: L('Continuity', 'Continuidad'),
  graph() {
    const left  = x => 1.6 + Math.sin(1.2 * x);
    const right = x => 0.6 + 0.35 * (x - 1) ** 2;
    const g = Graph({ x: [-3.6, 3.6], y: [-0.6, 4] });
    g.grid(1).axes({ ticks: 1 });
    g.fn(left, { from: -3.6, to: 1, color: 1 });
    g.fn(right, { from: 1, to: 3.6, color: 2, delay: 0.5 });
    g.dot(-1.5, left(-1.5), { color: 1, hollow: true, r: 5 }).dot(-1.5, 3.5, { color: 1 });
    g.dot(1, left(1), { color: 1, hollow: true, r: 5 }).dot(1, right(1), { color: 2 });
    g.text(-1.5, 3.5, L('removable', 'removible'), { dx: 10, dy: 4, color: 1, size: 11 });
    g.text(1, left(1), L('jump', 'salto'), { dx: 10, dy: 4, color: 2, size: 11 });
    return g.svg();
  },
  formulas: [
    { label: L('Definition', 'Definición'), expr: 'lim<sub>x→a</sub> f(x) = f(a)',
      desc: L('Three conditions: f(a) exists, the limit exists, and they are equal. Informally: no lifting the pencil.',
              'Tres condiciones: f(a) existe, el límite existe y son iguales. Informalmente: sin levantar el lápiz.') },
    { label: L('Types of Discontinuity', 'Tipos de Discontinuidad'), expr: 'removable · jump · infinite',
      desc: L('Removable: a hole (limit exists). Jump: left and right limits differ. Infinite: a vertical asymptote.',
              'Removible: un hueco (el límite existe). Salto: los límites laterales difieren. Infinita: una asíntota vertical.') },
    { label: L('Intermediate Value Theorem', 'Teorema del Valor Intermedio'), expr: 'f(a) < N < f(b)  ⇒  ∃ c ∈ (a, b): f(c) = N',
      desc: L('If f is continuous on [a, b], it hits every value between f(a) and f(b) at least once.',
              'Si f es continua en [a, b], alcanza todo valor entre f(a) y f(b) al menos una vez.') },
    { label: L('Continuous Families', 'Familias Continuas'), expr: 'polynomials, eˣ, sin, cos: everywhere',
      desc: L('Rational, log, √ and tan are continuous on their domains. Sums, products and compositions of continuous functions stay continuous.',
              'Racionales, log, √ y tan son continuas en su dominio. Sumas, productos y composiciones de funciones continuas siguen siendo continuas.') },
  ],
  deep: {
    idea: [
      L('A function is <b>continuous</b> when its graph has no breaks — you can draw it without lifting your pencil. Precisely, at each point the value the function is <i>heading toward</i> (the limit) equals the value it <i>actually has</i>.',
        'Una función es <b>continua</b> cuando su gráfica no tiene cortes — se puede dibujar sin levantar el lápiz. Con precisión: en cada punto, el valor al que la función <i>se dirige</i> (el límite) es igual al valor que <i>realmente tiene</i>.'),
      L('The graph shows the two classic failures. At x = −1.5 the curve is heading to one height but the dot sits somewhere else (removable — redefine one point and it is fixed). At x = 1 the left and right pieces do not meet (jump — no single fix).',
        'La gráfica muestra las dos fallas clásicas. En x = −1.5 la curva va hacia una altura pero el punto está en otro lugar (removible — redefine un punto y se arregla). En x = 1 las piezas izquierda y derecha no se encuentran (salto — no hay un solo arreglo).'),
    ],
    why: [
      L('<b>IVT intuition:</b> if you are below a horizontal line at the start and above it at the end, and you never teleport (continuity), you must have crossed the line somewhere. That is all the theorem says — but it guarantees solutions exist.',
        '<b>Intuición del TVI:</b> si al principio estás debajo de una recta horizontal y al final encima, y nunca te teletransportas (continuidad), tuviste que cruzar la recta en algún lugar. Eso es todo lo que dice el teorema — pero garantiza que existen soluciones.'),
      L('<b>Bisection method:</b> the IVT turns into an algorithm. Check the midpoint, keep the half where the sign changes, repeat. Each step halves the interval — 10 steps give about 3 decimal places.',
        '<b>Método de bisección:</b> el TVI se convierte en un algoritmo. Revisa el punto medio, quédate con la mitad donde cambia el signo, repite. Cada paso reduce el intervalo a la mitad — 10 pasos dan unos 3 decimales.'),
    ],
    mistakes: [
      L('Calling `1/x` discontinuous “everywhere it breaks”. It is continuous on its whole domain; x = 0 simply is not in the domain.',
        'Decir que `1/x` es discontinua “donde se rompe”. Es continua en todo su dominio; x = 0 simplemente no está en el dominio.'),
      L('Using the IVT on a function that is not continuous on the whole closed interval, e.g. `1/x` on [−1, 1].', 'Usar el TVI en una función que no es continua en todo el intervalo cerrado, por ejemplo `1/x` en [−1, 1].'),
      L('Expecting the IVT to say where the root is or how many there are. It only guarantees at least one.', 'Esperar que el TVI diga dónde está la raíz o cuántas hay. Solo garantiza al menos una.'),
    ],
    example: {
      prompt: L('Show that `x³ + x − 1 = 0` has a solution between 0 and 1, then narrow it down with two bisection steps.',
                'Demuestra que `x³ + x − 1 = 0` tiene una solución entre 0 y 1, y luego acótala con dos pasos de bisección.'),
      steps: [
        L('`f(x) = x³ + x − 1` is a polynomial, so it is continuous everywhere.', '`f(x) = x³ + x − 1` es un polinomio, así que es continua en todas partes.'),
        L('`f(0) = −1 < 0` and `f(1) = 1 > 0`. Zero is between them, so by the IVT there is a c in (0, 1) with `f(c) = 0`.',
          '`f(0) = −1 < 0` y `f(1) = 1 > 0`. El cero está entre ellos, así que por el TVI hay un c en (0, 1) con `f(c) = 0`.'),
        L('Midpoint: `f(0.5) = 0.125 + 0.5 − 1 = −0.375 < 0` → the root is in (0.5, 1).', 'Punto medio: `f(0.5) = 0.125 + 0.5 − 1 = −0.375 < 0` → la raíz está en (0.5, 1).'),
        L('Midpoint: `f(0.75) ≈ 0.172 > 0` → the root is in (0.5, 0.75). Continuing gives `c ≈ 0.6823`.',
          'Punto medio: `f(0.75) ≈ 0.172 > 0` → la raíz está en (0.5, 0.75). Si sigues, obtienes `c ≈ 0.6823`.'),
      ],
      answer: L('a root exists in (0, 1); it lies in (0.5, 0.75), ≈ `0.6823`', 'existe una raíz en (0, 1); está en (0.5, 0.75), ≈ `0.6823`'),
    },
    real: [
      L('If the temperature was 15 °C at 6 a.m. and 28 °C at noon, then at some moment it was exactly 20 °C — that is the IVT. Calculators and computer programs find roots with bisection and its faster cousins.',
        'Si la temperatura era 15 °C a las 6 a. m. y 28 °C al mediodía, entonces en algún momento fue exactamente 20 °C — eso es el TVI. Las calculadoras y los programas hallan raíces con la bisección y sus primos más rápidos.'),
    ],
  },
  exercises: [
    { q: L('f(x) = kx² for x ≤ 2 and 3x + 4 for x > 2. What k makes f continuous?', 'f(x) = kx² para x ≤ 2 y 3x + 4 para x > 2. ¿Qué k hace a f continua?'), answer: 2.5,
      hint: L('The two pieces must meet at x = 2: 4k = 10.', 'Las dos piezas deben coincidir en x = 2: 4k = 10.') },
    { q: L('f(x) = (x² − 4)/(x − 2). What value should f(2) be to remove the discontinuity?', 'f(x) = (x² − 4)/(x − 2). ¿Qué valor debe tener f(2) para eliminar la discontinuidad?'), answer: 4,
      hint: L('Simplify to x + 2 and take the limit at 2.', 'Simplifica a x + 2 y toma el límite en 2.') },
    { q: L('For f(x) = x³ + x − 1, compute f(0.5) (used in the first bisection step).', 'Para f(x) = x³ + x − 1, calcula f(0.5) (usado en el primer paso de bisección).'), answer: -0.375,
      hint: L('0.125 + 0.5 − 1', '0.125 + 0.5 − 1') },
  ],
},

// ─── 03 · The Derivative ────────────────────────────────────────────────────
{
  id: 'derivative', color: '#3785D8',
  tag:  L('Instantaneous Rate · Slope of a Curve', 'Razón Instantánea · Pendiente de una Curva'),
  name: L('The Derivative', 'La Derivada'),
  graph() {
    const f = x => x * x / 2;
    const g = Graph({ x: [-1.2, 4], y: [-1.2, 5.6] });
    g.grid(1).axes({ ticks: 1 });
    const P = [1, f(1)];
    [3, 2, 1.4].forEach((q, i) => {
      const m = (f(q) - P[1]) / (q - 1);
      g.fn(x => P[1] + m * (x - 1), { color: 2, thin: true, ghost: i < 2, delay: 0.5 + i * 0.35 });
      g.dot(q, f(q), { color: 2, r: 3.5, delay: 1.2 + i * 0.25 });
    });
    g.fn(x => x - 0.5, { color: 3, delay: 1.6 });
    g.fn(f, { color: 1 });
    g.dot(P[0], P[1], { color: 1, r: 5.5 });
    g.text(1, P[1], 'P', { dx: -16, dy: -6, color: 1 });
    g.text(3.15, 4.4, 'Q', { color: 2 });
    g.text(1.6, -0.8, L('tangent: slope 1', 'tangente: pendiente 1'), { color: 3, size: 11 });
    g.text(-1, 5.1, 'f(x) = x²/2', { color: 1 });
    return g.svg();
  },
  formulas: [
    { label: L('Limit Definition', 'Definición por Límite'), expr: 'f′(x) = lim<sub>h→0</sub> [f(x + h) − f(x)] / h',
      desc: L('The slope of the secant line from x to x + h, as the second point slides into the first.',
              'La pendiente de la secante de x a x + h, cuando el segundo punto se desliza hasta el primero.') },
    { label: L('Notation', 'Notación'), expr: 'f′(x) = dy/dx = d/dx [f(x)] = y′',
      desc: L('Lagrange (f′) and Leibniz (dy/dx) notation mean the same thing: the rate of change of y with respect to x.',
              'La notación de Lagrange (f′) y la de Leibniz (dy/dx) significan lo mismo: la razón de cambio de y respecto a x.') },
    { label: L('Tangent Line', 'Recta Tangente'), expr: 'y − f(a) = f′(a)(x − a)',
      desc: L('Point-slope form with the derivative as the slope. Near a, the curve and this line are almost identical.',
              'Forma punto-pendiente con la derivada como pendiente. Cerca de a, la curva y esta recta son casi idénticas.') },
    { label: L('When It Fails', 'Cuándo Falla'), expr: 'corners · cusps · vertical tangents · breaks',
      desc: L('Differentiable ⇒ continuous, but not the other way: |x| is continuous at 0 and has no derivative there.',
              'Derivable ⇒ continua, pero no al revés: |x| es continua en 0 y no tiene derivada ahí.') },
  ],
  deep: {
    idea: [
      L('Average speed is easy: distance ÷ time. But what is your speed <b>at exactly 3:00 p.m.</b>? Over zero seconds you travel zero meters, and 0/0 tells you nothing. The derivative solves this: take the average over shorter and shorter intervals and see what number they approach.',
        'La velocidad promedio es fácil: distancia ÷ tiempo. Pero ¿cuál es tu velocidad <b>exactamente a las 3:00 p. m.</b>? En cero segundos recorres cero metros, y 0/0 no dice nada. La derivada lo resuelve: toma el promedio en intervalos cada vez más cortos y mira a qué número se acercan.'),
      L('Geometrically, that average is the slope of a <b>secant line</b> through two points (blue). Slide the second point Q toward P and the secants rotate into the <b>tangent line</b> (pink). Its slope is the derivative.',
        'Geométricamente, ese promedio es la pendiente de una <b>recta secante</b> que pasa por dos puntos (azul). Desliza el segundo punto Q hacia P y las secantes giran hasta la <b>recta tangente</b> (rosa). Su pendiente es la derivada.'),
    ],
    why: [
      L('For `f(x) = x²/2` at P = (1, ½): with Q at x = 3 the secant slope is 2; at x = 2 it is 1.5; at x = 1.4 it is 1.2; at x = 1.01 it is 1.005. The pattern closes in on 1 — and the algebra confirms it exactly.',
        'Para `f(x) = x²/2` en P = (1, ½): con Q en x = 3 la pendiente de la secante es 2; en x = 2 es 1.5; en x = 1.4 es 1.2; en x = 1.01 es 1.005. El patrón se cierra en 1 — y el álgebra lo confirma exactamente.'),
      L('The derivative is itself a <b>function</b>: for every x it gives the slope there. Positive → rising, negative → falling, zero → flat (a peak, a valley or a pause).',
        'La derivada es en sí una <b>función</b>: para cada x da la pendiente en ese punto. Positiva → sube, negativa → baja, cero → plana (un pico, un valle o una pausa).'),
    ],
    mistakes: [
      L('Plugging in h = 0 before simplifying — you will always get 0/0. Expand and cancel h first.', 'Sustituir h = 0 antes de simplificar — siempre obtendrás 0/0. Expande y cancela h primero.'),
      L('Confusing `f′(a)` (one number: a slope) with `f′(x)` (a whole function).', 'Confundir `f′(a)` (un número: una pendiente) con `f′(x)` (una función completa).'),
      L('Expanding `f(x + h)` wrong: for `x²` it is `x² + 2xh + h²`, not `x² + h²`.', 'Expandir mal `f(x + h)`: para `x²` es `x² + 2xh + h²`, no `x² + h²`.'),
    ],
    example: {
      prompt: L('Use the limit definition to find the derivative of `f(x) = x²`, then the tangent line at x = 3.',
                'Usa la definición por límite para hallar la derivada de `f(x) = x²`, y luego la recta tangente en x = 3.'),
      steps: [
        L('Difference quotient: `[(x + h)² − x²]/h = [x² + 2xh + h² − x²]/h`.', 'Cociente de diferencias: `[(x + h)² − x²]/h = [x² + 2xh + h² − x²]/h`.'),
        L('Simplify: `(2xh + h²)/h = 2x + h` (h ≠ 0 while approaching).', 'Simplifica: `(2xh + h²)/h = 2x + h` (h ≠ 0 mientras se acerca).'),
        L('Take the limit as h → 0: `f′(x) = 2x`.', 'Toma el límite cuando h → 0: `f′(x) = 2x`.'),
        L('At x = 3: slope `f′(3) = 6`, point `(3, 9)`. Tangent: `y − 9 = 6(x − 3)`, i.e. `y = 6x − 9`.',
          'En x = 3: pendiente `f′(3) = 6`, punto `(3, 9)`. Tangente: `y − 9 = 6(x − 3)`, es decir `y = 6x − 9`.'),
      ],
      answer: L('`f′(x) = 2x`; tangent at x = 3: `y = 6x − 9`', '`f′(x) = 2x`; tangente en x = 3: `y = 6x − 9`'),
    },
    real: [
      L('Velocity is the derivative of position, and acceleration is the derivative of velocity. Economists call derivatives “marginal”: marginal cost is the cost of producing one more unit. Chemists measure reaction rates, doctors the rate a drug leaves the blood — all derivatives.',
        'La velocidad es la derivada de la posición, y la aceleración es la derivada de la velocidad. Los economistas llaman “marginal” a la derivada: el costo marginal es el costo de producir una unidad más. Los químicos miden velocidades de reacción y los médicos la rapidez con que un medicamento sale de la sangre — todas derivadas.'),
    ],
  },
  exercises: [
    { q: L('For f(x) = x², find the average rate of change from x = 1 to x = 3.', 'Para f(x) = x², halla la razón de cambio promedio de x = 1 a x = 3.'), answer: 4,
      hint: L('(f(3) − f(1)) / (3 − 1) = (9 − 1)/2', '(f(3) − f(1)) / (3 − 1) = (9 − 1)/2') },
    { q: L('For f(x) = 3x², the derivative is 6x. Find f′(2).', 'Para f(x) = 3x², la derivada es 6x. Halla f′(2).'), answer: 12,
      hint: L('6 · 2', '6 · 2') },
    { q: L('The tangent line to y = x² at x = 3 is y = 6x + b. Find b.', 'La recta tangente a y = x² en x = 3 es y = 6x + b. Halla b.'), answer: -9,
      hint: L('It passes through (3, 9): 9 = 18 + b.', 'Pasa por (3, 9): 9 = 18 + b.') },
  ],
},

// ─── 04 · Differentiation Rules ─────────────────────────────────────────────
{
  id: 'rules', color: '#5B8FE0',
  tag:  L('Power · Product · Quotient', 'Potencia · Producto · Cociente'),
  name: L('Differentiation Rules', 'Reglas de Derivación'),
  graph() {
    const f  = x => x ** 3 / 3 - x;
    const df = x => x * x - 1;
    const g = Graph({ x: [-2.8, 2.8], y: [-2.6, 4] });
    g.grid(1).axes({ ticks: 1 });
    g.vline(-1, { ghost: true, delay: 1.3 }).vline(1, { ghost: true, delay: 1.3 });
    g.fn(df, { color: 2, delay: 0.5 });
    g.fn(f, { color: 1 });
    g.dot(-1, f(-1), { color: 1 }).dot(1, f(1), { color: 1 });
    g.dot(-1, 0, { color: 2 }).dot(1, 0, { color: 2 });
    g.text(1.75, 3.5, 'f′ = x² − 1', { color: 2 });
    g.text(-2.7, -1.9, 'f = x³/3 − x', { color: 1 });
    g.text(-1, 0, 'f′ = 0', { dx: -48, dy: -8, color: 3, size: 10 });
    return g.svg();
  },
  formulas: [
    { label: L('Power Rule', 'Regla de la Potencia'), expr: 'd/dx xⁿ = n·xⁿ⁻¹',
      desc: L('Bring the exponent down, subtract one. Works for any real n: √x = x^½ → ½x^(−½).',
              'Baja el exponente y réstale uno. Funciona para todo n real: √x = x^½ → ½x^(−½).') },
    { label: L('Constant Multiple & Sum', 'Múltiplo Constante y Suma'), expr: '(c·f)′ = c·f′     (f ± g)′ = f′ ± g′',
      desc: L('Differentiate term by term. The derivative of a constant is 0.', 'Deriva término a término. La derivada de una constante es 0.') },
    { label: L('Product Rule', 'Regla del Producto'), expr: '(f·g)′ = f′·g + f·g′',
      desc: L('“First times derivative of second, plus second times derivative of first.” Not f′·g′!',
              '“El primero por la derivada del segundo, más el segundo por la derivada del primero.” ¡No es f′·g′!') },
    { label: L('Quotient Rule', 'Regla del Cociente'), expr: '(f/g)′ = (f′·g − f·g′) / g²',
      desc: L('“Low d-high minus high d-low, over the square of what’s below.” The order of the subtraction matters.',
              '“El de abajo por la derivada del de arriba, menos el de arriba por la derivada del de abajo, sobre el de abajo al cuadrado.” El orden de la resta importa.') },
  ],
  deep: {
    idea: [
      L('Computing every derivative from the limit definition would be exhausting. These rules are shortcuts that were each proven <i>once</i> from the definition, so you never need to again. With them, any polynomial, product or quotient can be differentiated in a line or two.',
        'Calcular cada derivada con la definición por límite sería agotador. Estas reglas son atajos que se demostraron <i>una vez</i> con la definición, para que no tengas que volver a hacerlo. Con ellas, cualquier polinomio, producto o cociente se deriva en una o dos líneas.'),
      L('Look at the graph: wherever the gold curve f has a peak or valley, the blue curve f′ crosses zero. Where f rises, f′ is above the axis; where f falls, f′ is below.',
        'Mira la gráfica: donde la curva dorada f tiene un pico o un valle, la curva azul f′ cruza el cero. Donde f sube, f′ está sobre el eje; donde f baja, f′ está debajo.'),
    ],
    why: [
      L('<b>Power rule:</b> expand `(x + h)ⁿ = xⁿ + n·xⁿ⁻¹h + (terms with h², h³, …)`. Subtract xⁿ, divide by h: `n·xⁿ⁻¹ + (terms with h)`. As h → 0 only `n·xⁿ⁻¹` survives.',
        '<b>Regla de la potencia:</b> expande `(x + h)ⁿ = xⁿ + n·xⁿ⁻¹h + (términos con h², h³, …)`. Resta xⁿ y divide entre h: `n·xⁿ⁻¹ + (términos con h)`. Cuando h → 0 solo sobrevive `n·xⁿ⁻¹`.'),
      L('<b>Product rule as area:</b> picture a rectangle with sides f and g. If f grows by Δf and g by Δg, the area grows by `g·Δf + f·Δg + Δf·Δg`. The last sliver is tiny-times-tiny and vanishes in the limit, leaving `f′g + fg′`.',
        '<b>Regla del producto como área:</b> imagina un rectángulo de lados f y g. Si f crece Δf y g crece Δg, el área crece `g·Δf + f·Δg + Δf·Δg`. La última tira es diminuta por diminuta y desaparece en el límite, dejando `f′g + fg′`.'),
    ],
    mistakes: [
      L('`(f·g)′ = f′·g′` — the most common calculus mistake. Use the product rule.', '`(f·g)′ = f′·g′` — el error más común en cálculo. Usa la regla del producto.'),
      L('Flipping the quotient rule’s numerator, which flips the sign of the answer.', 'Invertir el numerador de la regla del cociente, lo que cambia el signo de la respuesta.'),
      L('Using the power rule on `eˣ` or `2ˣ`. The variable is in the exponent there — different rule (topic 6).', 'Usar la regla de la potencia en `eˣ` o `2ˣ`. Ahí la variable está en el exponente — otra regla (tema 6).'),
      L('Not rewriting first: `1/x³ = x⁻³` → `−3x⁻⁴`; `√x = x^½` → `1/(2√x)`.', 'No reescribir primero: `1/x³ = x⁻³` → `−3x⁻⁴`; `√x = x^½` → `1/(2√x)`.'),
    ],
    example: {
      prompt: L('Differentiate `y = (x² + 1)(3x − 5)` with the product rule, and check by expanding.',
                'Deriva `y = (x² + 1)(3x − 5)` con la regla del producto, y comprueba expandiendo.'),
      steps: [
        L('Let `f = x² + 1` (so `f′ = 2x`) and `g = 3x − 5` (so `g′ = 3`).', 'Sea `f = x² + 1` (así `f′ = 2x`) y `g = 3x − 5` (así `g′ = 3`).'),
        L('`y′ = f′g + fg′ = 2x(3x − 5) + (x² + 1)·3`.', '`y′ = f′g + fg′ = 2x(3x − 5) + (x² + 1)·3`.'),
        L('Simplify: `6x² − 10x + 3x² + 3 = 9x² − 10x + 3`.', 'Simplifica: `6x² − 10x + 3x² + 3 = 9x² − 10x + 3`.'),
        L('Check: expanded, `y = 3x³ − 5x² + 3x − 5`, and the power rule gives `9x² − 10x + 3` ✓.',
          'Comprueba: expandida, `y = 3x³ − 5x² + 3x − 5`, y la regla de la potencia da `9x² − 10x + 3` ✓.'),
      ],
      answer: L('`y′ = 9x² − 10x + 3`', '`y′ = 9x² − 10x + 3`'),
    },
    real: [
      L('If a ball’s height is `h(t) = −4.9t² + 20t + 2`, then `h′(t) = −9.8t + 20` is its velocity and `h″(t) = −9.8` is gravity. Revenue = price × quantity, so how revenue changes needs the product rule; average cost = total cost ÷ units needs the quotient rule.',
        'Si la altura de una pelota es `h(t) = −4.9t² + 20t + 2`, entonces `h′(t) = −9.8t + 20` es su velocidad y `h″(t) = −9.8` es la gravedad. Ingreso = precio × cantidad, así que cómo cambia el ingreso requiere la regla del producto; costo promedio = costo total ÷ unidades requiere la regla del cociente.'),
    ],
  },
  exercises: [
    { q: L('If f(x) = 4x³, find f′(2).', 'Si f(x) = 4x³, halla f′(2).'), answer: 48,
      hint: L('f′(x) = 12x²', 'f′(x) = 12x²') },
    { q: L('If f(x) = x⁵ − 3x² + 7, find f′(1).', 'Si f(x) = x⁵ − 3x² + 7, halla f′(1).'), answer: -1,
      hint: L('f′(x) = 5x⁴ − 6x', 'f′(x) = 5x⁴ − 6x') },
    { q: L('If f(x) = x/(x + 1), find f′(1).', 'Si f(x) = x/(x + 1), halla f′(1).'), answer: 0.25,
      hint: L('Quotient rule: ((x + 1) − x)/(x + 1)² = 1/(x + 1)².', 'Regla del cociente: ((x + 1) − x)/(x + 1)² = 1/(x + 1)².') },
  ],
},

// ─── 05 · Chain Rule & Implicit Differentiation ─────────────────────────────
{
  id: 'chain', color: '#7A6BE6',
  tag:  L('Functions Inside Functions', 'Funciones Dentro de Funciones'),
  name: L('Chain Rule & Implicit', 'Regla de la Cadena e Implícita'),
  graph() {
    const r = 3, t = Math.PI / 4, P = [r * Math.cos(t), r * Math.sin(t)];
    const g = Graph({ x: [-4.2, 4.2], y: [-4.2, 4.2] });
    g.grid(1).axes({ ticks: 1 });
    g.param(s => r * Math.cos(s), s => r * Math.sin(s), 0, 2 * Math.PI, { color: 1 });
    g.line(0, 0, P[0], P[1], { ghost: true, delay: 0.8 });
    g.fn(x => P[1] - (P[0] / P[1]) * (x - P[0]), { color: 3, delay: 1.1 });
    g.dot(P[0], P[1], { color: 1, r: 5.5 });
    g.text(-4, 3.7, 'x² + y² = 9', { color: 1 });
    g.text(P[0], P[1], 'dy/dx = −x/y = −1', { dx: -40, dy: -26, color: 3, size: 11 });
    return g.svg();
  },
  formulas: [
    { label: L('Chain Rule', 'Regla de la Cadena'), expr: 'd/dx f(g(x)) = f′(g(x)) · g′(x)',
      desc: L('Derivative of the outside (leave the inside alone) times derivative of the inside.',
              'Derivada de la de afuera (dejando igual la de adentro) por la derivada de la de adentro.') },
    { label: L('Leibniz Form', 'Forma de Leibniz'), expr: 'dy/dx = dy/du · du/dx',
      desc: L('Rates multiply, like gears: if u turns 3× as fast as x and y 2× as fast as u, y turns 6× as fast as x.',
              'Las razones se multiplican, como engranajes: si u gira 3× más rápido que x y y 2× más rápido que u, y gira 6× más rápido que x.') },
    { label: L('Implicit Differentiation', 'Derivación Implícita'), expr: 'd/dx (y²) = 2y · dy/dx',
      desc: L('Differentiate both sides with respect to x. Every term containing y picks up a dy/dx (chain rule).',
              'Deriva ambos lados respecto a x. Cada término con y recibe un dy/dx (regla de la cadena).') },
    { label: L('Circle Example', 'Ejemplo del Círculo'), expr: 'x² + y² = r²  ⇒  dy/dx = −x / y',
      desc: L('The tangent is perpendicular to the radius, whose slope is y/x — and −x/y is its negative reciprocal.',
              'La tangente es perpendicular al radio, cuya pendiente es y/x — y −x/y es su recíproco negativo.') },
  ],
  deep: {
    idea: [
      L('Most real functions are <b>compositions</b>: `sin(3x)`, `(x² + 1)⁵`, `e^(−t²)`. The chain rule handles them by peeling layers like an onion: differentiate the outer layer, keep the inside as is, then multiply by the derivative of the inside.',
        'La mayoría de las funciones reales son <b>composiciones</b>: `sen(3x)`, `(x² + 1)⁵`, `e^(−t²)`. La regla de la cadena las maneja pelando capas como una cebolla: deriva la capa externa, deja igual lo de adentro, y multiplica por la derivada de lo de adentro.'),
      L('Some curves, like the circle on the left, are not functions `y = f(x)` at all. <b>Implicit differentiation</b> still finds their slope: treat y as an unknown function of x and use the chain rule whenever you differentiate it.',
        'Algunas curvas, como el círculo de la izquierda, ni siquiera son funciones `y = f(x)`. La <b>derivación implícita</b> igual halla su pendiente: trata y como una función desconocida de x y usa la regla de la cadena cada vez que la derives.'),
    ],
    why: [
      L('Write `y = f(u)` with `u = g(x)`. A small change Δx causes a change Δu, which causes a change Δy. Then `Δy/Δx = (Δy/Δu)·(Δu/Δx)` — the Δu’s cancel like fractions. Taking limits gives `dy/dx = dy/du · du/dx`.',
        'Escribe `y = f(u)` con `u = g(x)`. Un cambio pequeño Δx causa un cambio Δu, que causa un cambio Δy. Entonces `Δy/Δx = (Δy/Δu)·(Δu/Δx)` — los Δu se cancelan como fracciones. Al tomar límites queda `dy/dx = dy/du · du/dx`.'),
      L('<b>Implicit on the circle:</b> `d/dx(x²) + d/dx(y²) = d/dx(9)` → `2x + 2y·y′ = 0` → `y′ = −x/y`. At `(2.12, 2.12)` the slope is −1, exactly the pink tangent line.',
        '<b>Implícita en el círculo:</b> `d/dx(x²) + d/dx(y²) = d/dx(9)` → `2x + 2y·y′ = 0` → `y′ = −x/y`. En `(2.12, 2.12)` la pendiente es −1, justo la tangente rosada.'),
    ],
    mistakes: [
      L('Forgetting the inner derivative: `d/dx sin(3x) = 3cos(3x)`, not `cos(3x)`.', 'Olvidar la derivada de adentro: `d/dx sen(3x) = 3cos(3x)`, no `cos(3x)`.'),
      L('Changing the inside while differentiating the outside: `d/dx (x² + 1)⁵ = 5(x² + 1)⁴·2x`, not `5(2x)⁴`.', 'Cambiar lo de adentro al derivar lo de afuera: `d/dx (x² + 1)⁵ = 5(x² + 1)⁴·2x`, no `5(2x)⁴`.'),
      L('In implicit problems, writing `d/dx(y²) = 2y` without the `dy/dx`.', 'En problemas implícitos, escribir `d/dx(y²) = 2y` sin el `dy/dx`.'),
    ],
    example: {
      prompt: L('Differentiate `y = (3x² + 1)⁵`.', 'Deriva `y = (3x² + 1)⁵`.'),
      steps: [
        L('Outer function: `u⁵`, with inner `u = 3x² + 1`.', 'Función externa: `u⁵`, con interna `u = 3x² + 1`.'),
        L('Derivative of the outer, inside untouched: `5(3x² + 1)⁴`.', 'Derivada de la externa, sin tocar lo de adentro: `5(3x² + 1)⁴`.'),
        L('Derivative of the inner: `6x`.', 'Derivada de la interna: `6x`.'),
        L('Multiply: `y′ = 5(3x² + 1)⁴ · 6x = 30x(3x² + 1)⁴`. (Expanding to a degree-10 polynomial first would take much longer.)',
          'Multiplica: `y′ = 5(3x² + 1)⁴ · 6x = 30x(3x² + 1)⁴`. (Expandir primero a un polinomio de grado 10 tomaría mucho más.)'),
      ],
      answer: L('`y′ = 30x(3x² + 1)⁴`', '`y′ = 30x(3x² + 1)⁴`'),
    },
    real: [
      L('<b>Related rates:</b> air is pumped into a balloon; how fast does the radius grow? `V = (4/3)πr³` gives `dV/dt = 4πr²·dr/dt` by the chain rule. And every neural network is trained with “backpropagation”, which is the chain rule applied through millions of layers.',
        '<b>Razones relacionadas:</b> se bombea aire a un globo; ¿qué tan rápido crece el radio? `V = (4/3)πr³` da `dV/dt = 4πr²·dr/dt` por la regla de la cadena. Y toda red neuronal se entrena con “retropropagación”, que es la regla de la cadena aplicada a través de millones de capas.'),
    ],
  },
  exercises: [
    { q: L('If y = (2x + 1)³, find dy/dx at x = 0.', 'Si y = (2x + 1)³, halla dy/dx en x = 0.'), answer: 6,
      hint: L('3(2x + 1)² · 2', '3(2x + 1)² · 2') },
    { q: L('If y = √(x² + 9), find dy/dx at x = 4.', 'Si y = √(x² + 9), halla dy/dx en x = 4.'), answer: 0.8,
      hint: L('dy/dx = x / √(x² + 9) = 4/5', 'dy/dx = x / √(x² + 9) = 4/5') },
    { q: L('On the circle x² + y² = 25, find the slope dy/dx at (3, 4).', 'En el círculo x² + y² = 25, halla la pendiente dy/dx en (3, 4).'), answer: -0.75,
      hint: L('dy/dx = −x/y', 'dy/dx = −x/y') },
  ],
},

// ─── 06 · Derivatives of Transcendental Functions ───────────────────────────
{
  id: 'transcendental', color: '#9C6FE0',
  tag:  L('Trig · Exponential · Logarithmic', 'Trigonométricas · Exponenciales · Logarítmicas'),
  name: L('Transcendental Derivatives', 'Derivadas Trascendentes'),
  graph() {
    const g = Graph({ x: [-0.8, 7], y: [-1.8, 1.8] });
    g.grid(1).axes({ ticks: 1 });
    g.fn(Math.cos, { color: 2, delay: 0.5 });
    g.fn(Math.sin, { color: 1 });
    g.fn(x => x, { from: -0.8, to: 1.4, color: 3, thin: true, delay: 1.2 });
    g.vline(Math.PI / 2, { ghost: true, delay: 1.4 }).vline(3 * Math.PI / 2, { ghost: true, delay: 1.4 });
    g.dot(Math.PI / 2, 1, { color: 1 }).dot(Math.PI / 2, 0, { color: 2 });
    g.dot(3 * Math.PI / 2, -1, { color: 1 }).dot(3 * Math.PI / 2, 0, { color: 2 });
    g.dot(0, 0, { color: 3 });
    g.text(2.1, 1.35, 'f = sin x', { color: 1 });
    g.text(4.5, 1.35, 'f′ = cos x', { color: 2 });
    g.text(0.15, -0.35, L('slope 1', 'pendiente 1'), { color: 3, size: 10 });
    return g.svg();
  },
  formulas: [
    { label: L('Trigonometric', 'Trigonométricas'), expr: '(sin x)′ = cos x   (cos x)′ = −sin x   (tan x)′ = sec²x',
      desc: L('Only valid with x in radians. Differentiating sine four times brings you back to sine.',
              'Solo válidas con x en radianes. Derivar el seno cuatro veces te regresa al seno.') },
    { label: L('Exponential', 'Exponenciales'), expr: '(eˣ)′ = eˣ     (aˣ)′ = aˣ · ln a',
      desc: L('eˣ is its own derivative — the reason e is “natural”. Any other base picks up a factor ln a.',
              'eˣ es su propia derivada — la razón por la que e es “natural”. Cualquier otra base gana un factor ln a.') },
    { label: L('Logarithmic', 'Logarítmicas'), expr: '(ln x)′ = 1/x     (log<sub>a</sub> x)′ = 1/(x ln a)',
      desc: L('The log grows ever more slowly — its slope 1/x shrinks as x grows.', 'El logaritmo crece cada vez más despacio — su pendiente 1/x se achica cuando x crece.') },
    { label: L('Inverse Trig', 'Trigonométricas Inversas'), expr: '(arcsin x)′ = 1/√(1 − x²)    (arctan x)′ = 1/(1 + x²)',
      desc: L('Found with implicit differentiation. These are why algebraic integrals sometimes produce angles.',
              'Se hallan con derivación implícita. Por eso algunas integrales algebraicas producen ángulos.') },
  ],
  deep: {
    idea: [
      L('“Transcendental” functions — trig, exponential and logarithmic — cannot be built from algebra alone, yet their derivatives are beautifully simple. Look at the graph: the slope of sin x (gold) at every point is exactly the height of cos x (blue). At the peaks of sine (slope 0), cosine crosses zero.',
        'Las funciones “trascendentes” — trigonométricas, exponenciales y logarítmicas — no se pueden construir solo con álgebra, pero sus derivadas son muy simples. Mira la gráfica: la pendiente de sen x (dorado) en cada punto es exactamente la altura de cos x (azul). En los picos del seno (pendiente 0), el coseno cruza el cero.'),
      L('And `eˣ` is the only function (besides 0) that equals its own derivative: its height and its slope are always the same number. Growth proportional to size is the definition of natural growth.',
        'Y `eˣ` es la única función (además de 0) igual a su propia derivada: su altura y su pendiente siempre son el mismo número. Crecer en proporción al tamaño es la definición de crecimiento natural.'),
    ],
    why: [
      L('<b>Sine:</b> by the sum formula, `[sin(x + h) − sin x]/h = sin x·(cos h − 1)/h + cos x·(sin h)/h`. As h → 0, `(cos h − 1)/h → 0` and `(sin h)/h → 1`, leaving `cos x`. The special limit from topic 1 is exactly what makes this work — and it only holds in radians.',
        '<b>Seno:</b> por la fórmula de suma, `[sen(x + h) − sen x]/h = sen x·(cos h − 1)/h + cos x·(sen h)/h`. Cuando h → 0, `(cos h − 1)/h → 0` y `(sen h)/h → 1`, y queda `cos x`. El límite especial del tema 1 es justo lo que hace que funcione — y solo vale en radianes.'),
      L('<b>ln x:</b> if `y = ln x` then `eʸ = x`. Differentiate implicitly: `eʸ·y′ = 1`, so `y′ = 1/eʸ = 1/x`.',
        '<b>ln x:</b> si `y = ln x` entonces `eʸ = x`. Deriva implícitamente: `eʸ·y′ = 1`, así que `y′ = 1/eʸ = 1/x`.'),
    ],
    mistakes: [
      L('Using the power rule on eˣ: `(eˣ)′ ≠ x·eˣ⁻¹`.', 'Usar la regla de la potencia en eˣ: `(eˣ)′ ≠ x·eˣ⁻¹`.'),
      L('Dropping the minus sign: `(cos x)′ = −sin x`.', 'Perder el signo menos: `(cos x)′ = −sen x`.'),
      L('Forgetting the chain rule: `(e^(5x))′ = 5e^(5x)`, `(ln(x² + 1))′ = 2x/(x² + 1)`.', 'Olvidar la regla de la cadena: `(e^(5x))′ = 5e^(5x)`, `(ln(x² + 1))′ = 2x/(x² + 1)`.'),
      L('Working in degrees. In degrees, `(sin x)′ = (π/180)cos x` — an ugly factor that radians avoid.', 'Trabajar en grados. En grados, `(sen x)′ = (π/180)cos x` — un factor feo que los radianes evitan.'),
    ],
    example: {
      prompt: L('Differentiate `y = e^(2x)·sin x` and find the slope at x = 0.', 'Deriva `y = e^(2x)·sen x` y halla la pendiente en x = 0.'),
      steps: [
        L('Product rule with `f = e^(2x)` and `g = sin x`.', 'Regla del producto con `f = e^(2x)` y `g = sen x`.'),
        L('Chain rule: `f′ = 2e^(2x)`. And `g′ = cos x`.', 'Regla de la cadena: `f′ = 2e^(2x)`. Y `g′ = cos x`.'),
        L('`y′ = 2e^(2x) sin x + e^(2x) cos x = e^(2x)(2 sin x + cos x)`.', '`y′ = 2e^(2x) sen x + e^(2x) cos x = e^(2x)(2 sen x + cos x)`.'),
        L('At x = 0: `e⁰(2·0 + 1) = 1`.', 'En x = 0: `e⁰(2·0 + 1) = 1`.'),
      ],
      answer: L('`y′ = e^(2x)(2 sin x + cos x)`, slope 1 at x = 0', '`y′ = e^(2x)(2 sen x + cos x)`, pendiente 1 en x = 0'),
    },
    real: [
      L('A mass on a spring at position `x(t) = A cos(ωt)` has velocity `−Aω sin(ωt)` — fastest when passing through the middle. Continuous interest, population and radioactive decay all rely on `(eᵏᵗ)′ = k·eᵏᵗ`.',
        'Una masa en un resorte en la posición `x(t) = A cos(ωt)` tiene velocidad `−Aω sen(ωt)` — más rápida al pasar por el centro. El interés continuo, la población y el decaimiento radiactivo dependen de `(eᵏᵗ)′ = k·eᵏᵗ`.'),
    ],
  },
  exercises: [
    { q: L('If f(x) = 5eˣ, find f′(0).', 'Si f(x) = 5eˣ, halla f′(0).'), answer: 5,
      hint: L('f′(x) = 5eˣ and e⁰ = 1.', 'f′(x) = 5eˣ y e⁰ = 1.') },
    { q: L('If f(x) = ln x, find f′(4).', 'Si f(x) = ln x, halla f′(4).'), answer: 0.25,
      hint: L('f′(x) = 1/x', 'f′(x) = 1/x') },
    { q: L('If f(x) = sin(3x), find f′(0).', 'Si f(x) = sen(3x), halla f′(0).'), answer: 3,
      hint: L('Chain rule: 3cos(3x).', 'Regla de la cadena: 3cos(3x).') },
  ],
},

// ─── 07 · Curve Sketching ───────────────────────────────────────────────────
{
  id: 'curve-sketching', color: '#BF8CE1',
  tag:  L('Extrema · Concavity · Inflection', 'Extremos · Concavidad · Inflexión'),
  name: L('Curve Sketching', 'Trazado de Curvas'),
  graph() {
    const f   = x => 0.5 * x ** 3 - 1.5 * x;
    const df  = x => 1.5 * x * x - 1.5;
    const g = Graph({ x: [-2.6, 2.6], y: [-2.8, 2.8] });
    g.grid(1).axes({ ticks: 1 });
    // Background bands: concave down (blue, x < 0) and concave up (pink, x > 0)
    g.area(() => 2.8, -2.6, 0, { lower: () => -2.8, color: 2, soft: true, delay: 1.5 });
    g.area(() => 2.8, 0, 2.6, { lower: () => -2.8, color: 3, soft: true, delay: 1.5 });
    g.fn(df, { color: 2, thin: true, ghost: true, delay: 0.6 });
    g.fn(f, { color: 1 });
    g.dot(-1, 1, { color: 1, r: 5.5 }).dot(1, -1, { color: 1, r: 5.5 }).dot(0, 0, { color: 3, r: 5 });
    g.text(-1, 1, 'max', { anchor: 'middle', dy: -12, color: 1 });
    g.text(1, -1, 'min', { anchor: 'middle', dy: 22, color: 1 });
    g.text(0, 0, L('inflection', 'inflexión'), { dx: 10, dy: 16, color: 3, size: 11 });
    g.text(-2.5, -2.4, '∩', { color: 2, size: 18 });
    g.text(2.2, 2.2, '∪', { color: 3, size: 18 });
    return g.svg();
  },
  formulas: [
    { label: L('Critical Points', 'Puntos Críticos'), expr: 'f′(c) = 0   or   f′(c) undefined',
      desc: L('The only places a smooth function can have a local maximum or minimum.', 'Los únicos lugares donde una función suave puede tener un máximo o mínimo local.') },
    { label: L('First Derivative Test', 'Criterio de la Primera Derivada'), expr: 'f′: + → −  max     f′: − → +  min',
      desc: L('Rising then falling is a peak; falling then rising is a valley. No sign change → no extremum.',
              'Subir y luego bajar es un pico; bajar y luego subir es un valle. Sin cambio de signo → sin extremo.') },
    { label: L('Concavity & 2nd Derivative', 'Concavidad y 2.ª Derivada'), expr: 'f″ > 0  ∪      f″ < 0  ∩',
      desc: L('Second derivative test: f′(c) = 0 and f″(c) < 0 → max; f″(c) > 0 → min. An inflection point is where f″ changes sign.',
              'Criterio de la segunda derivada: f′(c) = 0 y f″(c) < 0 → máx; f″(c) > 0 → mín. Un punto de inflexión es donde f″ cambia de signo.') },
    { label: L('Closed Interval Method', 'Método del Intervalo Cerrado'), expr: 'max/min on [a, b]: check critical points + a + b',
      desc: L('Extreme Value Theorem: a continuous function on [a, b] always has an absolute max and min — at a critical point or an endpoint.',
              'Teorema del Valor Extremo: una función continua en [a, b] siempre tiene máximo y mínimo absolutos — en un punto crítico o en un extremo del intervalo.') },
  ],
  deep: {
    idea: [
      L('The first derivative tells you <b>direction</b> (rising or falling); the second derivative tells you <b>bending</b> (cupped up ∪ or down ∩). Together they let you sketch a curve’s whole shape before plotting a single point.',
        'La primera derivada dice la <b>dirección</b> (sube o baja); la segunda derivada dice la <b>curvatura</b> (cóncava hacia arriba ∪ o hacia abajo ∩). Juntas permiten dibujar toda la forma de una curva antes de graficar un solo punto.'),
      L('In the graph, the faint curve is f′. Where it is positive, f rises; it crosses zero exactly under the max and the min. The blue region is where f is concave down, the pink where it is concave up; they switch at the inflection point.',
        'En la gráfica, la curva tenue es f′. Donde es positiva, f sube; cruza el cero justo debajo del máximo y del mínimo. La región azul es donde f es cóncava hacia abajo, la rosada donde es cóncava hacia arriba; cambian en el punto de inflexión.'),
    ],
    why: [
      L('At the top of a smooth hill, the tangent line is horizontal — so f′ = 0 there. That is why we hunt for extrema among the critical points. But a flat tangent is not enough: `x³` is flat at 0 and keeps rising, so we need the sign test to confirm.',
        'En la cima de una colina suave, la recta tangente es horizontal — así que f′ = 0 ahí. Por eso buscamos extremos entre los puntos críticos. Pero una tangente plana no basta: `x³` es plana en 0 y sigue subiendo, así que necesitamos el criterio del signo para confirmar.'),
      L('f″ > 0 means the slope is increasing: slopes go −2, −1, 0, 1, 2… which bends the curve into a cup ∪. That is why f″ > 0 at a critical point means a minimum.',
        'f″ > 0 significa que la pendiente aumenta: las pendientes van −2, −1, 0, 1, 2… lo que dobla la curva como una taza ∪. Por eso f″ > 0 en un punto crítico indica un mínimo.'),
    ],
    mistakes: [
      L('Assuming every f′(c) = 0 is a max or min (x³ at 0 is neither).', 'Suponer que todo f′(c) = 0 es un máximo o mínimo (x³ en 0 no es ninguno).'),
      L('Forgetting the endpoints when finding an absolute max/min on a closed interval.', 'Olvidar los extremos del intervalo al buscar un máximo o mínimo absoluto en un intervalo cerrado.'),
      L('Assuming f″ = 0 means an inflection point. `x⁴` has f″(0) = 0 but is concave up on both sides.', 'Suponer que f″ = 0 significa un punto de inflexión. `x⁴` tiene f″(0) = 0 pero es cóncava hacia arriba en ambos lados.'),
      L('Mixing up “increasing” and “concave up”. A curve can rise while bending down (like ln x).', 'Confundir “creciente” con “cóncava hacia arriba”. Una curva puede subir mientras se dobla hacia abajo (como ln x).'),
    ],
    example: {
      prompt: L('Find the local extrema and inflection point of `f(x) = x³ − 6x² + 9x + 1`.', 'Halla los extremos locales y el punto de inflexión de `f(x) = x³ − 6x² + 9x + 1`.'),
      steps: [
        L('`f′(x) = 3x² − 12x + 9 = 3(x − 1)(x − 3)`. Critical points: x = 1 and x = 3.', '`f′(x) = 3x² − 12x + 9 = 3(x − 1)(x − 3)`. Puntos críticos: x = 1 y x = 3.'),
        L('`f″(x) = 6x − 12`. `f″(1) = −6 < 0` → local max, `f(1) = 1 − 6 + 9 + 1 = 5`.', '`f″(x) = 6x − 12`. `f″(1) = −6 < 0` → máximo local, `f(1) = 1 − 6 + 9 + 1 = 5`.'),
        L('`f″(3) = 6 > 0` → local min, `f(3) = 27 − 54 + 27 + 1 = 1`.', '`f″(3) = 6 > 0` → mínimo local, `f(3) = 27 − 54 + 27 + 1 = 1`.'),
        L('`f″ = 0` at x = 2 and changes sign there → inflection point `(2, f(2)) = (2, 3)`.', '`f″ = 0` en x = 2 y cambia de signo ahí → punto de inflexión `(2, f(2)) = (2, 3)`.'),
      ],
      answer: L('max `(1, 5)`, min `(3, 1)`, inflection `(2, 3)`', 'máx `(1, 5)`, mín `(3, 1)`, inflexión `(2, 3)`'),
    },
    real: [
      L('Inflection points mark where growth starts slowing down — in a pandemic curve, product adoption, or a company’s sales, that is often the most important moment to spot. Engineers find maximum stress on a beam the same way.',
        'Los puntos de inflexión marcan dónde el crecimiento empieza a desacelerar — en la curva de una pandemia, la adopción de un producto o las ventas de una empresa, suele ser el momento más importante de detectar. Los ingenieros hallan el esfuerzo máximo en una viga de la misma forma.'),
    ],
  },
  exercises: [
    { q: L('Find the critical number of f(x) = x² − 6x + 2.', 'Halla el número crítico de f(x) = x² − 6x + 2.'), answer: 3,
      hint: L('f′(x) = 2x − 6 = 0', 'f′(x) = 2x − 6 = 0') },
    { q: L('Find the local maximum VALUE of f(x) = x³ − 3x.', 'Halla el VALOR máximo local de f(x) = x³ − 3x.'), answer: 2,
      hint: L('f′ = 3x² − 3 = 0 at x = ±1; the max is at x = −1: f(−1) = −1 + 3.', 'f′ = 3x² − 3 = 0 en x = ±1; el máximo está en x = −1: f(−1) = −1 + 3.') },
    { q: L('At what x does f(x) = x³ − 6x² have an inflection point?', '¿En qué x tiene f(x) = x³ − 6x² un punto de inflexión?'), answer: 2,
      hint: L('f″(x) = 6x − 12 = 0', 'f″(x) = 6x − 12 = 0') },
  ],
},

// ─── 08 · Optimization & Related Rates ──────────────────────────────────────
{
  id: 'optimization', color: '#D88BD0',
  tag:  L('Best Possible · Linked Rates · MVT', 'Lo Mejor Posible · Razones Ligadas · TVM'),
  name: L('Optimization & Related Rates', 'Optimización y Razones Relacionadas'),
  graph() {
    const V = x => x * (12 - 2 * x) ** 2;
    const g = Graph({ x: [-0.4, 6.4], y: [-14, 160] });
    g.grid(1, 20).axes({ ticks: [1, 40] });
    g.area(V, 0, 6, { color: 1, delay: 1.3 });
    g.fn(V, { from: 0, to: 6, color: 1 });
    g.hline(128, { color: 3, delay: 1 });
    g.vline(2, { color: 3, delay: 1 });
    g.dot(2, 128, { color: 1, r: 6 });
    g.text(2, 128, 'V(2) = 128', { dx: 12, dy: -10, color: 3 });
    g.text(3.3, 95, 'V = x(12 − 2x)²', { color: 1, size: 11 });
    g.text(2.6, 40, 'V′(2) = 0', { color: 3, size: 11 });
    return g.svg();
  },
  formulas: [
    { label: L('Optimization Recipe', 'Receta de Optimización'), expr: 'objective → one variable → f′ = 0 → check',
      desc: L('Name variables, write the quantity to optimize, use the constraint to reduce to one variable, solve f′ = 0, verify (endpoints or f″).',
              'Nombra variables, escribe la cantidad a optimizar, usa la restricción para dejar una sola variable, resuelve f′ = 0, verifica (extremos o f″).') },
    { label: L('Related Rates', 'Razones Relacionadas'), expr: 'A = πr²  ⇒  dA/dt = 2πr · dr/dt',
      desc: L('Differentiate an equation linking quantities with respect to time t, then substitute the known values.',
              'Deriva respecto al tiempo t una ecuación que liga las cantidades, y luego sustituye los valores conocidos.') },
    { label: L('Mean Value Theorem', 'Teorema del Valor Medio'), expr: 'f′(c) = [f(b) − f(a)] / (b − a)',
      desc: L('For f continuous on [a, b] and differentiable inside, some instant c has slope equal to the average slope.',
              'Si f es continua en [a, b] y derivable adentro, en algún c la pendiente es igual a la pendiente promedio.') },
    { label: L('Linear Approximation', 'Aproximación Lineal'), expr: 'f(x) ≈ f(a) + f′(a)(x − a)',
      desc: L('Near a, replace the curve with its tangent line. Example: √4.1 ≈ 2 + ¼(0.1) = 2.025.',
              'Cerca de a, reemplaza la curva por su recta tangente. Ejemplo: √4.1 ≈ 2 + ¼(0.1) = 2.025.') },
  ],
  deep: {
    idea: [
      L('Optimization is calculus answering “what is the <b>best</b> choice?” — the biggest volume, the lowest cost, the shortest path. The best value hides at a critical point (or an endpoint), and the derivative finds it.',
        'La optimización es el cálculo respondiendo “¿cuál es la <b>mejor</b> opción?” — el mayor volumen, el menor costo, el camino más corto. El mejor valor se esconde en un punto crítico (o en un extremo), y la derivada lo encuentra.'),
      L('<b>Related rates</b> handle quantities that change together. If you know how fast one changes, the chain rule tells you how fast the other does: a ladder slides down a wall, a tank drains, a shadow grows.',
        'Las <b>razones relacionadas</b> tratan cantidades que cambian juntas. Si sabes qué tan rápido cambia una, la regla de la cadena te dice qué tan rápido cambia la otra: una escalera que resbala por una pared, un tanque que se vacía, una sombra que crece.'),
    ],
    why: [
      L('<b>Mean Value Theorem:</b> if you drive 120 miles in 2 hours (average 60 mph), at some instant your speedometer read exactly 60. Otherwise you would have been always faster or always slower than 60 — and could not average 60. Some states use this to give speeding tickets from toll-booth timestamps.',
        '<b>Teorema del Valor Medio:</b> si manejas 120 millas en 2 horas (promedio 60 mph), en algún instante el velocímetro marcó exactamente 60. Si no, habrías ido siempre más rápido o siempre más lento que 60 — y no podrías promediar 60. Algunos estados usan esto para multar por velocidad con las horas de los peajes.'),
      L('<b>Linear approximation</b> works because a differentiable curve looks straight when you zoom in far enough. Your calculator, physics engines and GPS all lean on this.',
        'La <b>aproximación lineal</b> funciona porque una curva derivable se ve recta si haces suficiente zoom. Tu calculadora, los motores de física y el GPS dependen de esto.'),
    ],
    mistakes: [
      L('Optimizing before reducing to one variable. Use the constraint first.', 'Optimizar antes de reducir a una variable. Usa la restricción primero.'),
      L('In related rates, plugging in numbers for changing quantities <i>before</i> differentiating — they become constants and their rates vanish.',
        'En razones relacionadas, sustituir números para las cantidades que cambian <i>antes</i> de derivar — se vuelven constantes y sus razones desaparecen.'),
      L('Ignoring the domain: a box cut cannot be negative or more than half the sheet.', 'Ignorar el dominio: el corte de una caja no puede ser negativo ni mayor que la mitad de la lámina.'),
      L('Forgetting units: `dA/dt` in cm²/s, not cm/s.', 'Olvidar las unidades: `dA/dt` en cm²/s, no cm/s.'),
    ],
    example: {
      prompt: L('A 12 × 12 inch sheet gets an x × x square cut from each corner and the sides folded up into an open box. What x gives the largest volume?',
                'A una lámina de 12 × 12 pulgadas se le corta un cuadrado de x × x en cada esquina y se doblan los lados para formar una caja abierta. ¿Qué x da el mayor volumen?'),
      steps: [
        L('Base is `(12 − 2x)` on each side, height x: `V(x) = x(12 − 2x)²`, with `0 ≤ x ≤ 6`.', 'La base mide `(12 − 2x)` por lado y la altura x: `V(x) = x(12 − 2x)²`, con `0 ≤ x ≤ 6`.'),
        L('Product + chain rule: `V′ = (12 − 2x)² + x·2(12 − 2x)(−2) = (12 − 2x)(12 − 6x)`.', 'Regla del producto + cadena: `V′ = (12 − 2x)² + x·2(12 − 2x)(−2) = (12 − 2x)(12 − 6x)`.'),
        L('`V′ = 0` at `x = 6` (no box: V = 0) or `x = 2`.', '`V′ = 0` en `x = 6` (sin caja: V = 0) o `x = 2`.'),
        L('Check: `V(0) = 0`, `V(6) = 0`, `V(2) = 2·8² = 128`. Largest at x = 2.', 'Comprueba: `V(0) = 0`, `V(6) = 0`, `V(2) = 2·8² = 128`. El mayor es en x = 2.'),
      ],
      answer: L('`x = 2` in, maximum volume `128 in³`', '`x = 2` pulg, volumen máximo `128 pulg³`'),
    },
    real: [
      L('Companies size cans to use the least metal, airlines plan routes to burn the least fuel, and light itself takes the path of least time (which is how Snell’s law of refraction is derived).',
        'Las empresas diseñan latas que usan el menor metal, las aerolíneas planean rutas que queman el menor combustible, y la luz misma toma el camino de menor tiempo (así se deduce la ley de refracción de Snell).'),
    ],
  },
  exercises: [
    { q: L('Two positive numbers add up to 20. What is the largest possible product?', 'Dos números positivos suman 20. ¿Cuál es el mayor producto posible?'), answer: 100,
      hint: L('P = x(20 − x); P′ = 20 − 2x = 0 → x = 10.', 'P = x(20 − x); P′ = 20 − 2x = 0 → x = 10.') },
    { q: L('A circle’s radius grows at 3 cm/s. How fast is the area growing when r = 5? (2 decimals or 30pi)', 'El radio de un círculo crece a 3 cm/s. ¿Qué tan rápido crece el área cuando r = 5? (2 decimales o 30pi)'), answer: 30 * Math.PI,
      hint: L('dA/dt = 2πr · dr/dt = 2π · 5 · 3', 'dA/dt = 2πr · dr/dt = 2π · 5 · 3') },
    { q: L('Use the tangent line of √x at x = 4 to estimate √4.1.', 'Usa la recta tangente de √x en x = 4 para estimar √4.1.'), answer: 2.025,
      hint: L('√4 + (1/(2√4))(0.1) = 2 + 0.025', '√4 + (1/(2√4))(0.1) = 2 + 0.025') },
  ],
},

// ─── 09 · L'Hôpital's Rule ──────────────────────────────────────────────────
{
  id: 'lhopital', color: '#E893C5',
  tag:  L('Indeterminate Forms · 0/0 · ∞/∞', 'Formas Indeterminadas · 0/0 · ∞/∞'),
  name: L('L’Hôpital’s Rule', 'Regla de L’Hôpital'),
  graph() {
    const f = x => Math.sin(x) / x;
    const g = Graph({ x: [-10, 10], y: [-0.5, 1.4] });
    g.grid(2, 0.5).axes({ ticks: [5, 0.5] });
    g.hline(1, { color: 3, delay: 0.3 });
    g.fn(f, { color: 1, samples: 500 });
    g.dot(0, 1, { color: 1, hollow: true, r: 5.5, delay: 1.6 });
    g.text(-9.6, 1.22, 'y = sin x / x', { color: 1 });
    g.text(0, 1, '→ 1', { dx: 12, dy: -8, color: 3 });
    g.text(3.5, -0.32, '(sin x)′/(x)′ = cos x / 1', { color: 2, size: 10, anchor: 'middle' });
    return g.svg();
  },
  formulas: [
    { label: L('L’Hôpital’s Rule', 'Regla de L’Hôpital'), expr: 'lim f/g = lim f′/g′   (0/0 or ∞/∞)',
      desc: L('Differentiate the top and the bottom separately — not the quotient rule — then take the limit again.',
              'Deriva el numerador y el denominador por separado — no la regla del cociente — y vuelve a tomar el límite.') },
    { label: L('Indeterminate Forms', 'Formas Indeterminadas'), expr: '0/0  ∞/∞  0·∞  ∞−∞  1^∞  0⁰  ∞⁰',
      desc: L('“Indeterminate” means the form alone does not decide the answer — two forces are competing.',
              '“Indeterminada” significa que la forma por sí sola no decide la respuesta — dos fuerzas compiten.') },
    { label: L('Products & Differences', 'Productos y Diferencias'), expr: '0·∞:  f·g = f / (1/g)',
      desc: L('Rewrite as a quotient first; for ∞ − ∞ combine into one fraction.', 'Reescribe como cociente primero; para ∞ − ∞ combina en una sola fracción.') },
    { label: L('Powers', 'Potencias'), expr: 'y = f^g  ⇒  ln y = g · ln f',
      desc: L('For 1^∞, 0⁰, ∞⁰: take ln, find that limit, then exponentiate the answer.',
              'Para 1^∞, 0⁰, ∞⁰: saca ln, halla ese límite y luego eleva e a la respuesta.') },
  ],
  deep: {
    idea: [
      L('When a limit lands on `0/0`, numerator and denominator are both racing to zero. The answer depends on <b>who is faster</b>. L’Hôpital’s rule compares their speeds — their derivatives.',
        'Cuando un límite da `0/0`, el numerador y el denominador corren ambos hacia cero. La respuesta depende de <b>quién es más rápido</b>. La regla de L’Hôpital compara sus velocidades — sus derivadas.'),
      L('The graph: `sin x / x` is undefined at 0, but sin x and x shrink at the same rate near 0, so the ratio heads to 1. L’Hôpital confirms it in one line: `cos 0 / 1 = 1`.',
        'La gráfica: `sen x / x` no está definida en 0, pero sen x y x se encogen al mismo ritmo cerca de 0, así que el cociente va hacia 1. L’Hôpital lo confirma en una línea: `cos 0 / 1 = 1`.'),
    ],
    why: [
      L('Near x = a, both functions look like their tangent lines: `f(x) ≈ f′(a)(x − a)` and `g(x) ≈ g′(a)(x − a)` (both pass through 0 at a). Divide: the `(x − a)` cancels, leaving `f′(a)/g′(a)`.',
        'Cerca de x = a, ambas funciones se parecen a sus rectas tangentes: `f(x) ≈ f′(a)(x − a)` y `g(x) ≈ g′(a)(x − a)` (ambas valen 0 en a). Divide: el `(x − a)` se cancela, y queda `f′(a)/g′(a)`.'),
      L('<b>Growth ranking</b> it proves: as x → ∞, `ln x ≪ xⁿ ≪ eˣ`. Any exponential eventually beats any power, and any power beats a logarithm.',
        '<b>Jerarquía de crecimiento</b> que demuestra: cuando x → ∞, `ln x ≪ xⁿ ≪ eˣ`. Cualquier exponencial acaba superando a cualquier potencia, y cualquier potencia supera al logaritmo.'),
    ],
    mistakes: [
      L('Using the quotient rule. L’Hôpital uses `f′/g′`, not `(f/g)′`.', 'Usar la regla del cociente. L’Hôpital usa `f′/g′`, no `(f/g)′`.'),
      L('Applying it when the form is not indeterminate: `lim(x→0) (x + 1)/(x + 2) = 1/2` directly; L’Hôpital would wrongly give 1.',
        'Aplicarla cuando la forma no es indeterminada: `lim(x→0) (x + 1)/(x + 2) = 1/2` directamente; L’Hôpital daría 1 por error.'),
      L('Forgetting to exponentiate back after taking ln in a power form.', 'Olvidar elevar e de vuelta después de sacar ln en una forma de potencia.'),
    ],
    example: {
      prompt: L('Evaluate `lim(x→∞) (1 + 3/x)ˣ`.', 'Evalúa `lim(x→∞) (1 + 3/x)ˣ`.'),
      steps: [
        L('Form `1^∞` — indeterminate. Let `y = (1 + 3/x)ˣ`, so `ln y = x·ln(1 + 3/x) = ln(1 + 3/x) / (1/x)`, a `0/0` form.',
          'Forma `1^∞` — indeterminada. Sea `y = (1 + 3/x)ˣ`, así `ln y = x·ln(1 + 3/x) = ln(1 + 3/x) / (1/x)`, una forma `0/0`.'),
        L('Differentiate top: `(−3/x²)/(1 + 3/x)`. Bottom: `−1/x²`.', 'Deriva arriba: `(−3/x²)/(1 + 3/x)`. Abajo: `−1/x²`.'),
        L('Ratio: `3/(1 + 3/x) → 3` as x → ∞. So `ln y → 3`.', 'Cociente: `3/(1 + 3/x) → 3` cuando x → ∞. Así `ln y → 3`.'),
        L('Exponentiate: `y → e³ ≈ 20.09`. (This is exactly continuous compounding at 300%!)', 'Eleva e: `y → e³ ≈ 20.09`. (¡Es exactamente capitalización continua al 300%!)'),
      ],
      answer: L('`e³ ≈ 20.09`', '`e³ ≈ 20.09`'),
    },
    real: [
      L('Programmers compare algorithms by limits like `lim n²/2ⁿ = 0` (the exponential one is much slower for big inputs). Physicists simplify formulas in limiting cases — e.g. relativity reducing to Newton when `v/c → 0`.',
        'Los programadores comparan algoritmos con límites como `lim n²/2ⁿ = 0` (el exponencial es mucho más lento para entradas grandes). Los físicos simplifican fórmulas en casos límite — por ejemplo, la relatividad se reduce a Newton cuando `v/c → 0`.'),
    ],
  },
  exercises: [
    { q: L('Find lim(x→0) sin(5x)/x.', 'Halla lim(x→0) sen(5x)/x.'), answer: 5,
      hint: L('L’Hôpital: 5cos(5x)/1 at x = 0.', 'L’Hôpital: 5cos(5x)/1 en x = 0.') },
    { q: L('Find lim(x→0) (eˣ − 1)/x.', 'Halla lim(x→0) (eˣ − 1)/x.'), answer: 1,
      hint: L('eˣ/1 at x = 0.', 'eˣ/1 en x = 0.') },
    { q: L('Find lim(x→0) (1 − cos x)/x².', 'Halla lim(x→0) (1 − cos x)/x².'), answer: 0.5,
      hint: L('Apply twice: sin x / 2x, then cos x / 2.', 'Aplícala dos veces: sen x / 2x, luego cos x / 2.') },
  ],
},

// ─── 10 · Riemann Sums ──────────────────────────────────────────────────────
{
  id: 'riemann', color: '#EBB2C3',
  tag:  L('Area by Rectangles', 'Área con Rectángulos'),
  name: L('Riemann Sums', 'Sumas de Riemann'),
  graph() {
    const f = x => 0.25 * x * x + 1, n = 8, dx = 4 / n;
    const g = Graph({ x: [-0.5, 4.6], y: [-0.5, 6] });
    g.grid(1).axes({ ticks: 1 });
    for (let i = 0; i < n; i++) {
      const xm = (i + 0.5) * dx;
      g.rect(i * dx, 0, dx, f(xm), { color: i % 2 ? 2 : 1, delay: 0.4 + i * 0.12 });
      g.dot(xm, f(xm), { color: 3, r: 2.5, delay: 1.4 + i * 0.05 });
    }
    g.fn(f, { color: 1 });
    g.text(-0.3, 5.5, 'f(x) = x²/4 + 1', { color: 1 });
    g.text(-0.3, 4.9, 'M₈ = 9.3125   ∫ = 9.333…', { color: 3, size: 11 });
    return g.svg();
  },
  formulas: [
    { label: L('Riemann Sum', 'Suma de Riemann'), expr: 'Σ<sub>i=1</sub><sup>n</sup> f(xᵢ*) · Δx,   Δx = (b − a)/n',
      desc: L('Chop [a, b] into n strips of width Δx and add up the rectangles: height f(xᵢ*) times width.',
              'Divide [a, b] en n franjas de ancho Δx y suma los rectángulos: altura f(xᵢ*) por ancho.') },
    { label: L('Left · Right · Midpoint', 'Izquierda · Derecha · Punto Medio'), expr: 'xᵢ* = a + (i − 1)Δx  ·  a + iΔx  ·  a + (i − ½)Δx',
      desc: L('Which point sets each height. Midpoint is usually the most accurate of the three.',
              'Qué punto fija cada altura. El punto medio suele ser el más preciso de los tres.') },
    { label: L('Definite Integral', 'Integral Definida'), expr: '∫<sub>a</sub><sup>b</sup> f(x) dx = lim<sub>n→∞</sub> Σ f(xᵢ*) Δx',
      desc: L('Infinitely many infinitely thin rectangles give the exact (signed) area. The ∫ is a stretched S for “sum”.',
              'Infinitos rectángulos infinitamente delgados dan el área exacta (con signo). La ∫ es una S estirada de “suma”.') },
    { label: L('Useful Sums', 'Sumas Útiles'), expr: 'Σi = n(n+1)/2     Σi² = n(n+1)(2n+1)/6',
      desc: L('These closed forms let you take the limit of a Riemann sum by hand.', 'Estas fórmulas cerradas permiten tomar a mano el límite de una suma de Riemann.') },
  ],
  deep: {
    idea: [
      L('Rectangles are easy: area = base × height. Curved regions are not. So we cheat: slice the region into thin vertical strips, pretend each strip is a rectangle, and add them up. The more strips, the smaller the error. In the limit of infinitely many, the error disappears — that limit is the <b>definite integral</b>.',
        'Los rectángulos son fáciles: área = base × altura. Las regiones curvas no. Así que hacemos trampa: cortamos la región en franjas verticales delgadas, fingimos que cada franja es un rectángulo y sumamos. Más franjas, menos error. En el límite de infinitas franjas, el error desaparece — ese límite es la <b>integral definida</b>.'),
      L('Area below the x-axis counts as <b>negative</b>, so the integral is a <i>net</i> (signed) area.', 'El área debajo del eje x cuenta como <b>negativa</b>, así que la integral es un área <i>neta</i> (con signo).'),
    ],
    why: [
      L('For an increasing function, left-endpoint rectangles sit under the curve (underestimate) and right-endpoint rectangles poke above it (overestimate). The true area is squeezed between them, and as n grows the two sums close in on the same number.',
        'Para una función creciente, los rectángulos con extremo izquierdo quedan bajo la curva (subestiman) y los de extremo derecho sobresalen (sobrestiman). El área real queda atrapada entre ellos, y al crecer n las dos sumas se acercan al mismo número.'),
      L('The midpoint rule is better because each rectangle’s overshoot on one side roughly cancels its undershoot on the other — on the left, 8 midpoint rectangles already give 9.31 against the exact 9.33.',
        'La regla del punto medio es mejor porque lo que cada rectángulo sobra de un lado casi se cancela con lo que le falta del otro — a la izquierda, 8 rectángulos de punto medio ya dan 9.31 frente al exacto 9.33.'),
    ],
    mistakes: [
      L('Forgetting to multiply by Δx (adding heights only).', 'Olvidar multiplicar por Δx (sumar solo alturas).'),
      L('Using the wrong endpoints: a left sum uses x₀ … xₙ₋₁, a right sum uses x₁ … xₙ.', 'Usar los extremos equivocados: la suma izquierda usa x₀ … xₙ₋₁, la derecha usa x₁ … xₙ.'),
      L('Confusing area with net area: `∫₀^2π sin x dx = 0`, even though the curve encloses real area.', 'Confundir área con área neta: `∫₀^2π sen x dx = 0`, aunque la curva encierra área real.'),
    ],
    example: {
      prompt: L('Estimate `∫₀² x² dx` with n = 4 using right and left endpoints, and compare with the exact value 8/3.',
                'Estima `∫₀² x² dx` con n = 4 usando extremos derechos e izquierdos, y compara con el valor exacto 8/3.'),
      steps: [
        L('`Δx = (2 − 0)/4 = 0.5`. Points: 0, 0.5, 1, 1.5, 2.', '`Δx = (2 − 0)/4 = 0.5`. Puntos: 0, 0.5, 1, 1.5, 2.'),
        L('Right: heights at 0.5, 1, 1.5, 2 → `0.25 + 1 + 2.25 + 4 = 7.5`, times 0.5 → `R₄ = 3.75`.', 'Derecha: alturas en 0.5, 1, 1.5, 2 → `0.25 + 1 + 2.25 + 4 = 7.5`, por 0.5 → `R₄ = 3.75`.'),
        L('Left: heights at 0, 0.5, 1, 1.5 → `0 + 0.25 + 1 + 2.25 = 3.5`, times 0.5 → `L₄ = 1.75`.', 'Izquierda: alturas en 0, 0.5, 1, 1.5 → `0 + 0.25 + 1 + 2.25 = 3.5`, por 0.5 → `L₄ = 1.75`.'),
        L('Exact: `8/3 ≈ 2.667`, between them as expected. Their average, 2.75 (the trapezoid rule), is already close.',
          'Exacto: `8/3 ≈ 2.667`, entre ambos como se esperaba. Su promedio, 2.75 (la regla del trapecio), ya está cerca.'),
      ],
      answer: L('`R₄ = 3.75`, `L₄ = 1.75`, exact `8/3 ≈ 2.667`', '`R₄ = 3.75`, `L₄ = 1.75`, exacto `8/3 ≈ 2.667`'),
    },
    real: [
      L('A car’s trip computer adds up speed × time every fraction of a second to get distance — a Riemann sum. Computers integrate this way whenever there is no formula: total rainfall from hourly readings, energy used from a power meter, dosage from a drug-concentration curve.',
        'La computadora de viaje de un carro suma velocidad × tiempo cada fracción de segundo para obtener la distancia — una suma de Riemann. Las computadoras integran así siempre que no hay fórmula: la lluvia total a partir de lecturas por hora, la energía usada a partir de un medidor, la dosis a partir de una curva de concentración.'),
    ],
  },
  exercises: [
    { q: L('Find Δx for [1, 9] split into n = 4 subintervals.', 'Halla Δx para [1, 9] dividido en n = 4 subintervalos.'), answer: 2,
      hint: L('(9 − 1)/4', '(9 − 1)/4') },
    { q: L('Compute the right Riemann sum of f(x) = x on [0, 4] with n = 4.', 'Calcula la suma de Riemann derecha de f(x) = x en [0, 4] con n = 4.'), answer: 10,
      hint: L('Δx = 1; heights f(1) + f(2) + f(3) + f(4).', 'Δx = 1; alturas f(1) + f(2) + f(3) + f(4).') },
    { q: L('Compute the left Riemann sum of f(x) = x² on [0, 3] with n = 3.', 'Calcula la suma de Riemann izquierda de f(x) = x² en [0, 3] con n = 3.'), answer: 5,
      hint: L('Δx = 1; heights f(0) + f(1) + f(2) = 0 + 1 + 4.', 'Δx = 1; alturas f(0) + f(1) + f(2) = 0 + 1 + 4.') },
  ],
},

// ─── 11 · Fundamental Theorem of Calculus ───────────────────────────────────
{
  id: 'ftc', color: '#F0C1A8',
  tag:  L('Derivatives ⇄ Integrals', 'Derivadas ⇄ Integrales'),
  name: L('Fundamental Theorem', 'Teorema Fundamental'),
  graph() {
    const f = t => 1 + 0.5 * t;
    const A = x => x + 0.25 * x * x;
    const X = 2.5;
    const g = Graph({ x: [-0.4, 4.4], y: [-0.4, 8.4] });
    g.grid(1).axes({ ticks: 1 });
    g.area(f, 0, X, { color: 1, delay: 0.9 });
    g.fn(f, { color: 1 });
    g.fn(A, { from: 0, to: 4.4, color: 2, delay: 0.5 });
    g.vline(X, { ghost: true, delay: 1 });
    g.dot(X, f(X), { color: 1 }).dot(X, A(X), { color: 2, r: 5.5 });
    g.fn(x => A(X) + f(X) * (x - X), { from: X - 1, to: X + 1, color: 3, thin: true, delay: 1.7 });
    g.text(3.3, 2.15, 'f(t)', { color: 1 });
    g.text(2.9, 7.4, 'A(x) = ∫₀ˣ f(t) dt', { color: 2, size: 11, anchor: 'middle' });
    g.text(X, A(X), L('slope of A = f(x)', 'pendiente de A = f(x)'), { dx: -150, dy: -14, color: 3, size: 10 });
    return g.svg();
  },
  formulas: [
    { label: L('FTC Part 1', 'TFC Parte 1'), expr: 'd/dx ∫<sub>a</sub><sup>x</sup> f(t) dt = f(x)',
      desc: L('The area-so-far function grows at a rate equal to the current height. Differentiation undoes integration.',
              'La función de área acumulada crece a un ritmo igual a la altura actual. Derivar deshace integrar.') },
    { label: L('FTC Part 2', 'TFC Parte 2'), expr: '∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a),   F′ = f',
      desc: L('To find an exact area, find any antiderivative and subtract its values at the ends. No limits of sums needed.',
              'Para hallar un área exacta, halla cualquier antiderivada y resta sus valores en los extremos. Sin límites de sumas.') },
    { label: L('Power Rule for Integrals', 'Regla de la Potencia para Integrales'), expr: '∫ xⁿ dx = xⁿ⁺¹/(n + 1) + C   (n ≠ −1)',
      desc: L('The reverse of the power rule: raise the exponent by one, divide by the new exponent. +C covers every antiderivative.',
              'Lo contrario de la regla de la potencia: sube el exponente en uno y divide entre el nuevo exponente. +C cubre todas las antiderivadas.') },
    { label: L('Properties', 'Propiedades'), expr: '∫<sub>a</sub><sup>b</sup> = −∫<sub>b</sub><sup>a</sup>     ∫<sub>a</sub><sup>b</sup> + ∫<sub>b</sub><sup>c</sup> = ∫<sub>a</sub><sup>c</sup>',
      desc: L('Integrals are linear too: ∫(c·f + g) = c∫f + ∫g.', 'Las integrales también son lineales: ∫(c·f + g) = c∫f + ∫g.') },
  ],
  deep: {
    idea: [
      L('For centuries, finding slopes (tangents) and finding areas looked like unrelated problems. Newton and Leibniz discovered they are <b>inverse operations</b>. That one fact turns every area problem into “find a function whose derivative is f” — usually a few lines of algebra.',
        'Durante siglos, hallar pendientes (tangentes) y hallar áreas parecían problemas sin relación. Newton y Leibniz descubrieron que son <b>operaciones inversas</b>. Ese solo hecho convierte cada problema de área en “halla una función cuya derivada sea f” — normalmente unas pocas líneas de álgebra.'),
      L('In the graph, the blue curve A(x) records the gold area accumulated from 0 to x. Its slope at x = 2.5 (pink) is exactly the gold height there, f(2.5) = 2.25.',
        'En la gráfica, la curva azul A(x) registra el área dorada acumulada de 0 a x. Su pendiente en x = 2.5 (rosa) es exactamente la altura dorada ahí, f(2.5) = 2.25.'),
    ],
    why: [
      L('Push x a tiny bit further, to x + h. The area grows by a thin strip of width h and height about f(x): `A(x + h) − A(x) ≈ f(x)·h`. Divide by h and let h → 0: `A′(x) = f(x)`. That is Part 1.',
        'Empuja x un poquito más, hasta x + h. El área crece una franja delgada de ancho h y altura cerca de f(x): `A(x + h) − A(x) ≈ f(x)·h`. Divide entre h y deja que h → 0: `A′(x) = f(x)`. Esa es la Parte 1.'),
      L('Part 2 follows: A and any other antiderivative F have the same derivative, so they differ by a constant. The constant cancels in `F(b) − F(a)`, which therefore equals `A(b) − A(a) = A(b)`, the area.',
        'La Parte 2 sigue: A y cualquier otra antiderivada F tienen la misma derivada, así que difieren en una constante. La constante se cancela en `F(b) − F(a)`, que por lo tanto es igual a `A(b) − A(a) = A(b)`, el área.'),
    ],
    mistakes: [
      L('Leaving off `+ C` on an indefinite integral.', 'Omitir el `+ C` en una integral indefinida.'),
      L('Subtracting in the wrong order: it is `F(top) − F(bottom)`.', 'Restar en el orden equivocado: es `F(arriba) − F(abajo)`.'),
      L('Applying the power rule to `∫ 1/x dx`: n = −1 would divide by 0. The answer is `ln|x| + C`.', 'Aplicar la regla de la potencia a `∫ 1/x dx`: n = −1 dividiría entre 0. La respuesta es `ln|x| + C`.'),
      L('Ignoring discontinuities: `∫₋₁¹ 1/x² dx` is not −2 (the function blows up at 0; the integral diverges).', 'Ignorar discontinuidades: `∫₋₁¹ 1/x² dx` no es −2 (la función explota en 0; la integral diverge).'),
    ],
    example: {
      prompt: L('Evaluate `∫₁³ (3x² − 2x) dx`.', 'Evalúa `∫₁³ (3x² − 2x) dx`.'),
      steps: [
        L('Antiderivative term by term: `F(x) = x³ − x²` (check: `F′ = 3x² − 2x` ✓).', 'Antiderivada término a término: `F(x) = x³ − x²` (comprueba: `F′ = 3x² − 2x` ✓).'),
        L('Top: `F(3) = 27 − 9 = 18`.', 'Arriba: `F(3) = 27 − 9 = 18`.'),
        L('Bottom: `F(1) = 1 − 1 = 0`.', 'Abajo: `F(1) = 1 − 1 = 0`.'),
        L('`F(3) − F(1) = 18 − 0 = 18`. No +C needed — it would cancel.', '`F(3) − F(1) = 18 − 0 = 18`. No hace falta +C — se cancelaría.'),
      ],
      answer: L('`18`', '`18`'),
    },
    real: [
      L('Total change = integral of the rate of change. Integrate velocity to get distance traveled, flow rate to get volume of water, power to get energy (that is literally what the kWh on your electric bill is), and marginal cost to get total cost.',
        'Cambio total = integral de la razón de cambio. Integra la velocidad para obtener la distancia recorrida, el caudal para obtener el volumen de agua, la potencia para obtener la energía (eso es literalmente el kWh de tu factura de luz), y el costo marginal para el costo total.'),
    ],
  },
  exercises: [
    { q: L('Evaluate ∫₀² 3x² dx.', 'Evalúa ∫₀² 3x² dx.'), answer: 8,
      hint: L('F(x) = x³; 2³ − 0³.', 'F(x) = x³; 2³ − 0³.') },
    { q: L('Evaluate ∫₁⁴ 2x dx.', 'Evalúa ∫₁⁴ 2x dx.'), answer: 15,
      hint: L('F(x) = x²; 16 − 1.', 'F(x) = x²; 16 − 1.') },
    { q: L('Let A(x) = ∫₀ˣ (t³ + 1) dt. Find A′(2).', 'Sea A(x) = ∫₀ˣ (t³ + 1) dt. Halla A′(2).'), answer: 9,
      hint: L('FTC Part 1: A′(x) = x³ + 1.', 'TFC Parte 1: A′(x) = x³ + 1.') },
  ],
},

// ─── 12 · Integration Techniques ────────────────────────────────────────────
{
  id: 'techniques', color: '#E8C99A',
  tag:  L('u-Substitution · By Parts', 'Sustitución · Por Partes'),
  name: L('Integration Techniques', 'Técnicas de Integración'),
  graph() {
    const f = x => 2 * x * Math.cos(x * x);
    const b = Math.sqrt(Math.PI / 2);
    const g = Graph({ x: [-0.2, 2.7], y: [-2.6, 2.2] });
    g.grid(0.5).axes({ ticks: 1 });
    g.area(f, 0, b, { color: 1, delay: 0.9 });
    g.fn(f, { color: 1, samples: 600 });
    g.fn(x => Math.sin(x * x), { color: 2, thin: true, delay: 0.6 });
    g.dot(b, 0, { color: 3 });
    g.text(0.1, 1.95, 'f = 2x·cos(x²)', { color: 1, size: 11 });
    g.text(1.6, 1.25, 'F = sin(x²)', { color: 2, size: 11 });
    g.text(0.35, 0.45, '= 1', { color: 3 });
    g.text(b, 0, '√(π/2)', { dx: -6, dy: 16, color: 3, size: 10, anchor: 'end' });
    return g.svg();
  },
  formulas: [
    { label: L('Basic Table', 'Tabla Básica'), expr: '∫eˣ = eˣ   ∫1/x = ln|x|   ∫cos x = sin x   ∫sin x = −cos x',
      desc: L('Every derivative rule read backwards is an integral rule (add + C).', 'Cada regla de derivación leída al revés es una regla de integración (más + C).') },
    { label: L('u-Substitution', 'Sustitución (cambio de variable)'), expr: '∫ f(g(x))·g′(x) dx = ∫ f(u) du',
      desc: L('The chain rule in reverse. Spot an inside function u whose derivative is also present.',
              'La regla de la cadena al revés. Busca una función interna u cuya derivada también aparezca.') },
    { label: L('Integration by Parts', 'Integración por Partes'), expr: '∫ u dv = u·v − ∫ v du',
      desc: L('The product rule in reverse. Trade a hard integral for an easier one.', 'La regla del producto al revés. Cambia una integral difícil por otra más fácil.') },
    { label: L('Choosing u: LIATE', 'Elegir u: LIATE'), expr: 'Log · Inverse trig · Algebraic · Trig · Exponential',
      desc: L('Pick u as whichever comes first in this list — it is the one that gets simpler when differentiated.',
              'Elige como u la que aparezca primero en esta lista — es la que se simplifica al derivarla.') },
  ],
  deep: {
    idea: [
      L('Differentiating is mechanical: there is a rule for everything. Integrating is detective work: you must recognize which derivative rule produced the function. The two main techniques are the two main derivative rules run backwards.',
        'Derivar es mecánico: hay una regla para todo. Integrar es trabajo de detective: hay que reconocer qué regla de derivación produjo la función. Las dos técnicas principales son las dos reglas principales de derivación al revés.'),
      L('In the graph, `2x·cos(x²)` looks scary, but `x²` is inside and its derivative `2x` is sitting right there. With `u = x²` it becomes `∫cos u du = sin u`, so the gold area equals `sin(π/2) − sin 0 = 1` exactly.',
        'En la gráfica, `2x·cos(x²)` parece difícil, pero `x²` está adentro y su derivada `2x` está ahí mismo. Con `u = x²` se vuelve `∫cos u du = sen u`, así que el área dorada es exactamente `sen(π/2) − sen 0 = 1`.'),
    ],
    why: [
      L('<b>By parts</b> from the product rule: `(uv)′ = u′v + uv′`. Integrate both sides: `uv = ∫v du + ∫u dv`. Rearrange: `∫u dv = uv − ∫v du`.',
        '<b>Por partes</b> desde la regla del producto: `(uv)′ = u′v + uv′`. Integra ambos lados: `uv = ∫v du + ∫u dv`. Reordena: `∫u dv = uv − ∫v du`.'),
      L('<b>u-sub</b> from the chain rule: `d/dx F(g(x)) = F′(g(x))·g′(x)`, so `∫F′(g(x))g′(x) dx = F(g(x)) + C`. Writing `u = g(x)` and `du = g′(x)dx` just makes that pattern visible.',
        '<b>Sustitución</b> desde la regla de la cadena: `d/dx F(g(x)) = F′(g(x))·g′(x)`, así que `∫F′(g(x))g′(x) dx = F(g(x)) + C`. Escribir `u = g(x)` y `du = g′(x)dx` solo hace visible ese patrón.'),
    ],
    mistakes: [
      L('In a definite u-sub, keeping the old x-limits. Change them to u-limits (or substitute back before evaluating).', 'En una sustitución definida, mantener los límites viejos de x. Cámbialos a límites de u (o regresa a x antes de evaluar).'),
      L('Leaving leftover x’s after substituting — every x must become u.', 'Dejar x sueltas después de sustituir — toda x debe convertirse en u.'),
      L('Choosing u badly in parts so the new integral is harder (u = eˣ in ∫x·eˣ dx).', 'Elegir mal u en partes, de modo que la nueva integral es más difícil (u = eˣ en ∫x·eˣ dx).'),
      L('`∫f·g ≠ ∫f · ∫g`. There is no simple product rule for integrals.', '`∫f·g ≠ ∫f · ∫g`. No hay una regla simple del producto para integrales.'),
    ],
    example: {
      prompt: L('Find `∫ x·eˣ dx`.', 'Halla `∫ x·eˣ dx`.'),
      steps: [
        L('LIATE: algebraic (x) comes before exponential, so `u = x`, `dv = eˣ dx`.', 'LIATE: algebraica (x) va antes que exponencial, así que `u = x`, `dv = eˣ dx`.'),
        L('Then `du = dx` and `v = eˣ`.', 'Entonces `du = dx` y `v = eˣ`.'),
        L('Parts: `x·eˣ − ∫eˣ dx = x·eˣ − eˣ + C = eˣ(x − 1) + C`.', 'Partes: `x·eˣ − ∫eˣ dx = x·eˣ − eˣ + C = eˣ(x − 1) + C`.'),
        L('Check by differentiating: `eˣ(x − 1) + eˣ = x·eˣ` ✓.', 'Comprueba derivando: `eˣ(x − 1) + eˣ = x·eˣ` ✓.'),
      ],
      answer: L('`eˣ(x − 1) + C`', '`eˣ(x − 1) + C`'),
    },
    real: [
      L('Physics: work, center of mass and moments of inertia need these techniques. Probability: expected values of continuous distributions are integrated by parts. Engineering: the Laplace transform used to design circuits and control systems is built on integration by parts.',
        'Física: el trabajo, el centro de masa y los momentos de inercia requieren estas técnicas. Probabilidad: los valores esperados de distribuciones continuas se integran por partes. Ingeniería: la transformada de Laplace que se usa para diseñar circuitos y sistemas de control se basa en la integración por partes.'),
    ],
  },
  exercises: [
    { q: L('Evaluate ∫₀¹ 2x(x² + 1)³ dx.', 'Evalúa ∫₀¹ 2x(x² + 1)³ dx.'), answer: 3.75,
      hint: L('u = x² + 1 runs from 1 to 2: ∫₁² u³ du = (16 − 1)/4.', 'u = x² + 1 va de 1 a 2: ∫₁² u³ du = (16 − 1)/4.') },
    { q: L('Evaluate ∫₀^π sin x dx.', 'Evalúa ∫₀^π sen x dx.'), answer: 2,
      hint: L('[−cos x] from 0 to π = 1 − (−1).', '[−cos x] de 0 a π = 1 − (−1).') },
    { q: L('Evaluate ∫₀¹ x·eˣ dx.', 'Evalúa ∫₀¹ x·eˣ dx.'), answer: 1,
      hint: L('[eˣ(x − 1)] from 0 to 1 = 0 − (−1).', '[eˣ(x − 1)] de 0 a 1 = 0 − (−1).') },
  ],
},

// ─── 13 · Area & Volume ─────────────────────────────────────────────────────
{
  id: 'area-volume', color: '#ADC6E5',
  tag:  L('Slice · Approximate · Integrate', 'Rebanar · Aproximar · Integrar'),
  name: L('Area & Volume', 'Área y Volumen'),
  graph() {
    const top = x => 2 * x, bot = x => x * x;
    const g = Graph({ x: [-0.4, 2.6], y: [-0.4, 5] });
    g.grid(0.5).axes({ ticks: 1 });
    g.area(top, 0, 2, { lower: bot, color: 1, delay: 0.9 });
    g.fn(top, { color: 1 });
    g.fn(bot, { color: 2, delay: 0.4 });
    const xs = 1.2, w = 0.08;
    g.rect(xs - w / 2, bot(xs), w, top(xs) - bot(xs), { color: 2, delay: 1.6 });
    g.dot(0, 0, { color: 3 }).dot(2, 4, { color: 3 });
    g.text(1.75, 4.6, 'y = 2x', { color: 1 });
    g.text(2.1, 3.2, 'y = x²', { color: 2 });
    g.text(xs, top(xs), 'dx', { dx: 8, dy: -4, color: 2, size: 10 });
    g.text(0.75, 0.12, 'A = ∫₀² (2x − x²) dx = 4/3', { color: 3, size: 11 });
    return g.svg();
  },
  formulas: [
    { label: L('Area Between Curves', 'Área Entre Curvas'), expr: 'A = ∫<sub>a</sub><sup>b</sup> [top(x) − bottom(x)] dx',
      desc: L('Find where the curves cross for the limits; subtract the lower curve from the upper one.',
              'Halla dónde se cruzan las curvas para los límites; resta la curva de abajo de la de arriba.') },
    { label: L('Disk Method', 'Método de Discos'), expr: 'V = π ∫<sub>a</sub><sup>b</sup> [R(x)]² dx',
      desc: L('Spin a region around an axis: each thin slice is a coin of radius R and thickness dx.',
              'Gira una región alrededor de un eje: cada rebanada delgada es una moneda de radio R y grosor dx.') },
    { label: L('Washer Method', 'Método de Arandelas'), expr: 'V = π ∫<sub>a</sub><sup>b</sup> (R² − r²) dx',
      desc: L('When the solid has a hole: outer disk minus inner disk. Note R² − r², not (R − r)².',
              'Cuando el sólido tiene un hueco: disco exterior menos disco interior. Ojo: R² − r², no (R − r)².') },
    { label: L('Average Value', 'Valor Promedio'), expr: 'f<sub>avg</sub> = 1/(b − a) · ∫<sub>a</sub><sup>b</sup> f(x) dx',
      desc: L('The height of the rectangle with the same area as the region under f.', 'La altura del rectángulo que tiene la misma área que la región bajo f.') },
  ],
  deep: {
    idea: [
      L('Every application of integrals follows the same three steps: <b>slice</b> the thing into thin pieces, <b>approximate</b> one piece with a simple formula, and <b>integrate</b> to add infinitely many of them. For area between curves, a slice is a thin rectangle of height `top − bottom` (the blue strip on the left).',
        'Toda aplicación de las integrales sigue los mismos tres pasos: <b>rebanar</b> el objeto en piezas delgadas, <b>aproximar</b> una pieza con una fórmula simple e <b>integrar</b> para sumar infinitas piezas. Para el área entre curvas, una rebanada es un rectángulo delgado de altura `arriba − abajo` (la franja azul de la izquierda).'),
      L('For volumes of revolution, spin the region around an axis. Each slice becomes a thin disk (a coin) with volume `πR²·dx`.',
        'Para volúmenes de revolución, gira la región alrededor de un eje. Cada rebanada se vuelve un disco delgado (una moneda) de volumen `πR²·dx`.'),
    ],
    why: [
      L('<b>Sanity check — the sphere:</b> spin `y = √(r² − x²)` around the x-axis from −r to r. `V = π∫(r² − x²) dx = π[r²x − x³/3]` from −r to r `= (4/3)πr³`. The formula you memorized in geometry falls right out.',
        '<b>Comprobación — la esfera:</b> gira `y = √(r² − x²)` alrededor del eje x de −r a r. `V = π∫(r² − x²) dx = π[r²x − x³/3]` de −r a r `= (4/3)πr³`. La fórmula que memorizaste en geometría sale sola.'),
      L('The same slicing idea gives arc length, surface area, work to pump water out of a tank, and the force of water on a dam.',
        'La misma idea de rebanar da la longitud de arco, el área de superficie, el trabajo para bombear agua de un tanque y la fuerza del agua sobre una represa.'),
    ],
    mistakes: [
      L('Subtracting in the wrong order and getting a negative area. Sketch first to see which curve is on top.', 'Restar en el orden equivocado y obtener un área negativa. Haz un dibujo primero para ver qué curva está arriba.'),
      L('Guessing the limits instead of solving top = bottom for the intersection points.', 'Adivinar los límites en lugar de resolver arriba = abajo para los puntos de intersección.'),
      L('Writing `(R − r)²` instead of `R² − r²` in the washer method.', 'Escribir `(R − r)²` en lugar de `R² − r²` en el método de arandelas.'),
      L('Forgetting the π in disk and washer volumes.', 'Olvidar la π en los volúmenes de discos y arandelas.'),
    ],
    example: {
      prompt: L('Find the volume of the solid formed by rotating `y = √x`, 0 ≤ x ≤ 4, around the x-axis.', 'Halla el volumen del sólido que se forma al girar `y = √x`, 0 ≤ x ≤ 4, alrededor del eje x.'),
      steps: [
        L('Each slice is a disk with radius `R(x) = √x`.', 'Cada rebanada es un disco de radio `R(x) = √x`.'),
        L('`V = π∫₀⁴ (√x)² dx = π∫₀⁴ x dx`.', '`V = π∫₀⁴ (√x)² dx = π∫₀⁴ x dx`.'),
        L('`= π[x²/2]₀⁴ = π(8 − 0) = 8π`.', '`= π[x²/2]₀⁴ = π(8 − 0) = 8π`.'),
        L('`8π ≈ 25.13` cubic units — the shape of a bullet nose (a paraboloid).', '`8π ≈ 25.13` unidades cúbicas — la forma de la punta de una bala (un paraboloide).'),
      ],
      answer: L('`V = 8π ≈ 25.13`', '`V = 8π ≈ 25.13`'),
    },
    real: [
      L('Engineers compute the volume of tanks, domes and wine barrels this way. 3D printers literally build objects slice by slice, and CT scanners reconstruct organs from cross-sections — the slicing idea made physical. Average value gives things like average temperature over a day.',
        'Los ingenieros calculan así el volumen de tanques, cúpulas y barriles. Las impresoras 3D construyen objetos literalmente rebanada por rebanada, y los tomógrafos (CT) reconstruyen órganos a partir de cortes — la idea de rebanar hecha realidad. El valor promedio da cosas como la temperatura promedio de un día.'),
    ],
  },
  exercises: [
    { q: L('Find the area between y = x and y = x² from x = 0 to x = 1. (decimal or fraction)', 'Halla el área entre y = x y y = x² de x = 0 a x = 1. (decimal o fracción)'), answer: 1 / 6,
      hint: L('∫₀¹ (x − x²) dx = 1/2 − 1/3', '∫₀¹ (x − x²) dx = 1/2 − 1/3') },
    { q: L('Rotate y = x, 0 ≤ x ≤ 3, around the x-axis. Find the volume. (2 decimals or 9pi)', 'Gira y = x, 0 ≤ x ≤ 3, alrededor del eje x. Halla el volumen. (2 decimales o 9pi)'), answer: 9 * Math.PI,
      hint: L('π∫₀³ x² dx = π · 27/3 (a cone!)', 'π∫₀³ x² dx = π · 27/3 (¡un cono!)') },
    { q: L('Find the average value of f(x) = x² on [0, 3].', 'Halla el valor promedio de f(x) = x² en [0, 3].'), answer: 3,
      hint: L('(1/3) · ∫₀³ x² dx = (1/3) · 9', '(1/3) · ∫₀³ x² dx = (1/3) · 9') },
  ],
},

// ─── 14 · Differential Equations ────────────────────────────────────────────
{
  id: 'diff-eq', color: '#9FD3D8',
  tag:  L('Equations About Rates', 'Ecuaciones Sobre Razones'),
  name: L('Differential Equations', 'Ecuaciones Diferenciales'),
  graph() {
    const g = Graph({ x: [-2, 4], y: [-3, 3] });
    g.grid(1).axes({ ticks: 1 });
    // Slope field for y′ = x − y: a short segment at each grid point
    for (let x = -1.75; x <= 3.8; x += 0.5) {
      for (let y = -2.75; y <= 2.8; y += 0.5) {
        const m = x - y, len = 0.17 / Math.sqrt(1 + m * m);
        g.line(x - len, y - m * len, x + len, y + m * len, { ghost: true, delay: 0.1 });
      }
    }
    [-2, -1, 1, 2.5].forEach((C, i) => g.fn(x => x - 1 + C * Math.exp(-x), { color: i % 2 ? 3 : 2, thin: true, delay: 0.6 + i * 0.2 }));
    g.fn(x => x - 1, { color: 1, delay: 0.4 });
    g.text(-1.9, 2.65, 'dy/dx = x − y', { color: 1 });
    g.text(2.2, 0.75, 'y = x − 1', { color: 1, size: 11 });
    return g.svg();
  },
  formulas: [
    { label: L('Differential Equation', 'Ecuación Diferencial'), expr: 'dy/dx = f(x, y)',
      desc: L('An equation for an unknown function written in terms of its derivative. The general solution has a +C; an initial condition picks one curve.',
              'Una ecuación para una función desconocida escrita en términos de su derivada. La solución general tiene un +C; una condición inicial elige una curva.') },
    { label: L('Separation of Variables', 'Separación de Variables'), expr: 'dy/dx = g(x)·h(y)  ⇒  ∫ dy/h(y) = ∫ g(x) dx',
      desc: L('Get every y on one side and every x on the other, then integrate both sides.',
              'Pasa toda y a un lado y toda x al otro, y luego integra ambos lados.') },
    { label: L('Exponential Growth & Decay', 'Crecimiento y Decaimiento Exponencial'), expr: 'dy/dt = k·y  ⇒  y = y₀·eᵏᵗ',
      desc: L('Rate proportional to amount. k > 0 grows, k < 0 decays; half-life = ln 2 / |k|.',
              'Razón proporcional a la cantidad. k > 0 crece, k < 0 decae; vida media = ln 2 / |k|.') },
    { label: L('Slope Fields & Euler’s Method', 'Campos de Pendientes y Método de Euler'), expr: 'yₙ₊₁ = yₙ + h · f(xₙ, yₙ)',
      desc: L('The equation gives a slope at every point (the little segments). Follow them in small steps h to approximate a solution.',
              'La ecuación da una pendiente en cada punto (los segmentitos). Síguelos en pasos pequeños h para aproximar una solución.') },
  ],
  deep: {
    idea: [
      L('Nature usually tells us how things <b>change</b>, not what they are. “Bacteria grow in proportion to how many there are.” “Hot coffee cools faster the hotter it is.” Those are statements about derivatives — differential equations. Solving one means finding the function that obeys the rule.',
        'La naturaleza normalmente nos dice cómo <b>cambian</b> las cosas, no qué son. “Las bacterias crecen en proporción a cuántas hay.” “El café caliente se enfría más rápido mientras más caliente está.” Esas son afirmaciones sobre derivadas — ecuaciones diferenciales. Resolver una significa hallar la función que obedece la regla.'),
      L('The graph is a <b>slope field</b> for `dy/dx = x − y`: at each point a tiny segment shows the slope a solution must have there. Every solution curve flows along the segments, and all of them get pulled toward the straight solution `y = x − 1`.',
        'La gráfica es un <b>campo de pendientes</b> para `dy/dx = x − y`: en cada punto un segmentito muestra la pendiente que debe tener ahí una solución. Toda curva solución fluye a lo largo de los segmentos, y todas son atraídas hacia la solución recta `y = x − 1`.'),
    ],
    why: [
      L('<b>Why `y′ = ky` gives an exponential:</b> separate: `dy/y = k dt`. Integrate: `ln|y| = kt + C`. Exponentiate: `y = e^C·eᵏᵗ = y₀eᵏᵗ`. The only function whose rate is proportional to itself is an exponential — which is why exponentials are everywhere in nature.',
        '<b>Por qué `y′ = ky` da una exponencial:</b> separa: `dy/y = k dt`. Integra: `ln|y| = kt + C`. Eleva e: `y = e^C·eᵏᵗ = y₀eᵏᵗ`. La única función cuya razón es proporcional a sí misma es una exponencial — por eso las exponenciales están en toda la naturaleza.'),
      L('<b>Euler’s method</b> is the slope field turned into an algorithm: stand at a point, read the slope, step a little along the tangent line, repeat. Smaller steps → better accuracy. Weather models and video-game physics run on refined versions of this.',
        'El <b>método de Euler</b> es el campo de pendientes convertido en algoritmo: párate en un punto, lee la pendiente, avanza un poco por la recta tangente, repite. Pasos más pequeños → más precisión. Los modelos del tiempo y la física de los videojuegos usan versiones refinadas de esto.'),
    ],
    mistakes: [
      L('Adding +C only at the very end, after exponentiating. Add it when you integrate; it becomes a multiplying constant later.', 'Añadir +C solo al final, después de elevar e. Añádelo al integrar; luego se convierte en una constante que multiplica.'),
      L('Dividing by y and losing the solution `y = 0`.', 'Dividir entre y y perder la solución `y = 0`.'),
      L('Using the initial condition before finding the general solution.', 'Usar la condición inicial antes de hallar la solución general.'),
    ],
    example: {
      prompt: L('Solve `dy/dx = 2xy` with `y(0) = 3`, then find `y(1)`.', 'Resuelve `dy/dx = 2xy` con `y(0) = 3`, y luego halla `y(1)`.'),
      steps: [
        L('Separate: `dy/y = 2x dx`.', 'Separa: `dy/y = 2x dx`.'),
        L('Integrate: `ln|y| = x² + C`.', 'Integra: `ln|y| = x² + C`.'),
        L('Exponentiate: `y = A·e^(x²)` (A = ±e^C).', 'Eleva e: `y = A·e^(x²)` (A = ±e^C).'),
        L('Initial condition: `3 = A·e⁰` → `A = 3`. So `y = 3e^(x²)` and `y(1) = 3e ≈ 8.155`.', 'Condición inicial: `3 = A·e⁰` → `A = 3`. Así `y = 3e^(x²)` y `y(1) = 3e ≈ 8.155`.'),
      ],
      answer: L('`y = 3e^(x²)`, `y(1) = 3e ≈ 8.155`', '`y = 3e^(x²)`, `y(1) = 3e ≈ 8.155`'),
    },
    real: [
      L('Carbon-14 dating, Newton’s law of cooling (forensics uses it to estimate time of death), population models, epidemics (the SIR model), electrical circuits, and Newton’s second law `F = m·x″` itself — most of physics and engineering is written in differential equations.',
        'La datación con carbono-14, la ley de enfriamiento de Newton (la ciencia forense la usa para estimar la hora de muerte), los modelos de población, las epidemias (el modelo SIR), los circuitos eléctricos y la segunda ley de Newton `F = m·x″` — casi toda la física y la ingeniería está escrita en ecuaciones diferenciales.'),
    ],
  },
  exercises: [
    { q: L('y′ = 0.03y with y(0) = 100. Find y(10). (2 decimals)', 'y′ = 0.03y con y(0) = 100. Halla y(10). (2 decimales)'), answer: 100 * Math.exp(0.3),
      hint: L('y = 100·e^(0.03·10) = 100·e^0.3', 'y = 100·e^(0.03·10) = 100·e^0.3') },
    { q: L('A substance decays with y′ = −0.1y. Find its half-life. (2 decimals)', 'Una sustancia decae con y′ = −0.1y. Halla su vida media. (2 decimales)'), answer: Math.log(2) / 0.1,
      hint: L('ln 2 / 0.1', 'ln 2 / 0.1') },
    { q: L('y′ = x + y, y(0) = 1. Take one Euler step with h = 0.1. What is y(0.1)?', 'y′ = x + y, y(0) = 1. Da un paso de Euler con h = 0.1. ¿Cuánto vale y(0.1)?'), answer: 1.1,
      hint: L('1 + 0.1·(0 + 1)', '1 + 0.1·(0 + 1)') },
  ],
},

// ─── 15 · Taylor Series ─────────────────────────────────────────────────────
{
  id: 'taylor', color: '#CBD8E8',
  tag:  L('Functions as Infinite Polynomials', 'Funciones como Polinomios Infinitos'),
  name: L('Taylor Series', 'Series de Taylor'),
  graph() {
    const g = Graph({ x: [-6.6, 6.6], y: [-2.6, 2.6] });
    g.grid(1).axes({ ticks: [2, 1] });
    const T1 = x => x, T3 = x => x - x ** 3 / 6, T5 = x => T3(x) + x ** 5 / 120, T7 = x => T5(x) - x ** 7 / 5040;
    g.fn(T1, { ghost: true, delay: 0.3 });
    g.fn(T3, { color: 2, thin: true, delay: 0.6 });
    g.fn(T5, { color: 3, thin: true, delay: 0.9 });
    g.fn(T7, { color: 2, delay: 1.2 });
    g.fn(Math.sin, { color: 1 });
    g.text(-6.4, 2.3, 'sin x', { color: 1 });
    g.text(-6.4, 1.85, 'x − x³/3! + x⁵/5! − x⁷/7!', { color: 2, size: 10 });
    return g.svg();
  },
  formulas: [
    { label: L('Taylor Series', 'Serie de Taylor'), expr: 'f(x) = Σ<sub>n=0</sub><sup>∞</sup> f⁽ⁿ⁾(a)/n! · (x − a)ⁿ',
      desc: L('A polynomial whose derivatives at a all match f’s. Centered at a = 0 it is called a Maclaurin series.',
              'Un polinomio cuyas derivadas en a coinciden todas con las de f. Centrada en a = 0 se llama serie de Maclaurin.') },
    { label: L('Exponential', 'Exponencial'), expr: 'eˣ = 1 + x + x²/2! + x³/3! + …',
      desc: L('Valid for every x. Plug in x = 1 to compute e = 1 + 1 + 1/2 + 1/6 + 1/24 + … ≈ 2.71828.',
              'Válida para todo x. Sustituye x = 1 para calcular e = 1 + 1 + 1/2 + 1/6 + 1/24 + … ≈ 2.71828.') },
    { label: L('Sine & Cosine', 'Seno y Coseno'), expr: 'sin x = x − x³/3! + x⁵/5! − …    cos x = 1 − x²/2! + x⁴/4! − …',
      desc: L('Sine keeps the odd powers, cosine the even ones. Each extra term hugs the curve farther from 0 (see the graph).',
              'El seno conserva las potencias impares, el coseno las pares. Cada término extra se ajusta a la curva más lejos del 0 (mira la gráfica).') },
    { label: L('Ratio Test', 'Criterio del Cociente'), expr: 'lim |aₙ₊₁ / aₙ| < 1  ⇒  converges',
      desc: L('Decides for which x a series adds up to a finite number (its interval of convergence).',
              'Decide para qué x una serie suma un número finito (su intervalo de convergencia).') },
  ],
  deep: {
    idea: [
      L('Polynomials are the easiest functions to compute — just multiply and add. Taylor’s idea: approximate a hard function (sin, eˣ, ln) by a polynomial that matches its value, slope, curvature and every higher derivative at one point. Add more terms and the match extends farther.',
        'Los polinomios son las funciones más fáciles de calcular — solo multiplicar y sumar. La idea de Taylor: aproximar una función difícil (sen, eˣ, ln) con un polinomio que coincida con su valor, pendiente, curvatura y todas las derivadas superiores en un punto. Agrega más términos y la coincidencia llega más lejos.'),
      L('In the graph, the gold curve is sin x. The straight line `x` matches it only near 0; adding `−x³/6` bends to follow the first hump; by `x⁷/7!` the polynomial is nearly indistinguishable from sine across a whole period.',
        'En la gráfica, la curva dorada es sen x. La recta `x` coincide solo cerca de 0; al agregar `−x³/6` se dobla para seguir la primera ondulación; con `x⁷/7!` el polinomio casi no se distingue del seno en todo un periodo.'),
    ],
    why: [
      L('<b>Where the coefficients come from:</b> suppose `f(x) = c₀ + c₁x + c₂x² + c₃x³ + …`. Plug in 0: `c₀ = f(0)`. Differentiate once and plug in 0: `c₁ = f′(0)`. Twice: `2c₂ = f″(0)`. n times: `n!·cₙ = f⁽ⁿ⁾(0)`. So `cₙ = f⁽ⁿ⁾(0)/n!`.',
        '<b>De dónde salen los coeficientes:</b> supón `f(x) = c₀ + c₁x + c₂x² + c₃x³ + …`. Sustituye 0: `c₀ = f(0)`. Deriva una vez y sustituye 0: `c₁ = f′(0)`. Dos veces: `2c₂ = f″(0)`. n veces: `n!·cₙ = f⁽ⁿ⁾(0)`. Así `cₙ = f⁽ⁿ⁾(0)/n!`.'),
      L('<b>A beautiful consequence:</b> plug `iθ` into the series for eˣ, separate real and imaginary parts, and you get the series for cos θ and sin θ: `e^(iθ) = cos θ + i sin θ` — Euler’s formula from Pre-Calculus, now proven.',
        '<b>Una consecuencia hermosa:</b> sustituye `iθ` en la serie de eˣ, separa la parte real y la imaginaria, y obtienes las series de cos θ y sen θ: `e^(iθ) = cos θ + i sen θ` — la fórmula de Euler de Precálculo, ahora demostrada.'),
    ],
    mistakes: [
      L('Forgetting the factorials: the x³ term of eˣ is `x³/6`, not `x³/3`.', 'Olvidar los factoriales: el término x³ de eˣ es `x³/6`, no `x³/3`.'),
      L('Trusting a few terms far from the center — accuracy drops quickly away from a.', 'Confiar en pocos términos lejos del centro — la precisión cae rápido lejos de a.'),
      L('Ignoring the interval of convergence: the series for `ln(1 + x)` only works for `−1 < x ≤ 1`.', 'Ignorar el intervalo de convergencia: la serie de `ln(1 + x)` solo funciona para `−1 < x ≤ 1`.'),
      L('Assuming terms → 0 means the series converges. The harmonic series `1 + ½ + ⅓ + …` diverges.', 'Suponer que si los términos → 0 la serie converge. La serie armónica `1 + ½ + ⅓ + …` diverge.'),
    ],
    example: {
      prompt: L('Approximate `e^0.1` with the first three terms of the Maclaurin series and estimate the error.', 'Aproxima `e^0.1` con los tres primeros términos de la serie de Maclaurin y estima el error.'),
      steps: [
        L('`eˣ ≈ 1 + x + x²/2`.', '`eˣ ≈ 1 + x + x²/2`.'),
        L('At x = 0.1: `1 + 0.1 + 0.01/2 = 1.105`.', 'En x = 0.1: `1 + 0.1 + 0.01/2 = 1.105`.'),
        L('True value: `e^0.1 ≈ 1.105171`. Error ≈ `0.000171`.', 'Valor real: `e^0.1 ≈ 1.105171`. Error ≈ `0.000171`.'),
        L('The first skipped term, `0.1³/3! ≈ 0.000167`, predicts the error almost perfectly.', 'El primer término omitido, `0.1³/3! ≈ 0.000167`, predice el error casi perfectamente.'),
      ],
      answer: L('`e^0.1 ≈ 1.105` (error ≈ 0.00017)', '`e^0.1 ≈ 1.105` (error ≈ 0.00017)'),
    },
    real: [
      L('Calculators and computers evaluate sin, cos, eˣ and ln with polynomial approximations built from these ideas. Physicists use `sin θ ≈ θ` (the first Taylor term) to solve the pendulum, and Einstein’s `E = mc²` appears as the first term of a Taylor expansion of relativistic energy.',
        'Las calculadoras y computadoras evalúan sen, cos, eˣ y ln con aproximaciones polinómicas construidas con estas ideas. Los físicos usan `sen θ ≈ θ` (el primer término de Taylor) para resolver el péndulo, y el `E = mc²` de Einstein aparece como el primer término de un desarrollo de Taylor de la energía relativista.'),
    ],
  },
  exercises: [
    { q: L('What is the coefficient of x³ in the Maclaurin series of eˣ? (decimal or fraction)', '¿Cuál es el coeficiente de x³ en la serie de Maclaurin de eˣ? (decimal o fracción)'), answer: 1 / 6,
      hint: L('1/3!', '1/3!') },
    { q: L('Approximate sin(0.2) with x − x³/6. (4 decimals)', 'Aproxima sen(0.2) con x − x³/6. (4 decimales)'), answer: 0.1987,
      hint: L('0.2 − 0.008/6', '0.2 − 0.008/6') },
    { q: L('Find 1 + 1 + 1/2! + 1/3! + 1/4! + … (2 decimals)', 'Halla 1 + 1 + 1/2! + 1/3! + 1/4! + … (2 decimales)'), answer: Math.E,
      hint: L('It is the series for eˣ at x = 1.', 'Es la serie de eˣ en x = 1.') },
  ],
},

];

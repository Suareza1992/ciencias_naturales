// ═══════════════════════════════════════════════════════════════════════════
// Pre-Calculus topics — pure data, rendered by shared/explorer.js.
//
// Each topic:
//   id, color      → anchor id + atmospheric tint / exercise dot
//   tag, name      → eyebrow + big heading
//   graph()        → returns an SVG string built with Graph() (shared/graph.js)
//   formulas[]     → cards revealed while scrolling { label, expr, desc }
//   deep           → the Deep Dive: idea[], why[], mistakes[], example{}, real[]
//   exercises[]    → { q, answer (number), hint }
//
// L(en, es) is shorthand for a bilingual value. `backticks` = inline math.
// ═══════════════════════════════════════════════════════════════════════════

const L = (en, es) => ({ en, es });

const PRECALC_TOPICS = [

// ─── 01 · Functions ─────────────────────────────────────────────────────────
{
  id: 'functions', color: '#3785D8',
  tag:  L('Inputs → Outputs · The Foundation', 'Entradas → Salidas · La Base'),
  name: L('Functions', 'Funciones'),
  graph() {
    const g = Graph({ x: [-0.6, 3.6], y: [-0.6, 3.6] });
    g.grid(0.5).axes({ ticks: 1 });
    g.line(-0.6, -0.6, 3.6, 3.6, { dash: true, ghost: true, delay: 0.2 });
    g.fn(x => x * x, { from: 0, to: 1.9, color: 1 });
    g.fn(x => Math.sqrt(x), { from: 0, to: 3.6, color: 2, delay: 0.5 });
    g.line(1.5, 2.25, 2.25, 1.5, { dash: true, color: 3, delay: 1.2 });
    g.dot(1.5, 2.25, { color: 1 }).dot(2.25, 1.5, { color: 2 });
    g.text(1.62, 3.1, 'f(x) = x²', { color: 1 });
    g.text(2.5, 1.85, 'f⁻¹(x) = √x', { color: 2 });
    g.text(2.9, 3.35, 'y = x', { muted: true });
    return g.svg();
  },
  formulas: [
    { label: L('Function Notation', 'Notación de Función'), expr: 'y = f(x)',
      desc: L('Every input x gets exactly one output f(x). Read it “f of x” — it is not multiplication.',
              'Cada entrada x recibe exactamente una salida f(x). Se lee “f de x” — no es una multiplicación.') },
    { label: L('Domain & Range', 'Dominio y Rango'), expr: 'f : D → R',
      desc: L('Domain = every x you are allowed to plug in. Range = every y that actually comes out.',
              'Dominio = todo x que puedes sustituir. Rango = todo y que realmente sale.') },
    { label: L('Composition', 'Composición'), expr: '(f ∘ g)(x) = f(g(x))',
      desc: L('Feed the output of g into f. Work from the inside out — and the order matters.',
              'La salida de g entra en f. Se trabaja de adentro hacia afuera — y el orden importa.') },
    { label: L('Inverse', 'Inversa'), expr: 'f(f⁻¹(x)) = x',
      desc: L('f⁻¹ undoes f. Its graph is the mirror image of f across the line y = x.',
              'f⁻¹ deshace lo que hace f. Su gráfica es el reflejo de f sobre la recta y = x.') },
  ],
  deep: {
    idea: [
      L('A function is a rule that takes an input and returns <b>exactly one</b> output. Think of a vending machine: press B4 and you always get the same snack. If B4 sometimes gave chips and sometimes cookies, it would not be a function.',
        'Una función es una regla que toma una entrada y devuelve <b>exactamente una</b> salida. Piensa en una máquina expendedora: presionas B4 y siempre recibes el mismo producto. Si B4 a veces diera papitas y a veces galletas, no sería una función.'),
      L('Pre-calculus is a tour of the main <b>families</b> of functions — linear, quadratic, polynomial, rational, exponential, logarithmic and trigonometric. Calculus then asks one question about all of them: <i>how fast is the output changing?</i> Knowing each family’s shape by heart is what makes calculus feel easy later.',
        'Precálculo es un recorrido por las principales <b>familias</b> de funciones — lineales, cuadráticas, polinómicas, racionales, exponenciales, logarítmicas y trigonométricas. Luego el cálculo hace una sola pregunta sobre todas: <i>¿qué tan rápido cambia la salida?</i> Conocer de memoria la forma de cada familia es lo que hace que el cálculo se sienta fácil después.'),
    ],
    why: [
      L('<b>Vertical line test:</b> a graph is a function if no vertical line hits it twice. A vertical line is “one x-value”; touching twice would mean one input with two outputs.',
        '<b>Prueba de la recta vertical:</b> una gráfica es función si ninguna recta vertical la toca dos veces. Una recta vertical es “un solo valor de x”; tocar dos veces significaría una entrada con dos salidas.'),
      L('<b>Why inverses mirror across y = x:</b> if f sends 2 → 4, the inverse sends 4 → 2. Swapping every point `(a, b)` to `(b, a)` is exactly a reflection across the diagonal. An inverse only exists if f is one-to-one (passes the <i>horizontal</i> line test) — otherwise the reverse rule would have two answers.',
        '<b>Por qué la inversa se refleja sobre y = x:</b> si f lleva 2 → 4, la inversa lleva 4 → 2. Cambiar cada punto `(a, b)` por `(b, a)` es exactamente un reflejo sobre la diagonal. La inversa solo existe si f es inyectiva (pasa la prueba de la recta <i>horizontal</i>) — si no, la regla al revés tendría dos respuestas.'),
    ],
    mistakes: [
      L('Thinking `f⁻¹(x) = 1 / f(x)`. The −1 means “inverse function”, not “reciprocal”.',
        'Pensar que `f⁻¹(x) = 1 / f(x)`. El −1 significa “función inversa”, no “recíproco”.'),
      L('Writing `f(x + h) = f(x) + h`. You must substitute x + h everywhere x appears: if `f(x) = x²`, then `f(x + h) = x² + 2xh + h²`.',
        'Escribir `f(x + h) = f(x) + h`. Hay que sustituir x + h en cada lugar donde aparece x: si `f(x) = x²`, entonces `f(x + h) = x² + 2xh + h²`.'),
      L('Doing composition in the wrong order. In `f(g(x))`, g acts first.',
        'Hacer la composición en el orden equivocado. En `f(g(x))`, g actúa primero.'),
      L('Forgetting domain restrictions: no dividing by zero, no even roots of negatives, no logs of zero or negatives.',
        'Olvidar las restricciones del dominio: no dividir entre cero, no raíces pares de negativos, no logaritmos de cero o negativos.'),
    ],
    example: {
      prompt: L('Let `f(x) = 2x + 3` and `g(x) = x²`. Find `(f ∘ g)(2)`, `(g ∘ f)(2)` and `f⁻¹(11)`.',
                'Sean `f(x) = 2x + 3` y `g(x) = x²`. Halla `(f ∘ g)(2)`, `(g ∘ f)(2)` y `f⁻¹(11)`.'),
      steps: [
        L('Inside first: `g(2) = 2² = 4`. Then `f(4) = 2·4 + 3 = 11`. So `(f ∘ g)(2) = 11`.',
          'Primero lo de adentro: `g(2) = 2² = 4`. Luego `f(4) = 2·4 + 3 = 11`. Así, `(f ∘ g)(2) = 11`.'),
        L('Other order: `f(2) = 7`, then `g(7) = 49`. So `(g ∘ f)(2) = 49` — composition is not commutative.',
          'En el otro orden: `f(2) = 7`, luego `g(7) = 49`. Así, `(g ∘ f)(2) = 49` — la composición no es conmutativa.'),
        L('For the inverse, write `y = 2x + 3`, swap x and y: `x = 2y + 3`, and solve: `y = (x − 3)/2`.',
          'Para la inversa, escribe `y = 2x + 3`, intercambia x e y: `x = 2y + 3`, y despeja: `y = (x − 3)/2`.'),
        L('Evaluate: `f⁻¹(11) = (11 − 3)/2 = 4`. Check: `f(4) = 11` ✓.',
          'Evalúa: `f⁻¹(11) = (11 − 3)/2 = 4`. Comprueba: `f(4) = 11` ✓.'),
      ],
      answer: L('`(f ∘ g)(2) = 11`, `(g ∘ f)(2) = 49`, `f⁻¹(11) = 4`', '`(f ∘ g)(2) = 11`, `(g ∘ f)(2) = 49`, `f⁻¹(11) = 4`'),
    },
    real: [
      L('Every spreadsheet formula and every function in code is a math function: inputs in, one output out. Converting Celsius to Fahrenheit, `F = 1.8C + 32`, is a function; converting back, `C = (F − 32)/1.8`, is its inverse.',
        'Cada fórmula de una hoja de cálculo y cada función en programación es una función matemática: entran datos, sale una respuesta. Convertir Celsius a Fahrenheit, `F = 1.8C + 32`, es una función; volver, `C = (F − 32)/1.8`, es su inversa.'),
    ],
  },
  exercises: [
    { q: L('If f(x) = 3x − 5, find f(4).', 'Si f(x) = 3x − 5, halla f(4).'), answer: 7,
      hint: L('Replace every x with 4: 3·4 − 5.', 'Reemplaza cada x por 4: 3·4 − 5.') },
    { q: L('If f(x) = x² + 1 and g(x) = x − 3, find f(g(5)).', 'Si f(x) = x² + 1 y g(x) = x − 3, halla f(g(5)).'), answer: 5,
      hint: L('Inside first: g(5) = 2. Then f(2) = 2² + 1.', 'Primero adentro: g(5) = 2. Luego f(2) = 2² + 1.') },
    { q: L('If f(x) = 4x − 7, find f⁻¹(5).', 'Si f(x) = 4x − 7, halla f⁻¹(5).'), answer: 3,
      hint: L('Solve 4x − 7 = 5 for x.', 'Resuelve 4x − 7 = 5 para x.') },
  ],
},

// ─── 02 · Linear & Quadratic ────────────────────────────────────────────────
{
  id: 'quadratic', color: '#5B6FE0',
  tag:  L('Degree 1 & 2 · Lines and Parabolas', 'Grado 1 y 2 · Rectas y Parábolas'),
  name: L('Linear & Quadratic', 'Lineal y Cuadrática'),
  graph() {
    const g = Graph({ x: [-2.5, 4.5], y: [-4, 4] });
    g.grid(1).axes({ ticks: 1 });
    g.vline(1, { color: 3, delay: 0.2 });
    g.fn(x => (x - 1) ** 2 - 3, { color: 1 });
    g.fn(x => x - 2, { color: 2, thin: true, delay: 0.6 });
    g.dot(1, -3, { color: 1 });
    g.dot(1 - Math.sqrt(3), 0, { color: 1 }).dot(1 + Math.sqrt(3), 0, { color: 1 });
    g.text(1, -3, 'V (1, −3)', { dx: 10, dy: 18, color: 1 });
    g.text(1, 3.6, 'x = h', { dx: 6, color: 3 });
    g.text(3.1, 1.6, 'y = mx + b', { color: 2 });
    return g.svg();
  },
  formulas: [
    { label: L('Slope-Intercept Form', 'Forma Pendiente-Intercepto'), expr: 'y = mx + b',
      desc: L('m = rise/run = (y₂ − y₁)/(x₂ − x₁) is the constant rate of change; b is where the line crosses the y-axis.',
              'm = subida/avance = (y₂ − y₁)/(x₂ − x₁) es la razón de cambio constante; b es donde la recta cruza el eje y.') },
    { label: L('Vertex Form', 'Forma de Vértice'), expr: 'y = a(x − h)² + k',
      desc: L('The vertex is (h, k). a > 0 opens up, a < 0 opens down; |a| > 1 is narrower. In standard form, h = −b/2a.',
              'El vértice es (h, k). a > 0 abre hacia arriba, a < 0 hacia abajo; |a| > 1 es más estrecha. En forma estándar, h = −b/2a.') },
    { label: L('Quadratic Formula', 'Fórmula Cuadrática'), expr: 'x = (−b ± √(b² − 4ac)) / 2a',
      desc: L('Solves any ax² + bx + c = 0. It comes from completing the square on the general equation.',
              'Resuelve cualquier ax² + bx + c = 0. Sale de completar el cuadrado en la ecuación general.') },
    { label: L('Discriminant', 'Discriminante'), expr: 'Δ = b² − 4ac',
      desc: L('Δ > 0: two real roots · Δ = 0: one repeated root (vertex on the axis) · Δ < 0: no real roots, two complex ones.',
              'Δ > 0: dos raíces reales · Δ = 0: una raíz doble (vértice sobre el eje) · Δ < 0: sin raíces reales, dos complejas.') },
  ],
  deep: {
    idea: [
      L('A <b>linear</b> function changes by the same amount every step: add 1 to x, and y always grows by m. A <b>quadratic</b> changes by an amount that itself grows steadily — its “second differences” are constant. That is why a thrown ball (whose speed changes steadily under gravity) traces a parabola.',
        'Una función <b>lineal</b> cambia en la misma cantidad en cada paso: suma 1 a x, y y siempre crece m. Una <b>cuadrática</b> cambia en una cantidad que a su vez crece de manera constante — sus “segundas diferencias” son constantes. Por eso una pelota lanzada (cuya velocidad cambia de forma constante por la gravedad) traza una parábola.'),
      L('Every parabola is symmetric about the vertical line through its vertex, `x = h`. The roots (if they exist) sit at equal distances on either side of that line.',
        'Toda parábola es simétrica respecto a la recta vertical que pasa por su vértice, `x = h`. Las raíces (si existen) quedan a igual distancia a cada lado de esa recta.'),
    ],
    why: [
      L('<b>Deriving the quadratic formula</b> by completing the square: start with `ax² + bx + c = 0`, divide by a: `x² + (b/a)x = −c/a`. Add `(b/2a)²` to both sides: `(x + b/2a)² = (b² − 4ac)/4a²`. Take the square root (both signs!) and subtract `b/2a`: `x = (−b ± √(b² − 4ac))/2a`.',
        '<b>Deducir la fórmula cuadrática</b> completando el cuadrado: empieza con `ax² + bx + c = 0`, divide entre a: `x² + (b/a)x = −c/a`. Suma `(b/2a)²` a ambos lados: `(x + b/2a)² = (b² − 4ac)/4a²`. Saca raíz cuadrada (¡ambos signos!) y resta `b/2a`: `x = (−b ± √(b² − 4ac))/2a`.'),
      L('The piece under the root, `b² − 4ac`, decides everything: you cannot take a real square root of a negative number, so a negative discriminant means the parabola never touches the x-axis.',
        'La parte bajo la raíz, `b² − 4ac`, lo decide todo: no se puede sacar raíz cuadrada real de un negativo, así que un discriminante negativo significa que la parábola nunca toca el eje x.'),
    ],
    mistakes: [
      L('Dividing only −b by 2a. The whole numerator `−b ± √Δ` goes over `2a`.',
        'Dividir solo −b entre 2a. Todo el numerador `−b ± √Δ` va sobre `2a`.'),
      L('Sign of h in vertex form: `y = (x + 3)² − 1` has its vertex at x = −3, not +3, because `x + 3 = x − (−3)`.',
        'Signo de h en la forma de vértice: `y = (x + 3)² − 1` tiene su vértice en x = −3, no en +3, porque `x + 3 = x − (−3)`.'),
      L('Dropping the ± and finding only one root.', 'Olvidar el ± y encontrar solo una raíz.'),
      L('Mixing up slopes: a horizontal line has slope 0; a vertical line has <i>undefined</i> slope (you would divide by 0).',
        'Confundir pendientes: una recta horizontal tiene pendiente 0; una vertical tiene pendiente <i>indefinida</i> (dividirías entre 0).'),
    ],
    example: {
      prompt: L('Find the vertex and the roots of `y = 2x² − 8x + 6`.', 'Halla el vértice y las raíces de `y = 2x² − 8x + 6`.'),
      steps: [
        L('Read off `a = 2, b = −8, c = 6`.', 'Identifica `a = 2, b = −8, c = 6`.'),
        L('Vertex x-coordinate: `h = −b/2a = 8/4 = 2`. Plug in: `k = 2(2)² − 8(2) + 6 = −2`. Vertex `(2, −2)`.',
          'Coordenada x del vértice: `h = −b/2a = 8/4 = 2`. Sustituye: `k = 2(2)² − 8(2) + 6 = −2`. Vértice `(2, −2)`.'),
        L('Discriminant: `Δ = (−8)² − 4·2·6 = 64 − 48 = 16 > 0`, so two real roots.',
          'Discriminante: `Δ = (−8)² − 4·2·6 = 64 − 48 = 16 > 0`, así que hay dos raíces reales.'),
        L('Roots: `x = (8 ± √16)/4 = (8 ± 4)/4`, giving `x = 3` and `x = 1`. Notice they are symmetric around h = 2 ✓.',
          'Raíces: `x = (8 ± √16)/4 = (8 ± 4)/4`, que da `x = 3` y `x = 1`. Fíjate que son simétricas alrededor de h = 2 ✓.'),
      ],
      answer: L('vertex `(2, −2)`; roots `x = 1` and `x = 3`', 'vértice `(2, −2)`; raíces `x = 1` y `x = 3`'),
    },
    real: [
      L('Projectile height: `h(t) = −4.9t² + v₀t + h₀` (meters). The vertex gives the maximum height; the positive root gives when it lands. Businesses use the same vertex trick to find the price that maximizes profit.',
        'Altura de un proyectil: `h(t) = −4.9t² + v₀t + h₀` (metros). El vértice da la altura máxima; la raíz positiva da cuándo aterriza. Las empresas usan el mismo truco del vértice para hallar el precio que maximiza la ganancia.'),
    ],
  },
  exercises: [
    { q: L('Find the slope of the line through (2, 3) and (6, 11).', 'Halla la pendiente de la recta que pasa por (2, 3) y (6, 11).'), answer: 2,
      hint: L('m = (11 − 3)/(6 − 2)', 'm = (11 − 3)/(6 − 2)') },
    { q: L('What is the x-coordinate of the vertex of y = 3x² − 12x + 7?', '¿Cuál es la coordenada x del vértice de y = 3x² − 12x + 7?'), answer: 2,
      hint: L('h = −b/2a = 12/6', 'h = −b/2a = 12/6') },
    { q: L('Find the positive solution of 2x² + 3x − 5 = 0.', 'Halla la solución positiva de 2x² + 3x − 5 = 0.'), answer: 1,
      hint: L('Δ = 9 + 40 = 49, so x = (−3 ± 7)/4.', 'Δ = 9 + 40 = 49, así que x = (−3 ± 7)/4.') },
  ],
},

// ─── 03 · Polynomials ───────────────────────────────────────────────────────
{
  id: 'polynomials', color: '#7A6BE6',
  tag:  L('Degree n · Roots & End Behavior', 'Grado n · Raíces y Comportamiento Final'),
  name: L('Polynomials', 'Polinomios'),
  graph() {
    const f = x => 0.25 * (x + 3) * (x - 1) * (x - 3);
    const g = Graph({ x: [-4.5, 4.5], y: [-4, 5.5] });
    g.grid(1).axes({ ticks: 1 });
    g.fn(f, { color: 1 });
    [-3, 1, 3].forEach(r => g.dot(r, 0, { color: 1 }));
    g.dot(-1.43, f(-1.43), { color: 2, delay: 1.7 }).dot(2.1, f(2.1), { color: 2, delay: 1.7 });
    g.text(-4.2, 4.9, 'P(x) = ¼(x+3)(x−1)(x−3)', { color: 1, size: 11 });
    return g.svg();
  },
  formulas: [
    { label: L('Standard Form', 'Forma Estándar'), expr: 'P(x) = aₙxⁿ + … + a₁x + a₀',
      desc: L('Degree n = highest power. At most n real roots and at most n − 1 turning points.',
              'Grado n = la potencia más alta. Como máximo n raíces reales y n − 1 puntos de giro.') },
    { label: L('End Behavior', 'Comportamiento Final'), expr: 'P(x) ≈ aₙxⁿ  as |x| → ∞',
      desc: L('The leading term wins far away. Even degree: both ends point the same way. Odd degree: opposite ways.',
              'El término principal domina lejos del origen. Grado par: ambos extremos van igual. Grado impar: van en sentidos opuestos.') },
    { label: L('Factor Theorem', 'Teorema del Factor'), expr: 'P(c) = 0  ⇔  (x − c) | P(x)',
      desc: L('c is a root exactly when (x − c) divides P evenly. Roots and factors are the same information.',
              'c es raíz exactamente cuando (x − c) divide a P sin residuo. Raíces y factores son la misma información.') },
    { label: L('Remainder Theorem', 'Teorema del Residuo'), expr: 'P(x) ÷ (x − c)  →  remainder P(c)',
      desc: L('To find the remainder, just evaluate P(c) — no long division needed.',
              'Para hallar el residuo, solo evalúa P(c) — sin necesidad de división larga.') },
  ],
  deep: {
    idea: [
      L('Polynomials are sums of whole-number powers of x. They are smooth and unbroken — no gaps, no corners, no asymptotes — which makes them the “nice” functions that everything else is compared to.',
        'Los polinomios son sumas de potencias enteras de x. Son suaves y continuos — sin huecos, sin esquinas, sin asíntotas — por eso son las funciones “bonitas” con las que se compara todo lo demás.'),
      L('Three things tell you the whole shape: the <b>degree</b> (how many wiggles are possible), the <b>leading coefficient</b> (which way the ends point), and the <b>roots with their multiplicities</b>. A root of odd multiplicity crosses the x-axis; a root of even multiplicity (like `(x − 2)²`) just touches it and bounces back.',
        'Tres cosas te dan toda la forma: el <b>grado</b> (cuántas ondulaciones son posibles), el <b>coeficiente principal</b> (hacia dónde apuntan los extremos) y las <b>raíces con su multiplicidad</b>. Una raíz de multiplicidad impar cruza el eje x; una de multiplicidad par (como `(x − 2)²`) solo lo toca y rebota.'),
    ],
    why: [
      L('Any division can be written as <i>dividend = divisor × quotient + remainder</i>. For polynomials: `P(x) = (x − c)·Q(x) + R`. Now plug in `x = c`: the first term becomes `0·Q(c) = 0`, leaving `P(c) = R`. That is the Remainder Theorem — and if R = 0, then (x − c) is a factor, which is the Factor Theorem.',
        'Toda división se puede escribir como <i>dividendo = divisor × cociente + residuo</i>. Para polinomios: `P(x) = (x − c)·Q(x) + R`. Ahora sustituye `x = c`: el primer término se vuelve `0·Q(c) = 0`, y queda `P(c) = R`. Ese es el Teorema del Residuo — y si R = 0, entonces (x − c) es un factor: el Teorema del Factor.'),
      L('<b>Rational Root Test:</b> any rational root p/q (in lowest terms) must have p dividing the constant term and q dividing the leading coefficient. That turns “guessing” into a short list of candidates.',
        '<b>Prueba de Raíces Racionales:</b> toda raíz racional p/q (simplificada) debe tener p dividiendo al término constante y q dividiendo al coeficiente principal. Así “adivinar” se convierte en una lista corta de candidatos.'),
    ],
    mistakes: [
      L('Skipping missing powers in synthetic division. For `x³ + 2x − 1` the coefficients are `1, 0, 2, −1` — the 0 holds the x² place.',
        'Saltarse potencias que faltan en la división sintética. Para `x³ + 2x − 1` los coeficientes son `1, 0, 2, −1` — el 0 ocupa el lugar de x².'),
      L('Using the wrong sign of c: dividing by `x + 2` means `c = −2`.', 'Usar el signo equivocado de c: dividir entre `x + 2` significa `c = −2`.'),
      L('Assuming degree n means n <i>real</i> roots. `x² + 1` has degree 2 and no real roots — its roots are ±i.',
        'Suponer que grado n significa n raíces <i>reales</i>. `x² + 1` tiene grado 2 y ninguna raíz real — sus raíces son ±i.'),
    ],
    example: {
      prompt: L('Find all roots of `P(x) = x³ − 6x² + 11x − 6`.', 'Halla todas las raíces de `P(x) = x³ − 6x² + 11x − 6`.'),
      steps: [
        L('Rational candidates: divisors of 6 over divisors of 1 → `±1, ±2, ±3, ±6`.',
          'Candidatos racionales: divisores de 6 entre divisores de 1 → `±1, ±2, ±3, ±6`.'),
        L('Test `x = 1`: `P(1) = 1 − 6 + 11 − 6 = 0` ✓, so `(x − 1)` is a factor.',
          'Prueba `x = 1`: `P(1) = 1 − 6 + 11 − 6 = 0` ✓, así que `(x − 1)` es un factor.'),
        L('Synthetic division by 1 on `1, −6, 11, −6`: bring down 1; 1·1 = 1 → −5; 1·(−5) = −5 → 6; 1·6 = 6 → 0. Quotient: `x² − 5x + 6`.',
          'División sintética entre 1 con `1, −6, 11, −6`: baja el 1; 1·1 = 1 → −5; 1·(−5) = −5 → 6; 1·6 = 6 → 0. Cociente: `x² − 5x + 6`.'),
        L('Factor the quadratic: `x² − 5x + 6 = (x − 2)(x − 3)`.', 'Factoriza la cuadrática: `x² − 5x + 6 = (x − 2)(x − 3)`.'),
      ],
      answer: L('`P(x) = (x − 1)(x − 2)(x − 3)`, roots `x = 1, 2, 3`', '`P(x) = (x − 1)(x − 2)(x − 3)`, raíces `x = 1, 2, 3`'),
    },
    real: [
      L('The smooth curves in every font on this page are Bézier curves — cubic polynomials. Engineers fit polynomials to sensor data, and the volume of an open box cut from a sheet, `V = x(10 − 2x)²`, is a cubic you can maximize.',
        'Las curvas suaves de cada letra en esta página son curvas de Bézier — polinomios cúbicos. Los ingenieros ajustan polinomios a datos de sensores, y el volumen de una caja abierta cortada de una lámina, `V = x(10 − 2x)²`, es una cúbica que se puede maximizar.'),
    ],
  },
  exercises: [
    { q: L('If P(x) = x³ − 2x² + 4, find P(3).', 'Si P(x) = x³ − 2x² + 4, halla P(3).'), answer: 13,
      hint: L('27 − 18 + 4', '27 − 18 + 4') },
    { q: L('What is the remainder when x³ + 2x² − 5x + 1 is divided by (x − 2)?', '¿Cuál es el residuo al dividir x³ + 2x² − 5x + 1 entre (x − 2)?'), answer: 7,
      hint: L('Remainder Theorem: evaluate P(2) = 8 + 8 − 10 + 1.', 'Teorema del Residuo: evalúa P(2) = 8 + 8 − 10 + 1.') },
    { q: L('What is the maximum number of turning points of a degree-5 polynomial?', '¿Cuál es el número máximo de puntos de giro de un polinomio de grado 5?'), answer: 4,
      hint: L('At most n − 1.', 'Como máximo n − 1.') },
  ],
},

// ─── 04 · Rational Functions ────────────────────────────────────────────────
{
  id: 'rational', color: '#9C6FE0',
  tag:  L('P(x) / Q(x) · Asymptotes & Holes', 'P(x) / Q(x) · Asíntotas y Huecos'),
  name: L('Rational Functions', 'Funciones Racionales'),
  graph() {
    const f = x => (2 * x + 1) / (x - 1);
    const g = Graph({ x: [-4, 6], y: [-4, 8] });
    g.grid(1).axes({ ticks: 2 });
    g.vline(1, { color: 3, delay: 0.1 }).hline(2, { color: 2, delay: 0.3 });
    g.fn(f, { from: -4, to: 0.97, color: 1 });
    g.fn(f, { from: 1.03, to: 6, color: 1, delay: 0.4 });
    g.dot(-0.5, 0, { color: 1 }).dot(0, -1, { color: 1 });
    g.text(1, 7.5, 'x = 1', { dx: 6, color: 3 });
    g.text(4.3, 2, 'y = 2', { dy: -8, color: 2 });
    g.text(2.2, 6.4, '(2x+1)/(x−1)', { color: 1 });
    return g.svg();
  },
  formulas: [
    { label: L('Definition', 'Definición'), expr: 'R(x) = P(x) / Q(x),  Q(x) ≠ 0',
      desc: L('A ratio of two polynomials. The domain is every x except the zeros of the denominator.',
              'Un cociente de dos polinomios. El dominio es todo x excepto los ceros del denominador.') },
    { label: L('Vertical Asymptote', 'Asíntota Vertical'), expr: 'x = a  where  Q(a) = 0, P(a) ≠ 0',
      desc: L('Dividing by numbers near zero makes the output explode toward ±∞. The graph never crosses it.',
              'Dividir entre números cercanos a cero hace que la salida se dispare a ±∞. La gráfica nunca la cruza.') },
    { label: L('Horizontal Asymptote', 'Asíntota Horizontal'), expr: 'deg P < deg Q → y = 0 ;  = → y = aₙ/bₙ',
      desc: L('Compare degrees. If deg P is exactly one more than deg Q, there is a slant asymptote (use long division).',
              'Compara los grados. Si el grado de P es exactamente uno más que el de Q, hay una asíntota oblicua (usa división larga).') },
    { label: L('Holes', 'Huecos'), expr: '(x − a)/(x − a) cancels → hole at x = a',
      desc: L('A factor shared by top and bottom leaves a single missing point instead of an asymptote.',
              'Un factor común arriba y abajo deja un solo punto faltante en lugar de una asíntota.') },
  ],
  deep: {
    idea: [
      L('Rational functions are what you get when you divide. Most of their personality comes from two places: <b>where the denominator is zero</b> (vertical asymptotes or holes) and <b>what happens for huge x</b> (horizontal or slant asymptotes).',
        'Las funciones racionales son lo que obtienes al dividir. Casi toda su personalidad viene de dos lugares: <b>dónde el denominador vale cero</b> (asíntotas verticales o huecos) y <b>qué pasa cuando x es enorme</b> (asíntotas horizontales u oblicuas).'),
      L('The graph on the left, `(2x + 1)/(x − 1)`, can be rewritten as `2 + 3/(x − 1)` — it is just the basic hyperbola `1/x`, stretched by 3, shifted 1 right and 2 up. That is why it hugs `x = 1` and `y = 2`.',
        'La gráfica de la izquierda, `(2x + 1)/(x − 1)`, se puede reescribir como `2 + 3/(x − 1)` — es solo la hipérbola básica `1/x`, estirada por 3, movida 1 a la derecha y 2 hacia arriba. Por eso se pega a `x = 1` y `y = 2`.'),
    ],
    why: [
      L('<b>Vertical:</b> try `x = 1.001` in `3/(x − 1)` — you get 3000. At `x = 0.999` you get −3000. The closer you get to 1, the bigger the blow-up, so the curve races up one side and down the other.',
        '<b>Vertical:</b> prueba `x = 1.001` en `3/(x − 1)` — obtienes 3000. En `x = 0.999` obtienes −3000. Mientras más te acercas a 1, más se dispara, así que la curva sube por un lado y baja por el otro.'),
      L('<b>Horizontal:</b> for huge x, the lower powers barely matter: `(2x + 1)/(x − 1) ≈ 2x/x = 2`. Divide top and bottom by the highest power of x and let x → ∞ — every term with x in the denominator disappears.',
        '<b>Horizontal:</b> para x enorme, las potencias menores casi no importan: `(2x + 1)/(x − 1) ≈ 2x/x = 2`. Divide arriba y abajo entre la potencia más alta de x y deja que x → ∞ — todo término con x en el denominador desaparece.'),
    ],
    mistakes: [
      L('Calling every zero of the denominator an asymptote. Factor first — if the factor cancels, it is a hole.',
        'Llamar asíntota a todo cero del denominador. Factoriza primero — si el factor se cancela, es un hueco.'),
      L('Believing a graph can never cross a horizontal asymptote. It can (that line describes the far-away ends only). It can never cross a <i>vertical</i> one.',
        'Creer que una gráfica nunca puede cruzar una asíntota horizontal. Sí puede (esa recta solo describe los extremos lejanos). Nunca puede cruzar una <i>vertical</i>.'),
      L('Cancelling terms instead of factors: `(x + 2)/x ≠ 2`. Only multiplied factors cancel.',
        'Cancelar términos en lugar de factores: `(x + 2)/x ≠ 2`. Solo se cancelan factores multiplicados.'),
    ],
    example: {
      prompt: L('Analyze `f(x) = (x² − 4)/(x² − x − 2)`: holes, asymptotes and intercepts.',
                'Analiza `f(x) = (x² − 4)/(x² − x − 2)`: huecos, asíntotas e interceptos.'),
      steps: [
        L('Factor: `f(x) = (x − 2)(x + 2) / ((x − 2)(x + 1))`.', 'Factoriza: `f(x) = (x − 2)(x + 2) / ((x − 2)(x + 1))`.'),
        L('`(x − 2)` cancels → <b>hole</b> at x = 2. Its height: plug 2 into the simplified `(x + 2)/(x + 1)` → `4/3`. Hole at `(2, 4/3)`.',
          '`(x − 2)` se cancela → <b>hueco</b> en x = 2. Su altura: sustituye 2 en la forma simplificada `(x + 2)/(x + 1)` → `4/3`. Hueco en `(2, 4/3)`.'),
        L('`(x + 1)` remains in the denominator → <b>vertical asymptote</b> `x = −1`.',
          '`(x + 1)` queda en el denominador → <b>asíntota vertical</b> `x = −1`.'),
        L('Degrees are equal (2 and 2) → <b>horizontal asymptote</b> `y = 1/1 = 1`.',
          'Los grados son iguales (2 y 2) → <b>asíntota horizontal</b> `y = 1/1 = 1`.'),
        L('Intercepts: x-intercept where the simplified top is 0 → `x = −2`; y-intercept `f(0) = −4/−2 = 2`.',
          'Interceptos: en x donde el numerador simplificado vale 0 → `x = −2`; en y, `f(0) = −4/−2 = 2`.'),
      ],
      answer: L('hole `(2, 4/3)`, VA `x = −1`, HA `y = 1`, intercepts `(−2, 0)` and `(0, 2)`',
                'hueco `(2, 4/3)`, AV `x = −1`, AH `y = 1`, interceptos `(−2, 0)` y `(0, 2)`'),
    },
    real: [
      L('Average cost: if making x items costs `C(x) = 500 + 4x`, the cost per item is `C(x)/x = 500/x + 4`, which approaches $4 (its horizontal asymptote) as production grows. Lens and resistor formulas, drug concentration and work-rate problems are all rational functions.',
        'Costo promedio: si fabricar x artículos cuesta `C(x) = 500 + 4x`, el costo por artículo es `C(x)/x = 500/x + 4`, que se acerca a $4 (su asíntota horizontal) cuando crece la producción. Las fórmulas de lentes y resistencias, la concentración de medicamentos y los problemas de trabajo son funciones racionales.'),
    ],
  },
  exercises: [
    { q: L('f(x) = (3x + 2)/(x − 4) has a vertical asymptote x = ?', 'f(x) = (3x + 2)/(x − 4) tiene una asíntota vertical x = ?'), answer: 4,
      hint: L('Where is the denominator zero?', '¿Dónde vale cero el denominador?') },
    { q: L('Find the horizontal asymptote y = ? of f(x) = (6x² + 1)/(2x² − 5).', 'Halla la asíntota horizontal y = ? de f(x) = (6x² + 1)/(2x² − 5).'), answer: 3,
      hint: L('Equal degrees: ratio of leading coefficients, 6/2.', 'Grados iguales: cociente de coeficientes principales, 6/2.') },
    { q: L('f(x) = (x² − 9)/(x − 3) has a hole at x = 3. What is the y-coordinate of the hole?', 'f(x) = (x² − 9)/(x − 3) tiene un hueco en x = 3. ¿Cuál es la coordenada y del hueco?'), answer: 6,
      hint: L('Simplify to x + 3, then plug in 3.', 'Simplifica a x + 3 y sustituye 3.') },
  ],
},

// ─── 05 · Exponential Functions ─────────────────────────────────────────────
{
  id: 'exponential', color: '#BF8CE1',
  tag:  L('Growth & Decay · Constant Ratios', 'Crecimiento y Decaimiento · Razón Constante'),
  name: L('Exponential Functions', 'Funciones Exponenciales'),
  graph() {
    const g = Graph({ x: [-4, 4], y: [-1, 7] });
    g.grid(1).axes({ ticks: 1 });
    g.hline(0.0001, { ghost: true, delay: 0.2 });
    g.fn(x => 2 ** x, { color: 1 });
    g.fn(x => 0.5 ** x, { color: 2, delay: 0.4 });
    g.dot(0, 1, { color: 3 });
    g.dot(1, 2, { color: 1 }).dot(2, 4, { color: 1 });
    g.text(2.3, 6.2, 'y = 2ˣ', { color: 1 });
    g.text(-3.8, 6.2, 'y = (½)ˣ', { color: 2 });
    g.text(0, 1, '(0, 1)', { dx: 8, dy: 16, color: 3 });
    return g.svg();
  },
  formulas: [
    { label: L('Exponential Function', 'Función Exponencial'), expr: 'f(x) = a · bˣ   (b > 0, b ≠ 1)',
      desc: L('b > 1 grows, 0 < b < 1 decays. Passes through (0, a). The x-axis is a horizontal asymptote.',
              'b > 1 crece, 0 < b < 1 decae. Pasa por (0, a). El eje x es una asíntota horizontal.') },
    { label: L('Compound Interest', 'Interés Compuesto'), expr: 'A = P(1 + r/n)ⁿᵗ',
      desc: L('P principal, r yearly rate (as a decimal), n compoundings per year, t years.',
              'P capital, r tasa anual (en decimal), n capitalizaciones por año, t años.') },
    { label: L('Continuous Growth', 'Crecimiento Continuo'), expr: 'A = P · eʳᵗ',
      desc: L('The limit of compounding infinitely often. Also models populations, decay (r < 0) and cooling.',
              'El límite de capitalizar infinitas veces. También modela poblaciones, decaimiento (r < 0) y enfriamiento.') },
    { label: L('The Number e', 'El Número e'), expr: 'e = lim (1 + 1/n)ⁿ ≈ 2.71828',
      desc: L('As n → ∞. The “natural” base: the only exponential whose rate of growth equals its own value.',
              'Cuando n → ∞. La base “natural”: la única exponencial cuya razón de crecimiento es igual a su propio valor.') },
  ],
  deep: {
    idea: [
      L('Linear functions <b>add</b> the same amount each step; exponential functions <b>multiply</b> by the same factor each step. Start with 1 and double: 1, 2, 4, 8, 16, … 1024 after ten steps, over a million after twenty. Exponentials start slow and then explode — which is why people underestimate them.',
        'Las funciones lineales <b>suman</b> la misma cantidad en cada paso; las exponenciales <b>multiplican</b> por el mismo factor. Empieza en 1 y duplica: 1, 2, 4, 8, 16, … 1024 tras diez pasos, más de un millón tras veinte. Las exponenciales empiezan lentas y luego se disparan — por eso la gente las subestima.'),
      L('A growth rate of r per period means a factor of `1 + r`: 5% growth multiplies by `1.05`; 5% decay multiplies by `0.95`.',
        'Una tasa de crecimiento r por periodo significa un factor de `1 + r`: crecer 5% multiplica por `1.05`; decaer 5% multiplica por `0.95`.'),
    ],
    why: [
      L('<b>Where e comes from:</b> invest $1 at 100% for one year. Compounded once: $2. Monthly: `(1 + 1/12)¹² ≈ 2.613`. Daily: `(1 + 1/365)³⁶⁵ ≈ 2.7146`. Every second: ≈ 2.71828. Compounding faster and faster does not give infinite money — it levels off at e.',
        '<b>De dónde sale e:</b> invierte $1 al 100% por un año. Capitalizado una vez: $2. Mensual: `(1 + 1/12)¹² ≈ 2.613`. Diario: `(1 + 1/365)³⁶⁵ ≈ 2.7146`. Cada segundo: ≈ 2.71828. Capitalizar cada vez más rápido no da dinero infinito — se estabiliza en e.'),
      L('Every exponential `bˣ` can be rewritten as `e^(kx)` with `k = ln b`. That is why calculus prefers base e.',
        'Toda exponencial `bˣ` se puede reescribir como `e^(kx)` con `k = ln b`. Por eso el cálculo prefiere la base e.'),
    ],
    mistakes: [
      L('Using the rate instead of the factor: 6% growth is `× 1.06`, not `× 0.06`.', 'Usar la tasa en lugar del factor: crecer 6% es `× 1.06`, no `× 0.06`.'),
      L('Plugging in r = 6 instead of r = 0.06.', 'Sustituir r = 6 en lugar de r = 0.06.'),
      L('Confusing `x²` (power function: variable base) with `2ˣ` (exponential: variable exponent). For large x, `2ˣ` wins by far.',
        'Confundir `x²` (función potencia: base variable) con `2ˣ` (exponencial: exponente variable). Para x grande, `2ˣ` gana por mucho.'),
      L('Writing `a·bˣ = (ab)ˣ`. The exponent applies only to b.', 'Escribir `a·bˣ = (ab)ˣ`. El exponente solo afecta a b.'),
    ],
    example: {
      prompt: L('$1,000 is invested at 6% per year for 10 years. Compare monthly compounding with continuous compounding.',
                'Se invierten $1,000 al 6% anual por 10 años. Compara la capitalización mensual con la continua.'),
      steps: [
        L('Monthly: `P = 1000, r = 0.06, n = 12, t = 10`, so `A = 1000(1 + 0.06/12)¹²⁰ = 1000(1.005)¹²⁰`.',
          'Mensual: `P = 1000, r = 0.06, n = 12, t = 10`, así que `A = 1000(1 + 0.06/12)¹²⁰ = 1000(1.005)¹²⁰`.'),
        L('`1.005¹²⁰ ≈ 1.81940`, so `A ≈ $1,819.40`.', '`1.005¹²⁰ ≈ 1.81940`, así que `A ≈ $1,819.40`.'),
        L('Continuous: `A = 1000·e^(0.06·10) = 1000·e^0.6 ≈ 1000 · 1.82212`.', 'Continua: `A = 1000·e^(0.06·10) = 1000·e^0.6 ≈ 1000 · 1.82212`.'),
        L('Difference: only about $2.72 — compounding more often helps less and less.', 'Diferencia: solo unos $2.72 — capitalizar más seguido ayuda cada vez menos.'),
      ],
      answer: L('monthly ≈ `$1,819.40`; continuous ≈ `$1,822.12`', 'mensual ≈ `$1,819.40`; continua ≈ `$1,822.12`'),
    },
    real: [
      L('Savings and loans, population growth, viral spread, radioactive decay (carbon-14 dating), cooling coffee, and the battery percentage of a discharging capacitor all follow exponential curves.',
        'Ahorros y préstamos, crecimiento poblacional, propagación de virus, decaimiento radiactivo (datación con carbono-14), el café que se enfría y la descarga de un condensador siguen curvas exponenciales.'),
    ],
  },
  exercises: [
    { q: L('If f(x) = 3 · 2ˣ, find f(4).', 'Si f(x) = 3 · 2ˣ, halla f(4).'), answer: 48,
      hint: L('2⁴ = 16, then multiply by 3.', '2⁴ = 16, luego multiplica por 3.') },
    { q: L('$500 is invested at 4% compounded yearly. How much is there after 3 years? (2 decimals)', 'Se invierten $500 al 4% capitalizado anualmente. ¿Cuánto hay después de 3 años? (2 decimales)'), answer: 562.43,
      hint: L('A = 500 · 1.04³', 'A = 500 · 1.04³') },
    { q: L('A culture starts with 50 bacteria and doubles every hour. How many are there after 5 hours?', 'Un cultivo empieza con 50 bacterias y se duplica cada hora. ¿Cuántas hay después de 5 horas?'), answer: 1600,
      hint: L('50 · 2⁵', '50 · 2⁵') },
  ],
},

// ─── 06 · Logarithms ────────────────────────────────────────────────────────
{
  id: 'logarithms', color: '#D88BD0',
  tag:  L('Inverse of bˣ · “Which Exponent?”', 'Inversa de bˣ · “¿Qué Exponente?”'),
  name: L('Logarithms', 'Logaritmos'),
  graph() {
    const g = Graph({ x: [-3, 5], y: [-3, 5] });
    g.grid(1).axes({ ticks: 1 });
    g.line(-3, -3, 5, 5, { dash: true, ghost: true, delay: 0.2 });
    g.fn(x => Math.log(x), { from: 0.005, to: 5, color: 1 });
    g.fn(x => Math.exp(x), { color: 2, thin: true, delay: 0.5 });
    g.dot(1, 0, { color: 1 }).dot(Math.E, 1, { color: 1 });
    g.dot(0, 1, { color: 2 }).dot(1, Math.E, { color: 2 });
    g.text(3.3, 1.75, 'y = ln x', { color: 1 });
    g.text(1.25, 4.3, 'y = eˣ', { color: 2 });
    g.text(Math.E, 1, '(e, 1)', { dx: 6, dy: 18, color: 1, size: 11 });
    return g.svg();
  },
  formulas: [
    { label: L('Definition', 'Definición'), expr: 'log<sub>b</sub>(x) = y  ⇔  bʸ = x',
      desc: L('A log is an exponent. ln x means log base e; log x usually means base 10. Only defined for x > 0.',
              'Un logaritmo es un exponente. ln x es logaritmo base e; log x suele ser base 10. Solo definido para x > 0.') },
    { label: L('Product & Quotient', 'Producto y Cociente'), expr: 'log(MN) = log M + log N',
      desc: L('…and log(M/N) = log M − log N. Logs turn multiplication into addition.',
              '…y log(M/N) = log M − log N. Los logaritmos convierten la multiplicación en suma.') },
    { label: L('Power Rule', 'Regla de la Potencia'), expr: 'log(Mᵖ) = p · log M',
      desc: L('Brings an exponent down in front — the key move for solving for a variable in an exponent.',
              'Baja el exponente al frente — la jugada clave para despejar una variable que está en un exponente.') },
    { label: L('Change of Base', 'Cambio de Base'), expr: 'log<sub>b</sub>(x) = ln x / ln b',
      desc: L('Lets any calculator compute any base. Example: log₂ 10 = ln 10 / ln 2 ≈ 3.32.',
              'Permite calcular cualquier base en cualquier calculadora. Ejemplo: log₂ 10 = ln 10 / ln 2 ≈ 3.32.') },
  ],
  deep: {
    idea: [
      L('A logarithm answers one question: <b>“what exponent do I need?”</b> `log₂ 8 = 3` because `2³ = 8`. `log₁₀ 1000 = 3` because `10³ = 1000`. That is all a log is.',
        'Un logaritmo responde una sola pregunta: <b>“¿qué exponente necesito?”</b> `log₂ 8 = 3` porque `2³ = 8`. `log₁₀ 1000 = 3` porque `10³ = 1000`. Eso es todo lo que es un logaritmo.'),
      L('Because log undoes exponentials, its graph is the mirror image of `eˣ` across `y = x` (look left). It grows forever, but incredibly slowly: `ln(1,000,000) ≈ 13.8`.',
        'Como el logaritmo deshace la exponencial, su gráfica es el reflejo de `eˣ` sobre `y = x` (mira a la izquierda). Crece para siempre, pero muy lentamente: `ln(1,000,000) ≈ 13.8`.'),
    ],
    why: [
      L('<b>Product rule from exponent rules:</b> write `M = bᵐ` and `N = bⁿ`. Then `MN = bᵐ·bⁿ = b^(m+n)`. Taking log of both sides: `log(MN) = m + n = log M + log N`. Every log law is an exponent law in disguise.',
        '<b>Regla del producto desde las leyes de exponentes:</b> escribe `M = bᵐ` y `N = bⁿ`. Entonces `MN = bᵐ·bⁿ = b^(m+n)`. Sacando log a ambos lados: `log(MN) = m + n = log M + log N`. Cada ley de logaritmos es una ley de exponentes disfrazada.'),
      L('<b>Why x > 0 only:</b> a positive base raised to any power is always positive, so no exponent can produce 0 or a negative number.',
        '<b>Por qué solo x > 0:</b> una base positiva elevada a cualquier potencia siempre es positiva, así que ningún exponente produce 0 ni un número negativo.'),
    ],
    mistakes: [
      L('`log(M + N) ≠ log M + log N`. There is no rule for the log of a sum.', '`log(M + N) ≠ log M + log N`. No hay regla para el logaritmo de una suma.'),
      L('`(log x)² ≠ log(x²)`. Only the second one equals `2 log x`.', '`(log x)² ≠ log(x²)`. Solo la segunda es igual a `2 log x`.'),
      L('`log M / log N ≠ log(M/N)`. A quotient of logs is a change of base, not a log of a quotient.',
        '`log M / log N ≠ log(M/N)`. Un cociente de logaritmos es un cambio de base, no el logaritmo de un cociente.'),
      L('Forgetting to check answers: solutions that make an argument ≤ 0 must be thrown out.',
        'Olvidar comprobar: las soluciones que hacen un argumento ≤ 0 se descartan.'),
    ],
    example: {
      prompt: L('Solve `5 · 3ˣ = 200`.', 'Resuelve `5 · 3ˣ = 200`.'),
      steps: [
        L('Isolate the exponential: divide by 5 → `3ˣ = 40`.', 'Aísla la exponencial: divide entre 5 → `3ˣ = 40`.'),
        L('Take ln of both sides: `ln(3ˣ) = ln 40`.', 'Saca ln a ambos lados: `ln(3ˣ) = ln 40`.'),
        L('Power rule brings x down: `x · ln 3 = ln 40`.', 'La regla de la potencia baja la x: `x · ln 3 = ln 40`.'),
        L('Divide: `x = ln 40 / ln 3 ≈ 3.6889 / 1.0986 ≈ 3.358`. Check: `3^3.358 ≈ 40` ✓.',
          'Divide: `x = ln 40 / ln 3 ≈ 3.6889 / 1.0986 ≈ 3.358`. Comprueba: `3^3.358 ≈ 40` ✓.'),
      ],
      answer: L('`x = ln 40 / ln 3 ≈ 3.358`', '`x = ln 40 / ln 3 ≈ 3.358`'),
    },
    real: [
      L('Scales that cover huge ranges are logarithmic: pH (each step is 10× more acidic), decibels, the Richter scale, star brightness. In computer science, binary search takes about `log₂ n` steps — about 20 steps to search a million items.',
        'Las escalas que cubren rangos enormes son logarítmicas: el pH (cada paso es 10× más ácido), los decibeles, la escala de Richter, el brillo de las estrellas. En informática, la búsqueda binaria toma unos `log₂ n` pasos — unos 20 pasos para buscar entre un millón de elementos.'),
    ],
  },
  exercises: [
    { q: L('Evaluate log₂ 32.', 'Evalúa log₂ 32.'), answer: 5, hint: L('2 to what power is 32?', '¿2 elevado a qué potencia da 32?') },
    { q: L('Evaluate log₃ 81 − log₃ 9.', 'Evalúa log₃ 81 − log₃ 9.'), answer: 2,
      hint: L('Quotient rule: log₃(81/9) = log₃ 9.', 'Regla del cociente: log₃(81/9) = log₃ 9.') },
    { q: L('Solve 2ˣ = 50. (2 decimals)', 'Resuelve 2ˣ = 50. (2 decimales)'), answer: 5.64,
      hint: L('x = ln 50 / ln 2', 'x = ln 50 / ln 2') },
  ],
},

// ─── 07 · Unit Circle & Radians ─────────────────────────────────────────────
{
  id: 'unit-circle', color: '#E893C5',
  tag:  L('Angles · Radians · (cos θ, sin θ)', 'Ángulos · Radianes · (cos θ, sen θ)'),
  name: L('The Unit Circle', 'El Círculo Unitario'),
  graph() {
    const th = Math.PI / 3, c = Math.cos(th), s = Math.sin(th);
    const g = Graph({ x: [-1.45, 1.45], y: [-1.45, 1.45] });
    g.grid(0.5).axes();
    g.param(Math.cos, Math.sin, 0, 2 * Math.PI, { color: 1 });
    g.param(t => 0.28 * Math.cos(t), t => 0.28 * Math.sin(t), 0, th, { color: 3, thin: true, delay: 1 });
    g.line(0, 0, c, s, { color: 1, delay: 0.6 });
    g.line(0, 0, c, 0, { color: 2, delay: 1 });
    g.line(c, 0, c, s, { color: 3, delay: 1.2 });
    g.dot(c, s, { color: 1 });
    [[1, 0], [0, 1], [-1, 0], [0, -1]].forEach(([x, y]) => g.dot(x, y, { color: 2, r: 3 }));
    g.text(c, s, '(cos θ, sin θ)', { dx: 8, dy: -8, color: 1, size: 11 });
    g.text(0.32, 0.12, 'θ', { color: 3 });
    g.text(c / 2, 0, 'cos θ', { dy: 16, anchor: 'middle', color: 2, size: 11 });
    g.text(c, s / 2, 'sin θ', { dx: 6, color: 3, size: 11 });
    g.text(-1.4, -1.35, 'x² + y² = 1', { muted: true, size: 11 });
    return g.svg();
  },
  formulas: [
    { label: L('Radian Measure', 'Medida en Radianes'), expr: 'θ = s / r   ·   180° = π rad',
      desc: L('An angle measured by the arc it cuts out. One full turn is 2π ≈ 6.283 radians.',
              'Un ángulo medido por el arco que corta. Una vuelta completa son 2π ≈ 6.283 radianes.') },
    { label: L('Arc Length & Sector Area', 'Longitud de Arco y Área del Sector'), expr: 's = rθ    A = ½ r²θ',
      desc: L('Only valid with θ in radians — that is the main reason radians exist.',
              'Solo válido con θ en radianes — esa es la razón principal por la que existen los radianes.') },
    { label: L('Point on the Unit Circle', 'Punto en el Círculo Unitario'), expr: 'P(θ) = (cos θ, sin θ)',
      desc: L('Defines sine and cosine for every angle — negative, obtuse or bigger than a full turn.',
              'Define el seno (sin o sen) y el coseno para todo ángulo — negativo, obtuso o mayor que una vuelta.') },
    { label: L('Special Values', 'Valores Especiales'), expr: 'sin 30° = ½   sin 45° = √2/2   sin 60° = √3/2',
      desc: L('Cosine runs the same list backwards: cos 30° = √3/2, cos 45° = √2/2, cos 60° = ½.',
              'El coseno recorre la misma lista al revés: cos 30° = √3/2, cos 45° = √2/2, cos 60° = ½.') },
  ],
  deep: {
    idea: [
      L('Degrees are an arbitrary choice (360 per turn, from Babylonian astronomy). <b>Radians</b> measure an angle by how much arc it sweeps on a circle of radius 1. Half a turn sweeps half the circumference, `π`, so `180° = π`.',
        'Los grados son una elección arbitraria (360 por vuelta, de la astronomía babilónica). Los <b>radianes</b> miden un ángulo por cuánto arco recorre en un círculo de radio 1. Media vuelta recorre media circunferencia, `π`, así que `180° = π`.'),
      L('Put an angle at the center of that unit circle: the point where it lands is `(cos θ, sin θ)`. This upgrades sine and cosine from “ratios in a right triangle” to functions of <i>any</i> angle, which is what lets them describe waves and rotation.',
        'Coloca un ángulo en el centro de ese círculo unitario: el punto donde cae es `(cos θ, sen θ)`. Así el seno y el coseno pasan de ser “razones en un triángulo rectángulo” a funciones de <i>cualquier</i> ángulo, lo que les permite describir ondas y rotaciones.'),
    ],
    why: [
      L('<b>Special values from two triangles.</b> A 45-45-90 triangle with hypotenuse 1 has equal legs `x` with `2x² = 1`, so `x = √2/2`. A 30-60-90 triangle is half of an equilateral triangle of side 1: short leg `½`, long leg `√(1 − ¼) = √3/2`.',
        '<b>Valores especiales a partir de dos triángulos.</b> Un triángulo 45-45-90 con hipotenusa 1 tiene catetos iguales `x` con `2x² = 1`, así que `x = √2/2`. Un triángulo 30-60-90 es la mitad de un equilátero de lado 1: cateto corto `½`, cateto largo `√(1 − ¼) = √3/2`.'),
      L('<b>Signs by quadrant</b> come from the coordinates: Quadrant I both +; II cos −, sin +; III both −; IV cos +, sin −. Every angle reduces to a <i>reference angle</i> in Quadrant I plus the right sign.',
        '<b>Los signos por cuadrante</b> vienen de las coordenadas: Cuadrante I ambos +; II cos −, sen +; III ambos −; IV cos +, sen −. Todo ángulo se reduce a un <i>ángulo de referencia</i> en el Cuadrante I más el signo correcto.'),
    ],
    mistakes: [
      L('Calculator in the wrong mode. `sin(30)` in radian mode is −0.988, not 0.5.', 'La calculadora en el modo equivocado. `sin(30)` en modo radianes es −0.988, no 0.5.'),
      L('Using `s = rθ` with degrees. Convert to radians first.', 'Usar `s = rθ` con grados. Convierte a radianes primero.'),
      L('Swapping the order: the x-coordinate is cosine, the y-coordinate is sine.', 'Invertir el orden: la coordenada x es el coseno, la coordenada y es el seno.'),
      L('Forgetting the sign of the quadrant when using a reference angle.', 'Olvidar el signo del cuadrante al usar un ángulo de referencia.'),
    ],
    example: {
      prompt: L('Find the exact values of `sin(5π/6)` and `cos(5π/6)`, and the arc length for that angle on a circle of radius 12.',
                'Halla los valores exactos de `sen(5π/6)` y `cos(5π/6)`, y la longitud de arco para ese ángulo en un círculo de radio 12.'),
      steps: [
        L('Convert to get a feel: `5π/6 · 180/π = 150°`, which is in Quadrant II.', 'Convierte para orientarte: `5π/6 · 180/π = 150°`, que está en el Cuadrante II.'),
        L('Reference angle: `π − 5π/6 = π/6` (30°).', 'Ángulo de referencia: `π − 5π/6 = π/6` (30°).'),
        L('From the 30° values, `sin = ½` and `cos = √3/2`. In Quadrant II sine is +, cosine is −.',
          'Con los valores de 30°, `sen = ½` y `cos = √3/2`. En el Cuadrante II el seno es +, el coseno −.'),
        L('Arc length: `s = rθ = 12 · 5π/6 = 10π ≈ 31.42`.', 'Longitud de arco: `s = rθ = 12 · 5π/6 = 10π ≈ 31.42`.'),
      ],
      answer: L('`sin(5π/6) = ½`, `cos(5π/6) = −√3/2`, `s = 10π ≈ 31.42`', '`sen(5π/6) = ½`, `cos(5π/6) = −√3/2`, `s = 10π ≈ 31.42`'),
    },
    real: [
      L('The Geometry page already used this: every polygon vertex there is placed at `(cx + R·cos θ, cy + R·sin θ)`. Games rotate sprites, phones read the gyroscope, and engineers describe anything that spins — wheels, turbines, planets — with exactly these coordinates.',
        'La página de Geometría ya lo usó: cada vértice de los polígonos se coloca en `(cx + R·cos θ, cy + R·sen θ)`. Los videojuegos rotan personajes, los teléfonos leen el giroscopio y los ingenieros describen todo lo que gira — ruedas, turbinas, planetas — con exactamente estas coordenadas.'),
    ],
  },
  exercises: [
    { q: L('Convert 135° to radians. (decimal, or type 3pi/4)', 'Convierte 135° a radianes. (decimal, o escribe 3pi/4)'), answer: 3 * Math.PI / 4,
      hint: L('Multiply by π/180: 135π/180 = 3π/4 ≈ 2.36.', 'Multiplica por π/180: 135π/180 = 3π/4 ≈ 2.36.') },
    { q: L('Find the arc length on a circle of radius 6 for a central angle of π/3. (2 decimals or 2pi)', 'Halla la longitud de arco en un círculo de radio 6 para un ángulo central de π/3. (2 decimales o 2pi)'), answer: 2 * Math.PI,
      hint: L('s = rθ = 6 · π/3', 's = rθ = 6 · π/3') },
    { q: L('Find cos(2π/3).', 'Halla cos(2π/3).'), answer: -0.5,
      hint: L('120° is in Quadrant II with reference angle 60°; cosine is negative there.', '120° está en el Cuadrante II con ángulo de referencia 60°; ahí el coseno es negativo.') },
  ],
},

// ─── 08 · Graphs of Trig Functions ──────────────────────────────────────────
{
  id: 'trig-graphs', color: '#EBB2C3',
  tag:  L('Sinusoids · Amplitude · Period', 'Sinusoides · Amplitud · Periodo'),
  name: L('Trig Graphs', 'Gráficas Trigonométricas'),
  graph() {
    const P = 2 * Math.PI;
    const g = Graph({ x: [-0.8, 7.2], y: [-2.6, 2.6] });
    g.grid(1).axes();
    g.hline(1, { ghost: true, delay: 0.3 }).hline(-1, { ghost: true, delay: 0.3 });
    g.fn(Math.cos, { color: 2, thin: true, delay: 0.5 });
    g.fn(x => 2 * Math.sin(x), { color: 1 });
    g.line(0, -2.25, P, -2.25, { color: 3, thin: true, delay: 1.2 });
    g.line(0, -2.1, 0, -2.4, { color: 3, thin: true, delay: 1.2 }).line(P, -2.1, P, -2.4, { color: 3, thin: true, delay: 1.2 });
    g.line(Math.PI / 2, 0, Math.PI / 2, 2, { color: 3, thin: true, delay: 1.4 });
    g.dot(Math.PI / 2, 2, { color: 1 });
    g.text(P / 2, -2.25, 'T = 2π', { dy: -6, anchor: 'middle', color: 3, size: 11 });
    g.text(Math.PI / 2, 1, 'A = 2', { dx: 6, color: 3, size: 11 });
    g.text(3.5, 2.35, 'y = 2 sin x', { color: 1 });
    g.text(5.2, 1.35, 'y = cos x', { color: 2, size: 11 });
    [[Math.PI, 'π'], [P, '2π']].forEach(([x, s]) => g.text(x, 0, s, { dy: 15, anchor: 'middle', muted: true, size: 10 }));
    return g.svg();
  },
  formulas: [
    { label: L('General Sinusoid', 'Sinusoide General'), expr: 'y = A sin(B(x − C)) + D',
      desc: L('Every sine or cosine wave is the basic one, stretched and shifted. Four numbers describe it completely.',
              'Toda onda seno o coseno es la básica, estirada y desplazada. Cuatro números la describen por completo.') },
    { label: L('Amplitude & Period', 'Amplitud y Periodo'), expr: 'amplitude = |A|    T = 2π / |B|',
      desc: L('Amplitude = height from the midline to a peak. Period = length of one full cycle.',
              'Amplitud = altura desde la línea media hasta un pico. Periodo = longitud de un ciclo completo.') },
    { label: L('Shifts', 'Desplazamientos'), expr: 'C → right    D → up (midline y = D)',
      desc: L('C is the phase shift (horizontal), D the vertical shift. Factor B out first to read C correctly.',
              'C es el desfase (horizontal), D el desplazamiento vertical. Saca B como factor primero para leer bien C.') },
    { label: L('Tangent', 'Tangente'), expr: 'tan x = sin x / cos x,   T = π',
      desc: L('Vertical asymptotes wherever cos x = 0: x = π/2 + kπ. Unlike sine, it has no amplitude.',
              'Asíntotas verticales donde cos x = 0: x = π/2 + kπ. A diferencia del seno, no tiene amplitud.') },
  ],
  deep: {
    idea: [
      L('Walk around the unit circle at a steady pace and record only your height (the y-coordinate). Plot that height against the angle and you get the <b>sine wave</b>. Record the x-coordinate instead and you get the <b>cosine wave</b> — the same wave, shifted left by `π/2`.',
        'Camina alrededor del círculo unitario a paso constante y anota solo tu altura (la coordenada y). Grafica esa altura contra el ángulo y obtienes la <b>onda seno</b>. Si anotas la coordenada x obtienes la <b>onda coseno</b> — la misma onda, desplazada `π/2` a la izquierda.'),
      L('Because the circle repeats every `2π`, so does the wave. That makes trig functions the natural model for anything that <i>repeats</i>: sound, light, tides, seasons, heartbeats.',
        'Como el círculo se repite cada `2π`, la onda también. Eso hace de las funciones trigonométricas el modelo natural para todo lo que <i>se repite</i>: sonido, luz, mareas, estaciones, latidos.'),
    ],
    why: [
      L('<b>Period:</b> `sin(u)` completes one cycle as u goes from 0 to `2π`. With `u = Bx`, that happens when `Bx = 2π`, i.e. `x = 2π/B`. A bigger B squeezes more cycles into the same space.',
        '<b>Periodo:</b> `sen(u)` completa un ciclo cuando u va de 0 a `2π`. Con `u = Bx`, eso ocurre cuando `Bx = 2π`, es decir `x = 2π/B`. Una B más grande mete más ciclos en el mismo espacio.'),
      L('<b>Amplitude:</b> sine ranges from −1 to 1; multiplying by A stretches that to −A … A. Adding D slides the whole wave up, so max = `D + |A|` and min = `D − |A|`.',
        '<b>Amplitud:</b> el seno va de −1 a 1; multiplicar por A lo estira a −A … A. Sumar D sube toda la onda, así que máx = `D + |A|` y mín = `D − |A|`.'),
    ],
    mistakes: [
      L('Reading the phase shift from `sin(2x − π)` as π. Factor first: `sin(2(x − π/2))` → the shift is `π/2`.',
        'Leer el desfase de `sen(2x − π)` como π. Factoriza primero: `sen(2(x − π/2))` → el desfase es `π/2`.'),
      L('Computing the period as `2π·B` instead of `2π/B`.', 'Calcular el periodo como `2π·B` en lugar de `2π/B`.'),
      L('Giving a negative amplitude. Amplitude is `|A|`; a negative A just flips the wave.',
        'Dar una amplitud negativa. La amplitud es `|A|`; una A negativa solo voltea la onda.'),
    ],
    example: {
      prompt: L('Describe `y = 3 sin(2x − π) + 1`: amplitude, period, phase shift, midline, maximum and minimum.',
                'Describe `y = 3 sen(2x − π) + 1`: amplitud, periodo, desfase, línea media, máximo y mínimo.'),
      steps: [
        L('Factor B out of the inside: `2x − π = 2(x − π/2)`. So `A = 3, B = 2, C = π/2, D = 1`.',
          'Saca B como factor de adentro: `2x − π = 2(x − π/2)`. Así `A = 3, B = 2, C = π/2, D = 1`.'),
        L('Amplitude `|A| = 3`. Period `2π/2 = π`.', 'Amplitud `|A| = 3`. Periodo `2π/2 = π`.'),
        L('Phase shift: `π/2` to the right. Midline: `y = 1`.', 'Desfase: `π/2` a la derecha. Línea media: `y = 1`.'),
        L('Max `= 1 + 3 = 4`, min `= 1 − 3 = −2`.', 'Máx `= 1 + 3 = 4`, mín `= 1 − 3 = −2`.'),
      ],
      answer: L('A = 3, T = π, shift π/2 right, midline y = 1, range [−2, 4]', 'A = 3, T = π, desfase π/2 a la derecha, línea media y = 1, rango [−2, 4]'),
    },
    real: [
      L('Household electricity in Puerto Rico and the US is a sine wave at 60 cycles per second: `V(t) = 170 sin(120πt)`. A musical A note is a 440 Hz sine wave. Daylight hours over a year and the height of the tide are modeled with sinusoids.',
        'La electricidad de las casas en Puerto Rico y EE. UU. es una onda seno de 60 ciclos por segundo: `V(t) = 170 sen(120πt)`. La nota musical La es una onda seno de 440 Hz. Las horas de luz durante el año y la altura de la marea se modelan con sinusoides.'),
    ],
  },
  exercises: [
    { q: L('What is the amplitude of y = −4 sin(3x)?', '¿Cuál es la amplitud de y = −4 sen(3x)?'), answer: 4,
      hint: L('Amplitude = |A|.', 'Amplitud = |A|.') },
    { q: L('What is the period of y = sin(4x)? (decimal, or type pi/2)', '¿Cuál es el periodo de y = sen(4x)? (decimal, o escribe pi/2)'), answer: Math.PI / 2,
      hint: L('T = 2π / 4', 'T = 2π / 4') },
    { q: L('What is the maximum value of y = 2 cos x + 5?', '¿Cuál es el valor máximo de y = 2 cos x + 5?'), answer: 7,
      hint: L('D + |A|', 'D + |A|') },
  ],
},

// ─── 09 · Trig Identities ───────────────────────────────────────────────────
{
  id: 'identities', color: '#E8A0B4',
  tag:  L('Always True · Rewriting Tools', 'Siempre Ciertas · Herramientas para Reescribir'),
  name: L('Trig Identities', 'Identidades Trigonométricas'),
  graph() {
    const g = Graph({ x: [-0.3, 6.6], y: [-0.4, 1.6] });
    g.grid(0.5).axes();
    g.area(x => Math.sin(x) ** 2, 0, 6.6, { color: 1, delay: 1 });
    g.area(x => 1, 0, 6.6, { color: 2, lower: x => Math.sin(x) ** 2, delay: 1.2 });
    g.fn(x => Math.sin(x) ** 2, { color: 1 });
    g.fn(x => Math.cos(x) ** 2, { color: 2, delay: 0.4 });
    g.hline(1, { color: 3, delay: 0.8 });
    g.text(0.4, 1.35, 'sin²x + cos²x = 1', { color: 3 });
    g.text(Math.PI / 2, 0.82, 'sin²x', { anchor: 'middle', color: 1, size: 11, dy: 30 });
    g.text(Math.PI, 0.82, 'cos²x', { anchor: 'middle', color: 2, size: 11, dy: 30 });
    return g.svg();
  },
  formulas: [
    { label: L('Pythagorean', 'Pitagórica'), expr: 'sin²θ + cos²θ = 1',
      desc: L('Comes straight from x² + y² = 1. Divide by cos²θ to get 1 + tan²θ = sec²θ.',
              'Sale directo de x² + y² = 1. Divide entre cos²θ para obtener 1 + tan²θ = sec²θ.') },
    { label: L('Sum & Difference (sine)', 'Suma y Diferencia (seno)'), expr: 'sin(α ± β) = sin α cos β ± cos α sin β',
      desc: L('Lets you find exact values for angles like 75° = 45° + 30°.', 'Permite hallar valores exactos de ángulos como 75° = 45° + 30°.') },
    { label: L('Sum & Difference (cosine)', 'Suma y Diferencia (coseno)'), expr: 'cos(α ± β) = cos α cos β ∓ sin α sin β',
      desc: L('Notice the sign flips: a sum inside gives a minus outside.', 'Fíjate que el signo cambia: una suma adentro da un menos afuera.') },
    { label: L('Double Angle', 'Ángulo Doble'), expr: 'sin 2θ = 2 sin θ cos θ    cos 2θ = 1 − 2 sin²θ',
      desc: L('Set α = β in the sum formulas. cos 2θ also equals cos²θ − sin²θ and 2cos²θ − 1.',
              'Haz α = β en las fórmulas de suma. cos 2θ también es cos²θ − sen²θ y 2cos²θ − 1.') },
  ],
  deep: {
    idea: [
      L('An <b>identity</b> is an equation that is true for <i>every</i> angle — not just one solution. Identities are rewriting tools: they let you swap an expression for an equivalent one that is easier to work with, exactly like factoring does in algebra.',
        'Una <b>identidad</b> es una ecuación que es cierta para <i>todo</i> ángulo — no solo para una solución. Las identidades son herramientas para reescribir: permiten cambiar una expresión por otra equivalente que es más fácil de usar, igual que factorizar en álgebra.'),
      L('The graph shows the most important one: wherever `sin²x` is big, `cos²x` is small, and together they always fill exactly up to 1.',
        'La gráfica muestra la más importante: donde `sen²x` es grande, `cos²x` es pequeño, y juntos siempre llenan exactamente hasta 1.'),
    ],
    why: [
      L('<b>Pythagorean identity:</b> the point `(cos θ, sin θ)` lies on the unit circle `x² + y² = 1`. Substitute and you are done.',
        '<b>Identidad pitagórica:</b> el punto `(cos θ, sen θ)` está en el círculo unitario `x² + y² = 1`. Sustituye y listo.'),
      L('<b>Double angle from sum:</b> `sin(θ + θ) = sin θ cos θ + cos θ sin θ = 2 sin θ cos θ`. Most identities are built from a few others this way — you only need to memorize the core ones.',
        '<b>Ángulo doble desde la suma:</b> `sen(θ + θ) = sen θ cos θ + cos θ sen θ = 2 sen θ cos θ`. La mayoría de las identidades se construyen así a partir de unas pocas — solo hay que memorizar las básicas.'),
    ],
    mistakes: [
      L('`sin(α + β) ≠ sin α + sin β`. Try α = β = 90°: left side is sin 180° = 0, right side is 2.',
        '`sen(α + β) ≠ sen α + sen β`. Prueba α = β = 90°: el lado izquierdo es sen 180° = 0, el derecho es 2.'),
      L('`sin 2θ ≠ 2 sin θ`. Use the double-angle formula.', '`sen 2θ ≠ 2 sen θ`. Usa la fórmula del ángulo doble.'),
      L('`sin²θ` means `(sin θ)²`, not `sin(θ²)`.', '`sen²θ` significa `(sen θ)²`, no `sen(θ²)`.'),
      L('When proving an identity, moving terms across the equals sign. Work on one side until it matches the other.',
        'Al demostrar una identidad, pasar términos al otro lado del igual. Trabaja un solo lado hasta que coincida con el otro.'),
    ],
    example: {
      prompt: L('Find the exact value of `sin 75°`.', 'Halla el valor exacto de `sen 75°`.'),
      steps: [
        L('Split into known angles: `75° = 45° + 30°`.', 'Divide en ángulos conocidos: `75° = 45° + 30°`.'),
        L('Apply the sum formula: `sin 45° cos 30° + cos 45° sin 30°`.', 'Aplica la fórmula de suma: `sen 45° cos 30° + cos 45° sen 30°`.'),
        L('Substitute: `(√2/2)(√3/2) + (√2/2)(1/2) = √6/4 + √2/4`.', 'Sustituye: `(√2/2)(√3/2) + (√2/2)(1/2) = √6/4 + √2/4`.'),
        L('Combine: `(√6 + √2)/4 ≈ (2.449 + 1.414)/4 ≈ 0.9659`. A calculator agrees ✓.',
          'Combina: `(√6 + √2)/4 ≈ (2.449 + 1.414)/4 ≈ 0.9659`. La calculadora coincide ✓.'),
      ],
      answer: L('`sin 75° = (√6 + √2)/4 ≈ 0.9659`', '`sen 75° = (√6 + √2)/4 ≈ 0.9659`'),
    },
    real: [
      L('Every 3D game rotates objects with a rotation matrix whose entries come straight from the sum formulas. In physics, two sound waves adding together (interference, noise-cancelling headphones) are simplified with sum-to-product identities. In calculus, `sin²x = (1 − cos 2x)/2` is how you integrate sin²x.',
        'Todo videojuego 3D rota objetos con una matriz de rotación cuyas entradas salen directamente de las fórmulas de suma. En física, dos ondas de sonido que se suman (interferencia, audífonos con cancelación de ruido) se simplifican con identidades de suma a producto. En cálculo, `sen²x = (1 − cos 2x)/2` es la forma de integrar sen²x.'),
    ],
  },
  exercises: [
    { q: L('If cos θ = 0.28 and θ is in Quadrant I, find sin θ.', 'Si cos θ = 0.28 y θ está en el Cuadrante I, halla sen θ.'), answer: 0.96,
      hint: L('sin θ = √(1 − 0.28²) = √0.9216', 'sen θ = √(1 − 0.28²) = √0.9216') },
    { q: L('If sin θ = 0.6 and cos θ = 0.8, find cos 2θ.', 'Si sen θ = 0.6 y cos θ = 0.8, halla cos 2θ.'), answer: 0.28,
      hint: L('cos 2θ = cos²θ − sin²θ = 0.64 − 0.36', 'cos 2θ = cos²θ − sen²θ = 0.64 − 0.36') },
    { q: L('Find sin 75° to 4 decimal places.', 'Halla sen 75° con 4 decimales.'), answer: 0.9659,
      hint: L('(√6 + √2)/4', '(√6 + √2)/4') },
  ],
},

// ─── 10 · Law of Sines & Cosines ────────────────────────────────────────────
{
  id: 'oblique', color: '#D4A0D8',
  tag:  L('Any Triangle · Not Just Right Ones', 'Cualquier Triángulo · No Solo Rectángulos'),
  name: L('Law of Sines & Cosines', 'Ley de Senos y Cosenos'),
  graph() {
    const A = [-2.6, -1.6], B = [3.0, -1.6], C = [0.9, 2.3];
    const g = Graph({ x: [-3.5, 3.9], y: [-2.9, 3.4] });
    g.grid(1);
    g.line(C[0], C[1], C[0], A[1], { dash: true, color: 2, delay: 1 });
    g.poly([A, B, C], { close: true, fill: true, color: 1 });
    [A, B, C].forEach(p => g.dot(p[0], p[1], { color: 1 }));
    g.text(A[0], A[1], 'A', { dx: -14, dy: 14, color: 1 });
    g.text(B[0], B[1], 'B', { dx: 6, dy: 14, color: 1 });
    g.text(C[0], C[1], 'C', { dx: -4, dy: -10, color: 1 });
    g.text((B[0] + C[0]) / 2, (B[1] + C[1]) / 2, 'a', { dx: 10, color: 3 });
    g.text((A[0] + C[0]) / 2, (A[1] + C[1]) / 2, 'b', { dx: -18, color: 3 });
    g.text((A[0] + B[0]) / 2, A[1], 'c', { dy: 20, anchor: 'middle', color: 3 });
    g.text(C[0], 0.2, 'h', { dx: 6, color: 2 });
    return g.svg();
  },
  formulas: [
    { label: L('Law of Sines', 'Ley de Senos'), expr: 'a / sin A = b / sin B = c / sin C',
      desc: L('Each side over the sine of its opposite angle gives the same ratio. Use it for AAS, ASA and SSA.',
              'Cada lado entre el seno de su ángulo opuesto da la misma razón. Úsala para AAS, ALA y LLA.') },
    { label: L('Law of Cosines', 'Ley de Cosenos'), expr: 'c² = a² + b² − 2ab cos C',
      desc: L('Pythagoras with a correction term. Use it for SAS (find the third side) and SSS (find an angle).',
              'Pitágoras con un término de corrección. Úsala para LAL (hallar el tercer lado) y LLL (hallar un ángulo).') },
    { label: L('Triangle Area (SAS)', 'Área del Triángulo (LAL)'), expr: 'K = ½ ab sin C',
      desc: L('The height is b sin C, so this is just ½ · base · height in disguise.', 'La altura es b sen C, así que es ½ · base · altura disfrazada.') },
    { label: L('Ambiguous Case (SSA)', 'Caso Ambiguo (LLA)'), expr: 'h = b sin A  vs  a',
      desc: L('a < h: no triangle · a = h: one right triangle · h < a < b: two triangles · a ≥ b: one.',
              'a < h: ningún triángulo · a = h: uno rectángulo · h < a < b: dos triángulos · a ≥ b: uno.') },
  ],
  deep: {
    idea: [
      L('SOH-CAH-TOA only works in right triangles. Real problems — a surveyor measuring across a river, a ship plotting a course — have triangles with no right angle. These two laws solve <b>any</b> triangle once you know three parts (with at least one side).',
        'SOH-CAH-TOA solo funciona en triángulos rectángulos. Los problemas reales — un agrimensor midiendo a través de un río, un barco trazando su ruta — tienen triángulos sin ángulo recto. Estas dos leyes resuelven <b>cualquier</b> triángulo una vez conoces tres partes (con al menos un lado).'),
      L('Convention: a capital letter is an angle, the matching lowercase letter is the side <i>across</i> from it.',
        'Convención: una letra mayúscula es un ángulo, y la minúscula correspondiente es el lado <i>opuesto</i> a él.'),
    ],
    why: [
      L('<b>Law of Sines:</b> drop the height h from C (the dashed line). In the left right-triangle, `h = b sin A`; in the right one, `h = a sin B`. So `b sin A = a sin B`, which rearranges to `a/sin A = b/sin B`.',
        '<b>Ley de Senos:</b> traza la altura h desde C (la línea discontinua). En el triángulo rectángulo izquierdo, `h = b sen A`; en el derecho, `h = a sen B`. Entonces `b sen A = a sen B`, que se reordena como `a/sen A = b/sen B`.'),
      L('<b>Law of Cosines</b> generalizes Pythagoras: when `C = 90°`, `cos C = 0` and the formula becomes `c² = a² + b²`. When C is obtuse, cos C is negative and c gets longer than Pythagoras would predict — exactly what you would expect.',
        'La <b>Ley de Cosenos</b> generaliza a Pitágoras: cuando `C = 90°`, `cos C = 0` y la fórmula queda `c² = a² + b²`. Cuando C es obtuso, cos C es negativo y c resulta más largo de lo que predice Pitágoras — justo lo esperado.'),
    ],
    mistakes: [
      L('Ignoring the ambiguous case: in SSA, `sin B = 0.8` has two answers in a triangle, `53.1°` and `126.9°`. Check whether both fit.',
        'Ignorar el caso ambiguo: en LLA, `sen B = 0.8` tiene dos respuestas en un triángulo, `53.1°` y `126.9°`. Comprueba si ambas caben.'),
      L('Pairing a side with the wrong angle. Side a always goes with the angle opposite it.', 'Emparejar un lado con el ángulo equivocado. El lado a siempre va con el ángulo opuesto.'),
      L('Calculator in radian mode while the problem uses degrees.', 'La calculadora en modo radianes cuando el problema usa grados.'),
      L('Using the Law of Sines to find an obtuse angle — arcsin only returns acute angles. Find the largest angle with the Law of Cosines first.',
        'Usar la Ley de Senos para hallar un ángulo obtuso — arcsen solo devuelve ángulos agudos. Halla primero el ángulo mayor con la Ley de Cosenos.'),
    ],
    example: {
      prompt: L('In a triangle, `a = 7`, `b = 10` and `C = 60°`. Find side c and the area.', 'En un triángulo, `a = 7`, `b = 10` y `C = 60°`. Halla el lado c y el área.'),
      steps: [
        L('This is SAS → Law of Cosines: `c² = 7² + 10² − 2·7·10·cos 60°`.', 'Es LAL → Ley de Cosenos: `c² = 7² + 10² − 2·7·10·cos 60°`.'),
        L('`cos 60° = ½`, so `c² = 49 + 100 − 70 = 79`, and `c = √79 ≈ 8.89`.', '`cos 60° = ½`, así que `c² = 49 + 100 − 70 = 79`, y `c = √79 ≈ 8.89`.'),
        L('Area: `K = ½ · 7 · 10 · sin 60° = 35 · (√3/2)`.', 'Área: `K = ½ · 7 · 10 · sen 60° = 35 · (√3/2)`.'),
        L('`K ≈ 35 · 0.8660 ≈ 30.31` square units.', '`K ≈ 35 · 0.8660 ≈ 30.31` unidades cuadradas.'),
      ],
      answer: L('`c = √79 ≈ 8.89`, area ≈ `30.31`', '`c = √79 ≈ 8.89`, área ≈ `30.31`'),
    },
    real: [
      L('Surveying land, triangulating a cell phone’s position between towers, measuring the distance to a nearby star with parallax, and navigation at sea all solve oblique triangles.',
        'La agrimensura, la triangulación de la posición de un celular entre antenas, la medición de la distancia a una estrella cercana por paralaje y la navegación marítima resuelven triángulos oblicuángulos.'),
    ],
  },
  exercises: [
    { q: L('a = 8, A = 30°, B = 45°. Find b. (2 decimals)', 'a = 8, A = 30°, B = 45°. Halla b. (2 decimales)'), answer: 11.31,
      hint: L('b = 8 · sin 45° / sin 30°', 'b = 8 · sen 45° / sen 30°') },
    { q: L('a = 5, b = 8, C = 60°. Find c.', 'a = 5, b = 8, C = 60°. Halla c.'), answer: 7,
      hint: L('c² = 25 + 64 − 2·5·8·½ = 49', 'c² = 25 + 64 − 2·5·8·½ = 49') },
    { q: L('Find the area of a triangle with a = 6, b = 10 and C = 30°.', 'Halla el área de un triángulo con a = 6, b = 10 y C = 30°.'), answer: 15,
      hint: L('½ · 6 · 10 · sin 30°', '½ · 6 · 10 · sen 30°') },
  ],
},

// ─── 11 · Vectors ───────────────────────────────────────────────────────────
{
  id: 'vectors', color: '#ADC6E5',
  tag:  L('Magnitude + Direction', 'Magnitud + Dirección'),
  name: L('Vectors', 'Vectores'),
  graph() {
    const g = Graph({ x: [-0.8, 5.2], y: [-0.8, 5.2] });
    g.grid(1).axes({ ticks: 1 });
    g.line(3, 1, 4, 3.5, { dash: true, ghost: true }).line(1, 2.5, 4, 3.5, { dash: true, ghost: true });
    g.arrow(0, 0, 3, 1, { color: 1 });
    g.arrow(0, 0, 1, 2.5, { color: 2, delay: 0.4 });
    g.arrow(0, 0, 4, 3.5, { color: 3, delay: 0.9 });
    g.text(3, 1, 'u = ⟨3, 1⟩', { dx: 6, dy: 14, color: 1 });
    g.text(1, 2.5, 'v = ⟨1, 2.5⟩', { dx: -18, dy: -10, color: 2 });
    g.text(4, 3.5, 'u + v', { dx: 6, dy: -8, color: 3 });
    return g.svg();
  },
  formulas: [
    { label: L('Component Form', 'Forma de Componentes'), expr: 'v = ⟨a, b⟩ = a·i + b·j',
      desc: L('How far right and how far up. Add or subtract vectors component by component.',
              'Cuánto a la derecha y cuánto hacia arriba. Los vectores se suman o restan componente a componente.') },
    { label: L('Magnitude', 'Magnitud'), expr: '|v| = √(a² + b²)',
      desc: L('The length of the arrow — Pythagoras again. A unit vector has length 1: v / |v|.',
              'La longitud de la flecha — Pitágoras otra vez. Un vector unitario tiene longitud 1: v / |v|.') },
    { label: L('Direction', 'Dirección'), expr: 'θ = tan⁻¹(b / a)   (check the quadrant)',
      desc: L('Going back: a = |v| cos θ, b = |v| sin θ.', 'De regreso: a = |v| cos θ, b = |v| sen θ.') },
    { label: L('Dot Product', 'Producto Punto'), expr: 'u · v = u₁v₁ + u₂v₂ = |u||v| cos θ',
      desc: L('A single number measuring how aligned two vectors are. u · v = 0 means perpendicular.',
              'Un solo número que mide qué tan alineados están dos vectores. u · v = 0 significa perpendiculares.') },
  ],
  deep: {
    idea: [
      L('Some quantities need only a size (temperature: 30°). Others need a size <b>and</b> a direction (wind: 30 km/h toward the northeast). Those are <b>vectors</b>, drawn as arrows. Position does not matter — only length and direction.',
        'Algunas cantidades solo necesitan un tamaño (temperatura: 30°). Otras necesitan tamaño <b>y</b> dirección (viento: 30 km/h hacia el noreste). Esas son <b>vectores</b>, dibujados como flechas. La posición no importa — solo la longitud y la dirección.'),
      L('To add vectors, place them tip-to-tail; the sum goes from the first tail to the last tip. In components it is even easier: `⟨3, 1⟩ + ⟨1, 2.5⟩ = ⟨4, 3.5⟩` — the diagonal of the parallelogram on the left.',
        'Para sumar vectores, colócalos punta con cola; la suma va de la primera cola a la última punta. En componentes es aún más fácil: `⟨3, 1⟩ + ⟨1, 2.5⟩ = ⟨4, 3.5⟩` — la diagonal del paralelogramo de la izquierda.'),
    ],
    why: [
      L('<b>Why the dot product gives the angle:</b> the triangle formed by u, v and `u − v` obeys the Law of Cosines: `|u − v|² = |u|² + |v|² − 2|u||v| cos θ`. Expanding the left side with components leaves `u₁v₁ + u₂v₂ = |u||v| cos θ`.',
        '<b>Por qué el producto punto da el ángulo:</b> el triángulo formado por u, v y `u − v` cumple la Ley de Cosenos: `|u − v|² = |u|² + |v|² − 2|u||v| cos θ`. Al expandir el lado izquierdo con componentes queda `u₁v₁ + u₂v₂ = |u||v| cos θ`.'),
      L('So the sign tells you a lot: positive → angle under 90°, zero → exactly 90°, negative → over 90°.',
        'Así que el signo dice mucho: positivo → ángulo menor de 90°, cero → exactamente 90°, negativo → mayor de 90°.'),
    ],
    mistakes: [
      L('Adding magnitudes: `|u + v|` is usually <i>less</i> than `|u| + |v|`. Add components, then find the length.',
        'Sumar magnitudes: `|u + v|` suele ser <i>menor</i> que `|u| + |v|`. Suma componentes y luego halla la longitud.'),
      L('Trusting `tan⁻¹` blindly: for `⟨−3, −3⟩` it returns 45°, but the vector points at 225°.',
        'Confiar ciegamente en `tan⁻¹`: para `⟨−3, −3⟩` devuelve 45°, pero el vector apunta a 225°.'),
      L('Treating the dot product as a vector. It is a plain number (a scalar).', 'Tratar el producto punto como un vector. Es un simple número (un escalar).'),
    ],
    example: {
      prompt: L('Find the angle between `u = ⟨3, 4⟩` and `v = ⟨5, −2⟩`.', 'Halla el ángulo entre `u = ⟨3, 4⟩` y `v = ⟨5, −2⟩`.'),
      steps: [
        L('Dot product: `u · v = 3·5 + 4·(−2) = 15 − 8 = 7`.', 'Producto punto: `u · v = 3·5 + 4·(−2) = 15 − 8 = 7`.'),
        L('Magnitudes: `|u| = √(9 + 16) = 5`, `|v| = √(25 + 4) = √29 ≈ 5.385`.', 'Magnitudes: `|u| = √(9 + 16) = 5`, `|v| = √(25 + 4) = √29 ≈ 5.385`.'),
        L('`cos θ = 7 / (5 · 5.385) ≈ 0.2600`.', '`cos θ = 7 / (5 · 5.385) ≈ 0.2600`.'),
        L('`θ = cos⁻¹(0.2600) ≈ 74.9°`. Positive dot product → acute angle ✓.', '`θ = cos⁻¹(0.2600) ≈ 74.9°`. Producto punto positivo → ángulo agudo ✓.'),
      ],
      answer: L('`θ ≈ 74.9°`', '`θ ≈ 74.9°`'),
    },
    real: [
      L('A plane flying into a crosswind adds its velocity vector to the wind’s. Game engines move every character with vectors, and 3D lighting uses the dot product between a surface and the light direction to decide how bright each pixel is. Search engines and AI compare meanings with dot products of very long vectors.',
        'Un avión con viento cruzado suma su vector velocidad al del viento. Los motores de videojuegos mueven cada personaje con vectores, y la iluminación 3D usa el producto punto entre una superficie y la dirección de la luz para decidir el brillo de cada píxel. Los buscadores y la IA comparan significados con productos punto de vectores muy largos.'),
    ],
  },
  exercises: [
    { q: L('Find the magnitude of ⟨6, 8⟩.', 'Halla la magnitud de ⟨6, 8⟩.'), answer: 10,
      hint: L('√(36 + 64)', '√(36 + 64)') },
    { q: L('Compute ⟨2, −3⟩ · ⟨4, 5⟩.', 'Calcula ⟨2, −3⟩ · ⟨4, 5⟩.'), answer: -7,
      hint: L('2·4 + (−3)·5', '2·4 + (−3)·5') },
    { q: L('For what value of k is ⟨3, k⟩ perpendicular to ⟨4, −6⟩?', '¿Para qué valor de k es ⟨3, k⟩ perpendicular a ⟨4, −6⟩?'), answer: 2,
      hint: L('Set the dot product to 0: 12 − 6k = 0.', 'Iguala el producto punto a 0: 12 − 6k = 0.') },
  ],
},

// ─── 12 · Polar Coordinates & Complex Numbers ───────────────────────────────
{
  id: 'polar-complex', color: '#8FB8E8',
  tag:  L('(r, θ) · a + bi · Rotation', '(r, θ) · a + bi · Rotación'),
  name: L('Polar & Complex', 'Polares y Complejos'),
  graph() {
    const g = Graph({ x: [-2.5, 2.5], y: [-2.5, 2.5] });
    g.grid(0.5).axes();
    g.param(t => 2 * Math.cos(t), t => 2 * Math.sin(t), 0, 2 * Math.PI, { ghost: true, delay: 0.1 });
    g.polar(t => 2 * Math.cos(3 * t), 0, Math.PI, { color: 1, samples: 480 });
    g.line(0, 0, 1, 1, { color: 2, delay: 1.2 });
    g.dot(1, 1, { color: 2 });
    g.text(1, 1, '1 + i', { dx: 8, dy: -6, color: 2 });
    g.text(1, 1, '√2·e^(iπ/4)', { dx: 8, dy: 10, color: 2, size: 10 });
    g.text(-2.4, 2.25, 'r = 2 cos 3θ', { color: 1 });
    g.text(2.3, 0, 'Re', { dy: -6, anchor: 'end', muted: true, size: 10 });
    g.text(0, 2.35, 'Im', { dx: 6, muted: true, size: 10 });
    return g.svg();
  },
  formulas: [
    { label: L('Polar ↔ Rectangular', 'Polar ↔ Rectangular'), expr: 'x = r cos θ   y = r sin θ   r² = x² + y²',
      desc: L('Describe a point by its distance r from the origin and its angle θ instead of (x, y).',
              'Describe un punto por su distancia r al origen y su ángulo θ en lugar de (x, y).') },
    { label: L('Complex Numbers', 'Números Complejos'), expr: 'z = a + bi,   i² = −1,   |z| = √(a² + b²)',
      desc: L('A point in the complex plane: a on the real axis, b on the imaginary axis.',
              'Un punto en el plano complejo: a en el eje real, b en el eje imaginario.') },
    { label: L('Polar Form', 'Forma Polar'), expr: 'z = r(cos θ + i sin θ) = r·e^(iθ)',
      desc: L('Multiplying complex numbers multiplies their lengths and adds their angles.',
              'Multiplicar números complejos multiplica sus longitudes y suma sus ángulos.') },
    { label: L('De Moivre’s Theorem', 'Teorema de De Moivre'), expr: 'zⁿ = rⁿ(cos nθ + i sin nθ)',
      desc: L('Powers become easy: raise the length to n, multiply the angle by n.',
              'Las potencias se vuelven fáciles: eleva la longitud a la n, multiplica el ángulo por n.') },
  ],
  deep: {
    idea: [
      L('Rectangular coordinates say “go right x, up y”. <b>Polar coordinates</b> say “face angle θ, walk r”. Curves that spin around a center — roses, spirals, cardioids — have simple polar equations and awful rectangular ones. The rose on the left is just `r = 2 cos 3θ`.',
        'Las coordenadas rectangulares dicen “ve x a la derecha, y hacia arriba”. Las <b>coordenadas polares</b> dicen “mira hacia el ángulo θ y camina r”. Las curvas que giran alrededor de un centro — rosas, espirales, cardioides — tienen ecuaciones polares simples y rectangulares horribles. La rosa de la izquierda es solo `r = 2 cos 3θ`.'),
      L('<b>Complex numbers</b> `a + bi` are points in a plane too. Written in polar form, multiplication is just rotation and scaling — multiply by `i` and you rotate 90°.',
        'Los <b>números complejos</b> `a + bi` también son puntos en un plano. En forma polar, multiplicar es solo rotar y escalar — multiplica por `i` y rotas 90°.'),
    ],
    why: [
      L('Multiply two numbers in polar form and use the sum formulas from Trig Identities: `r₁(cos α + i sin α) · r₂(cos β + i sin β) = r₁r₂(cos(α + β) + i sin(α + β))`. Lengths multiply, angles add. Do it n times with the same number and you get De Moivre.',
        'Multiplica dos números en forma polar y usa las fórmulas de suma de Identidades: `r₁(cos α + i sen α) · r₂(cos β + i sen β) = r₁r₂(cos(α + β) + i sen(α + β))`. Las longitudes se multiplican, los ángulos se suman. Hazlo n veces con el mismo número y obtienes De Moivre.'),
      L('Euler’s formula `e^(iθ) = cos θ + i sin θ` packs this into one symbol. With `θ = π` it gives the famous `e^(iπ) + 1 = 0`.',
        'La fórmula de Euler `e^(iθ) = cos θ + i sen θ` lo resume en un símbolo. Con `θ = π` da la famosa `e^(iπ) + 1 = 0`.'),
    ],
    mistakes: [
      L('Getting θ from `tan⁻¹(y/x)` without checking the quadrant (same trap as vectors).', 'Obtener θ con `tan⁻¹(y/x)` sin revisar el cuadrante (la misma trampa que en vectores).'),
      L('Writing `i² = 1`. It is −1 — that is the entire point of i.', 'Escribir `i² = 1`. Es −1 — ese es todo el sentido de i.'),
      L('Thinking a point has one polar address. `(2, π/6)`, `(2, 13π/6)` and `(−2, 7π/6)` are the same point.',
        'Pensar que un punto tiene una sola dirección polar. `(2, π/6)`, `(2, 13π/6)` y `(−2, 7π/6)` son el mismo punto.'),
    ],
    example: {
      prompt: L('Compute `(1 + i)⁸`.', 'Calcula `(1 + i)⁸`.'),
      steps: [
        L('Polar form of `1 + i`: `r = √(1² + 1²) = √2`, `θ = π/4` (Quadrant I).', 'Forma polar de `1 + i`: `r = √(1² + 1²) = √2`, `θ = π/4` (Cuadrante I).'),
        L('De Moivre: length `(√2)⁸ = 2⁴ = 16`; angle `8 · π/4 = 2π`.', 'De Moivre: longitud `(√2)⁸ = 2⁴ = 16`; ángulo `8 · π/4 = 2π`.'),
        L('`16(cos 2π + i sin 2π) = 16(1 + 0i) = 16`.', '`16(cos 2π + i sen 2π) = 16(1 + 0i) = 16`.'),
        L('Multiplying `(1 + i)` out eight times by hand would take a page — polar form takes three lines.', 'Multiplicar `(1 + i)` ocho veces a mano tomaría una página — la forma polar toma tres líneas.'),
      ],
      answer: L('`(1 + i)⁸ = 16`', '`(1 + i)⁸ = 16`'),
    },
    real: [
      L('Electrical engineers represent alternating currents as complex numbers (phasors). Every MP3, JPEG and Wi-Fi signal is processed with the Fourier transform, built on `e^(iθ)`. Radar screens and robot arms naturally use polar coordinates.',
        'Los ingenieros eléctricos representan las corrientes alternas como números complejos (fasores). Cada MP3, JPEG y señal Wi-Fi se procesa con la transformada de Fourier, construida sobre `e^(iθ)`. Las pantallas de radar y los brazos robóticos usan coordenadas polares de forma natural.'),
    ],
  },
  exercises: [
    { q: L('Convert the polar point (4, π/3) to rectangular. What is x?', 'Convierte el punto polar (4, π/3) a rectangular. ¿Cuánto vale x?'), answer: 2,
      hint: L('x = 4 cos(π/3) = 4 · ½', 'x = 4 cos(π/3) = 4 · ½') },
    { q: L('Find |3 + 4i|.', 'Halla |3 + 4i|.'), answer: 5,
      hint: L('√(3² + 4²)', '√(3² + 4²)') },
    { q: L('(1 + i)⁴ is a real number. Which one?', '(1 + i)⁴ es un número real. ¿Cuál?'), answer: -4,
      hint: L('Length (√2)⁴ = 4, angle 4·π/4 = π, and cos π = −1.', 'Longitud (√2)⁴ = 4, ángulo 4·π/4 = π, y cos π = −1.') },
  ],
},

// ─── 13 · Conic Sections ────────────────────────────────────────────────────
{
  id: 'conics', color: '#9FD3D8',
  tag:  L('Slices of a Cone', 'Cortes de un Cono'),
  name: L('Conic Sections', 'Secciones Cónicas'),
  graph() {
    const a = 3, b = 2, c = Math.sqrt(5), t = 1.1;
    const P = [a * Math.cos(t), b * Math.sin(t)];
    const g = Graph({ x: [-4, 4], y: [-4, 4] });
    g.grid(1).axes({ ticks: 1 });
    g.param(s => a * Math.cos(s), s => b * Math.sin(s), 0, 2 * Math.PI, { color: 1 });
    g.line(-c, 0, P[0], P[1], { color: 2, thin: true, delay: 1 });
    g.line(c, 0, P[0], P[1], { color: 3, thin: true, delay: 1.2 });
    g.dot(-c, 0, { color: 2 }).dot(c, 0, { color: 3 }).dot(P[0], P[1], { color: 1 });
    g.text(-c, 0, 'F₁', { dx: -8, dy: 18, color: 2 });
    g.text(c, 0, 'F₂', { dx: -4, dy: 18, color: 3 });
    g.text(-3.8, 3.5, 'x²/9 + y²/4 = 1', { color: 1 });
    g.text(-3.8, -3.4, 'd₁ + d₂ = 2a = 6', { muted: true, size: 11 });
    return g.svg();
  },
  formulas: [
    { label: L('Circle', 'Círculo'), expr: '(x − h)² + (y − k)² = r²',
      desc: L('Every point at distance r from the center (h, k).', 'Todos los puntos a distancia r del centro (h, k).') },
    { label: L('Parabola', 'Parábola'), expr: '(x − h)² = 4p(y − k)',
      desc: L('Every point equally far from a focus and a line (the directrix). p = vertex-to-focus distance.',
              'Todos los puntos a igual distancia de un foco y una recta (la directriz). p = distancia del vértice al foco.') },
    { label: L('Ellipse', 'Elipse'), expr: 'x²/a² + y²/b² = 1,   c² = a² − b²',
      desc: L('The sum of the distances to two foci is constant (2a). a = semi-major axis, foci at (±c, 0).',
              'La suma de las distancias a dos focos es constante (2a). a = semieje mayor, focos en (±c, 0).') },
    { label: L('Hyperbola', 'Hipérbola'), expr: 'x²/a² − y²/b² = 1,   c² = a² + b²',
      desc: L('The difference of the distances to two foci is constant. Asymptotes y = ±(b/a)x.',
              'La diferencia de las distancias a dos focos es constante. Asíntotas y = ±(b/a)x.') },
  ],
  deep: {
    idea: [
      L('Slice a double cone with a flat plane. Straight across → <b>circle</b>. Tilted a little → <b>ellipse</b>. Parallel to the side → <b>parabola</b>. Steep enough to cut both halves → <b>hyperbola</b>. The ancient Greeks studied these 2,000 years before anyone knew planets move on them.',
        'Corta un cono doble con un plano. Derecho → <b>círculo</b>. Un poco inclinado → <b>elipse</b>. Paralelo al costado → <b>parábola</b>. Tan inclinado que corta ambas mitades → <b>hipérbola</b>. Los griegos antiguos los estudiaron 2,000 años antes de que se supiera que los planetas se mueven sobre ellos.'),
      L('Each one also has a <b>distance definition</b>, and that is what makes them useful. In the ellipse on the left, the blue and pink distances always add up to 6, no matter where the gold point is.',
        'Cada una también tiene una <b>definición por distancias</b>, y eso las hace útiles. En la elipse de la izquierda, las distancias azul y rosa siempre suman 6, sin importar dónde esté el punto dorado.'),
    ],
    why: [
      L('<b>Reflective property:</b> a ray leaving one focus of an ellipse bounces off the curve straight into the other focus. For a parabola, every ray from the focus bounces out parallel — and incoming parallel rays all meet at the focus. That is why satellite dishes are parabolas.',
        '<b>Propiedad reflectora:</b> un rayo que sale de un foco de una elipse rebota en la curva y llega directo al otro foco. En una parábola, todo rayo desde el foco rebota en dirección paralela — y los rayos paralelos que entran se juntan en el foco. Por eso las antenas parabólicas son parábolas.'),
      L('<b>Recognizing them from the general form</b> `Ax² + Cy² + Dx + Ey + F = 0`: A = C → circle; A, C same sign → ellipse; opposite signs → hyperbola; one of them 0 → parabola. Complete the square to find the center.',
        '<b>Reconocerlas desde la forma general</b> `Ax² + Cy² + Dx + Ey + F = 0`: A = C → círculo; A y C con el mismo signo → elipse; signos opuestos → hipérbola; uno de ellos 0 → parábola. Completa el cuadrado para hallar el centro.'),
    ],
    mistakes: [
      L('Mixing up `c² = a² − b²` (ellipse) and `c² = a² + b²` (hyperbola).', 'Confundir `c² = a² − b²` (elipse) con `c² = a² + b²` (hipérbola).'),
      L('Assuming a² is always under x². In an ellipse, a² is the <i>larger</i> denominator, and it tells you which way the major axis points.',
        'Suponer que a² siempre está bajo x². En una elipse, a² es el denominador <i>mayor</i>, y dice hacia dónde apunta el eje mayor.'),
      L('Reading r² as r: `x² + y² = 49` has radius 7, not 49.', 'Leer r² como r: `x² + y² = 49` tiene radio 7, no 49.'),
    ],
    example: {
      prompt: L('Identify `4x² + 9y² = 36` and find its vertices, foci and area.', 'Identifica `4x² + 9y² = 36` y halla sus vértices, focos y área.'),
      steps: [
        L('Same-sign squares → ellipse. Divide by 36 to get standard form: `x²/9 + y²/4 = 1`.', 'Cuadrados con el mismo signo → elipse. Divide entre 36 para la forma estándar: `x²/9 + y²/4 = 1`.'),
        L('`a² = 9` (larger, under x²) → `a = 3`, horizontal major axis; `b = 2`. Vertices `(±3, 0)`.',
          '`a² = 9` (mayor, bajo x²) → `a = 3`, eje mayor horizontal; `b = 2`. Vértices `(±3, 0)`.'),
        L('`c² = a² − b² = 9 − 4 = 5` → `c = √5 ≈ 2.24`. Foci `(±√5, 0)`.', '`c² = a² − b² = 9 − 4 = 5` → `c = √5 ≈ 2.24`. Focos `(±√5, 0)`.'),
        L('Area of an ellipse: `πab = π·3·2 = 6π ≈ 18.85`.', 'Área de una elipse: `πab = π·3·2 = 6π ≈ 18.85`.'),
      ],
      answer: L('ellipse; vertices `(±3, 0)`, foci `(±√5, 0)`, area `6π`', 'elipse; vértices `(±3, 0)`, focos `(±√5, 0)`, área `6π`'),
    },
    real: [
      L('Planets and comets orbit the Sun on ellipses with the Sun at one focus (Kepler). Car headlights, flashlights and satellite dishes are parabolas. Doctors break kidney stones with sound waves focused by an ellipsoid, and the old LORAN navigation system located ships on hyperbolas.',
        'Los planetas y cometas orbitan el Sol en elipses con el Sol en un foco (Kepler). Los faros de los carros, las linternas y las antenas satelitales son parábolas. Los médicos rompen piedras en los riñones con ondas de sonido enfocadas por un elipsoide, y el antiguo sistema de navegación LORAN ubicaba barcos sobre hipérbolas.'),
    ],
  },
  exercises: [
    { q: L('What is the radius of x² + y² = 49?', '¿Cuál es el radio de x² + y² = 49?'), answer: 7,
      hint: L('r² = 49', 'r² = 49') },
    { q: L('For the ellipse x²/25 + y²/9 = 1, find c (center-to-focus distance).', 'Para la elipse x²/25 + y²/9 = 1, halla c (distancia del centro al foco).'), answer: 4,
      hint: L('c² = 25 − 9', 'c² = 25 − 9') },
    { q: L('For the hyperbola x²/9 − y²/16 = 1, find c.', 'Para la hipérbola x²/9 − y²/16 = 1, halla c.'), answer: 5,
      hint: L('c² = 9 + 16', 'c² = 9 + 16') },
  ],
},

// ─── 14 · Sequences & Series ────────────────────────────────────────────────
{
  id: 'series', color: '#CBD8E8',
  tag:  L('Patterns · Sums · Infinity', 'Patrones · Sumas · Infinito'),
  name: L('Sequences & Series', 'Sucesiones y Series'),
  graph() {
    const g = Graph({ x: [-0.3, 9.3], y: [-0.12, 1.25] });
    g.grid(1).axes();
    let S = 0;
    for (let n = 1; n <= 8; n++) {
      S += 0.5 ** n;
      g.rect(n - 0.38, 0, 0.76, S, { color: n % 2 ? 1 : 2, delay: 0.25 + n * 0.12 });
    }
    g.hline(1, { color: 3, delay: 0.2 });
    g.text(0.2, 1.12, 'S = ½ + ¼ + ⅛ + … = 1', { color: 3 });
    g.text(1, 0.5, 'S₁', { anchor: 'middle', dy: 16, muted: true, size: 10 });
    g.text(8, 1, 'S₈', { anchor: 'middle', dy: 16, muted: true, size: 10 });
    return g.svg();
  },
  formulas: [
    { label: L('Arithmetic', 'Aritmética'), expr: 'aₙ = a₁ + (n − 1)d    Sₙ = n(a₁ + aₙ)/2',
      desc: L('Add the same difference d each time. The sum is the number of terms times the average term.',
              'Se suma la misma diferencia d cada vez. La suma es el número de términos por el término promedio.') },
    { label: L('Geometric', 'Geométrica'), expr: 'aₙ = a₁rⁿ⁻¹    Sₙ = a₁(1 − rⁿ)/(1 − r)',
      desc: L('Multiply by the same ratio r each time — the discrete version of exponential growth.',
              'Se multiplica por la misma razón r cada vez — la versión discreta del crecimiento exponencial.') },
    { label: L('Infinite Geometric Series', 'Serie Geométrica Infinita'), expr: 'S = a₁ / (1 − r),   |r| < 1',
      desc: L('Infinitely many terms can add up to a finite number. If |r| ≥ 1 the series diverges.',
              'Infinitos términos pueden sumar un número finito. Si |r| ≥ 1 la serie diverge.') },
    { label: L('Sigma Notation', 'Notación Sigma'), expr: 'Σₖ₌₁ⁿ k = n(n + 1)/2',
      desc: L('Σ means “add up”. The index k runs from the bottom value to the top value.',
              'Σ significa “suma”. El índice k va desde el valor de abajo hasta el de arriba.') },
  ],
  deep: {
    idea: [
      L('A <b>sequence</b> is a list that follows a rule (2, 5, 8, 11, …). A <b>series</b> is what you get when you add the list up. The surprising part: an <i>infinite</i> series can have a finite sum. Walk halfway to a wall, then half the remaining distance, then half again… you take infinitely many steps, but the total distance is exactly 1 wall-length.',
        'Una <b>sucesión</b> es una lista que sigue una regla (2, 5, 8, 11, …). Una <b>serie</b> es lo que obtienes al sumar la lista. Lo sorprendente: una serie <i>infinita</i> puede tener una suma finita. Camina la mitad de la distancia a una pared, luego la mitad de lo que falta, y otra vez la mitad… das infinitos pasos, pero la distancia total es exactamente 1 pared.'),
      L('The bars on the left are the partial sums `S₁, S₂, …, S₈` of `½ + ¼ + ⅛ + …`. They climb toward 1 but never pass it. That idea — a value being approached forever — is the <b>limit</b>, the first idea of Calculus.',
        'Las barras de la izquierda son las sumas parciales `S₁, S₂, …, S₈` de `½ + ¼ + ⅛ + …`. Suben hacia 1 pero nunca lo pasan. Esa idea — un valor al que uno se acerca para siempre — es el <b>límite</b>, la primera idea del Cálculo.'),
    ],
    why: [
      L('<b>Gauss’s trick (arithmetic):</b> write `1 + 2 + … + 100` forwards and backwards and add the two rows: every column sums to 101, and there are 100 columns, so twice the sum is 10,100. The sum is 5,050.',
        '<b>El truco de Gauss (aritmética):</b> escribe `1 + 2 + … + 100` al derecho y al revés y suma las dos filas: cada columna suma 101, y hay 100 columnas, así que el doble de la suma es 10,100. La suma es 5,050.'),
      L('<b>Geometric sum:</b> let `S = a + ar + … + arⁿ⁻¹`. Then `rS = ar + … + arⁿ`. Subtract: almost everything cancels, leaving `S − rS = a − arⁿ`, so `S = a(1 − rⁿ)/(1 − r)`. If `|r| < 1`, `rⁿ → 0` as n grows, giving `a/(1 − r)`.',
        '<b>Suma geométrica:</b> sea `S = a + ar + … + arⁿ⁻¹`. Entonces `rS = ar + … + arⁿ`. Resta: casi todo se cancela y queda `S − rS = a − arⁿ`, así que `S = a(1 − rⁿ)/(1 − r)`. Si `|r| < 1`, `rⁿ → 0` cuando n crece, y da `a/(1 − r)`.'),
    ],
    mistakes: [
      L('Using `a/(1 − r)` when `|r| ≥ 1`. `1 + 2 + 4 + …` does not equal `1/(1 − 2) = −1`; it diverges.',
        'Usar `a/(1 − r)` cuando `|r| ≥ 1`. `1 + 2 + 4 + …` no es `1/(1 − 2) = −1`; diverge.'),
      L('Using `rⁿ` instead of `rⁿ⁻¹` for the nth term (the first term has r⁰).', 'Usar `rⁿ` en lugar de `rⁿ⁻¹` para el n-ésimo término (el primer término tiene r⁰).'),
      L('Miscounting terms: from k = 5 to k = 20 there are 16 terms, not 15.', 'Contar mal los términos: de k = 5 a k = 20 hay 16 términos, no 15.'),
    ],
    example: {
      prompt: L('Find the sum of the first 10 terms of `3, 6, 12, …` and the sum of the infinite series `8 + 4 + 2 + …`.',
                'Halla la suma de los primeros 10 términos de `3, 6, 12, …` y la suma de la serie infinita `8 + 4 + 2 + …`.'),
      steps: [
        L('First sequence: `a₁ = 3`, `r = 2` (geometric).', 'Primera sucesión: `a₁ = 3`, `r = 2` (geométrica).'),
        L('`S₁₀ = 3(1 − 2¹⁰)/(1 − 2) = 3(1 − 1024)/(−1) = 3 · 1023 = 3069`.', '`S₁₀ = 3(1 − 2¹⁰)/(1 − 2) = 3(1 − 1024)/(−1) = 3 · 1023 = 3069`.'),
        L('Second series: `a₁ = 8`, `r = ½`. Since `|r| < 1`, it converges.', 'Segunda serie: `a₁ = 8`, `r = ½`. Como `|r| < 1`, converge.'),
        L('`S = 8 / (1 − ½) = 8 / ½ = 16`.', '`S = 8 / (1 − ½) = 8 / ½ = 16`.'),
      ],
      answer: L('`S₁₀ = 3069`; infinite sum `= 16`', '`S₁₀ = 3069`; suma infinita `= 16`'),
    },
    real: [
      L('Loan and mortgage payments, retirement annuities and the total distance a bouncing ball travels are geometric series. And in Calculus, the area under a curve is defined as a limit of sums (Riemann sums), while functions like `sin x` and `eˣ` are written as infinite series (Taylor series).',
        'Los pagos de préstamos e hipotecas, las anualidades de retiro y la distancia total que recorre una pelota que rebota son series geométricas. Y en Cálculo, el área bajo una curva se define como un límite de sumas (sumas de Riemann), mientras que funciones como `sen x` y `eˣ` se escriben como series infinitas (series de Taylor).'),
    ],
  },
  exercises: [
    { q: L('Find the 20th term of 5, 9, 13, …', 'Halla el término 20 de 5, 9, 13, …'), answer: 81,
      hint: L('a₂₀ = 5 + 19 · 4', 'a₂₀ = 5 + 19 · 4') },
    { q: L('Find 1 + 2 + 3 + … + 100.', 'Halla 1 + 2 + 3 + … + 100.'), answer: 5050,
      hint: L('n(n + 1)/2 with n = 100', 'n(n + 1)/2 con n = 100') },
    { q: L('Find the sum of 6 + 2 + 2/3 + …', 'Halla la suma de 6 + 2 + 2/3 + …'), answer: 9,
      hint: L('r = 1/3, so S = 6 / (1 − 1/3).', 'r = 1/3, así que S = 6 / (1 − 1/3).') },
  ],
},

];

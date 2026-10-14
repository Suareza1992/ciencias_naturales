// ═══════════════════════════════════════════════════════════════════════════
// Linear Algebra exercise GENERATORS — one easy / medium / hard generator per
// topic. Each returns { prompt, lhs, answer, steps } (see shared/matrix-practice.js).
//
// Rules every generator follows:
//   • numbers are chosen so the answer is clean (integers or simple fractions;
//     decimals only where √2, √3 are unavoidable, and then tol = 0.01)
//   • steps are computed from the same numbers, so they are always correct
//   • return null to reject a draw (e.g. det = 0); the engine redraws
// ═══════════════════════════════════════════════════════════════════════════

const LA_GENERATORS = (() => {
  const L = (en, es) => ({ en, es });
  const { Fr, fr, val, num: N, p: P, sub, col, T, matmul, det2, det3, minor, ident, dot, cross, clean } = MX;
  const XYZ = ['x', 'y', 'z'], WXYZ = ['w', 'x', 'y', 'z'];
  const code = s => '`' + s + '`';
  const absF = f => new Fr(Math.abs(f.n), f.d);
  const frDot = (u, v) => u.reduce((s, x, i) => s.add(fr(x).mul(v[i])), new Fr(0));
  const cellName = (i, j) => `c${sub(i + 1, j + 1)}`;

  // Row i of A · column j of B, written out: 1·5 + 2·7 = 19
  function cellSteps(A, B, nameA = 'A', nameB = 'B') {
    const C = matmul(A, B), out = [];
    C.forEach((row, i) => row.forEach((c, j) => {
      const terms = A[i].map((a, k) => `${P(a)}·${P(B[k][j])}`).join(' + ');
      out.push(code(`${cellName(i, j)} = ${terms} = ${N(c)}`));
    }));
    return out;
  }
  const rowColIntro = L('Each entry cᵢⱼ is row i of the left matrix · column j of the right matrix (multiply pairs, then add).',
                        'Cada entrada cᵢⱼ es la fila i de la matriz izquierda · la columna j de la derecha (multiplica pares y suma).');

  // det of a 3×3 written as a cofactor expansion along row 1
  function det3Line(m) {
    const [a, b, c] = m[0];
    const m1 = det2(minor(m, 0, 0)), m2 = det2(minor(m, 0, 1)), m3 = det2(minor(m, 0, 2));
    return `${P(a)}·${P(m1)} − ${P(b)}·${P(m2)} + ${P(c)}·${P(m3)} = ${N(det3(m))}`;
  }
  function minorLine(m, i, j, name) {
    const mm = minor(m, i, j);
    return code(`${name} = ${P(mm[0][0])}·${P(mm[1][1])} − ${P(mm[0][1])}·${P(mm[1][0])} = ${N(det2(mm))}`);
  }

  // Gauss–Jordan with exact fractions; one step per pivot column
  function gaussJordan(A, b) {
    const n = A.length;
    let M = A.map((r, i) => [...r.map(fr), fr(b[i])]);
    const R = i => `R${sub(i + 1)}`;
    const steps = [{ t: L('Write the augmented matrix [A | b].', 'Escribe la matriz aumentada [A | b].'), m: M.map(r => r.slice()), aug: true }];
    for (let c = 0; c < n; c++) {
      const ops = [];
      if (M[c][c].isZero()) {
        const k = M.findIndex((row, r) => r > c && !row[c].isZero());
        [M[c], M[k]] = [M[k], M[c]];
        ops.push(`${R(c)} ↔ ${R(k)}`);
      }
      const pv = M[c][c];
      if (!(pv.n === 1 && pv.d === 1)) { M[c] = M[c].map(x => x.div(pv)); ops.push(`${R(c)} → ${R(c)} ÷ ${P(pv)}`); }
      for (let r = 0; r < n; r++) {
        if (r === c || M[r][c].isZero()) continue;
        const f = M[r][c];
        M[r] = M[r].map((x, j) => x.sub(f.mul(M[c][j])));
        ops.push(f.val() > 0 ? `${R(r)} → ${R(r)} − ${N(f)}·${R(c)}` : `${R(r)} → ${R(r)} + ${N(absF(f))}·${R(c)}`);
      }
      if (ops.length) steps.push({
        t: L(`Column ${c + 1} (make the pivot 1, clear the rest): ${ops.map(code).join(', ')}`,
             `Columna ${c + 1} (haz el pivote 1 y limpia el resto): ${ops.map(code).join(', ')}`),
        m: M.map(r => r.slice()), aug: true,
      });
    }
    const x = M.map(r => r[n]);
    const names = XYZ.slice(0, n);
    steps.push(L(`The left side is now the identity, so the last column is the solution: ${code(names.map((v, i) => `${v} = ${N(x[i])}`).join(', '))}.`,
                 `El lado izquierdo ya es la identidad, así que la última columna es la solución: ${code(names.map((v, i) => `${v} = ${N(x[i])}`).join(', '))}.`));
    return { steps, x };
  }

  // Random invertible integer matrix whose inverse is also integer (det = ±1)
  function unimodular(r, n, ops = 4, limit = 6) {
    for (let tries = 0; tries < 100; tries++) {
      let M = ident(n);
      for (let k = 0; k < ops; k++) {
        const i = r.int(0, n - 1); let j; do j = r.int(0, n - 1); while (j === i);
        const f = r.nz(-2, 2);
        M[i] = M[i].map((x, c) => x + f * M[j][c]);
      }
      if (r.next() < 0.4) { const i = r.int(0, n - 2); [M[i], M[i + 1]] = [M[i + 1], M[i]]; }
      if (M.flat().every(x => Math.abs(x) <= limit) && M.flat().some(x => x !== 0 && x !== 1)) return M;
    }
    return null;
  }

  // Rotation matrices (right-handed; counterclockwise when the axis points at you)
  const rad = d => d * Math.PI / 180;
  function rot3(axis, deg) {
    const c = clean(Math.cos(rad(deg))), s = clean(Math.sin(rad(deg)));
    if (axis === 'x') return [[1, 0, 0], [0, c, -s], [0, s, c]];
    if (axis === 'y') return [[c, 0, s], [0, 1, 0], [-s, 0, c]];
    return [[c, -s, 0], [s, c, 0], [0, 0, 1]];
  }
  const rotFormula = {
    x: '[[1, 0, 0], [0, cos θ, −sin θ], [0, sin θ, cos θ]]',
    y: '[[cos θ, 0, sin θ], [0, 1, 0], [−sin θ, 0, cos θ]]',
    z: '[[cos θ, −sin θ, 0], [sin θ, cos θ, 0], [0, 0, 1]]',
  };
  const r2 = x => Math.round(x * 100) / 100;

  // 2D transforms with bilingual descriptions
  function t2d(r, kinds = ['rot', 'refl', 'scale', 'shear']) {
    const kind = r.pick(kinds);
    if (kind === 'rot') return r.pick([
      { m: [[0, -1], [1, 0]],  d: L('rotate 90° counterclockwise', 'rotar 90° en sentido antihorario') },
      { m: [[-1, 0], [0, -1]], d: L('rotate 180°', 'rotar 180°') },
      { m: [[0, 1], [-1, 0]],  d: L('rotate 90° clockwise', 'rotar 90° en sentido horario') },
    ]);
    if (kind === 'refl') return r.pick([
      { m: [[1, 0], [0, -1]],  d: L('reflect across the x-axis', 'reflejar sobre el eje x') },
      { m: [[-1, 0], [0, 1]],  d: L('reflect across the y-axis', 'reflejar sobre el eje y') },
      { m: [[0, 1], [1, 0]],   d: L('reflect across the line y = x', 'reflejar sobre la recta y = x') },
      { m: [[0, -1], [-1, 0]], d: L('reflect across the line y = −x', 'reflejar sobre la recta y = −x') },
    ]);
    if (kind === 'scale') {
      const sx = r.pick([2, 3, -2, 1]), sy = r.pick([2, 3, -1, 4]);
      return { m: [[sx, 0], [0, sy]], d: L(`scale x by ${N(sx)} and y by ${N(sy)}`, `escalar x por ${N(sx)} y y por ${N(sy)}`) };
    }
    const k = r.nz(-3, 3);
    return r.next() < 0.5
      ? { m: [[1, k], [0, 1]], d: L(`shear horizontally by ${N(k)} (x → x + ${P(k)}y)`, `cizallar horizontalmente por ${N(k)} (x → x + ${P(k)}y)`) }
      : { m: [[1, 0], [k, 1]], d: L(`shear vertically by ${N(k)} (y → y + ${P(k)}x)`, `cizallar verticalmente por ${N(k)} (y → y + ${P(k)}x)`) };
  }

  // Signed permutation matrix (orthonormal; optionally right-handed only)
  function signedPerm(r, rightHanded = false) {
    for (;;) {
      const perm = r.shuffle([0, 1, 2]);
      const M = [0, 1, 2].map(i => [0, 1, 2].map(j => (j === perm[i] ? r.sign() : 0)));
      if (!rightHanded || det3(M) === 1) return M;
    }
  }

  // 2×2 matrix with chosen integer eigenvalues λ1 > λ2 (and b ≠ 0)
  function eigenMatrix(r) {
    const l1 = r.int(-2, 6); let l2; do l2 = r.int(-4, 5); while (l2 >= l1);
    const a = r.int(-3, 5), d = l1 + l2 - a;
    const prod = a * d - l1 * l2;          // must equal b·c
    let b, c;
    if (prod === 0) { b = r.nz(-3, 3); c = 0; }
    else {
      const divs = []; for (let k = 1; k <= Math.abs(prod); k++) if (prod % k === 0) divs.push(k, -k);
      b = r.pick(divs.filter(x => Math.abs(x) <= 6)) ?? prod; c = prod / b;
    }
    if (Math.abs(c) > 9) return null;
    return { A: [[a, b], [c, d]], l1, l2, a, b, c, d };
  }

  const G = {};

  // ─── 01 · Vectors in 3D ───────────────────────────────────────────────────
  G.vectors = {
    easy(r) {
      const u = r.vec(3, -5, 5), v = r.vec(3, -5, 5), w = u.map((x, i) => x + v[i]);
      return {
        prompt: L('A VR controller moves by u and then by v. Find the total displacement u + v.',
                  'Un control de VR se mueve u y luego v. Halla el desplazamiento total u + v.'),
        lhs: [{ label: 'u', m: col(u) }, '+', { label: 'v', m: col(v) }],
        answer: { label: 'u + v', m: col(w) },
        steps: [L('Add component by component: x with x, y with y, z with z.', 'Suma componente a componente: x con x, y con y, z con z.'),
          ...XYZ.map((c, i) => code(`${c}: ${N(u[i])} + ${P(v[i])} = ${N(w[i])}`))],
      };
    },
    medium(r) {
      const a = r.pick([2, 3, 4]), b = r.pick([2, 3]);
      const u = r.vec(3, -4, 4), v = r.vec(3, -4, 4), w = u.map((x, i) => a * x - b * v[i]);
      return {
        prompt: L(`Compute the linear combination ${a}u − ${b}v.`, `Calcula la combinación lineal ${a}u − ${b}v.`),
        lhs: [String(a), { label: 'u', m: col(u) }, '−', String(b), { label: 'v', m: col(v) }],
        answer: { label: `${a}u − ${b}v`, m: col(w) },
        steps: [L(`Scale first: ${a}u = ${code(MX.vec(u.map(x => a * x)))} and ${b}v = ${code(MX.vec(v.map(x => b * x)))}.`,
                  `Escala primero: ${a}u = ${code(MX.vec(u.map(x => a * x)))} y ${b}v = ${code(MX.vec(v.map(x => b * x)))}.`),
          L('Then subtract component by component:', 'Luego resta componente a componente:'),
          ...XYZ.map((c, i) => code(`${c}: ${N(a * u[i])} − ${P(b * v[i])} = ${N(w[i])}`))],
      };
    },
    hard(r) {
      const base = r.pick([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 10, 11, 15]]);
      const n = base[3], v = r.shuffle(base.slice(0, 3)).map(x => x * r.sign());
      const u = v.map(x => new Fr(x, n));
      return {
        prompt: L('Light and camera directions must be unit vectors. Normalize v (fractions like 2/3 are fine).',
                  'Las direcciones de luces y cámaras deben ser vectores unitarios. Normaliza v (se aceptan fracciones como 2/3).'),
        lhs: [{ label: 'v', m: col(v) }],
        answer: { label: 'v / |v|', m: col(u) },
        steps: [
          L(`Length: ${code(`|v| = √(${v.map(x => P(x) + '²').join(' + ')}) = √${n * n} = ${n}`)}.`,
            `Longitud: ${code(`|v| = √(${v.map(x => P(x) + '²').join(' + ')}) = √${n * n} = ${n}`)}.`),
          L(`Divide every component by ${n}:`, `Divide cada componente entre ${n}:`),
          ...XYZ.map((c, i) => code(`${c}: ${N(v[i])} / ${n} = ${N(u[i])}`)),
          L(`Check: the squares add to 1 → ${code(u.map(x => `(${N(x)})²`).join(' + ') + ' = 1')} ✓`,
            `Comprueba: los cuadrados suman 1 → ${code(u.map(x => `(${N(x)})²`).join(' + ') + ' = 1')} ✓`),
        ],
      };
    },
  };

  // ─── 02 · Dot Product ─────────────────────────────────────────────────────
  G.dot = {
    easy(r) {
      const u = r.vec(2, -6, 6), v = r.vec(2, -6, 6), d = dot(u, v);
      return {
        prompt: L('Compute the dot product u · v.', 'Calcula el producto punto u · v.'),
        lhs: [{ label: 'u', m: col(u) }, '·', { label: 'v', m: col(v) }],
        answer: { label: 'u · v', m: [[d]] },
        steps: [L('Multiply matching components and add them.', 'Multiplica las componentes correspondientes y súmalas.'),
          code(`u·v = ${u.map((x, i) => `${P(x)}·${P(v[i])}`).join(' + ')} = ${u.map((x, i) => P(x * v[i])).join(' + ')} = ${N(d)}`),
          L(d > 0 ? 'Positive → the angle between them is less than 90°.' : d < 0 ? 'Negative → the angle is more than 90°.' : 'Zero → the vectors are perpendicular.',
            d > 0 ? 'Positivo → el ángulo entre ellos es menor de 90°.' : d < 0 ? 'Negativo → el ángulo es mayor de 90°.' : 'Cero → los vectores son perpendiculares.')],
      };
    },
    medium(r) {
      const n = r.vec(3, -4, 4), l = r.vec(3, -4, 4), d = dot(n, l);
      if (n.every(x => x === 0) || l.every(x => x === 0)) return null;
      return {
        prompt: L('A shader lights a surface with brightness ∝ n · l (surface normal · direction to the light). Compute n · l.',
                  'Un shader ilumina una superficie con brillo ∝ n · l (normal de la superficie · dirección a la luz). Calcula n · l.'),
        lhs: [{ label: 'n', m: col(n) }, '·', { label: 'l', m: col(l) }],
        answer: { label: 'n · l', m: [[d]] },
        steps: [code(`n·l = ${n.map((x, i) => `${P(x)}·${P(l[i])}`).join(' + ')}`),
          code(`= ${n.map((x, i) => P(x * l[i])).join(' + ')} = ${N(d)}`),
          L(d > 0 ? 'Positive → the surface faces the light and gets lit.' : 'Zero or negative → the surface faces away; shaders clamp it with max(0, n·l), so it is dark.',
            d > 0 ? 'Positivo → la superficie mira hacia la luz y se ilumina.' : 'Cero o negativo → la superficie mira en otra dirección; los shaders lo limitan con max(0, n·l), así que queda oscura.')],
      };
    },
    hard(r) {
      const u = r.vec(3, -4, 4), v = r.vec(3, -3, 3);
      const uv = dot(u, v), vv = dot(v, v);
      if (vv === 0 || uv === 0) return null;
      const s = new Fr(uv, vv), pr = v.map(x => s.mul(x));
      return {
        prompt: L('Project u onto v: proj_v(u) = (u·v / v·v) v. (Used to slide a movement along a wall.)',
                  'Proyecta u sobre v: proj_v(u) = (u·v / v·v) v. (Se usa para deslizar un movimiento a lo largo de una pared.)'),
        lhs: [{ label: 'u', m: col(u) }, { label: 'v', m: col(v) }],
        answer: { label: 'proj_v(u)', m: col(pr) },
        steps: [
          code(`u·v = ${u.map((x, i) => `${P(x)}·${P(v[i])}`).join(' + ')} = ${N(uv)}`),
          code(`v·v = ${v.map(x => `${P(x)}²`).join(' + ')} = ${vv}`),
          L(`Scale factor: ${code(`${N(uv)} / ${vv} = ${N(s)}`)}.`, `Factor de escala: ${code(`${N(uv)} / ${vv} = ${N(s)}`)}.`),
          L('Multiply v by that factor:', 'Multiplica v por ese factor:'),
          ...XYZ.map((c, i) => code(`${c}: ${N(s)} · ${P(v[i])} = ${N(pr[i])}`)),
        ],
      };
    },
  };

  // ─── 03 · Cross Product ───────────────────────────────────────────────────
  function crossSteps(u, v, a = 'u', b = 'v') {
    const w = cross(u, v);
    return [
      L('Use the pattern “yz − zy, zx − xz, xy − yx”:', 'Usa el patrón “yz − zy, zx − xz, xy − yx”:'),
      code(`x = ${a}y·${b}z − ${a}z·${b}y = ${P(u[1])}·${P(v[2])} − ${P(u[2])}·${P(v[1])} = ${N(w[0])}`),
      code(`y = ${a}z·${b}x − ${a}x·${b}z = ${P(u[2])}·${P(v[0])} − ${P(u[0])}·${P(v[2])} = ${N(w[1])}`),
      code(`z = ${a}x·${b}y − ${a}y·${b}x = ${P(u[0])}·${P(v[1])} − ${P(u[1])}·${P(v[0])} = ${N(w[2])}`),
      L(`Check: the result is perpendicular to both → ${code(`${a}·(${a}×${b}) = ${dot(u, w)}`)}, ${code(`${b}·(${a}×${b}) = ${dot(v, w)}`)} ✓`,
        `Comprueba: el resultado es perpendicular a ambos → ${code(`${a}·(${a}×${b}) = ${dot(u, w)}`)}, ${code(`${b}·(${a}×${b}) = ${dot(v, w)}`)} ✓`),
    ];
  }
  G.cross = {
    easy(r) {
      const u = r.vec(3, -3, 3), v = r.vec(3, -3, 3), w = cross(u, v);
      if (w.every(x => x === 0)) return null;
      return {
        prompt: L('Compute the cross product u × v.', 'Calcula el producto cruz u × v.'),
        lhs: [{ label: 'u', m: col(u) }, '×', { label: 'v', m: col(v) }],
        answer: { label: 'u × v', m: col(w) }, steps: crossSteps(u, v),
      };
    },
    medium(r) {
      const u = r.vec(3, -5, 5), v = r.vec(3, -5, 5), w = cross(u, v);
      if (w.every(x => x === 0)) return null;
      return {
        prompt: L('Compute u × v. (Order matters: v × u would point the opposite way.)', 'Calcula u × v. (El orden importa: v × u apuntaría al revés.)'),
        lhs: [{ label: 'u', m: col(u) }, '×', { label: 'v', m: col(v) }],
        answer: { label: 'u × v', m: col(w) }, steps: crossSteps(u, v),
      };
    },
    hard(r) {
      const A = r.vec(3, -4, 4), B = r.vec(3, -4, 4), C = r.vec(3, -4, 4);
      const e1 = B.map((x, i) => x - A[i]), e2 = C.map((x, i) => x - A[i]), n = cross(e1, e2);
      if (n.every(x => x === 0)) return null;
      return {
        prompt: L('A mesh triangle has vertices A, B, C. Find its (unnormalized) face normal n = (B − A) × (C − A).',
                  'Un triángulo de una malla tiene vértices A, B, C. Halla su normal (sin normalizar) n = (B − A) × (C − A).'),
        lhs: [{ label: 'A', m: col(A) }, { label: 'B', m: col(B) }, { label: 'C', m: col(C) }],
        answer: { label: 'n', m: col(n) },
        steps: [
          L(`Edge 1: ${code(`e₁ = B − A = ${MX.vec(e1)}`)}`, `Arista 1: ${code(`e₁ = B − A = ${MX.vec(e1)}`)}`),
          L(`Edge 2: ${code(`e₂ = C − A = ${MX.vec(e2)}`)}`, `Arista 2: ${code(`e₂ = C − A = ${MX.vec(e2)}`)}`),
          ...crossSteps(e1, e2, 'e₁', 'e₂'),
          L('Counterclockwise vertex order (seen from the front) makes the normal point toward the viewer — that is how engines decide which side is the front face.',
            'El orden antihorario de los vértices (visto de frente) hace que la normal apunte hacia el observador — así deciden los motores cuál es la cara frontal.'),
        ],
      };
    },
  };

  // ─── 04 · Matrices & Operations ───────────────────────────────────────────
  G.matrices = {
    easy(r) {
      const A = r.mat(2, 2, -9, 9), B = r.mat(2, 2, -9, 9), C = A.map((row, i) => row.map((x, j) => x + B[i][j]));
      return {
        prompt: L('Add the matrices A + B.', 'Suma las matrices A + B.'),
        lhs: [{ label: 'A', m: A }, '+', { label: 'B', m: B }],
        answer: { label: 'A + B', m: C },
        steps: [L('Same size → add the entries in the same position.', 'Mismo tamaño → suma las entradas en la misma posición.'),
          ...C.flatMap((row, i) => row.map((c, j) => code(`${cellName(i, j)} = ${N(A[i][j])} + ${P(B[i][j])} = ${N(c)}`)))],
      };
    },
    medium(r) {
      const k = r.pick([2, 3, -2]), A = r.mat(2, 3, -5, 5), B = r.mat(2, 3, -6, 6);
      const C = A.map((row, i) => row.map((x, j) => k * x - B[i][j]));
      return {
        prompt: L(`Compute ${N(k)}A − B.`, `Calcula ${N(k)}A − B.`),
        lhs: [String(N(k)), { label: 'A', m: A }, '−', { label: 'B', m: B }],
        answer: { label: `${N(k)}A − B`, m: C },
        steps: [{ t: L(`Scalar multiple first: multiply every entry of A by ${N(k)}.`, `Primero el múltiplo escalar: multiplica cada entrada de A por ${N(k)}.`), m: A.map(row => row.map(x => k * x)) },
          L('Then subtract B entry by entry:', 'Luego resta B entrada por entrada:'),
          ...C.flatMap((row, i) => row.map((c, j) => code(`${cellName(i, j)} = ${N(k * A[i][j])} − ${P(B[i][j])} = ${N(c)}`)))],
      };
    },
    hard(r) {
      const A = r.mat(2, 3, -6, 6), B = r.mat(3, 2, -5, 5), At = T(A);
      const C = At.map((row, i) => row.map((x, j) => x + 2 * B[i][j]));
      return {
        prompt: L('Compute Aᵀ + 2B. (Aᵀ swaps rows and columns, so a 2×3 becomes a 3×2.)',
                  'Calcula Aᵀ + 2B. (Aᵀ intercambia filas y columnas, así que una 2×3 se vuelve 3×2.)'),
        lhs: [{ label: 'A', m: A }, { label: 'B', m: B }],
        answer: { label: 'Aᵀ + 2B', m: C },
        steps: [{ t: L('Transpose: row 1 of A becomes column 1 of Aᵀ, row 2 becomes column 2.', 'Transpón: la fila 1 de A se vuelve la columna 1 de Aᵀ, la fila 2 la columna 2.'), m: At },
          { t: L('Double B:', 'Duplica B:'), m: B.map(row => row.map(x => 2 * x)) },
          L('Add entry by entry:', 'Suma entrada por entrada:'),
          ...C.flatMap((row, i) => row.map((c, j) => code(`${cellName(i, j)} = ${N(At[i][j])} + ${P(2 * B[i][j])} = ${N(c)}`)))],
      };
    },
  };

  // ─── 05 · Matrix Multiplication ───────────────────────────────────────────
  G.matmul = {
    easy(r) {
      const A = r.mat(2, 2, -4, 4), B = r.mat(2, 2, -4, 4);
      return {
        prompt: L('Multiply A · B.', 'Multiplica A · B.'),
        lhs: [{ label: 'A', m: A }, '·', { label: 'B', m: B }],
        answer: { label: 'AB', m: matmul(A, B) },
        steps: [rowColIntro, ...cellSteps(A, B)],
      };
    },
    medium(r) {
      const M = r.mat(3, 3, -3, 3), v = r.vec(3, -4, 4);
      return {
        prompt: L('Transform the vertex v by the matrix M (compute M v).', 'Transforma el vértice v con la matriz M (calcula M v).'),
        lhs: [{ label: 'M', m: M }, '·', { label: 'v', m: col(v) }],
        answer: { label: 'Mv', m: matmul(M, col(v)) },
        steps: [L('Each output coordinate is one row of M dotted with v.', 'Cada coordenada de salida es una fila de M multiplicada (punto) por v.'), ...cellSteps(M, col(v))],
      };
    },
    hard(r) {
      if (r.next() < 0.5) {
        const A = r.mat(3, 3, -3, 3), B = r.mat(3, 3, -3, 3);
        return {
          prompt: L('Multiply the 3×3 matrices A · B.', 'Multiplica las matrices 3×3 A · B.'),
          lhs: [{ label: 'A', m: A }, '·', { label: 'B', m: B }],
          answer: { label: 'AB', m: matmul(A, B) }, steps: [rowColIntro, ...cellSteps(A, B)],
        };
      }
      const A = r.mat(2, 3, -4, 4), B = r.mat(3, 2, -4, 4);
      return {
        prompt: L('Multiply A (2×3) · B (3×2). The inner sizes match (3 = 3); the result is 2×2.',
                  'Multiplica A (2×3) · B (3×2). Los tamaños internos coinciden (3 = 3); el resultado es 2×2.'),
        lhs: [{ label: 'A', m: A }, '·', { label: 'B', m: B }],
        answer: { label: 'AB', m: matmul(A, B) }, steps: [rowColIntro, ...cellSteps(A, B)],
      };
    },
  };

  // ─── 06 · Systems & Gaussian Elimination ──────────────────────────────────
  function systemEx(r, n, range, solRange) {
    const A = r.mat(n, n, -range, range);
    const d = n === 2 ? det2(A) : det3(A);
    if (d === 0) return null;
    const x = r.vec(n, -solRange, solRange), b = matmul(A, col(x)).map(row => row[0]);
    const { steps } = gaussJordan(A, b);
    const names = XYZ.slice(0, n);
    const term = (a, v) => (a === 1 ? v : a === -1 ? `−${v}` : `${N(a)}${v}`);
    const eqs = A.map((row, i) => row.map((a, j) => (a === 0 ? null : term(a, names[j]))).filter(Boolean)
      .join(' + ').replace(/\+ −/g, '− ') + ` = ${N(b[i])}`);
    return {
      prompt: L(`Solve the system with Gauss–Jordan elimination: ${eqs.map(code).join(', ')}.`,
                `Resuelve el sistema con eliminación de Gauss–Jordan: ${eqs.map(code).join(', ')}.`),
      lhs: [{ label: '[A | b]', m: A.map((row, i) => [...row, b[i]]), aug: true }],
      answer: { label: `(${names.join(', ')})`, m: col(x) },
      steps,
    };
  }
  G.systems = {
    easy:   r => systemEx(r, 2, 4, 5),
    medium: r => systemEx(r, 3, 3, 4),
    hard:   r => systemEx(r, 3, 5, 6),
  };

  // ─── 07 · Determinants ────────────────────────────────────────────────────
  G.determinant = {
    easy(r) {
      const A = r.mat(2, 2, -7, 7), d = det2(A);
      return {
        prompt: L('Compute det A. (It is the factor by which A scales areas.)', 'Calcula det A. (Es el factor por el que A escala las áreas.)'),
        lhs: [{ label: 'A', m: A }], answer: { label: 'det A', m: [[d]] },
        steps: [code(`det A = ad − bc = ${P(A[0][0])}·${P(A[1][1])} − ${P(A[0][1])}·${P(A[1][0])} = ${N(d)}`),
          L(d === 0 ? 'det = 0 → A squashes the plane onto a line: no inverse.' : d < 0 ? 'Negative → A flips orientation (like a mirror).' : 'Positive → orientation is preserved.',
            d === 0 ? 'det = 0 → A aplasta el plano en una recta: no tiene inversa.' : d < 0 ? 'Negativo → A invierte la orientación (como un espejo).' : 'Positivo → se conserva la orientación.')],
      };
    },
    medium(r) {
      const A = r.mat(3, 3, -4, 4), d = det3(A);
      return {
        prompt: L('Compute det A by cofactor expansion along row 1.', 'Calcula det A por expansión de cofactores en la fila 1.'),
        lhs: [{ label: 'A', m: A }], answer: { label: 'det A', m: [[d]] },
        steps: [L('Signs alternate + − + along the row. Each Mᵢⱼ is the 2×2 determinant left after deleting row i and column j.',
                  'Los signos alternan + − + en la fila. Cada Mᵢⱼ es el determinante 2×2 que queda al borrar la fila i y la columna j.'),
          minorLine(A, 0, 0, 'M₁₁'), minorLine(A, 0, 1, 'M₁₂'), minorLine(A, 0, 2, 'M₁₃'),
          code(`det A = ${det3Line(A)}`)],
      };
    },
    hard(r) {
      const A = r.mat(4, 4, -3, 3);
      const zeros = r.shuffle([0, 1, 2, 3]).slice(0, 2);
      zeros.forEach(j => (A[0][j] = 0));
      if (A[0].every(x => x === 0)) return null;
      let total = 0; const steps = [L('Expand along row 1 — its two zeros kill two of the four terms. Signs alternate + − + −.',
                                      'Expande por la fila 1 — sus dos ceros eliminan dos de los cuatro términos. Los signos alternan + − + −.')];
      const terms = [];
      A[0].forEach((a, j) => {
        if (a === 0) return;
        const M = minor(A, 0, j), dm = det3(M), sign = j % 2 ? -1 : 1;
        total += sign * a * dm;
        steps.push({ t: L(`Entry a₁${sub(j + 1)} = ${N(a)} (sign ${sign > 0 ? '+' : '−'}). Delete row 1 and column ${j + 1}:`,
                          `Entrada a₁${sub(j + 1)} = ${N(a)} (signo ${sign > 0 ? '+' : '−'}). Borra la fila 1 y la columna ${j + 1}:`), m: M });
        steps.push(code(`det M₁${sub(j + 1)} = ${det3Line(M)}`));
        terms.push(`${sign > 0 ? '+' : '−'} ${P(a)}·${P(dm)}`);
      });
      steps.push(code(`det A = ${terms.join(' ').replace(/^\+ /, '')} = ${N(total)}`));
      return {
        prompt: L('Compute the determinant of this 4×4 matrix (expand along the row with zeros).', 'Calcula el determinante de esta matriz 4×4 (expande por la fila con ceros).'),
        lhs: [{ label: 'A', m: A }], answer: { label: 'det A', m: [[total]] }, steps,
      };
    },
  };

  // ─── 08 · Inverse Matrices ────────────────────────────────────────────────
  function inv2Ex(A, prompt) {
    const d = det2(A);
    const inv = [[new Fr(A[1][1], d), new Fr(-A[0][1], d)], [new Fr(-A[1][0], d), new Fr(A[0][0], d)]];
    return {
      prompt, lhs: [{ label: 'A', m: A }], answer: { label: 'A⁻¹', m: inv },
      steps: [code(`det A = ${P(A[0][0])}·${P(A[1][1])} − ${P(A[0][1])}·${P(A[1][0])} = ${N(d)}`),
        { t: L('Swap a and d, change the signs of b and c:', 'Intercambia a y d, cambia el signo de b y c:'), m: [[A[1][1], -A[0][1]], [-A[1][0], A[0][0]]] },
        L(`Divide every entry by det A = ${N(d)}:`, `Divide cada entrada entre det A = ${N(d)}:`),
        ...inv.flatMap((row, i) => row.map((x, j) => code(`${cellName(i, j)} = ${N([[A[1][1], -A[0][1]], [-A[1][0], A[0][0]]][i][j])} / ${P(d)} = ${N(x)}`))),
        L('Check: A · A⁻¹ = I.', 'Comprueba: A · A⁻¹ = I.')],
    };
  }
  G.inverse = {
    easy(r) {
      const k = r.nz(-3, 3), m = r.nz(-2, 2);
      let A = [[1 + k * m, k], [m, 1]];
      if (r.next() < 0.5) A = [A[1], A[0]];
      return inv2Ex(A, L('Find A⁻¹. (det A = ±1, so every entry is an integer.)', 'Halla A⁻¹. (det A = ±1, así que todas las entradas son enteras.)'));
    },
    medium(r) {
      const A = r.mat(2, 2, -6, 6), d = det2(A);
      if (Math.abs(d) < 2 || Math.abs(d) > 12) return null;
      return inv2Ex(A, L('Find A⁻¹. Fractions like −3/5 are fine.', 'Halla A⁻¹. Se aceptan fracciones como −3/5.'));
    },
    hard(r) {
      const A = unimodular(r, 3, 4, 5);
      if (!A) return null;
      const d = det3(A);
      const C = [0, 1, 2].map(i => [0, 1, 2].map(j => ((i + j) % 2 ? -1 : 1) * det2(minor(A, i, j))));
      const adj = T(C), inv = adj.map(row => row.map(x => x / d));
      if (inv.flat().some(x => Math.abs(x) > 12)) return null;
      return {
        prompt: L('Find A⁻¹ with the adjugate method: A⁻¹ = adj(A) / det A. (This is how an engine undoes a transform, e.g. world → local.)',
                  'Halla A⁻¹ con el método de la adjunta: A⁻¹ = adj(A) / det A. (Así un motor deshace una transformación, p. ej. mundo → local.)'),
        lhs: [{ label: 'A', m: A }], answer: { label: 'A⁻¹', m: inv },
        steps: [code(`det A = ${det3Line(A)}`),
          { t: L('Cofactor matrix: Cᵢⱼ = (−1)ⁱ⁺ʲ · (2×2 determinant left after deleting row i, column j).',
                 'Matriz de cofactores: Cᵢⱼ = (−1)ⁱ⁺ʲ · (determinante 2×2 que queda al borrar la fila i y la columna j).'), m: C },
          ...[0, 1, 2].flatMap(i => [0, 1, 2].map(j => minorLine(A, i, j, `${(i + j) % 2 ? '−' : '+'}M${sub(i + 1, j + 1)}`))),
          { t: L('Adjugate = transpose of the cofactor matrix:', 'Adjunta = transpuesta de la matriz de cofactores:'), m: adj },
          L(`Divide by det A = ${N(d)} (here that ${d === 1 ? 'changes nothing' : 'flips every sign'}).`,
            `Divide entre det A = ${N(d)} (aquí eso ${d === 1 ? 'no cambia nada' : 'cambia todos los signos'}).`)],
      };
    },
  };

  // ─── 09 · 2D Transformations ──────────────────────────────────────────────
  G.transform2d = {
    easy(r) {
      const t = t2d(r, ['scale', 'shear', 'refl']), p = r.vec(2, -5, 5), q = matmul(t.m, col(p));
      return {
        prompt: L(['Apply the transformation (', t.d.en, ') to the point p.'].join(''), ['Aplica la transformación (', t.d.es, ') al punto p.'].join('')),
        lhs: [{ label: 'M', m: t.m }, '·', { label: 'p', m: col(p) }],
        answer: { label: "p'", m: q },
        steps: [code(`x' = ${P(t.m[0][0])}·${P(p[0])} + ${P(t.m[0][1])}·${P(p[1])} = ${N(q[0][0])}`),
                code(`y' = ${P(t.m[1][0])}·${P(p[0])} + ${P(t.m[1][1])}·${P(p[1])} = ${N(q[1][0])}`)],
      };
    },
    medium(r) {
      const t = t2d(r);
      return {
        prompt: L(`Build the 2×2 matrix that does this: ${t.d.en}.`, `Construye la matriz 2×2 que hace esto: ${t.d.es}.`),
        answer: { label: 'M', m: t.m },
        steps: [L('Trick: the columns of M are where the basis vectors land. Column 1 = image of e₁ = (1, 0); column 2 = image of e₂ = (0, 1).',
                  'Truco: las columnas de M son a dónde van los vectores base. Columna 1 = imagen de e₁ = (1, 0); columna 2 = imagen de e₂ = (0, 1).'),
          code(`e₁ = (1, 0) → (${N(t.m[0][0])}, ${N(t.m[1][0])})`),
          code(`e₂ = (0, 1) → (${N(t.m[0][1])}, ${N(t.m[1][1])})`)],
      };
    },
    hard(r) {
      if (r.next() < 0.55) {
        const A = t2d(r), B = t2d(r);
        const M = matmul(B.m, A.m);
        return {
          prompt: L(`First ${A.d.en}, THEN ${B.d.en}. Find the single matrix M that does both.`,
                    `Primero ${A.d.es}, DESPUÉS ${B.d.es}. Halla la única matriz M que hace ambas.`),
          lhs: [{ label: 'B (2nd)', m: B.m }, '·', { label: 'A (1st)', m: A.m }],
          answer: { label: 'M = BA', m: M },
          steps: [L('Order: the transform applied FIRST goes on the RIGHT, because M p = B(A p).', 'Orden: la transformación que se aplica PRIMERO va a la DERECHA, porque M p = B(A p).'),
            rowColIntro, ...cellSteps(B.m, A.m, 'B', 'A')],
        };
      }
      const th = r.pick([30, 45, 60, 120, 135, 150]), k = r.pick([1, 2, 3]);
      const c = Math.cos(rad(th)), s = Math.sin(rad(th));
      const M = [[r2(k * c), r2(-k * s)], [r2(k * s), r2(k * c)]];
      return {
        prompt: L(`Build the matrix that rotates by ${N(th)}° counterclockwise${k > 1 ? ` and scales by ${k}` : ''}. Round to 2 decimals.`,
                  `Construye la matriz que rota ${N(th)}° en sentido antihorario${k > 1 ? ` y escala por ${k}` : ''}. Redondea a 2 decimales.`),
        answer: { label: 'M', m: M }, tol: 0.011,
        steps: [code('R(θ) = [[cos θ, −sin θ], [sin θ, cos θ]]'),
          code(`cos ${N(th)}° ≈ ${N(r2(c))}, sin ${N(th)}° ≈ ${N(r2(s))}`),
          ...(k > 1 ? [L(`Scaling by ${k} multiplies every entry by ${k}: ${code(`${k}·R(${N(th)}°)`)}.`, `Escalar por ${k} multiplica cada entrada por ${k}: ${code(`${k}·R(${N(th)}°)`)}.`)] : []),
          code(`M ≈ [[${N(M[0][0])}, ${N(M[0][1])}], [${N(M[1][0])}, ${N(M[1][1])}]]`)],
      };
    },
  };

  // ─── 10 · 3D Rotations ────────────────────────────────────────────────────
  G.rotation3d = {
    easy(r) {
      const axis = r.pick(XYZ), th = r.pick([90, 180, 270]), M = rot3(axis, th);
      return {
        prompt: L(`Fill in the rotation matrix R${axis}(${N(th)}°).`, `Completa la matriz de rotación R${axis}(${N(th)}°).`),
        answer: { label: `R${axis}(${N(th)}°)`, m: M },
        steps: [L(`General form: ${code(`R${axis}(θ) = ${rotFormula[axis]}`)}. The ${axis}-axis row and column stay (1 on the diagonal).`,
                  `Forma general: ${code(`R${axis}(θ) = ${rotFormula[axis]}`)}. La fila y columna del eje ${axis} se quedan (1 en la diagonal).`),
          code(`cos ${N(th)}° = ${N(clean(Math.cos(rad(th))))},  sin ${N(th)}° = ${N(clean(Math.sin(rad(th))))}`),
          L('Substitute those values.', 'Sustituye esos valores.')],
      };
    },
    medium(r) {
      const axis = r.pick(XYZ), th = r.pick([90, 180, -90]), M = rot3(axis, th), v = r.vec(3, -5, 5);
      if (v.every(x => x === 0)) return null;
      return {
        prompt: L(`Rotate the point v by ${N(th)}° about the ${axis}-axis.`, `Rota el punto v ${N(th)}° alrededor del eje ${axis}.`),
        lhs: [{ label: `R${axis}(${N(th)}°)`, m: M }, '·', { label: 'v', m: col(v) }],
        answer: { label: "v'", m: matmul(M, col(v)) },
        steps: [L(`The ${axis} coordinate cannot change — rotation happens in the other two.`, `La coordenada ${axis} no puede cambiar — la rotación ocurre en las otras dos.`),
          ...cellSteps(M, col(v))],
      };
    },
    hard(r) {
      if (r.next() < 0.5) {
        const a1 = r.pick(XYZ); let a2; do a2 = r.pick(XYZ); while (a2 === a1);
        const t1 = r.pick([90, 180]), t2 = r.pick([90, -90]);
        const A = rot3(a1, t1), B = rot3(a2, t2);
        return {
          prompt: L(`First rotate ${N(t1)}° about ${a1}, then ${N(t2)}° about ${a2}. Find M = R${a2}(${N(t2)}°) · R${a1}(${N(t1)}°).`,
                    `Primero rota ${N(t1)}° alrededor de ${a1}, luego ${N(t2)}° alrededor de ${a2}. Halla M = R${a2}(${N(t2)}°) · R${a1}(${N(t1)}°).`),
          lhs: [{ label: `R${a2}(${N(t2)}°)`, m: B }, '·', { label: `R${a1}(${N(t1)}°)`, m: A }],
          answer: { label: 'M', m: matmul(B, A) },
          steps: [L('The first rotation goes on the right. Rotations do NOT commute: swapping them gives a different matrix.',
                    'La primera rotación va a la derecha. Las rotaciones NO conmutan: intercambiarlas da otra matriz.'), rowColIntro, ...cellSteps(B, A)],
        };
      }
      const axis = r.pick(XYZ), th = r.pick([30, 45, 60]), v = r.vec(3, -4, 4);
      const M = rot3(axis, th), out = matmul(M, col(v)).map(row => [r2(row[0])]);
      if (v.every(x => x === 0)) return null;
      return {
        prompt: L(`Rotate v by ${N(th)}° about the ${axis}-axis. Round to 2 decimals.`, `Rota v ${N(th)}° alrededor del eje ${axis}. Redondea a 2 decimales.`),
        lhs: [{ label: 'v', m: col(v) }], answer: { label: "v'", m: out }, tol: 0.011,
        steps: [code(`R${axis}(θ) = ${rotFormula[axis]}`),
          code(`cos ${N(th)}° ≈ ${N(r2(Math.cos(rad(th))))},  sin ${N(th)}° ≈ ${N(r2(Math.sin(rad(th))))}`),
          ...M.map((row, i) => code(`${XYZ[i]}' = ${row.map((m, k) => `${N(r2(m))}·${P(v[k])}`).join(' + ')} ≈ ${N(out[i][0])}`))],
      };
    },
  };

  // ─── 11 · Homogeneous Coordinates (4×4) ───────────────────────────────────
  const T4 = (t, S = [1, 1, 1], R = ident(3)) => {
    const RS = R.map(row => row.map((x, j) => x * S[j]));
    return [[...RS[0], t[0]], [...RS[1], t[1]], [...RS[2], t[2]], [0, 0, 0, 1]];
  };
  G.homogeneous = {
    easy(r) {
      const t = r.vec(3, -9, 9), M = T4(t);
      const blanks = M.map((row, i) => row.map((_, j) => j === 3 || (i === j && r.next() < 0.3)));
      return {
        prompt: L(`Fill in the 4×4 translation matrix T that moves objects by (${t.map(N).join(', ')}).`,
                  `Completa la matriz de traslación 4×4 T que mueve los objetos (${t.map(N).join(', ')}).`),
        answer: { label: 'T', m: M, blanks },
        steps: [L('Start from the 4×4 identity (no change).', 'Empieza con la identidad 4×4 (sin cambio).'),
          L('Put the translation in the last column; the bottom row stays (0, 0, 0, 1) so points keep w = 1.',
            'Pon la traslación en la última columna; la fila de abajo se queda (0, 0, 0, 1) para que los puntos mantengan w = 1.'),
          code(`T = [[1, 0, 0, ${N(t[0])}], [0, 1, 0, ${N(t[1])}], [0, 0, 1, ${N(t[2])}], [0, 0, 0, 1]]`)],
      };
    },
    medium(r) {
      const S = [r.pick([1, 2, 3]), r.pick([1, 2, -1]), r.pick([1, 2, 3])], t = r.vec(3, -6, 6), M = T4(t, S);
      const p = [...r.vec(3, -4, 4), 1];
      return {
        prompt: L('M scales then translates. Transform the point p = (x, y, z, 1).', 'M escala y luego traslada. Transforma el punto p = (x, y, z, 1).'),
        lhs: [{ label: 'M', m: M }, '·', { label: 'p', m: col(p) }],
        answer: { label: "p'", m: matmul(M, col(p)) },
        steps: [L('Because w = 1, the last column (the translation) is added in full.', 'Como w = 1, la última columna (la traslación) se suma completa.'), ...cellSteps(M, col(p)),
          L('A direction vector would use w = 0 instead — translation would not affect it.', 'Un vector de dirección usaría w = 0 — la traslación no lo afectaría.')],
      };
    },
    hard(r) {
      const axis = r.pick(XYZ), th = r.pick([90, -90, 180]), R = rot3(axis, th);
      const S = [r.pick([1, 2, 3]), r.pick([1, 2, 3]), r.pick([1, 2])], t = r.vec(3, -8, 8);
      const RS = R.map(row => row.map((x, j) => x * S[j])), M = T4(t, S, R);
      return {
        prompt: L(`Build the model matrix M = T · R · S: scale by (${S.join(', ')}), rotate ${N(th)}° about ${axis}, then translate by (${t.map(N).join(', ')}).`,
                  `Construye la matriz de modelo M = T · R · S: escala por (${S.join(', ')}), rota ${N(th)}° alrededor de ${axis} y luego traslada (${t.map(N).join(', ')}).`),
        answer: { label: 'M = TRS', m: M, blanks: M.map((row, i) => row.map(() => i < 3)) },   // bottom row given
        steps: [L('Read right-to-left: S happens first, then R, then T — the standard order in Unity, Unreal and three.js.',
                  'Se lee de derecha a izquierda: primero S, luego R, luego T — el orden estándar en Unity, Unreal y three.js.'),
          { t: L(`Rotation R${axis}(${N(th)}°):`, `Rotación R${axis}(${N(th)}°):`), m: R },
          { t: L(`R · S multiplies column j of R by the scale sⱼ = (${S.join(', ')}):`, `R · S multiplica la columna j de R por la escala sⱼ = (${S.join(', ')}):`), m: RS },
          L('T only adds the translation as the 4th column and the row (0, 0, 0, 1):', 'T solo agrega la traslación como 4.ª columna y la fila (0, 0, 0, 1):'),
          { t: L('Result:', 'Resultado:'), m: M }],
      };
    },
  };

  // ─── 12 · Change of Basis & Coordinate Spaces ─────────────────────────────
  G.basis = {
    easy(r) {
      const b1 = r.vec(2, -3, 3), b2 = r.vec(2, -3, 3);
      if (det2([[b1[0], b2[0]], [b1[1], b2[1]]]) === 0) return null;
      const c = r.vec(2, -4, 4), w = [c[0] * b1[0] + c[1] * b2[0], c[0] * b1[1] + c[1] * b2[1]];
      return {
        prompt: L(`An object’s local axes are b₁ and b₂. A point has local coordinates (${c.map(N).join(', ')}). Find its world coordinates.`,
                  `Los ejes locales de un objeto son b₁ y b₂. Un punto tiene coordenadas locales (${c.map(N).join(', ')}). Halla sus coordenadas de mundo.`),
        lhs: [{ label: 'b₁', m: col(b1) }, { label: 'b₂', m: col(b2) }],
        answer: { label: 'p_world', m: col(w) },
        steps: [code(`p = ${N(c[0])}·b₁ + ${P(c[1])}·b₂`),
          code(`x = ${P(c[0])}·${P(b1[0])} + ${P(c[1])}·${P(b2[0])} = ${N(w[0])}`),
          code(`y = ${P(c[0])}·${P(b1[1])} + ${P(c[1])}·${P(b2[1])} = ${N(w[1])}`),
          L('Same thing as multiplying the basis matrix B = [b₁ b₂] by the local coordinates.', 'Es lo mismo que multiplicar la matriz de base B = [b₁ b₂] por las coordenadas locales.')],
      };
    },
    medium(r) {
      const B = unimodular(r, 2, 3, 4); if (!B) return null;
      const d = det2(B), Binv = [[B[1][1] * d, -B[0][1] * d], [-B[1][0] * d, B[0][0] * d]];
      const p = r.vec(2, -6, 6), c = matmul(Binv, col(p));
      return {
        prompt: L('B’s columns are an object’s local axes. Convert the world point p to local coordinates: c = B⁻¹ p.',
                  'Las columnas de B son los ejes locales de un objeto. Convierte el punto de mundo p a coordenadas locales: c = B⁻¹ p.'),
        lhs: [{ label: 'B', m: B }, { label: 'p', m: col(p) }],
        answer: { label: 'c', m: c },
        steps: [code(`det B = ${N(d)}`), { t: L('B⁻¹ (swap a,d; negate b,c; divide by det):', 'B⁻¹ (intercambia a,d; cambia signo a b,c; divide entre det):'), m: Binv },
          ...cellSteps(Binv, col(p)),
          L(`Check: ${code(`${N(c[0][0])}·b₁ + ${P(c[1][0])}·b₂ = p`)} ✓`, `Comprueba: ${code(`${N(c[0][0])}·b₁ + ${P(c[1][0])}·b₂ = p`)} ✓`)],
      };
    },
    hard(r) {
      const R = signedPerm(r, true), cam = r.vec(3, -5, 5), p = r.vec(3, -6, 6);
      const d = p.map((x, i) => x - cam[i]), axes = T(R), v = axes.map(a => dot(a, d));
      return {
        prompt: L('The camera sits at c. Its right / up / back axes are the columns of R. Convert the world point p to VIEW space: v = Rᵀ (p − c).',
                  'La cámara está en c. Sus ejes derecha / arriba / atrás son las columnas de R. Convierte el punto de mundo p al espacio de VISTA: v = Rᵀ (p − c).'),
        lhs: [{ label: 'R', m: R }, { label: 'c', m: col(cam) }, { label: 'p', m: col(p) }],
        answer: { label: 'v', m: col(v) },
        steps: [L(`Move the camera to the origin: ${code(`p − c = ${MX.vec(d)}`)}`, `Lleva la cámara al origen: ${code(`p − c = ${MX.vec(d)}`)}`),
          L('R is orthonormal, so R⁻¹ = Rᵀ: each view coordinate is a dot product with one camera axis.', 'R es ortonormal, así que R⁻¹ = Rᵀ: cada coordenada de vista es un producto punto con un eje de la cámara.'),
          ...['right', 'up', 'back'].map((nm, i) => code(`${XYZ[i]}_view = ${nm}·(p − c) = ${axes[i].map((a, k) => `${P(a)}·${P(d[k])}`).join(' + ')} = ${N(v[i])}`)),
          L('This is exactly the job of the view matrix in every 3D engine and VR headset.', 'Este es exactamente el trabajo de la matriz de vista en todo motor 3D y casco de VR.')],
      };
    },
  };

  // ─── 13 · Orthogonality & Gram–Schmidt ────────────────────────────────────
  function projSteps(v, u, vName, uName) {
    const vu = frDot(v, u), uu = frDot(u, u), s = vu.div(uu);
    return { s, steps: [code(`${vName}·${uName} = ${N(vu)},  ${uName}·${uName} = ${N(uu)}  →  coefficient ${N(s)}`)] };
  }
  G.orthogonal = {
    easy(r) {
      const Q = signedPerm(r);
      return {
        prompt: L('Q is orthogonal (its columns are perpendicular unit vectors). Find Q⁻¹ — no elimination needed.',
                  'Q es ortogonal (sus columnas son vectores unitarios perpendiculares). Halla Q⁻¹ — sin eliminación.'),
        lhs: [{ label: 'Q', m: Q }], answer: { label: 'Q⁻¹', m: T(Q) },
        steps: [L('For orthogonal matrices, Q⁻¹ = Qᵀ (because QᵀQ = I).', 'Para matrices ortogonales, Q⁻¹ = Qᵀ (porque QᵀQ = I).'),
          L('Transpose: row i of Q becomes column i.', 'Transpón: la fila i de Q se vuelve la columna i.'),
          L('That is why inverting a rotation in a game engine is nearly free.', 'Por eso invertir una rotación en un motor de juegos es casi gratis.')],
      };
    },
    medium(r) {
      const v1 = r.vec(3, -3, 3), v2 = r.vec(3, -3, 3);
      if (v1.every(x => x === 0) || cross(v1, v2).every(x => x === 0) || dot(v1, v2) === 0) return null;
      const { s, steps } = projSteps(v2, v1, 'v₂', 'v₁');
      const u2 = v2.map((x, i) => fr(x).sub(s.mul(v1[i])));
      return {
        prompt: L('Make v₂ perpendicular to v₁: u₂ = v₂ − (v₂·v₁ / v₁·v₁) v₁.', 'Haz v₂ perpendicular a v₁: u₂ = v₂ − (v₂·v₁ / v₁·v₁) v₁.'),
        lhs: [{ label: 'v₁', m: col(v1) }, { label: 'v₂', m: col(v2) }],
        answer: { label: 'u₂', m: col(u2) },
        steps: [...steps, L('Subtract that much of v₁ from v₂:', 'Resta esa cantidad de v₁ a v₂:'),
          ...XYZ.map((c, i) => code(`${c}: ${N(v2[i])} − ${P(s)}·${P(v1[i])} = ${N(u2[i])}`)),
          L(`Check: ${code(`u₂·v₁ = ${N(frDot(u2, v1))}`)} ✓ perpendicular`, `Comprueba: ${code(`u₂·v₁ = ${N(frDot(u2, v1))}`)} ✓ perpendicular`)],
      };
    },
    hard(r) {
      const V = [r.vec(3, -2, 2), r.vec(3, -2, 2), r.vec(3, -2, 2)];
      if (det3(T(V)) === 0) return null;
      const [v1, v2, v3] = V;
      const p21 = projSteps(v2, v1, 'v₂', 'u₁');
      const u2 = v2.map((x, i) => fr(x).sub(p21.s.mul(v1[i])));
      const p31 = projSteps(v3, v1, 'v₃', 'u₁'), p32 = projSteps(v3, u2, 'v₃', 'u₂');
      const u3 = v3.map((x, i) => fr(x).sub(p31.s.mul(v1[i])).sub(p32.s.mul(u2[i])));
      if (u3.some(x => x.d > 30)) return null;
      return {
        prompt: L('Run Gram–Schmidt on v₁, v₂, v₃ (u₁ = v₁). Find u₃, the part of v₃ perpendicular to both u₁ and u₂.',
                  'Aplica Gram–Schmidt a v₁, v₂, v₃ (u₁ = v₁). Halla u₃, la parte de v₃ perpendicular a u₁ y u₂.'),
        lhs: [{ label: 'v₁', m: col(v1) }, { label: 'v₂', m: col(v2) }, { label: 'v₃', m: col(v3) }],
        answer: { label: 'u₃', m: col(u3) },
        steps: [L('Step 1: u₁ = v₁.', 'Paso 1: u₁ = v₁.'), ...p21.steps,
          L(`Step 2: ${code(`u₂ = v₂ − ${P(p21.s)}·u₁ = ${MX.vec(u2)}`)}`, `Paso 2: ${code(`u₂ = v₂ − ${P(p21.s)}·u₁ = ${MX.vec(u2)}`)}`),
          L('Step 3: remove from v₃ its parts along u₁ and u₂:', 'Paso 3: quita a v₃ sus partes en la dirección de u₁ y u₂:'),
          ...p31.steps, ...p32.steps,
          ...XYZ.map((c, i) => code(`${c}: ${N(v3[i])} − ${P(p31.s)}·${P(v1[i])} − ${P(p32.s)}·${P(u2[i])} = ${N(u3[i])}`)),
          L(`Check: ${code(`u₃·u₁ = ${N(frDot(u3, v1))}, u₃·u₂ = ${N(frDot(u3, u2))}`)} ✓`, `Comprueba: ${code(`u₃·u₁ = ${N(frDot(u3, v1))}, u₃·u₂ = ${N(frDot(u3, u2))}`)} ✓`)],
      };
    },
  };

  // ─── 14 · Projection Matrices ─────────────────────────────────────────────
  G.projection = {
    easy(r) {
      const w = r.pick([2, 4, 5, 8, 10]), c = r.vec(3, -w, w), ndc = c.map(x => new Fr(x, w));
      return {
        prompt: L(`After the projection matrix, a vertex has clip coordinates (x, y, z, w). Do the perspective divide to get NDC.`,
                  `Después de la matriz de proyección, un vértice tiene coordenadas de recorte (x, y, z, w). Haz la división de perspectiva para obtener NDC.`),
        lhs: [{ label: 'clip', m: col([...c, w]) }],
        answer: { label: 'NDC', m: col(ndc) },
        steps: [L(`Divide x, y and z by w = ${w}:`, `Divide x, y y z entre w = ${w}:`),
          ...XYZ.map((nm, i) => code(`${nm} = ${N(c[i])} / ${w} = ${N(ndc[i])}`)),
          L('Every value lands in [−1, 1], so the vertex is inside the view frustum.', 'Cada valor queda en [−1, 1], así que el vértice está dentro del frustum de visión.')],
      };
    },
    medium(r) {
      const d = r.pick([1, 2]), z = -r.int(2, 10), x = r.int(-8, 8), y = r.int(-8, 8);
      const sx = new Fr(d * x, -z), sy = new Fr(d * y, -z);
      return {
        prompt: L(`Pinhole camera at the origin looking down −z, image plane at distance d = ${d}. Project the point P onto the image plane: (d·x/(−z), d·y/(−z)).`,
                  `Cámara estenopeica en el origen mirando hacia −z, plano de imagen a distancia d = ${d}. Proyecta el punto P al plano de imagen: (d·x/(−z), d·y/(−z)).`),
        lhs: [{ label: 'P', m: col([x, y, z]) }],
        answer: { label: 'screen', m: col([sx, sy]) },
        steps: [L(`Depth in front of the camera: ${code(`−z = ${-z}`)}. Farther points get divided by more → they look smaller.`,
                  `Profundidad frente a la cámara: ${code(`−z = ${-z}`)}. Los puntos más lejanos se dividen entre más → se ven más pequeños.`),
          code(`x_s = ${d}·${P(x)} / ${-z} = ${N(sx)}`), code(`y_s = ${d}·${P(y)} / ${-z} = ${N(sy)}`)],
      };
    },
    hard(r) {
      const n = r.pick([1, 2]), f = r.pick([4, 5, 10, 20, 50, 100]), aspect = r.pick([1, 2]);
      const A = new Fr(-(f + n), f - n), B = new Fr(-2 * f * n, f - n), sx = new Fr(1, aspect);
      const M = [[sx, 0, 0, 0], [0, 1, 0, 0], [0, 0, A, B], [0, 0, -1, 0]];
      const blanks = M.map((row, i) => row.map((_, j) => (i === j && i < 3) || (i === 2 && j === 3) || (i === 3 && j === 2)));
      return {
        prompt: L(`Fill in the OpenGL-style perspective matrix for a 90° vertical field of view, aspect ratio ${aspect}, near n = ${n}, far f = ${f}.`,
                  `Completa la matriz de perspectiva estilo OpenGL para un campo de visión vertical de 90°, relación de aspecto ${aspect}, near n = ${n}, far f = ${f}.`),
        answer: { label: 'P', m: M, blanks }, tol: 0.011,
        steps: [L(`Focal scale: ${code('cot(90°/2) = cot 45° = 1')}. Divide the x one by the aspect: ${code(`1 / ${aspect} = ${N(sx)}`)}.`,
                  `Escala focal: ${code('cot(90°/2) = cot 45° = 1')}. Divide la de x entre el aspecto: ${code(`1 / ${aspect} = ${N(sx)}`)}.`),
          code(`P₃₃ = −(f + n)/(f − n) = −(${f} + ${n})/(${f} − ${n}) = ${N(A)}`),
          code(`P₃₄ = −2fn/(f − n) = −2·${f}·${n}/${f - n} = ${N(B)}`),
          L(`${code('P₄₃ = −1')} copies −z into w, so the later divide by w makes far things smaller.`, `${code('P₄₃ = −1')} copia −z en w, así la división posterior entre w hace más pequeño lo lejano.`),
          L('These two depth numbers map z = −n to −1 and z = −f to +1 (the NDC depth range).', 'Estos dos números de profundidad llevan z = −n a −1 y z = −f a +1 (el rango de profundidad NDC).')],
      };
    },
  };

  // ─── 15 · Eigenvalues & Eigenvectors ──────────────────────────────────────
  G.eigen = {
    easy(r) {
      const E = eigenMatrix(r); if (!E) return null;
      let v = [E.b, E.l1 - E.a]; const k = Math.abs(v[0]) && Math.abs(v[1]) ? gcdInt(v[0], v[1]) : Math.max(Math.abs(v[0]), Math.abs(v[1]), 1);
      v = v.map(x => x / k);
      const Av = matmul(E.A, col(v)).map(x => x[0]);
      return {
        prompt: L('v is an eigenvector of A. Find its eigenvalue λ (so that A v = λ v).', 'v es un vector propio de A. Halla su valor propio λ (tal que A v = λ v).'),
        lhs: [{ label: 'A', m: E.A }, { label: 'v', m: col(v) }],
        answer: { label: 'λ', m: [[E.l1]] },
        steps: [...cellSteps(E.A, col(v)).map(s => s.replace(/c(.)₁/, 'Av$1')),
          L(`So ${code(`Av = ${MX.vec(Av)}`)}, which is ${code(`${N(E.l1)} · ${MX.vec(v)}`)}.`, `Así ${code(`Av = ${MX.vec(Av)}`)}, que es ${code(`${N(E.l1)} · ${MX.vec(v)}`)}.`),
          L(`A only stretches v (by ${N(E.l1)}) — it does not turn it. That is what makes it an eigenvector.`, `A solo estira v (por ${N(E.l1)}) — no lo gira. Eso lo hace vector propio.`)],
      };
    },
    medium(r) {
      const E = eigenMatrix(r); if (!E) return null;
      const tr = E.a + E.d, d = det2(E.A);
      return {
        prompt: L('Find both eigenvalues of A (largest first).', 'Halla los dos valores propios de A (el mayor primero).'),
        lhs: [{ label: 'A', m: E.A }],
        answer: { label: '(λ₁, λ₂)', m: [[E.l1, E.l2]] },
        steps: [L('Solve det(A − λI) = 0. For a 2×2 this is λ² − (trace)λ + det = 0.', 'Resuelve det(A − λI) = 0. Para una 2×2 es λ² − (traza)λ + det = 0.'),
          code(`trace = ${P(E.a)} + ${P(E.d)} = ${N(tr)},  det = ${P(E.a)}·${P(E.d)} − ${P(E.b)}·${P(E.c)} = ${N(d)}`),
          code(`λ² − ${P(tr)}λ + ${P(d)} = 0`),
          code(`(λ − ${P(E.l1)})(λ − ${P(E.l2)}) = 0  →  λ = ${N(E.l1)}, ${N(E.l2)}`),
          L(`Check: they add to the trace (${N(tr)}) and multiply to the det (${N(d)}) ✓`, `Comprueba: suman la traza (${N(tr)}) y su producto es el det (${N(d)}) ✓`)],
      };
    },
    hard(r) {
      const E = eigenMatrix(r); if (!E) return null;
      const y1 = new Fr(E.l1 - E.a, E.b), y2 = new Fr(E.l2 - E.a, E.b);
      return {
        prompt: L(`A has eigenvalues λ₁ = ${N(E.l1)} and λ₂ = ${N(E.l2)}. Find an eigenvector for each, scaled so its first entry is 1 (columns: v₁, v₂).`,
                  `A tiene valores propios λ₁ = ${N(E.l1)} y λ₂ = ${N(E.l2)}. Halla un vector propio para cada uno, escalado para que su primera entrada sea 1 (columnas: v₁, v₂).`),
        lhs: [{ label: 'A', m: E.A }],
        answer: { label: '[v₁ v₂]', m: [[1, 1], [y1, y2]], blanks: [[false, false], [true, true]] },
        steps: [L('Solve (A − λI) v = 0. The first row says (a − λ)·x + b·y = 0; with x = 1 that gives y = (λ − a)/b.',
                  'Resuelve (A − λI) v = 0. La primera fila dice (a − λ)·x + b·y = 0; con x = 1 da y = (λ − a)/b.'),
          code(`λ₁ = ${N(E.l1)}: y = (${N(E.l1)} − ${P(E.a)}) / ${P(E.b)} = ${N(y1)}`),
          code(`λ₂ = ${N(E.l2)}: y = (${N(E.l2)} − ${P(E.a)}) / ${P(E.b)} = ${N(y2)}`),
          L('Any nonzero multiple is also an eigenvector — fixing x = 1 just picks one.', 'Cualquier múltiplo no nulo también es vector propio — fijar x = 1 solo elige uno.')],
      };
    },
  };
  function gcdInt(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; }

  // ─── 16 · Quaternions ─────────────────────────────────────────────────────
  const axisVec = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] };
  G.quaternion = {
    easy(r) {
      const ax = r.pick(XYZ), sgn = r.sign(), th = r.pick([60, 90, 120, 180]);
      const a = axisVec[ax].map(x => x * sgn);
      const w = Math.cos(rad(th / 2)), s = Math.sin(rad(th / 2));
      const q = [r2(w), ...a.map(x => r2(x * s))].map(clean);
      return {
        prompt: L(`Write the unit quaternion q = (w, x, y, z) for a rotation of ${N(th)}° about the axis ${MX.vec(a)}. Round to 2 decimals.`,
                  `Escribe el cuaternión unitario q = (w, x, y, z) para una rotación de ${N(th)}° alrededor del eje ${MX.vec(a)}. Redondea a 2 decimales.`),
        answer: { label: 'q', m: [q] }, tol: 0.011,
        steps: [code('q = (cos(θ/2), sin(θ/2)·aₓ, sin(θ/2)·a_y, sin(θ/2)·a_z)'),
          L(`Half the angle: ${code(`θ/2 = ${th / 2}°`)} — quaternions always use the half angle.`, `La mitad del ángulo: ${code(`θ/2 = ${th / 2}°`)} — los cuaterniones siempre usan el medio ángulo.`),
          code(`cos ${th / 2}° ≈ ${N(r2(w))},  sin ${th / 2}° ≈ ${N(r2(s))}`),
          code(`q ≈ (${q.map(N).join(', ')})`)],
      };
    },
    medium(r) {
      const q1 = r.vec(4, -2, 2), q2 = r.vec(4, -2, 2);
      const [w1, x1, y1, z1] = q1, [w2, x2, y2, z2] = q2;
      const out = [w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2, w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
                   w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2, w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2];
      return {
        prompt: L('Multiply the quaternions q₁ · q₂ (written as (w, x, y, z)).', 'Multiplica los cuaterniones q₁ · q₂ (escritos como (w, x, y, z)).'),
        lhs: [{ label: 'q₁', m: [q1] }, '·', { label: 'q₂', m: [q2] }],
        answer: { label: 'q₁q₂', m: [out] },
        steps: [L('Hamilton product (i² = j² = k² = ijk = −1):', 'Producto de Hamilton (i² = j² = k² = ijk = −1):'),
          code(`w = w₁w₂ − x₁x₂ − y₁y₂ − z₁z₂ = ${P(w1 * w2)} − ${P(x1 * x2)} − ${P(y1 * y2)} − ${P(z1 * z2)} = ${N(out[0])}`),
          code(`x = w₁x₂ + x₁w₂ + y₁z₂ − z₁y₂ = ${P(w1 * x2)} + ${P(x1 * w2)} + ${P(y1 * z2)} − ${P(z1 * y2)} = ${N(out[1])}`),
          code(`y = w₁y₂ − x₁z₂ + y₁w₂ + z₁x₂ = ${P(w1 * y2)} − ${P(x1 * z2)} + ${P(y1 * w2)} + ${P(z1 * x2)} = ${N(out[2])}`),
          code(`z = w₁z₂ + x₁y₂ − y₁x₂ + z₁w₂ = ${P(w1 * z2)} + ${P(x1 * y2)} − ${P(y1 * x2)} + ${P(z1 * w2)} = ${N(out[3])}`),
          L('Order matters: q₂ · q₁ is usually different.', 'El orden importa: q₂ · q₁ suele ser diferente.')],
      };
    },
    hard(r) {
      const ax = r.pick(XYZ), sgn = r.sign(), th = r.pick([90, 180, -90]);
      const a = axisVec[ax].map(x => x * sgn), v = r.vec(3, -5, 5);
      if (v.every(x => x === 0)) return null;
      const sn = clean(Math.sin(rad(th))), oc = clean(1 - Math.cos(rad(th)));
      const av = cross(a, v), aav = cross(a, av);
      const out = v.map((x, i) => x + sn * av[i] + oc * aav[i]);
      return {
        prompt: L(`A headset turns by the quaternion for ${N(th)}° about ${MX.vec(a)}. Rotate the vector v (v' = q v q*).`,
                  `Un casco gira según el cuaternión de ${N(th)}° alrededor de ${MX.vec(a)}. Rota el vector v (v' = q v q*).`),
        lhs: [{ label: 'v', m: col(v) }], answer: { label: "v'", m: col(out) },
        steps: [L('For a unit axis a, expanding q v q* gives the shortcut v′ = v + sin θ (a × v) + (1 − cos θ) a × (a × v).',
                  'Para un eje unitario a, desarrollar q v q* da el atajo v′ = v + sen θ (a × v) + (1 − cos θ) a × (a × v).'),
          code(`sin θ = ${N(sn)},  1 − cos θ = ${N(oc)}`),
          code(`a × v = ${MX.vec(av)}`), code(`a × (a × v) = ${MX.vec(aav)}`),
          ...XYZ.map((c, i) => code(`${c}: ${N(v[i])} + ${P(sn)}·${P(av[i])} + ${P(oc)}·${P(aav[i])} = ${N(out[i])}`))],
      };
    },
  };

  return G;
})();

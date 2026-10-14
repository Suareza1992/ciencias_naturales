// ═══════════════════════════════════════════════════════════════════════════
// Linear Algebra lab — the Transform Playground.
//
// Type into a 4×4 matrix (or click presets) and watch a cube move.
//   • columns 1–3 = where the cube’s x, y, z axes go (drawn as arrows)
//   • column 4    = translation
//   • bottom row  = perspective (w); if w ≠ 1 the points are divided by w
// "Compose" mode multiplies each preset ON TOP of the current matrix
// (M ← P · M), so you can stack scale → rotate → translate yourself.
// ═══════════════════════════════════════════════════════════════════════════

const LA_LAB = (() => {
  const L = (en, es) => ({ en, es });
  const ID = () => [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
  const mul = (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, a, k) => s + a * B[k][j], 0)));
  const rnd = x => Math.round(x * 1000) / 1000 + 0;
  const fmt = x => (Object.is(rnd(x), -0) ? '0' : String(rnd(x)).replace('-', '−'));

  const ISO = ([x, y, z]) => [(x - z) * 0.866, y - (x + z) * 0.5];
  const CUBE_V = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]];
  const CUBE_E = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];

  const PRESETS = [
    { id: 'id',    name: L('Identity', 'Identidad'),     m: () => ID() },
    { id: 'tr',    name: L('Translate', 'Trasladar'),    m: () => [[1, 0, 0, 1.5], [0, 1, 0, 0.5], [0, 0, 1, 0], [0, 0, 0, 1]] },
    { id: 'sc',    name: L('Scale', 'Escalar'),          m: () => [[1.5, 0, 0, 0], [0, 0.6, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]] },
    { id: 'rx',    name: L('Rotate X', 'Rotar X'),       m: t => [[1, 0, 0, 0], [0, Math.cos(t), -Math.sin(t), 0], [0, Math.sin(t), Math.cos(t), 0], [0, 0, 0, 1]] },
    { id: 'ry',    name: L('Rotate Y', 'Rotar Y'),       m: t => [[Math.cos(t), 0, Math.sin(t), 0], [0, 1, 0, 0], [-Math.sin(t), 0, Math.cos(t), 0], [0, 0, 0, 1]] },
    { id: 'rz',    name: L('Rotate Z', 'Rotar Z'),       m: t => [[Math.cos(t), -Math.sin(t), 0, 0], [Math.sin(t), Math.cos(t), 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]] },
    { id: 'sh',    name: L('Shear', 'Cizallar'),         m: () => [[1, 0.6, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]] },
    { id: 'mir',   name: L('Mirror X', 'Espejo X'),      m: () => [[-1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]] },
    { id: 'flat',  name: L('Flatten Y', 'Aplanar Y'),    m: () => [[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]] },
    { id: 'persp', name: L('Perspective', 'Perspectiva'), m: () => [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, -0.25, 1]] },
  ];

  const TEXT = {
    name:   L('Transform Playground', 'Laboratorio de Transformaciones'),
    sub:    L('Edit any of the 16 numbers or click a preset. The gold cube is the transformed object; its colored arrows are the matrix columns.',
              'Edita cualquiera de los 16 números o haz clic en un ajuste. El cubo dorado es el objeto transformado; sus flechas de colores son las columnas de la matriz.'),
    presets: L('Presets', 'Ajustes'),
    angle:   L('Rotation angle', 'Ángulo de rotación'),
    compose: L('Compose: apply the preset on top of the current matrix (M ← P · M)', 'Componer: aplica el ajuste encima de la matriz actual (M ← P · M)'),
    matrix:  L('4×4 matrix M (editable)', 'Matriz 4×4 M (editable)'),
    reading: L('What this matrix does', 'Qué hace esta matriz'),
  };

  function describe(M) {
    const d = M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
    const t = [M[0][3], M[1][3], M[2][3]];
    const persp = Math.abs(M[3][0]) + Math.abs(M[3][1]) + Math.abs(M[3][2]) > 1e-9 || Math.abs(M[3][3] - 1) > 1e-9;
    const cols = [0, 1, 2].map(j => [M[0][j], M[1][j], M[2][j]]);
    const lens = cols.map(c => Math.hypot(...c));
    const ortho = Math.abs(cols[0][0] * cols[1][0] + cols[0][1] * cols[1][1] + cols[0][2] * cols[1][2]) < 1e-6
               && Math.abs(cols[0][0] * cols[2][0] + cols[0][1] * cols[2][1] + cols[0][2] * cols[2][2]) < 1e-6
               && Math.abs(cols[1][0] * cols[2][0] + cols[1][1] * cols[2][1] + cols[1][2] * cols[2][2]) < 1e-6;
    const out = [L(`det (upper 3×3) = <b>${fmt(d)}</b> → volume is multiplied by ${fmt(Math.abs(d))}.`,
                   `det (3×3 superior) = <b>${fmt(d)}</b> → el volumen se multiplica por ${fmt(Math.abs(d))}.`)];
    if (Math.abs(d) < 1e-9) out.push(L('det = 0: the cube is squashed flat — this matrix has no inverse.', 'det = 0: el cubo queda aplastado — esta matriz no tiene inversa.'));
    else if (d < 0) out.push(L('det < 0: the cube is mirrored (orientation flipped).', 'det < 0: el cubo está reflejado (orientación invertida).'));
    if (ortho && lens.every(l => Math.abs(l - 1) < 1e-6) && d > 0) out.push(L('The columns are perpendicular unit vectors → a pure rotation (M⁻¹ = Mᵀ for this part).', 'Las columnas son vectores unitarios perpendiculares → una rotación pura (M⁻¹ = Mᵀ para esta parte).'));
    else if (ortho) out.push(L(`Perpendicular axes with lengths (${lens.map(fmt).join(', ')}) → rotation/mirror plus scale.`, `Ejes perpendiculares con longitudes (${lens.map(fmt).join(', ')}) → rotación/espejo más escala.`));
    else out.push(L('The axes are not perpendicular → there is shear (angles get distorted).', 'Los ejes no son perpendiculares → hay cizalla (los ángulos se deforman).'));
    if (t.some(x => Math.abs(x) > 1e-9)) out.push(L(`Translation (column 4): the cube’s center moves to (${t.map(fmt).join(', ')}).`, `Traslación (columna 4): el centro del cubo se mueve a (${t.map(fmt).join(', ')}).`));
    if (persp) out.push(L('Bottom row ≠ (0, 0, 0, 1): each point is divided by its w — a perspective effect (far side shrinks).', 'Fila inferior ≠ (0, 0, 0, 1): cada punto se divide entre su w — un efecto de perspectiva (el lado lejano se encoge).'));
    return out;
  }

  return {
    name: TEXT.name,
    mount(el, ctx) {
      const { t, tr, Graph, onLang, parseAnswer } = ctx;
      let M = ID(), angle = Math.PI / 6;

      el.innerHTML = `
        <div class="lab-head"><h2>${t(TEXT.name)}</h2><p>${t(TEXT.sub)}</p></div>
        <div class="lab-body">
          <div class="lab-svg-wrap" id="laSvg"></div>
          <div class="lab-right">
            <div class="f-label">${t(TEXT.presets)}</div>
            <div class="lab-chips" id="laPresets">${PRESETS.map((p, i) => `<button class="lab-chip" data-i="${i}">${t(p.name)}</button>`).join('')}</div>
            <div class="lab-slider">
              <label for="laAngle">θ</label>
              <input type="range" id="laAngle" min="-180" max="180" step="5" value="30">
              <output id="laAngleOut">30°</output>
            </div>
            <label class="f-desc" style="display:flex;gap:0.5rem;align-items:flex-start;cursor:pointer">
              <input type="checkbox" id="laCompose" style="margin-top:0.2rem"> <span>${t(TEXT.compose)}</span>
            </label>
            <div class="lab-card mx-edit">
              <div class="f-label">${t(TEXT.matrix)}</div>
              <div id="laMatrix"></div>
            </div>
            <div class="lab-card">
              <div class="f-label">${t(TEXT.reading)}</div>
              <ul class="lab-explain" id="laExplain"></ul>
            </div>
          </div>
        </div>`;

      const svgWrap = el.querySelector('#laSvg');
      const matWrap = el.querySelector('#laMatrix');

      // Build the editable grid once; inputs write straight into M
      matWrap.innerHTML = `<span class="mx" style="--cols:4">${M.map((row, i) => row.map((_, j) =>
        `<input class="mx-cell mx-in" data-i="${i}" data-j="${j}" inputmode="decimal" aria-label="M row ${i + 1} column ${j + 1}">`).join('')).join('')}</span>`;
      const inputs = [...matWrap.querySelectorAll('input')];
      const syncInputs = () => inputs.forEach(inp => { inp.value = fmt(M[+inp.dataset.i][+inp.dataset.j]); inp.classList.remove('bad'); });
      inputs.forEach(inp => inp.addEventListener('input', () => {
        const v = parseAnswer(inp.value);
        if (Number.isNaN(v)) { inp.classList.add('bad'); return; }
        inp.classList.remove('bad');
        M[+inp.dataset.i][+inp.dataset.j] = v;
        draw();
      }));

      function apply(p) {
        const v = [p[0], p[1], p[2], 1];
        const o = M.map(r => r.reduce((s, a, k) => s + a * v[k], 0));
        const w = Math.abs(o[3]) < 0.05 ? 0.05 * Math.sign(o[3] || 1) : o[3];
        return [o[0] / w, o[1] / w, o[2] / w];
      }

      function draw() {
        const g = Graph({ x: [-4.2, 4.2], y: [-4.2, 4.2], animate: false });
        g.grid(1);
        [[3.4, 0, 0, 'x'], [0, 3.4, 0, 'y'], [0, 0, 3.4, 'z']].forEach(([x, y, z, nm]) => {
          g.line(0, 0, ...ISO([x, y, z]), { ghost: true });
          g.text(...ISO([x * 1.08, y * 1.08, z * 1.08]), nm, { muted: true, anchor: 'middle', draw: false });
        });
        CUBE_E.forEach(([a, b]) => g.line(...ISO(CUBE_V[a]), ...ISO(CUBE_V[b]), { ghost: true }));
        const V = CUBE_V.map(apply);
        CUBE_E.forEach(([a, b]) => g.line(...ISO(V[a]), ...ISO(V[b]), { color: 1 }));
        // Column arrows: where the x, y, z axes go (drawn from the moved origin)
        const o = apply([0, 0, 0]);
        [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach((e, k) =>
          g.arrow(...ISO(o), ...ISO(apply(e)), { color: [3, 1, 2][k], thin: true }));
        svgWrap.innerHTML = g.svg();

        const list = el.querySelector('#laExplain');
        list.innerHTML = describe(M).map(item => `<li>${tr(item)}</li>`).join('');
      }

      el.querySelector('#laPresets').addEventListener('click', e => {
        const b = e.target.closest('.lab-chip'); if (!b) return;
        const P = PRESETS[+b.dataset.i].m(angle);
        M = el.querySelector('#laCompose').checked ? mul(P, M) : P;
        syncInputs(); draw();
      });
      const angleIn = el.querySelector('#laAngle');
      angleIn.addEventListener('input', () => {
        angle = +angleIn.value * Math.PI / 180;
        el.querySelector('#laAngleOut').textContent = String(angleIn.value).replace('-', '−') + '°';
      });

      syncInputs(); draw();
      onLang(draw);
    },
  };
})();

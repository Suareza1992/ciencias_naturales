// ═══════════════════════════════════════════════════════════════════════════
// Calculus lab — the Derivative & Integral Lab.
//
// One graph, both big ideas:
//   • drag x₀ → the tangent line (pink) and its slope f′(x₀)
//   • drag n  → n rectangles (blue) approximating ∫ₐᵇ f(x) dx, with the error
// Mounted by shared/explorer.js into <section id="labSection">.
// ═══════════════════════════════════════════════════════════════════════════

const CALC_LAB = (() => {
  const L = (en, es) => ({ en, es });

  // f, its derivative df, an antiderivative F (for the exact integral),
  // the viewing window, the integration interval [a, b] and the x₀ range.
  const FUNCS = [
    { label: 'x²',      f: x => x * x,            df: x => 2 * x,         dfText: '2x',
      F: x => x ** 3 / 3,                   win: { x: [-3, 3], y: [-2, 9] },   ab: [0, 2],       abText: ['0', '2'], x0: [-2.8, 2.8], start: 1 },
    { label: 'x³ − 3x', f: x => x ** 3 - 3 * x,   df: x => 3 * x * x - 3, dfText: '3x² − 3',
      F: x => x ** 4 / 4 - 1.5 * x * x,     win: { x: [-3, 3], y: [-5, 5] },   ab: [0, 2],       abText: ['0', '2'], x0: [-2.8, 2.8], start: -1.5 },
    { label: 'sin x',   f: Math.sin,              df: Math.cos,           dfText: 'cos x',
      F: x => -Math.cos(x),                 win: { x: [-1, 7], y: [-2, 2] },   ab: [0, Math.PI], abText: ['0', 'π'], x0: [-0.8, 6.8], start: 1 },
    { label: 'eˣ',      f: Math.exp,              df: Math.exp,           dfText: 'eˣ',
      F: Math.exp,                          win: { x: [-3, 3], y: [-1, 8] },   ab: [0, 2],       abText: ['0', '2'], x0: [-2.8, 2.05], start: 1 },
    { label: 'ln x',    f: Math.log,              df: x => 1 / x,         dfText: '1/x',
      F: x => x * Math.log(x) - x,          win: { x: [-0.5, 6], y: [-3, 3] }, ab: [1, 4],       abText: ['1', '4'], x0: [0.2, 5.8],  start: 2 },
  ];

  const METHODS = [
    { id: 'left',  name: L('Left', 'Izquierda'),   at: (x, dx) => x },
    { id: 'mid',   name: L('Midpoint', 'Punto medio'), at: (x, dx) => x + dx / 2 },
    { id: 'right', name: L('Right', 'Derecha'),    at: (x, dx) => x + dx },
  ];

  const TEXT = {
    name: L('Derivative & Integral Lab', 'Laboratorio de Derivadas e Integrales'),
    sub:  L('One curve, both halves of Calculus. Slide x₀ to see the slope at a point; raise n to watch rectangles turn into the exact area.',
            'Una curva, las dos mitades del Cálculo. Mueve x₀ para ver la pendiente en un punto; sube n para ver cómo los rectángulos se convierten en el área exacta.'),
    fn:       L('Function', 'Función'),
    deriv:    L('Derivative', 'Derivada'),
    integral: L('Integral (Riemann sum)', 'Integral (suma de Riemann)'),
    method:   L('Rectangle height from the', 'Altura del rectángulo desde el punto'),
    derivNote: L('The pink tangent line touches the curve at x₀; its slope is f′(x₀). Find where f′ = 0: those are exactly the peaks and valleys.',
                 'La tangente rosada toca la curva en x₀; su pendiente es f′(x₀). Busca dónde f′ = 0: son exactamente los picos y los valles.'),
    intNote:  L('Double n: left/right errors roughly halve, midpoint errors drop to about a quarter. Rectangles below the axis count as negative.',
                'Duplica n: los errores izquierdo/derecho se reducen a la mitad, los del punto medio a una cuarta parte. Los rectángulos bajo el eje cuentan como negativos.'),
    error:    L('error', 'error'),
  };

  const fmt = v => (Math.abs(v) < 5e-4 ? 0 : v).toFixed(3).replace('-', '−');

  return {
    name: TEXT.name,
    mount(el, ctx) {
      const { t, tr, Graph, onLang } = ctx;
      const state = { fi: 0, x0: FUNCS[0].start, n: 6, mi: 1 };

      el.innerHTML = `
        <div class="lab-head">
          <h2>${t(TEXT.name)}</h2>
          <p>${t(TEXT.sub)}</p>
        </div>
        <div class="lab-body">
          <div class="lab-svg-wrap" id="clabSvg"></div>
          <div class="lab-right">
            <div class="f-label">${t(TEXT.fn)}</div>
            <div class="lab-chips" id="clabFns">
              ${FUNCS.map((f, i) => `<button class="lab-chip${i ? '' : ' active'}" data-i="${i}">${f.label}</button>`).join('')}
            </div>

            <div class="lab-card">
              <div class="f-label">${t(TEXT.deriv)}</div>
              <div class="lab-slider">
                <label for="clab-x0">x₀</label>
                <input type="range" id="clab-x0" step="0.01">
                <output id="clab-x0-out"></output>
              </div>
              <div class="lab-readout" id="clabDeriv" style="margin-top:0.8rem"></div>
              <div class="f-desc" style="margin-top:0.7rem">${t(TEXT.derivNote)}</div>
            </div>

            <div class="lab-card">
              <div class="f-label">${t(TEXT.integral)}</div>
              <div class="f-desc" style="margin-bottom:0.45rem">${t(TEXT.method)}</div>
              <div class="lab-chips" id="clabMethods">
                ${METHODS.map((m, i) => `<button class="lab-chip${i === 1 ? ' active' : ''}" data-i="${i}">${t(m.name)}</button>`).join('')}
              </div>
              <div class="lab-slider" style="margin-top:0.8rem">
                <label for="clab-n">n</label>
                <input type="range" id="clab-n" min="1" max="50" step="1" value="6">
                <output id="clab-n-out">6</output>
              </div>
              <div class="lab-readout" id="clabInt" style="margin-top:0.8rem"></div>
              <div class="f-desc" style="margin-top:0.7rem">${t(TEXT.intNote)}</div>
            </div>
          </div>
        </div>`;

      const svgWrap = el.querySelector('#clabSvg');
      const x0Input = el.querySelector('#clab-x0');
      const x0Out   = el.querySelector('#clab-x0-out');
      const nInput  = el.querySelector('#clab-n');
      const nOut    = el.querySelector('#clab-n-out');

      function setupX0() {
        const F = FUNCS[state.fi];
        x0Input.min = F.x0[0]; x0Input.max = F.x0[1];
        x0Input.value = state.x0 = F.start;
      }

      function render() {
        const F = FUNCS[state.fi], M = METHODS[state.mi];
        const [a, b] = F.ab, n = state.n, dx = (b - a) / n;

        // Riemann sum
        let sum = 0;
        const g = Graph({ x: F.win.x, y: F.win.y, animate: false });
        g.grid(1).axes({ ticks: 1 });
        for (let i = 0; i < n; i++) {
          const xi = a + i * dx, h = F.f(M.at(xi, dx));
          sum += h * dx;
          g.rect(xi, 0, dx, h, { color: 2 });
        }
        g.vline(a, { ghost: true }).vline(b, { ghost: true });
        g.fn(F.f, { color: 1, samples: 500 });

        // Tangent line at x₀
        const x0 = state.x0, y0 = F.f(x0), m = F.df(x0);
        g.fn(x => y0 + m * (x - x0), { color: 3, thin: true });
        g.dot(x0, y0, { color: 1, r: 5.5 });
        svgWrap.innerHTML = g.svg();

        const exact = F.F(b) - F.F(a);
        const intercept = y0 - m * x0;
        x0Out.textContent = fmt(x0);
        el.querySelector('#clabDeriv').innerHTML =
          `f(x₀) = ${fmt(y0)}<br>f′(x) = ${F.dfText} → f′(x₀) = <b>${fmt(m)}</b><br>` +
          `<span style="font-size:0.8em;color:var(--muted)">y = ${fmt(m)}x ${intercept < 0 ? '−' : '+'} ${fmt(Math.abs(intercept))}</span>`;
        el.querySelector('#clabInt').innerHTML =
          `Σ = ${fmt(sum)}<br>∫<sub>${F.abText[0]}</sub><sup>${F.abText[1]}</sup> f(x) dx = <b>${fmt(exact)}</b><br>` +
          `<span style="font-size:0.8em;color:var(--muted)">${tr(TEXT.error)} = ${fmt(Math.abs(sum - exact))}</span>`;
      }

      x0Input.addEventListener('input', () => { state.x0 = +x0Input.value; render(); });
      nInput.addEventListener('input', () => { state.n = +nInput.value; nOut.textContent = state.n; render(); });

      el.querySelector('#clabFns').addEventListener('click', e => {
        const btn = e.target.closest('.lab-chip');
        if (!btn) return;
        state.fi = +btn.dataset.i;
        el.querySelectorAll('#clabFns .lab-chip').forEach(c => c.classList.toggle('active', c === btn));
        setupX0();
        render();
      });
      el.querySelector('#clabMethods').addEventListener('click', e => {
        const btn = e.target.closest('.lab-chip');
        if (!btn) return;
        state.mi = +btn.dataset.i;
        el.querySelectorAll('#clabMethods .lab-chip').forEach(c => c.classList.toggle('active', c === btn));
        render();
      });

      setupX0();
      render();
      onLang(render);   // readouts are rebuilt as plain text, so refresh them on EN/ES
    },
  };
})();

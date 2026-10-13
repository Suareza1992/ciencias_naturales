// ═══════════════════════════════════════════════════════════════════════════
// Pre-Calculus lab — the Function Transformer.
//
//   y = a · f( b(x − h) ) + k
//
// Pick a parent function, drag a, b, h, k, and watch the graph (gold) move
// away from the parent (grey). The list on the right explains every change
// in words. Mounted by shared/explorer.js into <section id="labSection">.
// ═══════════════════════════════════════════════════════════════════════════

const PRECALC_LAB = (() => {
  const L = (en, es) => ({ en, es });

  // Each parent: the function, how to print it around an inner expression,
  // an "anchor" point that is easy to track, and any asymptotes.
  const PARENTS = [
    { id: 'sq',   label: 'x²',    f: x => x * x,                       show: u => u === 'x' ? 'x²' : `(${u})²`,   anchor: [0, 0] },
    { id: 'cube', label: 'x³',    f: x => x ** 3,                      show: u => u === 'x' ? 'x³' : `(${u})³`,   anchor: [0, 0] },
    { id: 'sqrt', label: '√x',    f: x => x >= 0 ? Math.sqrt(x) : NaN, show: u => `√(${u})`,                   anchor: [0, 0] },
    { id: 'abs',  label: '|x|',   f: Math.abs,                         show: u => `|${u}|`,                     anchor: [0, 0] },
    { id: 'sin',  label: 'sin x', f: Math.sin,                         show: u => `sin(${u})`,                  anchor: [0, 0] },
    { id: 'exp',  label: 'eˣ',    f: Math.exp,                         show: u => `e^(${u})`,                   anchor: [0, 1], hAsym: 0 },
    { id: 'inv',  label: '1/x',   f: x => 1 / x,                       show: u => `1/(${u})`,                   anchor: null, hAsym: 0, vAsym: 0 },
  ];

  const TEXT = {
    name: L('Function Transformer', 'Transformador de Funciones'),
    sub:  L('Pick a parent function and drag the sliders. Every graph in Pre-Calculus is one of these parents, stretched, flipped and shifted.',
            'Elige una función madre y mueve los controles. Toda gráfica de Precálculo es una de estas funciones madre, estirada, volteada y desplazada.'),
    parent: L('Parent function', 'Función madre'),
    general: L('General form', 'Forma general'),
    whatHappened: L('What each number does', 'Qué hace cada número'),
    reset: L('Reset', 'Reiniciar'),
    order: L('Order matters: stretch and reflect first, shift last. Inside the parentheses everything works “backwards” — x − 2 moves the graph right.',
             'El orden importa: primero estirar y reflejar, al final desplazar. Dentro del paréntesis todo funciona “al revés” — x − 2 mueve la gráfica a la derecha.'),
  };

  const num = v => +v.toFixed(1);
  const fmtNum = v => String(num(v)).replace('-', '−');

  // Build the readable equation, e.g. y = 2(x − 1)² + 3
  function equation(p, a, b, h, k) {
    let inner = h === 0 ? 'x' : h > 0 ? `x − ${fmtNum(h)}` : `x + ${fmtNum(-h)}`;
    if (b !== 1) inner = b === -1 ? `−(${inner})` : `${fmtNum(b)}(${inner})`;
    let body = p.show(inner);
    if (a === 0) body = '0';
    else if (a === -1) body = '−' + body;
    else if (p.id === 'inv') body = `${fmtNum(a)}/(${inner})`;   // 2/(x − 1), not 2·1/(x − 1)
    else if (a !== 1) body = fmtNum(a) + '·' + body;
    const tail = k === 0 ? '' : k > 0 ? ` + ${fmtNum(k)}` : ` − ${fmtNum(-k)}`;
    return `y = ${body}${tail}`;
  }

  // One sentence per parameter that is not at its default
  function explain(a, b, h, k) {
    const out = [];
    if (a === 0) out.push(L('<b>a = 0</b> squashes everything flat: the graph becomes the line y = k.', '<b>a = 0</b> aplasta todo: la gráfica se vuelve la recta y = k.'));
    else {
      if (Math.abs(a) > 1) out.push(L(`<b>|a| = ${fmtNum(Math.abs(a))}</b> → vertical stretch: every height is multiplied by ${fmtNum(Math.abs(a))}.`,
                                      `<b>|a| = ${fmtNum(Math.abs(a))}</b> → estiramiento vertical: cada altura se multiplica por ${fmtNum(Math.abs(a))}.`));
      if (Math.abs(a) < 1) out.push(L(`<b>|a| = ${fmtNum(Math.abs(a))}</b> → vertical compression toward the x-axis.`,
                                      `<b>|a| = ${fmtNum(Math.abs(a))}</b> → compresión vertical hacia el eje x.`));
      if (a < 0) out.push(L('<b>a < 0</b> → reflection across the x-axis (upside down).', '<b>a < 0</b> → reflexión sobre el eje x (de cabeza).'));
    }
    if (Math.abs(b) > 1) out.push(L(`<b>|b| = ${fmtNum(Math.abs(b))}</b> → horizontal compression by a factor of 1/${fmtNum(Math.abs(b))} (the graph gets narrower).`,
                                    `<b>|b| = ${fmtNum(Math.abs(b))}</b> → compresión horizontal por un factor de 1/${fmtNum(Math.abs(b))} (la gráfica se angosta).`));
    if (Math.abs(b) < 1) out.push(L(`<b>|b| = ${fmtNum(Math.abs(b))}</b> → horizontal stretch (the graph gets wider).`,
                                    `<b>|b| = ${fmtNum(Math.abs(b))}</b> → estiramiento horizontal (la gráfica se ensancha).`));
    if (b < 0) out.push(L('<b>b < 0</b> → reflection across the y-axis (left ↔ right).', '<b>b < 0</b> → reflexión sobre el eje y (izquierda ↔ derecha).'));
    if (h > 0) out.push(L(`<b>h = ${fmtNum(h)}</b> → shift <b>right</b> ${fmtNum(h)}. (It appears as “x − ${fmtNum(h)}”.)`,
                          `<b>h = ${fmtNum(h)}</b> → desplazamiento a la <b>derecha</b> ${fmtNum(h)}. (Aparece como “x − ${fmtNum(h)}”.)`));
    if (h < 0) out.push(L(`<b>h = ${fmtNum(h)}</b> → shift <b>left</b> ${fmtNum(-h)}. (It appears as “x + ${fmtNum(-h)}”.)`,
                          `<b>h = ${fmtNum(h)}</b> → desplazamiento a la <b>izquierda</b> ${fmtNum(-h)}. (Aparece como “x + ${fmtNum(-h)}”.)`));
    if (k > 0) out.push(L(`<b>k = ${fmtNum(k)}</b> → shift <b>up</b> ${fmtNum(k)}.`, `<b>k = ${fmtNum(k)}</b> → desplazamiento hacia <b>arriba</b> ${fmtNum(k)}.`));
    if (k < 0) out.push(L(`<b>k = ${fmtNum(k)}</b> → shift <b>down</b> ${fmtNum(-k)}.`, `<b>k = ${fmtNum(k)}</b> → desplazamiento hacia <b>abajo</b> ${fmtNum(-k)}.`));
    if (!out.length) out.push(L('All values at their defaults — this is the parent function itself. Move a slider!', 'Todos los valores por defecto — esta es la función madre. ¡Mueve un control!'));
    return out;
  }

  return {
    name: TEXT.name,
    mount(el, ctx) {
      const { t, setT, Graph } = ctx;
      const state = { p: PARENTS[0], a: 1, b: 1, h: 0, k: 0 };

      const slider = (key, min, max, val) => `
        <div class="lab-slider">
          <label for="lab-${key}">${key}</label>
          <input type="range" id="lab-${key}" min="${min}" max="${max}" step="0.1" value="${val}">
          <output id="lab-${key}-out">${val}</output>
        </div>`;

      el.innerHTML = `
        <div class="lab-head">
          <h2>${t(TEXT.name)}</h2>
          <p>${t(TEXT.sub)}</p>
        </div>
        <div class="lab-body">
          <div class="lab-svg-wrap" id="labSvg"></div>
          <div class="lab-right">
            <div class="f-label">${t(TEXT.parent)}</div>
            <div class="lab-chips" id="labChips">
              ${PARENTS.map((p, i) => `<button class="lab-chip${i ? '' : ' active'}" data-i="${i}">${p.label}</button>`).join('')}
            </div>
            <div class="lab-readout" id="labEq"></div>
            ${slider('a', -3, 3, 1)}
            ${slider('b', -3, 3, 1)}
            ${slider('h', -4, 4, 0)}
            ${slider('k', -4, 4, 0)}
            <div class="lab-card">
              <div class="f-label">${t(TEXT.general)}</div>
              <div class="f-expr">y = a · f(b(x − h)) + k</div>
              <div class="f-desc">${t(TEXT.order)}</div>
            </div>
            <div class="lab-card">
              <div class="f-label">${t(TEXT.whatHappened)}</div>
              <ul class="lab-explain" id="labExplain"></ul>
            </div>
            <div><button class="lab-chip" id="labReset">${t(TEXT.reset)}</button></div>
          </div>
        </div>`;

      const svgWrap = el.querySelector('#labSvg');
      const eqEl    = el.querySelector('#labEq');
      const listEl  = el.querySelector('#labExplain');

      function render() {
        const { p, a, b, h, k } = state;
        const T = x => a * p.f(b * (x - h)) + k;
        const g = Graph({ x: [-6, 6], y: [-6, 6], animate: false });
        g.grid(1).axes({ ticks: 2 });
        // Asymptotes move with the transformation too
        if (p.hAsym != null) g.hline(a * p.hAsym + k, { color: 2 });
        if (p.vAsym != null) g.vline(h + p.vAsym / b, { color: 2 });
        g.fn(p.f, { ghost: true, samples: 500 });
        g.fn(T, { color: 1, samples: 500 });
        if (p.anchor) {
          // The parent's anchor (x₀, y₀) lands at (x₀/b + h, a·y₀ + k)
          const [x0, y0] = p.anchor;
          g.dot(x0, y0, { color: 2, r: 3.5 });
          g.dot(x0 / b + h, a * y0 + k, { color: 1, r: 5 });
        } else {
          g.dot(h, k, { color: 1, r: 4, hollow: true });
        }
        svgWrap.innerHTML = g.svg();
        eqEl.textContent = equation(p, a, b, h, k);
        listEl.innerHTML = '';
        explain(a, b, h, k).forEach(item => {
          const li = document.createElement('li');
          setT(li, item);
          listEl.appendChild(li);
        });
      }

      ['a', 'b', 'h', 'k'].forEach(key => {
        const input = el.querySelector('#lab-' + key);
        const out   = el.querySelector(`#lab-${key}-out`);
        input.addEventListener('input', () => {
          let v = num(+input.value);
          if (key === 'b' && v === 0) v = 0.1; // b = 0 would erase x entirely
          state[key] = v;
          out.textContent = fmtNum(v);
          render();
        });
      });

      el.querySelector('#labChips').addEventListener('click', e => {
        const btn = e.target.closest('.lab-chip');
        if (!btn) return;
        state.p = PARENTS[+btn.dataset.i];
        el.querySelectorAll('#labChips .lab-chip').forEach(c => c.classList.toggle('active', c === btn));
        render();
      });

      el.querySelector('#labReset').addEventListener('click', () => {
        Object.assign(state, { a: 1, b: 1, h: 0, k: 0 });
        ['a', 'b', 'h', 'k'].forEach(key => {
          el.querySelector('#lab-' + key).value = state[key];
          el.querySelector(`#lab-${key}-out`).textContent = state[key];
        });
        render();
      });

      render();
    },
  };
})();

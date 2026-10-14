// ═══════════════════════════════════════════════════════════════════════════
// matrix-practice.js — fill-in-the-matrix exercises (used by Linear Algebra).
//
// Exercises are not written by hand: every topic has three GENERATORS
// (easy / medium / hard). A generator receives a seeded random source and
// returns one exercise with its numbers, its answer matrix and every step
// of the solution. Same seed → same exercise, so the page is stable on
// reload; "New ↻" just changes the seed.
//
// An exercise looks like:
//   {
//     prompt: L('Multiply A · B.', 'Multiplica A · B.'),
//     lhs:    [ { label: 'A', m: [[1, 2], [3, 4]] }, '·', { label: 'B', m: … } ],
//     answer: { label: 'A·B', m: [[…]], blanks?: [[true, false], …] },
//     steps:  [ L('…', '…'), { t: L('…', '…'), m: [[…]] }, … ],
//     tol?:   0.015,
//   }
// Matrix entries can be plain numbers or exact fractions (MX.Fr).
// ═══════════════════════════════════════════════════════════════════════════

const MX = (() => {

  // ─── Exact fractions ──────────────────────────────────────────────────────
  // Steps like "R₂ → R₂ − (3/2)R₁" must stay exact, so the solvers work with
  // fractions and only turn them into decimals when checking an answer.
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };

  class Fr {
    constructor(n, d = 1) {
      if (d === 0) throw new Error('division by zero');
      if (d < 0) { n = -n; d = -d; }
      const g = gcd(n, d);
      this.n = n / g; this.d = d / g;
    }
    add(o) { o = fr(o); return new Fr(this.n * o.d + o.n * this.d, this.d * o.d); }
    sub(o) { o = fr(o); return new Fr(this.n * o.d - o.n * this.d, this.d * o.d); }
    mul(o) { o = fr(o); return new Fr(this.n * o.n, this.d * o.d); }
    div(o) { o = fr(o); return new Fr(this.n * o.d, this.d * o.n); }
    neg()  { return new Fr(-this.n, this.d); }
    isZero() { return this.n === 0; }
    val()  { return this.n / this.d; }
  }
  const fr  = x => x instanceof Fr ? x : new Fr(Math.round(x), 1);
  const val = x => x instanceof Fr ? x.val() : x;

  // ─── Formatting ───────────────────────────────────────────────────────────
  const MINUS = '−';
  // Numbers print as integers, exact fractions, or (for √ values) 2-3 decimals
  function num(x) {
    if (x instanceof Fr) {
      if (x.d === 1) return (x.n < 0 ? MINUS : '') + Math.abs(x.n);
      return (x.n < 0 ? MINUS : '') + Math.abs(x.n) + '/' + x.d;
    }
    if (Object.is(x, -0) || Math.abs(x) < 1e-9) return '0';
    if (Number.isInteger(x)) return (x < 0 ? MINUS : '') + Math.abs(x);
    const r = Math.round(x * 1000) / 1000;
    if (Number.isInteger(r)) return (r < 0 ? MINUS : '') + Math.abs(r);
    return (r < 0 ? MINUS : '') + String(Math.abs(r));
  }
  // Parenthesize negatives inside sums: 3 + (−2)
  const p = x => (val(x) < 0 ? `(${num(x)})` : num(x));
  const vec = a => `(${a.map(num).join(', ')})`;
  const SUB = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
  const sub = (...ij) => ij.map(i => SUB[i]).join('');

  // ─── Matrix helpers (work on numbers or Fr) ───────────────────────────────
  const col = a => a.map(x => [x]);
  const T   = m => m[0].map((_, j) => m.map(r => r[j]));
  const isFr = x => x instanceof Fr;
  const add = (a, b) => (isFr(a) || isFr(b)) ? fr(a).add(b) : a + b;
  const mul = (a, b) => (isFr(a) || isFr(b)) ? fr(a).mul(b) : a * b;
  const matmul = (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, a, k) => add(s, mul(a, B[k][j])), 0)));
  const det2 = m => m[0][0] * m[1][1] - m[0][1] * m[1][0];
  const det3 = m =>
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
    - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
    + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const minor = (m, i, j) => m.filter((_, r) => r !== i).map(r => r.filter((_, c) => c !== j));
  const ident = n => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  const dot = (u, v) => u.reduce((s, x, i) => s + x * v[i], 0);
  const cross = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  // Clean −0 and float noise from cos/sin of right angles
  const clean = x => (Math.abs(x - Math.round(x)) < 1e-9 ? Math.round(x) + 0 : x);

  // ─── Seeded randomness ────────────────────────────────────────────────────
  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function mulberry32(a) {
    return () => {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function Rand(seed) {
    const next = mulberry32(seed);
    const r = {
      next,
      int: (a, b) => a + Math.floor(next() * (b - a + 1)),
      nz: (a, b) => { let v; do v = r.int(a, b); while (v === 0); return v; },
      pick: arr => arr[Math.floor(next() * arr.length)],
      sign: () => (next() < 0.5 ? -1 : 1),
      shuffle: arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
      vec: (n, a, b) => Array.from({ length: n }, () => r.int(a, b)),
      mat: (rows, cols, a, b) => Array.from({ length: rows }, () => r.vec(cols, a, b)),
    };
    return r;
  }

  // ─── Rendering a matrix ───────────────────────────────────────────────────
  // inputs: optional mask; true = blank the student fills in
  function matHTML(m, { inputs = null, aug = false, small = false } = {}) {
    const cols = m[0].length;
    let cells = '';
    m.forEach((row, i) => row.forEach((x, j) => {
      const sep = aug && j === cols - 1 ? ' aug' : '';
      if (inputs && inputs[i][j]) {
        cells += `<input class="mx-cell mx-in${sep}" data-i="${i}" data-j="${j}" inputmode="text" autocomplete="off" spellcheck="false" aria-label="row ${i + 1} column ${j + 1}">`;
      } else {
        cells += `<span class="mx-cell${inputs ? ' mx-given' : ''}${sep}">${num(x)}</span>`;
      }
    }));
    return `<span class="mx${small ? ' small' : ''}" style="--cols:${cols}">${cells}</span>`;
  }

  // ─── The practice UI ──────────────────────────────────────────────────────
  const UI = {
    all:     { en: 'All', es: 'Todos' },
    easy:    { en: 'Easy', es: 'Fácil' },
    medium:  { en: 'Medium', es: 'Medio' },
    hard:    { en: 'Hard', es: 'Difícil' },
    show:    { en: 'Show', es: 'Mostrar' },
    check:   { en: 'Check', es: 'Verificar' },
    reveal:  { en: 'Show answer', es: 'Ver respuesta' },
    steps:   { en: 'Show steps', es: 'Ver pasos' },
    hide:    { en: 'Hide steps', es: 'Ocultar pasos' },
    fresh:   { en: 'New ↻', es: 'Nuevo ↻' },
    more:    { en: '+ More exercises', es: '+ Más ejercicios' },
    correct: { en: '✓ Correct!', es: '✓ ¡Correcto!' },
    some:    { en: '✗ Some entries are wrong — red cells', es: '✗ Algunas entradas están mal — celdas rojas' },
    empty:   { en: '? Fill every blank cell', es: '? Llena todas las celdas vacías' },
    revealed:{ en: 'Answer shown — try a New one!', es: 'Respuesta mostrada — ¡prueba uno Nuevo!' },
    howTo:   { en: 'How to calculate it', es: 'Cómo se calcula' },
    ex:      { en: 'Ex.', es: 'Ej.' },
  };

  function practice(generators, { perLevel = 4 } = {}) {
    return {
      mount(container, ctx) {
        const { t, setT, parseAnswer } = ctx;
        const status = new Map();   // card id → 'correct' | 'tried' | 'revealed'
        let cardCounter = 0;
        const updateScore = () => {
          const vals = [...status.values()];
          ctx.setScore(vals.filter(v => v === 'correct').length, vals.length);
        };

        // Difficulty filter
        const bar = document.createElement('div');
        bar.className = 'mx-filter';
        bar.innerHTML = ['all', 'easy', 'medium', 'hard']
          .map((d, i) => `<button class="lab-chip${i ? '' : ' active'}" data-f="${d}">${t(UI[d])}</button>`).join('');
        container.before(bar);
        bar.addEventListener('click', e => {
          const b = e.target.closest('button'); if (!b) return;
          bar.querySelectorAll('button').forEach(x => x.classList.toggle('active', x === b));
          container.dataset.filter = b.dataset.f;
        });
        container.dataset.filter = 'all';

        function buildCard(topic, diff, index, nonce = 0) {
          const gen = generators[topic.id]?.[diff];
          const seed = hash(`${topic.id}|${diff}|${index}|${nonce}`);
          // A generator may reject a random draw (e.g. det = 0) by returning null
          let ex = null;
          for (let k = 0; !ex && k < 50; k++) ex = gen(Rand(seed + k * 7919));

          const id = 'mx' + (++cardCounter);
          const ans = ex.answer.m;
          const rows = ans.length, cols = ans[0].length, cells = rows * cols;
          // Default blanks: easy keeps ~40% of the cells as hints, medium ~20%, hard none
          let blanks = ex.answer.blanks;
          if (!blanks) {
            const keep = cells < 2 ? 0 : Math.floor(cells * ({ easy: 0.4, medium: 0.2, hard: 0 })[diff]);
            const r = Rand(seed + 1);
            const order = r.shuffle([...Array(cells).keys()]);
            const given = new Set(order.slice(0, keep));
            blanks = ans.map((row, i) => row.map((_, j) => !given.has(i * cols + j)));
          }

          const lhs = (ex.lhs ?? []).map(item => typeof item === 'string'
            ? `<span class="mx-op">${item}</span>`
            : `<span class="mx-term">${matHTML(item.m, { aug: item.aug })}${item.label ? `<span class="mx-label">${item.label}</span>` : ''}</span>`
          ).join('');

          const card = document.createElement('div');
          card.className = 'mx-card';
          card.dataset.diff = diff;
          card.innerHTML = `
            <div class="mx-head">
              <span class="mx-badge ${diff}">${t(UI[diff])}</span>
              <span class="ex-num">${t(UI.ex)} ${index + 1}</span>
            </div>
            <div class="ex-question">${t(ex.prompt)}</div>
            <div class="mx-eq">
              ${lhs}
              ${lhs ? '<span class="mx-op">=</span>' : ''}
              <span class="mx-term mx-answer">${matHTML(ans, { inputs: blanks })}${ex.answer.label ? `<span class="mx-label">${ex.answer.label}</span>` : ''}</span>
            </div>
            <div class="ex-row mx-actions">
              <button class="ex-btn" data-act="check">${t(UI.check)}</button>
              <button class="ex-btn ghost" data-act="reveal">${t(UI.reveal)}</button>
              <button class="ex-btn ghost" data-act="steps">${t(UI.steps)}</button>
              <button class="ex-btn ghost" data-act="new">${t(UI.fresh)}</button>
              <span class="ex-feedback"></span>
            </div>
            <div class="mx-steps" hidden>
              <div class="f-label">${t(UI.howTo)}</div>
              <ol class="dd-steps">${ex.steps.map(s => {
                if (typeof s === 'string' || s.en) return `<li>${t(s)}</li>`;
                return `<li>${t(s.t)}${s.m ? `<div class="mx-step-m">${matHTML(s.m, { small: true, aug: s.aug })}</div>` : ''}</li>`;
              }).join('')}</ol>
            </div>`;

          const fb = card.querySelector('.ex-feedback');
          const inputs = [...card.querySelectorAll('.mx-in')];
          const tol = ex.tol ?? 0.015;
          const isRight = (v, a) => Math.abs(v - val(a)) <= Math.max(tol, Math.abs(val(a)) * 1e-4);

          function check() {
            if (card.classList.contains('done')) return;
            let filled = true, allOk = true;
            inputs.forEach(inp => {
              const v = parseAnswer(inp.value);
              inp.classList.remove('ok', 'bad');
              if (Number.isNaN(v)) { filled = false; allOk = false; return; }
              const ok = isRight(v, ans[+inp.dataset.i][+inp.dataset.j]);
              inp.classList.add(ok ? 'ok' : 'bad');
              if (!ok) allOk = false;
            });
            if (!filled && inputs.every(i => !i.classList.contains('bad'))) {
              setT(fb, UI.empty); fb.className = 'ex-feedback err'; return;
            }
            if (allOk) {
              setT(fb, UI.correct); fb.className = 'ex-feedback ok';
              card.classList.add('correct', 'done'); card.classList.remove('wrong');
              inputs.forEach(i => (i.disabled = true));
              card.querySelector('[data-act="check"]').disabled = true;
              card.querySelector('[data-act="reveal"]').disabled = true;
              status.set(id, 'correct');
            } else {
              setT(fb, UI.some); fb.className = 'ex-feedback err';
              card.classList.add('wrong');
              if (!status.has(id)) status.set(id, 'tried');
            }
            updateScore();
          }

          card.addEventListener('click', e => {
            const act = e.target.closest('button')?.dataset.act;
            if (!act) return;
            if (act === 'check') check();
            if (act === 'reveal') {
              inputs.forEach(inp => {
                inp.value = num(ans[+inp.dataset.i][+inp.dataset.j]);
                inp.classList.remove('bad'); inp.classList.add('shown'); inp.disabled = true;
              });
              card.classList.add('done', 'revealed'); card.classList.remove('wrong');
              card.querySelector('[data-act="check"]').disabled = true;
              e.target.closest('button').disabled = true;
              setT(fb, UI.revealed); fb.className = 'ex-feedback';
              if (status.get(id) !== 'correct') status.set(id, 'revealed');
              card.querySelector('.mx-steps').hidden = false;
              setT(card.querySelector('[data-act="steps"]'), UI.hide);
              updateScore();
            }
            if (act === 'steps') {
              const panel = card.querySelector('.mx-steps');
              panel.hidden = !panel.hidden;
              setT(e.target.closest('button'), panel.hidden ? UI.steps : UI.hide);
            }
            if (act === 'new') {
              const fresh = buildCard(topic, diff, index, nonce + 1);
              card.replaceWith(fresh);
              fresh.querySelector('.mx-in')?.focus();
            }
          });
          card.addEventListener('keydown', e => {
            if (e.key === 'Enter' && e.target.classList.contains('mx-in')) check();
          });
          return card;
        }

        ctx.onLang(() => {}); // labels are data-t spans; nothing to rebuild

        // One group per topic: perLevel easy, then medium, then hard
        (ctx.topics ?? []).forEach(topic => {
          if (!generators[topic.id]) return;
          const group = document.createElement('div');
          group.className = 'ex-group';
          group.id = 'ex-group-' + topic.id;
          group.innerHTML = `
            <div class="ex-group-header">
              <div class="ex-shape-dot" style="background:${topic.color};box-shadow:0 0 8px ${topic.color}"></div>
              <span class="ex-group-title">${t(topic.name)}</span>
            </div>`;
          const list = document.createElement('div');
          list.className = 'mx-list';
          let count = { easy: 0, medium: 0, hard: 0 };
          const addCard = diff => list.appendChild(buildCard(topic, diff, count[diff]++));
          ['easy', 'medium', 'hard'].forEach(d => { for (let i = 0; i < perLevel; i++) addCard(d); });
          group.appendChild(list);

          const more = document.createElement('button');
          more.className = 'lab-chip mx-more';
          more.innerHTML = t(UI.more);
          more.addEventListener('click', () => ['easy', 'medium', 'hard'].forEach(addCard));
          group.appendChild(more);
          container.appendChild(group);
        });
        updateScore();
      },
    };
  }

  return { Fr, fr, val, num, p, vec, sub, col, T, matmul, det2, det3, minor, ident, dot, cross, clean, Rand, matHTML, practice };
})();

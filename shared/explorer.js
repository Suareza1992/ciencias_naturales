// ═══════════════════════════════════════════════════════════════════════════
// explorer.js — the engine behind precalculus.html and calculus.html.
//
// A subject page only supplies DATA:
//
//   Explorer.init({
//     subject: 'precalc',
//     ui:      { title, eyebrow, heroSub, footer, ... },   // {en, es} values
//     topics:  [ { id, color, name, tag, graph, formulas, deep, exercises } ],
//     lab:     { name, sub, mount(el, ctx) },
//   });
//
// …and this file builds everything the geometry page builds by hand: hero,
// sticky topic sections, Deep Dives, the lab, exercises, the menu, EN/ES.
//
// Bilingual text: any value can be a plain string (same in both languages)
// or an object { en: '…', es: '…' }. Inside text, `backticks` mark inline
// math and become <span class="m">…</span>.
// ═══════════════════════════════════════════════════════════════════════════

const Explorer = (() => {
  const LANG_KEY = 'geometry-explorer-lang';

  // Text shared by every subject page
  const UI = {
    topicsTab:  { en: 'Topics', es: 'Temas' },
    exTab:      { en: 'Exercises', es: 'Ejercicios' },
    langLabel:  { en: 'Language', es: 'Idioma' },
    scrollCta:  { en: 'Scroll to begin', es: 'Desplázate para comenzar' },
    deepDive:   { en: 'Deep Dive', es: 'A Fondo' },
    deepLink:   { en: 'Deep dive ↓', es: 'A fondo ↓' },
    idea:       { en: 'The Big Idea', es: 'La Idea Central' },
    why:        { en: 'Why It Works', es: 'Por Qué Funciona' },
    example:    { en: 'Worked Example', es: 'Ejemplo Resuelto' },
    mistakes:   { en: 'Common Mistakes', es: 'Errores Comunes' },
    real:       { en: 'Where You’ll See It', es: 'Dónde Lo Verás' },
    answer:     { en: 'Answer', es: 'Respuesta' },
    exTitle:    { en: 'Exercises', es: 'Ejercicios' },
    exSub:      { en: 'Enter a number and press Check. Decimals, fractions like 3/4 and π (type pi, e.g. 2pi or pi/3) are all accepted. A hint appears after two misses.',
                  es: 'Escribe un número y presiona Verificar. Se aceptan decimales, fracciones como 3/4 y π (escribe pi, p. ej. 2pi o pi/3). Aparece una pista después de dos intentos fallidos.' },
    check:      { en: 'Check', es: 'Verificar' },
    correct:    { en: '✓ Correct!', es: '✓ ¡Correcto!' },
    wrong:      { en: '✗ Try again', es: '✗ Inténtalo de nuevo' },
    notNumber:  { en: '? Enter a number', es: '? Escribe un número' },
    hint:       { en: 'Hint', es: 'Pista' },
    scoreLabel: { en: 'correct', es: 'correctas' },
    ex:         { en: 'Ex.', es: 'Ej.' },
    menu:       { en: 'Menu', es: 'Menú' },
    close:      { en: 'Close menu', es: 'Cerrar menú' },
    top:        { en: 'Back to top', es: 'Volver arriba' },
    next:       { en: 'Next subject', es: 'Siguiente materia' },
  };

  const SUBJECTS = [
    { id: 'geo',     href: 'index.html',       name: { en: 'Geometry',     es: 'Geometría' } },
    { id: 'precalc', href: 'precalculus.html', name: { en: 'Pre-Calculus', es: 'Precálculo' } },
    { id: 'calc',    href: 'calculus.html',    name: { en: 'Calculus',     es: 'Cálculo' } },
    { id: 'linalg',  href: 'linear-algebra.html', name: { en: 'Linear Algebra', es: 'Álgebra Lineal' } },
  ];

  let lang = 'en';
  let cfg  = null;

  // ─── i18n helpers ─────────────────────────────────────────────────────────
  // Every translatable string is stored once in I18N and rendered as
  // <span data-t="index">. Switching language just re-fills those spans,
  // so nothing is rebuilt and exercise state / animations are untouched.
  const I18N = [];
  const tr  = v => v == null ? '' : typeof v === 'string' ? v : (v[lang] ?? v.en);
  const fmt = s => String(s).replace(/`([^`]+)`/g, '<span class="m">$1</span>');
  const t   = v => { I18N.push(v); return `<span data-t="${I18N.length - 1}">${fmt(tr(v))}</span>`; };
  function setT(el, v) { I18N.push(v); el.dataset.t = I18N.length - 1; el.innerHTML = fmt(tr(v)); }

  function hexToRgb(hex) {
    return [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  }
  function rgba(hex, a) { const [r, g, b] = hexToRgb(hex); return `rgba(${r},${g},${b},${a})`; }
  const pad2 = n => String(n).padStart(2, '0');

  // ─── Page skeleton ────────────────────────────────────────────────────────
  function buildPage() {
    const app = document.getElementById('app');
    const u = cfg.ui;
    // Subjects run Geometry → Pre-Calculus → Calculus; link to the next one
    const nextSubject = SUBJECTS[SUBJECTS.findIndex(s => s.id === cfg.subject) + 1];
    app.innerHTML = `
      <button class="nav-btn" id="navBtn" aria-label="${tr(UI.menu)}"><span></span><span></span></button>

      <div class="nav-overlay" id="navOverlay">
        <div class="nav-backdrop" id="navBackdrop"></div>
        <div class="nav-panel">
          <div class="nav-left">
            <div class="nav-left-inner">
              ${cfg.navGlyph ?? ''}
              <span class="nav-left-title">${t(u.navTitle ?? u.title)}</span>
            </div>
          </div>
          <div class="nav-right">
            <div class="nav-top">
              <div class="subject-switch">
                ${SUBJECTS.map(s => `<a href="${s.href}" class="${s.id === cfg.subject ? 'current' : ''}">${t(s.name)}</a>`).join('')}
              </div>
              <button class="nav-close" id="navClose" aria-label="${tr(UI.close)}">✕</button>
            </div>
            <div class="nav-tabs">
              <button class="nav-tab-btn active" data-tab="topics">${t(UI.topicsTab)}</button>
              <button class="nav-tab-btn" data-tab="exercises">${t(UI.exTab)}</button>
            </div>
            <nav class="nav-list" id="navListTopics"></nav>
            <nav class="nav-list hidden" id="navListExercises"></nav>
            <div class="nav-lang">
              <span class="nav-lang-label">${t(UI.langLabel)}</span>
              <button class="nav-lang-btn" data-lang="en">EN</button>
              <button class="nav-lang-btn" data-lang="es">ES</button>
            </div>
          </div>
        </div>
      </div>

      <main>
        <section class="hero">
          ${cfg.heroCurve ? `<svg class="hero-curve" viewBox="0 0 1200 400" preserveAspectRatio="none">${cfg.heroCurve.replace(/<path /g, '<path pathLength="1" ')}</svg>` : ''}
          <p class="eyebrow">${t(u.eyebrow)}</p>
          <h1>${t(u.title)}</h1>
          <p class="hero-sub">${t(u.heroSub)}</p>
          <div class="scroll-cta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            ${t(UI.scrollCta)}
          </div>
        </section>

        <div id="topicsContainer"></div>
        ${cfg.lab ? `<section class="lab-section" id="labSection"></section>` : ''}

        <section class="exercises-section" id="exercisesSection">
          <div class="exercises-header">
            <div class="exercises-header-text">
              <h2>${t(UI.exTitle)}</h2>
              <p>${t(u.exSub ?? UI.exSub)}</p>
            </div>
            <div class="score-pill">
              <span class="score-correct" id="scoreCorrect">0</span>
              <span class="score-sep">/</span>
              <span class="score-total" id="scoreTotal">0</span>
              <span class="score-label">${t(UI.scoreLabel)}</span>
            </div>
          </div>
          <div id="exercisesContainer"></div>
        </section>

        ${nextSubject ? `
        <div class="subject-next">
          <a href="${nextSubject.href}"><span class="next-eyebrow">${t(UI.next)}</span>${t(nextSubject.name)} →</a>
        </div>` : ''}

        <footer>${t(u.footer)}</footer>
      </main>

      <button class="back-top" id="backTop" aria-label="${tr(UI.top)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
      </button>`;
  }

  // ─── Topic sections + Deep Dives ──────────────────────────────────────────
  function buildTopics() {
    const container = document.getElementById('topicsContainer');
    const total = cfg.topics.length;

    cfg.topics.forEach((topic, idx) => {
      const section = document.createElement('section');
      section.className = 'topic-section';
      section.id = 'topic-' + topic.id;
      section.dataset.idx = idx;

      const formulaCards = topic.formulas.map(f => `
        <div class="formula-card">
          <div class="f-label">${t(f.label)}</div>
          <div class="f-expr">${f.expr}</div>
          <div class="f-desc">${t(f.desc)}</div>
        </div>`).join('');

      section.innerHTML = `
        <div class="sticky-wrapper">
          <div class="graph-display">
            <div class="topic-label">
              <div class="topic-tag">${t(topic.tag)}</div>
              <h2>${t(topic.name)}</h2>
            </div>
            <div class="graph-canvas"><div class="graph-inner">${topic.graph()}</div></div>
            <div class="topic-counter">${pad2(idx + 1)} / ${pad2(total)}</div>
            ${topic.deep ? `<a class="dive-link" href="#dive-${topic.id}">${t(UI.deepLink)}</a>` : ''}
          </div>
          <div class="formula-panel">${formulaCards}</div>
        </div>`;
      container.appendChild(section);

      // Atmospheric tint, blending into the next topic's color (as in geometry)
      const cur  = topic.color;
      const next = cfg.topics[idx + 1]?.color ?? cur;
      section.querySelector('.sticky-wrapper').style.backgroundImage =
        `radial-gradient(ellipse 55% 40% at 25% 50%, ${rgba(cur, 0.075)} 0%, transparent 70%),` +
        `linear-gradient(to bottom, ${rgba(cur, 0.045)} 0%, ${rgba(next, 0.045)} 100%)`;

      if (topic.deep) container.appendChild(buildDeepDive(topic, idx));
    });

    // Prime every drawable path: dash = offset = its own length (hidden).
    // Adding .in-view later transitions the offset to 0 → the line draws itself.
    requestAnimationFrame(() => {
      document.querySelectorAll('.topic-section .g-draw').forEach(path => {
        if (!path.getTotalLength) return;
        const len = Math.ceil(path.getTotalLength()) + 1;
        path.style.strokeDasharray  = len;
        path.style.strokeDashoffset = len;
      });
    });
  }

  function buildDeepDive(topic, idx) {
    const d = topic.deep;
    const el = document.createElement('article');
    el.className = 'deep-dive';
    el.id = 'dive-' + topic.id;

    const paras = arr => (arr ?? []).map(p => `<p>${t(p)}</p>`).join('');
    const items = arr => (arr ?? []).map(p => `<li>${t(p)}</li>`).join('');

    el.innerHTML = `
      <div class="dd-inner">
        <div class="dd-eyebrow">${t(UI.deepDive)} · ${pad2(idx + 1)}</div>
        <h2 class="dd-title">${t(topic.name)}</h2>
        <div class="dd-grid">
          <div class="dd-block idea wide"><h3>${t(UI.idea)}</h3>${paras(d.idea)}</div>
          ${d.why ? `<div class="dd-block why"><h3>${t(UI.why)}</h3>${paras(d.why)}</div>` : ''}
          ${d.mistakes ? `<div class="dd-block mistakes"><h3>${t(UI.mistakes)}</h3><ul>${items(d.mistakes)}</ul></div>` : ''}
          ${d.example ? `
          <div class="dd-block example wide">
            <h3>${t(UI.example)}</h3>
            <div class="dd-prompt">${t(d.example.prompt)}</div>
            <ol class="dd-steps">${items(d.example.steps)}</ol>
            <div class="dd-answer">${t(UI.answer)}: ${t(d.example.answer)}</div>
          </div>` : ''}
          ${d.real ? `<div class="dd-block real wide"><h3>${t(UI.real)}</h3>${paras(d.real)}</div>` : ''}
        </div>
      </div>`;
    return el;
  }

  // ─── Scroll: draw graphs + reveal formulas (same math as geometry) ────────
  const mobileQuery = window.matchMedia('(max-width: 860px)');
  function onScroll() {
    const vh = window.innerHeight;
    document.querySelectorAll('.topic-section').forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < vh * 0.72 && rect.bottom > 0) {
        section.classList.add('in-view');
        // 260vh section → 160vh of scroll budget → progress 0…1.
        // On mobile, sections are natural height (no sticky), so show every card.
        const scrollable = rect.height - vh;
        const progress = (scrollable > 0 && !mobileQuery.matches)
          ? Math.max(0, Math.min(1, -rect.top / scrollable)) : 1;
        const cards = section.querySelectorAll('.formula-card');
        cards.forEach((card, i) => {
          card.classList.toggle('visible', progress >= (i + 1) / (cards.length + 1) - 0.1);
        });
      }
    });
    document.getElementById('backTop').classList.toggle('visible', window.scrollY > vh * 1.5);
  }

  // ─── Mouse parallax (identical idea to geometry) ──────────────────────────
  function setupParallax() {
    let raf = null, mx = innerWidth / 2, my = innerHeight / 2;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    function apply() {
      raf = null;
      const nx = (mx - innerWidth / 2) / (innerWidth / 2);
      const ny = (my - innerHeight / 2) / (innerHeight / 2);
      document.querySelectorAll('.topic-section.in-view .graph-inner').forEach(inner => {
        const r = inner.closest('.topic-section').getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0)
          inner.style.transform = `rotateX(${-ny * 10}deg) rotateY(${nx * 10}deg)`;
      });
    }
  }

  // ─── Exercises ────────────────────────────────────────────────────────────
  const answered = new Map(); // "topicId-i" → true | false

  // Accepts 3, -2.5, 3,5, 3/4, pi, 2pi, -pi/3, π/2
  function parseAnswer(raw) {
    let s = raw.trim().toLowerCase().replace(/\s+/g, '').replace(/,/g, '.').replace(/[−–]/g, '-').replace(/pi/g, 'π');
    const m = s.match(/^([+-]?)(\d*\.?\d*)(π?)(?:\/(\d*\.?\d+))?$/);
    if (!m || (!m[2] && !m[3])) return NaN;
    let v = m[2] ? parseFloat(m[2]) : 1;
    if (m[3]) v *= Math.PI;
    if (m[4]) v /= parseFloat(m[4]);
    return m[1] === '-' ? -v : v;
  }
  const isClose = (a, b) => Math.abs(a - b) <= Math.max(0.015, Math.abs(b) * 1e-4);

  function buildExercises() {
    const container = document.getElementById('exercisesContainer');
    // A page can bring its own exercise system (Linear Algebra's matrix practice)
    if (cfg.practice) { cfg.practice.mount(container, labCtx()); return; }
    let running = 0;
    cfg.topics.forEach(topic => {
      if (!topic.exercises?.length) return;
      const group = document.createElement('div');
      group.className = 'ex-group';
      group.id = 'ex-group-' + topic.id;
      group.innerHTML = `
        <div class="ex-group-header">
          <div class="ex-shape-dot" style="background:${topic.color};box-shadow:0 0 8px ${topic.color}"></div>
          <span class="ex-group-title">${t(topic.name)}</span>
        </div>`;

      topic.exercises.forEach((q, qi) => {
        const id = `${topic.id}-${qi}`;
        running++;
        const card = document.createElement('div');
        card.className = 'ex-card';
        card.innerHTML = `
          <div class="ex-num">${t(UI.ex)} ${running}</div>
          <div class="ex-question">${t(q.q)}</div>
          <div class="ex-row">
            <input class="ex-input" type="text" inputmode="text" placeholder="?" aria-label="answer">
            <button class="ex-btn">${t(UI.check)}</button>
            <span class="ex-feedback"></span>
          </div>
          <div class="ex-hint">${t(UI.hint)}: ${t(q.hint)}</div>`;

        const input = card.querySelector('.ex-input');
        const btn   = card.querySelector('.ex-btn');
        const fb    = card.querySelector('.ex-feedback');
        const hint  = card.querySelector('.ex-hint');
        let misses = 0;

        btn.addEventListener('click', () => {
          const v = parseAnswer(input.value);
          if (Number.isNaN(v)) { setT(fb, UI.notNumber); fb.className = 'ex-feedback err'; return; }
          if (isClose(v, q.answer)) {
            card.classList.add('correct'); card.classList.remove('wrong');
            setT(fb, UI.correct); fb.className = 'ex-feedback ok';
            btn.disabled = input.disabled = true;
            answered.set(id, true);
          } else {
            card.classList.add('wrong'); card.classList.remove('correct');
            setT(fb, UI.wrong); fb.className = 'ex-feedback err';
            if (!answered.get(id)) answered.set(id, false);
            if (++misses >= 2) hint.classList.add('show');
          }
          updateScore();
        });
        input.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
        group.appendChild(card);
      });
      container.appendChild(group);
    });
  }

  function updateScore() {
    const vals = [...answered.values()];
    document.getElementById('scoreCorrect').textContent = vals.filter(Boolean).length;
    document.getElementById('scoreTotal').textContent   = vals.length;
  }

  // ─── Nav menu ─────────────────────────────────────────────────────────────
  function buildNav() {
    const topicsList = document.getElementById('navListTopics');
    const exList     = document.getElementById('navListExercises');
    const go = (target) => { closeNav(); setTimeout(() => target?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300); };

    cfg.topics.forEach((topic, i) => {
      const a = document.createElement('a');
      a.href = '#topic-' + topic.id;
      a.innerHTML = `<span class="nav-num">${pad2(i + 1)}</span>${t(topic.name)}`;
      a.addEventListener('click', e => { e.preventDefault(); go(document.getElementById('topic-' + topic.id)); });
      topicsList.appendChild(a);

      const b = document.createElement('a');
      b.href = '#ex-group-' + topic.id;
      b.innerHTML = `<span class="nav-num">${pad2(i + 1)}</span>${t(topic.name)}`;
      b.addEventListener('click', e => { e.preventDefault(); go(document.getElementById('ex-group-' + topic.id)); });
      exList.appendChild(b);
    });

    if (cfg.lab) {
      const a = document.createElement('a');
      a.href = '#labSection';
      a.innerHTML = `<span class="nav-num">◆</span>${t(cfg.lab.name)}`;
      a.addEventListener('click', e => { e.preventDefault(); go(document.getElementById('labSection')); });
      topicsList.appendChild(a);
    }

    document.querySelectorAll('.nav-tab-btn').forEach(btn => btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.nav-tab-btn').forEach(b => b.classList.toggle('active', b === btn));
      topicsList.classList.toggle('hidden', tab !== 'topics');
      exList.classList.toggle('hidden', tab !== 'exercises');
    }));

    const navBtn = document.getElementById('navBtn');
    navBtn.addEventListener('click', () => document.getElementById('navOverlay').classList.contains('open') ? closeNav() : openNav());
    document.getElementById('navClose').addEventListener('click', closeNav);
    document.getElementById('navBackdrop').addEventListener('click', closeNav);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
    document.querySelectorAll('.nav-lang-btn').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
    document.getElementById('backTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  function openNav() {
    document.getElementById('navOverlay').classList.add('open');
    document.getElementById('navBtn').classList.add('open');
    document.body.style.overflow = 'hidden';
    // Highlight the topic currently on screen
    const half = innerHeight / 2;
    let active = -1;
    document.querySelectorAll('.topic-section').forEach((s, i) => { if (s.getBoundingClientRect().top < half) active = i; });
    const lab = document.getElementById('labSection');
    if (lab && lab.getBoundingClientRect().top < half) active = cfg.topics.length;
    document.querySelectorAll('#navListTopics a').forEach((a, i) => a.classList.toggle('active-topic', i === active));
  }
  function closeNav() {
    document.getElementById('navOverlay').classList.remove('open');
    document.getElementById('navBtn').classList.remove('open');
    document.body.style.overflow = '';
  }

  // ─── Language ─────────────────────────────────────────────────────────────
  const langListeners = [];
  function setLang(next) {
    lang = next === 'es' ? 'es' : 'en';
    try { localStorage.setItem(LANG_KEY, lang); } catch (_) { /* private mode */ }
    document.documentElement.lang = lang;
    document.title = tr(cfg.ui.docTitle);
    document.querySelectorAll('[data-t]').forEach(el => { el.innerHTML = fmt(tr(I18N[+el.dataset.t])); });
    document.querySelectorAll('.nav-lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
    document.getElementById('navBtn').setAttribute('aria-label', tr(UI.menu));
    document.getElementById('backTop').setAttribute('aria-label', tr(UI.top));
    langListeners.forEach(fn => fn(lang));
  }

  // Helpers handed to labs and custom practice modules
  function labCtx() {
    return {
      t, tr, fmt, setT, Graph, parseAnswer, isClose,
      topics: cfg.topics,
      onLang: fn => langListeners.push(fn),
      getLang: () => lang,
      setScore(correct, total) {
        document.getElementById('scoreCorrect').textContent = correct;
        document.getElementById('scoreTotal').textContent   = total;
      },
    };
  }

  // ─── Init ─────────────────────────────────────────────────────────────────
  function init(config) {
    cfg = config;
    try { lang = localStorage.getItem(LANG_KEY) === 'es' ? 'es' : 'en'; } catch (_) { lang = 'en'; }

    buildPage();
    buildTopics();
    buildExercises();
    buildNav();
    setupParallax();

    if (cfg.lab) {
      const labEl = document.getElementById('labSection');
      cfg.lab.mount(labEl, labCtx());
    }

    setLang(lang);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    setTimeout(onScroll, 120);
  }

  // Register a bilingual value without wrapping it in a <span> (used by
  // graph.js for SVG <text>): returns [index, text in the current language].
  const reg = v => { I18N.push(v); return [I18N.length - 1, tr(v)]; };

  return { init, tr, fmt, t, reg };
})();

// ═══════════════════════════════════════════════════════════════════════════
// graph.js — a tiny plotting helper that turns math into SVG strings.
//
// Every topic draws its picture with it:
//
//   const g = Graph({ x: [-4, 4], y: [-3, 5] });
//   g.grid(); g.axes();
//   g.fn(x => x * x, { color: 1 });          // y = x², drawn in gold
//   g.dot(0, 0, { color: 2 });
//   return g.svg();
//
// Coordinates you pass are MATH coordinates (y grows upward). The helper
// converts them to SVG pixels (y grows downward) inside a 400 × 400 viewBox.
//
// Options shared by most primitives:
//   color : 1 gold · 2 blue · 3 pink           (CSS classes c1 / c2 / c3)
//   delay : seconds before it animates in      (sets the --d CSS variable)
//   draw  : false → no draw-in animation        (used by the live labs)
// ═══════════════════════════════════════════════════════════════════════════

let graphCounter = 0;

function Graph(opts = {}) {
  const SIZE = 400;
  const PAD  = opts.pad ?? 22;
  const [x0, x1] = opts.x ?? [-5, 5];
  const [y0, y1] = opts.y ?? [-5, 5];
  const animate  = opts.animate ?? true;
  const clipId   = 'gclip' + (++graphCounter);
  const parts    = [];      // unclipped pieces (grid, axes, labels)
  const clipped  = [];      // pieces clipped to the plot box (curves, areas)

  // Math → pixel conversions
  const sx = x => PAD + (x - x0) / (x1 - x0) * (SIZE - 2 * PAD);
  const sy = y => SIZE - PAD - (y - y0) / (y1 - y0) * (SIZE - 2 * PAD);
  const r2 = n => +n.toFixed(2);

  function animAttrs(o, kind) {
    const wantsAnim = animate && o.draw !== false;
    if (!wantsAnim) return { cls: '', style: '' };
    const cls   = kind === 'draw' ? ' g-draw' : ' g-fade';
    const style = o.delay != null ? ` style="--d:${o.delay}s"` : '';
    return { cls, style };
  }

  function lineClass(o) {
    let c = 'g-line c' + (o.color ?? 1);
    if (o.thin)  c += ' thin';
    if (o.dash)  c += ' dash';
    if (o.ghost) c += ' ghost';
    return c;
  }

  // Turn a list of [x, y] math points into an SVG path, starting a new
  // sub-path (M) wherever a point is missing (null) — that is how
  // asymptotes and jump discontinuities get a gap instead of a vertical line.
  function pathFrom(points) {
    let d = '', pen = false;
    for (const p of points) {
      if (!p) { pen = false; continue; }
      d += (pen ? 'L' : 'M') + r2(sx(p[0])) + ',' + r2(sy(p[1]));
      pen = true;
    }
    return d;
  }

  function pushPath(d, o) {
    const a = animAttrs(o, o.dash ? 'fade' : 'draw');
    const target = o.noclip ? parts : clipped;
    target.push(`<path class="${lineClass(o)}${a.cls}" d="${d}"${a.style}/>`);
  }

  const api = {
    sx, sy, x0, x1, y0, y1,

    // Faint background grid every `step` units (stepY defaults to step)
    grid(step = 1, stepY = step) {
      let s = '';
      for (let x = Math.ceil(x0 / step) * step; x <= x1 + 1e-9; x += step)
        s += `<line class="g-grid" x1="${r2(sx(x))}" y1="${sy(y0)}" x2="${r2(sx(x))}" y2="${sy(y1)}"/>`;
      for (let y = Math.ceil(y0 / stepY) * stepY; y <= y1 + 1e-9; y += stepY)
        s += `<line class="g-grid" x1="${sx(x0)}" y1="${r2(sy(y))}" x2="${sx(x1)}" y2="${r2(sy(y))}"/>`;
      parts.push(s);
      return api;
    },

    // x and y axes (only drawn if 0 is inside the window), with optional ticks.
    // ticks: one number for both axes, or [xStep, yStep].
    axes({ ticks = 0, labels = true } = {}) {
      let s = '';
      const [tx, ty] = Array.isArray(ticks) ? ticks : [ticks, ticks];
      if (y0 <= 0 && y1 >= 0) s += `<line class="g-axis" x1="${sx(x0)}" y1="${sy(0)}" x2="${sx(x1)}" y2="${sy(0)}"/>`;
      if (x0 <= 0 && x1 >= 0) s += `<line class="g-axis" x1="${sx(0)}" y1="${sy(y0)}" x2="${sx(0)}" y2="${sy(y1)}"/>`;
      if (tx) {
        for (let x = Math.ceil(x0 / tx) * tx; x <= x1; x += tx) {
          if (Math.abs(x) < 1e-9 || x === x0 || x === x1) continue;
          s += `<line class="g-axis" x1="${r2(sx(x))}" y1="${sy(0) - 3}" x2="${r2(sx(x))}" y2="${sy(0) + 3}"/>`;
          if (labels) s += `<text class="g-tick" x="${r2(sx(x))}" y="${sy(0) + 15}" text-anchor="middle">${+x.toFixed(2)}</text>`;
        }
      }
      if (ty) {
        for (let y = Math.ceil(y0 / ty) * ty; y <= y1; y += ty) {
          if (Math.abs(y) < 1e-9 || y === y0 || y === y1) continue;
          s += `<line class="g-axis" x1="${sx(0) - 3}" y1="${r2(sy(y))}" x2="${sx(0) + 3}" y2="${r2(sy(y))}"/>`;
          if (labels) s += `<text class="g-tick" x="${sx(0) - 7}" y="${r2(sy(y)) + 3}" text-anchor="end">${+y.toFixed(2)}</text>`;
        }
      }
      parts.push(s);
      return api;
    },

    // y = f(x). Breaks the curve where f is undefined or jumps wildly.
    fn(f, o = {}) {
      const from = o.from ?? x0, to = o.to ?? x1;
      const n = o.samples ?? 320;
      const span = (y1 - y0);
      const pts = [];
      let prev = null;
      for (let i = 0; i <= n; i++) {
        const x = from + (to - from) * i / n;
        const y = f(x);
        const ok = Number.isFinite(y) && Math.abs(y) < 1e6;
        if (!ok) { pts.push(null); prev = null; continue; }
        // A jump bigger than the whole window between neighbours = asymptote
        if (prev != null && Math.abs(y - prev) > span * 1.5) pts.push(null);
        // Clamp far-off values so the path stays light; the clipPath hides them
        pts.push([x, Math.max(y0 - span, Math.min(y1 + span, y))]);
        prev = y;
      }
      pushPath(pathFrom(pts), o);
      return api;
    },

    // Parametric curve (x(t), y(t)) — circles, ellipses, polar roses…
    param(fx, fy, t0, t1, o = {}) {
      const n = o.samples ?? 360, pts = [];
      for (let i = 0; i <= n; i++) {
        const t = t0 + (t1 - t0) * i / n;
        pts.push([fx(t), fy(t)]);
      }
      pushPath(pathFrom(pts), o);
      return api;
    },

    // Polar curve r = f(θ)
    polar(f, t0, t1, o = {}) {
      return api.param(t => f(t) * Math.cos(t), t => f(t) * Math.sin(t), t0, t1, o);
    },

    // Straight segment / polyline in math coordinates
    line(xa, ya, xb, yb, o = {}) {
      pushPath(`M${r2(sx(xa))},${r2(sy(ya))}L${r2(sx(xb))},${r2(sy(yb))}`, o);
      return api;
    },
    poly(points, o = {}) {
      let d = pathFrom(points);
      if (o.close) d += 'Z';
      if (o.fill) {
        const a = animAttrs({ ...o, delay: o.fillDelay ?? 1.1 }, 'fade');
        clipped.push(`<path class="g-area c${o.color ?? 1}${a.cls}" d="${d}"${a.style}/>`);
      }
      pushPath(d, o);
      return api;
    },

    // Vertical / horizontal asymptote (dashed)
    vline(x, o = {}) { return api.line(x, y0, x, y1, { dash: true, ...o }); },
    hline(y, o = {}) { return api.line(x0, y, x1, y, { dash: true, ...o }); },

    // Arrow (vectors). Arrowhead is drawn as a small filled triangle.
    arrow(xa, ya, xb, yb, o = {}) {
      api.line(xa, ya, xb, yb, o);
      const ax = sx(xa), ay = sy(ya), bx = sx(xb), by = sy(yb);
      const ang = Math.atan2(by - ay, bx - ax), L = 12, W = 6;
      const p1 = [bx, by];
      const p2 = [bx - L * Math.cos(ang) + W * Math.sin(ang), by - L * Math.sin(ang) - W * Math.cos(ang)];
      const p3 = [bx - L * Math.cos(ang) - W * Math.sin(ang), by - L * Math.sin(ang) + W * Math.cos(ang)];
      const a = animAttrs({ ...o, delay: (o.delay ?? 0) + 1.2 }, 'fade');
      parts.push(`<polygon class="g-dot c${o.color ?? 1}${o.ghost ? ' ghost' : ''}${a.cls}" points="${[p1, p2, p3].map(p => p.map(r2).join(',')).join(' ')}"${a.style}/>`);
      return api;
    },

    // Shaded area between f and g (g defaults to the x-axis) from a to b
    area(f, a, b, o = {}) {
      const g = o.lower ?? (() => 0);
      const n = o.samples ?? 160, top = [], bottom = [];
      for (let i = 0; i <= n; i++) {
        const x = a + (b - a) * i / n;
        top.push([x, f(x)]);
        bottom.unshift([x, g(x)]);
      }
      const d = pathFrom(top.concat(bottom)) + 'Z';
      const at = animAttrs({ ...o, delay: o.delay ?? 1.1 }, 'fade');
      clipped.push(`<path class="g-area c${o.color ?? 1}${o.soft ? ' soft' : ''}${at.cls}" d="${d}"${at.style}/>`);
      return api;
    },

    // Rectangle in math coords (Riemann sums). Staggered fade-in via delay.
    rect(x, y, w, h, o = {}) {
      const top = Math.max(y, y + h), bot = Math.min(y, y + h);
      const a = animAttrs(o, 'fade');
      clipped.push(`<rect class="g-rect c${o.color ?? 1}${a.cls}" x="${r2(sx(x))}" y="${r2(sy(top))}" width="${r2(sx(x + w) - sx(x))}" height="${r2(sy(bot) - sy(top))}"${a.style}/>`);
      return api;
    },

    // Point. hollow:true draws an open circle (a "hole" in a graph).
    dot(x, y, o = {}) {
      const a = animAttrs({ ...o, delay: o.delay ?? 1.4 }, 'fade');
      parts.push(`<circle class="g-dot c${o.color ?? 1}${o.hollow ? ' hollow' : ''}${a.cls}" cx="${r2(sx(x))}" cy="${r2(sy(y))}" r="${o.r ?? 4.5}"${a.style}/>`);
      return api;
    },

    // Text label at a math coordinate (dx/dy nudge in pixels).
    // str may be bilingual { en, es }: it is registered with the Explorer
    // engine so the EN/ES toggle can re-fill it like any other text.
    text(x, y, str, o = {}) {
      let i18nAttr = '';
      if (str && typeof str === 'object') {
        if (typeof Explorer !== 'undefined' && o.draw !== false && animate) {
          const [idx, current] = Explorer.reg(str);
          i18nAttr = ` data-t="${idx}"`;
          str = current;
        } else str = (typeof Explorer !== 'undefined' ? Explorer.tr(str) : str.en);
      }
      const a = animAttrs({ ...o, delay: o.delay ?? 1.5 }, 'fade');
      const cls = 'g-text' + (o.color ? ' c' + o.color : '') + (o.muted ? ' muted' : '');
      const size = o.size ? ` font-size="${o.size}"` : '';
      parts.push(`<text class="${cls}${a.cls}" x="${r2(sx(x) + (o.dx ?? 0))}" y="${r2(sy(y) + (o.dy ?? 0))}" text-anchor="${o.anchor ?? 'start'}"${size}${a.style}${i18nAttr}>${str}</text>`);
      return api;
    },

    // Escape hatch: raw SVG markup
    raw(svgMarkup, { clip = false } = {}) { (clip ? clipped : parts).push(svgMarkup); return api; },

    svg() {
      const box = `<clipPath id="${clipId}"><rect x="${PAD}" y="${PAD}" width="${SIZE - 2 * PAD}" height="${SIZE - 2 * PAD}"/></clipPath>`;
      // Order: grid/axes first, then clipped curves, then dots & labels on top
      const under = parts.filter(p => /class="g-(grid|axis|tick)/.test(p));
      const over  = parts.filter(p => !/class="g-(grid|axis|tick)/.test(p));
      return `<svg viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg"><defs>${box}</defs>${under.join('')}<g clip-path="url(#${clipId})">${clipped.join('')}</g>${over.join('')}</svg>`;
    },
  };
  return api;
}

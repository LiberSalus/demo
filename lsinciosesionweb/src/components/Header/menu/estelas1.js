// Triangular mesh with directional glow trail (no nodes rendered)
// Usage: createTriangularMesh(document.getElementById("mesh"), { ...cfg });

(function (global) {
  const DEFAULT_CFG = {
    // ---- Style ----
    bgDark: "#b9147e",
    bgLight: "#d54ca1",
    line:   "#8a0e60",
    vignetteOpacity: 0.15,

    // ---- Geometry ----
    baseMin: 80,
    baseMax: 160,
    jitterRatio: 0.5,

    // ---- Motion ----
    speedFactor: 0.4, // px/s ≈ base * factor
    trail: 0.45,      // fraction of edge behind head
    seed: 20250819,

    // ---- Trail ----
    glowColor: "#8ddcff",
    dirGlowStrength: 0.9,
    dirGlowHalfLifeMs: 2200,
    dirGlowMaxAlpha: 0.55,

    // ---- Population ----
    targetParticles: 30,
    maxParticles: 120,

    // ---- Viewport ----
    killMarginPx: 12,
    viewMargin: 64,
  };

  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hexToRgb(hex) {
    const c = hex.replace('#','');
    const n = parseInt(c.length === 3 ? c.split('').map(x=>x+x).join('') : c, 16);
    return [(n>>16)&255, (n>>8)&255, n&255];
  }

  function createTriangularMesh(canvas, userCfg = {}) {
    if (!canvas) throw new Error("Canvas is required");
    const cfg = Object.assign({}, DEFAULT_CFG, userCfg);
    const ctx = canvas.getContext("2d", { alpha: false });
    const glowRGB = hexToRgb(cfg.glowColor);
    const decay = (x, dt, hl) => x * Math.pow(0.5, dt / hl);

    let G = null;              // graph data
    let particles = [];
    let dirGlow = new Map();   // "a-b" -> { u, alpha }
    let raf = null;
    let last = 0;

    function buildGraph() {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.ceil(window.innerWidth);
      const h = Math.ceil(window.innerHeight);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const base = Math.max(cfg.baseMin, Math.min(cfg.baseMax, Math.floor(Math.min(w, h) / 7)));
      const jitter = base * cfg.jitterRatio;
      const cols = Math.ceil(w / base) + 2;
      const rows = Math.ceil(h / base) + 2;

      const rand = rng(cfg.seed);
      const pts = [];
      for (let y = 0; y <= rows; y++) {
        for (let x = 0; x <= cols; x++) {
          const bx = x * base, by = y * base;
          const jx = (x === 0 || x === cols) ? 0 : (rand()*2 - 1) * jitter;
          const jy = (y === 0 || y === rows) ? 0 : (rand()*2 - 1) * jitter;
          pts.push({ x: bx + jx, y: by + jy });
        }
      }

      const idx = (x, y) => y * (cols + 1) + x;

      const neighbors = new Map();
      const addEdge = (a,b) => {
        if (a === b) return;
        if (!neighbors.has(a)) neighbors.set(a, new Set());
        if (!neighbors.has(b)) neighbors.set(b, new Set());
        neighbors.get(a).add(b);
        neighbors.get(b).add(a);
      };

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const p00 = idx(x, y);
          const p10 = idx(x+1, y);
          const p01 = idx(x, y+1);
          const p11 = idx(x+1, y+1);
          if ((x + y) % 2 === 0) {
            addEdge(p00, p10); addEdge(p10, p11); addEdge(p11, p00);
            addEdge(p00, p11); addEdge(p11, p01); addEdge(p01, p00);
          } else {
            addEdge(p00, p10); addEdge(p10, p01); addEdge(p01, p00);
            addEdge(p10, p11); addEdge(p11, p01); addEdge(p01, p10);
          }
        }
      }

      const edges = new Map();
      const key = (a,b) => `${a}-${b}`;
      for (const [a, set] of neighbors.entries()) {
        for (const b of set) {
          if (!edges.has(key(a,b))) {
            const A = pts[a], B = pts[b];
            const dx = B.x - A.x, dy = B.y - A.y;
            const len = Math.hypot(dx, dy);
            edges.set(key(a,b), { a, b, len, dx: dx/len, dy: dy/len });
          }
        }
      }

      G = { w, h, rows, cols, base, pts, neighbors, edges };
    }

    function spawnParticle(now, rand = Math.random) {
      if (particles.length >= cfg.maxParticles) return;
      const vCount = G.pts.length;
      const startV = (vCount * rand()) | 0;
      const outs = [...(G.neighbors.get(startV) || [])];
      if (!outs.length) return;
      const to = outs[(outs.length * rand()) | 0];
      const e0 = G.edges.get(`${startV}-${to}`);

      particles.push({
        from: startV,
        to,
        u: 0,
        speed: G.base * cfg.speedFactor,
        dirx: e0 ? e0.dx : 1,
        diry: e0 ? e0.dy : 0,
        born: now + rand() * 200
      });
    }

    function seedParticles() {
      particles = [];
      dirGlow = new Map();
      const rand = rng(cfg.seed ^ 0x9e3779b9);
      while (particles.length < Math.min(cfg.targetParticles, cfg.maxParticles)) {
        spawnParticle(performance.now(), rand);
      }
    }

    function maintainPopulation(now) {
      while (particles.length < cfg.targetParticles && particles.length < cfg.maxParticles) {
        spawnParticle(now);
      }
    }

    function chooseNext(from, v, dirx, diry) {
      const outs = [...(G.neighbors.get(v) || [])];
      if (!outs.length) return null;
      const candidates = outs.filter(n => n !== from);
      const list = candidates.length ? candidates : outs;

      let best = null, bestDot = -Infinity;
      const V = G.pts[v];
      for (const n of list) {
        const N = G.pts[n];
        let dx = N.x - V.x, dy = N.y - V.y;
        const len = Math.hypot(dx, dy) || 1;
        dx /= len; dy /= len;
        const dot = dx*dirx + dy*diry;
        if (dot > bestDot) { bestDot = dot; best = n; }
      }
      return best;
    }

    function drawBackground() {
      const { w, h } = G;
      const lg = ctx.createLinearGradient(0, 0, 0, h);
      lg.addColorStop(0, cfg.bgDark);
      lg.addColorStop(1, cfg.bgLight);
      ctx.fillStyle = lg;
      ctx.fillRect(0, 0, w, h);

      const rg = ctx.createRadialGradient(w*0.7, h*0.8, 0, w*0.7, h*0.9, Math.hypot(w,h));
      rg.addColorStop(0, "rgba(0,0,0,0)");
      rg.addColorStop(1, `rgba(0,0,0,${cfg.vignetteOpacity})`);
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, w, h);
    }

    function drawLines() {
      const { rows, cols, pts } = G;
      ctx.strokeStyle = cfg.line;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.85;

      const id = (x, y) => y * (cols + 1) + x;
      function tri(a, b, c) {
        ctx.beginPath();
        ctx.moveTo(pts[a].x, pts[a].y);
        ctx.lineTo(pts[b].x, pts[b].y);
        ctx.lineTo(pts[c].x, pts[c].y);
        ctx.closePath();
        ctx.stroke();
      }

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const p00 = id(x, y);
          const p10 = id(x+1, y);
          const p01 = id(x, y+1);
          const p11 = id(x+1, y+1);
          if ((x + y) % 2 === 0) {
            tri(p00, p10, p11);
            tri(p00, p11, p01);
          } else {
            tri(p00, p10, p01);
            tri(p10, p11, p01);
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    function drawDirGlow(dt) {
      if (dirGlow.size === 0) return;
      const lw = Math.max(1.6, G.base * 0.018);
      ctx.globalCompositeOperation = "lighter";

      for (const [k, obj] of [...dirGlow.entries()]) {
        obj.alpha = decay(obj.alpha, dt, cfg.dirGlowHalfLifeMs);
        if (obj.alpha < 0.02) { dirGlow.delete(k); continue; }

        const [aStr, bStr] = k.split("-");
        const a = parseInt(aStr, 10), b = parseInt(bStr, 10);
        const A = G.pts[a], B = G.pts[b];
        const u = Math.max(0, Math.min(1, obj.u));

        const Px = A.x + (B.x - A.x) * u;
        const Py = A.y + (B.y - A.y) * u;

        const alpha = Math.min(cfg.dirGlowMaxAlpha, obj.alpha);
        const grad = ctx.createLinearGradient(A.x, A.y, Px, Py);
        grad.addColorStop(0.0, `rgba(${glowRGB[0]},${glowRGB[1]},${glowRGB[2]},0.00)`);
        grad.addColorStop(0.85, `rgba(${glowRGB[0]},${glowRGB[1]},${glowRGB[2]},${alpha*0.85})`);
        grad.addColorStop(1.0, `rgba(${glowRGB[0]},${glowRGB[1]},${glowRGB[2]},${alpha})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = lw;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(Px, Py);
        ctx.stroke();

        dirGlow.set(k, obj);
      }

      ctx.globalCompositeOperation = "source-over";
    }

    function nearMargin(x, y) {
      return (
        x <= cfg.killMarginPx || x >= G.w - cfg.killMarginPx ||
        y <= cfg.killMarginPx || y >= G.h - cfg.killMarginPx
      );
    }

    function drawParticles(dt) {
      const now = performance.now();
      const kill = [];

      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (now < p.born) continue;

        const e = G.edges.get(`${p.from}-${p.to}`);
        if (!e) { kill.push(i); continue; }

        const du = (p.speed * dt) / (e.len * 1000);
        p.u += du;

        const A = G.pts[e.a], B = G.pts[e.b];
        const uClamped = Math.min(p.u, 1);
        const x = A.x + (B.x - A.x) * uClamped;
        const y = A.y + (B.y - A.y) * uClamped;

        if (x < -cfg.viewMargin || x > G.w + cfg.viewMargin ||
            y < -cfg.viewMargin || y > G.h + cfg.viewMargin) {
          kill.push(i);
          continue;
        }

        const trailU = Math.max(0, p.u - cfg.trail);
        const tx = A.x + (B.x - A.x) * trailU;
        const ty = A.y + (B.y - A.y) * trailU;

        const lw = Math.max(1.5, G.base * 0.015);
        const grad = ctx.createLinearGradient(tx, ty, x, y);
        grad.addColorStop(0, `rgba(${glowRGB[0]},${glowRGB[1]},${glowRGB[2]},0.00)`);
        grad.addColorStop(1, `rgba(${glowRGB[0]},${glowRGB[1]},${glowRGB[2]},0.50)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = lw;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();

        const dkey = `${e.a}-${e.b}`;
        const prev = dirGlow.get(dkey) || { u: 0, alpha: 0 };
        prev.u = Math.max(prev.u, uClamped);
        const added = cfg.dirGlowStrength * Math.min(1, Math.max(0.05, du * 6));
        prev.alpha = Math.min(1, prev.alpha + added);
        dirGlow.set(dkey, prev);

        if (p.u >= 1) {
          if (nearMargin(B.x, B.y)) { kill.push(i); continue; }
          const next = chooseNext(p.from, p.to, p.dirx, p.diry);
          if (next == null) { kill.push(i); continue; }
          const newEdge = G.edges.get(`${p.to}-${next}`);
          p.from = p.to; p.to = next; p.u = 0;
          if (newEdge) { p.dirx = newEdge.dx; p.diry = newEdge.dy; }
        }
      }

      for (let k = kill.length - 1; k >= 0; k--) {
        particles.splice(kill[k], 1);
      }

      ctx.globalCompositeOperation = "source-over";
    }

    function tick(now) {
      if (!last) last = now;
      const dt = now - last;
      last = now;

      drawBackground();
      drawLines();
      drawDirGlow(dt);
      drawParticles(dt);
      maintainPopulation(now);

      raf = requestAnimationFrame(tick);
    }

    function setup() {
      buildGraph();
      seedParticles();
      last = 0;
      raf = requestAnimationFrame(tick);
    }

    function onResize() {
      if (raf) cancelAnimationFrame(raf);
      setup();
    }

    window.addEventListener("resize", onResize, { passive: true });
    setup();

    // Return cleanup function and live API
    return {
      destroy() {
        window.removeEventListener("resize", onResize);
        if (raf) cancelAnimationFrame(raf);
      },
      setConfig(nextCfg = {}) {
        Object.assign(cfg, nextCfg);
        onResize();
      }
    };
  }

  // UMD export
  global.createTriangularMesh = createTriangularMesh;
})(typeof window !== "undefined" ? window : globalThis);

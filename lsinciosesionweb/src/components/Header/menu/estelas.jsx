import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

/* ===== Paletas ===== */
export const PALETTES = {
  principal: { bgDark:"#062b43", bgLight:"#12527e", line:"#0f5f8f" },
  turquesa:  { bgDark:"#4fb9d2", bgLight:"#76cbe0", line:"#2a8ea8" },
  dorado:    { bgDark:"#f6a430", bgLight:"#f8bb5c", line:"#c97f0f" },
  naranja:   { bgDark:"#ed6b24", bgLight:"#f28d56", line:"#b94f12" },
  magenta:   { bgDark:"#b9147e", bgLight:"#d54ca1", line:"#8a0e60" },
  plateado:  { bgDark:"#c0c0c0", bgLight:"#a6a6a6", line:"#dcdcdc" },
};

/* ===== Utilidades ===== */
const lerp = (a,b,t)=> a + (b-a)*t;
const hexToRgb = (hex) => {
  const c = hex.replace('#','');
  const full = c.length === 3 ? c.split('').map(x=>x+x).join('') : c;
  const n = parseInt(full, 16);
  return [(n>>16)&255, (n>>8)&255, n&255];
};
const rgbToHex = (r,g,b) => {
  const h = v => ('0'+v.toString(16)).slice(-2);
  return `#${h(r)}${h(g)}${h(b)}`;
};
const lerpColor = (A,B,t) => {
  const a = hexToRgb(A), b = hexToRgb(B);
  return rgbToHex(
    Math.round(lerp(a[0],b[0],t)),
    Math.round(lerp(a[1],b[1],t)),
    Math.round(lerp(a[2],b[2],t)),
  );
};
const parseBezier = (str, fb = (x)=>x) => {
  const m = /^cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)$/i.exec(str||"");
  if (!m) return fb;
  const [p0x,p0y,p1x,p1y] = m.slice(1).map(parseFloat);
  return cubicBezier(p0x,p0y,p1x,p1y);
};
function cubicBezier(p0x,p0y,p1x,p1y){
  const cx=3*p0x, bx=3*(p1x-p0x)-cx, ax=1-cx-bx;
  const cy=3*p0y, by=3*(p1y-p0y)-cy, ay=1-cy-by;
  const bezX = t => ((ax*t + bx)*t + cx)*t;
  const bezY = t => ((ay*t + by)*t + cy)*t;
  const bezdX= t => (3*ax*t + 2*bx)*t + cx;
  return (x)=>{
    if (p0x===p0y && p1x===p1y) return x;
    let t=x;
    for (let i=0;i<5;i++){
      const x2=bezX(t)-x, d=bezdX(t);
      if (Math.abs(x2)<1e-4 || d===0) break;
      t -= x2/d;
    }
    return Math.max(0, Math.min(1, bezY(t)));
  };
}

/* ===== Componente Canvas con color + morph + estelas ===== */
const Estelas = forwardRef(function Estelas(
  {
    className,
    style,
    initialPaletteKey = "principal",

    // timings + curvas
    colorDurationMs = 900,
    colorEase = "cubic-bezier(0.075, 0.82, 0.165, 1)",
    morphDurationMs = 800,
    morphEase = "cubic-bezier(0.075, 0.82, 0.165, 1)",

    // “acuarela”
    watercolorSpread = 0.45,
    watercolorJitter = 0.35,

    // geometría base
    baseMin = 80,
    baseMax = 160,
    jitterRatio = 0.5,

    // partículas/estelas
    speedFactor = 0.2,
    trail = 0.45,
    targetParticles = 5,
    maxParticles = 5,
    glowColor = "#8ddcff",
    dirGlowStrength = 0.9,
    dirGlowHalfLifeMs = 2200,
    dirGlowMaxAlpha = 0.55,

    // bordes/viewport
    killMarginPx = 12,   // ← mata partículas en la orilla
    viewMargin = 64,     // culling extra

  },
  ref
){
  const canvasRef = useRef(null);

  // Estado del motor
  const engineRef = useRef({
    seed: 20250819,
    curPal: PALETTES[initialPaletteKey] || PALETTES.principal,
    nextPal: null,

    // Transiciones
    colorMorph: null, // {start,dur,easeFn,from,to}
    morph: null,      // {start,dur,easeFn,fromPts,toPts}

    // Canvas + malla
    G: null,          // {w,h,rows,cols,base,pts,neighbors,edges,tris}
    triMap: null,     // [{a,b,c,cx,cy,delay}, ...]

    // Partículas / estelas
    particles: [],
    dirGlow: new Map(),

    raf: 0,
    last: 0,
  });

  // API imperativa
  useImperativeHandle(ref, () => ({
    transitionToPalette(palette) {
      startColorMorph(palette);
    },
    morph() {
      startMorph();
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha:false });

    const state = engineRef.current;

    const easeColor = parseBezier(colorEase, x=>x);
    const easeMorph = parseBezier(morphEase, x=>x);

    /* ====== RNG ====== */
    function rng(seed) {
      return function () {
        seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    /* ====== Grafo / malla ====== */
    function buildGraph() {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.ceil(canvas.clientWidth || window.innerWidth);
      const h = Math.ceil(canvas.clientHeight || window.innerHeight);
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr,0,0,dpr,0,0);

      const base = Math.max(baseMin, Math.min(baseMax, Math.floor(Math.min(w, h) / 7)));
      const jitter = base * jitterRatio;
      const cols = Math.ceil(w / base) + 2;
      const rows = Math.ceil(h / base) + 2;

      const rand = rng(state.seed);
      const pts = [];
      for (let y=0;y<=rows;y++){
        for (let x=0;x<=cols;x++){
          const bx=x*base, by=y*base;
          const jx=(x===0||x===cols)?0:(rand()*2-1)*jitter;
          const jy=(y===0||y===rows)?0:(rand()*2-1)*jitter;
          pts.push({x:bx+jx,y:by+jy});
        }
      }

      const idx=(x,y)=> y*(cols+1)+x;

      const neighbors=new Map();
      const addEdge=(a,b)=>{ if(a===b) return;
        if(!neighbors.has(a)) neighbors.set(a,new Set());
        if(!neighbors.has(b)) neighbors.set(b,new Set());
        neighbors.get(a).add(b); neighbors.get(b).add(a);
      };

      const tris = [];
      for (let y=0;y<rows;y++){
        for (let x=0;x<cols;x++){
          const p00=idx(x,y), p10=idx(x+1,y), p01=idx(x,y+1), p11=idx(x+1,y+1);
          if ((x+y)%2===0){
            addEdge(p00,p10); addEdge(p10,p11); addEdge(p11,p00);
            addEdge(p00,p11); addEdge(p11,p01); addEdge(p01,p00);
            tris.push([p00,p10,p11]); tris.push([p00,p11,p01]);
          } else {
            addEdge(p00,p10); addEdge(p10,p01); addEdge(p01,p00);
            addEdge(p10,p11); addEdge(p11,p01); addEdge(p01,p10);
            tris.push([p00,p10,p01]); tris.push([p10,p11,p01]);
          }
        }
      }

      const edges=new Map();
      const key=(a,b)=>`${a}-${b}`;
      for (const [a,set] of neighbors.entries()){
        for (const b of set){
          if (!edges.has(key(a,b))){
            const A=pts[a], B=pts[b];
            const dx=B.x-A.x, dy=B.y-A.y;
            const len=Math.hypot(dx,dy);
            edges.set(key(a,b), { a,b,len, dx:dx/len, dy:dy/len });
          }
        }
      }

      // TriMap para el barrido “acuarela”
      const r2 = rng(state.seed ^ 0xA5A5);
      const tmap = tris.map(T=>{
        const A=pts[T[0]], B=pts[T[1]], C=pts[T[2]];
        const cx=(A.x+B.x+C.x)/3, cy=(A.y+B.y+C.y)/3;
        const n = (r2()*2 - 1) * watercolorJitter;
        const baseY = cy / h;
        const delay = Math.min(1, Math.max(0, baseY*(1-watercolorSpread) + n*watercolorSpread));
        return { a:T[0], b:T[1], c:T[2], cx, cy, delay };
      }).sort((u,v)=>u.delay - v.delay);

      state.G = { w,h,rows,cols,base,pts,neighbors,edges,tris };
      state.triMap = tmap;
    }

    /* ====== Partículas + estelas ====== */
    const glowRGB = hexToRgb(glowColor);
    const decay = (x,dt,hl) => x * Math.pow(0.5, dt / hl);

    function spawnParticle(now, rand=Math.random){
      if (state.particles.length>=maxParticles) return;
      const vCount = state.G.pts.length;
      const startV = (vCount * rand()) | 0;
      const outs = [...(state.G.neighbors.get(startV)||[])];
      if (!outs.length) return;
      const to = outs[(outs.length*rand())|0];
      const e0 = state.G.edges.get(`${startV}-${to}`);
      state.particles.push({
        from:startV, to, u:0,
        speed: state.G.base * speedFactor,
        dirx: e0?e0.dx:1, diry:e0?e0.dy:0,
        born: now + rand()*200
      });
    }
    function seedParticles(){
      state.particles=[]; state.dirGlow=new Map();
      const rand=rng(state.seed ^ 0x9e3779b9);
      while (state.particles.length < Math.min(targetParticles, maxParticles)) {
        spawnParticle(performance.now(), rand);
      }
    }
    function maintainPopulation(now){
      while (state.particles.length < targetParticles && state.particles.length < maxParticles) {
        spawnParticle(now);
      }
    }
    function chooseNext(from,v,dx,dy){
      const outs=[...(state.G.neighbors.get(v)||[])]; if(!outs.length) return null;
      const candidates=outs.filter(n=>n!==from); const list=candidates.length?candidates:outs;
      let best=null, bestDot=-Infinity; const V=state.G.pts[v];
      for(const n of list){
        const N=state.G.pts[n];
        let ddx=N.x-V.x, ddy=N.y-V.y; const len=Math.hypot(ddx,ddy)||1; ddx/=len; ddy/=len;
        const dot=ddx*dx+ddy*dy; if (dot>bestDot){ bestDot=dot; best=n; }
      } return best;
    }

    // Detecta si un punto está en la orilla
    function nearMargin(x, y) {
      const G = state.G;
      return (
        x <= killMarginPx ||
        x >= G.w - killMarginPx ||
        y <= killMarginPx ||
        y >= G.h - killMarginPx
      );
    }

    function drawDirGlow(dt){
      if (state.dirGlow.size===0) return;
      const lw = Math.max(1.6, state.G.base * 0.018);
      ctx.globalCompositeOperation = "lighter";
      for (const [k,obj] of [...state.dirGlow.entries()]){
        obj.alpha = decay(obj.alpha, dt, dirGlowHalfLifeMs);
        if (obj.alpha < 0.02) { state.dirGlow.delete(k); continue; }
        const [aStr,bStr]=k.split("-"); const a=parseInt(aStr,10), b=parseInt(bStr,10);
        const A=state.G.pts[a], B=state.G.pts[b]; const u=Math.max(0, Math.min(1, obj.u));
        const Px=A.x+(B.x-A.x)*u, Py=A.y+(B.y-A.y)*u;
        const alpha=Math.min(dirGlowMaxAlpha, obj.alpha);
        const grad=ctx.createLinearGradient(A.x,A.y,Px,Py);
        grad.addColorStop(0,`rgba(${glowRGB[0]},${glowRGB[1]},${glowRGB[2]},0)`);
        grad.addColorStop(1,`rgba(${glowRGB[0]},${glowRGB[1]},${glowRGB[2]},${alpha})`);
        ctx.strokeStyle=grad; ctx.lineWidth=lw;
        ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(Px,Py); ctx.stroke();
        state.dirGlow.set(k,obj);
      }
      ctx.globalCompositeOperation = "source-over";
    }

    // === PARCHE COMPLETO: matar en orilla + reponer con maintainPopulation ===
    function drawParticles(dt){
      const now = performance.now();
      const kill = [];

      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      for (let i = 0; i < state.particles.length; i++){
        const p = state.particles[i];
        if (now < p.born) continue;

        const e = state.G.edges.get(`${p.from}-${p.to}`);
        if (!e) { kill.push(i); continue; }

        const du = (p.speed * dt) / (e.len * 1000);
        p.u += du;

        const A = state.G.pts[e.a], B = state.G.pts[e.b];
        const uC = Math.min(p.u, 1);
        const x = A.x + (B.x - A.x) * uC;
        const y = A.y + (B.y - A.y) * uC;

        // Si salió del viewport por resize u otros motivos, matar
        if (x < -viewMargin || x > state.G.w + viewMargin ||
            y < -viewMargin || y > state.G.h + viewMargin) {
          kill.push(i);
          continue;
        }

        // Estela "rápida" detrás del punto
        const trailU = Math.max(0, p.u - trail);
        const tx = A.x + (B.x - A.x) * trailU;
        const ty = A.y + (B.y - A.y) * trailU;

        const lw = Math.max(1.5, state.G.base * 0.015);
        const grad = ctx.createLinearGradient(tx, ty, x, y);
        grad.addColorStop(0, `rgba(${glowRGB[0]},${glowRGB[1]},${glowRGB[2]},0)`);
        grad.addColorStop(1, `rgba(${glowRGB[0]},${glowRGB[1]},${glowRGB[2]},0.5)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = lw;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Estela direccional acumulada
        const dkey = `${e.a}-${e.b}`;
        const prev = state.dirGlow.get(dkey) || { u: 0, alpha: 0 };
        prev.u = Math.max(prev.u, uC);
        prev.alpha = Math.min(1, prev.alpha + dirGlowStrength * Math.min(1, Math.max(0.05, du * 6)));
        state.dirGlow.set(dkey, prev);

        // ¿Llegó al vértice destino?
        if (p.u >= 1) {
          // ⛔ Si el destino está en la orilla, matar (desaparece fuera de pantalla)
          if (nearMargin(B.x, B.y)) {
            kill.push(i);

            // (Opcional) Reponer inmediatamente:
            // spawnParticle(now);

            continue;
          }

          // Si no está en borde, seguir al siguiente segmento
          const next = (function chooseNext(from, v, dx, dy) {
            const outs = [...(state.G.neighbors.get(v) || [])];
            if (!outs.length) return null;
            const candidates = outs.filter(n => n !== from);
            const list = candidates.length ? candidates : outs;
            let best = null, bestDot = -Infinity;
            const V = state.G.pts[v];
            for (const n of list) {
              const N = state.G.pts[n];
              let ddx = N.x - V.x, ddy = N.y - V.y;
              const len = Math.hypot(ddx, ddy) || 1;
              ddx /= len; ddy /= len;
              const dot = ddx * e.dx + ddy * e.dy;
              if (dot > bestDot) { bestDot = dot; best = n; }
            }
            return best;
          })(p.from, p.to, e.dx, e.dy);

          if (next == null) { kill.push(i); continue; }

          // Continuar
          p.from = p.to;
          p.to = next;
          p.u = 0;
        }
      }

      // Eliminar los muertos
      for (let k = kill.length - 1; k >= 0; k--) state.particles.splice(kill[k], 1);

      ctx.globalCompositeOperation = "source-over";
    }

    /* ====== Color de fondo por triángulo ====== */
    function colorAt(pal, tri){
      const k = Math.max(0, Math.min(1, tri.cy / state.G.h));
      return lerpColor(pal.bgDark, pal.bgLight, k);
    }
    function fillTri(tri, fill){
      const A=state.G.pts[tri.a], B=state.G.pts[tri.b], C=state.G.pts[tri.c];
      ctx.fillStyle = fill;
      ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.lineTo(C.x,C.y);
      ctx.closePath(); ctx.fill();
    }
    function drawWatercolorBackground(kColor){
      const from = state.curPal;
      const to   = state.nextPal || state.curPal;
      for (let i=0;i<state.triMap.length;i++){
        const tri = state.triMap[i];
        let local = 1;
        if (kColor !== null) {
          const reach = Math.max(0, Math.min(1, (kColor - tri.delay) / (1 - tri.delay + 1e-6)));
          local = reach;
        }
        const colFrom = colorAt(from, tri);
        const colTo   = colorAt(to,   tri);
        const col     = (kColor === null) ? colFrom : lerpColor(colFrom, colTo, local);
        fillTri(tri, col);
      }
    }

    /* ====== Morph de vértices ====== */
    function computeTargetPoints(){
      const base=state.G.base, jitter=base*jitterRatio, cols=state.G.cols, rows=state.G.rows;
      state.seed = (state.seed + ((Math.random()*1e9)|0)) >>> 0;
      const rand=rng(state.seed), pts=[];
      for (let y=0;y<=rows;y++) for (let x=0;x<=cols;x++){
        const bx=x*base, by=y*base;
        const edgeX=(x===0||x===cols), edgeY=(y===0||y===rows);
        const jx=edgeX?0:(rand()*2-1)*jitter, jy=edgeY?0:(rand()*2-1)*jitter;
        pts.push({x:bx+jx, y:by+jy});
      } return pts;
    }
    function startMorph(){
      const from = state.G.pts.map(p=>({x:p.x,y:p.y}));
      const to   = computeTargetPoints();
      state.morph = {
        start: performance.now(),
        dur: morphDurationMs,
        easeFn: easeMorph,
        fromPts: from,
        toPts: to
      };
    }
    function applyMorph(now){
      if (!state.morph) return;
      const t = Math.min(1, (now - state.morph.start) / state.morph.dur);
      const k = state.morph.easeFn(t);
      for (let i=0;i<state.G.pts.length;i++){
        state.G.pts[i].x = lerp(state.morph.fromPts[i].x, state.morph.toPts[i].x, k);
        state.G.pts[i].y = lerp(state.morph.fromPts[i].y, state.morph.toPts[i].y, k);
      }
      if (t>=1) state.morph = null;
    }

    /* ====== Transición de color ====== */
    function startColorMorph(nextPaletteObj){
      state.nextPal = nextPaletteObj;
      state.colorMorph = {
        start: performance.now(),
        dur: colorDurationMs,
        easeFn: easeColor,
        from: { ...state.curPal },
        to:   { ...nextPaletteObj },
      };
    }
    function applyColorMorph(now){
      if (!state.colorMorph) return null;
      const t = Math.min(1, (now - state.colorMorph.start)/state.colorMorph.dur);
      const k = state.colorMorph.easeFn(t);
      if (t>=1){
        state.curPal = { ...state.colorMorph.to };
        state.nextPal = null;
        state.colorMorph = null;
        return null;
      }
      return k; // 0..1
    }

    /* ====== Loop ====== */
    function tick(now){
      if (!state.last) state.last = now;
      const dt = now - state.last; state.last = now;

      // Limpia
      ctx.clearRect(0,0,state.G.w,state.G.h);

      // Morph de vértices + transición de color
      applyMorph(now);
      const kColor = applyColorMorph(now);

      // Fondo acuarela (triángulo a triángulo)
      drawWatercolorBackground(kColor);

      // Líneas (interpoladas si hay transición)
      const lineNow = (kColor === null)
        ? state.curPal.line
        : lerpColor(state.colorMorph.from.line, state.colorMorph.to.line, kColor);

      ctx.globalAlpha = 0.85;
      ctx.strokeStyle = lineNow;
      ctx.lineWidth = 1;
      for (const t3 of state.G.tris){
        const A=state.G.pts[t3[0]], B=state.G.pts[t3[1]], C=state.G.pts[t3[2]];
        ctx.beginPath();
        ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.lineTo(C.x,C.y);
        ctx.closePath(); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Efectos de estela
      drawDirGlow(dt);
      drawParticles(dt);
      maintainPopulation(now);

      state.raf = requestAnimationFrame(tick);
    }

    function handleResize(){
      cancelAnimationFrame(state.raf);
      buildGraph();
      seedParticles();
      state.last = 0;
      state.raf = requestAnimationFrame(tick);
    }

    // init
    buildGraph();
    seedParticles();
    state.raf = requestAnimationFrame(tick);
    window.addEventListener("resize", handleResize, { passive:true });

    return () => {
      cancelAnimationFrame(state.raf);
      window.removeEventListener("resize", handleResize);
    };
  }, [
    colorDurationMs, colorEase,
    morphDurationMs, morphEase,
    watercolorSpread, watercolorJitter,
    baseMin, baseMax, jitterRatio,
    speedFactor, trail, targetParticles, maxParticles,
    glowColor, dirGlowStrength, dirGlowHalfLifeMs, dirGlowMaxAlpha,
    killMarginPx, viewMargin
  ]);

  // Métodos expuestos al padre
  const startColorMorph = (palette) => {
    const state = engineRef.current;
    state.nextPal = palette;
    state.colorMorph = {
      start: performance.now(),
      dur: colorDurationMs,
      easeFn: parseBezier(colorEase, x=>x),
      from: { ...state.curPal },
      to:   { ...palette },
    };
  };
  const startMorph = () => {
    const state = engineRef.current;
    if (!state.G) return;
    const from = state.G.pts.map(p=>({x:p.x,y:p.y}));
    const to = (function compute(){
      const base=state.G.base, jitter=base*jitterRatio, cols=state.G.cols, rows=state.G.rows;
      state.seed = (state.seed + ((Math.random()*1e9)|0)) >>> 0;
      const rand=(function(seed){return function(){seed|=0;seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^(seed>>>15),1|seed);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296;};})(state.seed);
      const pts=[];
      for (let y=0;y<=rows;y++) for (let x=0;x<=cols;x++){
        const bx=x*base, by=y*base;
        const edgeX=(x===0||x===cols), edgeY=(y===0||y===rows);
        const jx=edgeX?0:(rand()*2-1)*jitter, jy=edgeY?0:(rand()*2-1)*jitter;
        pts.push({x:bx+jx, y:by+jy});
      } return pts;
    })();
    engineRef.current.morph = {
      start: performance.now(),
      dur: morphDurationMs,
      easeFn: parseBezier(morphEase, x=>x),
      fromPts: from,
      toPts: to
    };
  };

  useImperativeHandle(ref, () => ({
    transitionToPalette: startColorMorph,
    morph: startMorph
  }));

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display:"block", ...style }}
    />
  );
});

export default Estelas;

"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* Home hero + Master API story as one pinned, scroll-scrubbed sequence:
   hero at rest → the film and copy break into particles that fly into the dust sphere
   (1 screen) → the sphere condenses into the Master API hub and 6 model nodes branch out
   (2.8 screens). Everything is written imperatively from one rAF loop (no re-renders).
   Spec: design_handoff_hero_transition/README.md (release order "edges-in"). */

const EASE = [0.16, 1, 0.3, 1] as const;

const LINE = [
  { t: "Your" },
  { t: "ascent" },
  { t: "into" },
  { t: "artificial", accent: true },
  { t: "intelligence", accent: true },
  { t: "starts" },
  { t: "here." },
];

export const MODELS = [
  { provider: "OpenAI", name: "GPT", logo: "/logos/openai.svg" },
  { provider: "Anthropic", name: "Claude", logo: "/logos/claude.svg" },
  { provider: "Google", name: "Gemini", logo: "/logos/gemini.svg" },
  { provider: "Meta", name: "Llama", logo: "/logos/meta.svg" },
  { provider: "Mistral", name: "Mistral", logo: "/logos/mistral.svg" },
  { provider: "DeepSeek", name: "DeepSeek", logo: "/logos/deepseek.svg" },
];

const FEATURES = ["One key for every provider", "Swap models by changing one line", "The same request shape everywhere"];

const HANDOFF = 1;      // screens of scroll for the hero → sphere handoff
const STORY = 2.8;      // screens of scroll for the sphere → hub → nodes story
const MEMBERS = 3000;   // particles that make up the sphere
const F = 0.38;         // fraction of the handoff during which hero material is released
const TEXT_BIAS = 0.06; // copy lets go a beat after the film around it
const ENTRANCE_MS = 1700;

const clamp01 = (q: number) => Math.max(0, Math.min(1, q));
const smooth = (q: number) => { q = clamp01(q); return q * q * (3 - 2 * q); };

type Origin = { x: number; y: number; r: number; g: number; b: number; s0: number; lum: number; bias: number };
type Pt = {
  x: number; y: number; z: number; ph: number; c: number; cx: number; cy: number; cz: number;
  hx: number; hy: number; hz: number; jit: number; out: boolean;
  o: Origin | null; member: boolean; sw: number; rj: number; dur: number; dn: number;
};

function makePoints(count: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < count; i++) {
    const y = 1 - ((i + 0.5) / count) * 2, r = Math.sqrt(1 - y * y);
    const th = i * Math.PI * (3 - Math.sqrt(5)) + (Math.random() - 0.5) * 0.08;
    const d = Math.random() < 0.82 ? 1 + (Math.random() - 0.5) * 0.1 : 0.55 + Math.random() * 0.4;
    const ca = Math.random() * Math.PI * 2, cr = Math.pow(Math.random(), 0.6);
    const hy = Math.random() * 2 - 1, hr = Math.sqrt(1 - hy * hy), hth = Math.random() * Math.PI * 2;
    pts.push({ x: Math.cos(th) * r * d, y: y * d, z: Math.sin(th) * r * d, ph: Math.random() * Math.PI * 2,
      c: i % 6, cx: Math.cos(ca) * cr, cy: Math.sin(ca) * cr, cz: (Math.random() - 0.5) * 0.6,
      hx: Math.cos(hth) * hr, hy, hz: Math.sin(hth) * hr, jit: 0.85 + Math.random() * 0.3, out: Math.random() < 0.4,
      o: null, member: true, sw: Math.random() < 0.5 ? -1 : 1, rj: Math.random(), dur: 0.45 + Math.random() * 0.08, dn: 0 });
  }
  return pts;
}

const orbitPos = (i: number, w: number, h: number) => {
  const a = -Math.PI / 2 + (i * Math.PI * 2) / 6;
  return { x: w / 2 + Math.min(w * 0.3, 420) * Math.cos(a), y: h / 2 + Math.min(h * 0.2, 240) * Math.sin(a) };
};

// Edges-in: the hero dissolves from the screen edges toward the centre.
function maskFor(hh: number, w: number, h: number) {
  if (hh <= 0) return null;
  if (hh >= F) return "hidden";
  const dn = 1.42 * (1 - hh / F), cx = w / 2, cy = h / 2, rx = cx * dn, ry = cy * dn;
  return `radial-gradient(ellipse ${rx}px ${ry}px at ${cx}px ${cy}px, #000 ${rx}px, transparent ${rx + 48}px)`;
}

function applyMask(el: HTMLElement, m: string | null) {
  el.style.opacity = m === "hidden" ? "0" : "1";
  const v = m && m !== "hidden" ? m : "none";
  el.style.setProperty("mask-image", v);
  el.style.setProperty("-webkit-mask-image", v);
}

// Every glyph of an element, sampled on a grid into particle origins (positions relative to `sr`).
function sampleText(el: HTMLElement, step: number, out: Origin[], sr: DOMRect, sc: HTMLCanvasElement) {
  const c = sc.getContext("2d", { willReadFrequently: true })!;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), range = document.createRange();
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = (node as Text).data;
    if (!text.trim()) continue;
    const cs = getComputedStyle(node.parentElement!);
    const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const [r, g, b] = (cs.color.match(/[\d.]+/g) || ["255", "255", "255"]).map(Number);
    c.font = font;
    const asc = c.measureText("Hg").fontBoundingBoxAscent || parseFloat(cs.fontSize) * 0.92;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === " ") continue;
      range.setStart(node, i); range.setEnd(node, i + 1);
      const rc = range.getBoundingClientRect();
      if (!rc.width || !rc.height) continue;
      const cw = Math.ceil(rc.width) + 8, chh = Math.ceil(rc.height) + 8;
      if (sc.width < cw || sc.height < chh) { sc.width = Math.max(sc.width, cw); sc.height = Math.max(sc.height, chh); c.font = font; }
      c.clearRect(0, 0, cw, chh); c.fillStyle = "#fff"; c.textBaseline = "alphabetic"; c.fillText(text[i], 4, 4 + asc);
      const d = c.getImageData(0, 0, cw, chh).data;
      for (let y = step / 2; y < chh; y += step) for (let x = step / 2; x < cw; x += step) {
        if (d[((y | 0) * cw + (x | 0)) * 4 + 3] < 110) continue;
        out.push({ x: rc.left - sr.left + x - 4, y: rc.top - sr.top + y - 4, r, g, b, s0: step * 0.85, bias: TEXT_BIAS, lum: 1 });
      }
    }
  }
}

export default function Hero() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const ledeRef = useRef<HTMLParagraphElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<SVGSVGElement>(null);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hubRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLSpanElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);

  // Cursor-tracked volumetric light
  const lx = useMotionValue(50);
  const ly = useMotionValue(40);
  const light = useMotionTemplate`radial-gradient(600px circle at ${lx}% ${ly}%, rgba(52,198,247,0.10), transparent 60%)`;

  function onMove(e: React.MouseEvent) {
    if (reduce || !stickyRef.current) return;
    const r = stickyRef.current.getBoundingClientRect();
    lx.set(((e.clientX - r.left) / r.width) * 100);
    ly.set(((e.clientY - r.top) / r.height) * 100);
  }

  useEffect(() => {
    const sticky = stickyRef.current, stage = stageRef.current, canvas = canvasRef.current, video = videoRef.current;
    if (!sticky || !stage || !canvas || !video) return;
    const ctx = canvas.getContext("2d")!;
    const scratch = document.createElement("canvas"), filmCanvas = document.createElement("canvas");
    const poster = new Image();
    poster.src = "/video/futurex-poster.jpg";
    let P = makePoints(MEMBERS), cur = 0, lastH = -1, needSample = false, textReady = false, visible = true, frame = 0;

    // Sample the hero into particle origins: film cells composited under the scrims, plus every glyph of the copy.
    const resample = () => {
      const w = sticky.clientWidth, h = sticky.clientHeight, sr = sticky.getBoundingClientRect();
      const origins: Origin[] = [];
      const src = video.readyState >= 2 && video.videoWidth ? video : poster.complete && poster.naturalWidth ? poster : null;
      if (src) {
        try {
          const vw = src instanceof HTMLVideoElement ? src.videoWidth : src.naturalWidth;
          const vh = src instanceof HTMLVideoElement ? src.videoHeight : src.naturalHeight;
          const step = Math.max(7, Math.round(w / 120)), W = Math.ceil(w / step), Hh = Math.ceil(h / step);
          filmCanvas.width = W; filmCanvas.height = Hh;
          const c = filmCanvas.getContext("2d", { willReadFrequently: true })!;
          const posX = window.innerWidth >= 768 ? 0.64 : 0.72; // matches object-position on the <video>
          const sc = Math.max(w / vw, h / vh), dw = vw * sc, dh = vh * sc, dx = (w - dw) * posX, dy = (h - dh) * 0.5;
          c.drawImage(src, dx / step, dy / step, dw / step, dh / step);
          const d = c.getImageData(0, 0, W, Hh).data, cells: Origin[] = [];
          for (let j = 0; j < Hh; j++) for (let i = 0; i < W; i++) {
            const k = (j * W + i) * 4;
            let r = d[k], g = d[k + 1], b = d[k + 2];
            const u = (i + 0.5) / W, vv = (j + 0.5) / Hh, y = (j + 0.5) * step;
            const mix = (a: number) => { r = r * (1 - a) + 7 * a; g = g * (1 - a) + 11 * a; b = b * (1 - a) + 20 * a; };
            mix(0.05);                                                       // video opacity .95 over ink
            mix(u < 0.5 ? 1 - 0.2 * (u / 0.5) : 0.8 * (1 - (u - 0.5) / 0.5)); // left scrim
            if (vv > 0.6) mix((vv - 0.6) / 0.4);                             // bottom scrim
            if (y < 96) mix(0.8 * (1 - y / 96));                             // top scrim
            const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
            if (lum >= 0.1) cells.push({ x: (i + 0.5) * step, y, r, g, b, s0: step * 0.8, lum, bias: 0 });
          }
          const pr = 2400 / Math.max(1, cells.length);
          for (const cell of cells) if (Math.random() < pr * (0.45 + cell.lum * 1.1)) origins.push(cell);
        } catch { /* frame unavailable: text particles only */ }
      }
      if (textReady) {
        sampleText(eyebrowRef.current!, 3, origins, sr, scratch);
        sampleText(h1Ref.current!, 6, origins, sr, scratch);
        sampleText(ledeRef.current!, 4, origins, sr, scratch);
      }
      for (let i = origins.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [origins[i], origins[j]] = [origins[j], origins[i]]; }
      const N = Math.max(MEMBERS, origins.length), pts = makePoints(N);
      for (let i = 0; i < N; i++) {
        const q = pts[i], o = origins[i] || null;
        q.o = o; q.member = !o || i < MEMBERS; // the rest are embers that fade out mid-flight
        if (o) q.dn = Math.hypot((o.x - w / 2) / (w / 2), (o.y - h / 2) / (h / 2));
      }
      P = pts;
    };

    const draw = (t: number) => {
      const w = sticky.clientWidth, H = sticky.clientHeight;
      if (!w || !H) return;
      const tgt = Math.max(0, -stage.getBoundingClientRect().top);
      cur = reduce ? tgt : cur + (tgt - cur) * 0.12;
      if (Math.abs(tgt - cur) < 0.05) cur = tgt;
      const hs = HANDOFF * H, h = clamp01(cur / hs), p = clamp01((cur - hs) / (STORY * H));
      if (needSample && h === 0) { needSample = false; resample(); }

      // Hero DOM: dissolve masks, ground fade, video pause
      if (h !== lastH) {
        applyMask(filmRef.current!, maskFor(h, w, H));
        applyMask(copyRef.current!, maskFor(h - TEXT_BIAS, w, H));
        heroBgRef.current!.style.opacity = String(1 - smooth((h - 0.35) / 0.45));
        if (!reduce) { if (h > 0.5 && !video.paused) video.pause(); else if (h <= 0.5 && video.paused) video.play().catch(() => {}); }
        lastH = h;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, w > 1000 ? 1.25 : 2);
      if (canvas.width !== Math.round(w * dpr)) { canvas.width = w * dpr; canvas.height = H * dpr; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const e1 = smooth((p - 0.15) / 0.3); // sphere → FutureX atom (hub halo)
      const e2 = smooth((p - 0.5) / 0.3);  // atom → 6 model nodes branch out
      const spin = reduce ? 0 : t * 0.15;
      const tilt = 0.35, cosT = Math.cos(tilt), sinT = Math.sin(tilt), cosA = Math.cos(spin), sinA = Math.sin(spin);
      const R = Math.min(w, H) * (0.3 + 0.06 * smooth(p / 0.15));
      const Rh = Math.min(w, H) * 0.13, CR = Math.min(w, H) * 0.085;
      const cx = w / 2, cy = H / 2, cspin = t * 0.5;
      const clusters = MODELS.map((_, i) => orbitPos(i, w, H));
      const fade = 1 - smooth((p - 0.9) / 0.1) * 0.35;
      const landing = h < 1, ghostIn = smooth((h - 0.55) / 0.45);

      if (landing && h > 0) {
        const ga = 0.2 * Math.sin(Math.PI * clamp01((h - 0.25) / 0.75));
        if (ga > 0.002) {
          const g = ctx.createRadialGradient(cx * dpr, cy * dpr, 0, cx * dpr, cy * dpr, R * 1.7 * dpr);
          g.addColorStop(0, `rgba(52,198,247,${ga.toFixed(3)})`); g.addColorStop(0.5, `rgba(32,104,216,${(ga * 0.45).toFixed(3)})`); g.addColorStop(1, "rgba(7,11,20,0)");
          ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }

      if (!(landing && h === 0)) for (const q of P) {
        if (!landing && !q.member) continue;
        const breathe = 1 + 0.025 * Math.sin(t * 0.8 + q.ph);
        const x1 = q.x * cosA + q.z * sinA, z1 = -q.x * sinA + q.z * cosA;
        const y2 = q.y * cosT - z1 * sinT, z2 = q.y * sinT + z1 * cosT;
        const s = (3 / (3 - z2)) * breathe;
        const sx = cx + x1 * s * R, sy = cy + y2 * s * R, depth = (z2 + 1) / 2;
        if (!landing) {
          const cl = clusters[q.c], ca = Math.cos(cspin), sa = Math.sin(cspin);
          const tx = cl.x + (q.cx * ca - q.cy * sa) * CR, ty = cl.y + (q.cx * sa + q.cy * ca) * CR * 0.75, td = 0.5 + q.cz;
          const hx1 = q.hx * cosA + q.hz * sinA, hz1 = -q.hx * sinA + q.hz * cosA;
          const hy2 = q.hy * cosT - hz1 * sinT, hz2 = q.hy * sinT + hz1 * cosT;
          const hsc = 3 / (3 - hz2);
          const ux = cx + hx1 * hsc * Rh, uy = cy + hy2 * hsc * Rh, ud = (hz2 + 1) / 2;
          let px = sx + (ux - sx) * e1, py = sy + (uy - sy) * e1, pd = depth + (ud - depth) * e1;
          if (q.out) {
            // Stream out along the spoke with a slight per-particle lag so it reads as a flow, not a jump.
            const k = smooth((e2 - (1 - q.jit) * 0.6) / 0.85);
            px += (tx - px) * k; py += (ty - py) * k; pd += (td - pd) * k;
          }
          ctx.fillStyle = `rgba(255,255,255,${Math.min(1, 0.08 + pd * 0.75) * fade})`;
          ctx.fillRect(px * dpr, py * dpr, (0.6 + pd * 1.1) * dpr, (0.6 + pd * 1.1) * dpr);
          continue;
        }
        // Handoff: hero fragment → its slot on the sphere
        const dsize = 0.6 + depth * 1.1, dalpha = Math.min(1, 0.08 + depth * 0.75);
        if (!q.o) { // ghost: sphere slot with no hero origin, fades in late
          if (ghostIn <= 0) continue;
          ctx.fillStyle = `rgba(255,255,255,${(dalpha * ghostIn).toFixed(3)})`;
          ctx.fillRect(sx * dpr, sy * dpr, dsize * dpr, dsize * dpr);
          continue;
        }
        const delay = Math.max(0, (1 - q.dn / 1.42) * F + q.o.bias - q.rj * 0.05);
        const k = smooth((h - delay) / q.dur);
        if (k <= 0) continue;
        if (k >= 1) {
          if (!q.member) continue;
          ctx.fillStyle = `rgba(255,255,255,${dalpha.toFixed(3)})`;
          ctx.fillRect(sx * dpr, sy * dpr, dsize * dpr, dsize * dpr);
          continue;
        }
        const o = q.o, dx = sx - o.x, dy = sy - o.y, len = Math.hypot(dx, dy) || 1;
        const kk = Math.pow(smooth(k), 1.25);
        const sw = Math.sin(k * Math.PI) * q.sw * 0.22 * len;
        const X = o.x + dx * kk - (dy / len) * sw, Y = o.y + dy * kk + (dx / len) * sw;
        const size = (o.s0 + (dsize - o.s0) * Math.min(1, k * 2)) * (1 + 0.45 * Math.sin(k * Math.PI) * (0.4 + 0.6 * depth));
        const cw = smooth((k - 0.3) / 0.7);
        const r = o.r + (255 - o.r) * cw, g = o.g + (255 - o.g) * cw, b = o.b + (255 - o.b) * cw;
        let a = 1 + (dalpha - 1) * k;
        if (!q.member) a *= 1 - smooth((k - 0.5) / 0.45);
        if (a <= 0.004) continue;
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${a.toFixed(3)})`;
        ctx.fillRect((X - size / 2) * dpr, (Y - size / 2) * dpr, size * dpr, size * dpr);
      }

      // Master API DOM, gated by the handoff
      const hubOp = smooth((p - 0.3) / 0.15), nodeOp = smooth((p - 0.52) / 0.12);
      nodeRefs.current.forEach((el, i) => {
        if (!el) return;
        const b = orbitPos(i, w, H);
        const x = cx + (b.x - cx) * e2, y = cy + (b.y - cy) * e2 + (reduce ? 0 : Math.sin(t * 1.1 + i * 1.3) * 4 * e2);
        el.style.transform = `translate(${x - w / 2}px, ${y - H / 2}px) translate(-50%,-50%) scale(${0.5 + 0.32 * e2})`;
        el.style.opacity = String(nodeOp);
        el.style.borderColor = e2 > 0.95 ? "rgba(52,198,247,.35)" : "rgba(255,255,255,.1)";
        const ln = lineRefs.current[i];
        if (ln) { ln.setAttribute("x1", String(w / 2)); ln.setAttribute("y1", String(H / 2)); ln.setAttribute("x2", String(x)); ln.setAttribute("y2", String(y)); }
      });
      linesRef.current!.style.opacity = String(nodeOp);
      hubRef.current!.style.opacity = String(hubOp);
      hubRef.current!.style.transform = `translate(-50%,-50%) scale(${0.8 + 0.2 * hubOp}) translateY(${reduce ? 0 : Math.sin(t * 0.8) * 4}px)`;
      const pk = (t * 0.9) % 1;
      pulseRef.current!.style.opacity = String(hubOp * (1 - pk) * 0.8);
      pulseRef.current!.style.transform = `scale(${1 + pk * 0.6})`;
      const oi = smooth((h - 0.8) / 0.2) * (1 - smooth((p - 0.08) / 0.12));
      introRef.current!.style.opacity = String(oi);
      introRef.current!.style.transform = `translateY(${(1 - oi) * 24}px)`;
      const hr = smooth((p - 0.3) / 0.22);
      headRef.current!.style.clipPath = `inset(0 ${(1 - hr) * 100}% -10% 0)`;
      const oo = smooth((p - 0.82) / 0.12);
      outroRef.current!.style.opacity = String(oo);
      outroRef.current!.style.transform = `translateY(${(1 - oo) * 24}px)`;
    };

    // Sample once fonts are in and the entrance animation has settled (rects must be untransformed).
    let cancelled = false;
    Promise.all([document.fonts.ready, new Promise((r) => setTimeout(r, reduce ? 0 : ENTRANCE_MS))]).then(() => {
      if (!cancelled) { textReady = true; needSample = true; }
    });
    const onFrame = () => { needSample = true; };
    video.addEventListener("loadeddata", onFrame);
    poster.onload = onFrame;
    if (reduce) video.pause(); else video.play().catch(() => {});
    let rsT = 0;
    const ro = new ResizeObserver(() => { clearTimeout(rsT); rsT = window.setTimeout(onFrame, 150); });
    ro.observe(sticky);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100%" });
    io.observe(sticky);
    const loop = (now: number) => { frame = requestAnimationFrame(loop); if (visible) draw(now / 1000); };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame); ro.disconnect(); io.disconnect(); clearTimeout(rsT);
      video.removeEventListener("loadeddata", onFrame); poster.onload = null;
    };
  }, [reduce]);

  return (
    <section ref={stageRef} id="master-api" className="relative" style={{ height: `${(1 + HANDOFF + STORY) * 100}vh` }}>
      <div ref={stickyRef} onMouseMove={onMove} className="dark-zone sticky top-0 h-screen overflow-hidden">
        {/* Hero ground: fades so the fixed star field shows through as the sphere forms */}
        <div ref={heroBgRef} aria-hidden className="absolute inset-0 bg-ink" />

        {/* Brand film + scrims + cursor light (dissolved by a mask during the handoff) */}
        <div ref={filmRef} aria-hidden className="absolute inset-0">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-[72%_center] opacity-95 md:object-[64%_center]"
            poster="/video/futurex-poster.jpg"
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/video/futurex-loop.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-transparent to-ink" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/80 to-transparent" />
          {!reduce && <motion.div className="absolute inset-0" style={{ background: light }} />}
        </div>

        {/* Hero copy */}
        <div ref={copyRef} className="absolute inset-0 flex items-center">
          <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
            <div className="max-w-3xl">
              <motion.p
                ref={eyebrowRef}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="font-mono text-[0.72rem] tracking-[0.24em] text-accent"
              >
                AN INITIATIVE OF G-TEC EDUCATION
              </motion.p>

              <h1 ref={h1Ref} className="font-display mt-5 flex flex-wrap gap-x-[0.28em] text-balance text-[2.7rem] font-extrabold leading-[1.03] tracking-[-0.025em] text-white drop-shadow-[0_2px_40px_rgba(7,11,20,0.9)] sm:text-6xl md:text-[4.6rem] xl:text-[5.6rem]">
                {LINE.map((w, i) => (
                  <span key={i} className="inline-block overflow-hidden pb-[0.12em]">
                    <motion.span
                      initial={reduce ? false : { y: "110%", filter: "blur(12px)", opacity: 0 }}
                      animate={{ y: "0%", filter: "blur(0px)", opacity: 1 }}
                      transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease: EASE }}
                      className={`inline-block ${w.accent ? "text-sky" : ""}`}
                    >
                      {w.t}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.p
                ref={ledeRef}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
                className="mt-7 max-w-xl text-lg leading-relaxed text-lite/85 drop-shadow-[0_1px_20px_rgba(7,11,20,0.9)] xl:text-xl"
              >
                A four-level certification ladder, from your first prompt to deployed
                AI agents and foundation-model operations. Hands-on labs, industry
                projects, internships, and placement support.
              </motion.p>
            </div>
          </div>
        </div>

        {/* Particles: hero fragments + dust sphere + model streams */}
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
        <svg ref={linesRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full opacity-0">
          {MODELS.map((_, i) => (
            <line key={i} ref={(el) => { lineRefs.current[i] = el; }} stroke="#34c6f7" strokeWidth={1} strokeOpacity={0.55} />
          ))}
        </svg>

        {/* Sphere caption */}
        <div ref={introRef} className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-[9vh] text-center opacity-0">
          <p className="font-mono text-[0.7rem] tracking-[0.24em] text-accent">MASTER API</p>
          <p className="font-display mt-2.5 text-[clamp(1.3rem,2.4vw,2rem)] font-bold tracking-tight text-white">Every frontier model, held in one sphere.</p>
          <p className="mt-2 text-sm text-sky-dim">Keep scrolling to break it open.</p>
        </div>

        {/* Headline wipe */}
        <div ref={headRef} className="pointer-events-none absolute inset-x-0 top-[max(11vh,6.5rem)] flex justify-center px-6 text-center" style={{ clipPath: "inset(0 100% -10% 0)" }}>
          <h2 className="font-display max-w-5xl text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white">
            One key. <span className="text-sky">Every frontier model.</span>
          </h2>
        </div>

        {/* Model nodes */}
        {MODELS.map((m, i) => (
          <div
            key={m.name}
            ref={(el) => { nodeRefs.current[i] = el; }}
            className="absolute left-1/2 top-1/2 flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-ink-2/85 px-5 py-3.5 text-center opacity-0 shadow-[0_14px_30px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md will-change-transform"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.logo} alt="" className="h-9 w-9" />
            <span className="font-display text-base font-bold text-white">{m.name}</span>
            <span className="text-[0.66rem] uppercase tracking-[0.14em] text-sky-dim">{m.provider}</span>
          </div>
        ))}

        {/* Hub */}
        <div ref={hubRef} className="absolute left-1/2 top-1/2 flex h-[168px] w-[168px] flex-col items-center justify-center gap-2 rounded-3xl border border-accent/40 bg-ink-2 text-center opacity-0 shadow-card-lg will-change-transform">
          <span ref={pulseRef} aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl border border-accent opacity-0" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/logo-white.png" alt="FutureX" className="h-[26px] w-auto" />
          <span className="font-display text-base font-bold leading-tight text-white">Master API</span>
          <span className="font-mono text-[0.6rem] tracking-[0.16em] text-accent">ONE ENDPOINT</span>
        </div>

        {/* Outro */}
        <div ref={outroRef} className="pointer-events-none absolute inset-x-0 bottom-[8vh] flex flex-col items-center gap-5 px-6 text-center opacity-0">
          <p className="max-w-2xl text-pretty text-[clamp(1rem,1.3vw,1.15rem)] leading-relaxed text-body-soft">
            Master API puts GPT, Claude, Gemini, Llama, Mistral, and DeepSeek behind a single endpoint. Build once, then switch models without rewriting a line of integration code.
          </p>
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm text-body-soft">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" />{f}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

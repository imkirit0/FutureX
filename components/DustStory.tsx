"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/* Pinned scroll story: dust sphere → bursts into 6 model clusters → re-gathers around the Master API hub.
   Scroll progress drives everything; the canvas and node positions are written imperatively (no re-renders). */

export const MODELS = [
  { provider: "OpenAI", name: "GPT", logo: "/logos/openai.svg" },
  { provider: "Anthropic", name: "Claude", logo: "/logos/claude.svg" },
  { provider: "Google", name: "Gemini", logo: "/logos/gemini.svg" },
  { provider: "Meta", name: "Llama", logo: "/logos/meta.svg" },
  { provider: "Mistral", name: "Mistral", logo: "/logos/mistral.svg" },
  { provider: "DeepSeek", name: "DeepSeek", logo: "/logos/deepseek.svg" },
];

const FEATURES = ["One key for every provider", "Swap models by changing one line", "The same request shape everywhere"];

const clamp01 = (q: number) => Math.max(0, Math.min(1, q));
const smooth = (q: number) => { q = clamp01(q); return q * q * (3 - 2 * q); };

type Pt = { x: number; y: number; z: number; ph: number; c: number; cx: number; cy: number; cz: number; hx: number; hy: number; hz: number; jit: number };

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
      hx: Math.cos(hth) * hr, hy, hz: Math.sin(hth) * hr, jit: 0.85 + Math.random() * 0.3 });
  }
  return pts;
}

const clusterPos = (i: number, w: number, h: number) => {
  const a = -Math.PI / 2 + (i * Math.PI * 2) / 6;
  return { x: w / 2 + Math.min(w * 0.36, 480) * Math.cos(a), y: h / 2 + 0.07 * h + Math.min(h * 0.3, 300) * Math.sin(a) };
};
const orbitPos = (i: number, w: number, h: number) => {
  const a = -Math.PI / 2 + (i * Math.PI * 2) / 6;
  return { x: w / 2 + Math.min(w * 0.24, 320) * Math.cos(a), y: h / 2 + Math.min(h * 0.22, 210) * Math.sin(a) };
};

export default function DustStory({ className, particleCount = 3000, pinLength = 3.8, showLines = true }: {
  className?: string; particleCount?: number; pinLength?: number; showLines?: boolean;
}) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const linesRef = useRef<SVGSVGElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLSpanElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const pts = useRef<Pt[]>([]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => { progress.current = v; });

  useEffect(() => { pts.current = makePoints(particleCount); }, [particleCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let visible = true, frame = 0;

    const draw = (t: number) => {
      const p = progress.current;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, w > 1000 ? 1.25 : 2);
      if (canvas.width !== Math.round(w * dpr)) { canvas.width = w * dpr; canvas.height = h * dpr; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const e1 = smooth((p - 0.2) / 0.3);   // sphere → clusters
      const e2 = smooth((p - 0.7) / 0.24);  // clusters → hub
      const burst = Math.sin(Math.PI * e1) * Math.min(w, h) * 0.22;
      const spin = reduce ? 0 : t * 0.15;
      const tilt = 0.35, cosT = Math.cos(tilt), sinT = Math.sin(tilt), cosA = Math.cos(spin), sinA = Math.sin(spin);
      const R = Math.min(w, h) * (0.3 + 0.06 * smooth(p / 0.2));
      const Rh = Math.min(w, h) * 0.13, CR = Math.min(w, h) * 0.085;
      const cx = w / 2, cy = h / 2, cspin = t * 0.5;
      const clusters = MODELS.map((_, i) => clusterPos(i, w, h));
      const fade = 1 - smooth((p - 0.9) / 0.1) * 0.35;

      for (const q of pts.current) {
        const breathe = 1 + 0.025 * Math.sin(t * 0.8 + q.ph);
        const x1 = q.x * cosA + q.z * sinA, z1 = -q.x * sinA + q.z * cosA;
        const y2 = q.y * cosT - z1 * sinT, z2 = q.y * sinT + z1 * cosT;
        const s = (3 / (3 - z2)) * breathe;
        const sx = cx + x1 * s * R, sy = cy + y2 * s * R, depth = (z2 + 1) / 2;
        const cl = clusters[q.c], ca = Math.cos(cspin), sa = Math.sin(cspin);
        const tx = cl.x + (q.cx * ca - q.cy * sa) * CR, ty = cl.y + (q.cx * sa + q.cy * ca) * CR * 0.75, td = 0.5 + q.cz;
        const hx1 = q.hx * cosA + q.hz * sinA, hz1 = -q.hx * sinA + q.hz * cosA;
        const hy2 = q.hy * cosT - hz1 * sinT, hz2 = q.hy * sinT + hz1 * cosT;
        const hs = 3 / (3 - hz2);
        const ux = cx + hx1 * hs * Rh, uy = cy + hy2 * hs * Rh, ud = (hz2 + 1) / 2;
        let px = sx + (tx - sx) * e1, py = sy + (ty - sy) * e1, pd = depth + (td - depth) * e1;
        if (burst > 0) { const dx = px - cx, dy = py - cy, len = Math.hypot(dx, dy) || 1; px += (dx / len) * burst * q.jit; py += (dy / len) * burst * q.jit; }
        px += (ux - px) * e2; py += (uy - py) * e2; pd += (ud - pd) * e2;
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, 0.08 + pd * 0.75) * fade})`;
        ctx.fillRect(px * dpr, py * dpr, (0.6 + pd * 1.1) * dpr, (0.6 + pd * 1.1) * dpr);
      }

      const nodeOp = smooth((p - 0.38) / 0.14), hubOp = smooth((p - 0.84) / 0.12);
      nodeRefs.current.forEach((el, i) => {
        if (!el) return;
        const a = clusterPos(i, w, h), b = orbitPos(i, w, h);
        const x = a.x + (b.x - a.x) * e2, y = a.y + (b.y - a.y) * e2 + (reduce ? 0 : Math.sin(t * 1.1 + i * 1.3) * 4);
        el.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px) translate(-50%,-50%) scale(${(0.9 + 0.1 * nodeOp) * (1 - 0.18 * e2)})`;
        el.style.opacity = String(nodeOp);
        el.style.borderColor = e2 > 0.95 ? "rgba(52,198,247,.35)" : "rgba(255,255,255,.1)";
        const ln = lineRefs.current[i];
        if (ln) { ln.setAttribute("x1", String(w / 2)); ln.setAttribute("y1", String(h / 2)); ln.setAttribute("x2", String(x)); ln.setAttribute("y2", String(y)); }
      });
      if (linesRef.current) linesRef.current.style.opacity = String(showLines ? hubOp : 0);
      if (hubRef.current) { hubRef.current.style.opacity = String(hubOp); hubRef.current.style.transform = `translate(-50%,-50%) scale(${0.8 + 0.2 * hubOp}) translateY(${reduce ? 0 : Math.sin(t * 0.8) * 4}px)`; }
      if (pulseRef.current) { const k = (t * 0.9) % 1; pulseRef.current.style.opacity = String(hubOp * (1 - k) * 0.8); pulseRef.current.style.transform = `scale(${1 + k * 0.6})`; }
      if (introRef.current) { const o = 1 - smooth((p - 0.08) / 0.12); introRef.current.style.opacity = String(o); introRef.current.style.transform = `translateY(${(1 - o) * 30}px)`; }
      if (headRef.current) { const r = smooth((p - 0.3) / 0.22); headRef.current.style.clipPath = `inset(0 ${(1 - r) * 100}% -10% 0)`; headRef.current.style.transform = `translateY(${-e2 * 2}vh)`; }
      if (outroRef.current) { outroRef.current.style.opacity = String(hubOp); outroRef.current.style.transform = `translateY(${(1 - hubOp) * 24}px)`; }
    };

    const loop = (now: number) => { frame = requestAnimationFrame(loop); if (visible) draw(now / 1000); };
    frame = requestAnimationFrame(loop);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100%" });
    io.observe(canvas);
    return () => { cancelAnimationFrame(frame); io.disconnect(); };
  }, [reduce, showLines]);

  return (
    <section ref={sectionRef} id="master-api" className={cn("relative", className)} style={{ height: `${pinLength * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
        <svg ref={linesRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full opacity-0">
          {MODELS.map((_, i) => (
            <line key={i} ref={(el) => { lineRefs.current[i] = el; }} stroke="#34c6f7" strokeWidth={1} strokeOpacity={0.55} />
          ))}
        </svg>

        {/* Phase 0 caption */}
        <div ref={introRef} className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-[9vh] text-center">
          <p className="font-mono text-[0.7rem] tracking-[0.24em] text-accent">MASTER API</p>
          <p className="font-display mt-2.5 text-[clamp(1.3rem,2.4vw,2rem)] font-bold tracking-tight text-white">Every frontier model, held in one sphere.</p>
          <p className="mt-2 text-sm text-sky-dim">Keep scrolling to break it open.</p>
        </div>

        {/* Headline wipe */}
        <div ref={headRef} className="pointer-events-none absolute inset-x-0 top-[7vh] flex justify-center px-6 text-center" style={{ clipPath: "inset(0 100% -10% 0)" }}>
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

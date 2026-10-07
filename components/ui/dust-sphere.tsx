"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type DustSphereProps = {
  className?: string;
  count?: number;
  /** Sphere radius as a fraction of the canvas' shorter side. */
  radius?: number;
  speed?: number;
  color?: string;
  /** Change this value to make the globe pulse once. */
  pulseKey?: unknown;
  /** Tilt toward the cursor. */
  interactive?: boolean;
  /** Scales dot size and brightness; raise it for large, distant horizons. */
  intensity?: number;
};

// A slowly rotating globe of dust particles, drawn on a 2D canvas.
export function DustSphere({
  className,
  count = 2200,
  radius = 0.42,
  speed = 0.15,
  color = "255,255,255",
  pulseKey,
  interactive = false,
  intensity = 1,
}: DustSphereProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pulseAt = useRef(-10);

  useEffect(() => {
    pulseAt.current = performance.now() / 1000;
  }, [pulseKey]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Mostly a shell (Fibonacci-spread, jittered), with some dust drifting inside it.
    const pts = Array.from({ length: count }, (_, i) => {
      const y = 1 - ((i + 0.5) / count) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = i * Math.PI * (3 - Math.sqrt(5)) + (Math.random() - 0.5) * 0.08;
      const d = Math.random() < 0.82 ? 1 + (Math.random() - 0.5) * 0.1 : 0.55 + Math.random() * 0.4;
      return { x: Math.cos(th) * r * d, y: y * d, z: Math.sin(th) * r * d, ph: Math.random() * Math.PI * 2 };
    });

    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      w = canvas.clientWidth;
      // Large canvases get a lower pixel ratio to keep each frame cheap.
      dpr = Math.min(window.devicePixelRatio || 1, w > 1000 ? 1.25 : 2);
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    };
    resize();

    // Cursor steering: eased toward a target yaw/pitch offset.
    const look = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      look.tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / r.width)) * 0.9;
      look.ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / r.height)) * 0.6;
    };
    if (interactive && !reduce) window.addEventListener("pointermove", onPointer, { passive: true });

    const draw = (t: number) => {
      look.x += (look.tx - look.x) * 0.05;
      look.y += (look.ty - look.y) * 0.05;
      const a = t * speed + look.x;
      const tilt = 0.35 + look.y;
      const cosT = Math.cos(tilt), sinT = Math.sin(tilt);
      const cosA = Math.cos(a), sinA = Math.sin(a);
      const kick = 1 + 0.07 * Math.exp(-Math.max(0, t - pulseAt.current) * 4);
      const R = Math.min(w, h) * radius * dpr * kick;
      const cx = (w * dpr) / 2, cy = (h * dpr) / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        const breathe = 1 + 0.025 * Math.sin(t * 0.8 + p.ph);
        // rotate around Y, then tilt around X
        const x1 = p.x * cosA + p.z * sinA;
        const z1 = -p.x * sinA + p.z * cosA;
        const y2 = p.y * cosT - z1 * sinT;
        const z2 = p.y * sinT + z1 * cosT;
        const s = (3 / (3 - z2)) * breathe; // perspective
        const depth = (z2 + 1) / 2; // 0 back → 1 front
        const size = (0.6 + depth * 1.1) * dpr * intensity;
        ctx.fillStyle = `rgba(${color},${Math.min(1, (0.08 + depth * 0.75) * intensity)})`;
        ctx.fillRect(cx + x1 * s * R, cy + y2 * s * R, size, size);
      }
    };

    let frame = 0;
    let visible = true;
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (visible) draw(now / 1000);
    };
    if (reduce) draw(0);
    else frame = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(0);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      ro.disconnect();
      io.disconnect();
    };
  }, [count, radius, speed, color, interactive, intensity]);

  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none h-full w-full", className)} />;
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const ASCII_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*|\\/\"'`~?";
const generateCode = (cols: number, rows: number) =>
  Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)]).join(""),
  ).join("\n");

type Card = { src: string; alt: string };

type ScannerCardStreamProps = {
  cards: Card[];
  cardWidth?: number;
  cardHeight?: number;
  initialSpeed?: number;
  direction?: -1 | 1;
  repeat?: number;
  cardGap?: number;
  friction?: number;
  scanEffect?: "clip" | "scramble";
};

export function ScannerCardStream({
  cards: cardImages,
  cardWidth = 400,
  cardHeight = 250,
  initialSpeed = 150,
  direction = -1,
  repeat = 3,
  cardGap = 60,
  friction = 0.95,
  scanEffect = "scramble",
}: ScannerCardStreamProps) {
  const [isScanning, setIsScanning] = useState(false);
  const cols = Math.floor(cardWidth / 6.5);
  const rows = Math.floor(cardHeight / 13);

  const cards = useMemo(
    () =>
      Array.from({ length: cardImages.length * repeat }, (_, i) => ({
        id: i,
        ...cardImages[i % cardImages.length],
        ascii: generateCode(cols, rows),
      })),
    [cardImages, repeat, cols, rows],
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const cardLineRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const scannerCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const cardLine = cardLineRef.current;
    const particleCanvas = particleCanvasRef.current;
    const scannerCanvas = scannerCanvasRef.current;
    if (!root || !cardLine || !particleCanvas || !scannerCanvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scannerH = cardHeight + 50;
    let width = root.offsetWidth;
    const stream = { position: 0, velocity: initialSpeed, minVelocity: 30, lastTime: performance.now() };
    const cardLineWidth = (cardWidth + cardGap) * cards.length;
    const timers = new Set<ReturnType<typeof setInterval>>();
    let scanning = false;
    let visible = true;
    let frame = 0;

    // Ambient particles (WebGL)
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-width / 2, width / 2, cardHeight / 2, -cardHeight / 2, 1, 1000);
    camera.position.z = 100;
    const renderer = new THREE.WebGLRenderer({ canvas: particleCanvas, alpha: true, antialias: true });
    renderer.setSize(width, cardHeight, false);
    renderer.setClearColor(0x000000, 0);

    const particleCount = 400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * width * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * cardHeight;
      velocities[i] = Math.random() * 60 + 30;
      alphas[i] = (Math.random() * 8 + 2) / 10;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));

    const texCanvas = document.createElement("canvas");
    texCanvas.width = texCanvas.height = 100;
    const texCtx = texCanvas.getContext("2d")!;
    const gradient = texCtx.createRadialGradient(50, 50, 0, 50, 50, 50);
    gradient.addColorStop(0.025, "#fff");
    gradient.addColorStop(0.1, "hsl(196, 70%, 40%)");
    gradient.addColorStop(0.25, "hsl(217, 64%, 6%)");
    gradient.addColorStop(1, "transparent");
    texCtx.fillStyle = gradient;
    texCtx.arc(50, 50, 50, 0, Math.PI * 2);
    texCtx.fill();
    const texture = new THREE.CanvasTexture(texCanvas);

    const material = new THREE.ShaderMaterial({
      uniforms: { pointTexture: { value: texture } },
      vertexShader: `attribute float alpha; varying float vAlpha; void main() { vAlpha = alpha; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_PointSize = 15.0; gl_Position = projectionMatrix * mvPosition; }`,
      fragmentShader: `uniform sampler2D pointTexture; varying float vAlpha; void main() { gl_FragColor = vec4(1.0, 1.0, 1.0, vAlpha) * texture2D(pointTexture, gl_PointCoord); }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    scene.add(new THREE.Points(geometry, material));

    // Scanner sparks (2D canvas)
    const ctx = scannerCanvas.getContext("2d")!;
    scannerCanvas.width = width;
    scannerCanvas.height = scannerH;
    type Spark = { x: number; y: number; vx: number; vy: number; radius: number; alpha: number; life: number; decay: number };
    const spark = (): Spark => ({
      x: width / 2 + (Math.random() - 0.5) * 3,
      y: Math.random() * scannerH,
      vx: Math.random() * 0.8 + 0.2,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 0.6 + 0.4,
      alpha: Math.random() * 0.4 + 0.6,
      life: 1,
      decay: Math.random() * 0.02 + 0.005,
    });
    const baseSparks = 800;
    const scanSparks = 2500;
    let maxSparks = baseSparks;
    const sparks: Spark[] = Array.from({ length: baseSparks }, spark);

    const scramble = (el: HTMLElement, original: string) => {
      if (el.dataset.scrambling) return;
      el.dataset.scrambling = "true";
      let n = 0;
      const t = setInterval(() => {
        el.textContent = generateCode(cols, rows);
        if (++n >= 10) {
          clearInterval(t);
          timers.delete(t);
          el.textContent = original;
          delete el.dataset.scrambling;
        }
      }, 30);
      timers.add(t);
    };

    const wrappers = Array.from(cardLine.querySelectorAll<HTMLElement>(".card-wrapper"));
    const updateCardEffects = () => {
      const rootLeft = root.getBoundingClientRect().left;
      const scannerLeft = rootLeft + width / 2 - 4;
      const scannerRight = rootLeft + width / 2 + 4;
      let any = false;
      wrappers.forEach((wrapper, i) => {
        const rect = wrapper.getBoundingClientRect();
        const normal = wrapper.querySelector<HTMLElement>(".card-normal")!;
        const ascii = wrapper.querySelector<HTMLElement>(".card-ascii")!;
        if (rect.left < scannerRight && rect.right > scannerLeft) {
          any = true;
          if (scanEffect === "scramble" && wrapper.dataset.scanned !== "true") {
            scramble(ascii.querySelector("pre")!, cards[i].ascii);
          }
          wrapper.dataset.scanned = "true";
          normal.style.setProperty("--clip-right", `${(Math.max(scannerLeft - rect.left, 0) / rect.width) * 100}%`);
          ascii.style.setProperty("--clip-left", `${(Math.min(scannerRight - rect.left, rect.width) / rect.width) * 100}%`);
        } else {
          delete wrapper.dataset.scanned;
          const passed = rect.right < scannerLeft ? "100%" : "0%";
          normal.style.setProperty("--clip-right", passed);
          ascii.style.setProperty("--clip-left", passed);
        }
      });
      if (any !== scanning) {
        scanning = any;
        setIsScanning(any);
      }
    };

    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      const dt = Math.min((now - stream.lastTime) / 1000, 0.1);
      stream.lastTime = now;
      if (!visible) return;

      if (stream.velocity > stream.minVelocity) stream.velocity *= friction;
      stream.position += stream.velocity * direction * dt;
      if (stream.position < -cardLineWidth) stream.position = width;
      else if (stream.position > width) stream.position = -cardLineWidth;
      cardLine.style.transform = `translateX(${stream.position}px)`;
      updateCardEffects();

      const time = now * 0.001;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i] * 0.016;
        if (positions[i * 3] > width / 2 + 100) positions[i * 3] = -width / 2 - 100;
        positions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.5;
        alphas[i] = Math.max(0.1, Math.min(1, alphas[i] + (Math.random() - 0.5) * 0.05));
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.alpha.needsUpdate = true;
      renderer.render(scene, camera);

      ctx.clearRect(0, 0, width, scannerH);
      maxSparks += ((scanning ? scanSparks : baseSparks) - maxSparks) * 0.05;
      while (sparks.length < maxSparks) sparks.push(spark());
      while (sparks.length > maxSparks) sparks.pop();
      ctx.fillStyle = "white";
      for (const p of sparks) {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0 || p.x > width) Object.assign(p, spark());
        ctx.globalAlpha = p.alpha * p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    frame = requestAnimationFrame(animate);

    // Skip work while offscreen; keep canvases sized to the container.
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(root);
    const ro = new ResizeObserver(() => {
      width = root.offsetWidth;
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, cardHeight, false);
      scannerCanvas.width = width;
    });
    ro.observe(root);

    return () => {
      cancelAnimationFrame(frame);
      timers.forEach(clearInterval);
      io.disconnect();
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [cards, cardWidth, cardHeight, cardGap, friction, scanEffect, initialSpeed, direction, cols, rows]);

  return (
    <div
      ref={rootRef}
      className="relative flex w-full items-center overflow-hidden"
      style={{ height: cardHeight + 80 }}
    >
      <canvas
        ref={particleCanvasRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 z-0 w-full -translate-y-1/2"
        style={{ height: cardHeight }}
      />
      <canvas
        ref={scannerCanvasRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 z-10 w-full -translate-y-1/2"
        style={{ height: cardHeight + 50 }}
      />
      <div
        aria-hidden
        className={`animate-scan-pulse pointer-events-none absolute left-1/2 top-1/2 z-20 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-transparent via-accent to-transparent transition-opacity duration-300 ${
          isScanning ? "opacity-100" : "opacity-0"
        }`}
        style={{
          height: cardHeight + 30,
          boxShadow: "0 0 10px #7cdcfb, 0 0 20px #7cdcfb, 0 0 30px #34c6f7, 0 0 50px #34c6f7",
        }}
      />

      <div ref={cardLineRef} className="flex items-center whitespace-nowrap will-change-transform" style={{ gap: cardGap }}>
        {cards.map((card) => (
          <div key={card.id} className="card-wrapper relative shrink-0" style={{ width: cardWidth, height: cardHeight }}>
            <div className="card-normal absolute inset-0 z-[2] overflow-hidden rounded-2xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.4)] [clip-path:inset(0_0_0_var(--clip-right,0%))]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.src}
                alt={card.id < cardImages.length ? card.alt : ""}
                loading="lazy"
                className="h-full w-full object-cover brightness-110 contrast-110"
              />
            </div>
            <div aria-hidden className="card-ascii absolute inset-0 z-[1] overflow-hidden rounded-2xl [clip-path:inset(0_calc(100%-var(--clip-left,0%))_0_0)]">
              <pre suppressHydrationWarning className="animate-glitch absolute inset-0 m-0 overflow-hidden whitespace-pre p-0 font-mono text-[11px] leading-[13px] text-[rgba(168,198,255,0.6)] [mask-image:linear-gradient(to_right,#000_0%,rgba(0,0,0,0.8)_30%,rgba(0,0,0,0.6)_50%,rgba(0,0,0,0.4)_80%,rgba(0,0,0,0.2)_100%)]">
                {card.ascii}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

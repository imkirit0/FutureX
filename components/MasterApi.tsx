"use client";

import {
  AnimatePresence,
  motion,
  type MotionValue,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { KeyRound, Layers, MousePointerClick, Pause, Play, Repeat2, Waypoints } from "lucide-react";
import { Container } from "@/components/ui/section";
import { DustSphere } from "@/components/ui/dust-sphere";
import { BlurIn, FadeIn } from "@/components/ui/text";
import { cn, EASE_OUT } from "@/lib/utils";

const MODELS = [
  { provider: "OpenAI", name: "GPT", id: "openai/gpt", logo: "/logos/openai.svg" },
  { provider: "Anthropic", name: "Claude", id: "anthropic/claude", logo: "/logos/claude.svg" },
  { provider: "Google", name: "Gemini", id: "google/gemini", logo: "/logos/gemini.svg" },
  { provider: "Meta", name: "Llama", id: "meta/llama", logo: "/logos/meta.svg" },
  { provider: "Mistral", name: "Mistral", id: "mistral/mistral-large", logo: "/logos/mistral.svg" },
  { provider: "DeepSeek", name: "DeepSeek", id: "deepseek/deepseek-chat", logo: "/logos/deepseek.svg" },
];

// Sample outputs, labelled as such in the UI.
const PROMPTS = [
  {
    ask: "Explain RAG in one line",
    answer:
      "RAG retrieves the most relevant passages from your own data and hands them to the model, so answers are grounded in sources instead of memory.",
  },
  {
    ask: "What is an AI agent?",
    answer:
      "An AI agent is a model that plans steps, calls tools, and checks its own results until a goal is done, not just a single reply.",
  },
  {
    ask: "Say hello in Hindi",
    answer: "नमस्ते (namaste). Use it as a warm, respectful hello at any time of day.",
  },
];

const FEATURES = [
  { Icon: KeyRound, t: "One key for every provider" },
  { Icon: Repeat2, t: "Swap models by changing one line" },
  { Icon: Layers, t: "The same request shape everywhere" },
];

// Diagram geometry (SVG viewBox 0 0 400 400): models ride a tilted elliptical orbit.
const C = 200;
const RX = 152;
const RY = 116;
const BASE_SPEED = 0.12; // rad/s
const orbit = (i: number, theta: number) => {
  const a = -Math.PI / 2 + (i * Math.PI * 2) / MODELS.length + theta;
  return { x: C + RX * Math.cos(a), y: C + RY * Math.sin(a), depth: (Math.sin(a) + 1) / 2 };
};
const easeInOut = (q: number) => (q < 0.5 ? 2 * q * q : 1 - (-2 * q + 2) ** 2 / 2);
const clamp01 = (q: number) => Math.max(0, Math.min(1, q));

const CYCLE_MS = 3600;
const OUT = 0.25; // request leaves the hub
const ARRIVE = OUT + 0.8; // request reaches the model

export default function MasterApi() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { margin: "-25%" });
  const [active, setActive] = useState(1);
  const [prompt, setPrompt] = useState(0);
  const [auto, setAuto] = useState(true);
  const [typed, setTyped] = useState(MODELS[1].id.length);
  const [words, setWords] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "center center"] });
  const hubScale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);

  // Auto-route through the models while on screen.
  useEffect(() => {
    if (!inView || !auto) return;
    const t = setInterval(() => setActive((a) => (a + 1) % MODELS.length), CYCLE_MS);
    return () => clearInterval(t);
  }, [inView, auto]);

  // Type the model id, then stream the sample answer word by word.
  const answer = PROMPTS[prompt].answer.split(" ");
  useEffect(() => {
    const id = MODELS[active].id;
    if (reduce) {
      setTyped(id.length);
      setWords(answer.length);
      return;
    }
    setTyped(0);
    setWords(0);
    let n = 0;
    let w = 0;
    let stream: ReturnType<typeof setInterval> | undefined;
    const type = setInterval(() => {
      setTyped(++n);
      if (n < id.length) return;
      clearInterval(type);
      stream = setInterval(() => {
        setWords(++w);
        if (w >= answer.length && stream) clearInterval(stream);
      }, 55);
    }, 28);
    return () => {
      clearInterval(type);
      if (stream) clearInterval(stream);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, prompt, reduce]);

  const route = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  const model = MODELS[active];
  const streaming = words < answer.length;

  return (
    <section
      ref={sectionRef}
      id="master-api"
      className="relative flex min-h-[100svh] items-center overflow-hidden py-24 md:py-28"
    >
      <Container size="wide" className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10 xl:gap-16">
          {/* Copy + playground */}
          <div className="lg:col-span-5">
            <BlurIn
              as="h2"
              text="One key. Every frontier model."
              className="font-display text-balance text-[2.6rem] font-bold leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl xl:text-[4.5rem]"
            />
            <FadeIn delay={0.15}>
              <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-body-soft">
                Master API puts GPT, Claude, Gemini, Llama, Mistral, and DeepSeek behind a single
                endpoint. Build once, then switch models without rewriting a line of integration code.
              </p>
            </FadeIn>

            {/* Prompt picker */}
            <FadeIn delay={0.22} className="mt-9">
              <div role="radiogroup" aria-label="Try a prompt" className="flex flex-wrap gap-2">
                {PROMPTS.map((p, i) => (
                  <button
                    key={p.ask}
                    type="button"
                    role="radio"
                    aria-checked={i === prompt}
                    onClick={() => setPrompt(i)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                      i === prompt
                        ? "border-accent/60 bg-accent/10 text-white"
                        : "border-white/10 bg-white/[0.03] text-body-soft hover:border-white/25 hover:text-white",
                    )}
                  >
                    {p.ask}
                  </button>
                ))}
              </div>
            </FadeIn>

            {/* Request / response */}
            <FadeIn delay={0.28} className="mt-5">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-2/80 shadow-card-lg backdrop-blur-xl">
                <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="ml-3 font-mono text-xs text-sky-dim">request.ts</span>
                </div>
                <pre className="whitespace-pre-wrap break-words px-5 py-5 font-mono text-[0.8rem] leading-relaxed text-body-soft sm:text-[0.85rem]">
                  <code>
                    <span className="text-accent">const</span> res = <span className="text-accent">await</span> masterApi.chat({"{"}
                    {"\n"}  model: <span className="text-sky">&quot;{model.id.slice(0, typed)}</span>
                    {typed < model.id.length && (
                      <span className="inline-block h-[1.1em] w-[0.5em] translate-y-[0.2em] bg-accent" aria-hidden />
                    )}
                    <span className="text-sky">&quot;</span>,
                    {"\n"}  messages: [{"{"} role: <span className="text-sky">&quot;user&quot;</span>, content:{" "}
                    <span className="text-sky">&quot;{PROMPTS[prompt].ask}&quot;</span> {"}"}],
                    {"\n"}{"}"});
                  </code>
                </pre>

                <div className="border-t border-white/8 bg-ink/40 px-5 py-4">
                  <div className="flex items-center gap-2.5 text-sm">
                    <span className="relative flex h-2 w-2">
                      {!reduce && streaming && (
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                      )}
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    <span className="text-sky-dim">{streaming ? "Streaming from" : "Answered by"}</span>
                    <span className="relative inline-flex h-5 min-w-[9rem] overflow-hidden">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={model.id}
                          initial={reduce ? false : { y: "100%", opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={reduce ? undefined : { y: "-100%", opacity: 0 }}
                          transition={{ duration: 0.45, ease: EASE_OUT }}
                          className="inline-flex items-center gap-1.5 font-medium text-white"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={model.logo} alt="" className="h-4 w-4" />
                          {model.provider === model.name ? model.name : `${model.provider} ${model.name}`}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <span className="ml-auto text-xs text-sky-dim">Sample output</span>
                  </div>
                  <p className="mt-3 min-h-[4.5rem] text-[0.95rem] leading-relaxed text-body" aria-live="polite">
                    {answer.slice(0, words).map((w, i) => (
                      <motion.span
                        key={`${active}-${prompt}-${i}`}
                        initial={reduce ? false : { opacity: 0, filter: "blur(6px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.35 }}
                      >
                        {w}{" "}
                      </motion.span>
                    ))}
                    {streaming && !reduce && (
                      <span className="inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse bg-accent" aria-hidden />
                    )}
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.34}>
              <ul className="mt-8 flex flex-col gap-3 text-sm text-body-soft sm:flex-row sm:flex-wrap sm:gap-x-6">
                {FEATURES.map(({ Icon, t }) => (
                  <li key={t} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>

          {/* Routing hub */}
          <div className="lg:col-span-7">
            <OrbitHub active={active} pulse={`${active}-${prompt}`} onRoute={route} reduce={!!reduce} scale={hubScale} />

            {/* Controls */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-sky-dim">
              <button
                type="button"
                onClick={() => setAuto((a) => !a)}
                aria-pressed={auto}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-medium text-body transition-colors hover:border-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {auto ? <Pause className="h-3.5 w-3.5" aria-hidden /> : <Play className="h-3.5 w-3.5" aria-hidden />}
                {auto ? "Pause auto-routing" : "Resume auto-routing"}
              </button>
              <span className="inline-flex items-center gap-2">
                <MousePointerClick className="h-4 w-4 text-accent" aria-hidden />
                Drag to spin the orbit, click a model to route
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function OrbitHub({
  active,
  pulse,
  onRoute,
  reduce,
  scale,
}: {
  active: number;
  pulse: string;
  onRoute: (i: number) => void;
  reduce: boolean;
  scale: MotionValue<number>;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const hlRef = useRef<SVGLineElement>(null);
  const outRef = useRef<SVGCircleElement>(null);
  const backRef = useRef<SVGCircleElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const visible = useInView(stageRef);
  const sim = useRef({
    theta: 0,
    vel: BASE_SPEED,
    hover: -1,
    routeAt: -10,
    active,
    drag: null as null | { a: number; t: number; moved: number },
    justDragged: false,
  });

  // 3D tilt toward the cursor
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const rotateX = useSpring(ty, { stiffness: 80, damping: 18 });
  const rotateY = useSpring(tx, { stiffness: 80, damping: 18 });

  useEffect(() => {
    sim.current.active = active;
    sim.current.routeAt = performance.now() / 1000;
  }, [active, pulse]);

  useAnimationFrame((_, delta) => {
    if (!visible) return;
    const s = sim.current;
    const t = performance.now() / 1000; // same clock as routeAt
    const dt = Math.min(delta / 1000, 0.05);
    if (!reduce && !s.drag) {
      const target = s.hover >= 0 ? 0.015 : BASE_SPEED;
      s.vel += (target - s.vel) * Math.min(1, dt * 1.2);
      s.theta += s.vel * dt;
    }

    const pos = MODELS.map((_, i) => {
      const p = orbit(i, s.theta);
      if (!reduce) p.y += Math.sin(t * 1.1 + i * 1.3) * 4;
      return p;
    });

    pos.forEach((p, i) => {
      const el = nodeRefs.current[i];
      if (el) {
        el.style.left = `${p.x / 4}%`;
        el.style.top = `${p.y / 4}%`;
        el.style.transform = `scale(${0.82 + p.depth * 0.26 + (s.hover === i ? 0.1 : 0)})`;
        el.style.zIndex = String(10 + Math.round(p.depth * 10));
        el.style.opacity = String(i === s.active ? 1 : 0.5 + p.depth * 0.5);
      }
      lineRefs.current[i]?.setAttribute("x2", String(p.x));
      lineRefs.current[i]?.setAttribute("y2", String(p.y));
      const d = dotRefs.current[i];
      if (d) {
        const ph = (t * 0.38 + i * 0.17) % 1;
        d.setAttribute("cx", String(C + (p.x - C) * ph));
        d.setAttribute("cy", String(C + (p.y - C) * ph));
        d.setAttribute("opacity", reduce || i === s.active ? "0" : String(Math.sin(ph * Math.PI) * 0.6));
      }
    });

    // Active route: line draws in, request travels out, response travels back.
    const n = pos[s.active];
    const since = t - s.routeAt;
    const hl = hlRef.current;
    if (hl) {
      hl.setAttribute("x2", String(n.x));
      hl.setAttribute("y2", String(n.y));
      hl.style.strokeDashoffset = String(reduce ? 0 : 1 - easeInOut(clamp01((since - OUT) / 0.6)));
    }
    const packet = (el: SVGCircleElement | null, q: number, outbound: boolean) => {
      if (!el) return;
      if (reduce || q < 0 || q > 1) return el.setAttribute("opacity", "0");
      const e = easeInOut(q);
      const [fx, fy, toX, toY] = outbound ? [C, C, n.x, n.y] : [n.x, n.y, C, C];
      el.setAttribute("cx", String(fx + (toX - fx) * e));
      el.setAttribute("cy", String(fy + (toY - fy) * e));
      el.setAttribute("opacity", String(Math.min(1, q * 6, (1 - q) * 6)));
    };
    packet(outRef.current, (since - OUT) / 0.8, true);
    packet(backRef.current, (since - ARRIVE - 0.3) / 0.8, false);

    if (hubRef.current && !reduce) hubRef.current.style.transform = `translateY(${Math.sin(t * 0.8) * 4}px)`;
  });

  // Drag anywhere on the stage to spin the orbit; it keeps its momentum.
  const angleAt = (e: { clientX: number; clientY: number }) => {
    const r = stageRef.current!.getBoundingClientRect();
    return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
  };
  const onPointerDown = (e: React.PointerEvent) => {
    if (reduce) return;
    const s = sim.current;
    s.drag = { a: angleAt(e), t: performance.now(), moved: 0 };
    const move = (ev: PointerEvent) => {
      if (!s.drag) return;
      const a = angleAt(ev);
      let da = a - s.drag.a;
      if (da > Math.PI) da -= Math.PI * 2;
      if (da < -Math.PI) da += Math.PI * 2;
      const now = performance.now();
      s.theta += da;
      s.vel = Math.max(-4, Math.min(4, da / Math.max((now - s.drag.t) / 1000, 0.001)));
      s.drag = { a, t: now, moved: s.drag.moved + Math.abs(da) };
    };
    const up = () => {
      if (s.drag && s.drag.moved > 0.06) {
        s.justDragged = true;
        setTimeout(() => (s.justDragged = false), 0);
      }
      s.drag = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce) return;
    const r = stageRef.current!.getBoundingClientRect();
    tx.set(((e.clientX - r.left) / r.width - 0.5) * 14);
    ty.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  const onPointerLeave = () => {
    tx.set(0);
    ty.set(0);
  };

  return (
    <div className="[perspective:1400px]">
      <motion.div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={reduce ? undefined : { scale, rotateX, rotateY }}
        className="relative mx-auto aspect-square w-full max-w-[46rem] cursor-grab touch-pan-y select-none active:cursor-grabbing"
      >
        <DustSphere className="absolute inset-0" radius={0.42} count={2800} interactive pulseKey={pulse} />
        <svg viewBox="0 0 400 400" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          <ellipse cx={C} cy={C} rx={RX} ry={RY} fill="none" stroke="rgba(168,198,255,0.12)" strokeDasharray="2 6" />
          {MODELS.map((_, i) => {
            const p = orbit(i, 0);
            return (
              <g key={i}>
                <line
                  ref={(el) => {
                    lineRefs.current[i] = el;
                  }}
                  x1={C}
                  y1={C}
                  x2={p.x}
                  y2={p.y}
                  stroke="rgba(168,198,255,0.1)"
                />
                <circle
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  r={1.6}
                  fill="#a8c6ff"
                  cx={C}
                  cy={C}
                  opacity={0}
                />
              </g>
            );
          })}
          <line
            ref={hlRef}
            x1={C}
            y1={C}
            x2={orbit(active, 0).x}
            y2={orbit(active, 0).y}
            stroke="#34c6f7"
            strokeWidth={1.5}
            pathLength={1}
            strokeDasharray="1 1"
          />
          <circle ref={outRef} r={4} fill="#34c6f7" cx={C} cy={C} opacity={0} />
          <circle ref={backRef} r={4} fill="#ffffff" cx={C} cy={C} opacity={0} />
        </svg>

        {/* Hub */}
        <div className="absolute left-1/2 top-1/2 z-[25] h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2">
          <div
            ref={hubRef}
            className="relative flex h-full w-full flex-col items-center justify-center rounded-3xl border border-accent/40 bg-ink-2 text-center shadow-card-lg"
          >
            <Waypoints className="h-[28%] w-[28%] text-accent" aria-hidden />
            <span className="font-display mt-1.5 text-[clamp(0.65rem,1.4vw,1rem)] font-bold leading-tight text-white">
              Master API
            </span>
            {!reduce && (
              <motion.span
                key={`pulse-${pulse}`}
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl border border-accent"
                initial={{ opacity: 0.8, scale: 1 }}
                animate={{ opacity: 0, scale: 1.6 }}
                transition={{ duration: 1.1, ease: EASE_OUT }}
              />
            )}
          </div>
        </div>

        {/* Model nodes, positioned every frame by the orbit loop */}
        {MODELS.map((m, i) => {
          const on = i === active;
          const p = orbit(i, 0);
          return (
            <button
              key={m.id}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              type="button"
              onClick={() => !sim.current.justDragged && onRoute(i)}
              onPointerEnter={() => (sim.current.hover = i)}
              onPointerLeave={() => (sim.current.hover = -1)}
              onFocus={() => (sim.current.hover = i)}
              onBlur={() => (sim.current.hover = -1)}
              aria-pressed={on}
              aria-label={`Route to ${m.provider} ${m.name}`}
              className={cn(
                "absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center rounded-2xl border px-3 py-2 text-center transition-[border-color,background-color,color,box-shadow] duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-5 sm:py-3",
                on
                  ? "border-accent/70 bg-ink-2 text-white shadow-[0_18px_40px_-18px_rgba(52,198,247,0.55)]"
                  : "border-white/10 bg-ink-2/85 text-body-soft shadow-[0_14px_30px_-20px_rgba(0,0,0,0.9)] hover:border-white/30 hover:text-white",
              )}
              style={{ left: `${p.x / 4}%`, top: `${p.y / 4}%` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.logo}
                alt=""
                draggable={false}
                className={cn("mb-1 h-5 w-5 transition-[filter] duration-500 sm:mb-1.5 sm:h-8 sm:w-8", !on && "grayscale-[35%]")}
              />
              <span className="font-display text-xs font-bold sm:text-base">{m.name}</span>
              <span className="text-[0.6rem] uppercase tracking-[0.14em] text-sky-dim sm:text-[0.68rem]">{m.provider}</span>
              {on && !reduce && (
                <motion.span
                  key={`arrive-${pulse}`}
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl border border-accent"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: [0, 0.9, 0], scale: [1, 1, 1.45] }}
                  transition={{ duration: 0.9, delay: ARRIVE, times: [0, 0.05, 1], ease: EASE_OUT }}
                />
              )}
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}

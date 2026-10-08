"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import { useEffect, useRef } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

// Headline split into words so each can mask-reveal independently.
const LINE = [
  { t: "Your" },
  { t: "ascent" },
  { t: "into" },
  { t: "artificial", accent: true },
  { t: "intelligence", accent: true },
  { t: "starts" },
  { t: "here." },
];

export default function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Cursor-tracked volumetric light
  const lx = useMotionValue(50);
  const ly = useMotionValue(40);
  const light = useMotionTemplate`radial-gradient(600px circle at ${lx}% ${ly}%, rgba(52,198,247,0.10), transparent 60%)`;

  // Scroll-linked parallax: orb drifts + scales, content lifts and fades.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const orbY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    if (reduce) return;
    videoRef.current?.play().catch(() => {});
  }, [reduce]);

  function onMove(e: React.MouseEvent) {
    if (reduce || !sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    lx.set(((e.clientX - r.left) / r.width) * 100);
    ly.set(((e.clientY - r.top) / r.height) * 100);
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      className="dark-zone relative flex min-h-[100svh] items-center overflow-hidden bg-ink"
    >
      {/* Full-bleed brand film, parallaxed */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: orbY, scale: orbScale }}
        className="absolute inset-0"
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover object-[72%_center] opacity-95 md:object-[64%_center]"
          poster="/video/futurex-poster.jpg"
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        >
          <source src="/video/futurex-loop.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Cinematic scrims + cursor light */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-transparent to-ink" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/80 to-transparent" />
      {!reduce && <motion.div aria-hidden className="absolute inset-0" style={{ background: light }} />}

      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative mx-auto w-full max-w-7xl px-5 md:px-8"
      >
        <div className="max-w-3xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-mono text-[0.72rem] tracking-[0.24em] text-accent"
          >
            AN INITIATIVE OF G-TEC EDUCATION
          </motion.p>

          <h1 className="font-display mt-5 flex flex-wrap gap-x-[0.28em] text-balance text-[2.7rem] font-extrabold leading-[1.03] tracking-[-0.025em] text-white drop-shadow-[0_2px_40px_rgba(7,11,20,0.9)] sm:text-6xl md:text-[4.6rem] xl:text-[5.6rem]">
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
      </motion.div>
    </section>
  );
}

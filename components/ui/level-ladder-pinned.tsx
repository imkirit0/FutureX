"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { courses } from "@/lib/data";
import { Chip } from "@/components/ui/badge";
import { cn, EASE_OUT } from "@/lib/utils";

const LEVELS = [
  { n: 1, label: "Start", blurb: "Use AI tools expertly" },
  { n: 2, label: "Build", blurb: "Ground AI in real data" },
  { n: 3, label: "Ship", blurb: "Deploy agents to production" },
  { n: 4, label: "Operate", blurb: "Run models at scale" },
] as const;

/* Pinned, scroll-scrubbed version of <LevelLadder>: the section is `pinLength` viewports tall,
   and scrolling through it advances Level 1 → 4. Wrap it in your own <SectionHeader>. */
export function LevelLadderPinned({ pinLength = 3.4, header }: { pinLength?: number; header?: React.ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const imgRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(1);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const pos = Math.min(3.999, p * 4);
    const idx = Math.floor(pos), frac = pos - idx;
    barRefs.current.forEach((b, i) => b && (b.style.transform = `scaleX(${i < idx ? 1 : i === idx ? frac : 0})`));
    if (imgRef.current) imgRef.current.style.transform = `scale(${1.12 - 0.1 * frac})`;
    if (idx + 1 !== active) setActive(idx + 1);
  });

  // Fit the pinned content into short viewports.
  useEffect(() => {
    const fit = () => {
      const el = innerRef.current; if (!el) return;
      const reserve = window.innerWidth < 1024 ? 104 : 40; // phones: keep clear of the nav bar
      const s = Math.min(1, (window.innerHeight - reserve) / el.scrollHeight);
      el.style.transform = s < 0.999 ? `scale(${s})` : "none";
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const pick = (n: number) => {
    const el = sectionRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + r.top + (r.height - window.innerHeight) * ((n - 1) / 4 + 0.12), behavior: "smooth" });
  };

  const levelCourses = courses.filter((c) => c.level === active);
  const lead = levelCourses[0], others = levelCourses.slice(1);

  return (
    <section ref={sectionRef} className="relative" style={{ height: `${pinLength * 100}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden pt-16 lg:pt-0">
        <div ref={innerRef} className="mx-auto w-full max-w-7xl origin-center px-5 sm:px-6 lg:px-8">
          {header}
          <div className="mt-6 grid items-center gap-4 lg:mt-10 lg:grid-cols-12 lg:gap-10">
            <ol className="grid grid-cols-4 gap-2 lg:col-span-5 lg:block lg:space-y-1" role="tablist">
              {LEVELS.map((lvl) => {
                const isActive = lvl.n === active, done = lvl.n < active;
                const names = courses.filter((c) => c.level === lvl.n).map((c) => c.shortName);
                return (
                  <li key={lvl.n}>
                    <button type="button" role="tab" aria-selected={isActive} aria-label={`Level ${lvl.n}: ${lvl.blurb}`} onClick={() => pick(lvl.n)}
                      className={cn("group relative flex w-full cursor-pointer flex-col items-center gap-2 rounded-2xl border p-2 text-center transition-all duration-300 lg:flex-row lg:items-start lg:gap-4 lg:p-4 lg:text-left",
                        isActive ? "border-accent/30 bg-accent/[0.07]" : "border-transparent hover:border-white/10 hover:bg-white/[0.03]")}>
                      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-display text-base font-bold transition-all duration-300 lg:h-12 lg:w-12",
                        isActive ? "border-accent bg-accent text-ink shadow-[0_0_28px_rgba(52,198,247,0.5)]" : done ? "border-accent/50 bg-accent/15 text-accent" : "border-white/15 bg-ink-2 text-body-soft group-hover:border-white/30")}>
                        {done ? <Check className="h-5 w-5" aria-hidden /> : lvl.n}
                      </span>
                      <span className="w-full min-w-0 flex-1">
                        <span className="hidden font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-sky-dim lg:inline">Level {lvl.n} · {lvl.label}</span>
                        <span className={cn("block text-xs font-semibold lg:hidden", isActive ? "text-white" : "text-sky-dim")}>{lvl.label}</span>
                        <span className={cn("mt-1 hidden lg:block font-display text-[1.05rem] font-bold leading-snug", isActive ? "text-white" : "text-body")}>{lvl.blurb}</span>
                        <span className="mt-1.5 hidden truncate text-sm text-sky-dim lg:block">{names.join(" · ")}</span>
                        <span className="mt-2 block h-0.5 w-full lg:mt-3 overflow-hidden rounded-full bg-white/8">
                          <span ref={(el) => { barRefs.current[lvl.n - 1] = el; }} className="block h-full w-full origin-left scale-x-0 bg-accent" />
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div key={active}
                  initial={{ opacity: 0, y: 14, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.985 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="fx-motion border-gradient relative overflow-hidden rounded-3xl bg-ink-2/70 shadow-card-lg">
                  <div className="grid md:grid-cols-[0.95fr_1.25fr]">
                    <div className="relative min-h-[130px] overflow-hidden sm:min-h-[200px] md:min-h-[22rem]">
                      <div ref={imgRef} className="absolute inset-0 will-change-transform">
                        <Image src={lead.image} alt="" fill sizes="(min-width: 1024px) 28vw, 100vw" className="object-cover" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-ink-2/10 md:to-ink-2" />
                      <div className="absolute left-4 top-4 flex gap-2">
                        <Chip active>{lead.code}</Chip>
                        <Chip>{lead.syllabus.length} modules</Chip>
                      </div>
                    </div>
                    <div className="flex flex-col p-5 sm:p-6">
                      <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent">Level {active} of 4</p>
                      <h3 className="font-display mt-2 text-balance text-xl font-bold sm:mt-3 sm:text-2xl leading-tight text-white md:text-[1.6rem]">{lead.title}</h3>
                      <p className="mt-3 text-[0.98rem] leading-relaxed text-body-soft">{lead.short}</p>
                      <ul className="mt-4 space-y-2 sm:mt-5">
                        {lead.outcomes.slice(0, 3).map((o) => (
                          <li key={o} className="flex gap-2.5 text-sm text-body"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />{o}</li>
                        ))}
                      </ul>
                      <div className="mt-5 hidden flex-wrap gap-2 sm:flex">
                        {lead.roles.map((r) => (
                          <span key={r} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-body-soft">{r}</span>
                        ))}
                      </div>
                      <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-5 sm:pt-7">
                        <Link href={`/courses/${lead.slug}`} className="group/link inline-flex items-center gap-2 font-semibold text-white transition-colors hover:text-accent">
                          View program <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" aria-hidden />
                        </Link>
                        {others.map((o) => (
                          <Link key={o.slug} href={`/courses/${o.slug}`} className="inline-flex items-center gap-2 text-sm text-sky-dim transition-colors hover:text-white">
                            Also at this level: <span className="font-medium text-body">{o.shortName}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

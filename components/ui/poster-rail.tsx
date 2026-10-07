"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useRef } from "react";

type Card = { src: string; alt: string };
const easeInOut = (q: number) => (q < 0.5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2);
const clamp01 = (q: number) => Math.max(0, Math.min(1, q));

/* Pinned horizontal scroll: the section is `pinLength` viewports tall and the track
   slides left as you scroll, with a scanner line at centre. Pass your <SectionHeader> as `header`. */
export function PosterRail({ cards, header, cardWidth = 240, cardHeight = 320, gap = 40, pinLength = 2.6 }: {
  cards: Card[]; header?: React.ReactNode; cardWidth?: number; cardHeight?: number; gap?: number; pinLength?: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const track = trackRef.current; if (!track) return;
    const dist = Math.max(0, track.scrollWidth - window.innerWidth);
    track.style.transform = `translateX(${-easeInOut(p) * dist}px)`;
    const mid = window.innerWidth / 2;
    cardRefs.current.forEach((el) => {
      if (!el) return;
      const b = el.getBoundingClientRect();
      const k = clamp01(1 - Math.abs(b.left + b.width / 2 - mid) / mid);
      el.style.transform = `scale(${0.92 + 0.12 * k}) translateY(${(1 - k) * 10}px)`;
      el.style.filter = `brightness(${0.6 + 0.5 * k}) saturate(${0.6 + 0.5 * k})`;
    });
  });

  return (
    <section ref={sectionRef} className="relative bg-paper/50" style={{ height: `${pinLength * 100}vh` }}>
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-8 overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">{header}</div>
        <div className="relative w-full">
          <div aria-hidden className="animate-scan-pulse pointer-events-none absolute left-1/2 top-1/2 z-20 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-transparent via-accent to-transparent"
            style={{ height: cardHeight + 30, boxShadow: "0 0 10px #7cdcfb, 0 0 20px #7cdcfb, 0 0 30px #34c6f7, 0 0 50px #34c6f7" }} />
          <div ref={trackRef} className="flex items-center will-change-transform" style={{ gap, padding: `0 max(32px, calc(50vw - ${cardWidth / 2}px))` }}>
            {cards.map((c, i) => (
              <div key={c.src} ref={(el) => { cardRefs.current[i] = el; }}
                className="relative shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.4)] will-change-transform"
                style={{ width: cardWidth, height: cardHeight }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.src} alt={c.alt} loading="lazy" className="h-full w-full object-cover brightness-110 contrast-110" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

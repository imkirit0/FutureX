"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ReactLenis, useLenis } from "lenis/react";

// True when a key press belongs to a form field rather than the page.
export const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

/* Lenis only smooths the wheel; route scroll keys through it too, so arrows,
   Page Up/Down, Space and Home/End glide instead of jumping. */
function KeyboardScroll() {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      if (document.querySelector("dialog[open], [aria-modal='true']")) return;
      const page = window.innerHeight * 0.85;
      const by: Record<string, number> = {
        ArrowDown: 120, ArrowUp: -120, PageDown: page, PageUp: -page, " ": e.shiftKey ? -page : page,
      };
      if (e.key === "Home") lenis.scrollTo(0);
      else if (e.key === "End") lenis.scrollTo(lenis.limit);
      else if (e.key in by && !(e.key === " " && e.target instanceof HTMLButtonElement)) lenis.scrollTo(lenis.targetScroll + by[e.key]);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lenis]);
  return null;
}

/* Inertia smooth-scroll: the single biggest "premium feel" upgrade.
   Disabled under reduced-motion so it never fights assistive tech. */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        duration: 1.15,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      }}
    >
      <KeyboardScroll />
      {children}
    </ReactLenis>
  );
}

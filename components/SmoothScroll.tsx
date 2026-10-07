"use client";

import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ReactLenis } from "lenis/react";


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
      {children}
    </ReactLenis>
  );
}

"use client";

import * as React from "react";
import {
  type HTMLMotionProps,
  motion,
  type SpringOptions,
  type Transition,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

import { cn } from "@/lib/utils";

type StarLayerProps = HTMLMotionProps<"div"> & {
  count: number;
  size: number;
  transition: Transition;
  starColor: string;
};

function generateStars(count: number, starColor: string) {
  const shadows: string[] = [];
  for (let i = 0; i < count; i++) {
    // Keep stars on-screen: x spans up to 4K-wide viewports, y fills one 2000px tile (the layer repeats it).
    const x = Math.floor(Math.random() * 4000);
    const y = Math.floor(Math.random() * 2000);
    shadows.push(`${x}px ${y}px ${starColor}`);
  }
  return shadows.join(", ");
}

function StarLayer({ count, size, transition, starColor, className, ...props }: StarLayerProps) {
  const reduce = useReducedMotion();
  const [boxShadow, setBoxShadow] = React.useState("");

  React.useEffect(() => {
    setBoxShadow(generateStars(count, starColor));
  }, [count, starColor]);

  return (
    <motion.div
      data-slot="star-layer"
      animate={reduce ? undefined : { y: [0, -2000] }}
      transition={transition}
      className={cn("absolute left-0 top-0 h-[2000px] w-full", className)}
      {...props}
    >
      <div className="absolute rounded-full bg-transparent" style={{ width: size, height: size, boxShadow }} />
      <div className="absolute top-[2000px] rounded-full bg-transparent" style={{ width: size, height: size, boxShadow }} />
    </motion.div>
  );
}

type StarsBackgroundProps = React.ComponentProps<"div"> & {
  factor?: number;
  speed?: number;
  transition?: SpringOptions;
  starColor?: string;
};

export function StarsBackground({
  children,
  className,
  factor = 0.05,
  speed = 50,
  transition = { stiffness: 50, damping: 20 },
  starColor = "#fff",
  ...props
}: StarsBackgroundProps) {
  const reduce = useReducedMotion();
  const offsetX = useMotionValue(1);
  const offsetY = useMotionValue(1);
  const springX = useSpring(offsetX, transition);
  const springY = useSpring(offsetY, transition);

  // Listen on window so the parallax works even when the stars sit behind page content.
  React.useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      offsetX.set(-(e.clientX - window.innerWidth / 2) * factor);
      offsetY.set(-(e.clientY - window.innerHeight / 2) * factor);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce, factor, offsetX, offsetY]);

  return (
    <div
      data-slot="stars-background"
      className={cn(
        "relative size-full overflow-hidden bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]",
        className,
      )}
      {...props}
    >
      <motion.div style={{ x: springX, y: springY }}>
        <StarLayer count={1000} size={1} starColor={starColor} transition={{ repeat: Infinity, duration: speed, ease: "linear" }} />
        <StarLayer count={400} size={2} starColor={starColor} transition={{ repeat: Infinity, duration: speed * 2, ease: "linear" }} />
        <StarLayer count={200} size={3} starColor={starColor} transition={{ repeat: Infinity, duration: speed * 3, ease: "linear" }} />
      </motion.div>
      {children}
    </div>
  );
}

export default StarsBackground;

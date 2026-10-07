"use client";

import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type ElementType } from "react";
import { cn, EASE_OUT } from "@/lib/utils";

/* Word-by-word blur-in heading. Framer animates opacity/y per word; the blur
   itself is a CSS transition keyed off viewport entry. */
export function BlurIn({
  text,
  as = "h2",
  className,
  delay = 0,
  once = true,
  stagger = 0.045,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  once?: boolean;
  stagger?: number;
}) {
  const Tag = as as ElementType;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once, margin: "-40px" });
  const words = text.split(" ");
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          aria-hidden
          data-in={inView}
          style={{ ["--d" as string]: `${delay + i * stagger}s` }}
          className="fx-motion blur-in inline-block will-change-[transform,opacity]"
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.7, delay: delay + i * stagger, ease: EASE_OUT }}
        >
          {w}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </Tag>
  );
}

/* Scroll-triggered fade/rise. Default wrapper for content blocks. */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 20,
  once = true,
  blur = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  blur?: boolean;
}) {
  const [entered, setEntered] = useState(false);
  return (
    <motion.div
      className={cn("fx-motion", blur && "blur-in", className)}
      data-in={blur ? entered : undefined}
      style={blur ? { ["--d" as string]: `${delay}s` } : undefined}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      onViewportEnter={() => setEntered(true)}
      viewport={{ once, margin: "-40px" }}
      transition={{ duration: 0.75, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/* Staggered children: wrap a list in <Stagger>, each child in <StaggerItem>. */
export function Stagger({
  children,
  className,
  delay = 0,
  gap = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  gap?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 22,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={cn("fx-motion", className)}
      variants={{
        hidden: { opacity: 0, y, scale: 0.98 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE_OUT } },
      }}
    >
      {children}
    </motion.div>
  );
}

/* Cycles through words with a vertical slide + blur. */
export function WordRotate({
  words,
  className,
  wordClassName,
  interval = 2600,
}: {
  words: string[];
  className?: string;
  wordClassName?: string;
  interval?: number;
}) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval, reduce]);

  if (reduce)
    return (
      <span className={className}>
        <span className={wordClassName}>{words[0]}</span>
      </span>
    );

  return (
    <span className={cn("relative inline-grid overflow-hidden align-bottom", className)}>
      {/* Reserve width of the longest word so layout never jumps */}
      <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {words.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          className={cn("fx-motion col-start-1 row-start-1 whitespace-nowrap", wordClassName)}
          initial={{ y: "70%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-70%", opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE_OUT }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* Animated gradient-filled text for a single highlighted phrase. */
export function GradientText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("text-gradient animate-gradient-x", className)}>{children}</span>;
}

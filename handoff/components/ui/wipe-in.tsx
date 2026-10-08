"use client";

import { motion } from "framer-motion";
import { type ElementType } from "react";
import { cn } from "@/lib/utils";

/* Clip-wipe heading reveal (left → right) on viewport entry. Drop-in alternative to <BlurIn>. */
export function WipeIn({ text, as = "h2", className, delay = 0, duration = 1.1 }: {
  text: string; as?: ElementType; className?: string; delay?: number; duration?: number;
}) {
  const Tag = motion.create(as as "h2");
  return (
    <Tag
      className={cn("fx-motion", className)}
      initial={{ clipPath: "inset(0 100% -10% 0)" }}
      whileInView={{ clipPath: "inset(0 0% -10% 0)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {text}
    </Tag>
  );
}

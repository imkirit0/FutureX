"use client";

import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { SendHorizontal, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn, EASE_OUT } from "@/lib/utils";

export type ChatMessage = { from: "student" | "vibey"; text: string };

/* Plays a tutor conversation message by message once it scrolls into view. */
export function ChatMock({
  messages,
  subtitle = "Socratic AI tutor",
  className,
}: {
  messages: ChatMessage[];
  subtitle?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (reduce) {
      setTyping(false);
      setShown(messages.length);
      return;
    }
    if (!inView) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let t = 500;
    messages.forEach((m, i) => {
      if (m.from === "vibey") {
        timers.push(setTimeout(() => !cancelled && setTyping(true), t));
        t += 1100;
      } else {
        t += 650;
      }
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          setTyping(false);
          setShown(i + 1);
        }, t)
      );
      t += 350;
    });
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, messages, reduce]);

  return (
    <div
      ref={ref}
      className={cn(
        "border-gradient relative flex flex-col overflow-hidden rounded-3xl bg-ink-2/80 shadow-card-lg backdrop-blur-xl",
        className
      )}
    >
      {/* header */}
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue to-accent shadow-[0_0_24px_rgba(52,198,247,0.45)]">
            <Sparkles className="h-5 w-5 text-white" aria-hidden />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ink-2 bg-emerald-400" />
          </div>
          <div>
            <p className="font-display text-[0.98rem] font-bold leading-tight text-white">Vibey</p>
            <p className="text-xs text-sky-dim">{subtitle}</p>
          </div>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.7rem] font-medium text-body-soft">
          Grades 3–12
        </span>
      </div>

      {/* thread */}
      <div className="flex min-h-[330px] flex-1 flex-col justify-end gap-3 px-5 py-5">
        {reduce ? (
          messages.map((m, i) => <Bubble key={i} message={m} />)
        ) : (
          <AnimatePresence initial={false}>
            {messages.slice(0, shown).map((m, i) => (
              <motion.div
                key={i}
                layout
                className="fx-motion"
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
              >
                <Bubble message={m} />
              </motion.div>
            ))}
            {typing && (
              <motion.div
                key="typing"
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex justify-start"
              >
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-4 py-3">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="block h-1.5 w-1.5 rounded-full bg-sky"
                      animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* composer */}
      <div className="border-t border-white/8 p-3">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-ink/60 py-1.5 pl-4 pr-1.5">
          <span className="flex-1 truncate text-sm text-sky-dim">Type your next step…</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-ink">
            <SendHorizontal className="h-4 w-4" aria-hidden />
          </span>
        </div>
      </div>
    </div>
  );
}

function Bubble({ message: m }: { message: ChatMessage }) {
  return (
    <div className={cn("flex", m.from === "student" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-4 py-2.5 text-[0.95rem] leading-relaxed",
          m.from === "student"
            ? "rounded-br-md bg-accent text-ink"
            : "rounded-bl-md border border-white/10 bg-white/[0.06] text-body"
        )}
      >
        {m.text}
      </div>
    </div>
  );
}

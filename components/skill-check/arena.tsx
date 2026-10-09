"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Keyboard, Lock, Zap } from "lucide-react";
import { SECONDS_PER_QUESTION, STAGES, choose, type Session } from "@/lib/engine";

// Rapid quiz: every question gets SECONDS_PER_QUESTION on its own clock, one question on
// screen at a time, never backwards. Picking an answer moves on at once; running out of time
// moves on with no answer (which the server grades as wrong). The clock is wall time, so
// hiding the tab or stalling the page doesn't buy anything, and the server bounds the whole
// run separately (lib/grade.ts).

// Stages 1-2 use gentler tags; stages 3-4 are the serious end.
const WARM_UP = { 1: "Easy", 2: "Medium", 3: "Hard" } as const;
const DIFFICULTY = {
  1: { label: "Hard", cls: "bg-amber-50 text-amber-700 ring-amber-600/20", dot: "bg-amber-500" },
  2: { label: "Very hard", cls: "bg-red-50 text-red-700 ring-red-600/20", dot: "bg-red-500" },
  3: { label: "Expert", cls: "bg-violet-50 text-violet-700 ring-violet-600/20", dot: "bg-violet-500" },
} as const;

const ADVANCE_MS = 350; // the picked answer lights up briefly before the next question
const STAGE_CARD_MS = 1800; // each stage opens with a card; the clock starts after it

export default function Arena({ initial, onFinish }: { initial: Session; onFinish: (s: Session, tabSwitches: number) => void }) {
  const order = useRef(initial.paper.flatMap((qs, b) => qs.map((_, i) => [b, i] as const))).current;
  const [s, setS] = useState(initial);
  const [idx, setIdx] = useState(0);
  const [opening, setOpening] = useState(true); // showing the stage card
  const [deadline, setDeadline] = useState(() => Date.now() + STAGE_CARD_MS + SECONDS_PER_QUESTION * 1000);
  const [now, setNow] = useState(() => Date.now());
  const [chosen, setChosen] = useState<number | null>(null); // the answer lit up while advancing
  const tabSwitches = useRef(0);
  const finished = useRef(false);
  const advancing = useRef(false);

  const [b, i] = order[idx];
  const q = s.paper[b][i];
  const remainingMs = Math.max(0, deadline - now);
  const remaining = Math.ceil(remainingMs / 1000);

  // Smooth ring, and the deadline is checked on every tick.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, []);

  // Like GATE: switching browser tabs is noted for counsellors, never penalised.
  useEffect(() => {
    const onVis = () => { if (document.visibilityState === "hidden") tabSwitches.current++; };
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("beforeunload", warn);
    return () => { document.removeEventListener("visibilitychange", onVis); window.removeEventListener("beforeunload", warn); };
  }, []);

  function advance(next: Session) {
    if (advancing.current) return;
    advancing.current = true;
    setS(next);
    setTimeout(() => {
      advancing.current = false;
      setChosen(null);
      if (idx + 1 >= order.length) {
        if (finished.current) return;
        finished.current = true;
        return onFinish(next, tabSwitches.current);
      }
      const newStage = order[idx + 1][1] === 0;
      setIdx(idx + 1);
      setOpening(newStage);
      setDeadline(Date.now() + (newStage ? STAGE_CARD_MS : 0) + SECONDS_PER_QUESTION * 1000);
    }, ADVANCE_MS);
  }

  // The stage card gives way to its first question on its own.
  useEffect(() => {
    if (!opening) return;
    const id = setTimeout(() => setOpening(false), STAGE_CARD_MS);
    return () => clearTimeout(id);
  }, [opening, idx]);

  function pick(choice: number) {
    if (advancing.current || opening) return;
    setChosen(choice);
    advance(choose(s, b, i, choice));
  }

  // Time's up: this question stays unanswered and the next one appears.
  useEffect(() => {
    if (remainingMs === 0 && !advancing.current) advance(s);
  });

  // Keyboard: A–D (or 1–4) answers.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toUpperCase();
      const n = "ABCD".includes(k) ? "ABCD".indexOf(k) : "1234".indexOf(k);
      if (n >= 0) pick(n);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const diff = b < 2 ? { ...DIFFICULTY[q.d], label: WARM_UP[q.d] } : DIFFICULTY[q.d];
  const [stageLabel, stageTopic] = STAGES[b].split(" · ");
  const tone = remaining <= 5 ? "#dc2626" : remaining <= 10 ? "#d97706" : "#3b63d9";
  const block = (e: React.SyntheticEvent) => e.preventDefault(); // no copy, no right-click: nothing to paste into a search box

  return (
    <div className="-mx-4 sm:-mx-6" onCopy={block} onContextMenu={block} onDragStart={block}>
      <header className="sticky top-[76px] z-10 px-4 pt-2 sm:top-[88px] sm:px-6">
        <div className="sc-glass mx-auto flex max-w-5xl items-center gap-4 rounded-2xl border border-line px-3 py-3 sm:px-4">
          <ol aria-label="Stages" className="relative -my-1 flex flex-1 items-stretch gap-1.5 overflow-x-auto px-1 py-1 sm:gap-2">
            {STAGES.map((name, sb) => {
              const state = sb < b ? "done" : sb === b ? "open" : "upcoming";
              const [label, topic] = name.split(" · ");
              return (
                <li key={name} className="flex min-w-[8.5rem] flex-1 items-center gap-1.5 sm:gap-2">
                  <div aria-current={state === "open" ? "step" : undefined} title={name}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-all
                      ${state === "open" ? "bg-white shadow-[0_6px_18px_-10px_rgb(59_99_217/.6)] ring-1 ring-indigo/40" : state === "upcoming" ? "opacity-55" : ""}`}>
                    <span className={`grid size-8 flex-none place-items-center rounded-lg text-xs font-bold transition-colors
                      ${state === "done" ? "bg-green-500 text-white" : state === "open" ? "bg-brand" : "bg-surface-2 text-muted ring-1 ring-line"}`}>
                      {state === "done" ? <Check className="size-4" /> : state === "upcoming" ? <Lock className="size-3.5" /> : sb + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted">Stage {sb + 1}</span>
                      <span className="block truncate text-[13px] font-semibold">{topic ? label : name}</span>
                    </span>
                  </div>
                  {sb < STAGES.length - 1 && (
                    <span aria-hidden className="hidden h-0.5 w-5 flex-none overflow-hidden rounded-full bg-line lg:block">
                      <span className={`block h-full bg-gradient-to-r from-indigo to-cyan transition-all duration-700 ${sb < b ? "w-full" : "w-0"}`} />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          <TimerRing remainingMs={opening ? SECONDS_PER_QUESTION * 1000 : remainingMs} remaining={opening ? SECONDS_PER_QUESTION : remaining} tone={opening ? "#3b63d9" : tone} />
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        {opening ? (
          <section key={`stage-${b}`} role="status" className="sc-rise rounded-2xl border border-line bg-white p-8 text-center shadow-[0_1px_2px_rgb(16_24_40/.04),0_24px_48px_-28px_rgb(16_24_40/.22)] sm:p-12">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand text-xl font-bold">{b + 1}</span>
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-muted">Stage {b + 1} of {STAGES.length}</p>
            <h2 className="mt-1 text-[1.6rem] leading-tight sm:text-[2rem]">{stageTopic ?? stageLabel}</h2>
            <p className="mt-3 text-sm text-muted">
              {s.paper[b].length} questions · {SECONDS_PER_QUESTION} seconds each{b > 0 ? " · harder than the last stage" : ""}
            </p>
          </section>
        ) : (
        <article className="relative select-none overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgb(16_24_40/.04),0_24px_48px_-28px_rgb(16_24_40/.22)]">
          <div className="h-1 bg-surface-2" aria-hidden>
            <div className="h-full bg-gradient-to-r from-indigo to-cyan transition-all duration-500" style={{ width: `${(idx / order.length) * 100}%` }} />
          </div>

          <div key={idx} className="sc-slide-in">
            <div className="p-5 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-indigo/10 px-2.5 py-1 font-semibold text-indigo">Question {i + 1} of {s.paper[b].length}</span>
                <span className="rounded-full bg-surface-2 px-2.5 py-1 font-medium text-muted ring-1 ring-line">{q.t}</span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ring-1 ${diff.cls}`}>
                  <span className={`size-1.5 rounded-full ${diff.dot}`} />{diff.label}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo/10 px-2.5 py-1 font-semibold text-indigo"><Zap className="size-3" />{SECONDS_PER_QUESTION}s each</span>
              </div>
              <h2 className="mt-4 text-balance text-[1.35rem] leading-snug sm:text-[1.7rem]">{q.q}</h2>

              <ul className="mt-7 grid gap-3" aria-label="Choose your answer">
                {q.o.map((o, n) => {
                  const sel = chosen === n;
                  return (
                    <li key={n} className="sc-rise" style={{ animationDelay: `${60 + n * 50}ms` }}>
                      <button type="button" onClick={() => pick(n)} disabled={chosen !== null}
                        className={`group relative flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo focus-visible:outline-none
                          ${chosen === null ? "cursor-pointer hover:-translate-y-0.5" : "cursor-default"}
                          ${sel ? "sc-border-gradient bg-indigo/5 shadow-[0_12px_28px_-18px_rgb(59_99_217/.7)]" : "bg-white ring-1 ring-line hover:ring-indigo/40 hover:shadow-[0_10px_24px_-20px_rgb(16_24_40/.5)]"}`}>
                        <span aria-hidden className={`grid size-9 shrink-0 place-items-center rounded-lg font-mono text-sm font-bold transition-all
                          ${sel ? "bg-brand scale-105" : "bg-surface-2 text-muted shadow-[inset_0_-2px_0_rgb(16_24_40/.08)] ring-1 ring-line group-hover:text-indigo"}`}>
                          {"ABCD"[n]}
                        </span>
                        <span className="flex-1 leading-relaxed">{o}</span>
                        <span aria-hidden className={`grid size-6 flex-none place-items-center rounded-full transition-all duration-300
                          ${sel ? "scale-100 bg-indigo text-white opacity-100" : "scale-50 opacity-0"}`}>
                          <Check className="size-3.5" />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-line bg-surface-2/60 px-5 py-4 text-xs text-muted sm:px-8">
              <span>No going back. If the clock runs out, the question counts as unanswered and the next one appears.</span>
              <span className="hidden items-center gap-1.5 whitespace-nowrap md:inline-flex">
                <Keyboard className="size-3.5" /><Kbd>A</Kbd>–<Kbd>D</Kbd> to answer
              </span>
            </div>
          </div>
        </article>
        )}
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="rounded-md bg-white px-1.5 py-0.5 font-mono text-[11px] font-semibold text-lite shadow-[inset_0_-1px_0_rgb(16_24_40/.12)] ring-1 ring-line">{children}</kbd>;
}

function TimerRing({ remainingMs, remaining, tone }: { remainingMs: number; remaining: number; tone: string }) {
  const r = 20, c = 2 * Math.PI * r;
  const left = remainingMs / (SECONDS_PER_QUESTION * 1000);
  return (
    <div role="timer" aria-live="off" aria-label={`${remaining} seconds remaining`}
      className="flex flex-none items-center gap-2.5 rounded-xl bg-white py-1.5 pr-3.5 pl-1.5 ring-1 ring-line">
      <svg viewBox="0 0 48 48" className={`size-11 -rotate-90 ${remaining <= 5 ? "animate-pulse" : ""}`} aria-hidden>
        <circle cx="24" cy="24" r={r} fill="none" stroke="var(--color-surface-2)" strokeWidth="4" />
        <circle cx="24" cy="24" r={r} fill="none" stroke={tone} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - left)} className="transition-[stroke-dashoffset] duration-100 ease-linear" />
      </svg>
      <div className="leading-tight">
        <span className="block font-mono text-lg font-bold tabular-nums" style={{ color: tone }}>{remaining}</span>
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">sec</span>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Keyboard, Lock, RefreshCw, Zap } from "lucide-react";
import { MAX_SWAPS_PER_STAGE, SECONDS_PER_QUESTION, STAGES, choose, swapQuestion, type Session } from "@/lib/engine";

// Rapid quiz, one stage at a time. Every question gets SECONDS_PER_QUESTION on its own clock,
// one question on screen, never backwards. Picking an answer moves on at once. Running out of
// time swaps in a fresh question of the same difficulty, up to MAX_SWAPS_PER_STAGE times per
// stage; after that the question counts as unanswered. When a stage is complete the server
// grades it: pass and the next stage unlocks, fail and the test ends there. The clock is wall
// time, so hiding the tab or stalling the page doesn't buy anything, and the server bounds the
// whole run separately (lib/grade.ts).

// Stages 1-2 use gentler tags; stages 3-4 are the serious end.
const WARM_UP = { 1: "Easy", 2: "Medium", 3: "Hard" } as const;
const DIFFICULTY = {
  1: { label: "Hard", cls: "bg-amber-50 text-amber-700 ring-amber-600/20", dot: "bg-amber-500" },
  2: { label: "Very hard", cls: "bg-red-50 text-red-700 ring-red-600/20", dot: "bg-red-500" },
  3: { label: "Expert", cls: "bg-violet-50 text-violet-700 ring-violet-600/20", dot: "bg-violet-500" },
} as const;

const ADVANCE_MS = 350; // the picked answer lights up briefly before the next question
const STAGE_CARD_MS = 1800; // each stage opens with a card; the clock starts after it

type Phase = "card" | "quiz" | "checking" | "error";

export default function Arena({ initial, gradeStage }: {
  initial: Session;
  // Sends stages 0..stage for grading. Resolves true when the test is over (the parent then
  // shows the results flow), false when the next stage may begin. Rejects on network trouble.
  gradeStage: (s: Session, stage: number, tabSwitches: number) => Promise<boolean>;
}) {
  const [s, setS] = useState(initial);
  const [b, setB] = useState(0); // open stage
  const [i, setI] = useState(0); // question inside it
  const [phase, setPhase] = useState<Phase>("card");
  const [swaps, setSwaps] = useState(0); // used in this stage
  const [swapped, setSwapped] = useState(false); // the question on screen replaced a timed-out one
  const [deadline, setDeadline] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [chosen, setChosen] = useState<number | null>(null); // the answer lit up while advancing
  const [error, setError] = useState("");
  const tabSwitches = useRef(0);
  const busy = useRef(false);

  const qs = s.paper[b];
  const q = qs[i];
  const remainingMs = phase === "quiz" ? Math.max(0, deadline - now) : SECONDS_PER_QUESTION * 1000;
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

  // The stage card gives way to its first question on its own.
  useEffect(() => {
    if (phase !== "card") return;
    const id = setTimeout(() => { setDeadline(Date.now() + SECONDS_PER_QUESTION * 1000); setPhase("quiz"); }, STAGE_CARD_MS);
    return () => clearTimeout(id);
  }, [phase, b]);

  async function check(next: Session) {
    setPhase("checking");
    try {
      if (await gradeStage(next, b, tabSwitches.current)) return;
      // The stage passed and a harder one unlocks.
      setB(b + 1); setI(0); setSwaps(0); setPhase("card");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reach the server.");
      setPhase("error");
    } finally {
      busy.current = false;
    }
  }

  function advance(next: Session) {
    if (busy.current) return;
    busy.current = true;
    setS(next);
    setTimeout(() => {
      setChosen(null);
      setSwapped(false);
      if (i + 1 < qs.length) {
        busy.current = false;
        setI(i + 1);
        setDeadline(Date.now() + SECONDS_PER_QUESTION * 1000);
      } else {
        void check(next);
      }
    }, ADVANCE_MS);
  }

  function pick(choice: number) {
    if (busy.current || phase !== "quiz") return;
    setChosen(choice);
    advance(choose(s, b, i, choice));
  }

  // Time's up: a fresh question if swaps remain, otherwise this one stays unanswered.
  useEffect(() => {
    if (phase !== "quiz" || remainingMs > 0 || busy.current) return;
    const fresh = swaps < MAX_SWAPS_PER_STAGE ? swapQuestion(s, b, i) : s;
    if (fresh !== s) {
      setS(fresh); setSwaps(swaps + 1); setSwapped(true);
      setDeadline(Date.now() + SECONDS_PER_QUESTION * 1000);
    } else {
      advance(s);
    }
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
  const swapsLeft = MAX_SWAPS_PER_STAGE - swaps;
  const block = (e: React.SyntheticEvent) => e.preventDefault(); // no copy, no right-click: nothing to paste into a search box
  const panel = "rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgb(16_24_40/.04),0_24px_48px_-28px_rgb(16_24_40/.22)]";

  return (
    <div className="-mx-4 sm:-mx-6" onCopy={block} onContextMenu={block} onDragStart={block}>
      <header className="sticky top-[76px] z-10 px-4 pt-2 sm:top-[88px] sm:px-6">
        <div className="sc-glass mx-auto flex max-w-5xl items-center gap-4 rounded-2xl border border-line px-3 py-3 sm:px-4">
          <ol aria-label="Stages" className="relative -my-1 flex flex-1 items-stretch gap-1.5 overflow-x-auto px-1 py-1 sm:gap-2">
            {STAGES.map((name, sb) => {
              const state = sb < b ? "cleared" : sb === b ? "open" : "locked";
              const [label, topic] = name.split(" · ");
              return (
                <li key={name} className="flex min-w-[8.5rem] flex-1 items-center gap-1.5 sm:gap-2">
                  <div aria-current={state === "open" ? "step" : undefined} title={state === "locked" ? "Clear the previous stage to unlock" : name}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-all
                      ${state === "open" ? "bg-white shadow-[0_6px_18px_-10px_rgb(59_99_217/.6)] ring-1 ring-indigo/40" : state === "locked" ? "opacity-55" : ""}`}>
                    <span className={`grid size-8 flex-none place-items-center rounded-lg text-xs font-bold transition-colors
                      ${state === "cleared" ? "bg-green-500 text-white" : state === "open" ? "bg-brand" : "bg-surface-2 text-muted ring-1 ring-line"}`}>
                      {state === "cleared" ? <Check className="size-4" /> : state === "locked" ? <Lock className="size-3.5" /> : sb + 1}
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
          <TimerRing remainingMs={remainingMs} remaining={remaining} tone={phase === "quiz" ? tone : "#3b63d9"} />
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        {phase === "card" && (
          <section key={`stage-${b}`} role="status" className={`sc-rise ${panel} p-8 text-center sm:p-12`}>
            {b > 0 && (
              <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-800 ring-1 ring-green-600/20">
                <Check className="size-4" />Stage {b} cleared
              </p>
            )}
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand text-xl font-bold">{b + 1}</span>
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-muted">Stage {b + 1} of {STAGES.length} {b > 0 ? "unlocked" : ""}</p>
            <h2 className="mt-1 text-[1.6rem] leading-tight sm:text-[2rem]">{stageTopic ?? stageLabel}</h2>
            <p className="mt-3 text-sm text-muted">
              {qs.length} questions · {SECONDS_PER_QUESTION} seconds each{b > 0 ? " · harder than the last stage" : ""}
            </p>
          </section>
        )}

        {phase === "checking" && (
          <section role="status" className={`sc-rise ${panel} p-12 text-center`}>
            <RefreshCw className="mx-auto size-8 animate-spin text-indigo" aria-hidden />
            <p className="mt-4 text-lg font-semibold">Checking Stage {b + 1}…</p>
            <p className="mt-1 text-sm text-muted">Pass and Stage {b + 2} unlocks.</p>
          </section>
        )}

        {phase === "error" && (
          <section className={`sc-rise ${panel} p-8 text-center`}>
            <p className="text-lg font-semibold">We couldn&apos;t check your stage.</p>
            <p role="alert" className="mt-1 text-sm text-muted">{error}</p>
            <button onClick={() => { busy.current = true; void check(s); }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold">
              <RefreshCw className="size-4" />Try again
            </button>
          </section>
        )}

        {phase === "quiz" && (
        <article className={`relative select-none overflow-hidden ${panel}`}>
          <div className="h-1 bg-surface-2" aria-hidden>
            <div className="h-full bg-gradient-to-r from-indigo to-cyan transition-all duration-500" style={{ width: `${(i / qs.length) * 100}%` }} />
          </div>

          <div key={`${b}-${i}-${swaps}`} className="sc-slide-in">
            <div className="p-5 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-indigo/10 px-2.5 py-1 font-semibold text-indigo">Question {i + 1} of {qs.length}</span>
                <span className="rounded-full bg-surface-2 px-2.5 py-1 font-medium text-muted ring-1 ring-line">{q.t}</span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ring-1 ${diff.cls}`}>
                  <span className={`size-1.5 rounded-full ${diff.dot}`} />{diff.label}
                </span>
                {swapped
                  ? <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-700 ring-1 ring-amber-600/20"><RefreshCw className="size-3" />New question · {swapsLeft} swap{swapsLeft === 1 ? "" : "s"} left</span>
                  : <span className="inline-flex items-center gap-1 rounded-full bg-indigo/10 px-2.5 py-1 font-semibold text-indigo"><Zap className="size-3" />{SECONDS_PER_QUESTION}s each</span>}
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
              <span>
                No going back. Run out of time and you get a new question
                {swapsLeft > 0 ? ` (${swapsLeft} left this stage)` : " (none left this stage, so it counts as unanswered)"}.
              </span>
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

"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Flag, Keyboard, Lock, Send, Sparkles } from "lucide-react";
import {
  STAGES, TIME_LIMIT_SECONDS,
  choose, finish, isQuick, passMark, submitStage,
  type Session,
} from "@/lib/engine";

// Stages 1-2 are the course basics; stages 3-4 are graduate level.
const WARM_UP = { 1: "Easy", 2: "Medium", 3: "Hard" } as const;
const DIFFICULTY = {
  1: { label: "Hard", cls: "bg-amber-50 text-amber-700 ring-amber-600/20", dot: "bg-amber-500" },
  2: { label: "Very hard", cls: "bg-red-50 text-red-700 ring-red-600/20", dot: "bg-red-500" },
  3: { label: "Expert", cls: "bg-violet-50 text-violet-700 ring-violet-600/20", dot: "bg-violet-500" },
} as const;

export default function Arena({ initial, onFinish }: { initial: Session; onFinish: (s: Session, tabSwitches: number) => void }) {
  const [s, setS] = useState(initial);
  const [view, setView] = useState(0); // stage being looked at (open stage or a cleared one)
  const [pos, setPos] = useState(0);
  const [dir, setDir] = useState(1); // slide direction for the question card
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [confirming, setConfirming] = useState(false);
  const [banner, setBanner] = useState("");
  const [deadline] = useState(() => Date.now() + TIME_LIMIT_SECONDS * 1000);
  const [now, setNow] = useState(() => Date.now());
  const tabSwitches = useRef(0);
  const finished = useRef(false);

  const remaining = Math.max(0, Math.ceil((deadline - now) / 1000));
  const locked = view !== s.stage;
  const qs = s.paper[view];
  const q = qs[pos];
  const picks = s.picks[view];
  const key = (i: number) => `${view}-${i}`;

  function end(final: Session) {
    if (finished.current) return;
    finished.current = true;
    onFinish(final, tabSwitches.current);
  }

  // Display clock; at zero the open stage is submitted for the student.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (remaining === 0) end(finish(s));
  });

  // Like GATE: switching browser tabs is noted for counsellors, never penalised.
  useEffect(() => {
    const onVis = () => { if (document.visibilityState === "hidden") tabSwitches.current++; };
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("beforeunload", warn);
    return () => { document.removeEventListener("visibilitychange", onVis); window.removeEventListener("beforeunload", warn); };
  }, []);

  function pick(i: number, choice: number | null) {
    setS(cur => choose(cur, view, i, choice));
  }

  function move(i: number) {
    setDir(i >= pos ? 1 : -1);
    setPos(i);
  }

  function go(stage: number, i = 0) {
    setView(stage);
    setDir(1);
    setPos(i);
  }

  // Keyboard: A–D (or 1–4) answers, ←/→ moves inside the stage.
  useEffect(() => {
    if (confirming) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      // preventDefault: a focused radio would otherwise also switch the answer on ←/→.
      if (e.key === "ArrowRight") { e.preventDefault(); setDir(1); return setPos(p => Math.min(qs.length - 1, p + 1)); }
      if (e.key === "ArrowLeft") { e.preventDefault(); setDir(-1); return setPos(p => Math.max(0, p - 1)); }
      const k = e.key.toUpperCase();
      const idx = "ABCD".includes(k) ? "ABCD".indexOf(k) : "1234".indexOf(k);
      if (idx >= 0 && !locked) setS(cur => choose(cur, view, pos, idx));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirming, qs.length, locked, view, pos]);

  function submit() {
    const next = submitStage(s);
    setConfirming(false);
    if (next.done) return end(next);
    setS(next);
    go(next.stage);
    setBanner(`Nice work. Stage ${next.stage + 1}, ${STAGES[next.stage]}, is now open. The questions get harder from here.`);
  }

  const answered = picks.filter(p => p !== null).length;
  const markedHere = qs.filter((_, i) => marked.has(key(i))).length;
  const need = passMark(s.chosenLevel, view);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0"), ss = String(remaining % 60).padStart(2, "0");
  const timeTone = remaining <= 60 ? "#dc2626" : remaining <= 300 ? "#d97706" : "#3b63d9";
  const diff = view < 2 ? { ...DIFFICULTY[q.d], label: WARM_UP[q.d] } : DIFFICULTY[q.d];
  const isMarked = marked.has(key(pos));

  return (
    <div className="-mx-4 sm:-mx-6">
      {/* ---------- Stage ladder + timer ---------- */}
      <header className="sticky top-[76px] z-10 px-4 pt-2 sm:top-[88px] sm:px-6">
        <div className="sc-glass mx-auto flex max-w-5xl items-center gap-4 rounded-2xl border border-line px-3 py-3 sm:px-4">
          <ol role="tablist" aria-label="Stages" className="relative -my-1 flex flex-1 items-stretch gap-1.5 overflow-x-auto px-1 py-1 sm:gap-2">
            {STAGES.map((name, b) => {
              const state = b < s.passed ? "cleared" : b === s.stage ? "open" : "locked";
              const [label, topic] = name.split(" · ");
              const current = view === b;
              return (
                <li key={name} className="flex min-w-[8.5rem] flex-1 items-center gap-1.5 sm:gap-2">
                  <button role="tab" aria-selected={current} disabled={state === "locked"} onClick={() => go(b)}
                    title={state === "locked" ? "Clear the previous stage to unlock" : name}
                    className={`group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-all disabled:cursor-not-allowed
                      ${current ? "bg-white shadow-[0_6px_18px_-10px_rgb(59_99_217/.6)] ring-1 ring-indigo/40" : state === "locked" ? "opacity-55" : "hover:bg-white/70"}`}>
                    <span className={`grid size-8 flex-none place-items-center rounded-lg text-xs font-bold transition-colors
                      ${state === "cleared" ? "bg-green-500 text-white" : state === "open" ? "bg-brand" : "bg-surface-2 text-muted ring-1 ring-line"}`}>
                      {state === "cleared" ? <Check className="size-4" /> : state === "locked" ? <Lock className="size-3.5" /> : b + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted">Stage {b + 1}</span>
                      <span className="block truncate text-[13px] font-semibold">{topic ? label : name}</span>
                    </span>
                  </button>
                  {b < STAGES.length - 1 && (
                    <span aria-hidden className="hidden h-0.5 w-5 flex-none overflow-hidden rounded-full bg-line lg:block">
                      <span className={`block h-full bg-gradient-to-r from-indigo to-cyan transition-all duration-700 ${b < s.passed ? "w-full" : "w-0"}`} />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>

          <TimerRing remaining={remaining} tone={timeTone} label={`${mm}:${ss}`} />
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_300px]">
        <div>
          {banner && !locked && (
            <p role="status" className="sc-rise mb-4 flex items-center gap-3 rounded-xl border border-green-600/20 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
              <span className="grid size-7 flex-none place-items-center rounded-full bg-green-500 text-white"><Sparkles className="size-4" /></span>
              {banner}
            </p>
          )}
          {locked && (
            <p className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm text-muted">
              <Lock className="size-4" /> This stage is submitted and locked.
              <button className="font-semibold text-indigo underline-offset-4 hover:underline" onClick={() => go(s.stage)}>Back to Stage {s.stage + 1}</button>
            </p>
          )}

          <article className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgb(16_24_40/.04),0_24px_48px_-28px_rgb(16_24_40/.22)]">
            {/* Stage progress */}
            <div className="h-1 bg-surface-2" aria-hidden>
              <div className="h-full bg-gradient-to-r from-indigo to-cyan transition-all duration-500" style={{ width: `${(answered / qs.length) * 100}%` }} />
            </div>

            <div key={key(pos)} className={dir > 0 ? "sc-slide-in" : "sc-slide-in-back"}>
              <div className="p-5 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-indigo/10 px-2.5 py-1 font-semibold text-indigo">Question {pos + 1} of {qs.length}</span>
                  <span className="rounded-full bg-surface-2 px-2.5 py-1 font-medium text-muted ring-1 ring-line">{q.t}</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ring-1 ${diff.cls}`}>
                    <span className={`size-1.5 rounded-full ${diff.dot}`} />{diff.label}
                  </span>
                  {isMarked && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-700 ring-1 ring-amber-600/20"><Flag className="size-3" />For review</span>}
                </div>
                <h2 className="mt-4 text-balance text-[1.35rem] leading-snug sm:text-[1.7rem]">{q.q}</h2>

                <fieldset className="mt-7" disabled={locked}>
                  <legend className="sr-only">Choose your answer</legend>
                  <ul className="grid gap-3">
                    {q.o.map((o, i) => {
                      const sel = picks[pos] === i;
                      return (
                        <li key={i} className="sc-rise" style={{ animationDelay: `${60 + i * 50}ms` }}>
                          <label className={`group relative flex items-center gap-4 rounded-xl p-4 transition-all duration-200
                            ${locked ? "cursor-default" : "cursor-pointer hover:-translate-y-0.5"}
                            ${sel ? "sc-border-gradient bg-indigo/5 shadow-[0_12px_28px_-18px_rgb(59_99_217/.7)]" : "bg-white ring-1 ring-line hover:ring-indigo/40 hover:shadow-[0_10px_24px_-20px_rgb(16_24_40/.5)]"}`}>
                            <input type="radio" name={key(pos)} checked={sel} onChange={() => pick(pos, i)} className="peer sr-only" />
                            <span aria-hidden className={`grid size-9 shrink-0 place-items-center rounded-lg font-mono text-sm font-bold transition-all
                              ${sel ? "bg-brand scale-105" : "bg-surface-2 text-muted shadow-[inset_0_-2px_0_rgb(16_24_40/.08)] ring-1 ring-line group-hover:text-indigo"}`}>
                              {"ABCD"[i]}
                            </span>
                            <span className="flex-1 leading-relaxed">{o}</span>
                            <span aria-hidden className={`grid size-6 flex-none place-items-center rounded-full transition-all duration-300
                              ${sel ? "scale-100 bg-indigo text-white opacity-100" : "scale-50 opacity-0"}`}>
                              <Check className="size-3.5" />
                            </span>
                            <span className="pointer-events-none absolute inset-0 rounded-xl peer-focus-visible:ring-2 peer-focus-visible:ring-indigo" />
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </fieldset>

                {!locked && (
                  <div className="mt-5 flex flex-wrap gap-2 text-sm">
                    <button onClick={() => setMarked(m => { const n = new Set(m); if (n.has(key(pos))) n.delete(key(pos)); else n.add(key(pos)); return n; })}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-colors
                        ${isMarked ? "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20" : "text-muted ring-1 ring-line hover:text-lite"}`}>
                      <Flag className="size-3.5" />{isMarked ? "Marked for review (undo)" : "Mark for review"}
                    </button>
                    {picks[pos] !== null && (
                      <button onClick={() => pick(pos, null)} className="rounded-full px-3 py-1.5 font-medium text-muted ring-1 ring-line transition-colors hover:text-lite">
                        Clear my answer
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-line bg-surface-2/60 px-5 py-4 sm:px-8">
                <button onClick={() => move(pos - 1)} disabled={pos === 0}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-muted ring-1 ring-line transition-all hover:bg-white hover:text-lite disabled:pointer-events-none disabled:opacity-35">
                  <ArrowLeft className="size-4" />Previous
                </button>
                <span className="hidden items-center gap-1.5 text-xs text-muted md:inline-flex">
                  <Keyboard className="size-3.5" />
                  <Kbd>A</Kbd>–<Kbd>D</Kbd> to answer · <Kbd>←</Kbd><Kbd>→</Kbd> to move
                </span>
                {pos < qs.length - 1
                  ? <button onClick={() => move(pos + 1)} className="group inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold shadow-[0_10px_24px_-12px_rgb(32_104_216/.8)] transition-all hover:-translate-y-0.5">
                      Next<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  : !locked && <button onClick={() => setConfirming(true)} className="group inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold shadow-[0_10px_24px_-12px_rgb(32_104_216/.8)] transition-all hover:-translate-y-0.5">
                      Review &amp; submit<Send className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </button>}
              </div>
            </div>
          </article>
        </div>

        {/* ---------- Stage panel ---------- */}
        <aside className="sc-glass h-fit rounded-2xl border border-line p-5 lg:sticky lg:top-[180px]">
          <div className="flex items-center gap-4">
            <ProgressRing value={answered} total={qs.length} />
            <div className="min-w-0">
              <h2 className="text-base">Stage {view + 1}</h2>
              <p className="truncate text-sm text-muted">{STAGES[view]}</p>
            </div>
          </div>

          <nav aria-label="Questions in this stage" className="mt-5 grid grid-cols-4 gap-2">
            {qs.map((_, i) => {
              const isCur = i === pos, isAns = picks[i] !== null, isMark = marked.has(key(i));
              return (
                <button key={i} onClick={() => move(i)} aria-current={isCur ? "step" : undefined}
                  aria-label={`Question ${i + 1}${isAns ? ", answered" : ", not answered"}${isMark ? ", marked for review" : ""}`}
                  className={`relative aspect-square rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5
                    ${isCur ? "bg-brand shadow-[0_8px_18px_-10px_rgb(32_104_216/.9)]" : isAns ? "bg-green-50 text-green-700 ring-1 ring-green-600/25" : "bg-white text-muted ring-1 ring-line hover:ring-indigo/40"}`}>
                  {i + 1}
                  {isAns && !isCur && <Check aria-hidden className="absolute right-1 bottom-1 size-3" />}
                  {isMark && <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-amber-500 ring-2 ring-white" />}
                </button>
              );
            })}
          </nav>

          <ul className="mt-4 grid grid-cols-2 gap-1.5 text-xs text-muted">
            <li className="flex items-center gap-1.5"><i className="size-2.5 rounded-sm bg-green-500/70" />Answered</li>
            <li className="flex items-center gap-1.5"><i className="size-2.5 rounded-sm bg-white ring-1 ring-line" />Not answered</li>
            <li className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-amber-500" />For review</li>
            <li className="flex items-center gap-1.5"><i className="size-2.5 rounded-sm bg-indigo" />Current</li>
          </ul>

          {!locked && (
            <div className="mt-5 border-t border-line pt-5">
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-semibold text-lite">{isQuick(s.chosenLevel, view) ? "Quick check" : "To unlock the next stage"}</span>
                <span className="text-muted">{need} of {qs.length} right</span>
              </div>
              <div className="mt-2 flex gap-1" aria-hidden>
                {qs.map((_, i) => (
                  <span key={i} className={`h-1.5 flex-1 rounded-full ${i < need ? "bg-gradient-to-r from-indigo to-cyan" : "bg-surface-2 ring-1 ring-line"}`} />
                ))}
              </div>
              <p className="mt-2 text-xs text-muted">Unlocks {view < 3 ? `Stage ${view + 2}` : "your full report"}.</p>
              <button onClick={() => setConfirming(true)}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo/40 bg-white px-4 py-2.5 text-sm font-semibold text-indigo transition-all hover:-translate-y-0.5 hover:bg-indigo/5">
                <Send className="size-4" />Submit Stage {view + 1}
              </button>
            </div>
          )}
        </aside>
      </div>

      {confirming && (
        <div role="dialog" aria-modal="true" aria-labelledby="submit-title" className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0b1427]/40 p-6 backdrop-blur-sm">
          <div className="sc-rise w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_80px_-30px_rgb(16_24_40/.5)]">
            <div className="p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-indigo/10 text-indigo"><Send className="size-5" /></span>
              <h2 id="submit-title" className="mt-4 text-lg">Submit Stage {view + 1}?</h2>
              <p className="mt-1 text-sm text-muted">You have answered {answered} of {qs.length} questions.</p>
              {answered < qs.length && <p className="mt-1 text-sm font-medium text-amber-700">{qs.length - answered} unanswered will count as wrong.</p>}
              {markedHere > 0 && <p className="mt-1 text-sm font-medium text-amber-700">{markedHere} marked for review.</p>}
              <p className="mt-1 text-sm text-muted">This stage locks once submitted.</p>
            </div>
            <div className="flex gap-3 border-t border-line bg-surface-2/60 p-4">
              <button autoFocus onClick={() => setConfirming(false)} className="flex-1 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold ring-1 ring-line hover:ring-indigo/40">Keep working</button>
              <button onClick={submit} className="flex-1 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="rounded-md bg-white px-1.5 py-0.5 font-mono text-[11px] font-semibold text-lite shadow-[inset_0_-1px_0_rgb(16_24_40/.12)] ring-1 ring-line">{children}</kbd>;
}

function TimerRing({ remaining, tone, label }: { remaining: number; tone: string; label: string }) {
  const r = 20, c = 2 * Math.PI * r;
  const left = remaining / TIME_LIMIT_SECONDS;
  return (
    <div role="timer" aria-label={`${Math.floor(remaining / 60)} minutes ${remaining % 60} seconds remaining`}
      className="flex flex-none items-center gap-2.5 rounded-xl bg-white py-1.5 pr-3.5 pl-1.5 ring-1 ring-line">
      <svg viewBox="0 0 48 48" className={`size-11 -rotate-90 ${remaining <= 60 ? "animate-pulse" : ""}`} aria-hidden>
        <circle cx="24" cy="24" r={r} fill="none" stroke="var(--color-surface-2)" strokeWidth="4" />
        <circle cx="24" cy="24" r={r} fill="none" stroke={tone} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - left)} className="transition-[stroke-dashoffset] duration-1000 ease-linear" />
      </svg>
      <div className="leading-tight">
        <span className="block font-mono text-lg font-bold tabular-nums" style={{ color: tone }}>{label}</span>
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">left</span>
      </div>
    </div>
  );
}

function ProgressRing({ value, total }: { value: number; total: number }) {
  const r = 22, c = 2 * Math.PI * r;
  return (
    <div className="relative size-14 flex-none">
      <svg viewBox="0 0 52 52" className="size-14 -rotate-90" aria-hidden>
        <defs>
          <linearGradient id="sc-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b63d9" />
            <stop offset="100%" stopColor="#22c1f5" />
          </linearGradient>
        </defs>
        <circle cx="26" cy="26" r={r} fill="none" stroke="var(--color-surface-2)" strokeWidth="5" />
        <circle cx="26" cy="26" r={r} fill="none" stroke="url(#sc-ring)" strokeWidth="5" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - value / total)} className="transition-[stroke-dashoffset] duration-500" />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-sm font-bold">{value}/{total}</span>
    </div>
  );
}

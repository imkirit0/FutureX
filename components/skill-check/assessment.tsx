"use client";

import { useEffect, useState } from "react";
import {
  LEVEL4, LEVELS, STATUSES, TIME_LIMIT_SECONDS,
  STAGES, answersOf, createSession, submissionOf,
  type Report, type Session,
} from "@/lib/engine";
import { DustSphere } from "@/components/ui/dust-sphere";
import Arena from "./arena";
import Landing from "./landing";

type Screen = "home" | "pick" | "brief" | "quiz" | "lead" | "result";

const card = "sc-glass rounded-xl border border-line p-6";
const btn = "inline-flex items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-[15px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40";
const ghost = "inline-flex items-center justify-center rounded-lg border border-line bg-surface px-5 py-2.5 text-[15px] font-semibold transition-colors hover:border-sky/40";
const tag = "inline-block text-sm font-medium text-muted";
const eyebrow = "sc-kicker";
const h1 = "mt-3 mb-3 text-[clamp(28px,4.5vw,42px)] leading-tight";
const hoverCard = "transition-colors hover:border-indigo";

export default function Assessment() {
  const [screen, setScreen] = useState<Screen>("home");
  const [s, setSession] = useState<Session | null>(null);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [result, setResult] = useState<Report | null>(null);
  const [saved, setSaved] = useState(true);

  // Each screen starts at the top (the landing page is long).
  useEffect(() => { window.scrollTo(0, 0); }, [screen]);

  function brief(level: number | null) {
    setSession(createSession(level));
    setResult(null);
    setScreen("brief");
  }

  return (
    <>
      {screen === "home" && <Landing onNew={() => brief(null)} onPick={() => setScreen("pick")} />}
      {screen !== "home" && (
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="sc-bg-grid absolute inset-0" />
          <div className="absolute -right-[18vw] top-[8vh] aspect-square w-[62vw] max-w-[900px] opacity-40">
            <DustSphere radius={0.46} count={2200} speed={0.04} interactive color="59,99,217" />
          </div>
        </div>
      )}
      {screen !== "home" && (
        <div className="mx-auto w-full max-w-5xl px-4 pt-10 pb-16 sm:px-6">
          {screen === "pick" && <Pick onBack={() => setScreen("home")} onPick={brief} />}
          {screen === "brief" && s && <Briefing s={s} onBack={() => setScreen("home")} onStart={() => setScreen("quiz")} />}
          {screen === "quiz" && s && <Arena initial={s} onFinish={(done, switches) => { setSession(done); setTabSwitches(switches); setScreen("lead"); }} />}
          {screen === "lead" && s && <LeadForm s={s} tabSwitches={tabSwitches} onDone={(r, ok) => { setResult(r); setSaved(ok); setScreen("result"); }} />}
          {screen === "result" && result && s && <Result r={result} s={s} saved={saved} onRetake={() => brief(result.chosenLevel)} onHome={() => setScreen("home")} />}
        </div>
      )}
    </>
  );
}

function Briefing({ s, onBack, onStart }: { s: Session; onBack: () => void; onStart: () => void }) {
  const rules = [
    ["It starts with the basics, then gets serious", "Stage 1 is AI basics and Stage 2 is GenAI & tools. Stages 3 and 4 are graduate-level ML and systems."],
    ["Clear a stage to go up", "Move freely between a stage's questions, then submit. Do well and the next stage unlocks."],
    [`You have ${TIME_LIMIT_SECONDS / 60} minutes`, "Most people finish in about five. Please keep this tab open while you work."],
  ];
  return (
    <section className="sc-rise mx-auto max-w-2xl">
      <button onClick={onBack} className="text-muted hover:text-lite">← Back</button>
      <div className={`${eyebrow} mt-6`}>{s.chosenLevel ? `Checking Level ${s.chosenLevel}` : "Find your level"}</div>
      <h1 className={h1}>How the quiz works</h1>
      <ol className="mt-6 grid gap-3">
        {rules.map(([t, d], i) => (
          <li key={t} className={`${card} flex gap-4 p-5`}>
            <span className="grid size-7 flex-none place-items-center rounded-md bg-surface-2 text-sm font-semibold text-indigo">{i + 1}</span>
            <div><strong>{t}</strong><p className="mt-0.5 text-sm text-muted">{d}</p></div>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex justify-end"><button className={btn} onClick={onStart}>Start the quiz</button></div>
    </section>
  );
}

function Pick({ onBack, onPick }: { onBack: () => void; onPick: (n: number) => void }) {
  return (
    <section className="sc-rise">
      <button onClick={onBack} className="text-muted hover:text-lite">← Back</button>
      <h1 className={h1}>Which level did you choose?</h1>
      <p className="mb-8 text-lg text-muted">We&apos;ll check whether your current knowledge matches it.</p>
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map(n => (
          <button key={n} onClick={() => onPick(n)} className={`${card} ${hoverCard} flex flex-col items-start text-left`}>
            <span className={tag}>Level {n}</span>
            <h2 className="mt-3 text-xl font-semibold">{LEVELS[n].name}</h2>
            <p className="mt-2 text-sm text-muted">{LEVELS[n].blurb}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function LeadForm({ s, tabSwitches, onDone }: { s: Session; tabSwitches: number; onDone: (r: Report, saved: boolean) => void }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"), email: f.get("email"), phone: f.get("phone"), status: f.get("status"),
          consent: f.get("consent") === "on",
          chosenLevel: s.chosenLevel,
          stages: submissionOf(s),
          tabSwitches,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onDone(data.report, data.saved !== false);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  const input = "mt-1.5 w-full rounded-xl border border-line bg-surface-2 px-4 py-3 outline-none focus:border-cyan";
  return (
    <section className="sc-rise mx-auto mt-6 max-w-xl">
      <div className={eyebrow}>All done</div>
      <h1 className={h1}>Where should we send your results?</h1>
      <p className="mb-6 text-muted">A FutureX advisor can also call you to talk through your results and course options. It&apos;s free.</p>
      <form onSubmit={submit} className={`${card} grid gap-4`}>
        <label className="text-sm font-medium">Full name<input name="name" required minLength={2} autoComplete="name" className={input} /></label>
        <label className="text-sm font-medium">Email<input name="email" type="email" required autoComplete="email" className={input} /></label>
        <label className="text-sm font-medium">Phone / WhatsApp<input name="phone" type="tel" required pattern="\+?[\d\s\-]{7,20}" placeholder="+91 98765 43210" autoComplete="tel" className={input} /></label>
        <fieldset>
          <legend className="text-sm font-medium">I am a…</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {STATUSES.map(st => (
              <label key={st} className="cursor-pointer rounded-lg border border-line px-3.5 py-2 text-sm has-checked:border-indigo has-checked:bg-indigo/10 has-checked:font-medium">
                <input type="radio" name="status" value={st} required className="sr-only" />{st}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex items-start gap-3 text-sm text-muted">
          <input type="checkbox" name="consent" required className="mt-1 size-4 accent-cyan" />
          I agree to be contacted by FutureX AI Lab (G-TEC EDUCATION) about my results and courses.
        </label>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <button className={btn} disabled={busy}>{busy ? "Saving…" : "See my results"}</button>
      </form>
    </section>
  );
}

function verdictCopy(r: Report) {
  const L = (n: number) => `Level ${n}`;
  if (!r.chosenLevel) {
    if (r.top < 0) return { tone: "info", title: "A fresh start, and that's perfect.", body: "Level 1 builds the reasoning and GenAI foundations these stages test, from the ground up." };
    if (r.beyond) return { tone: "info", title: "You're already strong across agents and RAG.", body: `Level 3 will sharpen your deployment skills. Also take a look at the ${LEVEL4.name}.` };
    return { tone: "info", title: `We recommend ${L(r.recommended)}.`, body: `You cleared ${r.stages[r.top].name}, so ${L(r.recommended)} is your natural next step.` };
  }
  if (r.verdict === "fit") return { tone: "fit", title: `${L(r.chosenLevel)} is the right choice for you.`, body: "Your answers match what this level expects. You're ready to start." };
  if (r.verdict === "too-high") return { tone: "warn", title: `We recommend starting with ${L(r.recommended)} first.`, body: `${L(r.chosenLevel)} builds on skills you haven't shown yet. Starting at ${L(r.recommended)} will make ${L(r.chosenLevel)} much easier later.` };
  return { tone: "info", title: `You may be ready for ${L(r.recommended)}.`, body: `You cleared questions beyond ${L(r.chosenLevel)}. It will still work as a refresher, but ${L(r.recommended)} would challenge you more.` };
}

const TABS = ["Overview", "Answer review", "Your course"] as const;

function Result({ r, s, saved, onRetake, onHome }: { r: Report; s: Session; saved: boolean; onRetake: () => void; onHome: () => void }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const v = verdictCopy(r);
  const tone = { fit: "border-green-500/40 bg-green-500/10", warn: "border-amber-500/40 bg-amber-500/10", info: "border-cyan/50 bg-cyan/10" }[v.tone];

  function onTabKey(e: React.KeyboardEvent) {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (d) setTab(TABS[(TABS.indexOf(tab) + d + TABS.length) % TABS.length]);
  }

  return (
    <section className="sc-rise">
      <div className={eyebrow}>Your results</div>
      <h1 className={h1}>{r.chosenLevel ? "Course fit check" : "Your AI knowledge profile"}</h1>
      <div className={`mb-8 rounded-xl border p-6 ${tone}`}>
        <h2 className="text-2xl font-semibold">{v.title}</h2>
        <p className="mt-1.5 text-muted">{v.body}</p>
      </div>
      {!saved && (
        <p role="status" className="-mt-4 mb-8 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
          We couldn&apos;t save your contact details, so an advisor won&apos;t reach out automatically. <a className="font-semibold text-indigo hover:underline" href="/contact">Contact us</a> to talk through your results.
        </p>
      )}

      <div role="tablist" aria-label="Report sections" onKeyDown={onTabKey} className="mb-6 flex gap-6 overflow-x-auto border-b border-line">
        {TABS.map(t => (
          <button key={t} role="tab" id={`tab-${t}`} aria-selected={tab === t} aria-controls="report-panel" tabIndex={tab === t ? 0 : -1}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${tab === t ? "border-indigo text-lite" : "border-transparent text-muted hover:text-lite"}`}>
            {t}
          </button>
        ))}
      </div>

      <div key={tab} id="report-panel" role="tabpanel" className="sc-rise" aria-labelledby={`tab-${tab}`}>
        {tab === "Overview" && <Overview r={r} />}
        {tab === "Answer review" && <Review s={s} />}
        {tab === "Your course" && <Course r={r} />}
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button className={ghost} onClick={onRetake}>Retake</button>
        <button className={btn} onClick={onHome}>Back to start</button>
      </div>
    </section>
  );
}

function Overview({ r }: { r: Report }) {
  return (
      <div className="grid gap-4 md:grid-cols-2">
        <div className={card}>
          <span className={tag}>How far you climbed</span>
          <p className="mt-3 text-5xl font-bold">{r.top + 1}<span className="text-2xl text-muted">/4 stages</span></p>
          <p className="mt-1 text-sm text-muted">{r.score} of {r.total} answers correct</p>
          <div className="mt-5 grid gap-3.5">
            {r.stages.map(st => (
              <div key={st.name} className="text-sm">
                <div className="flex justify-between"><span>{st.name}</span>
                  <span className={st.status === "passed" ? "text-green-700" : "text-muted"}>{st.status === "passed" ? "Passed" : st.status === "stopped" ? `${st.right}/${st.total}` : "not reached"}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
                  <i className="block h-full bg-indigo" style={{ width: st.status === "passed" ? "100%" : st.total ? `${(st.right / st.total) * 100}%` : 0 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={card}>
          <span className={tag}>Strengths</span>
          <Chips items={r.strengths} cls="border-green-500/50 text-green-700" empty="Keep going, strengths will show soon." />
          <span className={`${tag} mt-6`}>Focus areas</span>
          <Chips items={r.gaps} cls="border-amber-500/50 text-amber-700" empty="No major gaps found." />
        </div>
      </div>
  );
}

function Review({ s }: { s: Session }) {
  const answers = answersOf(s);
  return (
    <div className="grid gap-6">
      {STAGES.map((name, b) => {
        const items = answers.filter(a => a.q.b === b);
        if (!items.length) return null;
        return (
          <div key={name}>
            <h3 className="mb-3 text-sm font-semibold text-muted">Stage {b + 1} · {name}</h3>
            <ol className="grid gap-3">
              {items.map(({ q, choice, correct }, i) => (
                <li key={q.q} className={`${card} p-5`}>
                  <p className="text-xs text-muted">Q{i + 1} · {q.t} · <span className={correct ? "text-green-700" : "text-red-600"}>{correct ? "Correct" : choice === null ? "Not answered" : "Incorrect"}</span></p>
                  <p className="mt-1.5 font-semibold">{q.q}</p>
                  {!correct && choice !== null && <p className="mt-2 text-sm text-red-600">Your answer: {q.o[choice]}</p>}
                  <p className="mt-1 text-sm text-green-700">Correct answer: {q.o[q.a]}</p>
                  <p className="mt-2 text-sm text-muted">{q.e}</p>
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}

function Course({ r }: { r: Report }) {
  const course = LEVELS[r.recommended];
  return (
    <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
      <div className={card}>
        <span className={tag}>Recommended · Level {r.recommended}</span>
        <h3 className="mt-3 text-2xl font-semibold">{course.name}</h3>
        <p className="mt-2 text-muted">{course.blurb}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a className={btn} href="/contact">Book free counselling</a>
          <a className={ghost} href={course.url}>View course</a>
          {r.beyond && <a className={ghost} href={LEVEL4.url}>Level 4 program</a>}
        </div>
      </div>
      <ol className={`${card} grid content-start gap-3`} aria-label="FutureX pathway">
        {[1, 2, 3].map(n => (
          <li key={n} className={`flex gap-3 rounded-lg p-3 ${n === r.recommended ? "bg-indigo/10 ring-1 ring-indigo/30" : ""}`}>
            <span className={`grid size-8 flex-none place-items-center rounded-md text-sm font-semibold ${n === r.recommended ? "bg-brand" : "bg-surface-2 text-muted"}`}>{n}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{LEVELS[n].name}</p>
              <p className="text-xs text-muted">{n < r.recommended ? "You're past this level" : n === r.recommended ? "Start here" : "Up next"}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Chips({ items, cls, empty }: { items: string[]; cls: string; empty: string }) {
  if (!items.length) return <p className="mt-2 text-sm text-muted">{empty}</p>;
  return <div className="mt-2 flex flex-wrap gap-2">{items.map(t => <span key={t} className={`rounded-md border px-2.5 py-1 text-[13px] ${cls}`}>{t}</span>)}</div>;
}

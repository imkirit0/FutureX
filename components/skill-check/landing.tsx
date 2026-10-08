import Image from "next/image";
import {
  ArrowRight, Check, Clock, GraduationCap, Layers, ListChecks, Gift, Sparkles, Target, TrendingUp, Plus,
} from "lucide-react";
import { BEGINNER_STAGES, LEVELS, STAGES } from "@/lib/engine";

const btn = "group inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-[15px] font-medium shadow-[0_10px_30px_-12px_rgb(58_99_224/.7)] transition-all hover:-translate-y-0.5";
const ghost = "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-ink/80 px-6 py-3 text-[15px] font-medium backdrop-blur transition-all hover:-translate-y-0.5 hover:border-indigo/40 hover:text-indigo";
const wrap = "mx-auto w-full max-w-6xl px-4 sm:px-6";

export default function Landing({ onNew, onPick }: { onNew: () => void; onPick: () => void }) {
  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="sc-bg-grid absolute inset-0" />
          <div className="sc-drift absolute -top-32 -left-24 size-[480px] rounded-full bg-indigo/10 blur-3xl" />
          <div className="sc-drift absolute top-10 right-[-120px] size-[420px] rounded-full bg-cyan/10 blur-3xl [animation-delay:-9s]" />
        </div>

        <div className={`${wrap} relative grid items-center gap-16 pt-16 pb-24 lg:grid-cols-[1.1fr_1fr] lg:pt-24`}>
          <div>
            <div className="sc-blur-in inline-flex items-center gap-2 rounded-full border border-indigo/20 bg-ink/80 px-3.5 py-1.5 text-sm text-muted backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-cyan" />
              </span>
              Free AI skill check · about 5 minutes
            </div>
            <h1 className="sc-blur-in mt-6 text-[clamp(38px,5.6vw,68px)] leading-[1.02] [animation-delay:80ms]">
              Find your level in AI. <span className="sc-text-gradient">Start where you belong.</span>
            </h1>
            <p className="sc-blur-in mt-6 max-w-xl text-lg leading-relaxed text-muted [animation-delay:160ms]">
              A short, progressive quiz from FutureX AI Lab. It starts with everyday questions, gets harder as you go, and
              matches you to the FutureX course that fits.
            </p>
            <div className="sc-blur-in mt-9 flex flex-wrap gap-3 [animation-delay:240ms]">
              <button className={btn} onClick={onNew}>
                I&apos;m new to AI <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button className={ghost} onClick={onPick}>I&apos;ve picked a FutureX level</button>
            </div>
            <dl className="sc-blur-in mt-12 flex flex-wrap gap-x-8 gap-y-4 [animation-delay:320ms]">
              {[[Clock, "5 min", "average time"], [Layers, "4 levels", "easy to advanced"], [Gift, "Free", "results + advice"]].map(([Icon, v, l]) => {
                const I = Icon as typeof Clock;
                return (
                  <div key={l as string} className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-indigo/10 text-indigo"><I className="size-5" /></span>
                    <div><dt className="font-display font-semibold">{v as string}</dt><dd className="text-sm text-muted">{l as string}</dd></div>
                  </div>
                );
              })}
            </dl>
          </div>

          <HeroVisual />
        </div>

      </section>

      {/* ---------- Two paths ---------- */}
      <section className={`${wrap} py-24 md:py-28`}>
        <SectionHead kicker="Two ways to start" title="Pick the one that sounds like you" sub="Each path has its own questions and its own four levels." />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <PathCard
            icon={Sparkles}
            title="I'm new to AI"
            body="Everyday questions about the apps you already use: Netflix, Maps, ChatGPT. No technical knowledge needed."
            levels={BEGINNER_STAGES}
            cta="Start the beginner quiz"
            onClick={onNew}
            featured
          />
          <PathCard
            icon={GraduationCap}
            title="I've picked a FutureX level"
            body="Already chosen Level 1, 2 or 3? Engineering-level questions, pitched at NIT / B.Tech students, test the maths, ML and LLM depth that level expects."
            levels={STAGES}
            cta="Check my level"
            onClick={onPick}
          />
        </div>
      </section>

      {/* ---------- How it works (bento) ---------- */}
      <section className="relative overflow-hidden bg-surface-2/70 py-24 md:py-28">
        <div aria-hidden className="sc-bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className={`${wrap} relative`}>
          <SectionHead kicker="How it works" title="Three steps, about five minutes" />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            <Bento icon={ListChecks} step="01" title="Answer at your own pace" body="Each level has 3 or 4 questions. Jump between them, change your mind, mark some for review.">
              <div className="flex gap-2">
                {["done", "done", "review", "current"].map((st, i) => (
                  <span key={i} className={`relative grid size-10 place-items-center rounded-lg border text-sm font-medium ${st === "current" ? "border-indigo bg-brand" : st === "done" ? "border-green-500/40 bg-green-500/10 text-green-700" : "border-line bg-surface text-muted"}`}>
                    {i + 1}{st === "review" && <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-amber-500" />}
                  </span>
                ))}
              </div>
            </Bento>
            <Bento icon={TrendingUp} step="02" title="Pass a level to go up" body="Get most of a level right and the next one opens. The quiz stops when it finds your ceiling.">
              <div className="flex h-14 items-end gap-2">
                {[30, 50, 72, 100].map((h, i) => (
                  <span key={i} className={`flex-1 rounded-t-md ${i < 3 ? "bg-gradient-to-t from-indigo to-cyan" : "border border-dashed border-indigo/40 bg-surface"}`} style={{ height: `${h}%`, opacity: i < 3 ? 0.45 + i * 0.25 : 1 }} />
                ))}
              </div>
            </Bento>
            <Bento icon={Target} step="03" title="Get your course match" body="Strengths, focus areas and the FutureX course to start with. An advisor can call you to talk it through.">
              <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
                <span className="grid size-8 place-items-center rounded-full bg-green-500/10 text-green-700"><Check className="size-4" /></span>
                <div className="text-sm"><p className="font-medium">Recommended: Level 2</p><p className="text-muted">Pipelines &amp; RAG Systems</p></div>
              </div>
            </Bento>
          </div>
        </div>
      </section>

      {/* ---------- Courses ---------- */}
      <section className={`${wrap} py-24 md:py-28`}>
        <SectionHead kicker="Our courses" title="The FutureX course path" sub="Wherever your quiz ends, one of these is your next step." />
        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map(n => {
            const [hours, ...rest] = LEVELS[n].blurb.split(" · ");
            const topics = rest.length ? rest.join(" · ") : hours;
            return (
              <li key={n} className="group relative flex flex-col rounded-2xl border border-line bg-surface p-7 transition-all duration-200 hover:-translate-y-1 hover:sc-border-gradient hover:shadow-[0_24px_50px_-28px_rgb(58_99_224/.45)]">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-indigo/10 px-3 py-1 text-xs font-semibold tracking-wide text-indigo">LEVEL {n}</span>
                  {rest.length > 0 && <span className="flex items-center gap-1.5 text-sm text-muted"><Clock className="size-3.5" />{hours}</span>}
                </div>
                <h3 className="mt-5 text-lg leading-snug font-semibold">{LEVELS[n].name}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{topics}</p>
                <a href={LEVELS[n].url} className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-indigo">
                  Know more <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </a>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className={`${wrap} grid gap-10 pb-24 md:pb-28 lg:grid-cols-[1fr_1.6fr]`}>
        <div>
          <p className="sc-kicker">Questions</p>
          <h2 className="mt-4 text-[clamp(28px,3.4vw,40px)] leading-tight">Before you start</h2>
          <p className="mt-4 text-muted">Something else on your mind? <a className="font-medium text-indigo hover:underline" href="/contact">Contact the FutureX team</a>.</p>
        </div>
        <div className="grid gap-3">
          {[
            ["Is it really free?", "Yes. The quiz and your results are free, and so is the follow-up call with an advisor if you want one."],
            ["I've never studied AI. Will I fail?", "There's no pass or fail. The beginner quiz starts with questions about apps you already use, and stopping early simply means Level 1 is the right place to begin."],
            ["What happens to my details?", "We ask for your name, email and phone at the end so we can send your results and, with your permission, have an advisor contact you about courses."],
            ["Can I take it again?", "Yes. You'll get a different mix of questions each time."],
          ].map(([q, a]) => (
            <details key={q} className="group rounded-xl border border-line bg-surface px-5 transition-colors open:border-indigo/30 open:bg-indigo/[0.02]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-display font-medium">
                {q}
                <Plus aria-hidden className="size-5 flex-none text-indigo transition-transform group-open:rotate-45" />
              </summary>
              <p className="pb-4 leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className={`${wrap} pb-24`}>
        <div className="relative overflow-hidden rounded-3xl bg-[#070b18] px-6 py-20 text-center text-white sm:px-12">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -bottom-40 left-1/2 size-[560px] -translate-x-1/2 rounded-full bg-indigo/40 blur-3xl" />
            <div className="absolute inset-0 [background-image:linear-gradient(rgb(255_255_255/.05)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/.05)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_100%,#000,transparent)]" />
            <Image src="/img/fx-globe.png" alt="" width={300} height={353} className="absolute -top-16 -right-16 opacity-15" />
          </div>
          <div className="relative">
            <p className="sc-kicker !text-cyan">Ready when you are</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-[clamp(30px,4vw,46px)] leading-tight">Five minutes now saves weeks in the wrong course.</h2>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <button onClick={onNew} className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-6 py-3 text-[15px] font-medium text-[#070b14] transition-all hover:-translate-y-0.5">
                I&apos;m new to AI <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button onClick={onPick} className="cursor-pointer rounded-xl border border-white/25 px-6 py-3 text-[15px] font-medium transition-all hover:-translate-y-0.5 hover:border-white/60">I&apos;ve picked a FutureX level</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHead({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="sc-kicker">{kicker}</p>
      <h2 className="mt-4 text-[clamp(30px,3.8vw,46px)] leading-tight">{title}</h2>
      {sub && <p className="mt-4 text-lg text-muted">{sub}</p>}
    </div>
  );
}

function PathCard({ icon: Icon, title, body, levels, cta, onClick, featured }: {
  icon: typeof Sparkles; title: string; body: string; levels: string[]; cta: string; onClick: () => void; featured?: boolean;
}) {
  return (
    <div className={`group relative flex flex-col rounded-2xl p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_30px_60px_-34px_rgb(58_99_224/.5)] ${featured ? "sc-border-gradient" : "border border-line bg-surface"}`}>
      {featured && <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 text-xs font-medium">Start here if unsure</span>}
      <span className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-indigo/15 to-cyan/15 text-indigo"><Icon className="size-6" /></span>
      <h3 className="mt-6 text-2xl font-semibold">{title}</h3>
      <p className="mt-3 leading-relaxed text-muted">{body}</p>
      <ol className="mt-6 grid flex-1 content-start gap-3 border-t border-line pt-6">
        {levels.map((l, i) => {
          const [name, topic] = l.split(" · ");
          return (
            <li key={l} className="flex items-center gap-3 text-[15px]">
              <span className="grid size-6 flex-none place-items-center rounded-full bg-indigo/10 text-xs font-semibold text-indigo">{i + 1}</span>
              <span className="font-medium">{name}</span>
              {topic && <span className="text-muted">{topic}</span>}
            </li>
          );
        })}
      </ol>
      <button onClick={onClick} className={`${featured ? btn : ghost} mt-8 self-start`}>
        {cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

function Bento({ icon: Icon, step, title, body, children }: { icon: typeof Target; step: string; title: string; body: string; children: React.ReactNode }) {
  return (
    <div className="sc-glass flex flex-col rounded-2xl border border-line p-7 transition-all duration-200 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <span className="grid size-11 place-items-center rounded-xl bg-indigo/10 text-indigo"><Icon className="size-5" /></span>
        <span className="font-display text-sm font-semibold text-indigo/40">{step}</span>
      </div>
      <h3 className="mt-5 text-xl font-semibold">{title}</h3>
      <p className="mt-2 leading-relaxed text-muted">{body}</p>
      <div className="mt-6 rounded-xl bg-surface-2 p-4">{children}</div>
    </div>
  );
}

// Example of the real quiz screen with floating status chips.
function HeroVisual() {
  const options = ["The sender asked it to", "Your inbox was full", "AI learned what spam emails usually look like", "Pure chance"];
  return (
    <div className="sc-blur-in relative mx-auto w-full max-w-md [animation-delay:200ms]">
      <div aria-hidden className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-indigo/20 via-cyan/10 to-transparent blur-2xl" />
      <figure className="sc-float sc-border-gradient relative rounded-2xl p-6 shadow-[0_40px_80px_-40px_rgb(11_16_32/.45)]" aria-label="Example question from the quiz">
        <div className="flex items-center gap-1.5" aria-hidden>
          {BEGINNER_STAGES.map((s, i) => (
            <span key={s} className={`h-1.5 flex-1 rounded-full ${i === 0 ? "bg-gradient-to-r from-indigo to-cyan" : "bg-surface-2"}`} />
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted">
          <span>Stage 1 · Curious</span>
          <span>Question 3 of 4 · <span className="font-medium text-amber-700">Medium</span></span>
        </div>
        <p className="mt-3 font-display text-lg leading-snug font-semibold">Your inbox moves &ldquo;You WON a free iPhone!!!&rdquo; straight to spam. Why?</p>
        <ul className="mt-4 grid gap-2" aria-hidden>
          {options.map((o, i) => (
            <li key={o} className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm ${i === 2 ? "bg-indigo/10 ring-2 ring-indigo" : "ring-1 ring-line"}`}>
              <span className={`grid size-6 flex-none place-items-center rounded-md text-xs font-semibold ${i === 2 ? "bg-brand" : "bg-surface-2 text-muted"}`}>{"ABCD"[i]}</span>
              {o}
            </li>
          ))}
        </ul>
        <figcaption className="mt-4 border-t border-line pt-3 text-xs text-muted">Example question from the beginner quiz</figcaption>
      </figure>

      <div aria-hidden className="sc-float-slow sc-glass absolute -top-5 -left-6 hidden items-center gap-2.5 rounded-xl border border-line px-3.5 py-2.5 sm:flex">
        <span className="grid size-7 place-items-center rounded-full bg-green-500/10 text-green-700"><Check className="size-4" /></span>
        <span className="text-sm font-medium">Stage 1 cleared</span>
      </div>
      <div aria-hidden className="sc-float-slow sc-glass absolute -right-6 -bottom-6 hidden items-center gap-2.5 rounded-xl border border-line px-3.5 py-2.5 [animation-delay:-5s] sm:flex">
        <span className="grid size-7 place-items-center rounded-full bg-indigo/10 text-indigo"><Target className="size-4" /></span>
        <span className="text-sm"><span className="font-medium">Match:</span> <span className="text-muted">Level 1</span></span>
      </div>
    </div>
  );
}

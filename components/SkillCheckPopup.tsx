"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Clock, Gift, Layers, X } from "lucide-react";

const KEY = "fx-skill-popup-seen";
const PERKS = [[Clock, "20 min"], [Layers, "4 stages"], [Gift, "Free"]] as const;

// Invites visitors to the skill check after 6s on the site; once per browser session.
export default function SkillCheckPopup() {
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/skill-check")) return;
    try { if (sessionStorage.getItem(KEY)) return; } catch {}
    const id = setTimeout(() => {
      ref.current?.showModal();
      try { sessionStorage.setItem(KEY, "1"); } catch {}
    }, 6000);
    return () => clearTimeout(id);
  }, [pathname]);

  const close = () => ref.current?.close();

  return (
    <dialog ref={ref} aria-labelledby="skill-popup-title" onClick={e => e.target === e.currentTarget && close()}
      className="fx-pop m-auto w-[calc(100%-2rem)] max-w-[440px] overflow-visible bg-transparent p-0 text-lite backdrop:bg-[#03060d]/70 backdrop:backdrop-blur-md">
      {/* Glow halo behind the card */}
      <div aria-hidden className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] bg-[radial-gradient(closest-side,rgb(34_193_245/.28),transparent)] blur-2xl" />

      <div className="relative overflow-hidden rounded-3xl bg-ink-2 ring-1 ring-white/10 shadow-[0_40px_120px_-30px_rgb(34_193_245/.35)]">
        {/* Gradient border sheen */}
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl p-px [background:linear-gradient(140deg,rgb(124_220_251/.6),transparent_35%,transparent_65%,rgb(32_104_216/.6))] [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)]" />

        {/* Hero image */}
        <div className="relative h-52 overflow-hidden sm:h-60">
          <Image src="/img/ascent-trail.png" alt="" fill sizes="440px" className="fx-pop-img object-cover object-[40%_45%] saturate-150" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-ink-2" />
          <div aria-hidden className="absolute inset-0 [background-image:linear-gradient(rgb(255_255_255/.06)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/.06)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_70%_80%_at_70%_20%,#000,transparent)]" />

          <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-medium tracking-wide backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-cyan" />
            </span>
            FREE AI SKILL CHECK
          </span>
          <button onClick={close} aria-label="Close"
            className="absolute top-3 right-3 grid size-9 cursor-pointer place-items-center rounded-full border border-white/15 bg-black/40 text-white/70 backdrop-blur-md transition hover:rotate-90 hover:text-white">
            <X className="size-4" />
          </button>
        </div>

        <div className="relative -mt-10 px-7 pb-7">
          <h2 id="skill-popup-title" className="font-display text-[28px] leading-[1.1] font-semibold tracking-tight">
            Where do you stand <span className="text-gradient animate-gradient-x">in AI?</span>
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-body-soft">
            AI basics, GenAI, then graduate-level ML. Climb as far as you can and we&apos;ll match you to the right FutureX course.
          </p>

          {/* Level ladder */}
          <div aria-hidden className="mt-6 flex items-end gap-1.5">
            {[35, 55, 78, 100].map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="fx-pop-bar w-full rounded-lg bg-gradient-to-t from-blue to-accent shadow-[0_0_20px_-4px_rgb(34_193_245/.6)]" style={{ height: h * 0.6, opacity: 0.35 + i * 0.2, animationDelay: `${200 + i * 90}ms` }} />
                <span className="font-mono text-[10px] text-sky-dim">L{i + 1}</span>
              </div>
            ))}
          </div>

          <ul className="mt-5 flex flex-wrap gap-2">
            {PERKS.map(([Icon, label]) => (
              <li key={label} className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-3 py-1.5 text-xs text-body-soft ring-1 ring-white/10">
                <Icon className="size-3.5 text-accent" />{label}
              </li>
            ))}
          </ul>

          <Link href="/skill-check" onClick={close}
            className="group relative mt-7 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-blue to-[#22a5f5] px-5 py-3.5 font-medium text-white shadow-[0_14px_40px_-12px_rgb(34_193_245/.7)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-12px_rgb(34_193_245/.9)]">
            <span aria-hidden className="absolute inset-y-0 left-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            Start my skill check <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <button onClick={close} className="mt-3 w-full cursor-pointer py-1.5 text-sm text-sky-dim transition hover:text-lite">
            Maybe later
          </button>
        </div>
      </div>
    </dialog>
  );
}

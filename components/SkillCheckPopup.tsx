"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Sparkles, X } from "lucide-react";

const KEY = "fx-skill-popup-seen";

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
      className="m-auto w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0c1424] p-0 text-white shadow-[0_30px_80px_-30px_rgb(0_0_0/.8)] backdrop:bg-black/60 backdrop:backdrop-blur-sm">
      <div className="relative p-7">
        <button onClick={close} aria-label="Close" className="absolute top-4 right-4 grid size-8 cursor-pointer place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"><X className="size-4" /></button>
        <span className="grid size-11 place-items-center rounded-xl bg-[#3a63e0]/20 text-[#8fb0ff]"><Sparkles className="size-5" /></span>
        <h2 id="skill-popup-title" className="mt-4 text-xl font-semibold">Not sure where to start?</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-white/70">Take the free 5-minute AI skill check and we&apos;ll match you to the right FutureX course.</p>
      </div>
      <div className="flex flex-col gap-3 border-t border-white/10 bg-white/[0.03] p-4 sm:flex-row">
        <Link href="/skill-check" onClick={close} className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#3a63e0] px-4 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5">
          Take the skill check <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <button onClick={close} className="flex-1 cursor-pointer rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-white/80 hover:border-white/40 hover:text-white">Maybe later</button>
      </div>
    </dialog>
  );
}

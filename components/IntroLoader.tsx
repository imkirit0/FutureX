"use client";

import { useEffect, useRef, useState } from "react";

const KEY = "fx-loader-seen";

/* Intro video, once per session. Rendered on the server so the page never flashes first;
   the inline script in layout.tsx hides it before paint on repeat visits (see .fx-no-loader in globals.css). */
export default function IntroLoader() {
  const [state, setState] = useState<"on" | "fading" | "off">("on");
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (html.classList.contains("fx-no-loader") || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("off");
      return;
    }
    try { sessionStorage.setItem(KEY, "1"); } catch {}
    video.current?.play().catch(() => finish());
    const fallback = setTimeout(finish, 7000); // stalled network or blocked autoplay
    return () => clearTimeout(fallback);
  }, []);

  function finish() {
    setState((s) => (s === "on" ? "fading" : s));
  }

  if (state === "off") return null;
  return (
    <div
      id="fx-loader"
      role="status"
      aria-label="Loading FutureX"
      onClick={finish}
      onTransitionEnd={() => state === "fading" && setState("off")}
      className={`fixed inset-0 z-[200] grid place-items-center bg-black transition-opacity duration-700 ${state === "fading" ? "pointer-events-none opacity-0" : ""}`}
    >
      <video
        ref={video}
        src="/video/loader.mp4"
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        onError={finish}
        className="h-full w-full object-contain landscape:object-cover"
      />
    </div>
  );
}

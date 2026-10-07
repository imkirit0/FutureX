"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/* Card whose border and surface light up around the cursor.
   Pure CSS variables, no re-render on mouse move. */
export function SpotlightCard({
  children,
  className,
  innerClassName,
  as: Tag = "div",
  radius = 520,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  as?: "div" | "article" | "li";
  radius?: number;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);

  function onMove(e: React.MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  const Comp = Tag as React.ElementType;
  return (
    <Comp
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        "group/spot relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-1 hover:border-white/15 hover:shadow-card-lg",
        className
      )}
      style={{ ["--mx" as string]: "50%", ["--my" as string]: "50%" }}
      {...rest}
    >
      {/* surface glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(${radius}px circle at var(--mx) var(--my), rgba(52,198,247,0.14), transparent 45%)`,
        }}
      />
      {/* border glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          padding: 1,
          background: `radial-gradient(${radius * 0.6}px circle at var(--mx) var(--my), rgba(52,198,247,0.7), transparent 45%)`,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div className={cn("relative h-full", innerClassName)}>{children}</div>
    </Comp>
  );
}

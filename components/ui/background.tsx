import { cn } from "@/lib/utils";

/* Faint blueprint grid, masked so it fades toward the edges. */
export function GridPattern({
  className,
  size = 48,
  mask = "radial-gradient(ellipse 70% 60% at 50% 0%, #000 30%, transparent 100%)",
}: {
  className?: string;
  size?: number;
  mask?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(168,198,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(168,198,255,0.07) 1px, transparent 1px)",
        backgroundSize: `${size}px ${size}px`,
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    />
  );
}

export function DotPattern({
  className,
  size = 24,
  mask = "radial-gradient(ellipse 60% 60% at 50% 50%, #000 20%, transparent 100%)",
}: {
  className?: string;
  size?: number;
  mask?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: "radial-gradient(rgba(168,198,255,0.22) 1px, transparent 1px)",
        backgroundSize: `${size}px ${size}px`,
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    />
  );
}

/* Soft colour blooms that drift slowly. */
export function Aurora({ className, intensity = 1 }: { className?: string; intensity?: number }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className="absolute -left-[10%] top-[-20%] h-[60vh] w-[60vw] rounded-full blur-[110px] animate-aurora"
        style={{ background: `rgba(32,104,216,${0.28 * intensity})` }}
      />
      <div
        className="absolute right-[-15%] top-[10%] h-[55vh] w-[50vw] rounded-full blur-[120px] animate-aurora [animation-delay:-6s] [animation-duration:22s]"
        style={{ background: `rgba(52,198,247,${0.18 * intensity})` }}
      />
      <div
        className="absolute bottom-[-30%] left-[25%] h-[50vh] w-[55vw] rounded-full blur-[130px] animate-aurora [animation-delay:-12s] [animation-duration:26s]"
        style={{ background: `rgba(124,220,251,${0.1 * intensity})` }}
      />
    </div>
  );
}

/* Single radial glow; place behind a focal element. */
export function Glow({
  className,
  color = "rgba(52,198,247,0.35)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute rounded-full blur-3xl", className)}
      style={{ background: color }}
    />
  );
}

/* Hairline divider with a bright centre, used as a section separator. */
export function Hairline({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent",
        className
      )}
    />
  );
}

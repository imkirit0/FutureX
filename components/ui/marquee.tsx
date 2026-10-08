import { cn } from "@/lib/utils";

/* Infinite horizontal scroller. Pauses on hover; edges fade out. */
export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = true,
  duration = "40s",
  gap = "1.5rem",
  fade = true,
}: {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  duration?: string;
  gap?: string;
  fade?: boolean;
}) {
  return (
    <div
      className={cn(
        "group/marquee flex w-full overflow-hidden",
        fade &&
          "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className
      )}
      style={{ ["--gap" as string]: gap, ["--duration" as string]: duration, gap }}
    >
      {[0, 1].map((n) => (
        <div
          key={n}
          aria-hidden={n === 1}
          className={cn(
            "flex shrink-0 items-center justify-around animate-marquee motion-reduce:animate-none",
            reverse && "[animation-direction:reverse]",
            pauseOnHover && "group-hover/marquee:[animation-play-state:paused]"
          )}
          // Set here: --animate-marquee resolves --duration at :root, so the prop alone has no effect.
          style={{ gap, animationDuration: duration }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

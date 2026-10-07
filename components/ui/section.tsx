import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BlurIn, FadeIn } from "@/components/ui/text";

export function Container({
  children,
  className,
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}) {
  const widths = {
    default: "max-w-7xl",
    narrow: "max-w-3xl",
    wide: "max-w-[90rem]",
  };
  return (
    <div className={cn("mx-auto w-full px-5 sm:px-6 lg:px-8", widths[size], className)}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
  id,
  tone = "ink",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tone?: "ink" | "paper" | "transparent";
}) {
  const tones = {
    ink: "",
    paper: "bg-paper/50",
    transparent: "",
  };
  return (
    <section id={id} className={cn("relative py-20 md:py-28", tones[tone], className)}>
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  icon,
  title,
  description,
  align = "left",
  className,
  action,
}: {
  eyebrow?: string;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  action?: React.ReactNode;
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        centered && "md:flex-col md:items-center md:text-center",
        className
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto flex flex-col items-center")}>
        {eyebrow && (
          <FadeIn>
            <Badge icon={icon} className="mb-5">
              {eyebrow}
            </Badge>
          </FadeIn>
        )}
        <BlurIn
          as="h2"
          text={title}
          className="font-display text-balance text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl md:text-[2.75rem] md:leading-[1.08]"
        />
        {description && (
          <FadeIn delay={0.15}>
            <p className="mt-4 text-pretty text-[1.05rem] leading-relaxed text-body-soft md:text-lg">
              {description}
            </p>
          </FadeIn>
        )}
      </div>
      {action && <FadeIn delay={0.2} className="shrink-0">{action}</FadeIn>}
    </div>
  );
}

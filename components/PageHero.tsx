import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/section";
import { GridPattern, Glow } from "@/components/ui/background";
import { BlurIn, FadeIn } from "@/components/ui/text";
import { cn } from "@/lib/utils";

/* Interior-page hero. Text left, optional visual right, optional fact strip. */
export default function PageHero({
  eyebrow,
  icon,
  title,
  description,
  actions,
  aside,
  facts,
  compact = false,
}: {
  eyebrow: string;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  aside?: React.ReactNode;
  facts?: { label: string; value: string }[];
  compact?: boolean;
}) {
  return (
    <section className={cn("relative overflow-hidden pt-32 md:pt-40", compact ? "pb-10 md:pb-14" : "pb-16 md:pb-20")}>
      <GridPattern />
      <Glow className="-top-40 left-1/2 h-[28rem] w-[60rem] -translate-x-1/2" color="rgba(32,104,216,0.22)" />
      <Container className="relative">
        <div className={cn("grid items-center gap-12", aside && "lg:grid-cols-12")}>
          <div className={cn(aside ? "lg:col-span-7" : "max-w-3xl")}>
            <FadeIn>
              <Badge icon={icon} className="mb-6">
                {eyebrow}
              </Badge>
            </FadeIn>
            <BlurIn
              as="h1"
              text={title}
              delay={0.1}
              className="font-display text-balance text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-white sm:text-5xl md:text-6xl"
            />
            {description && (
              <FadeIn delay={0.25}>
                <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-body-soft md:text-xl">
                  {description}
                </p>
              </FadeIn>
            )}
            {actions && (
              <FadeIn delay={0.35}>
                <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>
              </FadeIn>
            )}
          </div>
          {aside && (
            <FadeIn delay={0.3} className="lg:col-span-5" blur>
              {aside}
            </FadeIn>
          )}
        </div>

        {facts && facts.length > 0 && (
          <FadeIn delay={0.4} className="mt-14">
            <dl className="grid grid-cols-2 divide-white/8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] sm:grid-cols-4 sm:divide-x">
              {facts.map((f) => (
                <div key={f.label} className="px-5 py-5 sm:px-6">
                  <dt className="text-xs font-medium uppercase tracking-[0.12em] text-sky-dim">{f.label}</dt>
                  <dd className="font-display mt-1.5 text-xl font-bold text-white md:text-2xl">{f.value}</dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        )}
      </Container>
    </section>
  );
}

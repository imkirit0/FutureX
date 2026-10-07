import { Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { DustSphere } from "@/components/ui/dust-sphere";
import { BlurIn, FadeIn } from "@/components/ui/text";

export function CTASection({
  eyebrow = "Ready when you are",
  title,
  description,
  primary,
  secondary,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="relative overflow-hidden pt-20 md:pt-28">
      <Container className="relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <FadeIn>
            <Badge icon={<Rocket />}>{eyebrow}</Badge>
          </FadeIn>
          <BlurIn
            as="h2"
            text={title}
            className="font-display mt-6 text-balance text-[2.6rem] font-bold leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl"
          />
          <FadeIn delay={0.15}>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-body-soft md:text-xl">
              {description}
            </p>
          </FadeIn>
          <FadeIn delay={0.25} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href={primary.href} size="lg" arrow="right">
              {primary.label}
            </ButtonLink>
            {secondary && (
              <ButtonLink href={secondary.href} size="lg" variant="secondary">
                {secondary.label}
              </ButtonLink>
            )}
          </FadeIn>
        </div>
      </Container>

      {/* A dust planet cresting below the buttons: the horizon you climb toward. */}
      <div
        aria-hidden
        className="pointer-events-none relative mt-12 h-[200px] [mask-image:linear-gradient(to_bottom,#000_35%,transparent)] sm:h-[260px] md:mt-16 md:h-[320px]"
      >
        <div className="absolute left-1/2 top-0 aspect-square w-[170vw] max-w-[1600px] -translate-x-1/2 md:w-[110vw]">
          <DustSphere radius={0.48} count={7000} speed={0.05} interactive intensity={1.9} color="225,238,255" />
        </div>
      </div>
    </section>
  );
}

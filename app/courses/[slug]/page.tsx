import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, GraduationCap, Wrench } from "lucide-react";
import { courses } from "@/lib/data";
import { Accordion } from "@/components/ui/accordion";
import { Badge, Chip } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { BlurIn, FadeIn, Stagger, StaggerItem } from "@/components/ui/text";
import { Glow, GridPattern, Hairline } from "@/components/ui/background";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  return course ? { title: course.title, description: course.short } : { title: "Course not found" };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();

  const idx = courses.findIndex((c) => c.slug === slug);
  const prev = courses[idx - 1];
  const next = courses[idx + 1];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-32 md:pt-40">
        <GridPattern />
        <Glow className="-top-40 right-0 h-[30rem] w-[40rem]" color="rgba(32,104,216,0.22)" />
        <Container className="relative">
          <FadeIn>
            <Link
              href="/courses"
              className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm text-sky-dim transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden /> All programs
            </Link>
          </FadeIn>
          <div className="mt-8 grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <FadeIn delay={0.05} className="flex flex-wrap items-center gap-2">
                <Chip active>{course.code}</Chip>
                <Badge>Level {course.level} of 4</Badge>
                <Badge>{course.syllabus.length} modules</Badge>
              </FadeIn>
              <BlurIn
                as="h1"
                text={course.title}
                delay={0.1}
                className="font-display mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-white sm:text-5xl md:text-[3.6rem]"
              />
              <FadeIn delay={0.25}>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-body-soft md:text-xl">{course.summary}</p>
              </FadeIn>
              <FadeIn delay={0.35} className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/contact" size="lg" arrow="right">
                  Enquire about this program
                </ButtonLink>
                <ButtonLink href="/courses" size="lg" variant="secondary">
                  Compare levels
                </ButtonLink>
              </FadeIn>
            </div>
            <FadeIn delay={0.3} blur className="lg:col-span-5">
              <div className="border-gradient relative aspect-square overflow-hidden rounded-3xl shadow-card-lg">
                <Image
                  src={course.image}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
                  {course.tools.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/15 bg-ink/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Body */}
      <Section tone="paper">
        <Hairline className="absolute inset-x-0 top-0" />
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <FadeIn>
                <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
                  What you&apos;ll be able to do
                </h2>
              </FadeIn>
              <Stagger className="mt-7 grid gap-3 sm:grid-cols-2">
                {course.outcomes.map((o) => (
                  <StaggerItem key={o}>
                    <div className="flex h-full gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-[0.98rem] leading-relaxed text-body">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                        <Check className="h-3.5 w-3.5" aria-hidden />
                      </span>
                      {o}
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              <FadeIn className="mt-16">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">Syllabus</h2>
                  <span className="text-xs font-medium uppercase tracking-[0.12em] text-sky-dim">
                    Indicative · final syllabus shared on enquiry
                  </span>
                </div>
              </FadeIn>
              <FadeIn className="mt-7" delay={0.1}>
                <Accordion
                  numbered
                  items={course.syllabus.map((m) => ({ title: m.module, content: m.detail }))}
                />
              </FadeIn>
            </div>

            <aside className="space-y-5 lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
              <FadeIn delay={0.1}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-dim">
                    <BriefcaseBusiness className="h-4 w-4 text-accent" aria-hidden /> Career outcomes
                  </div>
                  <ul className="mt-4 space-y-3">
                    {course.roles.map((r) => (
                      <li key={r} className="flex items-center gap-3 text-[0.95rem] font-medium text-body">
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
              <FadeIn delay={0.18}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-dim">
                    <Wrench className="h-4 w-4 text-accent" aria-hidden /> Tools &amp; stack
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {course.tools.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.26}>
                <div className="border-gradient relative overflow-hidden rounded-2xl bg-ink-2/70 p-6">
                  <Glow className="-right-10 -top-10 h-40 w-40" color="rgba(52,198,247,0.3)" />
                  <div className="relative">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-dim">
                      <GraduationCap className="h-4 w-4 text-accent" aria-hidden /> Enrol
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-body-soft">
                      Fees, duration, and batch dates are shared on enquiry. Programs run for students,
                      professionals, and institutions.
                    </p>
                    <ButtonLink href="/contact" className="mt-5 w-full" arrow="right">
                      Request details
                    </ButtonLink>
                  </div>
                </div>
              </FadeIn>
            </aside>
          </div>
        </Container>
      </Section>

      {/* Prev / next */}
      <Section className="pt-0 md:pt-0">
        <Container>
          <div className="grid gap-4 md:grid-cols-2">
            {prev ? (
              <NeighbourCard course={prev} dir="prev" />
            ) : (
              <div className="hidden md:block" />
            )}
            {next && <NeighbourCard course={next} dir="next" />}
          </div>
        </Container>
      </Section>
    </>
  );
}

function NeighbourCard({ course, dir }: { course: (typeof courses)[number]; dir: "prev" | "next" }) {
  const isNext = dir === "next";
  return (
    <FadeIn>
      <Link
        href={`/courses/${course.slug}`}
        className={`group flex h-full items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.04] ${
          isNext ? "flex-row-reverse text-right" : ""
        }`}
      >
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
          <Image src={course.image} alt="" fill sizes="80px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-sky-dim">
            {isNext ? "Next on the ladder" : "Previous level"} · Level {course.level}
          </p>
          <p className="font-display mt-1 line-clamp-2 text-[1.05rem] font-bold leading-snug text-white transition-colors group-hover:text-accent">
            {course.title}
          </p>
        </div>
        {isNext ? (
          <ArrowRight className="h-5 w-5 shrink-0 text-sky-dim transition-transform group-hover:translate-x-1" aria-hidden />
        ) : (
          <ArrowLeft className="h-5 w-5 shrink-0 text-sky-dim transition-transform group-hover:-translate-x-1" aria-hidden />
        )}
      </Link>
    </FadeIn>
  );
}

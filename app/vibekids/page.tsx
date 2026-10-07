import type { Metadata } from "next";
import Image from "next/image";
import {
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  Check,
  FlaskConical,
  GraduationCap,
  MessageSquareQuote,
  School,
  ShieldCheck,
  Sparkles,
  Users,
  UserRound,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ChatMock } from "@/components/ui/chat-mock";
import { CTASection } from "@/components/ui/cta-section";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/text";
import { DotPattern, Glow, GridPattern, Hairline } from "@/components/ui/background";

export const metadata: Metadata = {
  title: "VibeKids: Socratic AI Learning for Grades 3–12",
  description:
    "VibeKids is an AI-powered interactive learning system for grades 3–12. Vibey, its Socratic AI engine, guides reasoning instead of giving answers.",
};

const features = [
  {
    Icon: BrainCircuit,
    title: "Cognitive diagnostics",
    body: "Vibey monitors reasoning habits in real time and pinpoints the foundational gap, often from an earlier grade, that is actually blocking today's concept.",
    span: "md:col-span-3",
  },
  {
    Icon: BarChart3,
    title: "Multi-dashboard analytics",
    body: "Separate views for school leadership, teachers, and parents: performance, progress, and early-warning signals for every learner.",
    span: "md:col-span-3",
  },
  {
    Icon: ShieldCheck,
    title: "AI literacy training",
    body: "Age-appropriate modules on spotting hallucinations, recognising bias, and writing effective prompts. Literacy for the AI era, not just screen time.",
    span: "md:col-span-3",
  },
  {
    Icon: FlaskConical,
    title: "Virtual STEM labs",
    body: "Digital simulations across physics, mathematics, financial literacy, and robotics, with connectivity to physical STEM kits in the classroom.",
    span: "md:col-span-3",
  },
];

const stakeholders = [
  { Icon: School, who: "Schools", points: ["CBSE compliance out of the box", "Differentiation that scales", "Performance analytics per class"] },
  { Icon: GraduationCap, who: "Teachers", points: ["Automated grading", "Early learning-blocker identification", "Lesson-planning support"] },
  { Icon: Sparkles, who: "Students", points: ["Personalised Socratic guidance", "Gamified progress", "Critical-thinking development"] },
  { Icon: UserRound, who: "Parents", points: ["Weekly progress reports", "Clear performance visibility", "Less homework supervision"] },
];

const compliance = [
  { label: "CBSE Circular Acad-15/2026", body: "Computational thinking and AI as part of the school mandate." },
  { label: "NEP 2020", body: "Competency-based, learner-centred education policy." },
  { label: "NCF-SE 2023", body: "National Curriculum Framework for School Education." },
];

const vibeyChat = [
  { from: "student" as const, text: "What's 3/4 of 240?" },
  { from: "vibey" as const, text: "Let's take it one quarter at a time. What is 1/4 of 240?" },
  { from: "student" as const, text: "240 ÷ 4… that's 60." },
  { from: "vibey" as const, text: "Right. So if one quarter is 60, how much would three quarters be?" },
  { from: "student" as const, text: "60 × 3 = 180!" },
];

const chat = [
  { from: "student" as const, text: "I don't get how to find the area of a triangle." },
  { from: "vibey" as const, text: "Let's start somewhere you know. What's the area of a rectangle that's 6 cm by 4 cm?" },
  { from: "student" as const, text: "24 cm²!" },
  { from: "vibey" as const, text: "Now imagine cutting that rectangle corner to corner. What do you get, and what happened to the area?" },
  { from: "student" as const, text: "Two triangles… so each one is 12 cm²?" },
];

export default function VibeKidsPage() {
  return (
    <>
      <PageHero
        eyebrow="VibeKids · Grades 3–12"
        icon={<Sparkles />}
        title="The AI tutor that asks, never tells."
        description="VibeKids is an AI-powered interactive learning system that integrates with school curricula, textbooks, and STEM kits. At its heart is Vibey, a Socratic AI engine built to guide reasoning step by step instead of handing over answers."
        actions={
          <>
            <ButtonLink href="/contact" size="lg" arrow="right">
              Book a school demo
            </ButtonLink>
            <ButtonLink href="#how" size="lg" variant="secondary">
              See how Vibey teaches
            </ButtonLink>
          </>
        }
        aside={
          <div className="relative">
            <Glow className="inset-6" color="rgba(52,198,247,0.3)" />
            <div className="border-gradient relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card-lg">
              <Image
                src="/img/vibekids.png"
                alt="A child reaching toward a glowing network of ideas"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-4 hidden animate-float rounded-2xl border border-white/10 bg-ink-2/80 p-4 shadow-card-lg backdrop-blur-xl sm:block">
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-sky-dim">Socratic by design</p>
              <p className="font-display mt-1 text-lg font-bold text-white">Guides, never answers</p>
            </div>
          </div>
        }
      />

      {/* VibeKids */}
      <Section className="overflow-hidden">
        <DotPattern mask="radial-gradient(ellipse 50% 60% at 80% 50%, #000 10%, transparent 100%)" />
        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <FadeIn>
                <Badge icon={<MessageSquareQuote />} className="mb-5">
                  VibeKids · Grades 3–12
                </Badge>
              </FadeIn>
              <FadeIn delay={0.08}>
                <h2 className="font-display text-balance text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl md:text-[2.75rem] md:leading-[1.08]">
                  An AI tutor that asks the next question instead of giving the answer.
                </h2>
              </FadeIn>
              <FadeIn delay={0.16}>
                <p className="mt-5 text-lg leading-relaxed text-body-soft">
                  Vibey, the Socratic engine inside VibeKids, guides students through reasoning step by
                  step. It maps how each child thinks, finds the foundational gap that is actually
                  blocking them, and routes practice there before coming back to today&apos;s problem.
                </p>
              </FadeIn>
              <Stagger className="mt-8 grid gap-3 sm:grid-cols-2" delay={0.2}>
                {[
                  { Icon: BrainCircuit, t: "Real-time cognitive mapping" },
                  { Icon: BookOpenCheck, t: "Aligned to CBSE, NEP 2020, NCF-SE 2023" },
                  { Icon: ShieldCheck, t: "Dashboards for schools, teachers, parents" },
                  { Icon: Sparkles, t: "AI literacy and virtual STEM labs" },
                ].map(({ Icon, t }) => (
                  <StaggerItem key={t}>
                    <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm font-medium text-body">
                      <Icon className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                      {t}
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
              <FadeIn delay={0.3} className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href="/contact" arrow="right">
                  Book a school demo
                </ButtonLink>
              </FadeIn>
            </div>
            <div className="relative lg:col-span-6">
              <FadeIn delay={0.15} blur>
                <ChatMock messages={vibeyChat} subtitle="Socratic AI tutor · Class 6 Maths" />
              </FadeIn>
            </div>
          </div>
        </Container>
      </Section>

      {/* How Vibey teaches */}
      <Section id="how" className="overflow-hidden">
        <DotPattern mask="radial-gradient(ellipse 50% 60% at 20% 50%, #000 10%, transparent 100%)" />
        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="order-2 lg:order-1 lg:col-span-6">
              <FadeIn blur>
                <ChatMock messages={chat} subtitle="Socratic AI tutor · Class 7 Maths" />
              </FadeIn>
            </div>
            <div className="order-1 lg:order-2 lg:col-span-6">
              <SectionHeader
                eyebrow="The Vibey engine"
                icon={<BrainCircuit />}
                title="Answer machines create copy-paste learners."
                description="Most AI tutors hand students the solution and short-circuit the learning. Vibey is built around one constraint: it never gives the direct answer. It asks the next-smallest question so the student takes the step themselves."
              />
              <FadeIn delay={0.2}>
                <p className="mt-5 text-[1.02rem] leading-relaxed text-body-soft">
                  Behind the conversation, real-time cognitive mapping tracks how each child reasons,
                  building a live map of strengths, gaps, and exactly what to close next. Teachers and
                  parents see a map of how the child thinks, not just a score.
                </p>
              </FadeIn>
            </div>
          </div>
        </Container>
      </Section>

      {/* Features bento */}
      <Section tone="paper">
        <GridPattern size={56} mask="radial-gradient(ellipse 70% 50% at 50% 0%, #000 10%, transparent 100%)" />
        <Container className="relative">
          <SectionHeader
            eyebrow="Capabilities"
            icon={<BookOpenCheck />}
            title="Built for the whole classroom."
            description="Diagnostics, dashboards, literacy, and labs in one system that plugs into what schools already use."
          />
          <Stagger className="mt-12 grid gap-5 md:grid-cols-6">
            {features.map(({ Icon, title, body, span }) => (
              <StaggerItem key={title} className={span}>
                <SpotlightCard className="h-full" innerClassName="flex h-full flex-col p-7 md:p-8">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="font-display mt-6 text-xl font-bold text-white md:text-2xl">{title}</h3>
                  <p className="mt-3 text-[0.98rem] leading-relaxed text-body-soft">{body}</p>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* Stakeholders */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow="One platform, four wins"
            icon={<Users />}
            title="Everyone around the learner gets something."
          />
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stakeholders.map(({ Icon, who, points }) => (
              <StaggerItem key={who}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-white/20">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-accent">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="font-display mt-5 text-xl font-bold text-white">{who}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {points.map((p) => (
                      <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-body-soft">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* Compliance */}
      <Section tone="paper" className="py-14 md:py-16">
        <Hairline className="absolute inset-x-0 top-0" />
        <Container>
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <FadeIn className="lg:col-span-5">
              <Badge icon={<ShieldCheck />} className="mb-4">
                Aligned with
              </Badge>
              <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
                National frameworks, built in.
              </h2>
            </FadeIn>
            <Stagger className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
              {compliance.map((c) => (
                <StaggerItem key={c.label}>
                  <div className="h-full rounded-2xl border border-white/10 bg-ink/40 p-5">
                    <p className="font-display text-[1.02rem] font-bold text-white">{c.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-body-soft">{c.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Container>
      </Section>

      <CTASection
        eyebrow="For schools"
        title="Bring VibeKids to your school."
        description="We will walk your leadership team through the platform, the dashboards, and the CBSE alignment, using your own textbooks and curriculum."
        primary={{ label: "Book a demo", href: "/contact" }}
        secondary={{ label: "Read about Socratic AI", href: "/blog/socratic-ai-how-vibey-teaches-without-giving-answers" }}
      />
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import {
  Compass,
  Eye,
  FlaskConical,
  Globe2,
  GraduationCap,
  HeartHandshake,
  MessageSquare,
  Route,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import { DustSphere } from "@/components/ui/dust-sphere";
import { careerTracks, courses } from "@/lib/data";
import { Badge, Chip } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { CTASection } from "@/components/ui/cta-section";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/text";
import { Timeline } from "@/components/ui/timeline";
import { GridPattern, Hairline } from "@/components/ui/background";

export const metadata: Metadata = {
  title: "About",
  description:
    "FutureX AI Lab, an initiative of G-TEC EDUCATION, makes AI education accessible, practical, and career-focused for students, professionals, and schools.",
};

const objectives = [
  {
    Icon: GraduationCap,
    title: "World-class curriculum",
    body: "AI education personalised for learners across school, college, and professional levels. One ladder, many entry points.",
  },
  {
    Icon: Trophy,
    title: "Careers, not certificates",
    body: "Certifications, hands-on internships, industry-focused projects, and placement assistance built into every program.",
  },
  {
    Icon: Globe2,
    title: "Inclusive by design",
    body: "Accessible, affordable, and impactful AI education for rural and urban learners alike.",
  },
];

const steps = [
  {
    icon: <MessageSquare />,
    title: "Tell us where you are",
    body: "Student, professional, or school. We start from your background and goals, not a fixed intake.",
  },
  {
    icon: <Route />,
    title: "Get placed on the ladder",
    body: "We recommend the level that fits: tools first at Level 1, or straight into building, shipping, or operating models.",
  },
  {
    icon: <FlaskConical />,
    title: "Learn by building",
    body: "Guided labs in every module and a capstone you can demo, from a grounded Q&A system to a deployed agent.",
  },
  {
    icon: <HeartHandshake />,
    title: "Carry it into a career",
    body: "Certification at each level, plus internships, industry projects, and placement support through G-TEC's network.",
  },
];

const modules = courses.reduce((n, c) => n + c.syllabus.length, 0);
const roleCount = new Set(courses.flatMap((c) => c.roles)).size;

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About FutureX AI Lab"
        icon={<Compass />}
        title="Making AI education practical, accessible, and career-focused."
        description="FutureX AI Lab is an initiative of G-TEC EDUCATION. We train learners to design, build, and deploy AI-powered solutions across generative AI, large language models, vision AI, and AI agents."
        actions={
          <>
            <ButtonLink href="/courses" arrow="right">
              See the programs
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Talk to us
            </ButtonLink>
          </>
        }
        aside={
          <div className="relative">
            <div className="border-gradient relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink-2/70 shadow-card-lg">
              <DustSphere className="absolute inset-0" radius={0.4} count={2600} interactive intensity={1.2} />
              <div className="absolute left-1/2 top-[44%] w-[34%] -translate-x-1/2 -translate-y-1/2 animate-float">
                <Image
                  src="/img/fx-globe.png"
                  alt="The FutureX globe at the centre of a sphere of particles"
                  width={582}
                  height={684}
                  priority
                  sizes="(min-width: 1024px) 15vw, 34vw"
                  className="h-auto w-full drop-shadow-[0_24px_40px_rgba(0,0,0,0.6)]"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-5">
                <p className="text-sm font-medium text-white">A hub of AI innovation and talent</p>
                <p className="text-xs text-body-soft">Our vision for FutureX</p>
              </div>
            </div>
          </div>
        }
      />

      {/* Mission & vision */}
      <Section>
        <Container>
          <div className="grid gap-5 lg:grid-cols-2">
            <FadeIn>
              <SpotlightCard className="h-full" innerClassName="p-8 md:p-10">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                  <Target className="h-6 w-6" aria-hidden />
                </span>
                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-sky-dim">Our mission</p>
                <h2 className="font-display mt-2 text-2xl font-bold text-white md:text-3xl">
                  World-class AI education at every stage of learning.
                </h2>
                <p className="mt-4 text-[1.02rem] leading-relaxed text-body-soft">
                  Deliver AI education tailored to learners at every stage, school, college, and
                  professional, while creating clear career pathways through certifications, hands-on
                  internships, industry-focused projects, and placement support.
                </p>
              </SpotlightCard>
            </FadeIn>
            <FadeIn delay={0.1}>
              <SpotlightCard className="h-full" innerClassName="p-8 md:p-10">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                  <Eye className="h-6 w-6" aria-hidden />
                </span>
                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-sky-dim">Our vision</p>
                <h2 className="font-display mt-2 text-2xl font-bold text-white md:text-3xl">
                  A hub where anyone can harness AI to transform their world.
                </h2>
                <p className="mt-4 text-[1.02rem] leading-relaxed text-body-soft">
                  Position FutureX as a hub of AI innovation and talent, where every student,
                  professional, and organisation can use AI to transform industries, communities, and
                  lives.
                </p>
              </SpotlightCard>
            </FadeIn>
          </div>
        </Container>
      </Section>

      {/* Objectives + stats */}
      <Section tone="paper">
        <GridPattern size={56} mask="radial-gradient(ellipse 60% 50% at 50% 100%, #000 10%, transparent 100%)" />
        <Container className="relative">
          <SectionHeader
            eyebrow="What we stand for"
            icon={<Users />}
            title="Three commitments behind every program."
          />
          <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
            {objectives.map(({ Icon, title, body }, i) => (
              <StaggerItem key={title}>
                <SpotlightCard className="h-full" innerClassName="flex h-full flex-col p-7">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-accent">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="font-mono text-[0.7rem] font-semibold text-sky-dim">0{i + 1}</span>
                  </div>
                  <h3 className="font-display mt-6 text-xl font-bold text-white">{title}</h3>
                  <p className="mt-3 text-[0.98rem] leading-relaxed text-body-soft">{body}</p>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </Stagger>

          <FadeIn className="mt-14">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/8 md:grid-cols-4">
              {[
                { n: 4, label: "Certification levels" },
                { n: 5, label: "Programs" },
                { n: modules, label: "Syllabus modules" },
                { n: roleCount, label: "Career roles mapped" },
              ].map((s) => (
                <div key={s.label} className="bg-paper px-6 py-8 text-center">
                  <dd className="font-display text-4xl font-bold text-white md:text-5xl">
                    <NumberTicker value={s.n} />
                  </dd>
                  <dt className="mt-2 text-sm text-sky-dim">{s.label}</dt>
                </div>
              ))}
            </dl>
          </FadeIn>
        </Container>
      </Section>

      {/* Image band */}
      <section className="relative flex min-h-[60svh] items-center overflow-hidden">
        <Image
          src="/img/hands.jpg"
          alt="A human hand and a robotic hand reaching toward each other in front of the FutureX mark"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/20" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink to-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
        <Container className="relative py-24">
          <FadeIn>
            <Badge className="mb-5">Human and machine, side by side</Badge>
            <h2 className="font-display max-w-xl text-balance text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-5xl">
              Technology is the tool. The learner is the point.
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-body-soft">
              Every program is built to put real capability in human hands: the judgement to direct
              AI, and the skills to build with it.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* How it works */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeader
                eyebrow="How it works"
                icon={<Route />}
                title="From first conversation to first job."
                description="A simple, repeatable path. You bring the goal; we bring the ladder."
              />
            </div>
            <div className="lg:col-span-7">
              <Timeline steps={steps} />
            </div>
          </div>
        </Container>
      </Section>

      {/* Career tracks */}
      <Section tone="paper">
        <Hairline className="absolute inset-x-0 top-0" />
        <Container>
          <SectionHeader
            eyebrow="Where the ladder leads"
            icon={<Trophy />}
            title="Four career tracks, dozens of roles."
            description="Each track groups the roles our levels prepare you for."
            action={
              <ButtonLink href="/courses" variant="secondary" arrow="right">
                Explore programs
              </ButtonLink>
            }
          />
          <Stagger className="mt-12 grid gap-5 md:grid-cols-2">
            {careerTracks.map((t, i) => (
              <StaggerItem key={t.title}>
                <SpotlightCard className="h-full" innerClassName="flex h-full flex-col p-7 md:p-8">
                  <span className="font-mono text-[0.7rem] font-semibold text-accent">Track {i + 1}</span>
                  <h3 className="font-display mt-3 text-xl font-bold text-white md:text-2xl">{t.title}</h3>
                  <p className="mt-3 text-[0.98rem] leading-relaxed text-body-soft">{t.body}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {t.examples.map((e) => (
                      <Chip key={e}>{e}</Chip>
                    ))}
                  </div>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <CTASection
        title="Let's find your starting point."
        description="Whether you are a student, a professional, or a school, a short conversation is all it takes to map the route."
        primary={{ label: "Talk to us", href: "/contact" }}
        secondary={{ label: "View the ladder", href: "/courses" }}
      />
    </>
  );
}

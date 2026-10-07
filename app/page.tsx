import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Briefcase,
  Check,
  FlaskConical,
  GraduationCap,
  Layers,
  Sparkles,
  Target,
} from "lucide-react";
import Hero from "@/components/Hero";
import DustStory from "@/components/DustStory";
import { courses, services } from "@/lib/data";
import { Accordion } from "@/components/ui/accordion";
import { Chip } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { CTASection } from "@/components/ui/cta-section";
import { LevelLadderPinned } from "@/components/ui/level-ladder-pinned";
import { ScannerCardStream } from "@/components/ui/scanner-card-stream";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/text";
import { Aurora, GridPattern, Hairline } from "@/components/ui/background";

const roles = Array.from(new Set(courses.flatMap((c) => c.roles)));

const serviceIcons = [GraduationCap, Bot, BrainCircuit];

const posters = [
  { src: "/posters/tomorrow-is-futurex.jpeg", alt: "Tomorrow is FutureX" },
  { src: "/posters/learn-ai-the-right-way.jpeg", alt: "Learn AI the right way" },
  { src: "/posters/building-the-future.jpeg", alt: "We are building the future" },
  { src: "/posters/tomorrow-is-loading.jpeg", alt: "Tomorrow is loading" },
  { src: "/posters/genesis-of-a-new-epoch.jpeg", alt: "Genesis of a new epoch" },
  { src: "/posters/ready-to-press-the-key.jpeg", alt: "Ready to press the key" },
  { src: "/posters/holding-our-hands.jpeg", alt: "Holding our hands" },
];

const faqs = [
  {
    title: "Who are the FutureX programs for?",
    content:
      "School and college students who want practical AI skills, working professionals moving into AI and GenAI roles, and schools or parents evaluating VibeKids for grades 3 to 12. Each level has a clear entry point, so you start where you are.",
  },
  {
    title: "Do I need to know how to code?",
    content:
      "Not to begin. Level 1 is built around prompting and applied AI tools. Python and APIs enter at Level 2, when you start building retrieval systems, and the later levels go deeper into agents, deployment, and model operations.",
  },
  {
    title: "How are the four levels connected?",
    content:
      "Each program hands off to the next: Level 1 teaches you to use AI expertly, Level 2 to ground it in your own data, Level 3 to ship agents as real products, and Level 4 to fine-tune, serve, and operate foundation models, with an AWS track for cloud-scale GenAI.",
  },
  {
    title: "What do fees, duration, and batch dates look like?",
    content:
      "We share these on enquiry, because programs run differently for students, professionals, and institutions. Send us a note with your background and goals and we will come back with the specifics.",
  },
  {
    title: "What is VibeKids?",
    content:
      "VibeKids is our AI-powered learning system for grades 3 to 12. At its heart is Vibey, a Socratic AI engine that guides reasoning step by step instead of handing over answers. It is aligned with CBSE Circular Acad-15/2026, NEP 2020, and NCF-SE 2023.",
  },
];

export default function Home() {
  return (
    <>
      <Hero />
      <DustStory />

      {/* Skill check CTA */}
      <Section>
        <Container>
          <FadeIn>
            <SpotlightCard innerClassName="grid gap-10 p-7 md:p-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <SectionHeader
                  eyebrow="Free · about 5 minutes"
                  icon={<Target />}
                  title="Test your skills."
                  description="A short quiz that starts easy and gets harder as you go. It stops when it finds your ceiling, then tells you which FutureX level to start with."
                />
                <ButtonLink href="/skill-check" size="lg" arrow="right" className="mt-8">
                  Take the skill check
                </ButtonLink>
              </div>
              <ol className="space-y-2.5 lg:col-span-5" aria-label="Example result">
                {[1, 2, 3, 4].map((l) => {
                  const done = l < 3, current = l === 3;
                  return (
                    <li
                      key={l}
                      className={`flex items-center gap-4 rounded-2xl border p-4 ${
                        current ? "border-accent/30 bg-accent/[0.07]" : "border-white/8 bg-ink/40"
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-display text-sm font-bold ${
                          current
                            ? "border-accent bg-accent text-ink shadow-[0_0_24px_rgba(52,198,247,0.45)]"
                            : done
                              ? "border-accent/50 bg-accent/15 text-accent"
                              : "border-white/15 text-sky-dim"
                        }`}
                      >
                        {done ? <Check className="h-4 w-4" aria-hidden /> : l}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-sky-dim">
                          Level {l}
                          {current && " · Your match"}
                        </span>
                        <span className={`block truncate text-sm ${current ? "text-white" : "text-body-soft"}`}>
                          {courses.find((c) => c.level === l)?.shortName}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </SpotlightCard>
          </FadeIn>
        </Container>
      </Section>

      {/* What we do: bento */}
      <Section>
        <GridPattern size={64} mask="radial-gradient(ellipse 50% 50% at 100% 0%, #000 10%, transparent 100%)" />
        <Container className="relative">
          <SectionHeader
            eyebrow="What we do"
            icon={<Layers />}
            title="Training, solutions, and research under one roof."
            description="Three practices, one goal: learners who can design, build, and deploy AI, not just talk about it."
          />

          <Stagger className="mt-14 grid gap-5 md:grid-cols-6">
            {services.map((s, i) => {
              const Icon = serviceIcons[i];
              const span = i === 0 ? "md:col-span-6 lg:col-span-4" : "md:col-span-3 lg:col-span-2";
              return (
                <StaggerItem key={s.title} className={span}>
                  <SpotlightCard className="h-full" innerClassName="flex h-full flex-col p-7 md:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="font-mono text-[0.7rem] font-semibold text-sky-dim">0{i + 1}</span>
                    </div>
                    <h3 className="font-display mt-6 text-xl font-bold text-white md:text-2xl">{s.title}</h3>
                    <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-body-soft">{s.body}</p>
                    {i === 0 && (
                      <div className="mt-8 grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map((l) => (
                          <div key={l} className="rounded-xl border border-white/8 bg-ink/50 p-3">
                            <div className="flex items-end gap-1" aria-hidden>
                              {[...Array(l)].map((_, k) => (
                                <span key={k} className="h-2 w-2 rounded-[3px] bg-accent" style={{ opacity: 0.35 + k * 0.2 }} />
                              ))}
                            </div>
                            <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-wider text-sky-dim">
                              Level {l}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-body">
                              {courses.find((c) => c.level === l)?.shortName}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    <Link
                      href={i === 0 ? "/courses" : "/about"}
                      className="group/l mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold text-white transition-colors hover:text-accent"
                    >
                      {i === 0 ? "See the programs" : "Learn more"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/l:translate-x-1" aria-hidden />
                    </Link>
                  </SpotlightCard>
                </StaggerItem>
              );
            })}

            <StaggerItem className="md:col-span-3">
              <SpotlightCard className="h-full" innerClassName="flex h-full flex-col p-7 md:p-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                  <FlaskConical className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="font-display mt-6 text-xl font-bold text-white md:text-2xl">Hands-on labs and capstones</h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-body-soft">
                  Every program ends in a project you can show: a shipped AI workflow, a grounded Q&amp;A
                  system, a deployed agent, or a fine-tuned and monitored model.
                </p>
                <ul className="mt-6 grid gap-2 text-sm text-body sm:grid-cols-2">
                  {["Guided labs each module", "Capstone with a live demo", "Mentor review", "Portfolio-ready output"].map((x) => (
                    <li key={x} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-accent" aria-hidden /> {x}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </StaggerItem>

            <StaggerItem className="md:col-span-3">
              <SpotlightCard className="h-full" innerClassName="flex h-full flex-col p-7 md:p-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                  <Briefcase className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="font-display mt-6 text-xl font-bold text-white md:text-2xl">Careers, not just certificates</h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-body-soft">
                  Internships, industry projects, and placement support are built into the ladder, and
                  every level maps to roles that are hiring right now.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {roles.slice(0, 6).map((r) => (
                    <Chip key={r}>{r}</Chip>
                  ))}
                </div>
              </SpotlightCard>
            </StaggerItem>
          </Stagger>
        </Container>
      </Section>

      {/* Ladder */}
      <LevelLadderPinned
        header={
          <SectionHeader
            eyebrow="The certification ladder"
            icon={<GraduationCap />}
            title="Four levels. One continuous climb."
            action={
              <ButtonLink href="/courses" variant="secondary" arrow="right">
                All five programs
              </ButtonLink>
            }
          />
        }
      />

      {/* Poster gallery */}
      <section className="relative overflow-hidden bg-paper/50 py-20 md:py-28">
        <Hairline className="absolute inset-x-0 top-0" />
        <Container>
          <SectionHeader
            eyebrow="From the studio"
            icon={<Sparkles />}
            title="Tomorrow is FutureX."
            description="A few pieces from the brand series that follows the FutureX community on social."
            action={
              <ButtonLink href="https://www.instagram.com/futurexailab" external variant="secondary" arrow="up">
                Follow on Instagram
              </ButtonLink>
            }
          />
        </Container>
        <div className="mt-10">
          <ScannerCardStream cards={posters} cardWidth={240} cardHeight={320} cardGap={40} />
        </div>
      </section>

      {/* FAQ */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeader
                eyebrow="Good to know"
                title="Questions people ask before they enquire."
                description="If yours is not here, the contact page is the quickest way to reach us."
              />
              <FadeIn delay={0.2} className="mt-8">
                <div className="border-gradient relative overflow-hidden rounded-2xl bg-ink-2/60 p-6">
                  <Aurora intensity={0.6} />
                  <div className="relative">
                    <p className="text-sm font-semibold text-white">Not sure which level fits?</p>
                    <p className="mt-2 text-sm leading-relaxed text-body-soft">
                      Tell us your background and goals and we will place you on the right rung.
                    </p>
                    <ButtonLink href="/contact" size="sm" className="mt-5" arrow="right">
                      Get placement guidance
                    </ButtonLink>
                  </div>
                </div>
              </FadeIn>
            </div>
            <FadeIn className="lg:col-span-7" delay={0.1}>
              <Accordion items={faqs} />
            </FadeIn>
          </div>
        </Container>
      </Section>

      <CTASection
        title="Ready to start climbing?"
        description="Tell us where you are today, a student, a professional, or a school, and we will map your route up the ladder."
        primary={{ label: "Start the conversation", href: "/contact" }}
        secondary={{ label: "Browse programs", href: "/courses" }}
      />
    </>
  );
}

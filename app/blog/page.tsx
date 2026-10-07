import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock, Newspaper } from "lucide-react";
import PageHero from "@/components/PageHero";
import { articles } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { CTASection } from "@/components/ui/cta-section";
import { Container, Section } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/text";
import { Aurora, GridPattern } from "@/components/ui/background";

export const metadata: Metadata = {
  title: "Blog: The Lab Notebook",
  description:
    "Notes from FutureX AI Lab on AI literacy, careers, RAG systems, Socratic AI, and the technologies shaping education.",
};

const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });

/* Each tag gets its own cover gradient so the index has colour without stock imagery. */
const covers: Record<string, string> = {
  "AI Literacy": "from-[#2068d8] via-[#34c6f7] to-[#7cdcfb]",
  Careers: "from-[#1550b0] via-[#2068d8] to-[#34c6f7]",
  Technology: "from-[#0c1424] via-[#2068d8] to-[#22c1f5]",
  VibeKids: "from-[#34c6f7] via-[#2068d8] to-[#131e36]",
};

export default function BlogPage() {
  const [lead, ...rest] = articles;
  return (
    <>
      <PageHero
        eyebrow="The lab notebook"
        icon={<Newspaper />}
        title="Notes on AI education, careers, and the systems behind it."
        description="Written for learners, parents, and educators. Short, practical, and free of hype."
        compact
      />

      <Section className="pt-6 md:pt-8">
        <Container>
          {/* Featured */}
          <FadeIn>
            <Link
              href={`/blog/${lead.slug}`}
              className="group border-gradient relative grid overflow-hidden rounded-3xl bg-ink-2/60 shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-card-lg lg:grid-cols-12"
            >
              <div className={`relative min-h-[16rem] overflow-hidden lg:col-span-5 lg:min-h-full`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${covers[lead.tag]} opacity-80 transition-transform duration-700 group-hover:scale-105`} />
                <Aurora intensity={0.7} />
                <GridPattern size={32} mask="radial-gradient(ellipse 80% 80% at 50% 50%, #000 10%, transparent 100%)" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-ink-2" />
                <span className="font-display absolute bottom-5 left-6 text-7xl font-black tracking-tighter text-white/90 lg:text-8xl">
                  {lead.tag.split(" ")[0]}
                </span>
              </div>
              <div className="flex flex-col p-7 md:p-10 lg:col-span-7">
                <div className="flex flex-wrap items-center gap-3 text-sm text-sky-dim">
                  <Badge tone="accent">{lead.tag}</Badge>
                  <span>{dateFmt.format(new Date(lead.date))}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" aria-hidden /> {lead.readMinutes} min read
                  </span>
                </div>
                <h2 className="font-display mt-5 text-balance text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-white transition-colors group-hover:text-accent md:text-4xl">
                  {lead.title}
                </h2>
                <p className="mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-body-soft">{lead.excerpt}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-white">
                  Read the article
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </span>
              </div>
            </Link>
          </FadeIn>

          {/* Grid */}
          <Stagger className="mt-6 grid gap-5 md:grid-cols-3">
            {rest.map((a) => (
              <StaggerItem key={a.slug}>
                <SpotlightCard as="article" className="h-full" innerClassName="flex h-full flex-col">
                  <Link href={`/blog/${a.slug}`} className="flex h-full flex-col">
                    <div className="relative h-36 overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${covers[a.tag]} opacity-70`} />
                      <GridPattern size={28} mask="radial-gradient(ellipse 80% 80% at 50% 50%, #000 10%, transparent 100%)" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1628] to-transparent" />
                      <span className="font-display absolute bottom-3 left-5 text-4xl font-black tracking-tighter text-white/90">
                        {a.tag.split(" ")[0]}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center justify-between text-xs text-sky-dim">
                        <span className="font-medium text-accent">{a.tag}</span>
                        <span>{a.readMinutes} min read</span>
                      </div>
                      <h3 className="font-display mt-3 text-xl font-bold leading-snug text-white">{a.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-body-soft">{a.excerpt}</p>
                      <p className="mt-auto pt-5 text-xs text-sky-dim">{dateFmt.format(new Date(a.date))}</p>
                    </div>
                  </Link>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <CTASection
        title="Turn reading into skills."
        description="Explore the four-level certification ladder, or ask us where to start."
        primary={{ label: "View programs", href: "/courses" }}
        secondary={{ label: "Enquire", href: "/contact" }}
      />
    </>
  );
}

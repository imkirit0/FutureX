import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import ReadingProgress from "@/components/ReadingProgress";
import { articles } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { BlurIn, FadeIn } from "@/components/ui/text";
import { Aurora, Glow, GridPattern, Hairline } from "@/components/ui/background";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  return article ? { title: article.title, description: article.excerpt } : { title: "Article not found" };
}

const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const others = articles.filter((a) => a.slug !== slug).slice(0, 2);

  return (
    <>
      <ReadingProgress />
      <section className="relative overflow-hidden pb-12 pt-32 md:pt-40">
        <GridPattern />
        <Glow className="-top-32 left-1/2 h-[24rem] w-[50rem] -translate-x-1/2" color="rgba(32,104,216,0.2)" />
        <Container size="narrow" className="relative">
          <FadeIn>
            <Link href="/blog" className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm text-sky-dim transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" aria-hidden /> The lab notebook
            </Link>
          </FadeIn>
          <FadeIn delay={0.05} className="mt-8 flex flex-wrap items-center gap-3 text-sm text-sky-dim">
            <Badge tone="accent">{article.tag}</Badge>
            <span>{dateFmt.format(new Date(article.date))}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden /> {article.readMinutes} min read
            </span>
          </FadeIn>
          <BlurIn
            as="h1"
            text={article.title}
            delay={0.1}
            className="font-display mt-5 text-balance text-4xl font-bold leading-[1.08] tracking-[-0.025em] text-white sm:text-5xl md:text-[3.4rem]"
          />
        </Container>
      </section>

      <article className="relative bg-paper py-14 md:py-20">
        <Hairline className="absolute inset-x-0 top-0" />
        <Container size="narrow">
          <div className="prose-fx">
            {article.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <FadeIn className="mt-14">
            <div className="border-gradient relative overflow-hidden rounded-2xl bg-ink-2/60 p-7 md:p-8">
              <Aurora intensity={0.5} />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Continue the climb</p>
                <p className="font-display mt-2 text-xl font-bold text-white md:text-2xl">
                  Ready to turn reading into skills?
                </p>
                <p className="mt-2 text-[0.98rem] leading-relaxed text-body-soft">
                  Explore the four-level certification ladder or ask us where to start.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ButtonLink href="/courses" arrow="right">
                    View programs
                  </ButtonLink>
                  <ButtonLink href="/contact" variant="secondary">
                    Enquire
                  </ButtonLink>
                </div>
              </div>
            </div>
          </FadeIn>
        </Container>
      </article>

      <Section tone="paper" className="pt-0 md:pt-0">
        <Container size="narrow">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-dim">More from the notebook</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {others.map((a) => (
              <FadeIn key={a.slug}>
                <Link
                  href={`/blog/${a.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <p className="text-xs font-medium text-accent">{a.tag}</p>
                  <h3 className="font-display mt-2 text-lg font-bold leading-snug text-white transition-colors group-hover:text-accent">
                    {a.title}
                  </h3>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm text-sky-dim">
                    Read <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

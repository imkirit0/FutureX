import type { Metadata } from "next";
import Image from "next/image";
import { Building2, MessageCircle } from "lucide-react";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { socials } from "@/lib/data";
import { Container, Section } from "@/components/ui/section";
import { FadeIn } from "@/components/ui/text";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "@/components/ui/social-icons";
import { Glow } from "@/components/ui/background";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with FutureX AI Lab: course enquiries, VibeKids school demos, and partnerships.",
};

const channels = [
  { label: "Instagram", href: socials.instagram, handle: "@futurexailab", Icon: InstagramIcon },
  { label: "LinkedIn", href: socials.linkedin, handle: "gtec-futurex", Icon: LinkedInIcon },
  { label: "Facebook", href: socials.facebook, handle: "/FutureXAI", Icon: FacebookIcon },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        icon={<MessageCircle />}
        title="Tell us where you're headed."
        description="Course enquiries, VibeKids school demos, partnerships. Send a note and we will map the route with you."
        compact
      />

      <Section className="overflow-hidden pt-6 md:pt-8">
        <Image
          src="/img/contact-signal.png"
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none object-cover object-right opacity-40"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        <Container className="relative">
          <div className="grid gap-8 lg:grid-cols-12">
            <FadeIn className="lg:col-span-7">
              <ContactForm />
            </FadeIn>

            <div className="space-y-5 lg:col-span-5">
              <FadeIn delay={0.1}>
                <div className="rounded-3xl border border-white/10 bg-ink-2/60 p-7 backdrop-blur-xl">
                  <h2 className="font-display text-xl font-bold text-white">Direct channels</h2>
                  <p className="mt-2 text-sm text-body-soft">We are most active here.</p>
                  <ul className="mt-5 space-y-3">
                    {channels.map(({ label, href, handle, Icon }) => (
                      <li key={label}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/[0.06]"
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.05] text-body-soft transition-colors group-hover:bg-accent group-hover:text-ink">
                            <Icon />
                          </span>
                          <span className="flex-1">
                            <span className="block text-[0.95rem] font-semibold text-white">{label}</span>
                            <span className="block text-sm text-sky-dim">{handle}</span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>

              <FadeIn delay={0.18}>
                <div className="border-gradient relative overflow-hidden rounded-3xl bg-ink-2/60 p-7 backdrop-blur-xl">
                  <Glow className="-right-10 -top-10 h-40 w-40" color="rgba(32,104,216,0.35)" />
                  <div className="relative">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-accent">
                      <Building2 className="h-5 w-5" aria-hidden />
                    </span>
                    <h2 className="font-display mt-5 text-xl font-bold text-white">Backed by G-TEC EDUCATION</h2>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-body-soft">
                      FutureX AI Lab is an initiative of G-TEC EDUCATION, bringing AI programs to
                      students, professionals, and schools through its education network.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

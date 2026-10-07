import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "@/components/ui/social-icons";
import { nav, socials, courses } from "@/lib/data";
import { Container } from "@/components/ui/section";
import { Hairline } from "@/components/ui/background";

const socialLinks = [
  { label: "Instagram", href: socials.instagram, Icon: InstagramIcon },
  { label: "LinkedIn", href: socials.linkedin, Icon: LinkedInIcon },
  { label: "Facebook", href: socials.facebook, Icon: FacebookIcon },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <Hairline />
      <Container className="relative pb-10 pt-16 md:pt-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Image
              src="/img/logo-white.png"
              alt="FutureX, G-TEC AI Lab"
              width={180}
              height={40}
              className="h-9 w-auto"
            />
            <p className="mt-6 max-w-sm text-[0.98rem] leading-relaxed text-body-soft">
              An initiative of G-TEC EDUCATION. We make AI education accessible, practical, and
              career-focused for students, professionals, and schools.
            </p>
            <div className="mt-7 flex items-center gap-2">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-body-soft transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7">
            <FooterCol title="Explore">
              {nav.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </FooterCol>
            <FooterCol title="Programs" className="col-span-2 sm:col-span-2">
              {courses.map((c) => (
                <FooterLink key={c.slug} href={`/courses/${c.slug}`}>
                  <span className="mr-2 font-mono text-[0.7rem] text-accent/80">L{c.level}</span>
                  {c.shortName}
                </FooterLink>
              ))}
            </FooterCol>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/8 pt-7 text-sm text-sky-dim sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} FutureX AI Lab. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            An initiative of G-TEC EDUCATION
          </p>
        </div>
      </Container>

      {/* Oversized wordmark anchoring the page */}
      <div aria-hidden className="pointer-events-none relative select-none overflow-hidden">
        <p className="font-display translate-y-[0.28em] text-center text-[22vw] font-black leading-[0.75] tracking-[-0.04em] text-white/[0.035]">
          Future<span className="text-accent/[0.08]">X</span>
        </p>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-dim">{title}</h3>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group inline-flex items-center gap-1 text-[0.95rem] text-body-soft transition-colors hover:text-white"
      >
        <span>{children}</span>
        <ArrowUpRight
          className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
          aria-hidden
        />
      </Link>
    </li>
  );
}

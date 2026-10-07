import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Schibsted_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import { StarsBackground } from "@/components/ui/stars";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });
const schibsted = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-schibsted" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: {
    default: "FutureX AI Lab | AI Education, Certification & Careers",
    template: "%s | FutureX AI Lab",
  },
  description:
    "FutureX AI Lab, an initiative of G-TEC EDUCATION: a four-level AI certification ladder from generative AI foundations to foundation-model operations, plus VibeKids Socratic AI learning for grades 3–12.",
};

export const viewport: Viewport = {
  themeColor: "#070b14",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${schibsted.variable} ${jetbrains.variable}`}>
      <body>
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <StarsBackground starColor="#a8c6ff" style={{ background: "radial-gradient(ellipse at bottom, #0c1424 0%, #070b14 100%)" }} />
        </div>
        <SmoothScroll>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}

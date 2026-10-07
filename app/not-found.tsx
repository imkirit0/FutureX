import { Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { Aurora, GridPattern } from "@/components/ui/background";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden pt-24">
      <Aurora intensity={0.8} />
      <GridPattern />
      <Container className="relative text-center">
        <Badge icon={<Compass />} className="mb-6">
          404 · Page not found
        </Badge>
        <h1 className="font-display mx-auto max-w-2xl text-balance text-4xl font-bold tracking-[-0.025em] text-white md:text-6xl">
          This page drifted off the path.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-body-soft">
          The page you are looking for does not exist or has moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" size="lg" arrow="right">
            Back to home
          </ButtonLink>
          <ButtonLink href="/courses" size="lg" variant="secondary">
            Browse programs
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

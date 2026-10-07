import type { Metadata } from "next";
import Assessment from "@/components/skill-check/assessment";

export const metadata: Metadata = {
  title: "Skill Check",
  description:
    "A free five-minute quiz from FutureX AI Lab that shows what you already know about AI and which FutureX course to start with.",
};

export default function SkillCheckPage() {
  // Light-themed page; top padding clears the floating site nav.
  return (
    <div className="sc-light pt-20 sm:pt-24">
      <Assessment />
    </div>
  );
}

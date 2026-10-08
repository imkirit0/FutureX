"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { courses } from "@/lib/data";
import { Chip } from "@/components/ui/badge";
import { cn, EASE_OUT } from "@/lib/utils";

const filters = [
  { key: 0, label: "All programs" },
  { key: 1, label: "Level 1" },
  { key: 2, label: "Level 2" },
  { key: 3, label: "Level 3" },
  { key: 4, label: "Level 4" },
];

export default function CourseExplorer() {
  const [level, setLevel] = useState(0);
  const list = level === 0 ? courses : courses.filter((c) => c.level === level);

  return (
    <div>
      <LayoutGroup id="course-filter">
        <div
          role="tablist"
          aria-label="Filter programs by level"
          className="no-scrollbar -mx-5 flex max-w-[100vw] gap-1 overflow-x-auto px-5 sm:mx-0 sm:inline-flex sm:max-w-full sm:flex-wrap sm:rounded-full sm:border sm:border-white/10 sm:bg-white/[0.03] sm:p-1"
        >
          {filters.map((f) => {
            const active = f.key === level;
            return (
              <button
                key={f.key}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setLevel(f.key)}
                className={cn(
                  "relative shrink-0 cursor-pointer whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-colors sm:py-2",
                  active ? "text-ink" : "text-body-soft hover:text-white"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative">{f.label}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <motion.ul layout className="mt-8 grid gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((c, i) => (
            <motion.li
              key={c.slug}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, ease: EASE_OUT, delay: i * 0.04 }}
              className={cn("fx-motion", level === 0 && i === 0 && "md:col-span-2")}
            >
              <CourseCard course={c} featured={level === 0 && i === 0} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}

function CourseCard({ course: c, featured }: { course: (typeof courses)[number]; featured: boolean }) {
  return (
    <Link
      href={`/courses/${c.slug}`}
      className={cn(
        "group border-gradient relative flex h-full overflow-hidden rounded-3xl bg-ink-2/60 shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-card-lg",
        featured ? "flex-col md:flex-row" : "flex-col"
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden",
          featured ? "aspect-[16/9] md:aspect-auto md:w-[46%]" : "aspect-[16/9]"
        )}
      >
        <Image
          src={c.image}
          alt=""
          fill
          sizes={featured ? "(min-width: 768px) 45vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/10 to-transparent",
            featured && "md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-ink-2"
          )}
        />
        <div className="absolute left-4 top-4 flex gap-2">
          <Chip active>{c.code}</Chip>
          <Chip>Level {c.level}</Chip>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3
          className={cn(
            "font-display text-balance font-bold leading-tight text-white transition-colors group-hover:text-accent",
            featured ? "text-2xl md:text-3xl" : "text-xl md:text-[1.35rem]"
          )}
        >
          {c.title}
        </h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-body-soft">{featured ? c.summary : c.short}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {c.roles.slice(0, featured ? 3 : 2).map((r) => (
            <span
              key={r}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-body-soft"
            >
              {r}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between pt-6 text-sm">
          <span className="font-mono text-[0.72rem] text-sky-dim">{c.syllabus.length} modules · capstone</span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-white">
            View program
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-all group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

import type { MetadataRoute } from "next";
import { articles, courses } from "@/lib/data";

const base = "https://www.futurexailab.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/courses", "/vibekids", "/skill-check", "/blog", "/contact"];
  return [
    ...pages.map((p) => ({ url: base + p })),
    ...courses.map((c) => ({ url: `${base}/courses/${c.slug}` })),
    ...articles.map((a) => ({ url: `${base}/blog/${a.slug}` })),
  ];
}

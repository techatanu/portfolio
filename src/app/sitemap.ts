import type { MetadataRoute } from "next";
import { profile, projects } from "@content/data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${profile.domain}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${profile.domain}/quick/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((p) => ({
      url: `${profile.domain}/projects/${p.slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

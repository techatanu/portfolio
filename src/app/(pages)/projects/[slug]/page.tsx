import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { profile, projects } from "@content/data";
import { CaseStudy } from "@/components/project/CaseStudy";
import { pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

/** Same order as the home grid: featured first, then the rest. */
const ordered = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)];

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return pageMetadata({
    title: `${project.title} — Case study · ${profile.name}`,
    description: project.oneLiner,
    path: `/projects/${slug}/`,
  });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const i = ordered.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();
  const prev = ordered[(i - 1 + ordered.length) % ordered.length];
  const next = ordered[(i + 1) % ordered.length];
  return <CaseStudy project={ordered[i]} prev={prev} next={next} />;
}

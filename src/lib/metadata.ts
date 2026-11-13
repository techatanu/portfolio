import type { Metadata } from "next";
import { profile, seo } from "@content/data";

/**
 * Metadata for a subpage. A child's `openGraph` / `twitter` replace the root's
 * wholesale (no deep merge), so every page sets the full share card itself.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: profile.name,
      locale: "en_IN",
      title,
      description,
      images: [seo.ogImage],
    },
    twitter: { card: "summary_large_image", title, description, images: [seo.ogImage] },
  };
}

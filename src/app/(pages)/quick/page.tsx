import type { Metadata } from "next";
import { profile, quickView } from "@content/data";
import { pageMetadata } from "@/lib/metadata";
import { QuickView } from "@/components/quick/QuickView";
import "@/components/quick/quick-print.css";

export const metadata: Metadata = pageMetadata({
  title: `${quickView.title} · ${profile.name}`,
  description: profile.tagline,
  path: quickView.href,
});

export default function QuickPage() {
  return <QuickView />;
}

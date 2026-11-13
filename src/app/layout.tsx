import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { nav, profile, seo, skills } from "@content/data";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

// Self-hosted: Space Grotesk (variable, latin subset, Google Fonts, OFL) for all text — Atanu's pick,
// Nov 2026 — and JetBrains Mono (latin subset) for the odd code-like label.
const grotesk = localFont({
  src: "./fonts/SpaceGrotesk-latin.woff2",
  weight: "300 700",
  variable: "--font-grotesk",
  display: "swap",
});

const jetbrains = localFont({
  src: "./fonts/JetBrainsMono-latin.woff2",
  weight: "400 600",
  variable: "--font-jetbrains",
  display: "swap",
});

const mlGroup = skills.find((g) => g.group === "Machine Learning & AI")?.items ?? [];

export const metadata: Metadata = {
  metadataBase: new URL(profile.domain),
  title: { default: seo.title, template: "%s" },
  description: seo.description,
  alternates: { canonical: "/" },
  authors: [{ name: profile.name, url: profile.domain }],
  creator: profile.name,
  keywords: [profile.name, "AI/ML Engineer", "Full-Stack Developer", "AI internship", ...mlGroup],
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.name,
    title: seo.title,
    description: seo.description,
    locale: "en_IN",
    images: [seo.ogImage],
  },
  twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: [seo.ogImage] },
};

export const viewport: Viewport = {
  themeColor: "#f4f0e6",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${grotesk.variable} ${jetbrains.variable} antialiased`}>
      <body>
        <JsonLd />
        <a href="#main" className="skip-link">
          {nav.skipLink}
        </a>
        {/* Each route group renders its own <main id="main">: (journey) for /, (pages) for the rest. */}
        {children}
      </body>
    </html>
  );
}

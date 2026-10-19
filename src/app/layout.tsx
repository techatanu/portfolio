import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { nav, profile } from "@content/data";
import { PerfProvider } from "@/components/providers/PerfProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Backdrop } from "@/components/ui/Backdrop";
import { Nav } from "@/components/ui/Nav";
import { ProgressRail } from "@/components/ui/ProgressRail";
import "lenis/dist/lenis.css";
import "./globals.css";

// Self-hosted (spec §2.3): Fontshare (Clash Display, Satoshi) + JetBrains Mono latin subset.
const clash = localFont({
  src: [
    { path: "./fonts/ClashDisplay-500.woff2", weight: "500" },
    { path: "./fonts/ClashDisplay-600.woff2", weight: "600" },
  ],
  variable: "--font-clash",
  display: "swap",
});

const satoshi = localFont({
  src: [
    { path: "./fonts/Satoshi-400.woff2", weight: "400" },
    { path: "./fonts/Satoshi-500.woff2", weight: "500" },
    { path: "./fonts/Satoshi-700.woff2", weight: "700" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const jetbrains = localFont({
  src: "./fonts/JetBrainsMono-latin.woff2",
  weight: "400 600",
  variable: "--font-jetbrains",
  display: "swap",
});

// Full SEO (OG image, JSON-LD, sitemap) lands in Phase 6.
export const metadata: Metadata = {
  metadataBase: new URL(profile.domain),
  title: `${profile.shortName} — AI/ML Engineer in the making`,
  description: `${profile.name} — ${profile.role}. ${profile.tagline} ${profile.openTo}.`,
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${clash.variable} ${satoshi.variable} ${jetbrains.variable} antialiased`}>
      <body>
        <a href="#main" className="skip-link">
          {nav.skipLink}
        </a>
        <Backdrop />
        <SmoothScroll />
        <PerfProvider />
        <Nav />
        <ProgressRail />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}

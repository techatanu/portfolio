import { ImageResponse } from "next/og";
import { hero, profile } from "@content/data";

// Served as /og.png (not the opengraph-image convention): the static export would write
// that file without an extension, and GitHub Pages would serve it as octet-stream.
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

/** 1200x630 share card: void background, ring motif, name, role, availability. Alt text: seo.ogAlt. */
export function GET() {
  const ring = "rgba(207,227,255,0.10)";
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#0a192f",
        color: "#EEF3FF",
        position: "relative",
      }}
    >
      {[900, 680, 460, 240].map((d) => (
        <div
          key={d}
          style={{
            position: "absolute",
            right: -d / 3,
            top: 315 - d / 2,
            width: d,
            height: d,
            borderRadius: d,
            border: `1px solid ${ring}`,
          }}
        />
      ))}
      <div
        style={{
          display: "flex",
          fontSize: 26,
          letterSpacing: 4,
          color: "rgba(207,227,255,0.6)",
          fontFamily: "monospace",
        }}
      >
        {profile.domain.replace("https://", "")}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 104, fontWeight: 700, lineHeight: 1.05 }}>{profile.name}</div>
        <div style={{ display: "flex", fontSize: 38, marginTop: 20, color: "rgba(207,227,255,0.8)" }}>
          {profile.role}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", fontSize: 30, color: "#FFB36B" }}>
        <div
          style={{ display: "flex", width: 18, height: 18, borderRadius: 18, background: "#FFB36B", marginRight: 18 }}
        />
        {hero.badge}
      </div>
    </div>,
    { ...size },
  );
}

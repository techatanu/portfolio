import { ImageResponse } from "next/og";
import { hero, profile } from "@content/data";

// Served as /og.png (not the opengraph-image convention): the static export would write
// that file without an extension, and GitHub Pages would serve it as octet-stream.
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };
const INK = "#161616";
const PAPER = "#f4f0e6";
const YELLOW = "#ffd23f";

/** 1200x630 share card in the site's paper style: grid paper, the name in caps, role, availability. */
export function GET() {
  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("");
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: PAPER,
        backgroundImage: `linear-gradient(to right, rgba(22,22,22,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(22,22,22,0.07) 1px, transparent 1px)`,
        backgroundSize: "88px 88px",
        color: INK,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: 14,
            border: `3px solid ${INK}`,
            background: YELLOW,
            boxShadow: `5px 5px 0 ${INK}`,
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          {initials}
        </div>
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 3, color: "#6c695f" }}>
          {profile.domain.replace("https://", "")}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 120,
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: -4,
            textTransform: "uppercase",
          }}
        >
          {profile.name}
        </div>
        <div style={{ display: "flex", fontSize: 40, marginTop: 24 }}>{profile.role}</div>
      </div>
      <div style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 28,
            padding: "12px 26px",
            borderRadius: 999,
            border: `3px solid ${INK}`,
            background: YELLOW,
            boxShadow: `4px 4px 0 ${INK}`,
          }}
        >
          {hero.badge}
        </div>
      </div>
    </div>,
    { ...size },
  );
}

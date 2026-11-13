import fs from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import type { Project } from "@content/data";
import { mulberry32 } from "@/lib/random";

/** FNV-1a hash of the slug -> PRNG seed, so every project always gets the same art. */
function hashSeed(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const W = 640;
const H = 360;
const n = (v: number) => Math.round(v * 10) / 10;

/** AI & ML: audio-spectrum bars mirrored on a centre line, with a waveform trace. */
function spectrum(rnd: () => number): ReactNode[] {
  const out: ReactNode[] = [];
  const bars = 40;
  const gap = W / (bars + 1);
  const pts: string[] = [];
  let level = 0.5;
  for (let i = 0; i < bars; i++) {
    level = Math.min(1, Math.max(0.12, level + (rnd() - 0.5) * 0.55));
    const h = level * 200;
    const x = gap * (i + 1);
    out.push(
      <rect
        key={`b${i}`}
        x={n(x - 3)}
        y={n(H / 2 - h / 2)}
        width={6}
        height={n(h)}
        rx={3}
        fill="var(--accent-teal)"
        opacity={n(0.25 + level * 0.55)}
      />,
    );
    pts.push(`${n(x)},${n(H / 2 + (rnd() - 0.5) * h * 0.8)}`);
  }
  out.push(<line key="axis" x1={0} x2={W} y1={H / 2} y2={H / 2} stroke="var(--line)" />);
  out.push(<polyline key="wave" points={pts.join(" ")} fill="none" stroke="var(--glow)" strokeWidth={1.5} />);
  const hot = Math.floor(rnd() * bars);
  out.push(<circle key="hot" cx={n(gap * (hot + 1))} cy={H / 2} r={5} fill="var(--accent-amber)" />);
  return out;
}

/** Full-stack: grid seams with a few lit panels and a node path across them. */
function seams(rnd: () => number): ReactNode[] {
  const out: ReactNode[] = [];
  const cols = 8;
  const rows = 5;
  const cw = W / cols;
  const rh = H / rows;
  for (let c = 1; c < cols; c++)
    out.push(<line key={`v${c}`} x1={cw * c} x2={cw * c} y1={0} y2={H} stroke="var(--line)" />);
  for (let r = 1; r < rows; r++)
    out.push(<line key={`h${r}`} x1={0} x2={W} y1={rh * r} y2={rh * r} stroke="var(--line)" />);
  const path: string[] = [];
  let r = Math.floor(rnd() * rows);
  for (let c = 0; c < cols; c++) {
    if (rnd() > 0.45) {
      out.push(
        <rect
          key={`p${c}`}
          x={n(cw * c + 6)}
          y={n(rh * r + 6)}
          width={n(cw - 12)}
          height={n(rh - 12)}
          rx={6}
          fill="var(--accent-teal)"
          opacity={n(0.12 + rnd() * 0.28)}
        />,
      );
    }
    path.push(`${n(cw * c + cw / 2)},${n(rh * r + rh / 2)}`);
    r = Math.min(rows - 1, Math.max(0, r + Math.floor(rnd() * 3) - 1));
  }
  out.push(<polyline key="path" points={path.join(" ")} fill="none" stroke="var(--glow)" strokeWidth={1.5} />);
  path.forEach((p, i) => {
    const [x, y] = p.split(",");
    out.push(
      <circle
        key={`n${i}`}
        cx={x}
        cy={y}
        r={i === path.length - 1 ? 5 : 3}
        fill={i === path.length - 1 ? "var(--accent-amber)" : "var(--glow)"}
      />,
    );
  });
  return out;
}

/** Data viz: columns climbing a baseline with a trend line over them. */
function columns(rnd: () => number): ReactNode[] {
  const out: ReactNode[] = [];
  const cols = 14;
  const cw = W / cols;
  const base = H - 40;
  for (let g = 1; g < 5; g++)
    out.push(<line key={`g${g}`} x1={0} x2={W} y1={n(base - g * 62)} y2={n(base - g * 62)} stroke="var(--line)" />);
  const pts: string[] = [];
  let level = 0.25 + rnd() * 0.2;
  for (let i = 0; i < cols; i++) {
    level = Math.min(0.95, Math.max(0.1, level + (rnd() - 0.4) * 0.28));
    const h = level * 250;
    out.push(
      <rect
        key={`c${i}`}
        x={n(cw * i + 8)}
        y={n(base - h)}
        width={n(cw - 16)}
        height={n(h)}
        rx={2}
        fill="var(--accent-teal)"
        opacity={n(0.2 + level * 0.4)}
      />,
    );
    pts.push(`${n(cw * i + cw / 2)},${n(base - h - 14 - rnd() * 20)}`);
  }
  out.push(<line key="base" x1={0} x2={W} y1={base} y2={base} stroke="var(--line)" />);
  out.push(<polyline key="trend" points={pts.join(" ")} fill="none" stroke="var(--glow)" strokeWidth={1.5} />);
  const last = pts[pts.length - 1].split(",");
  out.push(<circle key="end" cx={last[0]} cy={last[1]} r={5} fill="var(--accent-amber)" />);
  return out;
}

/** Systems: concentric orbit rings with nodes riding them and links between nodes. */
function orbits(rnd: () => number): ReactNode[] {
  const out: ReactNode[] = [];
  const cx = W / 2;
  const cy = H / 2;
  const rings = 5;
  const nodes: [number, number][] = [];
  for (let i = 1; i <= rings; i++) {
    const rx = i * 56;
    const ry = i * 32;
    out.push(<ellipse key={`r${i}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="var(--line)" />);
    const count = 1 + Math.floor(rnd() * 2);
    for (let k = 0; k < count; k++) {
      const a = rnd() * Math.PI * 2;
      nodes.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
    }
  }
  out.push(<circle key="core" cx={cx} cy={cy} r={9} fill="var(--glow)" opacity={0.9} />);
  out.push(<circle key="halo" cx={cx} cy={cy} r={22} fill="none" stroke="var(--glow)" opacity={0.35} />);
  nodes.forEach(([x, y], i) => {
    out.push(<line key={`l${i}`} x1={cx} y1={cy} x2={n(x)} y2={n(y)} stroke="var(--accent-teal)" opacity={0.22} />);
  });
  nodes.forEach(([x, y], i) => {
    out.push(
      <circle
        key={`d${i}`}
        cx={n(x)}
        cy={n(y)}
        r={i === 0 ? 5 : 3.5}
        fill={i === 0 ? "var(--accent-amber)" : "var(--accent-teal)"}
      />,
    );
  });
  return out;
}

const MOTIFS: Record<Project["category"], (rnd: () => number) => ReactNode[]> = {
  "ai-ml": spectrum,
  "full-stack": seams,
  data: columns,
  systems: orbits,
  dsa: seams,
};

/**
 * Project cover, 16:9 (or a wide strip with `banner`, so the featured card and case
 * studies don't push the content a full screen down). Uses the real screenshot from /public when it exists at
 * build time, otherwise an original generative "signal" SVG seeded from the slug.
 * Server component only (reads the filesystem at build).
 */
export function ProjectCover({
  project,
  priority = false,
  banner = false,
  className = "",
}: {
  project: Project;
  priority?: boolean;
  banner?: boolean;
  className?: string;
}) {
  const hasShot = fs.existsSync(path.join(process.cwd(), "public", project.image));
  const aspect = banner ? "aspect-video md:aspect-[3/1] lg:aspect-[4/1]" : "aspect-video";
  const frame = `block ${aspect} w-full overflow-hidden rounded-arch border border-line bg-bg-elev ${className}`;
  if (hasShot) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static export, fixed 16:9 frame
      <img
        src={project.image}
        alt={`${project.title} screenshot`}
        width={1280}
        height={720}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`${frame} object-cover object-top`}
      />
    );
  }
  const rnd = mulberry32(hashSeed(project.slug));
  return (
    <svg
      // Decorative: the card / page title already names the project.
      aria-hidden="true"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={frame}
    >
      <rect width={W} height={H} fill="var(--bg-elev)" />
      {MOTIFS[project.motif ?? project.category](rnd)}
    </svg>
  );
}

/**
 * Chapter scroll ranges (spec §2.1, §4.1).
 *
 * Each chapter is one DOM <section id={id}>. `minHeight` (in svh) is the scroll
 * length the section reserves; ScrollTrigger measures the real section bounds,
 * so content that runs longer simply extends the range. `world` tells the
 * SceneDirector (Phase 3+) which background owns that stretch of scroll.
 */
import { chapters as chapterCopy } from "@content/data";

export type ChapterId = (typeof chapterCopy)[number]["id"];
export type World = "grid" | "transition" | "vortex";

export type Chapter = {
  id: ChapterId;
  index: number;
  hud: string;
  title: string;
  minHeight: number;
  world: World;
};

const layout: Record<ChapterId, { minHeight: number; world: World }> = {
  hero: { minHeight: 100, world: "grid" },
  origin: { minHeight: 120, world: "grid" },
  skills: { minHeight: 140, world: "grid" },
  artifacts: { minHeight: 160, world: "grid" },
  timeline: { minHeight: 140, world: "transition" },
  singularity: { minHeight: 140, world: "vortex" },
  contact: { minHeight: 100, world: "vortex" },
};

export const CHAPTERS: Chapter[] = chapterCopy.map((c, index) => ({
  id: c.id,
  index,
  hud: c.hud,
  title: c.title,
  ...layout[c.id],
}));

export const chapterById = (id: ChapterId) => CHAPTERS.find((c) => c.id === id)!;

/**
 * Grid Hall layout + camera path (spec §2.2 World A).
 *
 * World units ≈ metres. The corridor runs down −z: two rows of pillars at
 * x = ±ROW_X, one every SPACING. Only PILLARS_PER_ROW exist; the shaders wrap
 * them around the camera so the hall never ends.
 */
import { CHAPTERS } from "./chapters";

export const HALL = {
  rowX: 3.4,
  spacing: 4.6,
  pillarsPerRow: 22,
  pillarSize: 0.95,
  height: 9,
  /** How far behind the camera recycled pillars still exist (so none pop in at the edge of view). */
  behind: 8,
  eyeHeight: 1.75,
  /** Camera z at the hall entrance (hero). */
  startZ: 6,
} as const;

export const HALL_LENGTH = HALL.pillarsPerRow * HALL.spacing;

/** Units travelled per chapter of scroll once the dolly starts. */
const METRES_PER_CHAPTER = 26;
/** The hero holds the camera at the entrance; the dolly starts this far into it. */
const DOLLY_START = 0.75;

/**
 * Camera z for a scroll position, where `s` = chapter index + progress within
 * it (0 → CHAPTERS.length). Static at the entrance through most of the hero
 * (spec: "camera static at entrance"), then a steady walk down the hall.
 */
export function cameraZForScroll(s: number) {
  const walked = Math.max(0, s - DOLLY_START);
  return HALL.startZ - walked * METRES_PER_CHAPTER;
}

export const LAST_CHAPTER = CHAPTERS.length - 1;

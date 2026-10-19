// Copies detect-gpu's benchmark data into public/ so GPU tiering is served from
// atanu.online instead of unpkg at runtime. Runs before `dev` and `build`.
import { cpSync, existsSync } from "node:fs";

const from = "node_modules/detect-gpu/dist/benchmarks";
const to = "public/gpu-benchmarks";
if (!existsSync(from)) {
  console.warn(`[gpu-benchmarks] ${from} not found — GPU tier falls back to the device-hint guess.`);
} else {
  cpSync(from, to, { recursive: true });
}

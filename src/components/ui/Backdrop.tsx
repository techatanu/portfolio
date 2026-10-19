/**
 * Static CSS backdrop behind every chapter. It's what visitors see before the
 * Canvas loads, and it stays as the reduced-motion / no-WebGL fallback (spec §4.5).
 */
export function Backdrop() {
  return (
    <div aria-hidden="true" className="backdrop pointer-events-none fixed inset-0 -z-10">
      <div className="backdrop-glow" />
      <div className="backdrop-grid" />
      <div className="backdrop-vignette" />
    </div>
  );
}

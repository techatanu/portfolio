"use client";

import { Printer } from "lucide-react";

/** Opens the browser print dialog (hidden on paper via quick-print.css). */
export function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="btn-ghost quick-no-print">
      <Printer aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
      {label}
    </button>
  );
}

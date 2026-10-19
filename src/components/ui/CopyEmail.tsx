"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = { email: string; label: string; copiedLabel: string };

export function CopyEmail({ email, label, copiedLabel }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard blocked (permissions / insecure context) — the mailto link next to it still works.
    }
  };

  const Icon = copied ? Check : Copy;
  return (
    <button type="button" onClick={onClick} className="btn-ghost">
      <Icon aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}

import { ArrowDown, ArrowUpRight } from "lucide-react";
import { contact, hero, profile, quickView } from "@content/data";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { PrintButton } from "./PrintButton";

/** Email, copy, GitHub, LinkedIn and résumé links; `withPrint` adds the print button. */
export function QuickActions({ withPrint = false }: { withPrint?: boolean }) {
  const [github, linkedin] = contact.links;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a href={`mailto:${profile.email}`} className="btn-primary">
        {hero.primaryCta}
        <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
      </a>
      <span className="quick-no-print">
        <CopyEmail email={profile.email} label={contact.copyLabel} copiedLabel={contact.copiedLabel} />
      </span>
      {[github, linkedin].map((link) => (
        <a key={link.label} href={link.href} className="btn-ghost" target="_blank" rel="noreferrer">
          {link.label}
          <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
        </a>
      ))}
      <a href={profile.resumeUrl} download={profile.resumeFileName} className="btn-ghost">
        {contact.links[2].label}
        <ArrowDown aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
      </a>
      {withPrint ? <PrintButton label={quickView.print} /> : null}
    </div>
  );
}

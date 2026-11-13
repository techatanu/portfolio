import { ArrowDown, ArrowUpRight } from "lucide-react";
import { contact, profile } from "@content/data";
import { chapterById } from "@/lib/chapters";
import { CopyEmail } from "@/components/ui/CopyEmail";

/** Contact: one large line, the email underlined in yellow, the links as pills, three facts, then the footer. */
export function Contact() {
  const domain = new URL(profile.domain).host;
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      data-chapter={chapterById("contact").index}
      className="relative scroll-mt-16 pt-24 pb-10 md:pt-32"
    >
      <div className="shell">
        <div className="flex max-w-sm items-center gap-4">
          <p className="kicker shrink-0">{chapterById("contact").title}</p>
          <span aria-hidden="true" className="h-px flex-1 bg-fg/25" />
        </div>
        <h2
          id="contact-title"
          className="mt-5 max-w-3xl text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.95] font-bold tracking-[-0.045em]"
        >
          {contact.heading}
        </h2>
        <p className="mt-5 max-w-md text-fg-body">{contact.body}</p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${profile.email}`}
            className="border-b-[5px] border-yellow pb-0.5 text-[clamp(1.25rem,3vw,1.875rem)] font-medium tracking-[-0.01em] break-all transition-colors hover:border-fg"
          >
            {profile.email}
          </a>
          <CopyEmail email={profile.email} label={contact.copyLabel} copiedLabel={contact.copiedLabel} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {contact.links.map((link) => {
            const isFile = link.href.endsWith(".pdf");
            const Icon = isFile ? ArrowDown : ArrowUpRight;
            return (
              <a
                key={link.label}
                href={link.href}
                className="btn-ghost"
                {...(isFile ? { download: profile.resumeFileName } : { target: "_blank", rel: "noreferrer" })}
              >
                {link.label}
                <Icon aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
              </a>
            );
          })}
        </div>

        <dl className="contact-panel mt-16 grid md:grid-cols-3">
          {contact.signals.map((s, i) => (
            <div
              key={s.label}
              className={`p-5 md:p-6 ${i > 0 ? "border-t border-dashed border-fg/30 md:border-t-0 md:border-l" : ""}`}
            >
              <dt className="eyebrow">{s.label}</dt>
              <dd className="mt-2 text-lg leading-tight font-bold tracking-[-0.01em]">{s.value}</dd>
              <dd className="mt-1.5 text-sm text-fg-muted">{s.detail}</dd>
            </div>
          ))}
        </dl>

        <footer className="mt-20 flex flex-col gap-2 border-t-[1.5px] border-fg pt-6 text-sm text-fg-muted md:flex-row md:justify-between">
          <span>
            {contact.footerLabel} {profile.location} · <span className="font-medium text-fg">{domain}</span>
          </span>
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
        </footer>
      </div>
    </section>
  );
}

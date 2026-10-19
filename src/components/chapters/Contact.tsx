import { ArrowDown, ArrowUpRight } from "lucide-react";
import { contact, hero, profile } from "@content/data";
import { chapterById } from "@/lib/chapters";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { ChapterShell } from "./ChapterShell";

/** Figma "Transmission (Minimal Centred)": one centred panel with corner brackets. */
export function Contact() {
  const domain = new URL(profile.domain).host;
  return (
    <ChapterShell id="contact" heading={false} className="flex flex-col justify-between">
      <div className="flex flex-1 items-center justify-center">
        <div className="contact-panel relative w-full max-w-3xl px-5 py-12 text-center md:px-14 md:py-16">
          {(
            [
              "top-0 left-0 border-t border-l",
              "top-0 right-0 border-t border-r",
              "bottom-0 left-0 border-b border-l",
              "bottom-0 right-0 border-b border-r",
            ] as const
          ).map((pos) => (
            <span key={pos} aria-hidden="true" className={`absolute size-4 border-fg-muted ${pos}`} />
          ))}

          <p className="inline-flex items-center gap-3 rounded-arch border border-line px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.14em] text-accent-blue uppercase">
            <span aria-hidden="true" className="size-1.5 bg-accent-blue" />
            {chapterById("contact").hud}
            <span className="hidden text-fg-muted sm:inline">{chapterById("contact").title}</span>
          </p>

          <h2
            id="contact-title"
            className="mt-8 font-display text-display leading-[0.95] font-semibold tracking-[-0.035em]"
          >
            {contact.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base text-fg-body md:text-lg">{contact.body}</p>

          <div className="mx-auto mt-10 flex max-w-xl flex-col items-stretch gap-4 rounded-arch border border-line bg-bg/60 p-4 text-left sm:flex-row sm:items-center sm:justify-between md:p-5">
            <div className="min-w-0">
              <p className="eyebrow flex items-center gap-2">
                <span aria-hidden="true" className="size-1 bg-glow" />
                {contact.emailLabel}
              </p>
              <a
                href={`mailto:${profile.email}`}
                className="mt-2 block font-mono text-base break-all text-fg transition-colors hover:text-glow md:text-xl"
              >
                {profile.email}
              </a>
            </div>
            <CopyEmail email={profile.email} label={contact.copyLabel} copiedLabel={contact.copiedLabel} />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href={`mailto:${profile.email}`} className="btn-primary">
              {hero.primaryCta}
              <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </a>
            {contact.links.map((link) => {
              const isFile = link.href.endsWith(".pdf");
              const Icon = isFile ? ArrowDown : ArrowUpRight;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="btn-ghost"
                  {...(isFile ? { download: "" } : { target: "_blank", rel: "noreferrer" })}
                >
                  {link.label}
                  <Icon aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
                </a>
              );
            })}
          </div>

          <dl className="mt-10 grid border border-line text-left md:grid-cols-3">
            {contact.signals.map((s, i) => (
              <div
                key={s.label}
                className={`p-4 md:p-5 ${i > 0 ? "border-t border-line md:border-t-0 md:border-l" : ""}`}
              >
                <dt className="font-mono text-[0.625rem] tracking-[0.12em] text-fg-muted uppercase">[{s.label}]</dt>
                <dd className="mt-2 font-display text-lg leading-tight tracking-[-0.01em] text-fg">{s.value}</dd>
                <dd className="mt-1.5 text-sm text-fg-muted">{s.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <footer className="mt-24 flex flex-col gap-2 border-t border-line pt-6 font-mono text-[0.6875rem] tracking-[0.12em] text-fg-muted uppercase md:flex-row md:justify-between">
        <span>
          {contact.footerLabel}: {profile.location} · <span className="text-fg">{domain}</span>
        </span>
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
      </footer>
    </ChapterShell>
  );
}

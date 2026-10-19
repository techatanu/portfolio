import { ArrowUpRight } from "lucide-react";
import { contact, hero, profile } from "@content/data";
import { chapterById } from "@/lib/chapters";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { ChapterShell } from "./ChapterShell";

export function Contact() {
  const domain = new URL(profile.domain).host;
  return (
    <ChapterShell id="contact" heading={false} className="flex flex-col justify-between">
      <div className="flex flex-1 flex-col justify-center">
        <p className="eyebrow">{chapterById("contact").hud}</p>
        <h2 id="contact-title" className="mt-4 font-display text-hero leading-[0.9] font-semibold tracking-[-0.045em]">
          {contact.heading}
        </h2>
        <p className="mt-6 max-w-xl text-lg text-fg-muted md:text-xl">{contact.body}</p>

        <a
          href={`mailto:${profile.email}`}
          className="mt-10 self-start font-display text-2xl tracking-[-0.02em] break-all text-fg underline decoration-line underline-offset-8 transition-colors hover:decoration-glow md:text-5xl"
        >
          {profile.email}
        </a>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href={`mailto:${profile.email}`} className="btn-primary">
            {hero.primaryCta}
            <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </a>
          <CopyEmail email={profile.email} label={contact.copyLabel} copiedLabel={contact.copiedLabel} />
          {contact.links.map((link) => {
            const isFile = link.href.endsWith(".pdf");
            return (
              <a
                key={link.label}
                href={link.href}
                className="btn-ghost"
                {...(isFile ? { download: "" } : { target: "_blank", rel: "noreferrer" })}
              >
                {link.label}
                <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
              </a>
            );
          })}
        </div>
      </div>

      <footer className="mt-24 flex flex-col gap-2 border-t border-line pt-6 font-mono text-[0.6875rem] tracking-[0.12em] text-fg-muted uppercase md:flex-row md:justify-between">
        <span>
          {profile.location} · {domain}
        </span>
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
      </footer>
    </ChapterShell>
  );
}

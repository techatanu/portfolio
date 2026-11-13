import { hero, origin } from "@content/data";
import { copy, todoAttr } from "@/lib/content";
import { PortraitDust } from "@/components/ui/PortraitDust";
import { ChapterShell } from "./ChapterShell";

/** About: the photo card on the left (it snaps into pieces as you scroll past), story and facts on the right. */
export function Origin() {
  const [lead, ...rest] = origin.paragraphs;
  return (
    <ChapterShell id="origin">
      <div className="grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <div className="exhibit max-w-sm p-2.5 hover:translate-x-0 hover:translate-y-0">
            <PortraitDust
              src="/images/atanu.jpg"
              alt={hero.portraitAlt}
              width={651}
              height={938}
              className="aspect-[4/5]"
            />
          </div>
        </div>

        <div className="space-y-6 md:col-span-7">
          <p data-reveal="card" className="text-xl leading-snug font-medium tracking-[-0.01em] md:text-2xl">
            {lead}
          </p>
          {rest.map((p) =>
            copy(p) ? (
              <p key={p} data-reveal="card" className="leading-relaxed text-fg-body" {...todoAttr(p)}>
                {p}
              </p>
            ) : null,
          )}

          <dl data-reveal="card" className="grid gap-x-8 gap-y-5 border-t-[1.5px] border-fg pt-6 sm:grid-cols-2">
            {origin.facts.map((f) => (
              <div key={f.label}>
                <dt className="eyebrow">{f.label}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-fg">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </ChapterShell>
  );
}

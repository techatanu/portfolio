import { profile, seo, skills } from "@content/data";

const mlSkills = skills.find((g) => g.group === "Machine Learning & AI")?.items ?? [];

/** schema.org Person structured data, rendered once in the root layout. */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: profile.domain,
    email: `mailto:${profile.email}`,
    jobTitle: profile.role,
    description: profile.tagline,
    image: `${profile.domain}/images/atanu-hero.webp`,
    sameAs: [profile.github, profile.linkedin],
    affiliation: { "@type": "CollegeOrUniversity", name: seo.affiliation },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sonipat",
      addressRegion: "Haryana",
      addressCountry: "IN",
    },
    knowsAbout: mlSkills,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

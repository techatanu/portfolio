import { Artifacts } from "@/components/chapters/Artifacts";
import { Contact } from "@/components/chapters/Contact";
import { Hero } from "@/components/chapters/Hero";
import { Origin } from "@/components/chapters/Origin";
import { Singularity } from "@/components/chapters/Singularity";
import { Skills } from "@/components/chapters/Skills";
import { Timeline } from "@/components/chapters/Timeline";

// Order must match CHAPTERS (src/lib/chapters.ts).
export default function Home() {
  return (
    <>
      <Hero />
      <Origin />
      <Skills />
      <Artifacts />
      <Timeline />
      <Singularity />
      <Contact />
    </>
  );
}

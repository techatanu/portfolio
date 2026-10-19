"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { PORTRAIT_SRC, PORTRAIT_STEP, samplePortrait, type PortraitData } from "@/lib/portrait";
import { useExperience } from "@/lib/store";
import { portraitFragment, portraitVertex } from "./shaders/portrait";

/** How much of the hero's height you scroll before the photo is fully gone. */
const DISSOLVE_RANGE = 0.6;
const ASSEMBLE_SECONDS = 2.2;

/**
 * Hero portrait as pixel cells: pixelates in on load, breaks into pixels and
 * blinks out on scroll (and re-forms when you scroll back). The crisp DOM <img> (HeroPortrait) sits
 * on top while the photo is at rest; this component owns its opacity once the
 * particles are ready, via `data-portrait="particles"` on the reveal wrapper.
 */
export function PortraitParticles() {
  const [data, setData] = useState<PortraitData | null>(null);

  useEffect(() => {
    let alive = true;
    const step = PORTRAIT_STEP[useExperience.getState().perfTier];
    samplePortrait(PORTRAIT_SRC, step)
      .then((d) => alive && setData(d))
      .catch(() => {
        // Decode failure: leave the DOM image (and its scroll fade) in charge.
      });
    return () => {
      alive = false;
    };
  }, []);

  return data ? <PortraitPoints data={data} /> : null;
}

function PortraitPoints({ data }: { data: PortraitData }) {
  const points = useRef<THREE.Points>(null);
  const dom = useRef<{ hero: HTMLElement; frame: HTMLElement; reveal: HTMLElement; img: HTMLImageElement } | null>(
    null,
  );
  const phase = useRef<"assembling" | "live">("live");
  const imgOpacity = useRef(-1);
  const lastSize = useRef("");

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.position, 3));
    g.setAttribute("aLum", new THREE.BufferAttribute(data.lum, 1));
    g.setAttribute("aAlpha", new THREE.BufferAttribute(data.alpha, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(data.seed, 1));
    g.setAttribute("aDelay", new THREE.BufferAttribute(data.delay, 1));
    return g;
  }, [data]);

  // Material is created in JSX (R3F disposes it) and driven through `mat.current`
  // in effects / useFrame — uniforms are mutable per-frame state, not React state.
  const mat = useRef<THREE.ShaderMaterial>(null);
  const materialArgs = useMemo(
    () => ({
      vertexShader: portraitVertex,
      fragmentShader: portraitFragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uRect: { value: new THREE.Vector4() },
        uViewport: { value: new THREE.Vector2(1, 1) },
        uDpr: { value: 1 },
        uPointSize: { value: 1 },
        uProgress: { value: 0 },
        uAssemble: { value: 0 },
        uOpacity: { value: 1 },
      },
    }),
    [],
  );

  // Take over the DOM image. If it hasn't been revealed yet (we're early), hide
  // it and assemble the photo from pixels; otherwise just start tracking scroll.
  useEffect(() => {
    const hero = document.getElementById("hero");
    const frame = document.getElementById("hero-portrait-frame");
    const reveal = document.getElementById("hero-portrait-reveal");
    const img = document.getElementById("hero-portrait") as HTMLImageElement | null;
    const material = mat.current;
    if (!hero || !frame || !reveal || !img || !material) return;
    dom.current = { hero, frame, reveal, img };

    const notYetShown = parseFloat(getComputedStyle(reveal).opacity) < 0.05;
    const atTop = hero.getBoundingClientRect().top > -1;
    let tween: gsap.core.Tween | null = null;

    if (notYetShown && atTop) {
      img.style.opacity = "0";
      imgOpacity.current = 0;
      phase.current = "assembling";
      material.uniforms.uAssemble.value = 1;
      tween = gsap.to(material.uniforms.uAssemble, {
        value: 0,
        duration: ASSEMBLE_SECONDS,
        ease: "power2.out",
        onComplete: () => {
          // Hand back to the crisp photo with a short crossfade.
          img.style.transition = "opacity 0.6s var(--ease-expo-out)";
          phase.current = "live";
          imgOpacity.current = -1;
        },
      });
    }
    reveal.dataset.portrait = "particles";

    return () => {
      tween?.kill();
      // Unmounted (e.g. reduced motion switched on): give the image back to HeroPortrait.
      delete reveal.dataset.portrait;
      img.style.opacity = "";
      img.style.transition = "";
    };
  }, []);

  useFrame((state) => {
    const els = dom.current;
    const pts = points.current;
    if (!els || !pts || !mat.current) return;
    const u = mat.current.uniforms;

    const heroBox = els.hero.getBoundingClientRect();
    const progress = THREE.MathUtils.clamp(-heroBox.top / (heroBox.height * DISSOLVE_RANGE), 0, 1);
    const assembling = phase.current === "assembling";

    // Fully dissolved and off-screen: skip the draw call entirely.
    pts.visible = assembling || progress < 0.999;
    if (!pts.visible) return;

    const r = els.img.getBoundingClientRect();
    u.uRect.value.set(r.left, r.top, r.width, r.height);
    u.uPointSize.value = (data.step * r.width) / data.width;
    u.uProgress.value = progress;

    // Viewport / DPR / the frame's responsive opacity only change on resize.
    const sizeKey = `${state.size.width}x${state.size.height}@${state.viewport.dpr}`;
    if (sizeKey !== lastSize.current) {
      lastSize.current = sizeKey;
      u.uViewport.value.set(state.size.width, state.size.height);
      u.uDpr.value = state.viewport.dpr;
      u.uOpacity.value = parseFloat(getComputedStyle(els.frame).opacity) || 1;
    }

    // The crisp photo shows only while the portrait is whole; the first few % of scroll swaps it for the pixel grid.
    const target = assembling ? 0 : 1 - THREE.MathUtils.smoothstep(progress, 0, 0.03);
    if (Math.abs(target - imgOpacity.current) > 0.001) {
      imgOpacity.current = target;
      els.img.style.opacity = target.toFixed(3);
    }
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <shaderMaterial ref={mat} args={[materialArgs]} />
    </points>
  );
}

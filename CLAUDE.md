# CLAUDE.md — atanu.online ("Signal to Singularity")

`PORTFOLIO_SPEC.md` is the source of truth. Read it before any change. This file is the short version.
`docs/ARCHITECTURE.md` adds the recruiter-first structure (`/quick/`, `/projects/<slug>/`, route groups); agent briefs live in `docs/agents/`.

## Hard rules
1. **No git writes.** Never run `git commit`, `git push`, `git merge`, `git rebase`, `git tag`, `gh pr create`, or anything that writes to GitHub. Atanu commits and pushes himself. Allowed: `git status`, `git diff`, `git log`, `git add`.
   At the end of each chunk/phase: run checks, `git add -A`, show `git status --short`, then print
   `✅ Ready to commit — run: git commit -m "<message>" && git push` and wait for "done".
2. **No invented facts or metrics.** Facts come only from `content/linkedin.pdf`, the GitHub API/READMEs for `techatanu`, or Atanu. Unknowns → `TODO(atanu): …` in `content/data.ts`. Project numbers must match the repo's own README.
3. **References are mood boards only.** Never import, ship, trace, or texture-map anything in `references/`. The vortex reference is Doğan Ural's artwork — the vortex must be an original procedural composition.
4. **Static export only** (`output: 'export'`). No API routes, server actions, middleware, or SSR-only features.
5. **Every WebGL effect has a mobile tier and a `prefers-reduced-motion` / no-WebGL fallback.** All text shown in WebGL also exists as real HTML.
6. **Ask before** installing anything not in spec §3, and before asking Atanu to open Figma, Stitch, or any other external tool (then say exactly what to click/paste and what to send back).
7. No AI attribution in files, commit messages, or READMEs. Secrets live in `.env` (gitignored) with a `.env.example`.

## Content
- All copy lives in `content/data.ts` (typed). Components read from it; never hard-code facts in JSX.
- Location shown: **Rishihood University, Sonipat, Haryana**. Public email: `atanuadhikari5@gmail.com`.

## Stack (spec §3)
Next.js (App Router, TS, `src/`) · Tailwind v4 · three + @react-three/fiber + drei + postprocessing · GSAP (ScrollTrigger, SplitText) + @gsap/react · Lenis · Zustand · detect-gpu · lucide-react · Playwright · ESLint + Prettier.

## Architecture
One fixed `<Canvas>` (`aria-hidden`) behind DOM chapters. Lenis → gsap.ticker → ScrollTrigger → Zustand store (`globalProgress`, `chapter`, `chapterProgress`, `pointer`, `perfTier`, `reducedMotion`). `SceneDirector` reads the store in `useFrame`; DOM never re-renders on scroll. Chapter scroll ranges live in `src/lib/chapters.ts`.

## Commands (filled in at Phase 2)
```bash
npm run dev          # local dev server
npm run build        # static export → out/
npm run lint         # ESLint
npx tsc --noEmit     # type check
npx playwright test  # visual tests at 375 / 768 / 1440 + reduced-motion

# portrait cut-out (approved local tooling: rembg in .venv, Python 3.11; .venv/ and .u2net/ are gitignored)
U2NET_HOME=.u2net .venv/bin/python scripts/make-portraits.py   # atanu.jpg → atanu-cutout.webp, atanu-hero.webp, design/figma/atanu-hero.png
```

## Git / deploy
Repo: `techatanu/portfolio`. Its `main` branch serves the current live atanu.online (old static HTML site), so all redesign work lives on the **`redesign`** branch until Phase 7. The Claude sandbox cannot write `.git/`, so Atanu runs `git add`/`commit`/`push` himself.
Note: inside the Claude sandbox, pip needs `--use-deprecated=legacy-certs`.

## Design decisions that override the spec (Atanu, Oct 2026)
- **Background:** a quiet starfield (WebGL) plus CSS ambient light (`Ambient.tsx`: cool-to-warm glow by scroll, pointer spotlight, grain). The black hole and code streams were **removed at Atanu's request (Nov 2026)** — too big and distracting by the later chapters. The Grid Hall, walking figure, light path and block tunnel were also built and removed. Don't bring any of them back.
- **Hero:** the portrait "pixel dissolve" stays.
- **Projects (Nov 2026):** only the repos pinned on github.com/techatanu, in profile order (`pinnedRepos` in data.ts). Re-check the pins when asked; other write-ups stay in data but aren't shown.
- **No game layer:** the level HUD, XP bar, "LEVEL UNLOCKED" banner and warp flight were **removed at Atanu's request (Nov 2026)** — don't bring them back. Scroll motion is a few quiet moments in `GameReveal.tsx` (`data-reveal`, `data-read`, `data-timeline`).
- **Look (Nov 2026):** navy/slate palette with one teal accent (tokens in `globals.css`), Inter for all text, JetBrains Mono for small labels. Plain labels, no sci-fi wording.
- Skills section (Nov 2026): an interactive grid — hover/focus/tap a skill to light it and see which projects use it (derived from project data). It replaced the sticky stacking deck at Atanu's request. Front end stays in this Next.js codebase (no Lovable/Bolt/Laravel).
- Local preview: `npm run preview` (no-cache server, `scripts/serve-out.py`); add `?v=N` after rebuilding.

## Budgets (spec §4.5)
LCP < 2.5 s on 4G mobile · CLS ≈ 0 · initial JS < 350 KB gz (Canvas lazy-loaded) · 60 fps desktop / 45+ mobile · Lighthouse mobile Perf ≥ 85, A11y ≥ 95, SEO 100.
Only report fps/Lighthouse numbers actually measured.

## Phases
0 Intake → 1 Design (optional) → 2 Scaffold → 3 Grid Hall → 4 Vortex + transition → 5 Story polish → 6 Hardening → 7 Deploy setup. Stop at every 🛑 CHECKPOINT with screenshots and wait for Atanu.

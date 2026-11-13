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
5. **Every animated effect has a `prefers-reduced-motion` / no-JS fallback** (the real content stays visible).
6. **Ask before** installing anything not in spec §3, and before asking Atanu to open Figma, Stitch, or any other external tool (then say exactly what to click/paste and what to send back).
7. No AI attribution in files, commit messages, or READMEs. Secrets live in `.env` (gitignored) with a `.env.example`.

## Content
- All copy lives in `content/data.ts` (typed). Components read from it; never hard-code facts in JSX.
- Location shown: **Rishihood University, Sonipat, Haryana**. Public email: `atanuadhikari5@gmail.com`.

## Stack (spec §3)
Next.js (App Router, TS, `src/`) · Tailwind v4 · three + @react-three/fiber + drei + postprocessing · GSAP (ScrollTrigger, SplitText) + @gsap/react · Lenis · Zustand · detect-gpu · lucide-react · Playwright · ESLint + Prettier.

## Architecture
No canvas layer. Lenis → gsap.ticker → ScrollTrigger → Zustand store (`chapter`, `chapterProgress`, `globalProgress`). Scroll motion lives in `GameReveal.tsx` (`data-reveal`). Section ids/labels/headings come from `chapters` in data.ts via `src/lib/chapters.ts`.

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

## Design decisions that override the spec (Atanu, Nov 2026 — branch `brutalist`)
- **Look:** light "paper" style, inspired by (not copied from) aahil-khan.xyz: cream paper + faint grid, Space Grotesk (self-hosted `src/app/fonts/SpaceGrotesk-latin.woff2`), ink outlines, hard offset shadows, one yellow accent (`--accent-amber`), pill buttons that press in. Tokens in `globals.css` (`--accent-teal` is now the ink accent — legacy name). Never copy that site's code, copy, images or signature bits.
- **No WebGL / 3D / game layer:** the starfield, black hole, code streams, warp, level HUD and banners are all removed. Don't bring them back.
- **Sections:** huge uppercase name hero → About (photo card) → Skills (ledger rows, hover/tap a skill → "Used in" projects) → Projects (alternating rows) → Experience (tabs) → What I'm looking for → Contact.
- **Photo "snap" dissolve** is on the About photo (`PortraitDust.tsx`, plain 2D canvas): assembles when it comes into view, breaks into pieces as you scroll past, re-forms on scroll back.
- **Projects:** only the repos pinned on github.com/techatanu, in profile order (`pinnedRepos` in data.ts). Re-check the pins when asked.
- Front end stays in this Next.js codebase (no Lovable/Bolt/Laravel).
- Local preview: `npm run preview` (no-cache server, `scripts/serve-out.py`); add `?v=N` after rebuilding.

## Budgets (spec §4.5)
LCP < 2.5 s on 4G mobile · CLS ≈ 0 · initial JS < 350 KB gz (Canvas lazy-loaded) · 60 fps desktop / 45+ mobile · Lighthouse mobile Perf ≥ 85, A11y ≥ 95, SEO 100.
Only report fps/Lighthouse numbers actually measured.

## Phases
0 Intake → 1 Design (optional) → 2 Scaffold → 3 Grid Hall → 4 Vortex + transition → 5 Story polish → 6 Hardening → 7 Deploy setup. Stop at every 🛑 CHECKPOINT with screenshots and wait for Atanu.

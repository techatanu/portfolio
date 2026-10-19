# Phase 1 — Google Stitch design pass

Goal: get 2–3 layout directions for **Hero**, **Artifacts (projects)** and **Contact**, pick one, and send it back so it can be reconciled with the design tokens before any code is written. Stitch output is a sketch, not final code. The 3D worlds (Grid Hall, Vortex) are built in WebGL later — in Stitch they are only dark atmospheric backgrounds.

**Do not upload** anything from `references/` to Stitch (the vortex image is Doğan Ural's artwork; the grid-hall image isn't ours either). Your own photo is fine to upload if you want it in the mockups.

---

## Steps

1. Open **https://stitch.withgoogle.com** and sign in with your Google account.
2. Choose **Web** (not Mobile) as the target.
3. Paste **Prompt 1** below and generate. Wait for it to finish.
4. In the same project, paste **Prompt 2**, then **Prompt 3**, one at a time (each adds a screen).
5. If a direction looks wrong, use **Prompt 4 (variations)** to get 2 alternatives of the screen you dislike.
6. Pick your favourite direction for each screen.
7. Export:
   - If there's a **DESIGN.md** / design-system export, download it and put it in `design/DESIGN.md` in this folder.
   - Use **Copy to Figma** (or the export menu → Figma) and paste into a new Figma file. Share the Figma link with view access, **or** just take screenshots of the chosen screens and put them in `design/stitch/` (e.g. `hero.png`, `artifacts.png`, `contact.png`).
8. Send me back: which direction you picked per screen + whichever of these you have (DESIGN.md, Figma link, screenshots). Screenshots alone are enough.

---

## Prompt 1 — design system + Hero

```
Design a dark, cinematic, single-page personal portfolio for "Atanu Adhikari", an AI/ML Engineer and Full-Stack Developer (3rd-year B.Tech CS & AI student) who is looking for a remote AI/ML internship. The site is one scroll story called "Signal to Singularity": a vast dark architectural hall of tall concrete pillars with thin cold-white light strips on the ceiling and glowing seam lines in the floor, which later dissolves into a swirling particle galaxy. Treat the background as a dark atmospheric full-bleed image; all UI sits on top of it.

Design tokens (use exactly):
- Background #050506, elevated surface #0C0D10
- Text #E8EAF0, muted text #8A8F9C, hairlines rgba(232,234,240,0.12)
- Glow #CFE3FF, accent blue #5B8CFF, accent amber #FFB36B (amber only for the main CTA and the "open to work" dot)
- Display font: Clash Display, huge with tight tracking. Body: Satoshi. Mono/HUD: JetBrains Mono
- Corner radius 2px everywhere — sharp, architectural. Dark mode only. Monochrome; the only colour is light.

Screen: HERO (desktop 1440 wide).
- Tiny monospace HUD label top-left "CH.00 / SIGNAL" and a thin vertical progress line on the right edge.
- Huge name "Atanu Adhikari" (about 11rem), one-line role "AI/ML Engineer · Full-Stack Developer".
- A small pill badge with a glowing amber dot: "Open to remote AI/ML internships".
- A monochrome cut-out portrait of a young man, softly lit, placed to one side so it doesn't cover the name.
- Minimal top nav: Work, About, Contact, and a tiny "SOUND OFF" toggle in a corner.
- Scroll cue at the bottom: "Scroll to follow the signal".
- A recruiter must understand who he is, what he does and that he wants an AI/ML internship within 10 seconds.
Mood: quiet, confident, Awwwards-level, lots of negative space, no gradients-for-the-sake-of-it, no glassmorphism cards, no emojis.
```

## Prompt 2 — Artifacts (projects)

```
Add a second screen in the same design system: ARTIFACTS — "Things I've built". HUD label "CH.03 / ARTIFACTS".
It is a horizontal-scrolling gallery of project "exhibits", like illuminated plaques in a dark hall.
- First and largest: a featured case-study panel for "Infant State Recognition" — tags "Audio ML · Solo", one-liner "Classifies a baby's cry into one of 8 need states from 218 hand-built audio features", sections Problem / Approach (4–5 short bullet points) / Results / What's next, a tech-stack chip row (Python, librosa, scikit-learn, PyTorch, Gradio), and two buttons: "GitHub" and "Live demo".
- Then smaller exhibit cards, each with: title, tag line, one-liner, 3 short bullet points, stack chips, and two links "GitHub" and "Demo". Use these: "Intelligent Exam Question Analyser" (NLP · Agentic RAG · Team of 4), "Student GitHub Reviewer" (LLM agent), "MediTrack" (Full-stack · MERN), "Cognify" (AI agent · Hackathon).
- A counter like "01 / 10" and a thin progress line under the gallery.
Keep the 2px radius, hairline borders, monospace labels, and lots of dark space.
```

## Prompt 3 — Contact

```
Add a third screen in the same design system: TRANSMISSION — contact. HUD label "CH.06 / TRANSMISSION".
The background is a slow, swirling particle galaxy with a bright core (dark, mostly black-and-silver with tiny blue and amber sparkles).
- Huge heading "Open a channel."
- Sub-line "Hiring an AI/ML or full-stack intern? My inbox is open."
- Large email address atanuadhikari5@gmail.com with a "Copy email" button that becomes "Copied ✓".
- Primary amber CTA "Email me", secondary links: GitHub, LinkedIn, Résumé (download).
- Footer line in monospace: "Rishihood University, Sonipat, Haryana · atanu.online".
```

## Prompt 4 — variations (optional, use on any screen you dislike)

```
Give me 2 alternative layouts of this screen with the same tokens and content: one more editorial and asymmetric, one more minimal and centred. Keep the dark cinematic hall/galaxy background and the 2px radius.
```

## Also useful (optional)

Generate the **mobile (375 wide)** version of the Hero only:

```
Show the HERO screen at mobile width 375px: name wraps onto two lines, portrait sits behind/below the name at lower opacity, badge and scroll cue stay above the fold.
```

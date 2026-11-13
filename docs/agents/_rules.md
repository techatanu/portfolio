# Shared rules for every portfolio agent

1. Before writing anything, read `CLAUDE.md`, `docs/ARCHITECTURE.md`, `content/data.ts`, `src/app/globals.css`
   and every existing file you are about to change or imitate.
2. **Edit only the files your agent file says you own.** `content/data.ts`, `src/app/globals.css`, `package.json`
   and layouts you don't own belong to the lead. If you need new copy, say so in your report (exact key + text)
   and use the closest existing export in the meantime — never hard-code facts in JSX.
3. **No git writes** (no commit/push/merge/rebase/tag). **Install nothing.** Don't run `npm run build`, `npm run dev`
   or `npm run preview`; other agents work in parallel and the lead builds once at the end.
4. Static export only (`output: 'export'`): no API routes, server actions, middleware, `cookies()`/`headers()`.
   Dynamic routes use `generateStaticParams` + `export const dynamicParams = false`. In Next 16, `params` is a Promise.
5. Text that may contain `TODO(atanu)` goes through `copy` / `copyList` / `todoAttr` from `@/lib/content`.
6. Match the code around you: 2-space indent, double quotes, Tailwind utilities, the existing component classes
   (`.shell .kicker .eyebrow .chip .badge .badge-dot .btn-primary .btn-ghost .btn-accent .exhibit .link-underline`),
   lucide icons with `strokeWidth={1.5}` and `aria-hidden`, short JSDoc comments like the existing files.
7. Accessibility: semantic landmarks, exactly one `h1` per page, visible focus, accessible names on icon links,
   honour `prefers-reduced-motion` for any motion. No horizontal scroll at 375 px.
8. Finish with `npx tsc --noEmit` and `npm run lint`. Fix errors in your files; report errors in files you don't own.
9. Report back: files created/changed, what you verified and how, any copy the lead should add, open questions.
   Never claim a check you didn't run.

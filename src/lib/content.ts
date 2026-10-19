/**
 * Copy helpers. Unresolved `TODO(atanu)` strings show up (outlined) in dev so
 * they're easy to spot, and are dropped from production builds.
 */
const SHOW_TODOS = process.env.NODE_ENV !== "production";

export const isTodo = (s: string | undefined) => !!s && s.includes("TODO(atanu)");

/** The string, or null when it's an unresolved TODO in a production build. */
export function copy(s: string | undefined): string | null {
  if (!s) return null;
  if (isTodo(s) && !SHOW_TODOS) return null;
  return s;
}

/** Spread onto the element that renders `s` so dev builds outline TODOs. */
export const todoAttr = (s: string | undefined) => (isTodo(s) ? { "data-todo": "" } : {});

export const copyList = (items: string[]) => items.filter((s) => copy(s) !== null);

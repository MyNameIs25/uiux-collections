# Implementation Guideline

**Read this before implementing any new example.** It's the philosophy of this
collection. The specifics live in siblings — [TAGS-GUIDELINE.md](TAGS-GUIDELINE.md)
(how to tag) and [PRINCIPLE-GUIDELINE.md](PRINCIPLE-GUIDELINE.md) (how to write
the "aha"). This file is the *why* behind all of them.

## What this collection optimizes for

`uiux-collections` is a personal gallery of polished, **copy-pasteable** UI/UX
building blocks. Every example exists to be lifted into some other project
later. So the bar, in order, is:

> **Simple · Understandable · Reusable**

A clever-but-opaque implementation is *worse* than a plain one. If a stranger
can't grasp the effect in 30 seconds of reading, it's not done.

## The prime directive

**Use the simplest technique that convincingly achieves the effect.** Reach for
a library when it *removes* code; reach for raw code when a library would only
add ceremony. When two approaches look equal, pick the one that reads faster.

---

## Principles

1. **Lean on libraries to delete code.** The stack is already installed for this
   reason — **GSAP** for timelines / stagger / spring easing, **three +
   @react-three/fiber + drei** for 3D / WebGL, **shadcn/ui** for primitives
   (Button, Badge, Tabs, HoverCard, Dialog, Tooltip…). Don't hand-roll what a
   dependency does well (no manual `requestAnimationFrame` math if GSAP is
   shorter; no bespoke popover if shadcn has one). Conversely, **don't** pull in
   a library for something one line of CSS already does.

2. **Prefer Tailwind; promote reusable CSS to utilities.** Style with Tailwind
   utility classes + theme tokens. When an effect needs custom CSS *and it's
   reusable*, make it a Tailwind **`@utility`/token** in `src/styles/` (grouped
   by kind: `theme.css` tokens, `animations.css` keyframes, `utilities.css`
   `@utility`) and catalogue it in `src/registry/utilities.ts` — **not** a
   per-component `<style>` block. A genuine one-off can stay local, but first
   ask: *would a second component want this?*

3. **Compose, don't duplicate.** Write the same gradient / shadow / animation
   twice → it wants to be a utility. Need the same widget as another example →
   share it. Duplication is the signal to extract.

4. **One file is the source of truth.** An example's `demo.tsx` is *both* what
   renders live and what's shown as **Source** (via Vite `?raw`) — never write
   the code twice. Keep it self-contained: imports at top, colocate assets
   (images) in the folder, rely on nothing app-specific beyond theme tokens.

5. **Themeable by default.** Use tokens (`bg-background`, `text-foreground`,
   `text-muted-foreground`, `border`, …) so light/dark just work. A full-bleed
   scene (hero, background) may bring its own backdrop — then set `preview:
   'fit'`.

6. **Degrade gracefully.** If an effect leans on a bleeding-edge feature (e.g.
   `backdrop-filter: url()`), feature-detect with `@supports` and ship a sane
   fallback. It must never look *broken* — only less fancy.

7. **Responsive & touch-first.** No hover-only affordances — touch devices don't
   hover. Gate hover-reveal behind `@media (hover: hover)` (the **`can-hover:`**
   variant) and show controls by default on touch. Check it at mobile width.

8. **Accessible & cheap.** `aria-hidden` on decorative layers, keep
   `focus-visible` states, and animate GPU-cheap properties (`transform`,
   `scale`, `opacity`) rather than layout properties (`width`, `top`, …).

9. **Explain the trick.** Write the `principle` (name the load-bearing
   classes/APIs and say *why*; if you used a custom utility, name and explain
   it). Tag from the controlled vocabulary. Fill `libraries` and `utilities`.

10. **Verify before "done".** `pnpm build` (type-check) + `pnpm lint`, then
    actually preview it — desktop, **mobile width**, and dark mode.

---

## Adding an example — the loop

1. Read this + TAGS-GUIDELINE + PRINCIPLE-GUIDELINE.
2. Choose the simplest approach; decide which libraries / utilities to lean on.
3. Extract any reusable CSS into `src/styles/` + register it in `utilities.ts`.
4. Drop `src/registry/examples/<id>/` with `demo.tsx` + `showcase.ts` (see the
   registry section in AGENTS.md).
5. Fill metadata: `category`, `tags`, `libraries`, `utilities`, `principle`,
   `preview`.
6. Build · lint · preview (desktop + mobile + dark).

## Smell tests — stop and simplify if…

- You're writing a big `<style>` block → can it be Tailwind + a shared
  `@utility`?
- You're hand-animating with `setInterval` / manual rAF math → would GSAP be
  shorter and smoother?
- You copied a chunk from another example → extract and share it.
- A reader would need the *whole file* to understand the effect → the effect is
  doing too much, or your principle isn't capturing the essence.
- It only works with a mouse → add the touch path.
- You added a dependency for a one-liner → drop it.

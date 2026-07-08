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

## Choosing the animation engine — CSS · GSAP · raw rAF

Principle 1, spelled out for motion. **Every example that moves must pick its
engine off this ladder** — work top-down and stop at the first rung that fits.

1. **CSS `transition`** — a single state change between two snapshots
   (hover / focus / open / close / mount), one fixed easing, no mid-flight
   retargeting. Reference: bulk-import-modal's panel pop.
2. **CSS `@keyframes`** — self-running loops (spin, ping, breathe) and
   fire-and-forget one-shots replayed by remounting (`key` change — see
   flip-countdown's flaps). Promote the keyframes to `--animate-*` in
   `src/styles/animations.css`.
3. **Discrete stepping** — when the "animation" is really *frames* (dot-matrix
   fill order, a live data feed), `setInterval` state ticks are correct: there
   is no tween to hand to an engine. `setTimeout` likewise stays for phase
   state machines (submit-loading-button's fake request).
4. **GSAP** — required as soon as any of these appear; hand-rolling them is a
   smell:
   - **a value chasing a moving target** (damped follow / lerp toward the
     pointer) → `gsap.quickTo` or a retargeted tween with `overwrite`, never a
     manual `pos += (target - pos) * k` rAF loop with settle checks;
   - **a duration-based ramp of a plain number** driving JS / attributes (a
     0→1 charge, a dashoffset) → tween a proxy object with `onUpdate`, never
     manual `dt` integration;
   - **sequencing** (timelines, overlapping steps), **stagger**, scroll-driven
     motion, or tweens that must be interrupted / reversed mid-flight;
   - an easing CSS can't express (spring, elastic, custom curves).
5. **Raw `requestAnimationFrame`** — only for continuous per-frame *rendering
   or simulation*: canvas / WebGL render loops (rainy-glass-hud, webgl-fog,
   liquid-metal-background) and transport clocks tracking real timestamps
   (podcast-card). The loop itself is legitimate; GSAP inside it is optional
   (`gsap.ticker`).

Two clarifications: the one-frame `requestAnimationFrame(() => setShown(true))`
mount trick isn't animation code (it just kicks a CSS transition — fine), and
rung 4 never licenses reaching past rungs 1–3: GSAP for a hover fade is
ceremony, exactly what the prime directive bans.

Litmus test: **manual `dt`/lerp math plus your own start/stop/settle
bookkeeping means you're re-implementing a tween engine — that's GSAP's job.**

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
- You're hand-animating with `setInterval` / manual rAF math → re-check the
  animation-engine ladder above; lerp/`dt` bookkeeping belongs to GSAP.
- You copied a chunk from another example → extract and share it.
- A reader would need the *whole file* to understand the effect → the effect is
  doing too much, or your principle isn't capturing the essence.
- It only works with a mouse → add the touch path.
- You added a dependency for a one-liner → drop it.

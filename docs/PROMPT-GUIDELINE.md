# Prompt Guideline

How the **Agent prompt** (the details page's "Agent prompt" tab, the `prompt`
field + `buildPrompt` in `prompt.ts`) is written. **Read this before writing an
explicit `prompt`, editing `buildPrompt`, or when a component's prompt feels
thin.**

The Agent prompt is the one artifact meant to leave this repo: a reader copies
it into *another* coding agent — one that has **no access to this codebase** —
and expects a faithful, one-shot reproduction. So the bar is:

> A stranger agent, given only this text, rebuilds the component so it looks and
> behaves the same — right sizes, colours, timings, states, and a11y.

This is **not** the same job as the `principle` (the teaching "aha") or the
`description` (the one-line pitch). Those feed it; they don't replace it.

---

## What a prompt must carry: intent + spec + reference code

A reproducible prompt has three layers. Drop any one and the result drifts.

| Layer | Answers | Where it comes from |
| ----- | ------- | ------------------- |
| **Intent** | *What is it, what should it feel like?* | `description` + `principle` |
| **Spec** | *The exact values & structure* | the **full `demo.tsx` source** |
| **Bridge** | *Things the source assumes exist* | custom-utility CSS, asset/font notes |

`buildPrompt` assembles all three automatically (see below), so **most examples
should NOT hand-write `prompt`.** Your job is to make the inputs good.

---

## Why prompts go thin (the failure mode)

The tempting mistake is "the `principle` explains it, that's enough." It isn't.
The principle is capped at ~80 words on **one** mechanism (see
[PRINCIPLE-GUIDELINE.md](PRINCIPLE-GUIDELINE.md)), so it **deliberately omits**
almost everything needed to reproduce faithfully:

- exact **sizes / radii / colours / shadows / fonts** (e.g. disc `228px`, icons
  `#555`, button `64px`);
- every **state and its timing** — durations, easings (the real `cubic-bezier`),
  delays, **stagger** intervals, and the *asymmetry* between open/close;
- the **layer structure** (ring vs icons vs hub vs dividers) and the small
  geometric truths (e.g. dividers offset **22.5°** so icons sit between them);
- the full **item set** (which 8 icons, in what order);
- **accessibility** (roles, `Esc`, outside-click, focus/`tabIndex`) and
  **`prefers-reduced-motion`** fallbacks;
- **responsive / touch** behaviour and the **backdrop/stage** the effect needs.

All of that lives in the code. So the prompt must ship the **source** — and,
because custom `@utility` classes (e.g. `liquid-glass`, `glass-hud`) and web
fonts live *outside* `demo.tsx`, it must also ship **their CSS** and flag any
**local asset** (`./background.webp`) as something the reader must substitute.

## What `buildPrompt` now includes (automatic)

For any showcase without an explicit `prompt`, the generator emits, in order:

1. **Metadata** — name, category, `description`, `libraries`, `tags`.
2. **Requirements** — match concrete values (not approximations); preserve a11y
   + reduced-motion; keep responsive/touch; use only the listed libraries;
   replace local assets; single self-contained themeable file.
3. **Key idea** — the `principle` verbatim (the *why*).
4. **Custom Tailwind utilities** — for every name in `utilities`, its summary +
   full CSS from `utilities.ts` (the reader won't have these otherwise).
5. **Reference implementation** — the full `demo.tsx` source (the *what*).

So the prompt's quality is a function of the metadata you write **and** the code
you ship. Both are read by the stranger agent.

---

## Your job (to get a strong auto-prompt)

Since the generator assembles the prompt from your inputs, invest there:

1. **`description` states the intent and the feel** — not just "a menu"; *"blooms
   open slowly, snaps shut fast."* This is the only prose framing the code lacks.
2. **`principle` names the load-bearing pieces and says *why*** (per
   PRINCIPLE-GUIDELINE) — it orients the reader before they hit the code.
3. **`utilities` lists EVERY custom class the component uses.** If you forget
   one, its CSS won't ship and the reproduction breaks. (Stock Tailwind is fine
   to omit.)
4. **Keep `demo.tsx` clean and comment the non-obvious magic numbers** — it ships
   *verbatim* as the spec. A `// 22.5° so lines fall between icons` in the source
   becomes documentation in the prompt. Prefer named constants over inline
   literals for the values that define the effect.
5. **Keep `libraries` honest** — the reader is told to use *only* these.
6. **Flag external needs the code implies** — a web font (loaded via `<link>`),
   an asset to swap. If it's not obvious from the code, say it (see below).

---

## When to hand-write an explicit `prompt` (rare)

Set `prompt` only when the auto-composition genuinely can't convey something:

- **Context the code can't show** — "this is meant to sit full-bleed behind a
  hero headline," or an interaction that depends on surrounding page state.
- **A spec the code only approximates** — if `demo.tsx` is a deliberate
  simplification, state the true target values so the reader can aim higher.
- **Heavy external dependencies** — a specific font, dataset, or asset whose
  semantics matter beyond "swap it."
- **A huge source you want to trim** — supply a focused reference instead of a
  1000-line file.

Otherwise leave `prompt` unset and let `buildPrompt` do it — one source of truth
beats a hand-copied prompt that rots when the code changes.

---

## Checklist

Before trusting a component's Agent prompt, confirm:

- [ ] `description` conveys **intent + feel**, not just a category restatement.
- [ ] `principle` names the mechanism and the *why*.
- [ ] `utilities` lists **every** custom `@utility` / token the component uses.
- [ ] `demo.tsx` comments its magic numbers and uses named constants for the
      effect-defining values (it ships verbatim).
- [ ] `libraries` is exact.
- [ ] Any web font / external asset the code needs is flagged (code comment or an
      explicit `prompt`).
- [ ] Opened the "Agent prompt" tab and sanity-read it end to end: could a
      stranger with no repo access rebuild this from the text alone?

# Principle Guideline

How to write the **`principle`** field on a showcase. **Read this before writing
a principle for a new example.**

A `principle` is the **"aha"** of an effect: a short explanatory note + the key
code snippet that teaches the *one mechanism* making it work. It is shown in the
**Principle** tab (`principle?` in `showcase.ts`) and feeds the auto-composed
agent prompt.

It is **not** the full source (that's the **Source** tab, injected from
`demo.tsx`) and **not** a tutorial. Think: *the senior dev pointing at the one
line that matters and saying why.*

---

## Shape

A principle is Markdown with exactly two parts, in this order:

1. **Explanation** — one short prose paragraph.
2. **Key snippet** — one fenced ` ```tsx ` code block.

```md
<explanation: 2–4 sentences naming the load-bearing classes/APIs and *why* they work>

```tsx
<the minimal code — only the lines that would break the effect if removed>
```
```

Both parts render properly in the Principle tab (prose as prose, code
highlighted). Inline `` `code` `` in the explanation is styled — use it for
class/prop/API names.

---

## The rules

### Length (hard limits)

| Part            | Target        | Hard cap    |
| --------------- | ------------- | ----------- |
| Explanation     | **40–70 words** | **80 words** |
| Key snippet     | **≤ 12 lines** | **20 lines** |

The whole principle should fit on screen without scrolling. If you can't explain
the trick in 80 words, the example is doing too much — split it, or the effect
belongs in Source, not Principle.

### Content

1. **Explain the mechanism, not the obvious.** ❌ "This is a button." ✅
   "`backdrop-blur-md` blurs whatever sits *behind* the element."
2. **Name the load-bearing pieces.** State the exact classes / props / APIs that
   do the work, as inline `` `code` ``, so a reader can grep them.
3. **Say *why*, not just *what*.** The value is the causal link — e.g. "the
   translucent `bg-white/10` is what makes the blur visible; an opaque background
   would hide it." A list of class names without the *why* is not a principle.
4. **One mechanism per principle.** If two tricks combine, lead with the primary
   and mention the second in a clause — don't document both in full.
5. **Strip the snippet to essence.** Remove colors, padding, copy, and wrappers
   that aren't part of the trick. Keep only lines that are load-bearing. Annotate
   at most 1–2 lines with a short `//` comment.

### Style

- Plain language, **present tense, active voice**. "The gradient is clipped to
  the glyphs," not "The gradient will be clipped."
- **No marketing words** ("stunning", "beautiful", "amazing") and no restating
  the `description` or `tags`.
- **No boilerplate** — skip imports and the `function Foo() { return ... }`
  wrapper unless the trick actually lives there.
- Don't duplicate the full source; the Source tab already has it.

---

## Checklist

Before saving a principle, confirm:

- [ ] Explanation is ≤ 80 words (≤ 70 preferred).
- [ ] It names the specific classes/APIs that carry the effect (inline `code`).
- [ ] It answers **why** the mechanism produces the result.
- [ ] Snippet is ≤ 20 lines and contains only load-bearing code.
- [ ] Someone could rebuild the effect from the principle alone.

---

## Worked examples

### Frosted glass card

> Frosted glass is a translucent surface (`bg-white/10`) plus
> `backdrop-blur-md`, which blurs whatever sits *behind* the element. The
> translucency is what makes the blur visible — an opaque background would hide
> it. The soft glow is a separate blurred gradient blob (`blur-2xl`) placed
> behind the content.
>
> ```tsx
> <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md">
>   {/* blurred blob behind the content = the glow */}
>   <div className="absolute -top-10 -right-10 size-32 rounded-full bg-gradient-to-br from-fuchsia-400/40 to-indigo-400/40 blur-2xl" />
> </div>
> ```

### Gradient text

> The gradient is painted as a background, then clipped to the glyph shapes with
> `bg-clip-text`, and the text's own fill is removed with `text-transparent` so
> the gradient shows through. Without `text-transparent` the solid text color
> would sit on top and hide it.
>
> ```tsx
> <span className="bg-gradient-to-r from-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
>   Make it pop
> </span>
> ```

### Gradient pill button

> A fully-rounded `rounded-full` pill with a `bg-gradient-to-r` fill. The springy
> feel comes from animating `scale` only — `transition-transform` with
> `hover:scale-105` and `active:scale-95` — which the GPU handles cheaply and
> which never triggers layout.
>
> ```tsx
> <button className="rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-6 py-2.5 text-white transition-transform hover:scale-105 active:scale-95">
>   Get started
> </button>
> ```

---

## Why the limit

The Principle tab exists so a reader (human or agent) can absorb the trick in
seconds. A capped, prose-first note forces you to isolate the *actual*
mechanism instead of pasting code — and a tight principle makes a tight
auto-generated agent prompt. Length is a feature: if it's short, it's learnable.

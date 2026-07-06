# Tags Guideline

The canonical vocabulary for tagging showcases. **Read this before adding tags
to a new example** so the collection stays searchable and consistent.

Tags live on each showcase's `showcase.ts` (`tags: [...]`). They are free-form
strings in code, but this document is the source of truth for *which* strings to
use — treat it as a controlled vocabulary, not a free-for-all.

---

## Tags vs. categories vs. libraries

Three different axes — don't mix them up:

| Field        | Answers            | Cardinality        | Example                          |
| ------------ | ------------------ | ------------------ | -------------------------------- |
| `category`   | *What is it?*      | exactly **one**    | `buttons`, `hero`, `cards`       |
| `libraries`  | *What deps power it?* | the actual deps | `gsap`, `three`, `tailwind`      |
| `tags`       | *What's notable about it?* | **many**  | `gradient`, `hover`, `3d`        |

- **Don't** repeat the category as a tag (a `buttons` component doesn't need a `button` tag). The one allowed overlap is **`3d`**: it's both a category and a tag, because plenty of non-3D-category components (a hero, a background) still use 3D and should be findable by it.
- **Don't** repeat a library name as a tag when it adds nothing (no `gsap` tag). Use a *conceptual* tag instead: `physics`, `3d`, `shader`, `sound` — these describe the effect, not the dependency.

---

## Naming rules

1. **lowercase** always. No `#`, no capitals.
2. **kebab-case** for multi-word tags: `in-view`, `dark-mode`, `text-clip`.
3. **Reuse a canonical tag** from the vocabulary below. If you're about to invent a synonym, check the "Avoid → use" table first.
4. **Aim for 2–6 tags.** Enough to be findable, not so many they're noise.
5. **Prefer the singular/base form** unless the plural is the established name (`particle` not `particles`, but `physics` stays `physics`).

### How to pick (recipe)

Walk the four groups in order and take what applies:

1. **Style** — does it have a distinctive *look*? → pick ≥1 (`gradient`, `glass`…)
2. **Motion** — does it *animate*? → pick the technique(s) (`parallax`, `reveal`…)
3. **Trigger** — is the behavior *triggered by the user or a state*? → pick the trigger(s) (`hover`, `scroll`, `upload`, `loading`…)
4. **Capability** — does it use *special tech or senses*? → pick them (`3d`, `physics`, `sound`…)

Then optionally add a **descriptor** (group 5) for domain flavor.

---

## The vocabulary

### 1. Style — the look

`gradient` · `glass` · `blur` · `glow` · `neon` · `grain` · `mesh` · `neumorphism` · `neobrutalism` · `outline` · `minimal` · `retro` · `monochrome` · `duotone` · `shadow` · `liquid`

> "Liquid glass" = `glass` + `liquid`. Frosted panels = `glass` (+ `blur`).

### 2. Motion — the animation technique

`parallax` · `marquee` · `reveal` · `stagger` · `morph` · `typewriter` · `particles` · `spring` · `wave` · `ripple` · `float` · `tilt` · `magnetic` · `spotlight` · `orbit` · `scramble`

### 3. Trigger — what starts the behavior

`hover` · `click` · `drag` · `scroll` · `focus` · `input` · `upload` · `loading` · `toggle` · `swipe` · `keyboard` · `in-view` · `auto` · `idle`

> `auto` = plays on its own (no user action). `in-view` = fires when scrolled into the viewport. `loading` = spinners, skeletons, progress.

### 4. Capability — special tech & senses

`3d` · `webgl` · `shader` · `canvas` · `svg` · `physics` · `sound` · `video` · `camera` · `haptics`

> Use these for *conceptual* discoverability even if the same word appears in `libraries`. A three.js scene is usually `3d` + `webgl` (+ `shader` if it has custom shaders).

### 5. Descriptor — domain / intent (open, but curated)

`cta` · `pill` · `typography` · `dark-mode` · `responsive` · `accessible` · `interactive`

> This group is intentionally open for flavor that doesn't fit above. Still: lowercase, kebab-case, and reuse an existing one before adding a new word — then record it here.

---

## Avoid → use (canonical synonyms)

Keep the vocabulary tight. If you reach for the left, use the right instead:

| Avoid                                   | Use                          |
| --------------------------------------- | ---------------------------- |
| `glassmorphism`, `frosted`, `liquid-glass` | `glass` (+ `liquid` if fluid) |
| `animation`, `animated`                 | a specific **Motion** or **Trigger** tag |
| `onhover`, `mouseover`, `mouse-over`    | `hover`                      |
| `onclick`, `tap`, `press`               | `click`                      |
| `file-upload`, `drop`, `dropzone`       | `upload` (+ `drag` if draggable) |
| `spinner`, `skeleton`, `loader`         | `loading`                    |
| `three-d`, `3-d`, `threejs`             | `3d` (+ `webgl`)             |
| `audio`, `sfx`, `sound-effect`          | `sound`                      |
| `scroll-trigger`, `onscroll`            | `scroll`                     |
| `fade-in`, `appear`, `enter`            | `reveal`                     |

---

## Worked examples

- **Gradient pill button that scales on hover** → `['gradient', 'hover', 'cta']`
- **Frosted glass card with a blurred glow** → `['glass', 'blur']`
- **Headline with a gradient clipped to the text** → `['gradient', 'typography']`
- **Hero with a scroll-driven parallax 3D scene (three.js)** → category `hero`, libraries `['three','r3f']`, tags `['3d', 'webgl', 'parallax', 'scroll']`
- **Drag-and-drop file upload with a spring drop animation** → `['upload', 'drag', 'spring']`
- **Button with a click sound and a ripple** → `['click', 'sound', 'ripple']`
- **Physics-based draggable cards** → `['physics', 'drag']`

---

## Extending the vocabulary

The vocabulary is a **living list**. When a genuinely new concept appears
(not a synonym of an existing tag), add it to the right group here in the same
PR — that's what keeps the harness from drifting. Prefer one well-chosen word
over three overlapping ones.

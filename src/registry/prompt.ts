import { CATEGORIES } from './categories'
import { libraryLabel } from './libraries'
import type { Showcase } from './types'
import { getUtility } from './utilities'

const categoryLabel = (id: string) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id

/**
 * Compose a **self-contained** prompt another coding agent can paste (without
 * this repo) to reproduce a showcase. Uses the showcase's own `prompt` if
 * provided; otherwise generates one from its metadata + `principle` (the "why")
 * + the CSS of any custom utilities it uses + the full `demo.tsx` source (the
 * ground-truth "what"). See docs/PROMPT-GUIDELINE.md.
 *
 * Why include the source and the utility CSS, not just the principle? The
 * `principle` is capped at ~80 words on one mechanism, so it deliberately omits
 * the exact sizes/colours/timings, the full layer structure, accessibility and
 * reduced-motion handling — everything needed to reproduce it *faithfully*
 * lives in the code. Custom `@utility` classes (e.g. `liquid-glass`) aren't
 * stock Tailwind, so a fresh project won't have them unless we ship their CSS.
 */
export function buildPrompt(showcase: Showcase): string {
  if (showcase.prompt) return showcase.prompt

  const libs = (showcase.libraries ?? []).map(libraryLabel)
  const lines: string[] = [
    `Recreate this UI component as a self-contained React + TypeScript component.`,
    ``,
    `Name: ${showcase.name}`,
    `Category: ${categoryLabel(showcase.category)}`,
  ]
  if (showcase.description) lines.push(`Description: ${showcase.description}`)
  if (libs.length) lines.push(`Libraries to use: ${libs.join(', ')}`)
  if (showcase.tags?.length) lines.push(`Tags: ${showcase.tags.join(', ')}`)

  lines.push(
    ``,
    `Requirements:`,
    `- Reproduce the visual result and every interaction/animation state. Match the concrete values in the reference code — sizes, colours, durations, easings, stagger delays — rather than approximating them.`,
    `- Preserve the accessibility and motion behaviour the reference has: ARIA roles, keyboard/focus handling, and any \`prefers-reduced-motion\` fallback. Keep it responsive and touch-friendly (no hover-only affordances).`,
    `- Use only the libraries listed above. Replace any local asset import (e.g. \`./background.webp\`) with your own equivalent, and keep everything in one self-contained, themeable file (light/dark via Tailwind tokens).`,
  )

  // The "why": the aha, already Markdown (prose + a fenced snippet).
  if (showcase.principle) {
    lines.push(``, `Key idea:`, ``, showcase.principle.trim())
  }

  // Custom utilities aren't stock Tailwind — ship their CSS so it's reproducible.
  const utils = (showcase.utilities ?? [])
    .map(getUtility)
    .filter((u): u is NonNullable<typeof u> => Boolean(u))
  if (utils.length) {
    lines.push(
      ``,
      `Custom Tailwind utilities it uses (add these to your project — they are not stock Tailwind):`,
    )
    for (const u of utils) {
      lines.push(``, `\`${u.name}\` — ${u.summary}`, '```css', u.css.trim(), '```')
    }
  }

  // The "what": the ground-truth implementation.
  if (showcase.source) {
    lines.push(
      ``,
      `Reference implementation (demo.tsx — the source of truth; match it):`,
      '```tsx',
      showcase.source.trim(),
      '```',
    )
  }

  return lines.join('\n')
}

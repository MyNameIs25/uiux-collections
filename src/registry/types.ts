import type { ComponentType } from 'react'
import type { CategoryId } from './categories'
import type { LibraryId } from './libraries'

/**
 * A single showcase entry in the collection. Authored in
 * `examples/<id>/showcase.ts` via `defineShowcase`; the registry auto-attaches
 * `source` from the sibling `demo.tsx` (see `registry.ts`).
 */
export interface Showcase {
  /** Unique, url-safe slug (e.g. "magnetic-button"); usually the folder name. */
  id: string
  /** Human-readable name shown in the gallery. */
  name: string
  /** Which category this belongs to (must exist in `categories.ts`). */
  category: CategoryId
  /** Short description of the effect / component. */
  description?: string
  /** Libraries the implementation relies on (drives the details-page badges). */
  libraries?: LibraryId[]
  /** Free-form tags to improve search. */
  tags?: string[]
  /** The component to render as a live preview. */
  Component: ComponentType
  /**
   * How to render the live preview. `'fit'` scales the whole component down to
   * fit the preview frame (like a website thumbnail) — use it for full-bleed
   * showcases such as heroes and backgrounds that are designed for a full
   * viewport. Omit for normal-sized components, which render at native size.
   */
  preview?: 'fit'
  /**
   * Hand-written "aha" of the effect: a short prose explanation followed by a
   * fenced key snippet (Markdown). Optional; shown in the "Principle" tab and
   * folded into the agent prompt. Follow docs/PRINCIPLE-GUIDELINE.md
   * (explanation ≤ 80 words, snippet ≤ ~20 lines, name the load-bearing
   * classes/APIs and say *why*).
   */
  principle?: string
  /**
   * Full source of the example's `demo.tsx`, auto-attached by the registry
   * from a Vite `?raw` import. Authors do NOT set this.
   */
  source?: string
  /**
   * Optional hand-written agent prompt. When omitted, one is generated from the
   * metadata + `principle` (falling back to `source`).
   */
  prompt?: string
}

/**
 * Identity helper for authoring a showcase with type-checking + autocomplete:
 *
 * ```ts
 * // examples/magnetic-button/showcase.ts
 * import { defineShowcase } from '../../types'
 * import { MagneticButton } from './demo'
 *
 * export default defineShowcase({
 *   id: 'magnetic-button',
 *   name: 'Magnetic Button',
 *   category: 'buttons',
 *   libraries: ['react', 'tailwind', 'gsap'],
 *   Component: MagneticButton,
 *   principle: `// the key bit...`,
 * })
 * ```
 */
export function defineShowcase(showcase: Showcase): Showcase {
  return showcase
}

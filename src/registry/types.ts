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
   * Hand-written key snippet — the essence of the implementation. Optional;
   * shown in the "Principle" tab and used to compose the agent prompt.
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

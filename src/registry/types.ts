import type { ComponentType } from 'react'
import type { CategoryId } from './categories'
import type { LibraryId } from './libraries'

/**
 * A single showcase entry in the collection. Each collected UI/UX component
 * describes itself with one of these and registers it in `registry.ts`.
 */
export interface Showcase {
  /** Unique, url-safe slug (e.g. "magnetic-button"). */
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
  /** Key implementation code, shown in the copyable code block on the details page. */
  code?: string
  /**
   * Optional hand-written agent prompt. When omitted, one is generated from the
   * metadata + `code` so it can be copied and handed to another agent.
   */
  prompt?: string
}

/**
 * Identity helper that gives you type-checking + autocomplete when authoring a
 * showcase next to its component:
 *
 * ```tsx
 * export const magneticButton = defineShowcase({
 *   id: 'magnetic-button',
 *   name: 'Magnetic Button',
 *   category: 'buttons',
 *   libraries: ['tailwind', 'gsap'],
 *   Component: MagneticButton,
 *   code: `...`,
 * })
 * ```
 */
export function defineShowcase(showcase: Showcase): Showcase {
  return showcase
}

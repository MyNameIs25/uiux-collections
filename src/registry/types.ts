import type { ComponentType } from 'react'
import type { CategoryId } from './categories'

/**
 * A single showcase entry in the collection. Each collected UI/UX component
 * describes itself with one of these and registers it in `registry.tsx`.
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
  /** Free-form tags to improve search. */
  tags?: string[]
  /** The component to render in the gallery. */
  Component: ComponentType
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
 *   Component: MagneticButton,
 * })
 * ```
 */
export function defineShowcase(showcase: Showcase): Showcase {
  return showcase
}

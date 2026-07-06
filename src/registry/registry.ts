import type { CategoryId } from './categories'
import type { Showcase } from './types'

// ── Register showcases here ──────────────────────────────────────────────────
// To add a component: create it (e.g. under `examples/` or your own folder),
// export a `defineShowcase({...})` from it, then import + list it below.
import { gradientButton } from './examples/gradient-button'
import { glassCard } from './examples/glass-card'
import { gradientText } from './examples/gradient-text'

export const registry: Showcase[] = [
  gradientButton,
  glassCard,
  gradientText,
]
// ─────────────────────────────────────────────────────────────────────────────

/** Number of showcases per category id (for badges/counts in the sidebar). */
export const countsByCategory: Record<CategoryId, number> = registry.reduce(
  (acc, s) => {
    acc[s.category] = (acc[s.category] ?? 0) + 1
    return acc
  },
  {} as Record<CategoryId, number>,
)

/** Look up a single showcase by its id. */
export function getShowcase(id: string): Showcase | undefined {
  return registry.find((s) => s.id === id)
}

/** Filter the registry by category and a free-text query (name/tags/description). */
export function filterShowcases(
  category: CategoryId | 'all',
  query = '',
): Showcase[] {
  const q = query.trim().toLowerCase()
  return registry.filter((s) => {
    if (category !== 'all' && s.category !== category) return false
    if (!q) return true
    const haystack = [s.name, s.description ?? '', ...(s.tags ?? [])]
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}

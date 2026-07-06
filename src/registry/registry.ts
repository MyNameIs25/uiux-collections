import { ALL_CATEGORY, type CategoryFilter, type CategoryId } from './categories'
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

/**
 * Filter the registry by category, a free-text query, and a set of tags.
 * Semantics: category (single) AND tags (union — matches any) AND query (text).
 */
export function filterShowcases(
  category: CategoryFilter,
  query = '',
  tags: string[] = [],
): Showcase[] {
  const q = query.trim().toLowerCase()
  const tagSet = new Set(tags)
  return registry.filter((s) => {
    if (category !== ALL_CATEGORY && s.category !== category) return false
    if (tagSet.size && !(s.tags ?? []).some((t) => tagSet.has(t))) return false
    if (!q) return true
    const haystack = [s.name, s.description ?? '', ...(s.tags ?? [])]
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}

/**
 * Tags present within a category (or all), with how many showcases carry each.
 * Counts depend only on the category scope, so they stay stable as tags are
 * toggled. Sorted by count desc, then alphabetically.
 */
export function getTagCounts(
  category: CategoryFilter,
): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const s of registry) {
    if (category !== ALL_CATEGORY && s.category !== category) continue
    for (const tag of s.tags ?? []) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

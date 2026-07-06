import { ALL_CATEGORY, type CategoryFilter, type CategoryId } from './categories'
import type { Showcase } from './types'

// ── Auto-discovered showcases ────────────────────────────────────────────────
// Adding a component = drop a folder under `examples/<id>/` with:
//   demo.tsx      the component (rendered live AND shown as full source)
//   showcase.ts   `export default defineShowcase({ ...metadata, Component })`
// No edits here: the glob picks it up and attaches `source` from demo.tsx?raw.
const showcaseModules = import.meta.glob<Showcase>('./examples/*/showcase.ts', {
  eager: true,
  import: 'default',
})
const demoSources = import.meta.glob<string>('./examples/*/demo.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const folderOf = (path: string) => path.replace('./examples/', '').split('/')[0]

const sourceByFolder = new Map<string, string>()
for (const [path, src] of Object.entries(demoSources)) {
  sourceByFolder.set(folderOf(path), src)
}

export const registry: Showcase[] = Object.entries(showcaseModules)
  .map(([path, showcase]) => ({
    ...showcase,
    source: sourceByFolder.get(folderOf(path)),
  }))
  .sort((a, b) => a.name.localeCompare(b.name))
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
 * Semantics: category (single) AND tags (intersection — must have all selected)
 * AND query (text). Selecting more tags narrows the results.
 */
export function filterShowcases(
  category: CategoryFilter,
  query = '',
  tags: string[] = [],
): Showcase[] {
  const q = query.trim().toLowerCase()
  return registry.filter((s) => {
    if (category !== ALL_CATEGORY && s.category !== category) return false
    if (tags.length) {
      const showcaseTags = new Set(s.tags ?? [])
      if (!tags.every((t) => showcaseTags.has(t))) return false
    }
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

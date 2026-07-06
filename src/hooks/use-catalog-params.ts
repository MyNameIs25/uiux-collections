import { useUrlParam } from './use-url-param'
import { ALL_CATEGORY, isCategoryFilter, type CategoryFilter } from '@/registry'

/**
 * The catalog's URL-driven state (no router):
 * - `?category=` single category filter
 * - `?tags=a,b`  multi-tag filter (intersection / must have all)
 * - `?q=`        free-text search
 *
 * Any of these clears the open component (`?component=`) so filtering returns
 * to the gallery. Switching category also clears tags, since tags are scoped
 * to the category shown in the tag bar.
 */
export function useCatalogParams() {
  const [rawCategory, setRawCategory] = useUrlParam('category', ALL_CATEGORY)
  const [rawTags, setRawTags] = useUrlParam('tags', '')
  const [query, setQueryParam] = useUrlParam('q', '')
  const [, setComponent] = useUrlParam('component', '')

  const category: CategoryFilter = isCategoryFilter(rawCategory)
    ? rawCategory
    : ALL_CATEGORY
  const tags = rawTags ? rawTags.split(',').filter(Boolean) : []

  const setTags = (next: string[]) => {
    setComponent('')
    setRawTags(next.join(','))
  }

  return {
    category,
    setCategory: (next: CategoryFilter) => {
      setComponent('')
      setRawTags('')
      setRawCategory(next)
    },
    tags,
    setTags,
    toggleTag: (tag: string) => {
      const set = new Set(tags)
      if (set.has(tag)) set.delete(tag)
      else set.add(tag)
      setTags([...set])
    },
    query,
    setQuery: (next: string) => {
      setComponent('')
      setQueryParam(next)
    },
  }
}

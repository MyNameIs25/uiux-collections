import { useUrlParam } from './use-url-param'
import { ALL_CATEGORY, isCategoryFilter, type CategoryFilter } from '@/registry'

/**
 * The catalog's URL-driven state: which category is selected (`?category=`)
 * and the search query (`?q=`). This is the single source of truth for the
 * gallery filter — no router required.
 *
 * Changing the category or query also clears the open component (`?component=`)
 * so filtering from the sidebar returns to the gallery.
 */
export function useCatalogParams() {
  const [rawCategory, setRawCategory] = useUrlParam('category', ALL_CATEGORY)
  const [query, setQueryParam] = useUrlParam('q', '')
  const [, setComponent] = useUrlParam('component', '')

  const category: CategoryFilter = isCategoryFilter(rawCategory)
    ? rawCategory
    : ALL_CATEGORY

  return {
    category,
    setCategory: (next: CategoryFilter) => {
      setComponent('')
      setRawCategory(next)
    },
    query,
    setQuery: (next: string) => {
      setComponent('')
      setQueryParam(next)
    },
  }
}

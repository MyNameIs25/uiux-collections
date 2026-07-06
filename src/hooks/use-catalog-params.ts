import { useUrlParam } from './use-url-param'
import { ALL_CATEGORY, isCategoryFilter, type CategoryFilter } from '@/registry'

/**
 * The catalog's URL-driven state: which category is selected (`?category=`)
 * and the search query (`?q=`). This is the single source of truth for the
 * gallery filter — no router required.
 */
export function useCatalogParams() {
  const [rawCategory, setRawCategory] = useUrlParam('category', ALL_CATEGORY)
  const [query, setQuery] = useUrlParam('q', '')

  const category: CategoryFilter = isCategoryFilter(rawCategory)
    ? rawCategory
    : ALL_CATEGORY

  return {
    category,
    setCategory: (next: CategoryFilter) => setRawCategory(next),
    query,
    setQuery,
  }
}

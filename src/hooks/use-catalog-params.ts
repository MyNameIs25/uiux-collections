import { useUrlParam } from './use-url-param'
import {
  ALL_CATEGORY,
  isCategoryFilter,
  isStatus,
  type CategoryFilter,
  type ShowcaseStatus,
  type SortOrder,
} from '@/registry'

/**
 * The catalog's URL-driven state (no router):
 * - `?category=` single category filter
 * - `?tags=a,b`  multi-tag filter (intersection / must have all)
 * - `?status=a,b` multi-status filter (union / any of)
 * - `?sort=`     creation-date order (`newest` default | `oldest`)
 * - `?q=`        free-text search
 *
 * Any of the filters clears the open component (`?component=`) so filtering
 * returns to the gallery. Switching category also clears tags (tags are scoped
 * to the category shown in the tag bar); status and sort are global and persist.
 */
export function useCatalogParams() {
  const [rawCategory, setRawCategory] = useUrlParam('category', ALL_CATEGORY)
  const [rawTags, setRawTags] = useUrlParam('tags', '')
  const [rawStatus, setRawStatus] = useUrlParam('status', '')
  const [rawSort, setRawSort] = useUrlParam('sort', 'newest')
  const [query, setQueryParam] = useUrlParam('q', '')
  const [, setComponent] = useUrlParam('component', '')

  const category: CategoryFilter = isCategoryFilter(rawCategory)
    ? rawCategory
    : ALL_CATEGORY
  const tags = rawTags ? rawTags.split(',').filter(Boolean) : []
  const statuses = rawStatus
    ? (rawStatus.split(',').filter(isStatus) as ShowcaseStatus[])
    : []
  const sort: SortOrder = rawSort === 'oldest' ? 'oldest' : 'newest'

  const setTags = (next: string[]) => {
    setComponent('')
    setRawTags(next.join(','))
  }
  const setStatuses = (next: ShowcaseStatus[]) => {
    setComponent('')
    setRawStatus(next.join(','))
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
    statuses,
    setStatuses,
    toggleStatus: (status: ShowcaseStatus) => {
      const set = new Set(statuses)
      if (set.has(status)) set.delete(status)
      else set.add(status)
      setStatuses([...set])
    },
    sort,
    setSort: (next: SortOrder) => setRawSort(next),
    query,
    setQuery: (next: string) => {
      setComponent('')
      setQueryParam(next)
    },
  }
}

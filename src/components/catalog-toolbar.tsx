import { ArrowDownUp } from 'lucide-react'
import { StatusDot } from '@/components/status-dot'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/select'
import { useCatalogParams } from '@/hooks/use-catalog-params'
import { getStatusCounts, STATUSES, type SortOrder } from '@/registry'
import { cn } from '@/lib/utils'

const SORT_LABELS: Record<SortOrder, string> = {
  newest: 'Newest first',
  oldest: 'Oldest first',
}

/**
 * Toolbar above the gallery: a status filter (multi-select chips, `?status=`)
 * on the left and a created-date sort (shadcn Select, `?sort=`) on the right.
 * Both are URL-backed via `useCatalogParams`.
 */
export function CatalogToolbar() {
  const { category, query, tags, statuses, toggleStatus, sort, setSort } =
    useCatalogParams()
  const counts = getStatusCounts(category, query, tags)
  const selected = new Set(statuses)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {STATUSES.map(({ id, label }) => {
          const active = selected.has(id)
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleStatus(id)}
              aria-pressed={active}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                active
                  ? 'border-transparent bg-primary text-primary-foreground'
                  : 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/70',
              )}
            >
              <StatusDot status={id} />
              <span>{label}</span>
              <span
                className={cn(
                  'text-xs tabular-nums',
                  active ? 'text-primary-foreground/70' : 'text-muted-foreground',
                )}
              >
                {counts[id]}
              </span>
            </button>
          )
        })}
      </div>

      <Select value={sort} onValueChange={(v) => setSort(v as SortOrder)}>
        <SelectTrigger size="sm" className="w-[150px]" aria-label="Sort by date">
          <ArrowDownUp className="size-4" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">{SORT_LABELS.newest}</SelectItem>
          <SelectItem value="oldest">{SORT_LABELS.oldest}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

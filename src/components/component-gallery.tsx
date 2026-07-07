import { ArrowRight, SearchX } from 'lucide-react'
import { Button } from '@/components/base/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/base/pagination'
import { LivePreview } from '@/components/live-preview'
import { StatusDot } from '@/components/status-dot'
import { useCatalogParams } from '@/hooks/use-catalog-params'
import { useUrlParam } from '@/hooks/use-url-param'
import { CATEGORIES, filterShowcases, sortByCreated } from '@/registry'

const categoryLabel = (id: string) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id

/** Cards per gallery page. One-liner to tune. */
const PAGE_SIZE = 12

/**
 * Page numbers to render, with `'…'` markers for elided gaps. Small counts show
 * every page; large ones collapse to `1 … c-1 c c+1 … n` around the current page.
 */
function pageList(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const nums = [
    1,
    total,
    current,
    current - 1,
    current + 1,
  ].filter((p) => p >= 1 && p <= total)
  const sorted = [...new Set(nums)].sort((a, b) => a - b)
  const out: (number | '…')[] = []
  let prev = 0
  for (const p of sorted) {
    if (p - prev > 1) out.push('…')
    out.push(p)
    prev = p
  }
  return out
}

export function ComponentGallery() {
  const { category, query, tags, statuses, sort, page, setPage } =
    useCatalogParams()
  const [, setComponent] = useUrlParam('component', '')
  const results = sortByCreated(
    filterShowcases(category, query, tags, statuses),
    sort,
  )

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const current = Math.min(page, pageCount)
  const start = (current - 1) * PAGE_SIZE
  const pageItems = results.slice(start, start + PAGE_SIZE)

  // A real href (correct for middle-click / hover), intercepted on click so the
  // SPA updates the URL via pushState instead of doing a full navigation.
  const pageHref = (p: number) => {
    const params = new URLSearchParams(window.location.search)
    if (p <= 1) params.delete('page')
    else params.set('page', String(p))
    const qs = params.toString()
    return `${window.location.pathname}${qs ? `?${qs}` : ''}`
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
        <SearchX className="size-10 text-muted-foreground" />
        <div>
          <p className="font-medium">No components here yet</p>
          <p className="text-sm text-muted-foreground">
            {query
              ? `Nothing matches “${query}”.`
              : tags.length
                ? 'No components match the selected tags.'
                : 'Register one in src/registry/registry.ts to see it appear.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {pageItems.map(({ id, name, description, category: cat, status, Component, preview }) => (
        <article
          key={id}
          className="group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-colors hover:border-ring/60"
        >
          {/* Top-right arrow opens the details page; the preview stays interactive.
              Visible by default on touch; hover-revealed on mouse devices. */}
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setComponent(id)}
            aria-label={`View details for ${name}`}
            title="View details"
            className="absolute top-3 right-3 z-10 size-8 text-muted-foreground shadow-sm transition-all duration-300 ease-out hover:scale-110 hover:text-foreground focus-visible:translate-y-0 focus-visible:scale-110 focus-visible:text-foreground focus-visible:opacity-100 can-hover:-translate-y-1 can-hover:opacity-0 can-hover:group-hover:translate-y-0 can-hover:group-hover:opacity-100"
          >
            <ArrowRight className="size-4" />
          </Button>
          <LivePreview variant="card" fit={preview === 'fit'} Component={Component} />
          <div className="border-t p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="flex min-w-0 items-center gap-1.5 font-medium">
                <StatusDot status={status} />
                <span className="truncate">{name}</span>
              </h3>
              <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                {categoryLabel(cat)}
              </span>
            </div>
            {/* Reserve two lines so every card's footer is the same height. */}
            <p className="mt-1 line-clamp-2 min-h-10 text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </article>
      ))}
      </div>

      {pageCount > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={pageHref(current - 1)}
                aria-disabled={current === 1}
                className={
                  current === 1 ? 'pointer-events-none opacity-50' : undefined
                }
                onClick={(e) => {
                  e.preventDefault()
                  if (current > 1) setPage(current - 1)
                }}
              />
            </PaginationItem>
            {pageList(current, pageCount).map((p, i) =>
              p === '…' ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    href={pageHref(p)}
                    isActive={p === current}
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(p)
                    }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext
                href={pageHref(current + 1)}
                aria-disabled={current === pageCount}
                className={
                  current === pageCount
                    ? 'pointer-events-none opacity-50'
                    : undefined
                }
                onClick={(e) => {
                  e.preventDefault()
                  if (current < pageCount) setPage(current + 1)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

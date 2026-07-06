import { SearchX } from 'lucide-react'
import { useCatalogParams } from '@/hooks/use-catalog-params'
import { useUrlParam } from '@/hooks/use-url-param'
import { CATEGORIES, filterShowcases } from '@/registry'

const categoryLabel = (id: string) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id

export function ComponentGallery() {
  const { category, query, tags } = useCatalogParams()
  const [, setComponent] = useUrlParam('component', '')
  const results = filterShowcases(category, query, tags)

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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {results.map(({ id, name, description, category: cat, Component }) => (
        <article
          key={id}
          role="button"
          tabIndex={0}
          onClick={() => setComponent(id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setComponent(id)
            }
          }}
          aria-label={`View details for ${name}`}
          className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-colors hover:border-ring/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <div className="flex min-h-40 flex-1 items-center justify-center bg-muted/40 p-6">
            {/* Preview is display-only in the grid; it's interactive on the details page. */}
            <div className="pointer-events-none select-none">
              <Component />
            </div>
          </div>
          <div className="border-t p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-medium">{name}</h3>
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
  )
}

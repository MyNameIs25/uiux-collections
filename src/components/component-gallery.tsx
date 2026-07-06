import { Maximize2, SearchX } from 'lucide-react'
import { Button } from '@/components/base/button'
import { LivePreview } from '@/components/live-preview'
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
      {results.map(({ id, name, description, category: cat, Component, preview }) => (
        <article
          key={id}
          className="group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-colors hover:border-ring/60"
        >
          {/* Top-right button opens the details page; the preview stays interactive. */}
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setComponent(id)}
            aria-label={`View details for ${name}`}
            title="View details"
            className="absolute top-3 right-3 z-10 size-8 -translate-y-1 text-muted-foreground opacity-0 shadow-sm transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110 hover:text-foreground focus-visible:translate-y-0 focus-visible:scale-110 focus-visible:text-foreground focus-visible:opacity-100"
          >
            <Maximize2 className="size-4" />
          </Button>
          <LivePreview variant="card" fit={preview === 'fit'} Component={Component} />
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

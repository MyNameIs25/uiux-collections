import { SearchX } from 'lucide-react'
import { useCatalogParams } from '@/hooks/use-catalog-params'
import { CATEGORIES, filterShowcases } from '@/registry'

const categoryLabel = (id: string) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id

export function ComponentGallery() {
  const { category, query } = useCatalogParams()
  const results = filterShowcases(category, query)

  if (results.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
        <SearchX className="size-10 text-muted-foreground" />
        <div>
          <p className="font-medium">No components here yet</p>
          <p className="text-sm text-muted-foreground">
            {query
              ? `Nothing matches “${query}”.`
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
          className="flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm"
        >
          <div className="flex min-h-40 flex-1 items-center justify-center bg-muted/40 p-6">
            <Component />
          </div>
          <div className="border-t p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-medium">{name}</h3>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                {categoryLabel(cat)}
              </span>
            </div>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}

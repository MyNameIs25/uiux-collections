import { useState } from 'react'
import { MoreHorizontal, X } from 'lucide-react'
import { TagPill } from '@/components/tag-pill'
import { useCatalogParams } from '@/hooks/use-catalog-params'
import { getTagCounts } from '@/registry'

const VISIBLE_LIMIT = 12

/**
 * Tags for the currently selected category, shown below the header. Each pill
 * toggles the tag in `?tags=` (union search). Collapses past VISIBLE_LIMIT
 * behind a `…` expander.
 */
export function TagFilterBar() {
  const { category, tags, toggleTag, setTags } = useCatalogParams()
  const [expanded, setExpanded] = useState(false)

  const allTags = getTagCounts(category)
  if (allTags.length === 0) return null

  const selected = new Set(tags)
  const overLimit = allTags.length > VISIBLE_LIMIT
  const visible = expanded || !overLimit ? allTags : allTags.slice(0, VISIBLE_LIMIT)
  const hiddenCount = allTags.length - VISIBLE_LIMIT

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visible.map(({ tag, count }) => (
        <TagPill
          key={tag}
          tag={tag}
          count={count}
          active={selected.has(tag)}
          onClick={() => toggleTag(tag)}
        />
      ))}

      {overLimit && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          aria-expanded={expanded}
        >
          {expanded ? (
            'Show less'
          ) : (
            <>
              <MoreHorizontal className="size-4" />
              <span className="text-xs">+{hiddenCount}</span>
            </>
          )}
        </button>
      )}

      {tags.length > 0 && (
        <button
          type="button"
          onClick={() => setTags([])}
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-3.5" />
          Clear
        </button>
      )}
    </div>
  )
}

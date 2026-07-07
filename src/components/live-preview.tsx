import { useEffect, useState, type ComponentType } from 'react'
import { createPortal } from 'react-dom'
import { Expand, X } from 'lucide-react'
import { Button } from '@/components/base/button'
import { ScaledPreview } from '@/components/scaled-preview'
import { cn } from '@/lib/utils'

/** Cap for the details-page preview so libraries/tags stay in view. */
const DETAILS_MAX_HEIGHT = 560

/**
 * The live-preview frame shown on gallery cards and the details page.
 *
 * - `card`: fixed-height window. Full-bleed (`fit`) components are cropped to
 *   their vertical middle so the card stays a consistent size.
 * - `details`: `fit` components are scaled to fit the width, capped at
 *   `DETAILS_MAX_HEIGHT`; everything else renders at native size.
 *
 * A hover-revealed button (same reveal/scale animation as the card's details
 * button) expands the component into a full-viewport overlay where it renders at
 * native size — ideal for seeing a hero. Esc or the close button dismisses it;
 * when collapsed it never blocks hovering the live component.
 */
export function LivePreview({
  Component,
  fit = false,
  variant,
}: {
  Component: ComponentType
  fit?: boolean
  variant: 'card' | 'details'
}) {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!expanded) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [expanded])

  const stageClass =
    variant === 'card'
      ? fit
        ? 'h-40 overflow-hidden bg-muted/40'
        : // Fixed-height window (not min-height) so a component with its own tall
          // backdrop is cropped to its middle instead of stretching the card.
          'flex h-40 items-center justify-center overflow-hidden bg-muted/40 p-6'
      : fit
        ? 'overflow-hidden rounded-xl border bg-muted/30'
        : 'flex min-h-64 items-center justify-center rounded-xl border bg-muted/30 p-8'

  let content
  if (variant === 'card' && fit) {
    // Fixed-height crop: show the vertical middle (headline / CTAs) of the hero.
    content = (
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
        <Component />
      </div>
    )
  } else if (variant === 'details' && fit) {
    content = (
      <ScaledPreview maxHeight={DETAILS_MAX_HEIGHT}>
        <Component />
      </ScaledPreview>
    )
  } else {
    content = <Component />
  }

  // Reveal on hover of the card (article `group`) or the details stage itself.
  const reveal =
    variant === 'card'
      ? 'can-hover:-translate-y-1 can-hover:opacity-0 can-hover:group-hover:translate-y-0 can-hover:group-hover:opacity-100'
      : 'can-hover:-translate-y-1 can-hover:opacity-0 can-hover:group-hover/stage:translate-y-0 can-hover:group-hover/stage:opacity-100'

  return (
    <div className={cn('group/stage relative', stageClass)}>
      {content}
      <Button
        variant="secondary"
        size="icon"
        onClick={() => setExpanded(true)}
        aria-label="Expand to fullscreen"
        title="Fullscreen"
        className={cn(
          'absolute top-3 z-10 size-8 text-muted-foreground shadow-sm transition-all duration-300 ease-out hover:scale-110 hover:text-foreground focus-visible:translate-y-0 focus-visible:scale-110 focus-visible:text-foreground focus-visible:opacity-100',
          variant === 'card' ? 'left-3' : 'right-3',
          reveal,
        )}
      >
        <Expand className="size-4" />
      </Button>

      {expanded &&
        createPortal(
          <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setExpanded(false)}
              aria-label="Exit fullscreen"
              title="Close (Esc)"
              className="absolute top-4 right-4 z-10 size-9 shadow-sm"
            >
              <X className="size-4" />
            </Button>
            <div className="flex-1 overflow-auto">
              {fit ? (
                <div className="min-h-full w-full [&>*]:min-h-screen [&>*]:w-full">
                  <Component />
                </div>
              ) : (
                <div className="grid min-h-full w-full place-items-center p-8">
                  <Component />
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}

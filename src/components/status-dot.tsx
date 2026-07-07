import { statusLabel, type ShowcaseStatus } from '@/registry'
import { cn } from '@/lib/utils'

/** Colour cue per lifecycle status. */
const STATUS_COLOR: Record<ShowcaseStatus, string> = {
  done: 'bg-emerald-500',
  'in-progress': 'bg-amber-500',
  archived: 'bg-muted-foreground/50',
}

/** A small coloured dot standing in for a showcase's status, with a tooltip. */
export function StatusDot({
  status,
  className,
}: {
  status: ShowcaseStatus
  className?: string
}) {
  const label = statusLabel(status)
  return (
    <span
      className={cn(
        'inline-block size-2 shrink-0 rounded-full',
        STATUS_COLOR[status],
        className,
      )}
      title={label}
      aria-label={label}
    />
  )
}

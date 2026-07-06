import { cn } from '@/lib/utils'

type TagPillProps = {
  tag: string
  count?: number
  active?: boolean
  onClick?: () => void
}

/** A clickable tag chip (no leading `#`), with an optional trailing count. */
export function TagPill({ tag, count, active = false, onClick }: TagPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        active
          ? 'border-transparent bg-primary text-primary-foreground'
          : 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/70',
      )}
    >
      <span>{tag}</span>
      {count != null && (
        <span
          className={cn(
            'text-xs tabular-nums',
            active ? 'text-primary-foreground/70' : 'text-muted-foreground',
          )}
        >
          {count}
        </span>
      )}
    </button>
  )
}

import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/base/button'
import { cn } from '@/lib/utils'

type CopyButtonProps = {
  value: string
  label?: string
  /** Render just the icon (label becomes the tooltip / accessible name). */
  iconOnly?: boolean
  className?: string
}

export function CopyButton({
  value,
  label = 'Copy',
  iconOnly = false,
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(t)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      // Clipboard API can be blocked (e.g. non-secure context); fail quietly.
      setCopied(false)
    }
  }

  const icon = copied ? (
    <Check className="size-3.5" />
  ) : (
    <Copy className="size-3.5" />
  )

  return (
    <Button
      variant="secondary"
      size={iconOnly ? 'icon' : 'sm'}
      onClick={copy}
      className={cn(!iconOnly && 'gap-1.5', className)}
      aria-label={copied ? 'Copied' : label}
      title={copied ? 'Copied' : label}
    >
      {icon}
      {!iconOnly && (copied ? 'Copied' : label)}
    </Button>
  )
}

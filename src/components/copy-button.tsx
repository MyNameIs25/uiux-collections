import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/base/button'
import { cn } from '@/lib/utils'

type CopyButtonProps = {
  value: string
  label?: string
  className?: string
}

export function CopyButton({ value, label = 'Copy', className }: CopyButtonProps) {
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

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={copy}
      className={cn('gap-1.5', className)}
      aria-label={copied ? 'Copied' : label}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? 'Copied' : label}
    </Button>
  )
}

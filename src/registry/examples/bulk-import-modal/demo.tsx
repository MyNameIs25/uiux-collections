import { useEffect, useRef, useState } from 'react'
import { Download, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// Brand palette lifted from the design (deep petrol-green + cool greys).
const GREEN = '#1E4A44' // solid buttons (Browse / Import)
const DASH = '#0F6B5C' // dashed dropzone border + drag-active accent

export function BulkImportModal() {
  const [open, setOpen] = useState(true)
  // `mounted` keeps the overlay in the DOM through its *exit* transition;
  // `shown` is the transition target that the enter/leave classes animate to.
  const [mounted, setMounted] = useState(true)
  const [shown, setShown] = useState(true)
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Drive the enter/leave transitions off `open`. On open, mount then flip
  // `shown` on the next frame so the browser tweens from the hidden start
  // state. On close, flip `shown` off and unmount only after it finishes.
  useEffect(() => {
    if (open) {
      setMounted(true)
      const id = requestAnimationFrame(() => setShown(true))
      return () => cancelAnimationFrame(id)
    }
    setShown(false)
  }, [open])

  // Esc closes, matching the backdrop / Cancel / × affordances.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="relative flex min-h-[600px] w-full items-center justify-center overflow-hidden bg-[#d6f6ec] p-8">
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition-[background-color,transform] hover:brightness-110 active:scale-95"
          style={{ backgroundColor: GREEN }}
        >
          Bulk Import
        </button>
      )}

      {mounted && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Bulk Import"
        >
          {/* Backdrop: quick fade, its own (shorter) transition. */}
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className={cn(
              'absolute inset-0 bg-black/45 transition-opacity duration-[180ms] ease-out motion-reduce:transition-none',
              shown ? 'opacity-100' : 'opacity-0',
            )}
          />

          {/* Panel: springy easeOutExpo pop — scale + lift + fade together. */}
          <div
            onTransitionEnd={() => {
              if (!shown) setMounted(false)
            }}
            className={cn(
              'relative w-[452px] max-w-full rounded-[20px] bg-white p-8 shadow-[0_24px_70px_rgba(15,42,55,0.28)]',
              'transition-[opacity,transform] duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
              shown ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-[0.96] opacity-0',
            )}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute right-6 top-6 grid size-7 place-items-center rounded-full text-[#64748b] transition-colors hover:bg-[#f1f5f4] hover:text-[#1f2a37]"
            >
              <X className="size-[18px]" strokeWidth={2} />
            </button>

            <h2 className="text-[20px] font-bold text-[#1f2a37]">Bulk Import</h2>
            <p className="mt-1 text-[14px] font-medium text-[#5b7c99]">
              Upload file to import information to your infobase.
            </p>

            {/* Dropzone: 2px dashed brand border; brightens on dragover. */}
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                const f = e.dataTransfer.files?.[0]
                if (f) setFileName(f.name)
              }}
              className={cn(
                'mt-6 flex flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-11 text-center transition-colors duration-150',
                dragging ? 'bg-[#ecfdf5]' : 'bg-[#fafbfb]',
              )}
              style={{ borderColor: dragging ? GREEN : DASH }}
            >
              <p className="text-[15px] font-semibold text-[#1f2937]">
                {fileName ? fileName : 'Drag CSV file to import'}
              </p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold text-white transition-[filter,transform] hover:brightness-110 active:scale-95"
                style={{ backgroundColor: GREEN }}
              >
                <Download className="size-[15px]" strokeWidth={2.2} />
                Browse Files
              </button>
              <input
                ref={inputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) setFileName(f.name)
                }}
              />
              <p className="mt-4 text-[12px] text-[#94a3b8]">
                Max file size: 100MB. Supported file types: .csv, .xlsx, .xls
              </p>
            </div>

            {/* OR divider: label centered between two hairlines. */}
            <div className="my-5 flex items-center gap-4">
              <span className="h-px flex-1 bg-[#e5e7eb]" />
              <span className="text-[12px] font-medium text-[#6b7280]">OR</span>
              <span className="h-px flex-1 bg-[#e5e7eb]" />
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#2f6e63]">
              Upload from URL
            </p>
            {/* URL row: one rounded field wrapping a bare input + inset button. */}
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-[#f0f3f2] p-1.5">
              <input
                type="url"
                placeholder="Add URL"
                className="min-w-0 flex-1 bg-transparent px-2.5 text-[14px] text-[#1f2937] placeholder:text-[#94a3b8] focus:outline-none"
              />
              <button
                type="button"
                className="rounded-md bg-white px-4 py-2 text-[14px] font-semibold text-[#1f2937] shadow-sm transition-colors hover:bg-[#f8fafa]"
              >
                Upload
              </button>
            </div>

            {/* Footer: Support link left, Cancel / Import right. */}
            <div className="mt-7 flex items-center justify-between">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#5b7c99] transition-colors hover:text-[#1f2a37]"
              >
                <Info className="size-4" strokeWidth={2} />
                Support
              </button>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-[#d1d5db] px-4 py-2 text-[14px] font-semibold text-[#1f2937] transition-colors hover:bg-[#f8fafa]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-5 py-2 text-[14px] font-semibold text-white transition-[filter,transform] hover:brightness-110 active:scale-95"
                  style={{ backgroundColor: GREEN }}
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

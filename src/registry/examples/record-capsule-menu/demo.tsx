import { useEffect, useRef, useState } from 'react'
import { RotateCcw, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Phase = 'idle' | 'menu' | 'starting' | 'recording'

const PAD = 6 // container inset — also the highlight's float gap
const ROW_H = 52
const OPEN_W = 224
const STARTING_MS = 2000 // simulated "system is starting the recording" delay

// The whole "liquid container" trick: every phase maps to CONCRETE
// width/height/radius values (rows × ROW_H + padding), so plain CSS
// transitions can morph capsule → card → panel. No layout-animation library.
const SHAPE: Record<Phase, { w: number; h: number; r: number }> = {
  idle: { w: 64, h: 104, r: 32 },
  menu: { w: OPEN_W, h: PAD * 2 + ROW_H * 2, r: 28 },
  starting: { w: OPEN_W, h: PAD * 2 + ROW_H * 2, r: 28 },
  recording: { w: OPEN_W, h: PAD * 2 + ROW_H * 4, r: 28 },
}

const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

/** 5×5 dot-grid glyph (the iOS screen-record symbol). `round` drops the four
 *  corners so the grid reads as a circle. Colour comes from the parent's
 *  `text-*` via `bg-current`, so state tints transition for free. */
function DotGrid({ round }: { round?: boolean }) {
  return (
    <span aria-hidden className="grid grid-cols-5 gap-[2.5px]">
      {Array.from({ length: 25 }, (_, i) => {
        const r = Math.floor(i / 5)
        const c = i % 5
        const corner = (r === 0 || r === 4) && (c === 0 || c === 4)
        return (
          <span
            key={i}
            className={cn(
              'size-[3px] rounded-full bg-current transition-colors duration-200',
              round && corner && 'opacity-0',
            )}
          />
        )
      })}
    </span>
  )
}

export function RecordCapsuleMenu() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [hover, setHover] = useState(0)
  const [secs, setSecs] = useState(0)
  const startTimeout = useRef(0)
  const ticker = useRef(0)

  useEffect(
    () => () => {
      clearTimeout(startTimeout.current)
      clearInterval(ticker.current)
    },
    [],
  )

  const open = () => {
    if (phase !== 'idle') return
    setHover(0)
    setPhase('menu')
  }
  const record = () => {
    if (phase !== 'menu') return
    setPhase('starting')
    startTimeout.current = window.setTimeout(() => {
      setPhase('recording')
      setSecs(1)
      ticker.current = window.setInterval(() => setSecs((s) => s + 1), 1000)
    }, STARTING_MS)
  }
  const restart = () => {
    clearInterval(ticker.current)
    setSecs(1)
    ticker.current = window.setInterval(() => setSecs((s) => s + 1), 1000)
  }
  const remove = () => {
    clearTimeout(startTimeout.current)
    clearInterval(ticker.current)
    setSecs(0)
    setPhase('idle')
  }

  const { w, h, r } = SHAPE[phase]
  const expanded = phase !== 'idle'
  const row0Label = phase === 'recording' ? fmt(secs) : phase === 'starting' ? 'Starting...' : 'Record'

  const rows: {
    key: string
    icon: React.ReactNode
    label: string
    /** Remount key for the label — row 0 keys by PHASE so the wipe plays on
     *  Record → Starting... → timer, but not on every timer tick. */
    labelKey?: string
    labelClass?: string
    onClick?: () => void
  }[] = [
    {
      key: 'record',
      icon: (
        <span
          className={cn(
            'transition-colors duration-200',
            phase === 'starting' ? 'text-white/40' : 'text-[#ff453a]',
          )}
        >
          <DotGrid round />
        </span>
      ),
      label: row0Label,
      labelKey: phase,
      labelClass:
        phase === 'starting' ? 'text-white/45' : phase === 'recording' ? 'tabular-nums' : undefined,
      onClick: record,
    },
    {
      key: 'screenshot',
      icon: (
        <span className="text-white/90">
          <DotGrid />
        </span>
      ),
      label: 'Screenshot',
    },
    ...(phase === 'recording'
      ? [
          {
            key: 'restart',
            icon: <RotateCcw className="size-5 text-white/90" strokeWidth={2.2} />,
            label: 'Restart',
            onClick: restart,
          },
          {
            key: 'delete',
            icon: <Trash2 className="size-5 text-white/90" strokeWidth={2} />,
            label: 'Delete',
            onClick: remove,
          },
        ]
      : []),
  ]

  return (
    // Pastel "wallpaper" stage so the dark glass panel reads like the iOS
    // control it mimics.
    <div className="flex min-h-[22rem] w-full items-center justify-center bg-gradient-to-br from-[#dfe9f5] via-[#ece5f3] to-[#f3e9e3] p-10">
      <div
        onMouseEnter={open}
        onMouseLeave={() => phase === 'menu' && setPhase('idle')}
        style={{ width: w, height: h, borderRadius: r }}
        className="relative overflow-hidden bg-[#2b2b2e]/95 shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-[width,height,border-radius] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
      >
        {/* Idle capsule: the two glyphs stacked; tap also opens (touch path). */}
        <button
          type="button"
          aria-label="Open recording menu"
          aria-expanded={expanded}
          onClick={open}
          className={cn(
            'absolute inset-0 flex flex-col items-center justify-center gap-4 transition-opacity duration-200',
            expanded && 'pointer-events-none opacity-0',
          )}
        >
          <span className="text-[#ff453a]">
            <DotGrid round />
          </span>
          <span className="text-white/90">
            <DotGrid />
          </span>
        </button>

        {/* Expanded rows. One absolute highlight block glides between rows —
            the iOS list treatment — instead of per-row hover backgrounds. */}
        <div
          className={cn(
            'absolute inset-x-0 top-0 transition-opacity duration-200',
            !expanded && 'pointer-events-none opacity-0',
          )}
          style={{ padding: PAD }}
        >
          <span
            aria-hidden
            className="absolute h-[52px] rounded-[22px] bg-white/10 transition-transform duration-200 ease-out motion-reduce:transition-none"
            style={{
              insetInline: PAD,
              top: PAD,
              transform: `translateY(${hover * ROW_H}px)`,
            }}
          />
          {rows.map((row, i) => (
            <button
              key={row.key}
              type="button"
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onClick={row.onClick}
              className="relative flex h-[52px] w-full items-center gap-3.5 px-3.5 text-left"
            >
              <span className="grid w-7 shrink-0 place-items-center">{row.icon}</span>
              {/* Re-mounting on label change replays the wipe — the liquid
                  Record → Starting... → 00:01 swap. */}
              <span
                key={row.labelKey ?? row.label}
                className={cn(
                  'text-[15px] font-semibold text-white motion-safe:animate-tooltip-wipe-in',
                  row.labelClass,
                )}
              >
                {row.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

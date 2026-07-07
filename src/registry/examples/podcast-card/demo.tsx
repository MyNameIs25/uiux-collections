import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import {
  Bookmark,
  Code2,
  Link2,
  Maximize2,
  MoreVertical,
  Pause,
  Play,
  Share2,
  Star,
  Volume2,
} from 'lucide-react'

const DURATION = 1095 // 18:15, in seconds
const BAR_COUNT = 52
const RATES = [1, 1.25, 1.5, 2] as const
const PLAYED = '#a25f37' // dark amber — waveform behind the playhead
const UNPLAYED = '#363636' // deep grey — waveform ahead of it

// A fixed, natural-looking amplitude profile (no real audio to decode).
const AMPS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const n = Math.sin(i * 0.7) * 0.5 + Math.sin(i * 1.9 + 1) * 0.3 + Math.sin(i * 0.35 + 2) * 0.2
  return 0.26 + 0.74 * Math.abs(n)
})

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))
const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`

/** Small partial-fill star row (4.6 → four full + one 60%). */
function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="relative inline-block">
          <Star className="size-3.5 text-[#3a3a3a]" fill="currentColor" strokeWidth={0} />
          <span
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${clamp(value - i, 0, 1) * 100}%` }}
          >
            <Star className="size-3.5 text-[#fa6640]" fill="currentColor" strokeWidth={0} />
          </span>
        </span>
      ))}
    </div>
  )
}

export function PodcastCard() {
  const [time, setTime] = useState(312) // 05:12
  const [playing, setPlaying] = useState(false)
  const [rate, setRate] = useState<number>(1)
  const [volume, setVolume] = useState(0.7)
  const waveRef = useRef<HTMLDivElement>(null)
  const volRef = useRef<HTMLDivElement>(null)

  // Simulated transport: advance `time` per frame instead of a real <audio>.
  useEffect(() => {
    if (!playing) return
    let last = 0
    let id = 0
    const tick = (ts: number) => {
      if (last) setTime((t) => Math.min(DURATION, t + ((ts - last) / 1000) * rate))
      last = ts
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [playing, rate])

  useEffect(() => {
    if (time >= DURATION && playing) setPlaying(false)
  }, [time, playing])

  const progress = time / DURATION

  const toggle = () => {
    if (time >= DURATION) setTime(0)
    setPlaying((p) => !p)
  }

  // Drag/click anywhere on the waveform to scrub; on the volume bar to set level.
  const scrub = (ref: React.RefObject<HTMLDivElement | null>, set: (r: number) => void) => (
    e: ReactPointerEvent,
  ) => {
    e.preventDefault()
    const move = (clientX: number) => {
      const rect = ref.current?.getBoundingClientRect()
      if (rect) set(clamp((clientX - rect.left) / rect.width, 0, 1))
    }
    move(e.clientX)
    const onMove = (ev: PointerEvent) => move(ev.clientX)
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp, { once: true })
  }
  const onWaveDown = scrub(waveRef, (r) => setTime(r * DURATION))
  const onVolDown = scrub(volRef, setVolume)

  const arrowSeek = (e: ReactKeyboardEvent, step: number, apply: (d: number) => void) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      apply(-step)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      apply(step)
    }
  }

  return (
    <div className="flex min-h-[26rem] w-full items-center justify-center bg-[#050505] p-8">
      <div className="w-[420px] max-w-full overflow-hidden rounded-[22px] shadow-[0_24px_70px_rgba(0,0,0,0.6)] ring-1 ring-white/[0.06]">
        {/* Header */}
        <header className="flex items-center justify-between bg-[#101010] px-5 py-3.5">
          <span className="text-[15px] font-medium text-white">Podcast</span>
          <button
            type="button"
            aria-label="Expand"
            className="text-[#9d9d9d] transition-colors hover:text-white"
          >
            <Maximize2 className="size-4" strokeWidth={1.75} />
          </button>
        </header>

        {/* Content */}
        <div className="border-t border-white/[0.07] bg-[#171717] px-5 pt-4 pb-5">
          <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.08em] text-[#9c9c9c]">
            <span>PLANET MONEY</span>
            <span>12/31/2025</span>
          </div>

          <h3 className="mt-2 text-[26px] leading-tight font-bold tracking-tight text-white">
            Indicators of the Year
          </h3>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
            <div className="flex items-center gap-1.5">
              <Stars value={4.6} />
              <span className="text-[13px] text-white">
                4.6 <span className="text-[#9d9d9d]">(30K)</span>
              </span>
            </div>
            <span className="font-mono text-[11px] tracking-[0.08em] text-[#9d9d9d]">
              / BUSINESS / UPDATED DAILY
            </span>
            <button
              type="button"
              className="ml-auto rounded-full border border-[#555] px-4 py-1 text-[12px] text-[#c4c4c4] transition-colors hover:border-white/40 hover:text-white"
            >
              FOLLOW
            </button>
          </div>

          {/* Transport: play button + waveform */}
          <div className="mt-5 flex items-center gap-4">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? 'Pause' : 'Play'}
              aria-pressed={playing}
              className="grid h-11 w-16 shrink-0 place-items-center rounded-full border border-[#555] bg-[#171717] text-[#fc5d1c] transition hover:border-[#7a7a7a] active:scale-95"
            >
              {playing ? (
                <Pause className="size-5" fill="currentColor" strokeWidth={0} />
              ) : (
                <Play className="size-5 translate-x-px" fill="currentColor" strokeWidth={0} />
              )}
            </button>

            <div
              ref={waveRef}
              onPointerDown={onWaveDown}
              onKeyDown={(e) =>
                arrowSeek(e, 5, (d) => setTime((t) => clamp(t + d, 0, DURATION)))
              }
              role="slider"
              tabIndex={0}
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={DURATION}
              aria-valuenow={Math.round(time)}
              className="relative flex h-[46px] flex-1 cursor-pointer touch-none items-center justify-between outline-none focus-visible:opacity-90"
            >
              {AMPS.map((a, i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-full transition-colors duration-200"
                  style={{
                    height: `${a * 100}%`,
                    backgroundColor: (i + 0.5) / BAR_COUNT <= progress ? PLAYED : UNPLAYED,
                  }}
                />
              ))}
              {/* Playhead — positioned every frame, no CSS tween (no stepping). */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-[-2px] w-[2.5px] -translate-x-1/2 rounded-full bg-[#ff672e]"
                style={{ left: `${progress * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between font-mono text-[11px] tracking-[0.06em] text-[#9d9d9d]">
            <span>
              {fmt(time)} / {fmt(DURATION)}
            </span>
            <span>{Math.max(0, Math.round((DURATION - time) / 60))} MIN LEFT</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-t border-white/[0.07] bg-[#171717] px-4 py-3">
          <div className="flex items-center gap-4 text-[#959595]">
            {[MoreVertical, Bookmark, Share2, Link2, Code2].map((Icon, i) => (
              <button key={i} type="button" className="transition-colors hover:text-white">
                <Icon className="size-[18px]" strokeWidth={1.75} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setRate(RATES[(RATES.indexOf(rate as (typeof RATES)[number]) + 1) % RATES.length])}
              className="font-mono text-[12px] text-[#c2c2c2] transition-colors hover:text-white"
            >
              {rate}X
            </button>
            <div className="flex items-center gap-2 text-[#959595]">
              <Volume2 className="size-4" strokeWidth={1.75} />
              <div
                ref={volRef}
                onPointerDown={onVolDown}
                onKeyDown={(e) =>
                  arrowSeek(e, 0.05, (d) => setVolume((v) => clamp(v + d, 0, 1)))
                }
                role="slider"
                tabIndex={0}
                aria-label="Volume"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(volume * 100)}
                className="relative h-1 w-20 cursor-pointer touch-none rounded-full bg-[#4e4e4e] outline-none"
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-[#ff5e28]"
                  style={{ width: `${volume * 100}%` }}
                />
                <div
                  className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff5e28] shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
                  style={{ left: `${volume * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

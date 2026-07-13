import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

// ── Chart geometry (px == SVG user units, so the connector aligns exactly) ──
const BARS = 14
const BAR_W = 14
const BAR_GAP = 8
const CHART_W = BARS * BAR_W + (BARS - 1) * BAR_GAP // 300
const CHART_H = 140 // tallest bar
const TT_W = 210
const TT_H = 76
const TT_LEFT = (CHART_W - TT_W) / 2 // centred over the chart
const CONN_H = 42 // vertical room the connector curve travels
const CHART_TOP = TT_H + CONN_H // y where the bars begin
const SVG_H = CHART_TOP + CHART_H
const SX = TT_LEFT + TT_W / 2 // connector start = tooltip bottom-centre
const SY = TT_H

// 14 days of call volume; bar height ∝ calls, tooltip shows calls + change.
const SERIES = [
  { calls: 1180, pct: 6 },
  { calls: 1320, pct: 12 },
  { calls: 1090, pct: -5 },
  { calls: 1460, pct: 9 },
  { calls: 1240, pct: -3 },
  { calls: 1580, pct: 14 },
  { calls: 1410, pct: 7 },
  { calls: 1720, pct: 11 },
  { calls: 1350, pct: -8 },
  { calls: 1620, pct: 5 },
  { calls: 1490, pct: -2 },
  { calls: 1840, pct: 16 },
  { calls: 1560, pct: -6 },
  { calls: 1680, pct: 8 },
]
const LO = Math.min(...SERIES.map((s) => s.calls))
const HI = Math.max(...SERIES.map((s) => s.calls))
const barH = (calls: number) => 42 + ((calls - LO) / (HI - LO)) * (CHART_H - 42)
const cx = (i: number) => i * (BAR_W + BAR_GAP) + BAR_W / 2
const topY = (i: number) => CHART_TOP + (CHART_H - barH(SERIES[i].calls))
const pad2 = (n: number) => String(n).padStart(2, '0')

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

/** One odometer wheel: a 0–9 column translated by `-value·h`. A CSS transition on
 *  the transform rolls it to the new digit — the whole "flip counter" is this. */
function Digit({ value, h }: { value: number; h: number }) {
  return (
    <span className="block overflow-hidden" style={{ height: h }} aria-hidden>
      <span
        className="flex flex-col transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={{ transform: `translateY(${-value * h}px)` }}
      >
        {DIGITS.map((n) => (
          <span key={n} className="flex shrink-0 items-center justify-center" style={{ height: h }}>
            {n}
          </span>
        ))}
      </span>
    </span>
  )
}

/** Split a string into digit tokens (each rolls) and maximal non-digit runs
 *  (comma, sign, %, "Dec ") which stay static and keep their spaces. */
function tokenize(text: string) {
  const out: { digit: boolean; v: string }[] = []
  for (const ch of text) {
    const isDigit = ch >= '0' && ch <= '9'
    const last = out[out.length - 1]
    if (!isDigit && last && !last.digit) last.v += ch
    else out.push({ digit: isDigit, v: ch })
  }
  return out
}

/** Renders `text` as rolling digits (odometer); only characters that are digits get
 *  a wheel, so commas/sign/`%`/labels stay put. `boxed` wraps each digit in a dark
 *  cell for the hero counter; the tooltip uses the plain form. */
function Odometer({
  text,
  h,
  boxed = false,
  className,
}: {
  text: string
  h: number
  boxed?: boolean
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center [font-variant-numeric:tabular-nums]', className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-flex items-center">
        {tokenize(text).map((tok, i) =>
          !tok.digit ? (
            <span key={i} className="leading-none whitespace-pre">
              {tok.v}
            </span>
          ) : boxed ? (
            <span
              key={i}
              className="mx-[2px] grid place-items-center rounded-[8px] bg-[#2a2a2d] px-2.5"
              style={{ height: h + 14 }}
            >
              <Digit value={+tok.v} h={h} />
            </span>
          ) : (
            <span key={i} className="leading-none">
              <Digit value={+tok.v} h={h} />
            </span>
          ),
        )}
      </span>
    </span>
  )
}

export function OdometerCallsStat() {
  // Hero total that ticks upward on its own — a live feed, so discrete `setInterval`
  // steps (not a tween); each changed digit rolls via the CSS transition above.
  const [total, setTotal] = useState(12847)
  useEffect(() => {
    const id = setInterval(() => setTotal((t) => t + 1 + Math.floor(Math.random() * 3)), 650)
    return () => clearInterval(id)
  }, [])

  // Which bar is hovered (null = resting skeleton). `shown` persists the last bar so
  // the connector stays put while it fades out instead of snapping to a default.
  const [active, setActive] = useState<number | null>(null)
  const [shown, setShown] = useState(7)
  useEffect(() => {
    if (active != null) setShown(active)
  }, [active])

  // The tooltip only shows on hover; its content is driven by `shown` (which keeps
  // the last bar) so it fades out on the previous value instead of blanking.
  const visible = active != null
  const d = SERIES[shown]
  const dateText = `Dec ${pad2(shown + 1)}`
  const countText = d.calls.toLocaleString('en-US')
  const pctText = `${d.pct >= 0 ? '+' : '-'}${pad2(Math.abs(d.pct))}%`

  const ex = cx(shown)
  const ey = topY(shown) - 5
  const connectorD = `M ${SX} ${SY} C ${SX} ${SY + 32}, ${ex} ${ey - 30}, ${ex} ${ey}`

  return (
    <div className="flex min-h-[560px] w-full items-center justify-center bg-black px-3 py-12 font-sans sm:p-12">
      <div className="rounded-[18px] bg-[#151517] p-6" style={{ width: CHART_W + 48 }}>
        <h3 className="text-[15px] font-semibold text-[#f2f2f3]">Total Calls</h3>

        {/* Hero odometer — big, digits in dark cells, commas between them. */}
        <div className="mt-3">
          <Odometer
            text={total.toLocaleString('en-US')}
            h={44}
            boxed
            className="text-[38px] font-semibold text-[#d9d9dc]"
          />
        </div>

        <p className="mt-3 text-[12.5px] leading-relaxed text-[#9c9ca1]">
          Live inbound call volume across every line.
          <br />
          Updated continuously as new calls connect.
        </p>

        {/* Chart region: tooltip (top) · dashed connector · 14 bars (bottom). */}
        <div
          className="relative mt-6"
          style={{ width: CHART_W, height: SVG_H + 24 }}
          onMouseLeave={() => setActive(null)}
        >
          {/* Tooltip — hidden at rest, fades in on hover. Row layout: the day's
              call count on the left, the change % on the right. */}
          <div
            className={cn(
              'absolute flex flex-col justify-center rounded-[14px] border border-white/[0.12] bg-[#212124] px-4 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.7)] transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none',
              visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0',
            )}
            style={{ left: TT_LEFT, top: 0, width: TT_W, height: TT_H }}
          >
            <div className="text-[13px] font-medium text-[#b9b9bf]">
              <Odometer text={dateText} h={16} />
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="flex items-baseline gap-1 text-[16px] font-semibold text-[#f2f2f3]">
                <Odometer text={countText} h={20} />
                <span className="text-[11px] font-normal text-[#7c7c82]">calls</span>
              </span>
              <span className={cn('text-[15px] font-semibold', d.pct >= 0 ? 'text-[#34d399]' : 'text-[#f87171]')}>
                <Odometer text={pctText} h={18} />
              </span>
            </div>
          </div>

          {/* Faint dashed gridlines behind the bars. */}
          {[0.35, 0.7].map((f) => (
            <div
              key={f}
              className="absolute right-0 left-0 border-t border-dashed border-white/[0.06]"
              style={{ top: CHART_TOP + CHART_H * f }}
            />
          ))}

          {/* Connector: a dashed cubic curve whose `d` (and end dot cx/cy) CSS-transition
              as the hovered bar changes, so the pointer bends between bars. */}
          <svg
            className="pointer-events-none absolute inset-x-0 top-0 z-10 overflow-visible"
            width={CHART_W}
            height={SVG_H}
            viewBox={`0 0 ${CHART_W} ${SVG_H}`}
            fill="none"
            aria-hidden
          >
            <path
              d={connectorD}
              stroke="#c7c7ce"
              strokeWidth={1.5}
              strokeDasharray="3 4"
              strokeLinecap="round"
              className="transition-[d,opacity] duration-300 ease-out motion-reduce:transition-none"
              style={{ opacity: visible ? 0.55 : 0 }}
            />
            <circle
              cx={ex}
              cy={ey}
              r={2.6}
              fill="#e6e6e9"
              className="transition-[cx,cy,opacity] duration-300 ease-out motion-reduce:transition-none"
              style={{ opacity: visible ? 1 : 0 }}
            />
          </svg>

          {/* Bars — buttons so touch/keyboard can inspect a day too, not hover-only. */}
          <div className="absolute left-0" style={{ top: CHART_TOP, width: CHART_W, height: CHART_H }}>
            {SERIES.map((s, i) => (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-label={`Dec ${pad2(i + 1)}: ${s.calls} calls, ${s.pct >= 0 ? '+' : ''}${s.pct}%`}
                className="absolute bottom-0 rounded-t-[5px] bg-[#4b4b4e] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                style={{ left: i * (BAR_W + BAR_GAP), width: BAR_W, height: barH(s.calls) }}
              >
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-t-[5px] bg-gradient-to-b from-[#dfdfe4] to-[#c7c7ce] transition-opacity duration-200"
                  style={{ opacity: i === active ? 1 : 0 }}
                />
              </button>
            ))}
          </div>

          {/* Axis end labels. */}
          <div
            className="absolute inset-x-0 flex justify-between text-[11px] text-[#6b6b70]"
            style={{ top: SVG_H + 8 }}
          >
            <span>Dec 01</span>
            <span>Dec 15</span>
          </div>
        </div>
      </div>
    </div>
  )
}

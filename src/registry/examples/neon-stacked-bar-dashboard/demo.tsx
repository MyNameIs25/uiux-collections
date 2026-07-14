import { useEffect, useRef } from 'react'
import { Sparkle } from 'lucide-react'
import gsap from 'gsap'

// The chart's whole idea: every bar is the SAME total height. A bar doesn't
// encode its value by how *tall* it is — it encodes it by how much of the tube
// is lit. Colour segments hang from the top, the dead grey remainder fills to
// the baseline. So the bars are 100%-stacked and read like a rack of LED VU
// meters, not like a bar chart.
const BAR_W = 12 // tube width
const BAR_H = 380 // total tube height — identical for all 15 bars
const SEG_GAP = 3 // dark gap between segments, which is what makes them read as discrete capsules

// The five lit bands, top → bottom, plus the unlit remainder. `glow` scales the
// `--neon-glow` bloom: green is the headline band and is deliberately blown out
// (2.4×) so it hazes into the black card; the cooler bands only simmer, and the
// grey remainder emits nothing at all.
const BANDS = [
  { key: 'direct', label: 'Direct', color: '#66FF4D', glow: 2.4 },
  { key: 'affiliate', label: 'Affiliate', color: '#0AC5F0', glow: 1 },
  { key: 'social', label: 'Social', color: '#6D45BE', glow: 1 },
  { key: 'email', label: 'Email', color: '#DD0AF2', glow: 1 },
  { key: 'ads', label: 'Paid ads', color: '#EF3370', glow: 1 },
  { key: 'rest', label: 'Unattributed', color: '#3D464D', glow: 0 },
] as const

// Per-bar weights in BANDS order. They're raw shares of a fixed total, so each
// column just normalises to BAR_H — no scale/axis anywhere in the component.
const BARS: number[][] = [
  [39, 11, 12, 12, 10, 11],
  [17, 18, 17, 18, 11, 16],
  [13, 12, 12, 13, 10, 35],
  [35, 3, 3, 3, 11, 41],
  [34, 6, 4, 7, 9, 34],
  [35, 11, 11, 9, 9, 21],
  [46, 6, 7, 4, 12, 21],
  [12, 13, 12, 13, 12, 33],
  [46, 6, 6, 5, 12, 21],
  [27, 3, 3, 3, 11, 47],
  [16, 18, 17, 18, 10, 17],
  [6, 11, 12, 11, 10, 47],
  [16, 13, 14, 16, 10, 27],
  [23, 3, 3, 3, 11, 50],
  [58, 6, 7, 7, 11, 6],
]

const KPIS = [
  { label: 'Weekly', value: 2197, delta: '19.6%', prev: '$1,340', period: 'last week' },
  { label: 'Monthly', value: 8903, delta: '1.9%', prev: '$5,441', period: 'last month' },
  { label: 'Yearly', value: 98134, delta: '22%', prev: '$76,330', period: 'last year' },
]

const CITIES = [
  { city: 'Los Angeles', cells: ['$20.030', '$50.331', '$270.120'] },
  { city: 'New York', cells: ['$18.782', '$40.795', '$210.650'] },
  { city: 'Canada', cells: ['$14.221', '$30.123', '$200.080'] },
]

export function NeonStackedBarDashboard() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Respect reduced motion by simply not animating: the markup already renders
    // the finished chart, so there is no "final state" left to restore.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // Segments grow DOWNWARD from where they hang (`transformOrigin: top`),
      // so each tube fills like a meter rather than sprouting from the floor.
      // The stagger is a function of the element's own coordinates: bars ripple
      // left→right (col), and within a bar the bands light up top→bottom (seg).
      tl.from('[data-col]', {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 0.55,
        ease: 'power3.out',
        stagger: (_i, el: Element) => {
          const { col, seg } = (el as HTMLElement).dataset
          return Number(col) * 0.05 + Number(seg) * 0.045
        },
      })

      // Count-up: tween a plain proxy number and write it into the DOM on each
      // update. This is exactly the case GSAP exists for — a duration-based ramp
      // of a raw value — so there's no hand-rolled rAF/dt loop here.
      root.current?.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count)
        const proxy = { v: 0 }
        tl.to(
          proxy,
          {
            v: target,
            duration: 1.1,
            ease: 'expo.out',
            onUpdate: () => {
              el.textContent = `$${Math.round(proxy.v).toLocaleString('en-US')}`
            },
          },
          0,
        )
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={root}
      className="flex w-full items-center justify-center bg-[#0b0b0d] p-10 [font-family:-apple-system,'Segoe_UI',Inter,sans-serif]"
    >
      <div className="w-[960px] rounded-[28px] bg-black p-11 ring-1 ring-white/[0.06]">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h2 className="text-[26px] font-bold tracking-tight text-white">Sales Report</h2>
          <span
            className="grid size-10 place-items-center rounded-full bg-[#101512] ring-1 ring-white/[0.06]"
            aria-hidden
          >
            <Sparkle
              className="size-4 fill-[#66FF4D] text-[#66FF4D] drop-shadow-[0_0_8px_#66FF4D]"
              strokeWidth={1}
            />
          </span>
        </div>

        {/* Three KPIs. Note the figures are MONOSPACE, not a proportional sans —
            equal-width digits are what let the three columns line up and give the
            panel its instrument-readout feel. */}
        <dl className="mt-7 grid grid-cols-3 gap-x-8">
          {KPIS.map((k) => (
            <div key={k.label}>
              <dt className="text-[14px] font-semibold text-white/85">{k.label}</dt>
              <dd className="mt-1.5 flex items-baseline gap-2.5">
                <span
                  data-count={k.value}
                  className="font-jetbrains-mono text-[34px] leading-none font-bold tracking-tight text-white tabular-nums"
                >
                  ${k.value.toLocaleString('en-US')}
                </span>
                <span className="font-jetbrains-mono text-[13px] font-medium text-[#3DDC84]">
                  ↑{k.delta}
                </span>
              </dd>
              <p className="mt-2 text-[13px] text-white/40">
                Compared to <span className="font-jetbrains-mono">{k.prev}</span> {k.period}
              </p>
            </div>
          ))}
        </dl>

        {/* The meter rack. Each column owns its own hairline divider (border-l)
            plus its numeral, so the grid lines run the full height with no
            separate axis layer. */}
        <div className="mt-8 flex border-r border-white/[0.08]">
          {BARS.map((weights, col) => {
            const total = weights.reduce((a, b) => a + b, 0)
            return (
              <div
                key={col}
                className="group flex flex-1 flex-col items-center border-l border-white/[0.08] pt-1"
              >
                <div
                  className="flex flex-col transition-transform duration-200 ease-out group-hover:scale-x-125"
                  style={{ width: BAR_W, height: BAR_H, gap: SEG_GAP }}
                >
                  {weights.map((w, seg) => {
                    const band = BANDS[seg]
                    return (
                      <span
                        key={band.key}
                        // Coordinates the GSAP stagger reads back off the DOM.
                        data-col={col}
                        data-seg={seg}
                        // Every segment is its own capsule (`neon-tube` → radius
                        // 9999px), which is why the stack reads as a chain of
                        // pills rather than one bar with rounded ends.
                        className="neon-tube shrink-0"
                        style={
                          {
                            // The gaps are real space, so subtract each segment's
                            // share of them — otherwise the column overflows BAR_H.
                            height: `calc(${(w / total) * 100}% - ${
                              (SEG_GAP * (weights.length - 1)) / weights.length
                            }px)`,
                            '--neon': band.color,
                            '--neon-glow': band.glow,
                          } as React.CSSProperties
                        }
                      />
                    )
                  })}
                </div>
                <span className="font-jetbrains-mono mt-4 text-[12px] font-medium text-white/55">
                  {String(col + 1).padStart(2, '0')}
                </span>
              </div>
            )
          })}
        </div>

        {/* City table — monospace amounts, right-aligned, so decimal points stack. */}
        <table className="mt-9 w-full border-collapse">
          <tbody>
            {CITIES.map((row) => (
              <tr key={row.city} className="border-t border-white/[0.08]">
                <th
                  scope="row"
                  className="py-4 text-left text-[16px] font-normal text-white/65"
                >
                  {row.city}
                </th>
                {row.cells.map((cell) => (
                  <td
                    key={cell}
                    className="font-jetbrains-mono w-[190px] py-4 text-right text-[16px] font-medium text-white tabular-nums"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

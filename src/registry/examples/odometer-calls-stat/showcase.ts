import { defineShowcase } from '../../types'
import { OdometerCallsStat } from './demo'

export default defineShowcase({
  id: 'odometer-calls-stat',
  name: 'Odometer Calls Stat Card',
  category: 'data-display',
  created: '2026-07-13T22:20:00+09:00',
  status: 'done',
  preview: 'fit',
  description:
    'A dark analytics card whose headline number rolls like an airport odometer — each digit a wheel that spins to its new value — while a live feed nudges the total upward every beat. Hovering any bar in the 14-day chart fades in a tooltip that re-rolls to that day\'s call count (left) and change % (right), and a dashed SVG curve bends from the tooltip to the lit bar. At rest the tooltip and connector are hidden.',
  libraries: ['react', 'tailwind'],
  tags: ['counter', 'chart', 'tooltip', 'hover', 'auto', 'monochrome'],
  Component: OdometerCallsStat,
  principle: `Each digit is an odometer wheel: a fixed-height \`overflow-hidden\` window over a stacked 0–9 column that is \`translateY(-value·h)\`-ed to the target digit. A CSS \`transition\` on that \`transform\` rolls the wheel — no animation library. The reusable \`Odometer\` renders a *string*, so only characters that are digits get a wheel; commas, the sign and \`%\` render static, meaning just the digits that changed move. The same component powers the hero total and the tooltip. Secondary trick: the connector is one SVG \`<path>\` whose \`d\` (and end-dot \`cx/cy\`) are CSS-transitioned — \`transition-[d]\` interpolates the curve so it bends between bars.

\`\`\`tsx
<span className="block overflow-hidden" style={{ height: h }}>       {/* the window */}
  <span className="flex flex-col transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
    style={{ transform: \`translateY(\${-value * h}px)\` }}>        {/* roll to the digit */}
    {[0,1,2,3,4,5,6,7,8,9].map((n) => (
      <span style={{ height: h }} className="flex items-center justify-center">{n}</span>
    ))}
  </span>
</span>
\`\`\``,
})

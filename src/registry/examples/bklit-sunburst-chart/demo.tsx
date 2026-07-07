import { SunburstChart } from '@/components/charts/sunburst-chart'
import { SunburstSegment } from '@/components/charts/sunburst-segment'
import { SunburstCenter } from '@/components/charts/sunburst-center'
import { SunburstLabels } from '@/components/charts/sunburst-labels'
import { buildArcs } from '@/components/charts/sunburst'
import type { SunburstNode } from '@/components/charts/sunburst-data'

/** Hierarchical sunburst chart from Bklit UI (installed under src/components/charts). */
const data: SunburstNode = {
  name: 'Traffic',
  children: [
    {
      name: 'Search',
      children: [
        { name: 'Organic', value: 3200 },
        { name: 'Paid', value: 1400 },
      ],
    },
    {
      name: 'Social',
      children: [
        { name: 'X', value: 900 },
        { name: 'LinkedIn', value: 700 },
        { name: 'Reddit', value: 500 },
      ],
    },
    { name: 'Direct', value: 1800 },
    {
      name: 'Referral',
      children: [
        { name: 'Blogs', value: 600 },
        { name: 'Partners', value: 400 },
      ],
    },
  ],
}

export function SunburstChartDemo() {
  const { arcs } = buildArcs(data)

  return (
    <div className="flex w-full items-center justify-center bg-background p-4">
      <SunburstChart data={data} size={320}>
        {arcs.map((arc) => (
          <SunburstSegment key={arc.id} index={arc.arcIndex} />
        ))}
        <SunburstCenter />
        <SunburstLabels />
      </SunburstChart>
    </div>
  )
}

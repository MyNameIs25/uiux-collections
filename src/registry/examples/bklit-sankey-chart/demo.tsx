import {
  SankeyChart,
  type SankeyData,
  SankeyLink,
  SankeyNode,
  SankeyTooltip,
} from '@/components/charts/sankey'

/** Composable Sankey flow diagram from Bklit UI (installed under src/components/charts). */
const data: SankeyData = {
  nodes: [
    { name: 'Organic Search', category: 'source' },
    { name: 'Paid Ads', category: 'source' },
    { name: 'Direct', category: 'source' },
    { name: 'Homepage', category: 'landing' },
    { name: 'Pricing', category: 'landing' },
    { name: 'Signed Up', category: 'outcome' },
    { name: 'Bounced', category: 'outcome' },
  ],
  links: [
    { source: 0, target: 3, value: 120 },
    { source: 0, target: 4, value: 60 },
    { source: 1, target: 3, value: 80 },
    { source: 1, target: 4, value: 40 },
    { source: 2, target: 3, value: 50 },
    { source: 2, target: 4, value: 30 },
    { source: 3, target: 5, value: 140 },
    { source: 3, target: 6, value: 110 },
    { source: 4, target: 5, value: 90 },
    { source: 4, target: 6, value: 40 },
  ],
}

export function SankeyChartDemo() {
  return (
    <div className="flex w-full items-center justify-center bg-background p-4">
      <div className="aspect-[16/9] w-full max-w-[600px]">
        {/* Vertical labels only need room top/bottom, so shrink the wide default
            side margins (180px) — otherwise the flow is crammed into the centre. */}
        <SankeyChart data={data} margin={{ top: 48, right: 28, bottom: 48, left: 28 }}>
          <SankeyLink />
          <SankeyNode lineCap={4} labelOrientation="vertical" />
          <SankeyTooltip />
        </SankeyChart>
      </div>
    </div>
  )
}

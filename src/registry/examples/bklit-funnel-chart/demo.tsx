import { FunnelChart } from '@/components/charts/funnel-chart'

/** Self-contained funnel chart from Bklit UI (installed under src/components/charts). */
const data = [
  { label: 'Visitors', value: 12_400, displayValue: '12.4k' },
  { label: 'Leads', value: 6800, displayValue: '6.8k' },
  { label: 'Qualified', value: 3200, displayValue: '3.2k' },
  { label: 'Proposals', value: 1500, displayValue: '1.5k' },
  { label: 'Closed', value: 620, displayValue: '620' },
]

export function FunnelChartDemo() {
  return (
    <div className="flex w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-[560px]">
        <FunnelChart data={data} color="var(--chart-1)" layers={3} />
      </div>
    </div>
  )
}

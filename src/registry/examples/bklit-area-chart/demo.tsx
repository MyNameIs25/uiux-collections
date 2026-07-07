import { AreaChart } from '@/components/charts/area-chart'
import { Area } from '@/components/charts/area'
import { Grid } from '@/components/charts/grid'
import { Legend, LegendItem, LegendLabel, LegendMarker } from '@/components/charts/legend'
import { XAxis } from '@/components/charts/x-axis'
import { ChartTooltip } from '@/components/charts/tooltip'

/** Composable area chart from Bklit UI (installed under src/components/charts). */
const data = [
  { date: new Date('2025-01-01'), revenue: 12000, costs: 8500 },
  { date: new Date('2025-01-02'), revenue: 13500, costs: 9200 },
  { date: new Date('2025-01-03'), revenue: 11200, costs: 8100 },
  { date: new Date('2025-01-04'), revenue: 16400, costs: 10300 },
  { date: new Date('2025-01-05'), revenue: 15100, costs: 9800 },
  { date: new Date('2025-01-06'), revenue: 18700, costs: 11200 },
]

const series = [
  { label: 'Revenue', value: 18700, color: 'var(--chart-line-primary)' },
  { label: 'Costs', value: 11200, color: 'var(--chart-line-secondary)' },
]

export function AreaChartDemo() {
  return (
    <div className="flex w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-[520px]">
        <Legend items={series} className="mb-3 flex flex-row flex-wrap gap-x-4 gap-y-1">
          <LegendItem className="flex items-center gap-1.5">
            <LegendMarker />
            <LegendLabel className="text-xs text-[var(--chart-foreground-muted)]" />
          </LegendItem>
        </Legend>
        <div className="aspect-[2/1] w-full">
          <AreaChart data={data}>
            <Grid horizontal />
            <Area dataKey="revenue" fill="var(--chart-line-primary)" />
            <Area dataKey="costs" fill="var(--chart-line-secondary)" />
            <XAxis />
            <ChartTooltip />
          </AreaChart>
        </div>
      </div>
    </div>
  )
}

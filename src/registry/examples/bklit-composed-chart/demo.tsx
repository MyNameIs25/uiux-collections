import { Area } from '@/components/charts/area'
import { ComposedChart } from '@/components/charts/composed-chart'
import { Grid } from '@/components/charts/grid'
import { Legend, LegendItem, LegendLabel, LegendMarker } from '@/components/charts/legend'
import { Line } from '@/components/charts/line'
import { SeriesBar } from '@/components/charts/series-bar'
import { ChartTooltip } from '@/components/charts/tooltip'
import { XAxis } from '@/components/charts/x-axis'
import { curveCatmullRom } from '@visx/curve'

const smooth = curveCatmullRom.alpha(0.42)

const data = [
  { date: new Date('2025-01-01'), units: 320, revenue: 12_000, runRate: 9800 },
  { date: new Date('2025-02-01'), units: 410, revenue: 15_500, runRate: 11_200 },
  { date: new Date('2025-03-01'), units: 380, revenue: 13_200, runRate: 12_400 },
  { date: new Date('2025-04-01'), units: 520, revenue: 18_400, runRate: 14_100 },
  { date: new Date('2025-05-01'), units: 470, revenue: 16_900, runRate: 15_600 },
  { date: new Date('2025-06-01'), units: 610, revenue: 21_300, runRate: 17_200 },
]

const series = [
  { label: 'Units', value: 610, color: 'var(--chart-3)' },
  { label: 'Revenue', value: 21_300, color: 'var(--chart-1)' },
  { label: 'Run rate', value: 17_200, color: 'var(--chart-4)' },
]

export function ComposedChartDemo() {
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
          <ComposedChart data={data} maxBarSize={32} xDataKey="date">
            <Grid horizontal />
            <Area curve={smooth} dataKey="runRate" fill="var(--chart-4)" fillOpacity={0.32} />
            <SeriesBar dataKey="units" fill="var(--chart-3)" radius={4} />
            <Line curve={smooth} dataKey="revenue" stroke="var(--chart-1)" />
            <XAxis numTicks={6} />
            <ChartTooltip />
          </ComposedChart>
        </div>
      </div>
    </div>
  )
}

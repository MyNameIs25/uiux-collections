import { Bar } from '@/components/charts/bar'
import { BarChart } from '@/components/charts/bar-chart'
import { BarXAxis } from '@/components/charts/bar-x-axis'
import { Grid } from '@/components/charts/grid'
import { Legend, LegendItem, LegendLabel, LegendMarker } from '@/components/charts/legend'
import { ChartTooltip } from '@/components/charts/tooltip'

const data = [
  { month: 'Jan', revenue: 12_000, profit: 4500 },
  { month: 'Feb', revenue: 15_500, profit: 5200 },
  { month: 'Mar', revenue: 13_200, profit: 4100 },
  { month: 'Apr', revenue: 18_400, profit: 6800 },
  { month: 'May', revenue: 16_900, profit: 6100 },
  { month: 'Jun', revenue: 21_300, profit: 8200 },
]

const series = [
  { label: 'Revenue', value: 21_300, color: 'var(--chart-line-primary)' },
  { label: 'Profit', value: 8200, color: 'var(--chart-line-secondary)' },
]

export function BarChartDemo() {
  return (
    <div className="flex w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-[520px]">
        <Legend items={series} className="mb-3 flex flex-row gap-4">
          <LegendItem className="flex items-center gap-1.5">
            <LegendMarker />
            <LegendLabel className="text-xs text-[var(--chart-foreground-muted)]" />
          </LegendItem>
        </Legend>
        <div className="aspect-[2/1] w-full">
          <BarChart data={data} xDataKey="month">
            <Grid horizontal />
            <Bar dataKey="revenue" fill="var(--chart-line-primary)" lineCap="round" />
            <Bar dataKey="profit" fill="var(--chart-line-secondary)" lineCap="round" />
            <BarXAxis />
            <ChartTooltip />
          </BarChart>
        </div>
      </div>
    </div>
  )
}

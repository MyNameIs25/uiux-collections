import { LineChart } from '@/components/charts/line-chart'
import { Line } from '@/components/charts/line'
import { Grid } from '@/components/charts/grid'
import { XAxis } from '@/components/charts/x-axis'
import { ChartTooltip } from '@/components/charts/tooltip'

/** Composable line chart from Bklit UI (installed under src/components/charts). */
const data = [
  { date: new Date('2025-01-01'), users: 1200 },
  { date: new Date('2025-01-02'), users: 1350 },
  { date: new Date('2025-01-03'), users: 1180 },
  { date: new Date('2025-01-04'), users: 1620 },
  { date: new Date('2025-01-05'), users: 1490 },
  { date: new Date('2025-01-06'), users: 1875 },
]

export function LineChartDemo() {
  return (
    <div className="flex w-full items-center justify-center bg-background p-4">
      <div className="aspect-[2/1] w-full max-w-[520px]">
        <LineChart data={data}>
          <Grid horizontal />
          <Line dataKey="users" />
          <XAxis />
          <ChartTooltip />
        </LineChart>
      </div>
    </div>
  )
}

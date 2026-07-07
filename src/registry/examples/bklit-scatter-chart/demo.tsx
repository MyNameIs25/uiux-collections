import { Grid } from '@/components/charts/grid'
import { Scatter } from '@/components/charts/scatter'
import { ScatterChart } from '@/components/charts/scatter-chart'
import { ChartTooltip } from '@/components/charts/tooltip'
import { XAxis } from '@/components/charts/x-axis'

const data = [
  { date: new Date('2025-01-01'), users: 1200 },
  { date: new Date('2025-02-01'), users: 1350 },
  { date: new Date('2025-03-01'), users: 1100 },
  { date: new Date('2025-04-01'), users: 1680 },
  { date: new Date('2025-05-01'), users: 1520 },
  { date: new Date('2025-06-01'), users: 1900 },
]

export function ScatterChartDemo() {
  return (
    <div className="flex w-full items-center justify-center bg-background p-4">
      <div className="aspect-[2/1] w-full max-w-[520px]">
        <ScatterChart data={data} xDataKey="date">
          <Grid horizontal />
          <Scatter dataKey="users" yGradient />
          <XAxis />
          <ChartTooltip />
        </ScatterChart>
      </div>
    </div>
  )
}

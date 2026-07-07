import { Candlestick } from '@/components/charts/candlestick'
import { CandlestickChart } from '@/components/charts/candlestick-chart'
import { Grid } from '@/components/charts/grid'
import { ChartTooltip } from '@/components/charts/tooltip'
import { XAxis } from '@/components/charts/x-axis'

const data = [
  { date: new Date('2025-01-01'), open: 100, high: 108, low: 96, close: 104 },
  { date: new Date('2025-01-02'), open: 104, high: 112, low: 101, close: 109 },
  { date: new Date('2025-01-03'), open: 109, high: 111, low: 102, close: 103 },
  { date: new Date('2025-01-04'), open: 103, high: 107, low: 99, close: 106 },
  { date: new Date('2025-01-05'), open: 106, high: 118, low: 105, close: 116 },
  { date: new Date('2025-01-06'), open: 116, high: 119, low: 110, close: 112 },
]

export function CandlestickChartDemo() {
  return (
    <div className="flex w-full items-center justify-center bg-background p-4">
      <div className="aspect-[2/1] w-full max-w-[520px]">
        <CandlestickChart data={data} xDataKey="date">
          <Grid horizontal />
          <Candlestick fadedOpacity={0.25} />
          <XAxis />
          <ChartTooltip showDots={false} />
        </CandlestickChart>
      </div>
    </div>
  )
}

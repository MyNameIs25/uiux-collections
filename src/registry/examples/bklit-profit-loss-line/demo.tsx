import { LineChart } from '@/components/charts/line-chart'
import { Line } from '@/components/charts/line'
import { Grid } from '@/components/charts/grid'
import { XAxis } from '@/components/charts/x-axis'
import { ChartTooltip } from '@/components/charts/tooltip'
import {
  ProfitLossLine,
  profitLossColor,
  resolveProfitLossTooltipLabel,
} from '@/components/charts/profit-loss-line'
import { curveLinear } from '@visx/curve'

/** Sign-aware P&L line from Bklit UI — segments turn green above zero, red below. */
const data = [
  { date: new Date('2024-01-01'), pnl: 420 },
  { date: new Date('2024-01-02'), pnl: -180 },
  { date: new Date('2024-01-03'), pnl: -60 },
  { date: new Date('2024-01-04'), pnl: 310 },
  { date: new Date('2024-01-05'), pnl: 540 },
  { date: new Date('2024-01-06'), pnl: -220 },
]

export function ProfitLossLineDemo() {
  return (
    <div className="flex w-full items-center justify-center bg-background p-4">
      <div className="aspect-[2/1] w-full max-w-[520px]">
        <LineChart data={data}>
          <Grid highlightRowValues={[0]} horizontal />
          <Line
            curve={curveLinear}
            dataKey="pnl"
            fadeEdges={false}
            showHighlight={false}
            stroke="transparent"
            strokeWidth={0}
          />
          <ProfitLossLine dataKey="pnl" />
          <XAxis />
          <ChartTooltip
            indicatorColor={(point) => profitLossColor((point.pnl as number) ?? 0)}
            rows={(point) => {
              const value = (point.pnl as number) ?? 0
              return [
                {
                  color: profitLossColor(value),
                  label: resolveProfitLossTooltipLabel(''),
                  value,
                },
              ]
            }}
          />
        </LineChart>
      </div>
    </div>
  )
}

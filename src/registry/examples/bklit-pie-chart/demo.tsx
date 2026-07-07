import { PieChart } from '@/components/charts/pie-chart'
import { PieSlice } from '@/components/charts/pie-slice'
import { PieCenter } from '@/components/charts/pie-center'
import { Legend, LegendItem, LegendLabel, LegendMarker } from '@/components/charts/legend'

/** Composable pie / donut chart from Bklit UI (installed under src/components/charts). */
const data = [
  { label: 'Electronics', value: 4250 },
  { label: 'Clothing', value: 3120 },
  { label: 'Food', value: 2100 },
  { label: 'Home', value: 1580 },
  { label: 'Toys', value: 940 },
]

// PieSlice colours come from the palette by index (--chart-1 … --chart-5).
const series = data.map((item, index) => ({
  label: item.label,
  value: item.value,
  color: `var(--chart-${index + 1})`,
}))

export function PieChartDemo() {
  return (
    <div className="flex w-full items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-3">
        <PieChart data={data} size={300} innerRadius={78} padAngle={0.02} cornerRadius={4}>
          {data.map((item, index) => (
            <PieSlice key={item.label} index={index} />
          ))}
          <PieCenter defaultLabel="Total sales" prefix="$" />
        </PieChart>
        <Legend items={series} className="flex flex-row max-w-[320px] flex-wrap justify-center gap-x-4 gap-y-1">
          <LegendItem className="flex items-center gap-1.5">
            <LegendMarker />
            <LegendLabel className="text-xs text-[var(--chart-foreground-muted)]" />
          </LegendItem>
        </Legend>
      </div>
    </div>
  )
}

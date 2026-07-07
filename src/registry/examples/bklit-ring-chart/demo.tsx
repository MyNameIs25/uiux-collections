import { RingChart } from '@/components/charts/ring-chart'
import { Ring } from '@/components/charts/ring'
import { RingCenter } from '@/components/charts/ring-center'

/** Composable donut/ring chart from Bklit UI (installed under src/components/charts). */
const data = [
  { label: 'Organic', value: 4250, maxValue: 5000 },
  { label: 'Paid', value: 3120, maxValue: 5000 },
  { label: 'Email', value: 2100, maxValue: 5000 },
]

export function RingChartDemo() {
  return (
    <div className="flex w-full items-center justify-center bg-background p-4">
      <RingChart data={data} size={280}>
        {data.map((item, index) => (
          <Ring key={item.label} index={index} />
        ))}
        <RingCenter defaultLabel="Total sessions" />
      </RingChart>
    </div>
  )
}

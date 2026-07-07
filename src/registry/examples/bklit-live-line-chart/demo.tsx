import { useEffect, useState } from 'react'
import { LiveLineChart, type LiveLinePoint } from '@/components/charts/live-line-chart'
import { LiveLine } from '@/components/charts/live-line'
import { LiveXAxis } from '@/components/charts/live-x-axis'
import { LiveYAxis } from '@/components/charts/live-y-axis'
import { ChartTooltip } from '@/components/charts/tooltip'

/** Streaming live line from Bklit UI — scrolls in real time toward the newest value. */
const formatValue = (v: number) => `$${v.toFixed(2)}`

function seedPoints(): LiveLinePoint[] {
  const now = Date.now() / 1000
  return Array.from({ length: 30 }, (_, i) => ({
    time: now - (30 - i),
    value: 120 + Math.sin(i / 3) * 30 + Math.random() * 12,
  }))
}

export function LiveLineChartDemo() {
  const [data, setData] = useState<LiveLinePoint[]>(seedPoints)
  const [value, setValue] = useState(120)

  useEffect(() => {
    const id = setInterval(() => {
      const point: LiveLinePoint = {
        time: Date.now() / 1000,
        value: 100 + Math.random() * 80,
      }
      setData((prev) => [...prev.slice(-500), point])
      setValue(point.value)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-[520px]">
        <LiveLineChart data={data} value={value} window={30}>
          <LiveLine dataKey="value" stroke="var(--chart-line-primary)" formatValue={formatValue} />
          <ChartTooltip showDatePill={false} />
          <LiveXAxis />
          <LiveYAxis position="left" formatValue={formatValue} />
        </LiveLineChart>
      </div>
    </div>
  )
}

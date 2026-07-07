import { Gauge } from '@/components/charts/gauge'

/**
 * Composable notch gauge from Bklit UI (installed under src/components/charts).
 *
 * `value` is the fill level 0–100; `centerValue` is the raw metric shown in the
 * center and formatted via `formatOptions`. The arc gauge is responsive and
 * self-sizes to a square, so no inner sized box is needed.
 */
export function GaugeChartDemo() {
  return (
    <div className="flex w-full items-center justify-center bg-background p-4">
      <Gauge
        value={66}
        centerValue={428_000}
        spacing={25}
        inactiveFillOpacity={0.4}
        defaultLabel="ARR run rate"
        formatOptions={{
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }}
      />
    </div>
  )
}

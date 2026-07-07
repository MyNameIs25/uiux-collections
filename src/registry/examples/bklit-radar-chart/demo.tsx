import { RadarChart } from '@/components/charts/radar-chart'
import { RadarGrid } from '@/components/charts/radar-grid'
import { RadarAxis } from '@/components/charts/radar-axis'
import { RadarLabels } from '@/components/charts/radar-labels'
import { RadarArea } from '@/components/charts/radar-area'
import { Legend, LegendItem, LegendLabel, LegendMarker } from '@/components/charts/legend'

/** Composable radar chart from Bklit UI (installed under src/components/charts). */
const metrics = [
  { key: 'speed', label: 'Speed' },
  { key: 'power', label: 'Power' },
  { key: 'range', label: 'Range' },
  { key: 'control', label: 'Control' },
  { key: 'defense', label: 'Defense' },
  { key: 'stamina', label: 'Stamina' },
]

const data = [
  {
    label: 'Alpha',
    values: { speed: 85, power: 70, range: 60, control: 90, defense: 55, stamina: 75 },
  },
  {
    label: 'Bravo',
    values: { speed: 60, power: 95, range: 80, control: 55, defense: 88, stamina: 65 },
  },
]

// RadarArea colours come from the palette by index (--chart-1, --chart-2, …).
const series = [
  { label: 'Alpha', value: 0, color: 'var(--chart-1)' },
  { label: 'Bravo', value: 0, color: 'var(--chart-2)' },
]

export function RadarChartDemo() {
  return (
    <div className="flex w-full items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-3">
        <RadarChart data={data} metrics={metrics} size={340}>
          <RadarGrid />
          <RadarAxis />
          <RadarLabels />
          {data.map((item, index) => (
            <RadarArea key={item.label} index={index} />
          ))}
        </RadarChart>
        <Legend items={series} className="flex flex-row flex-wrap justify-center gap-x-4 gap-y-1">
          <LegendItem className="flex items-center gap-1.5">
            <LegendMarker />
            <LegendLabel className="text-xs text-[var(--chart-foreground-muted)]" />
          </LegendItem>
        </Legend>
      </div>
    </div>
  )
}

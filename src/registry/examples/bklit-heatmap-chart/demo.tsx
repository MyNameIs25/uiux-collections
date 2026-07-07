import {
  type HeatmapColumn,
  HeatmapCells,
  HeatmapChart,
  HeatmapInteractionBoundary,
  HeatmapInteractionProvider,
  HeatmapLegend,
  HeatmapTooltip,
  HeatmapXAxis,
  HeatmapYAxis,
} from '@/components/charts/heatmap'

/** Composable contribution heatmap from Bklit UI (installed under src/components/charts). */
const WEEK_START = new Date(2026, 4, 3) // Sunday, 3 May 2026

// Activity levels 0–4, one array per week column, seven day bins per week.
const LEVELS: number[][] = [
  [0, 1, 2, 4, 3, 1, 0],
  [1, 2, 3, 2, 4, 2, 1],
  [2, 0, 1, 3, 2, 4, 3],
  [3, 4, 2, 1, 0, 2, 1],
  [1, 2, 4, 3, 2, 1, 0],
  [0, 1, 2, 2, 3, 4, 2],
  [2, 3, 1, 4, 2, 1, 3],
]

const data: HeatmapColumn[] = LEVELS.map((week, columnIndex) => ({
  bin: columnIndex,
  bins: week.map((count, rowIndex) => ({
    bin: rowIndex,
    count,
    date: new Date(
      WEEK_START.getFullYear(),
      WEEK_START.getMonth(),
      WEEK_START.getDate() + columnIndex * 7 + rowIndex
    ),
  })),
}))

export function HeatmapChartDemo() {
  return (
    <div className="flex w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-[520px]">
        <HeatmapInteractionProvider>
          <HeatmapInteractionBoundary>
            <HeatmapChart data={data} layout="fluid" binSize={26} gap={3}>
              <HeatmapCells />
              <HeatmapXAxis />
              <HeatmapYAxis />
              <HeatmapTooltip />
            </HeatmapChart>
            <HeatmapLegend />
          </HeatmapInteractionBoundary>
        </HeatmapInteractionProvider>
      </div>
    </div>
  )
}

import { defineShowcase } from '../../types'
import { RadarChartDemo } from './demo'

export default defineShowcase({
  id: 'bklit-radar-chart',
  name: 'Bklit Radar Chart',
  category: 'data-display',
  created: '2026-07-07T21:43:48+09:00',
  status: 'done',
  description:
    'A composable multi-axis radar chart from Bklit UI: concentric grid, per-metric axes, and one filled polygon per series that draws out from the centre on mount, with hover highlighting a single series.',
  libraries: ['react', 'bklit', 'visx', 'motion'],
  tags: ['chart', 'hover'],
  Component: RadarChartDemo,
  preview: 'fit',
})

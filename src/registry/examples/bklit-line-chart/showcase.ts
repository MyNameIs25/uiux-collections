import { defineShowcase } from '../../types'
import { LineChartDemo } from './demo'

export default defineShowcase({
  id: 'bklit-line-chart',
  name: 'Bklit Line Chart',
  category: 'data-display',
  created: '2026-07-07T21:43:48+09:00',
  status: 'done',
  description:
    'A composable time-series line chart from Bklit UI. The smooth curve draws itself in with a clip reveal on mount, and a shared crosshair tooltip snaps to each data point as the cursor moves.',
  libraries: ['react', 'bklit', 'visx', 'motion'],
  tags: ['chart', 'reveal'],
  Component: LineChartDemo,
  preview: 'fit',
})

import { defineShowcase } from '../../types'
import { AreaChartDemo } from './demo'

export default defineShowcase({
  id: 'bklit-area-chart',
  name: 'Bklit Area Chart',
  category: 'data-display',
  created: '2026-07-07',
  status: 'done',
  description:
    'A composable time-series area chart from Bklit UI. Gradient-filled series grow up from the baseline with a clip reveal on mount, and a shared crosshair tooltip tracks the cursor across every band.',
  libraries: ['react', 'bklit', 'visx', 'motion'],
  tags: ['chart', 'reveal'],
  Component: AreaChartDemo,
  preview: 'fit',
})

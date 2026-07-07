import { defineShowcase } from '../../types'
import { BarChartDemo } from './demo'

export default defineShowcase({
  id: 'bklit-bar-chart',
  name: 'Bklit Bar Chart',
  category: 'data-display',
  created: '2026-07-07',
  status: 'done',
  description:
    'A composable grouped bar chart from Bklit UI: each Bar series grows up from the baseline on mount with a staggered reveal, category labels fade around the crosshair on hover, and hovering one column dims the rest.',
  libraries: ['react', 'bklit', 'visx', 'motion'],
  tags: ['chart', 'reveal'],
  Component: BarChartDemo,
  preview: 'fit',
})

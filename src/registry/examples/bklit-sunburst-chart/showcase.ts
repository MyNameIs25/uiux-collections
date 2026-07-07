import { defineShowcase } from '../../types'
import { SunburstChartDemo } from './demo'

export default defineShowcase({
  id: 'bklit-sunburst-chart',
  name: 'Bklit Sunburst Chart',
  category: 'data-display',
  created: '2026-07-07',
  status: 'done',
  description:
    'A hierarchical sunburst from Bklit UI: nested rings map a category tree, segments sweep in on mount, and clicking a segment zooms to drill into its children while the centre acts as a zoom-out hub.',
  libraries: ['react', 'bklit', 'motion'],
  tags: ['chart', 'hover'],
  Component: SunburstChartDemo,
  preview: 'fit',
})

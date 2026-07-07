import { defineShowcase } from '../../types'
import { HeatmapChartDemo } from './demo'

export default defineShowcase({
  id: 'bklit-heatmap-chart',
  name: 'Bklit Heatmap Chart',
  category: 'data-display',
  created: '2026-07-07',
  status: 'done',
  description:
    'A composable GitHub-style contribution heatmap that lays out day bins in weekly columns and shades each cell by a five-step activity scale. Cells stagger in on reveal and surface a tooltip on hover.',
  libraries: ['react', 'bklit', 'visx', 'motion'],
  tags: ['chart', 'reveal'],
  Component: HeatmapChartDemo,
  preview: 'fit',
})

import { defineShowcase } from '../../types'
import { SankeyChartDemo } from './demo'

export default defineShowcase({
  id: 'bklit-sankey-chart',
  name: 'Bklit Sankey Chart',
  category: 'data-display',
  created: '2026-07-07',
  status: 'done',
  description:
    'A composable Sankey diagram that traces weighted flow from traffic sources through landing pages to outcomes. Links animate on reveal and dim on hover to isolate a single path.',
  libraries: ['react', 'bklit', 'visx', 'motion', 'd3'],
  tags: ['chart', 'hover'],
  Component: SankeyChartDemo,
  preview: 'fit',
})

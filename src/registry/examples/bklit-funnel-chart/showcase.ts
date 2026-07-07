import { defineShowcase } from '../../types'
import { FunnelChartDemo } from './demo'

export default defineShowcase({
  id: 'bklit-funnel-chart',
  name: 'Bklit Funnel Chart',
  category: 'data-display',
  created: '2026-07-07T21:43:48+09:00',
  status: 'done',
  description:
    'A self-contained conversion funnel from Bklit UI: each stage is a layered, curved segment that scales in on mount and shows its value, percentage of the top stage, and label, expanding on hover.',
  libraries: ['react', 'bklit', 'motion'],
  tags: ['chart', 'hover'],
  Component: FunnelChartDemo,
  preview: 'fit',
})

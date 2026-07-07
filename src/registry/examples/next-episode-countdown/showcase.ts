import { defineShowcase } from '../../types'
import { NextEpisodeCountdown } from './demo'

export default defineShowcase({
  id: 'next-episode-countdown',
  name: 'Next Episode Countdown',
  category: 'buttons',
  created: '2026-07-07',
  status: 'done',
  description:
    'The streaming "up next" prompt as two independent press-and-hold controls. Hold the dark Next Episode pill and its grey ring runs down until it vanishes; hold the light Skip pill and its grey ring charges full of black. Each owns its own charge, and releasing springs it back.',
  libraries: ['react', 'tailwind'],
  tags: ['hold', 'progress', 'pill'],
  Component: NextEpisodeCountdown,
  principle: `A \`useHoldCharge\` hook owns one \`charge\` value (0–1): a single \`requestAnimationFrame\` loop climbs it while a pointer is held and drains it when released, so the motion is continuous rather than a fixed CSS animation. Instantiating the hook twice gives each button its own charge. Both rings are an SVG \`<circle>\` (svg rotated \`-90deg\` to start at 12 o'clock) driven by \`stroke-dashoffset\` — the two run in opposite directions: Next Episode empties with \`C * charge\`, Skip fills with \`C * (1 - charge)\`. Pointer capture keeps the hold alive if the finger drifts off.

\`\`\`tsx
value.current += holding.current ? dt / CHARGE_MS : -dt / DRAIN_MS  // charge or drain
<circle strokeDasharray={C} strokeDashoffset={C * charge} />        // Next: full → empty
<circle strokeDasharray={C} strokeDashoffset={C * (1 - charge)} />  // Skip: empty → full
\`\`\``,
})

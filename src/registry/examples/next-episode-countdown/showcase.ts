import { defineShowcase } from '../../types'
import { NextEpisodeCountdown } from './demo'

export default defineShowcase({
  id: 'next-episode-countdown',
  name: 'Next Episode Countdown',
  category: 'buttons',
  created: '2026-07-07T22:23:10+09:00',
  status: 'done',
  description:
    'The streaming "up next" prompt as two independent press-and-hold controls. Hold the dark Next Episode pill and its grey ring runs down until it vanishes; hold the light Skip pill and its grey ring charges full of black. Each owns its own charge, and releasing springs it back.',
  libraries: ['react', 'tailwind', 'gsap'],
  tags: ['hold', 'progress', 'pill'],
  Component: NextEpisodeCountdown,
  principle: `A \`useHoldCharge\` hook owns one \`charge\` value (0–1) on a GSAP proxy: holding tweens it to 1, releasing tweens it to 0, and \`overwrite: true\` kills the opposing tween so a mid-hold release just retargets. Scaling \`duration\` by the remaining distance (with \`ease: 'none'\`) keeps the rate constant from any partial charge. Both rings are an SVG \`<circle>\` (rotated \`-90deg\`) driven by \`stroke-dashoffset\`, in opposite directions: Next empties with \`C * charge\`, Skip fills with \`C * (1 - charge)\`. Pointer capture keeps the hold alive off-button.

\`\`\`tsx
gsap.to(proxy, {
  v: end, ease: 'none', overwrite: true,        // release mid-charge just retargets
  duration: fullSecs * Math.abs(end - proxy.v), // constant rate from any start
  onUpdate: () => setCharge(proxy.v),
})
<circle strokeDasharray={C} strokeDashoffset={C * charge} />       // Next: full → empty
<circle strokeDasharray={C} strokeDashoffset={C * (1 - charge)} /> // Skip: empty → full
\`\`\``,
})

import { defineShowcase } from '../../types'
import { PodcastCard } from './demo'

export default defineShowcase({
  id: 'podcast-card',
  name: 'Podcast Player Card',
  category: 'cards',
  created: '2026-07-07T19:00:06+09:00',
  status: 'done',
  description:
    'A floating dark podcast player split into header / content / toolbar. A single orange accent threads through the play button, the played waveform, the playhead line and the volume fill; everything else is near-black and mono-labelled. Play to watch the playhead glide and the amber bars fill in; click or drag the waveform to scrub, drag the volume, cycle the speed.',
  libraries: ['react', 'tailwind'],
  tags: ['dark-mode', 'slider', 'drag', 'click'],
  Component: PodcastCard,
  principle: `There is no real \`<audio>\` — a \`requestAnimationFrame\` loop advances \`time\` by \`dt * rate\` each frame, and every visual reads \`progress = time / DURATION\`. The playhead line is placed with \`left: progress%\` *every frame* (not a CSS transition, so it never steps), while each bar flips colour the instant \`(i + 0.5)/N <= progress\`, eased by \`transition-colors\`. Pointer-x on the waveform maps back to \`time\` (scrub) and on the volume bar to the level — one \`scrub()\` helper drives both. The lone orange is the only saturated colour on the card.

\`\`\`tsx
const progress = time / DURATION
<div style={{ left: \`\${progress * 100}%\` }} />          // playhead, per frame
backgroundColor: (i + 0.5) / BAR_COUNT <= progress ? PLAYED : UNPLAYED
\`\`\``,
})

import { defineShowcase } from '../../types'
import { SetTimerCapsule } from './demo'

export default defineShowcase({
  id: 'set-timer-capsule',
  name: 'Set Timer Capsule',
  category: 'data-display',
  created: '2026-07-08T20:20:00+09:00',
  status: 'done',
  description:
    'An iOS-flavoured timer that morphs in place instead of switching screens. A dark "Set timer" pill expands into a vertical minute wheel with depth-of-field blur (drag to choose), then stretches into a running capsule — Pause · M:SS · Cancel — hugged by an orange progress ring that gets eaten as the seconds tick down. The whole idle → picker → running journey is one container reshaping itself, so it reads like a material stretching while its contents flow, not a modal popping open.',
  libraries: ['react', 'motion', 'tailwind'],
  tags: ['morph', 'drag', 'spring', 'countdown', 'progress'],
  Component: SetTimerCapsule,
  principle: `The three states are **one** \`motion.div\` with \`layout\`, not swapped panels. When its content changes (pill → wheel → countdown row), Motion measures the box before and after and tweens \`width\` / \`height\` / \`borderRadius\` between them, so the capsule stretches while the contents flow. \`AnimatePresence mode="popLayout"\` yanks the leaving content out of layout *instantly* so the box resizes to the entering one — that pairing is what sells the morph. (Ring = two mirrored \`motion.path\` halves, each drawn from the bottom-centre up via normalised \`pathLength\` 1→0, so the gap drains symmetrically from the top; picker blur = per-row \`useTransform\` of the shared drag offset.)

\`\`\`tsx
<motion.div layout style={{ borderRadius: 999 }} transition={{ layout: { ease: [0.32, 0.72, 0, 1] } }}>
  <AnimatePresence mode="popLayout" initial={false}>
    {phase === 'idle'    && <motion.button key="idle" exit={{ opacity: 0 }}>Set timer</motion.button>}
    {phase === 'picker'  && <motion.div key="picker" exit={{ opacity: 0 }}><MinutePicker /></motion.div>}
    {phase === 'running' && <motion.div key="running" className="w-max">…</motion.div>}
  </AnimatePresence>
</motion.div>
\`\`\``,
})

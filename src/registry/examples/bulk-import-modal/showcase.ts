import { defineShowcase } from '../../types'
import { BulkImportModal } from './demo'

export default defineShowcase({
  id: 'bulk-import-modal',
  name: 'Bulk Import Modal',
  category: 'modals',
  created: '2026-07-08T14:30:00+09:00',
  status: 'done',
  preview: 'fit',
  description:
    'A file-import dialog that springs in — the panel scales up, lifts, and fades on an easeOutExpo curve while the backdrop does a faster fade behind it, then reverses to close. A dashed dropzone brightens on drag-over and shows the dropped filename; an "OR" divider leads to a URL field. Deep petrol-green brand, clean white card. Closes on ×, Cancel, backdrop, or Esc.',
  libraries: ['react', 'tailwind'],
  tags: ['dialog', 'upload', 'drag', 'spring', 'click', 'minimal'],
  Component: BulkImportModal,
  principle: `The pop-in animates **without a library** by decoupling three booleans: \`open\` (intent), \`mounted\` (in the DOM), and \`shown\` (the transition target). Opening mounts the node, then flips \`shown\` on the next \`requestAnimationFrame\` so the browser tweens *from* the hidden start state (\`scale-[0.96] translate-y-2 opacity-0\`) — set both in the same paint and there's nothing to interpolate. Closing flips \`shown\` off and \`onTransitionEnd\` unmounts, so the exit animation actually runs. \`ease-[cubic-bezier(0.16,1,0.3,1)]\` is the easeOutExpo pop.

\`\`\`tsx
useEffect(() => {
  if (open) {
    setMounted(true)                                   // in DOM first
    const id = requestAnimationFrame(() => setShown(true)) // then animate in
    return () => cancelAnimationFrame(id)
  }
  setShown(false)                                      // animate out; unmount on transitionend
}, [open])

<div onTransitionEnd={() => { if (!shown) setMounted(false) }}
  className={cn('transition-[opacity,transform] duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
    shown ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-[0.96] opacity-0')} />
\`\`\``,
})

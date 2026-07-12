import { defineShowcase } from '../../types'
import { StatusOnlyCheckallDropdown } from './demo'

export default defineShowcase({
  id: 'status-only-checkall-dropdown',
  name: 'Status Only / Check-All Dropdown',
  category: 'forms',
  created: '2026-07-12T16:30:00+09:00',
  status: 'done',
  description:
    'A deployment-status multi-select where every row reveals a context-aware action on hover: "Only" to isolate to that one status, or — when it is already the sole checked row — "Check All" to restore the full set. The trigger carries a mini six-segment colour bar plus a live count, so the current selection is previewable without opening the panel. Both are pure derivations of one `Set`; no animation library, just short CSS transitions.',
  libraries: ['react', 'tailwind'],
  tags: ['dropdown', 'hover', 'click', 'minimal'],
  Component: StatusOnlyCheckallDropdown,
  principle: `The whole effect is *derivation*, not animation. One \`Set<Key>\` of selected statuses drives everything: the trigger's mini segment bar (each pill coloured iff its key is in the set) and the count, and — the "aha" — each row's hover action. The label is computed as \`selected.size === 1 && checked ? 'Check All' : 'Only'\`: if this row is the *sole* selection, offer restore-all (\`new Set(ALL)\`), otherwise isolate (\`new Set([key])\`). The action is hidden until hover with the \`can-hover:\` variant (\`can-hover:opacity-0 can-hover:group-hover:opacity-100\`) so touch devices — which never hover — always see it.

\`\`\`tsx
const soleSelection = selected.size === 1 && checked
<button onClick={() => setSelected(soleSelection ? new Set(ALL) : new Set([s.key]))}
  className="opacity-100 can-hover:opacity-0 can-hover:group-hover:opacity-100">
  {soleSelection ? 'Check All' : 'Only'}
</button>
\`\`\``,
})

import { defineShowcase } from '../../types'
import { TagsMultiselectPopover } from './demo'

export default defineShowcase({
  id: 'tags-multiselect-popover',
  name: 'Tags Multi-Select Popover',
  category: 'forms',
  created: '2026-07-13T18:40:00+09:00',
  status: 'done',
  description:
    'A Linear-style tag manager card: a multi-select list where each row reveals an edit pencil on hover and its near-black checkbox springs a tick in on select, a floating "N selected" badge that stacks the chosen tags\' colour dots, and a dark Apply button. The + and the pencil slide the card to a New/Edit form with a name field and a colour palette — the card smoothly morphs its height between the two views.',
  libraries: ['react', 'tailwind'],
  tags: ['popover', 'click', 'hover', 'spring', 'minimal'],
  utilities: ['animate-option-in'],
  Component: TagsMultiselectPopover,
  principle: `Two tricks, no animation library. **(1) View morph:** the list and the create/edit form are different heights, so the card can't just \`height: auto\`-transition. A \`useLayoutEffect\` measures the *natural* body height (\`body.offsetHeight\`) after each view change and writes it to the card, which \`transition-[height]\` tweens; the incoming view fades via the \`animate-option-in\` utility. **(2) Spring tick:** the checkbox is always rendered — checking only flips its \`scale-0 → scale-100\` on a back-easing \`cubic-bezier(0.34,1.56,0.64,1)\`, so the tick overshoots and settles. The hover pencil is pure CSS (\`can-hover:group-hover:opacity-100\`), visible on touch by default.

\`\`\`tsx
const [h, setH] = useState<number>()
useLayoutEffect(() => { if (body.current) setH(body.current.offsetHeight) }, [form])
<div style={{ height: h }} className="overflow-hidden transition-[height] duration-300">
  <div ref={body} className="p-2">{/* list | form */}</div>
</div>
<Check className={cn('transition-transform ease-[cubic-bezier(0.34,1.56,0.64,1)]',
  checked ? 'scale-100' : 'scale-0')} />
\`\`\``,
})

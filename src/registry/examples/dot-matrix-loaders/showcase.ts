import { defineShowcase } from '../../types'
import { DotMatrixLoaders } from './demo'

export default defineShowcase({
  id: 'dot-matrix-loaders',
  name: 'Dot-Matrix Loaders',
  category: 'feedback',
  created: '2026-07-07',
  status: 'done',
  description:
    'A stack of frosted-glass pills, each with a 3×3 dot matrix that lights up 1→9 in a reshuffled random order then hard-resets. The three run out of phase, reading like several background tasks working in parallel.',
  libraries: ['react', 'tailwind'],
  tags: ['glass', 'blur', 'loading', 'stagger'],
  Component: DotMatrixLoaders,
  preview: 'fit',
  principle: `Each matrix lights \`lit\` of its 9 dots, where \`lit\` climbs 1→9 on a \`setInterval\` then hard-resets — and on every reset a fresh Fisher–Yates \`shuffle()\` picks a new fill order, so it looks random but always grows. A dot is on when its rank in that order is \`< lit\`; toggling \`opacity\` (not \`display\`) inside a \`grid\` keeps the 3×3 from reflowing. Each matrix starts after a random delay, so the three never sync. The pill is a plain translucent \`bg\` + \`backdrop-blur\`.

\`\`\`tsx
const [lit, setLit] = useState(1)
const order = useRef(shuffle())        // random 0…8 permutation
useEffect(() => {
  let n = 1
  const id = setInterval(() => {
    n = n >= 9 ? 1 : n + 1
    if (n === 1) order.current = shuffle()   // new pattern each loop
    setLit(n)
  }, 150)
  return () => clearInterval(id)
}, [])
// a dot is lit when its rank in the shuffled order is below the count
style={{ opacity: order.current.indexOf(i) < lit ? 1 : 0 }}
\`\`\``,
})

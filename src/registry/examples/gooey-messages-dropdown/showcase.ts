import { defineShowcase } from '../../types'
import { GooeyMessagesDropdown } from './demo'

export default defineShowcase({
  id: 'gooey-messages-dropdown',
  name: 'Gooey Messages Dropdown',
  category: 'navigation',
  created: '2026-07-14T20:30:00+09:00',
  status: 'done',
  preview: 'fit',
  description:
    'A black chat-bubble button that, on click, doesn’t pop a panel — it melts into one. A rounded "Messages" card grows out from beneath the button, and an SVG goo filter fuses the two dark shapes through a stretching liquid neck (the classic metaball merge) before the card settles and its rows stagger in. Because the liquid is a separable filter layer, the demo keeps the author’s own Gooey On/Off and Normal/Slow toggles so you can watch the same morph with and without the goo.',
  libraries: ['react', 'tailwind'],
  tags: ['morph', 'liquid', 'blur', 'stagger', 'click', 'dropdown'],
  utilities: ['animate-list-reveal'],
  Component: GooeyMessagesDropdown,
  principle: `The "liquid" isn’t animated — it’s an **SVG goo filter**. Two same-coloured dark shapes (the button circle + the growing panel) sit in one filtered div: \`feGaussianBlur\` softens their edges, then \`feColorMatrix\` slams the alpha channel back to a hard threshold (\`… 0 0 0 20 -9\`), so where the two blurs overlap they read as **one fused blob** with a neck, not two fuzzy circles. The morph itself is plain CSS — the panel just transitions \`width\`/\`height\` from the button’s size to the card’s. Content lives in a *separate, unfiltered* layer (the filter would smear text) and fades in on a delay, rows replayed via \`animate-list-reveal\`. Toggle the filter off and the exact same morph plays with crisp edges — proof the goo is a detachable layer.

\`\`\`tsx
<div style={{ filter: gooey ? 'url(#goo)' : undefined }}>
  <div className="rounded-full" style={{ width: BTN, height: BTN }} />        {/* button */}
  <div className="rounded-[28px] transition-[width,height]"
       style={{ width: open ? PANEL_W : BTN, height: open ? PANEL_H : 0 }} /> {/* panel */}
</div>
<filter id="goo">
  <feGaussianBlur stdDeviation="7" result="b" />
  <feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" />
</filter>
\`\`\``,
})

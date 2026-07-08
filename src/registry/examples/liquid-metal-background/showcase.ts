import { defineShowcase } from '../../types'
import { LiquidMetalBackground } from './demo'

export default defineShowcase({
  id: 'liquid-metal-background',
  name: 'Liquid Metal Background',
  category: 'backgrounds',
  created: '2026-07-08T16:10:00+09:00',
  status: 'done',
  preview: 'fit',
  description:
    'A full-bleed sheet of liquid chrome that ripples under the cursor: dragging across it lifts real waves that bend the reflected sky and smear its metallic highlights, then settle back to a mirror-still surface when you stop. The waves are a live GPU water simulation, so pointer paths leave trailing swells that spread and damp naturally — no library, hand-written shaders, works with touch. Swap the image to reskin.',
  libraries: ['react', 'three'],
  tags: ['liquid', 'ripple', 'webgl', 'shader', 'hover'],
  Component: LiquidMetalBackground,
  principle: `The surface is a GPU **height-field water sim** in a *ping-pong* pair of \`WebGLRenderTarget\`s. Each frame a fragment shader reads the previous height, averages its 4 neighbours and integrates a **damped wave** (\`R\`=height, \`G\`=velocity); the pointer adds a Gaussian pulse at its UV. That height texture's **gradient becomes a surface normal** — which is what makes it look like *metal*: the normal drives a fake environment reflection, a sliding specular glint, and a refraction offset that drags the texture (so the reflection smears). Ping-pong is essential — a shader can't read and write the same texture, so you read A, write B, then swap.

\`\`\`glsl
// sim: damped 2D wave, R=height G=velocity
float avg = 0.25*(hL+hR+hU+hD);
float vel = (s.g + (avg - s.r)*2.0) * 0.985;   // damping
float h   = (s.r + vel) * 0.996;               // settle to flat
h += uActive * smoothstep(radius, 0.0, dist) * strength; // pointer pulse
// display: gradient -> normal -> metal
vec3 N = normalize(vec3((hL-hR)*BUMP, (hD-hU)*BUMP, 1.0));
vec3 R = reflect(-vec3(0,0,1), N);             // reflect view off the ripple
\`\`\``,
})

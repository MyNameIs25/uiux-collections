import { defineShowcase } from '../../types'
import { WebglFog } from './demo'

export default defineShowcase({
  id: 'webgl-fog',
  name: 'WebGL Fog',
  category: 'backgrounds',
  created: '2026-07-08T18:20:00+09:00',
  status: 'done',
  preview: 'fit',
  description:
    'A full-bleed haze of 200 additive smoke sprites that drift up from below, spin slowly, and cycle through a soft rainbow — stacking into an aurora-like coloured fog behind a centred "WebGL Fog" title. Every particle\'s rise, spin, hue and flicker is computed in the GPU shader from one accumulating time value, so all 200 planes render in a single instanced draw call with no per-frame JS math. Auto-plays on load, no interaction. Ported from ykob\'s Three.js sketch to modern three (self-contained: the smoke sprite is painted on a canvas, no external image).',
  libraries: ['react', 'three'],
  tags: ['particles', 'float', 'webgl', 'shader', 'glow', 'auto'],
  utilities: ['font-homenaje'],
  Component: WebglFog,
  principle: `All 200 sprites are one \`InstancedBufferGeometry\` (a single draw call), and every bit of motion lives in the \`RawShaderMaterial\`'s GLSL — JS only pushes one \`time\` uniform per frame. The loop is \`now = mod(time + delay*duration, duration)/duration\`: a 0→1 ramp per particle that snaps back to the bottom the instant it tops out, so the rise is seamless. \`AdditiveBlending\` + \`depthWrite:false\` makes overlapping faint sprites (opacity ×0.36) *sum* into brighter coloured fog instead of occluding each other; \`convertHsvToRgb\` sweeps the hue over time for the rainbow.

\`\`\`glsl
float now = mod(time + delay * duration, duration) / duration; // per-instance 0→1 loop
vec3 moveRise = vec3(
  (now * 2.0 - 1.0) * (2500.0 - (delay * 2.0 - 1.0) * 2000.0), // X drift, staggered
  (now * 2.0 - 1.0) * 2000.0,                                  // rise bottom→top
  sin(radians(time * 50.0 + delay + length(position))) * 30.0 // Z wobble
);
gl_Position = projectionMatrix * modelViewMatrix
  * vec4(instancePosition + moveRise + rotatePosition, 1.0);
// fragment: additive, faint — stacking builds the density
gl_FragColor = vec4(color, texColor.a * 0.36);
\`\`\``,
})

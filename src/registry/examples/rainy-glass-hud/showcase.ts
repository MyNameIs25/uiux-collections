import { defineShowcase } from '../../types'
import { RainyGlassHud } from './demo'

export default defineShowcase({
  id: 'rainy-glass-hud',
  name: 'Rainy Glass HUD',
  category: 'backgrounds',
  description:
    'A rainy-window night scene: raindrops slide, merge and leave trails down a blurred city-night photo, each one refracting the lights behind it. Floating glassmorphism clock and weather widgets frost the view.',
  libraries: ['react', 'tailwind', 'three'],
  tags: ['glass', 'rain', 'webgl', 'shader', 'clock', 'weather'],
  utilities: [
    'glass-hud',
    'animate-widget-slide-in',
    'animate-seconds-pulse',
    'animate-now-pulse',
  ],
  Component: RainyGlassHud,
  preview: 'fit',
  principle: `Each drop writes a *lens*, not a height. A \`THREE.Points\` pass renders every drop as a sphere and outputs its surface **normal** (encoded in R,G) plus size in B and coverage in A, alpha-blended into a "water map" so overlaps composite like real drops. The display shader decodes that normal and offsets the photo's UV by \`normal.xy\` — a large displacement that magnifies and bends the scene inside each drop (bigger drops, higher B, bend more). Sampling the normal straight from the sprite avoids the noise of deriving it from a height field. The panels reuse the \`glass-hud\` utility.

\`\`\`glsl
// 1) each drop stamps its outward surface normal into the water map
vec2 pc = (gl_PointCoord - 0.5) * 2.0;
if (dot(pc, pc) > 1.0) discard;
gl_FragColor = vec4(pc * 0.5 + 0.5, vDepth, mask); // RG=normal, B=size, A=mask
// 2) display: decode the normal and refract the photo by a big UV offset
vec2 refraction = (texture2D(uWater, uv).rg - 0.5) * 2.0;
vec2 ruv = uv + refraction * (uMinRefract + depth * uDeltaRefract);
vec3 col = texture2D(uBg, ruv).rgb * uGain;
\`\`\``,
})

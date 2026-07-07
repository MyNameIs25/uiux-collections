import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { cn } from '@/lib/utils'
import backgroundUrl from './background.webp'

/* -------------------------------------------------------------------------- */
/*  CPU raindrop simulation (renderer-agnostic)                               */
/* -------------------------------------------------------------------------- */

type Drop = {
  x: number
  y: number
  r: number
  momentum: number
  momentumX: number
  shrink: number
  lastSpawn: number
  nextSpawn: number
  killed: boolean
}
const MAX_DROPS = 200
const MIN_R = 3
const MAX_R = 8

const rand = (min: number, max: number) => min + Math.random() * (max - min)

function makeDrop(x: number, y: number, r: number): Drop {
  return {
    x,
    y,
    r,
    momentum: 0,
    momentumX: 0,
    shrink: 0,
    lastSpawn: 0,
    nextSpawn: rand(MIN_R, MAX_R),
    killed: false,
  }
}

/**
 * Momentum model (ported from the Lucas Bebber reference): fresh drops rest as
 * mist; bigger drops randomly gain downhill momentum and slide, shedding a
 * shrinking trail and absorbing smaller drops on the way; small resting drops
 * evaporate. This is what makes drops actually run down and clear off, instead
 * of piling up statically.
 */
function stepDrops(drops: Drop[], w: number, h: number, dt: number) {
  const next: Drop[] = []

  // A little fresh mist each frame — cubic bias, so mostly tiny with a rare big.
  for (let i = 0; i < 3; i++) {
    if (drops.length + next.length >= MAX_DROPS) break
    if (Math.random() < 0.3 * dt) {
      const rr = MIN_R + Math.pow(Math.random(), 3) * (MAX_R - MIN_R)
      next.push(makeDrop(rand(0, w), rand(-0.05 * h, 0.98 * h), rr))
    }
  }

  // Sort by position so each drop only collision-checks its near neighbours.
  drops.sort((a, b) => a.y * w + a.x - (b.y * w + b.x))

  drops.forEach((d, idx) => {
    if (d.killed) return

    // Bigger drops randomly gain momentum and start sliding.
    if (Math.random() < (d.r - MIN_R) * (0.1 / (MAX_R - MIN_R)) * dt)
      d.momentum += Math.random() * (d.r / MAX_R) * 4

    // Small resting drops evaporate.
    if (d.r <= MIN_R + 1 && Math.random() < 0.04 * dt) d.shrink += 0.01
    d.r -= d.shrink * dt
    if (d.r <= 0.2) {
      d.killed = true
      return
    }

    // Shed a shrinking trail child as it slides.
    d.lastSpawn += d.momentum * dt
    if (d.momentum > 0 && d.lastSpawn > d.nextSpawn && drops.length + next.length < MAX_DROPS) {
      next.push(makeDrop(d.x + rand(-d.r, d.r) * 0.1, d.y - 0.01 * d.r, d.r * rand(0.2, 0.45)))
      d.r *= Math.pow(0.97, dt)
      d.lastSpawn = 0
      d.nextSpawn = rand(MIN_R, MAX_R) - 2 * d.momentum + (MAX_R - d.r)
    }

    if (d.momentum > 0) {
      d.y += d.momentum * dt
      d.x += d.momentumX * dt
      if (d.y - d.r > h) {
        d.killed = true
        return
      }
      // Absorb smaller drops in the path (bigger wins).
      for (const o of drops.slice(idx + 1, idx + 60)) {
        if (o.killed || d.r <= o.r) continue
        const dx = o.x - d.x
        const dy = o.y - d.y
        const cr = (d.r + o.r) * 0.65
        if (dx * dx + dy * dy < cr * cr) {
          d.r = Math.min(MAX_R, Math.sqrt(d.r * d.r + 0.8 * o.r * o.r))
          d.momentumX += 0.1 * dx
          o.killed = true
          d.momentum = Math.max(o.momentum, Math.min(40, d.momentum + 0.04 * d.r + 1))
        }
      }
    }

    // Momentum bleeds off, so drops stall and rest again.
    d.momentum -= 0.1 * Math.max(1, 0.5 * MIN_R - d.momentum) * dt
    if (d.momentum < 0) d.momentum = 0
    d.momentumX *= Math.pow(0.7, dt)

    if (!d.killed) next.push(d)
  })

  return next.length > MAX_DROPS ? next.slice(0, MAX_DROPS) : next
}

/* -------------------------------------------------------------------------- */
/*  Shaders                                                                    */
/* -------------------------------------------------------------------------- */

// Pass 1 — stamp each drop's surface NORMAL (not a height) into the water map.
const DROP_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aDepth;
  uniform float uSizeScale;
  varying float vDepth;
  void main() {
    vDepth = aDepth;
    gl_Position = vec4(position.xy, 0.0, 1.0); // already in NDC
    gl_PointSize = aSize * uSizeScale;
  }
`
const DROP_FRAG = /* glsl */ `
  precision highp float;
  varying float vDepth;
  void main() {
    vec2 pc = (gl_PointCoord - vec2(0.5)) * 2.0; // -1 … 1 across the sprite
    float r2 = dot(pc, pc);
    if (r2 > 1.0) discard;
    float mask = smoothstep(1.0, 0.7, sqrt(r2));
    // RG = outward surface normal (encoded 0..1), B = drop size, A = coverage.
    gl_FragColor = vec4(pc * 0.5 + 0.5, vDepth, mask);
  }
`

// Pass 2 — decode the normal and refract the photo by a big UV displacement.
const VIEW_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`
const VIEW_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uWater;
  uniform sampler2D uBg;
  uniform vec2 uCover;       // object-fit: cover mapping for the photo
  uniform float uMinRefract; // rim bend
  uniform float uDeltaRefract; // extra bend for bigger/deeper drops
  uniform float uGain;
  uniform float uAlphaMul;
  uniform float uAlphaSub;
  void main() {
    vec4 w = texture2D(uWater, vUv);
    vec2 refraction = (w.rg - 0.5) * 2.0;                 // decoded normal.xy
    float depth = w.b;
    float mask = clamp(w.a * uAlphaMul - uAlphaSub, 0.0, 1.0); // crisp rims
    vec2 cover = (vUv - 0.5) * uCover + 0.5;
    vec2 ruv = cover + refraction * (uMinRefract + depth * uDeltaRefract);
    vec3 col = texture2D(uBg, ruv).rgb * uGain;
    // specular sparkle on the wet surface
    vec3 n = normalize(vec3(refraction, 0.35));
    float spec = pow(max(dot(n, normalize(vec3(-0.5, 0.6, 0.6))), 0.0), 30.0);
    gl_FragColor = vec4(col + spec * mask, mask);         // composited over the CSS backdrop
  }
`

/* -------------------------------------------------------------------------- */
/*  Scene                                                                       */
/* -------------------------------------------------------------------------- */

function RainyGlassScene() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const glRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = glRef.current
    if (!wrap || !canvas) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        premultipliedAlpha: false,
        antialias: false,
      })
    } catch {
      return // No WebGL → the blurred photo backdrop still shows, just no rain.
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    renderer.setPixelRatio(dpr)
    renderer.autoClear = true
    renderer.setClearColor(new THREE.Color(0.5, 0.5, 0.0), 0) // dry glass = zero refraction

    const waterRT = new THREE.WebGLRenderTarget(2, 2, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
    })
    const camera = new THREE.Camera()

    // Drop pass: alpha-composited so overlapping drops behave like real merges.
    const pos = new Float32Array(MAX_DROPS * 3)
    const size = new Float32Array(MAX_DROPS)
    const depth = new Float32Array(MAX_DROPS)
    const geo = new THREE.BufferGeometry()
    const posAttr = new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage)
    const sizeAttr = new THREE.BufferAttribute(size, 1).setUsage(THREE.DynamicDrawUsage)
    const depthAttr = new THREE.BufferAttribute(depth, 1).setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute('position', posAttr)
    geo.setAttribute('aSize', sizeAttr)
    geo.setAttribute('aDepth', depthAttr)
    const dropMat = new THREE.ShaderMaterial({
      vertexShader: DROP_VERT,
      fragmentShader: DROP_FRAG,
      uniforms: { uSizeScale: { value: 1 } },
      depthTest: false,
      depthWrite: false,
      transparent: true, // NormalBlending: over-composite the normals
    })
    const points = new THREE.Points(geo, dropMat)
    points.frustumCulled = false
    const dropScene = new THREE.Scene().add(points)

    // Photo — sampled sharp by the refraction; the CSS <img> shows the dark blur.
    const bgTex = new THREE.TextureLoader().load(backgroundUrl, () => {
      updateCover()
    })
    bgTex.colorSpace = THREE.SRGBColorSpace
    bgTex.minFilter = THREE.LinearFilter
    bgTex.magFilter = THREE.LinearFilter
    bgTex.wrapS = bgTex.wrapT = THREE.ClampToEdgeWrapping

    const viewMat = new THREE.ShaderMaterial({
      vertexShader: VIEW_VERT,
      fragmentShader: VIEW_FRAG,
      uniforms: {
        uWater: { value: waterRT.texture },
        uBg: { value: bgTex },
        uCover: { value: new THREE.Vector2(1, 1) },
        uMinRefract: { value: 0.05 },
        uDeltaRefract: { value: 0.1 },
        uGain: { value: 1.15 },
        uAlphaMul: { value: 10 },
        uAlphaSub: { value: 3 },
      },
      depthTest: false,
      depthWrite: false,
      transparent: false,
      blending: THREE.NoBlending, // write straight rgba → canvas alpha = drop mask
    })
    const viewScene = new THREE.Scene().add(
      new THREE.Mesh(new THREE.PlaneGeometry(2, 2), viewMat),
    )

    let w = 0
    let h = 0
    const updateCover = () => {
      const img = bgTex.image as HTMLImageElement | undefined
      if (!img || !w || !h) return
      const canvasAspect = w / h
      const imgAspect = img.width / img.height
      viewMat.uniforms.uCover.value.set(
        canvasAspect > imgAspect ? 1 : canvasAspect / imgAspect,
        canvasAspect > imgAspect ? imgAspect / canvasAspect : 1,
      )
    }
    const resize = () => {
      w = wrap.clientWidth
      h = wrap.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      waterRT.setSize(Math.floor(w * dpr), Math.floor(h * dpr))
      dropMat.uniforms.uSizeScale.value = 2 * dpr // drop.r (css) → RT-pixel diameter
      updateCover()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    let drops: Drop[] = []
    const pack = () => {
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i]
        pos[i * 3] = (d.x / w) * 2 - 1
        pos[i * 3 + 1] = 1 - (d.y / h) * 2 // flip to NDC (y-up)
        size[i] = d.r
        depth[i] = Math.min(1, Math.max(0, (d.r - MIN_R) / (MAX_R - MIN_R)))
      }
      posAttr.needsUpdate = true
      sizeAttr.needsUpdate = true
      depthAttr.needsUpdate = true
      geo.setDrawRange(0, drops.length)
    }
    const render = () => {
      renderer.setRenderTarget(waterRT)
      renderer.render(dropScene, camera)
      renderer.setRenderTarget(null)
      renderer.render(viewScene, camera)
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let last = 0
    const loop = (t: number) => {
      const dt = last ? Math.min(Math.max((t - last) / 16.67, 0.5), 2) : 1
      last = t
      drops = stepDrops(drops, w, h, dt)
      pack()
      render()
      raf = requestAnimationFrame(loop)
    }

    if (reduce) {
      for (let i = 0; i < 180; i++)
        drops.push(makeDrop(Math.random() * w, Math.random() * h, 2 + Math.random() * 4))
      pack()
      render()
    } else {
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      waterRT.dispose()
      geo.dispose()
      dropMat.dispose()
      viewMat.dispose()
      bgTex.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className="relative isolate min-h-[34rem] w-full overflow-hidden rounded-2xl bg-[#05060d]"
    >
      {/* Blurred, dark photo backdrop — the WebGL layer refracts the sharp original. */}
      <img
        src={backgroundUrl}
        alt=""
        aria-hidden
        className="absolute inset-0 size-full scale-105 object-cover [filter:blur(4px)_brightness(0.55)]"
      />
      {/* GPU refraction — drops composited over the backdrop (transparent where dry). */}
      <canvas ref={glRef} aria-hidden className="absolute inset-0 size-full" />

      <div className="absolute inset-0 flex flex-col items-end gap-5 p-5 sm:p-7">
        <ClockCard />
        <WeatherCard />
      </div>
    </div>
  )
}

function ClockCard() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')
  const date = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="glass-hud animate-widget-slide-in w-[340px] max-w-full p-6 text-white">
      <div className="flex items-baseline gap-1">
        <span className="text-[56px] font-extralight leading-none tracking-[2px] tabular-nums">
          {hh}:{mm}
        </span>
        <span className="animate-seconds-pulse text-xl font-light tabular-nums text-white/50 motion-reduce:animate-none">
          {ss}
        </span>
      </div>
      <div className="mt-3 text-sm text-white/70">{date}</div>
    </div>
  )
}

const DETAILS = [
  { label: 'Humidity', value: '88%' },
  { label: 'Wind', value: '12 km/h' },
  { label: 'Feels', value: '12°' },
]
const HOURLY = [
  { label: 'Now', temp: '14°', icon: '🌧️' },
  { label: '9 PM', temp: '13°', icon: '🌧️' },
  { label: '10 PM', temp: '13°', icon: '🌦️' },
  { label: '11 PM', temp: '12°', icon: '☁️' },
  { label: '12 AM', temp: '12°', icon: '☁️' },
]

function WeatherCard() {
  return (
    <div className="glass-hud animate-widget-slide-in w-[340px] max-w-full p-5 text-white [animation-delay:0.15s]">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-white/70">Tokyo</div>
          <div className="mt-1 text-[42px] font-extralight leading-none">14°</div>
          <div className="mt-1 text-sm text-white/60">Light rain</div>
        </div>
        <div className="text-[52px] leading-none">🌧️</div>
      </div>

      {/* The divider above the detail grid is a fading gradient hairline. */}
      <div className="relative mt-4 grid grid-cols-3 gap-2 pt-4 before:absolute before:inset-x-0 before:top-0 before:h-px before:[background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)]">
        {DETAILS.map((d) => (
          <div
            key={d.label}
            className="rounded-xl border border-white/5 bg-white/5 px-2 py-2.5 text-center"
          >
            <div className="text-[11px] text-white/50">{d.label}</div>
            <div className="mt-0.5 text-sm font-medium">{d.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto">
        {HOURLY.map((hour) => (
          <div
            key={hour.label}
            className={cn(
              'flex min-w-14 flex-1 flex-col items-center gap-1 rounded-2xl border border-sky-300/30 bg-gradient-to-b from-sky-300/20 to-sky-300/5 px-2 py-2.5',
              hour.label === 'Now' && 'animate-now-pulse motion-reduce:animate-none',
            )}
          >
            <span className="text-[11px] text-white/60">{hour.label}</span>
            <span className="text-lg leading-none">{hour.icon}</span>
            <span className="text-xs font-medium tabular-nums">{hour.temp}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function RainyGlassHud() {
  return <RainyGlassScene />
}

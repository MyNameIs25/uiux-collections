import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/*
  WebGL Fog — 200 additive smoke sprites rising forever, faithfully ported from
  ykob's Three.js sketch (https://codepen.io/ykob/pen/YewoRz) to modern three.
  The "aha": every particle's motion, rotation, HSV colour and blink lives in
  the GLSL — JS only builds the instanced buffers and pushes one `time` uniform
  each frame. All 200 planes are ONE draw call via InstancedBufferGeometry.
*/

const NUM = 200
// Lifetime is measured in accumulated render-time units (roughly seconds since
// `time` grows by `clock.getDelta()`), NOT wall-clock — a full rise takes ~this
// many seconds, which is why the drift reads so slow and floaty.
const DURATION = 200.0
const FOCAL_LENGTH = 24 // 24mm cine lens → wide FOV, computed per-aspect by three

// Vertex shader: rise + spin + HSV colour + blink, all from `time` and the
// per-instance `delay` / `rotate`. `now` is a mod() loop 0→1 that snaps the
// sprite back to the bottom the instant it reaches the top (seamless, no ease).
const VERT = /* glsl */ `
  attribute vec3 position;
  attribute vec2 uv;
  attribute vec3 instancePosition;
  attribute float delay;
  attribute float rotate;

  uniform mat4 projectionMatrix;
  uniform mat4 modelViewMatrix;
  uniform float time;

  varying vec2 vUv;
  varying vec3 vColor;
  varying float vBlink;

  const float duration = ${DURATION.toFixed(1)};

  mat4 calcRotateMat4Z(float radian) {
    return mat4(
      cos(radian), -sin(radian), 0.0, 0.0,
      sin(radian), cos(radian), 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    );
  }
  vec3 convertHsvToRgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main(void) {
    float now = mod(time + delay * duration, duration) / duration;

    // Billboard spin: per-instance angular speed + a slow global turn.
    mat4 rotateMat = calcRotateMat4Z(radians(rotate * 360.0) + time * 0.1);
    vec3 rotatePosition = (rotateMat * vec4(position, 1.0)).xyz;

    // Rise from below to above; X drift amplitude varies per delay (stagger);
    // a small Z wobble keeps the cloud from looking flat.
    vec3 moveRise = vec3(
      (now * 2.0 - 1.0) * (2500.0 - (delay * 2.0 - 1.0) * 2000.0),
      (now * 2.0 - 1.0) * 2000.0,
      sin(radians(time * 50.0 + delay + length(position))) * 30.0
    );
    vec3 updatePosition = instancePosition + moveRise + rotatePosition;

    // Hue drifts with time + spatial offset → a slow soft rainbow.
    vec3 hsv = vec3(time * 0.1 + delay * 0.2 + length(instancePosition) * 100.0, 0.5, 0.8);
    float blink = (sin(radians(now * 360.0 * 20.0)) + 1.0) * 0.88; // ~20 flickers / life

    vUv = uv;
    vColor = convertHsvToRgb(hsv);
    vBlink = blink;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(updatePosition, 1.0);
  }
`

// Fragment shader: tinted smoke texture, darkened toward the edges by `blink`
// (the "inner-dark, outer-bright" softening), held faint (×0.36) so the effect
// is built by STACKING many additive sprites rather than one opaque one.
const FRAG = /* glsl */ `
  precision highp float;

  uniform sampler2D tex;

  varying vec2 vUv;
  varying vec3 vColor;
  varying float vBlink;

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    vec4 texColor = texture2D(tex, vUv);
    vec3 color = (texColor.rgb - vBlink * length(p) * 0.8) * vColor;
    float opacity = texColor.a * 0.32;
    gl_FragColor = vec4(color, opacity);
  }
`

// Self-contained smoke sprite — the reference loads an external fog.png; this
// paints an equivalent soft, irregular cloud with a faded edge so no network
// asset is needed. Swap for any smoke/cloud alpha texture to reskin.
function createFogTexture(): THREE.CanvasTexture {
  const size = 256
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const cx = size / 2

  // Soft, low-alpha base lobe — a wispy smoke puff, NOT a solid disc. Keeping the
  // peak faint is what lets many sprites stack additively into coloured haze
  // instead of instantly clipping to white.
  const base = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx)
  base.addColorStop(0, 'rgba(255,255,255,0.28)')
  base.addColorStop(0.5, 'rgba(255,255,255,0.09)')
  base.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, size, size)

  // A few faint off-centre puffs break the perfect circle into a cloud shape.
  for (let i = 0; i < 10; i++) {
    const angle = Math.random() * Math.PI * 2
    const dist = Math.random() * size * 0.22
    const x = cx + Math.cos(angle) * dist
    const y = cx + Math.sin(angle) * dist
    const r = size * (0.14 + Math.random() * 0.16)
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, 'rgba(255,255,255,0.05)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
  }

  // Fade toward the edges so the sprite has no hard border when it rotates.
  ctx.globalCompositeOperation = 'destination-in'
  const mask = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx)
  mask.addColorStop(0, 'rgba(0,0,0,1)')
  mask.addColorStop(0.72, 'rgba(0,0,0,1)')
  mask.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = mask
  ctx.fillRect(0, 0, size, size)

  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}

// 200 subdivided planes as ONE instanced geometry — each instance gets a random
// start position, phase `delay` and spin speed `rotate`.
function createGeometry(): THREE.InstancedBufferGeometry {
  const geometry = new THREE.InstancedBufferGeometry()
  const base = new THREE.PlaneGeometry(1100, 1100, 20, 20)
  geometry.setAttribute('position', base.attributes.position)
  geometry.setAttribute('uv', base.attributes.uv)
  geometry.setIndex(base.index)
  base.dispose()

  const instancePositions = new THREE.InstancedBufferAttribute(new Float32Array(NUM * 3), 3)
  const delays = new THREE.InstancedBufferAttribute(new Float32Array(NUM), 1)
  const rotates = new THREE.InstancedBufferAttribute(new Float32Array(NUM), 1)
  for (let i = 0; i < NUM; i++) {
    instancePositions.setXYZ(i, (Math.random() * 2 - 1) * 850, 0, (Math.random() * 2 - 1) * 300)
    delays.setX(i, Math.random())
    rotates.setX(i, Math.random() * 2 + 1)
  }
  geometry.setAttribute('instancePosition', instancePositions)
  geometry.setAttribute('delay', delays)
  geometry.setAttribute('rotate', rotates)
  return geometry
}

export function WebglFog() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x111111, 1)
    container.appendChild(renderer.domElement)
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:1;'

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera()
    camera.far = 50000
    camera.position.set(0, 0, 1000)
    camera.lookAt(0, 0, 0)

    const geometry = createGeometry()
    const fogTexture = createFogTexture()
    const material = new THREE.RawShaderMaterial({
      uniforms: { time: { value: 0 }, tex: { value: fogTexture } },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const mesh = new THREE.Mesh(geometry, material)
    // Instances travel far from the base plane's origin — never cull them.
    mesh.frustumCulled = false
    scene.add(mesh)

    function resize() {
      const w = container!.clientWidth
      const h = container!.clientHeight
      if (w === 0 || h === 0) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.setFocalLength(FOCAL_LENGTH) // recomputes fov from the new aspect
    }

    const ro = new ResizeObserver(resize)
    ro.observe(container)
    resize()

    let raf = 0
    let last = performance.now()
    function frame(nowMs: number) {
      const delta = (nowMs - last) / 1000 // seconds since last frame
      last = nowMs
      material.uniforms.time.value += delta
      renderer.render(scene, camera)
      raf = requestAnimationFrame(frame)
    }

    if (reduce) {
      // At time 0 the sprites are already spread across their life (via `delay`),
      // so a single static frame still shows a full cloud — no motion.
      renderer.render(scene, camera)
    } else {
      raf = requestAnimationFrame(frame)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.domElement.remove()
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      fogTexture.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-[600px] w-full overflow-hidden bg-neutral-950 @container"
    >
      {/* Title sits above the canvas (z-2 over the canvas's z-1). Sizes use
          container-query units so it scales with the preview box, not the tab. */}
      <div className="pointer-events-none absolute inset-0 z-[2] flex flex-col items-center justify-center text-center font-homenaje text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">
        <h1 className="m-0 mb-[0.1em] text-[11cqw] font-normal leading-none">WebGL Fog</h1>
        <p className="m-0 text-[2cqw] uppercase tracking-[0.1em]">Instanced smoke particles</p>
      </div>
    </div>
  )
}

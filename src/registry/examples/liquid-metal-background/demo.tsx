import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import background from './background.webp'

/*
  Liquid-metal displacement background — an ORIGINAL implementation (the CodePen
  reference leans on a CC BY-NC-SA library; this hand-writes the shaders so it's
  free to reuse). The trick is a GPU height-field "water" simulation living in a
  ping-pong pair of render targets: every frame a fragment shader reads the last
  height, averages its 4 neighbours and integrates a damped wave, and the pointer
  injects a Gaussian pulse at its UV. That height texture's gradient becomes a
  surface normal, which drives (a) a fake metallic environment reflection, (b) a
  moving specular glint, and (c) a refraction offset that warps the baked text —
  so the whole plane reads as a touchable sheet of liquid metal.
*/

// ---- Tunables (the "real values" from the reference, adapted) --------------
const SIM_SHORT = 256 // height-field resolution on the short axis
const DAMPING = 0.985 // velocity damping — higher = ripples travel further
const SETTLE = 0.996 // pulls height back to flat so idle returns to mirror-still
const INJECT_RADIUS = 0.07 // pulse size in (aspect-corrected) UV
const INJECT_STRENGTH = 0.11 // pulse height
const BUMP = 6.0 // height-gradient → normal strength (≈ displacementScale)
const REFRACT = 0.05 // how far the normal drags the texture (text warp)
const METALNESS = 0.75
const ROUGHNESS = 0.25

// A fullscreen clip-space quad: no camera maths, uv spans 0..1.
const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

// Damped 2D wave equation. R = height, G = velocity; pointer adds a pulse.
const SIM_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPrev;
  uniform vec2 uTexel;
  uniform vec2 uPointer;   // current pointer uv
  uniform float uActive;   // 1 while the pointer is moving, decays to 0
  uniform float uAspect;   // W/H, keeps injected drops round

  void main() {
    vec4 s = texture2D(uPrev, vUv);
    float avg = 0.25 * (
      texture2D(uPrev, vUv + vec2(uTexel.x, 0.0)).r +
      texture2D(uPrev, vUv - vec2(uTexel.x, 0.0)).r +
      texture2D(uPrev, vUv + vec2(0.0, uTexel.y)).r +
      texture2D(uPrev, vUv - vec2(0.0, uTexel.y)).r);

    float vel = s.g + (avg - s.r) * 2.0; // accelerate toward the neighbourhood mean
    vel *= ${DAMPING.toFixed(3)};
    float h = (s.r + vel) * ${SETTLE.toFixed(3)};

    vec2 diff = vUv - uPointer;
    diff.x *= uAspect;
    h += uActive * smoothstep(${INJECT_RADIUS.toFixed(3)}, 0.0, length(diff)) * ${INJECT_STRENGTH.toFixed(3)};

    gl_FragColor = vec4(h, vel, 0.0, 1.0);
  }
`

// Reads the height field + the colour texture, fakes lit liquid metal.
const DISPLAY_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uMap;
  uniform sampler2D uHeight;
  uniform vec2 uTexel;
  uniform vec3 uLightDir;

  void main() {
    // Surface normal from the height gradient (central differences).
    float hL = texture2D(uHeight, vUv - vec2(uTexel.x, 0.0)).r;
    float hR = texture2D(uHeight, vUv + vec2(uTexel.x, 0.0)).r;
    float hD = texture2D(uHeight, vUv - vec2(0.0, uTexel.y)).r;
    float hU = texture2D(uHeight, vUv + vec2(0.0, uTexel.y)).r;
    vec3 N = normalize(vec3((hL - hR) * ${BUMP.toFixed(1)}, (hD - hU) * ${BUMP.toFixed(1)}, 1.0));

    // Drag the texture along the slope so the baked text distorts with the wave.
    vec3 base = texture2D(uMap, vUv + N.xy * ${REFRACT.toFixed(3)}).rgb;

    // Orthographic view down +Z; reflect it off the rippled normal.
    vec3 V = vec3(0.0, 0.0, 1.0);
    vec3 R = reflect(-V, N);

    // Procedural "studio" environment: warm vertical gradient + a bright streak.
    vec3 env = mix(vec3(0.11, 0.12, 0.22), vec3(0.98, 0.96, 0.92), clamp(R.y * 0.5 + 0.5, 0.0, 1.0));
    env += vec3(0.7) * smoothstep(0.975, 1.0, R.y);

    // Metals reflect a tinted environment; roughness sets the highlight tightness.
    vec3 H = normalize(uLightDir + V);
    float spec = pow(max(dot(N, H), 0.0), mix(8.0, 220.0, 1.0 - ${ROUGHNESS.toFixed(2)}));
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);

    // Tint the reflection toward the texture so the palette stays vivid at rest.
    vec3 metal = env * mix(vec3(1.0), base, 0.65);
    vec3 color = mix(base, metal, ${METALNESS.toFixed(2)});
    color = mix(color, env, fresnel * ${METALNESS.toFixed(2)});
    color += spec;

    gl_FragColor = vec4(color, 1.0);
  }
`

export function LiquidMetalBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;'

    const camera = new THREE.Camera() // clip-space quad → projection unused
    const quad = new THREE.PlaneGeometry(2, 2)

    // The colour texture — swap this file for any image to reskin. NoColorSpace
    // = sample raw bytes; the shader outputs them directly, sidestepping three's
    // colour-management so the image reads as-is. onLoad paints one frame for the
    // reduced-motion path (the animation loop repaints on its own otherwise).
    const map = new THREE.TextureLoader().load(background, () => {
      if (reduce) renderDisplay()
    })
    map.colorSpace = THREE.NoColorSpace
    map.wrapS = map.wrapT = THREE.ClampToEdgeWrapping

    const rtOpts = {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      depthBuffer: false,
    }
    let rtA = new THREE.WebGLRenderTarget(2, 2, rtOpts)
    let rtB = new THREE.WebGLRenderTarget(2, 2, rtOpts)

    const simMat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: SIM_FRAG,
      uniforms: {
        uPrev: { value: rtA.texture },
        uTexel: { value: new THREE.Vector2() },
        uPointer: { value: new THREE.Vector2(-1, -1) },
        uActive: { value: 0 },
        uAspect: { value: 1 },
      },
    })
    const simScene = new THREE.Scene()
    simScene.add(new THREE.Mesh(quad, simMat))

    const dispMat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: DISPLAY_FRAG,
      uniforms: {
        uMap: { value: map },
        uHeight: { value: rtA.texture },
        uTexel: { value: new THREE.Vector2() },
        uLightDir: { value: new THREE.Vector3(0.4, 0.7, 0.6).normalize() },
      },
    })
    const dispScene = new THREE.Scene()
    dispScene.add(new THREE.Mesh(quad, dispMat))

    function resize() {
      const w = container!.clientWidth
      const h = container!.clientHeight
      if (w === 0 || h === 0) return
      renderer.setSize(w, h, false)

      const aspect = w / h
      const simH = SIM_SHORT
      const simW = Math.round(SIM_SHORT * aspect)
      rtA.setSize(simW, simH)
      rtB.setSize(simW, simH)
      const texel = new THREE.Vector2(1 / simW, 1 / simH)
      simMat.uniforms.uTexel.value.copy(texel)
      dispMat.uniforms.uTexel.value.copy(texel)
      simMat.uniforms.uAspect.value = aspect

      // Clear both targets to a flat, still surface.
      for (const rt of [rtA, rtB]) {
        renderer.setRenderTarget(rt)
        renderer.setClearColor(0x000000, 0)
        renderer.clear()
      }
      renderer.setRenderTarget(null)
    }

    // Pointer → UV (Y flipped into texture space). Bound on the container so it
    // fires everywhere, and works for touch via Pointer Events.
    function onMove(e: PointerEvent) {
      const rect = container!.getBoundingClientRect()
      simMat.uniforms.uPointer.value.set(
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height,
      )
      simMat.uniforms.uActive.value = 1
    }
    const stop = () => (simMat.uniforms.uActive.value = 0)
    container.addEventListener('pointermove', onMove)
    container.addEventListener('pointerdown', onMove)
    container.addEventListener('pointerleave', stop)

    const ro = new ResizeObserver(resize)
    ro.observe(container)
    resize()

    let raf = 0
    function frame() {
      // Advance the simulation into the free target, then swap.
      simMat.uniforms.uPrev.value = rtA.texture
      renderer.setRenderTarget(rtB)
      renderer.render(simScene, camera)
      ;[rtA, rtB] = [rtB, rtA]

      // Injection is a one-shot per move: decay so a still pointer stops rippling.
      simMat.uniforms.uActive.value *= 0.82

      renderDisplay()
      raf = requestAnimationFrame(frame)
    }

    // Paint the display quad once from the latest height field.
    function renderDisplay() {
      dispMat.uniforms.uHeight.value = rtA.texture
      renderer.setRenderTarget(null)
      renderer.render(dispScene, camera)
    }

    if (reduce) {
      // Reduced motion: render one still, mirror-flat frame; no loop, no ripples.
      renderDisplay()
    } else {
      raf = requestAnimationFrame(frame)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      container.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerdown', onMove)
      container.removeEventListener('pointerleave', stop)
      renderer.domElement.remove()
      renderer.dispose()
      rtA.dispose()
      rtB.dispose()
      quad.dispose()
      map.dispose()
      simMat.dispose()
      dispMat.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative min-h-[560px] w-full touch-none overflow-hidden bg-black"
    >
      <span
        className="pointer-events-none absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-sm font-medium tracking-wide text-white [text-shadow:1px_1px_2px_rgba(0,0,0,0.9)]"
      >
        Move your cursor across the surface
      </span>
    </div>
  )
}

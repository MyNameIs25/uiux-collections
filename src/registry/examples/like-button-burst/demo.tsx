import { useState, type CSSProperties } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

// 6 particles evenly spaced around the centre (60° apart), each flung 24px out.
// The angle → {tx, ty} offset is baked in here so the CSS keyframe only has to
// read `--tx` / `--ty` and animate the spring/fade (see animate-particle-burst).
const BURST_RADIUS = 24
const PARTICLES = Array.from({ length: 6 }, (_, i) => {
  const a = (i * 60 * Math.PI) / 180
  return { tx: Math.cos(a) * BURST_RADIUS, ty: Math.sin(a) * BURST_RADIUS }
})

export function LikeButtonBurst() {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(2138)
  // Bumped on every LIKE so the particle layer remounts and re-fires its burst.
  // Unliking does not bump it, so no particles fly on the way down.
  const [burst, setBurst] = useState(0)

  const toggle = () => {
    const next = !liked
    setLiked(next)
    setCount((c) => c + (next ? 1 : -1))
    if (next) setBurst((b) => b + 1) // sparks fire on the way up only
  }

  return (
    <div className="flex min-h-[16rem] w-full items-center justify-center bg-neutral-950 p-10 [font-family:-apple-system,'Segoe_UI',Arial,sans-serif]">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={liked}
        aria-label={liked ? 'Unlike' : 'Like'}
        className={cn(
          'relative flex cursor-pointer select-none items-center gap-4 overflow-visible rounded-full border px-8 py-4 transition-[border-color,box-shadow] duration-300',
          liked
            ? 'border-blue-400/50 shadow-[0_4px_8px_rgba(59,130,246,0.3),_0_12px_24px_rgba(59,130,246,0.3),_inset_0_1px_0_rgba(255,255,255,0.25)]'
            : 'border-gray-600/50 shadow-[0_4px_8px_rgba(0,0,0,0.2),_0_12px_24px_rgba(0,0,0,0.3),_inset_0_1px_0_rgba(255,255,255,0.15)]',
        )}
      >
        {/* Two stacked gradient backdrops cross-fade grey ⇄ blue on `liked`.
            A single element can't tween between two gradients, so we layer them
            and animate opacity instead. `rounded-[inherit]` clips to the pill. */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 transition-opacity duration-300"
          style={{ opacity: liked ? 0 : 1 }}
        />
        <span
          aria-hidden
          className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 transition-opacity duration-300"
          style={{ opacity: liked ? 1 : 0 }}
        />
        {/* Glass highlight sheen over the top edge. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/5 to-transparent"
        />

        {/* Heart: an outline layer and a gradient-filled layer stacked and
            cross-faded on opacity, so the fill "pours in" as the outline fades. */}
        <span className="relative z-10 size-8">
          <svg width="0" height="0" className="absolute" aria-hidden>
            <defs>
              <linearGradient id="like-heart-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
          </svg>
          <Heart
            aria-hidden
            strokeWidth={2}
            fill="none"
            className="absolute inset-0 size-8 text-[#e5e7eb] transition-opacity duration-300"
            style={{ opacity: liked ? 0 : 1 }}
          />
          <Heart
            aria-hidden
            strokeWidth={2}
            fill="url(#like-heart-grad)"
            stroke="url(#like-heart-grad)"
            className="absolute inset-0 size-8 transition-opacity duration-300"
            style={{ opacity: liked ? 1 : 0 }}
          />

          {/* Particle burst — its own remount `key` replays the keyframe. The
              dots are absolutely centred on the heart and fling out to their
              per-particle `--tx`/`--ty`. `both` fill leaves them invisible at
              rest, so reduced-motion (no `motion-safe:`) simply shows nothing. */}
          <span key={burst} aria-hidden className="pointer-events-none absolute inset-0">
            {burst > 0 &&
              PARTICLES.map((p, i) => (
                <span
                  key={i}
                  className="absolute top-1/2 left-1/2 -ml-[2px] -mt-[2px] size-1 rounded-full bg-white motion-safe:animate-particle-burst"
                  style={{ '--tx': `${p.tx}px`, '--ty': `${p.ty}px` } as CSSProperties}
                />
              ))}
          </span>
        </span>

        {/* Count: gradient text, remounted on every change so it odometer-rolls
            in from above out of a blur (animate-like-roll). */}
        <span className="relative z-10 grid h-6 items-center overflow-hidden text-[24px] font-semibold leading-none">
          <span
            key={count}
            className="bg-gradient-to-b from-white to-gray-200 bg-clip-text text-transparent motion-safe:animate-like-roll"
          >
            {count.toLocaleString()}
          </span>
        </span>
      </button>
    </div>
  )
}

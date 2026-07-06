import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowRight, Sparkles } from 'lucide-react'

export function AuroraHero() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance: fade + rise the content in sequence.
      gsap.from('[data-animate]', {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.1,
      })
      // Aurora blobs drift forever on a gentle yoyo.
      gsap.to('[data-blob]', {
        xPercent: 'random(-12, 12)',
        yPercent: 'random(-12, 12)',
        scale: 'random(0.9, 1.15)',
        duration: 9,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: { each: 1.5, from: 'random' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={root}
      className="relative isolate flex min-h-[28rem] w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-950 px-6 py-20 text-center"
    >
      {/* Aurora — big blurred color blobs bleeding into each other */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          data-blob
          className="absolute -top-10 -left-24 size-96 rounded-full bg-fuchsia-600/40 blur-3xl"
        />
        <div
          data-blob
          className="absolute top-8 -right-24 size-96 rounded-full bg-indigo-600/40 blur-3xl"
        />
        <div
          data-blob
          className="absolute -bottom-16 left-1/3 size-96 rounded-full bg-sky-500/30 blur-3xl"
        />
      </div>

      {/* Grid overlay, faded at the edges so it never hits a hard border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-15 [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      <div className="flex max-w-2xl flex-col items-center gap-6">
        <span
          data-animate
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur"
        >
          <Sparkles className="size-3.5 text-fuchsia-300" />
          Introducing Aurora — now in beta
        </span>

        <h1
          data-animate
          className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl"
        >
          Ship interfaces that{' '}
          <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-sky-400 bg-clip-text text-transparent">
            feel alive
          </span>
        </h1>

        <p data-animate className="max-w-xl text-base text-white/60 sm:text-lg">
          A starting point for landing pages that move — animated gradients, a
          crisp masked grid, and a staggered entrance, all self-contained.
        </p>

        <div
          data-animate
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <button className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-slate-950 transition-transform hover:scale-105 active:scale-95">
            Get started
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button className="rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10">
            Live demo
          </button>
        </div>
      </div>
    </div>
  )
}

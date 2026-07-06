export function GlassCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-white/5">
      {/* Blurred gradient blob provides the soft glow */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-fuchsia-400/40 to-indigo-400/40 blur-2xl" />
      <h3 className="text-lg font-semibold">Glassmorphism</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        A frosted-glass surface with a soft glow that reads on any background.
      </p>
    </div>
  )
}

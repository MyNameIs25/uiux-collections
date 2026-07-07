import { useState } from 'react'
import {
  CircleUserRound,
  Home,
  MessageCircleQuestion,
  Moon,
  Radio,
  Settings,
  StickyNote,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import background from './background.webp'

const NAV = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'pages', label: 'Pages', icon: StickyNote },
  { id: 'active-stream', label: 'Active stream', icon: Radio },
  { id: 'people', label: 'People', icon: Users },
] satisfies { id: string; label: string; icon: LucideIcon }[]

const SETTINGS = [
  { id: 'site-settings', label: 'Site settings', icon: Settings },
  { id: 'profile', label: 'My profile & preferences', icon: CircleUserRound },
  { id: 'help', label: 'Help center', icon: MessageCircleQuestion },
] satisfies { id: string; label: string; icon: LucideIcon }[]

function MenuItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-[15px] font-medium transition-colors',
        active
          ? // selected: warm translucent capsule + amber ring + soft glow
            'bg-amber-400/10 text-amber-50 shadow-[0_0_28px_rgba(251,146,60,0.14)] ring-1 ring-inset ring-amber-400/45'
          : 'text-white/85 hover:bg-white/5',
      )}
    >
      <Icon className="size-[19px] shrink-0" strokeWidth={1.8} />
      {label}
    </button>
  )
}

export function GlassMenuPanel() {
  const [selected, setSelected] = useState('active-stream')
  const [darkMode, setDarkMode] = useState(true)

  return (
    <div
      className="relative flex min-h-[600px] w-full items-center justify-center overflow-hidden bg-[#0a0b0a] bg-cover bg-center p-8"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/*
        Two nested glass layers. The OUTER frame is the darker tint
        (bg-neutral-950/55) over a heavy backdrop-blur + saturate — the
        translucency is what lets the blurred photo bleed through. The `before:`
        sheen fakes the lit glass edge. The INNER menu card is a lighter wash
        (bg-white/6) stacked on the same frame, so it reads a shade brighter;
        the Feedback / Log out footer sits directly on the darker outer frame.
      */}
      <div
        className={cn(
          'relative w-[360px] rounded-[28px] p-3',
          'border border-white/10 bg-neutral-950/55 shadow-[0_24px_70px_rgba(0,0,0,0.55)]',
          'backdrop-blur-2xl backdrop-saturate-150',
          'before:pointer-events-none before:absolute before:inset-0 before:rounded-[28px]',
          'before:bg-gradient-to-b before:from-white/[0.07] before:to-transparent',
        )}
      >
        <div className="relative">
          {/* Inner menu card — the lighter layer */}
          <div className="rounded-[20px] border border-white/[0.07] bg-white/[0.06] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => (
                <MenuItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={selected === item.id}
                  onClick={() => setSelected(item.id)}
                />
              ))}
            </nav>

            <div className="mx-2 my-3 border-t border-white/10" />

            <div className="flex flex-col gap-1">
              <MenuItem
                icon={SETTINGS[0].icon}
                label={SETTINGS[0].label}
                active={selected === SETTINGS[0].id}
                onClick={() => setSelected(SETTINGS[0].id)}
              />

              {/* Dark mode row: label left, iOS-style switch right. */}
              <div className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[15px] font-medium text-white/85">
                <Moon className="size-[19px] shrink-0" strokeWidth={1.8} />
                Dark mode
                <button
                  type="button"
                  role="switch"
                  aria-checked={darkMode}
                  aria-label="Dark mode"
                  onClick={() => setDarkMode((v) => !v)}
                  className={cn(
                    'ml-auto h-[26px] w-[46px] rounded-full p-[3px] transition-colors duration-200',
                    darkMode
                      ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                      : 'bg-white/15',
                  )}
                >
                  {/* knob springs across on toggle (ease-spring = slight overshoot) */}
                  <span
                    className={cn(
                      'block size-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.35)] transition-transform duration-200 ease-spring motion-reduce:transition-none',
                      darkMode ? 'translate-x-5' : 'translate-x-0',
                    )}
                  />
                </button>
              </div>

              {SETTINGS.slice(1).map((item) => (
                <MenuItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={selected === item.id}
                  onClick={() => setSelected(item.id)}
                />
              ))}
            </div>
          </div>

          {/* Footer sits on the darker outer frame, below the card: muted
              Feedback link + a standalone monochrome glass Log out button. */}
          <div className="mt-3 flex items-center justify-between px-3 pb-1 pt-3">
            <button
              type="button"
              className="text-[15px] font-medium text-white/55 transition-colors hover:text-white/80"
            >
              Feedback
            </button>
            <button
              type="button"
              className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-[15px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition-colors hover:bg-white/[0.16]"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useLayoutEffect, useRef, useState } from 'react'
import { ArrowLeft, Check, Pencil, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

type Tag = { id: number; name: string; color: string }

// The tag colours are drawn from this same palette the create/edit form offers.
const PALETTE = [
  '#e0913f', '#e6b93f', '#8ac640', '#43b04a', '#3bb878', '#33b8a4', '#3aa5cc', '#3f7fe0', '#4a6bf0',
  '#6350e0', '#8b45d6', '#b03fce', '#cf3fa6', '#d43f6b', '#e23b3b', '#7c828d', '#9aa0a8', '#c0c4cb',
]

const INK = '#161b26' // near-black used for text, checkboxes, buttons

const INITIAL: Tag[] = [
  { id: 1, name: 'Design', color: '#3aa5cc' },
  { id: 2, name: 'DevOps', color: '#7c828d' },
  { id: 3, name: 'Product', color: '#43b04a' },
]

/** Rounded checkbox that fills near-black and springs its tick in on check. */
function Check_box({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        'grid size-[22px] place-items-center rounded-[7px] border transition-colors duration-200',
        checked ? 'border-transparent' : 'border-[#d6d9df] bg-white',
      )}
      style={checked ? { background: INK } : undefined}
    >
      <Check
        strokeWidth={3.5}
        className={cn(
          // Spring easing gives the tick a tiny overshoot as it pops in.
          'size-3.5 text-white transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          checked ? 'scale-100' : 'scale-0',
        )}
      />
    </span>
  )
}

export function TagsMultiselectPopover() {
  const [tags, setTags] = useState<Tag[]>(INITIAL)
  const [selected, setSelected] = useState<Set<number>>(new Set([1]))
  // 'list', or the create/edit form (editId = null → create).
  const [form, setForm] = useState<{ editId: number | null } | null>(null)
  const [draftName, setDraftName] = useState('')
  const [draftColor, setDraftColor] = useState(PALETTE[6])

  // Animate the card's height between the (differently-sized) views: measure the
  // natural body height after each view change and let CSS transition to it.
  const body = useRef<HTMLDivElement>(null)
  const [h, setH] = useState<number>()
  useLayoutEffect(() => {
    if (body.current) setH(body.current.offsetHeight)
  }, [form])

  const toggle = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const openCreate = () => {
    setDraftName('')
    setDraftColor(PALETTE[6])
    setForm({ editId: null })
  }
  const openEdit = (t: Tag) => {
    setDraftName(t.name)
    setDraftColor(t.color)
    setForm({ editId: t.id })
  }
  const submit = () => {
    const name = draftName.trim()
    if (!name) return
    if (form?.editId == null) {
      setTags((ts) => [...ts, { id: Date.now(), name, color: draftColor }])
    } else {
      const id = form.editId
      setTags((ts) => ts.map((t) => (t.id === id ? { ...t, name, color: draftColor } : t)))
    }
    setForm(null)
  }

  const selectedTags = tags.filter((t) => selected.has(t.id))

  return (
    <div className="flex min-h-[27rem] w-full flex-col items-center justify-center gap-3 bg-[#0b0b0d] px-6 py-10 font-sans">
      {/* Floating badge: the selected tags' dots overlap, then the count. */}
      <span className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-[#f6f7f8] py-1.5 pr-3.5 pl-2.5 text-[15px] font-medium text-[#2b303b] shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <span className="flex -space-x-1.5">
          {selectedTags.length > 0 ? (
            selectedTags.map((t) => (
              <span
                key={t.id}
                className="size-2.5 rounded-full ring-2 ring-[#f6f7f8]"
                style={{ background: t.color }}
              />
            ))
          ) : (
            <span className="size-2.5 rounded-full bg-[#c8ccd2] ring-2 ring-[#f6f7f8]" />
          )}
        </span>
        {selected.size} selected
      </span>

      <div
        style={{ height: h }}
        className="w-[320px] overflow-hidden rounded-[22px] bg-white shadow-[0_24px_70px_-12px_rgba(0,0,0,0.5)] transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
      >
        <div ref={body} className="p-2">
          {!form ? (
            // ── List view ──────────────────────────────────────────────
            <div key="list" className="motion-safe:animate-option-in">
              <div className="flex items-center justify-between px-2 pt-1 pb-2">
                <h3 className="text-[20px] font-bold tracking-[-0.01em] text-[#161b26]">
                  {tags.length} tags
                </h3>
                <button
                  type="button"
                  onClick={openCreate}
                  aria-label="Create tag"
                  className="grid size-8 place-items-center rounded-lg text-[#8a8f98] transition-colors hover:bg-[#f3f4f6] hover:text-[#161b26]"
                >
                  <Plus className="size-5" strokeWidth={2.2} />
                </button>
              </div>

              {tags.map((t) => (
                <div
                  key={t.id}
                  className="group flex items-center gap-3 rounded-xl px-2 transition-colors can-hover:hover:bg-[#f3f4f6]"
                >
                  <button
                    type="button"
                    onClick={() => toggle(t.id)}
                    role="checkbox"
                    aria-checked={selected.has(t.id)}
                    className="flex flex-1 items-center gap-3 py-2.5 text-left"
                  >
                    <span className="size-2.5 shrink-0 rounded-full" style={{ background: t.color }} />
                    <span className="text-[17px] text-[#2b303b]">{t.name}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(t)}
                    aria-label={`Edit ${t.name}`}
                    className="grid size-8 place-items-center rounded-lg text-[#9aa0a8] opacity-0 transition-opacity hover:bg-black/5 can-hover:group-hover:opacity-100 can-hover:group-focus-within:opacity-100"
                  >
                    <Pencil className="size-[18px]" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggle(t.id)}
                    aria-hidden
                    tabIndex={-1}
                    className="py-2.5 pr-1"
                  >
                    <Check_box checked={selected.has(t.id)} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="mt-2 w-full rounded-[14px] py-3 text-[15px] font-semibold text-white transition-transform active:scale-[0.98]"
                style={{ background: INK }}
              >
                Apply
              </button>
            </div>
          ) : (
            // ── Create / Edit form ─────────────────────────────────────
            <div key="form" className="motion-safe:animate-option-in">
              <div className="flex items-center gap-2 px-1 pt-1 pb-2">
                <button
                  type="button"
                  onClick={() => setForm(null)}
                  aria-label="Back"
                  className="grid size-8 place-items-center rounded-lg text-[#8a8f98] transition-colors hover:bg-[#f3f4f6] hover:text-[#161b26]"
                >
                  <ArrowLeft className="size-5" strokeWidth={2.2} />
                </button>
                <h3 className="text-[20px] font-bold tracking-[-0.01em] text-[#161b26]">
                  {form.editId == null ? 'New tag' : 'Edit tag'}
                </h3>
              </div>

              <input
                autoFocus
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="Define a name"
                className="mb-3 w-full rounded-xl border border-[#e6e8eb] px-3.5 py-2.5 text-[16px] text-[#161b26] outline-none placeholder:text-[#b0b4bb] focus:border-[#c4c8cf]"
              />

              <div className="grid grid-cols-9 gap-1 px-1 pb-3">
                {PALETTE.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setDraftColor(c)}
                    aria-label={`Colour ${c}`}
                    className="grid aspect-square place-items-center rounded-lg transition-colors can-hover:hover:bg-[#eef0f2]"
                  >
                    <span
                      className="grid size-6 place-items-center rounded-full"
                      style={{ background: c }}
                    >
                      <Check
                        strokeWidth={3.5}
                        className={cn(
                          'size-3.5 text-white transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                          draftColor === c ? 'scale-100' : 'scale-0',
                        )}
                      />
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={submit}
                disabled={!draftName.trim()}
                className="w-full rounded-[14px] py-3 text-[15px] font-semibold text-white transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#eceef0] disabled:text-[#aeb2b9]"
                style={draftName.trim() ? { background: INK } : undefined}
              >
                {form.editId == null ? 'Create' : 'Save changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

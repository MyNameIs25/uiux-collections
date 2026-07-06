import {
  AppWindow,
  BellRing,
  Box,
  CreditCard,
  Image,
  LayoutGrid,
  Menu,
  MousePointerClick,
  Sparkles,
  Table,
  TextCursorInput,
  Type,
  type LucideIcon,
} from 'lucide-react'

/**
 * The catalogue of component categories.
 *
 * To add a new category: append an entry here. Every showcase registered in
 * `registry.tsx` must reference one of these `id`s (enforced by `CategoryId`).
 */
export const CATEGORIES = [
  { id: 'buttons', label: 'Buttons', icon: MousePointerClick },
  { id: 'cards', label: 'Cards', icon: CreditCard },
  { id: 'modals', label: 'Modals & Dialogs', icon: AppWindow },
  { id: 'hero', label: 'Hero Sections', icon: Sparkles },
  { id: 'navigation', label: 'Navigation', icon: Menu },
  { id: 'forms', label: 'Forms & Inputs', icon: TextCursorInput },
  { id: 'feedback', label: 'Feedback', icon: BellRing },
  { id: 'data-display', label: 'Data Display', icon: Table },
  { id: 'animation', label: 'Animations', icon: Sparkles },
  { id: 'backgrounds', label: 'Backgrounds', icon: Image },
  { id: 'text', label: 'Text Effects', icon: Type },
  { id: '3d', label: '3D / WebGL', icon: Box },
] as const satisfies ReadonlyArray<{
  id: string
  label: string
  icon: LucideIcon
}>

export type CategoryId = (typeof CATEGORIES)[number]['id']

/** Sentinel used by the sidebar/URL to mean "no filter". */
export const ALL_CATEGORY = 'all' as const
export type CategoryFilter = CategoryId | typeof ALL_CATEGORY

export const ALL_CATEGORY_META = { id: ALL_CATEGORY, label: 'All', icon: LayoutGrid } as const

const CATEGORY_IDS = new Set<string>(CATEGORIES.map((c) => c.id))

export function isCategoryId(value: string | null | undefined): value is CategoryId {
  return value != null && CATEGORY_IDS.has(value)
}

export function isCategoryFilter(value: string | null | undefined): value is CategoryFilter {
  return value === ALL_CATEGORY || isCategoryId(value)
}

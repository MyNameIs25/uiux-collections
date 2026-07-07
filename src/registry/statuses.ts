/**
 * Lifecycle status of a showcase — single source of truth for the values, their
 * labels, and their display order (used by the status filter on the home page).
 */
export const STATUSES = [
  { id: 'done', label: 'Done' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'archived', label: 'Archived' },
] as const

export type ShowcaseStatus = (typeof STATUSES)[number]['id']

export function isStatus(value: string): value is ShowcaseStatus {
  return STATUSES.some((s) => s.id === value)
}

export function statusLabel(id: ShowcaseStatus): string {
  return STATUSES.find((s) => s.id === id)?.label ?? id
}

# AGENTS.md

> This is the **single source of truth** for agent instructions.
> `CLAUDE.md` is a symlink to this file — edit **only** `AGENTS.md` and changes
> propagate automatically.

## Project overview

`uiux-collections` is a **personal, local-only** React SPA used to collect and
showcase cool UI/UX components and effects (hero pages, animations, WebGL, etc.).
Components live here so they can be lifted directly into other projects when
needed.

- **No backend / no database.** Everything is 100% local and client-side.
- Purpose: a reusable gallery of polished, copy-pasteable UI/UX building blocks.

## Tech stack

- **Build:** Vite + React 19 + TypeScript
- **Package manager:** pnpm (always use `pnpm`, never `npm`/`yarn`)
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite`, config-less — theme in `src/index.css`)
- **UI primitives:** shadcn/ui (new-york style, neutral base) → `pnpm dlx shadcn@latest add <component>`
- **Animation:** GSAP
- **3D / WebGL:** three.js, @react-three/fiber, @react-three/drei
- **Icons:** lucide-react
- **Utilities:** `cn()` in `src/lib/utils.ts` (clsx + tailwind-merge)

## Commands

```bash
pnpm dev       # start the dev server
pnpm build     # type-check (tsc -b) + production build
pnpm preview   # preview the production build
pnpm lint      # run oxlint
```

## Conventions

- Import from `src` with the `@/` alias (e.g. `import { cn } from '@/lib/utils'`).
- shadcn/ui primitives live in **`src/components/base/`** (renamed from the default `ui`; the `ui` alias in `components.json` points here, so `pnpm dlx shadcn@latest add <component>` installs into `base`). Import them as `@/components/base/<name>`.
- Put app-level components (sidebar, gallery, toggles) directly under `src/components/`; collected showcases go under `src/registry/`.
- Style with Tailwind utility classes; use theme tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, etc.) so light/dark modes work automatically.
- Each collected effect/component should be self-contained and easy to copy out.
- Keep everything client-side — do not introduce servers, APIs, or databases.

## Theming (dark mode)

- `ThemeProvider` (`src/components/theme-provider.tsx`) wraps the app in `main.tsx`; it toggles the `.dark` class on `<html>` and persists to `localStorage` (`uiux-theme`). Tailwind v4 dark variant is wired via `@custom-variant dark` in `index.css`.
- `useTheme()` exposes `theme` / `resolvedTheme` / `setTheme` / `toggleTheme`. The global toggle button is `ModeToggle` (`src/components/mode-toggle.tsx`), rendered in the home header. Every component inherits light/dark from this — just use theme tokens.

## State via URL params (no router)

- There is **no router**. Global UI state lives in the URL query string. `useUrlParam(key, default)` (`src/hooks/use-url-param.ts`) reads/writes a param via `history.pushState` and broadcasts a custom event so all instances stay in sync.
- The catalog filter uses `useCatalogParams()` (`src/hooks/use-catalog-params.ts`) → `?category=<id>` and `?q=<search>`. Add new URL-backed state with `useUrlParam`.

## Registry — adding a component

Categories and the component catalog live in `src/registry/`. Adding a component
is **drop a folder** — no edits to `registry.ts` (it auto-discovers via
`import.meta.glob`):

1. Create `src/registry/examples/<id>/` with two files:
   - **`demo.tsx`** — the component itself, exported (e.g. `export function Foo() {...}`). This single file is both what renders live **and** what the details page shows as **Source** (imported verbatim via Vite `?raw`). Never write the code twice. Multi-file examples: put helpers alongside and import them.
   - **`showcase.ts`** — `export default defineShowcase({...})` with the metadata:
     - `id`, `name`, `category` (a valid `CategoryId`) — required; `id` is usually the folder name.
     - `Component` — import it from `./demo`.
     - `preview` — optional; set to `'fit'` for **full-bleed** showcases (heroes, full backgrounds) designed for a whole viewport. On gallery cards the live preview is cropped to a fixed-height window (its vertical middle shows); on the details page it's scaled to fit the width (capped so libraries/tags stay in view). Omit for normal-sized components (buttons, cards, text), which render at native size. Framing + the hover **Expand-to-fullscreen** button live in `LivePreview` (`src/components/live-preview.tsx`); width-scaling is `ScaledPreview` (`src/components/scaled-preview.tsx`).
     - `description`, `tags` — shown on the card/details page; feed search. **Tag using the controlled vocabulary in [docs/TAGS-GUIDELINE.md](docs/TAGS-GUIDELINE.md)** (style / motion / trigger / capability groups + naming rules) — don't invent synonyms.
     - `libraries` — array of `LibraryId` (`src/registry/libraries.ts`, e.g. `['react', 'tailwind', 'gsap']`); rendered as badges.
     - `principle` — optional hand-written **"aha"** of the effect: a short prose explanation + a fenced key snippet (Markdown), shown in the **Principle** tab. **Follow [docs/PRINCIPLE-GUIDELINE.md](docs/PRINCIPLE-GUIDELINE.md)** (explanation ≤ 80 words, name the load-bearing classes/APIs and say *why*).
     - `prompt` — optional; if omitted, one is auto-composed from the metadata + `principle` (falling back to `source`) via `buildPrompt` in `prompt.ts`, shown in the **Agent prompt** tab.
   - Do **not** set `source` — the registry injects it from `demo.tsx?raw`.
2. Sidebar counts, gallery filtering/search, and the details page (Principle / Source / Agent prompt tabs) all update automatically.

To add a **new category**, append an entry to `CATEGORIES` in `src/registry/categories.ts` (id + label + lucide icon). Current categories: buttons, cards, modals, hero, navigation, forms, feedback, data-display, animation, backgrounds, text, 3d.
To add a **new library**, append an entry to `LIBRARIES` in `src/registry/libraries.ts`.

## Navigation & the details page

- No router: the open component is stored in the URL as `?component=<id>`. The card body stays interactive (hover/animations run live); a top-right shadcn icon button on each card sets it. The header **Back** button (and picking a category/tag/search) clears it. `App.tsx` reads it via `useUrlParam` and renders `ComponentDetails` when set, otherwise `TagFilterBar` + `ComponentGallery`.
- The details page (`component-details.tsx`) shows: live preview, `libraries` badges, full description + clickable tags, and a shadcn `Tabs` **Code / Agent prompt** block, each copyable via `CopyButton` (`copy-button.tsx`).

## Filtering (category + tags + search)

All filter state lives in the URL via `useCatalogParams()` and combines as **category AND tags AND text**:

- `?category=<id>` — single category (sidebar).
- `?tags=a,b` — multiple tags, **intersection** (a component matches only if it has *all* selected tags; adding tags narrows results).
- `?q=<text>` — free-text over name/description/tags.

Tags are rendered as clickable chips (`TagPill`, no leading `#`) in two places: the `TagFilterBar` under the header (scoped to the current category, with per-tag counts, collapsing past 12 behind a `…` expander) and the details page. Clicking a tag toggles it in `?tags=`. Switching category clears tags (they're category-scoped). `getTagCounts(category)` and `filterShowcases(category, query, tags)` live in `registry.ts`.

Tag values follow the controlled vocabulary in [docs/TAGS-GUIDELINE.md](docs/TAGS-GUIDELINE.md) — keep new tags consistent with it so search/filter stays reliable.

## Structure

```
src/
  App.tsx                    # home page: sidebar + header + gallery
  main.tsx                   # React root, wraps app in ThemeProvider
  index.css                  # Tailwind import + shadcn theme tokens (light/dark)
  lib/utils.ts               # cn() helper
  hooks/
    use-url-param.ts         # router-free URL query-param state
    use-catalog-params.ts    # category + search filter state
    use-mobile.ts            # (shadcn) mobile breakpoint
  components/
    theme-provider.tsx       # dark/light context
    mode-toggle.tsx          # global dark-mode toggle button
    app-sidebar.tsx          # category sidebar (shadcn)
    tag-filter-bar.tsx       # collapsible tag chips under the header
    tag-pill.tsx             # clickable tag chip (no #), optional count
    component-gallery.tsx    # grid of live previews; top-right icon button opens details
    component-details.tsx    # details page: preview, libraries, metadata, principle/source/prompt
    live-preview.tsx         # preview frame: fit-crop / scale + hover Expand-to-fullscreen overlay
    scaled-preview.tsx       # scales a full-bleed component to fit its frame (used by live-preview)
    copy-button.tsx          # clipboard copy button with feedback
    base/                    # shadcn/ui primitives (generated)
  registry/
    categories.ts            # category catalog (single source of truth)
    libraries.ts             # library catalog (LibraryId + labels)
    types.ts                 # Showcase type + defineShowcase() helper
    prompt.ts                # buildPrompt(): metadata + principle/source -> agent prompt
    registry.ts              # glob auto-discovery + ?raw source, filtering/counts/lookup
    index.ts                 # re-exports
    examples/<id>/           # one folder per showcase:
      demo.tsx               #   the component (rendered live + shown as Source via ?raw)
      showcase.ts            #   defineShowcase({ metadata, Component, principle? })
components.json              # shadcn/ui config (ui alias → components/base)
```

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

Categories and the component catalog live in `src/registry/`:

1. **Create the showcase** anywhere (convention: `src/registry/examples/<name>.tsx`), export a `defineShowcase({...})` with `id`, `name`, `category` (must be a valid `CategoryId`), optional `description`/`tags`, and `Component`.
2. **Register it**: import it into `src/registry/registry.ts` and add it to the `registry` array.
3. Sidebar counts, filtering, and search update automatically.

To add a **new category**, append an entry to `CATEGORIES` in `src/registry/categories.ts` (id + label + lucide icon). Current categories: buttons, cards, modals, hero, navigation, forms, feedback, data-display, animation, backgrounds, text, 3d.

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
    component-gallery.tsx     # filtered grid of showcases
    base/                    # shadcn/ui primitives (generated)
  registry/
    categories.ts            # category catalog (single source of truth)
    types.ts                 # Showcase type + defineShowcase() helper
    registry.ts              # the component list + filtering/counts
    index.ts                 # re-exports
    examples/                # seeded example showcases (safe to delete)
components.json              # shadcn/ui config (ui alias → components/base)
```

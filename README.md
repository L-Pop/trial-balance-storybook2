# Trial Balance Grid — Storybook component set

A React + TypeScript + Storybook implementation of the Figma **Trial Balance
Table** design ([source file](https://www.figma.com/design/YCIOOyXcatc7zjImBIegHP/Trial-Balance-Table)),
scaffolded with `npm create storybook@latest`.

## What's here

Four components — **Toolbar**, **Header Cell**, **Row**, **Cell** — built as
one consistent set (`src/components/trial-balance-grid/`) and composed into a
responsive **Trial Balance grid** mock reference-app screen.

### Component Properties (mirrored 1:1 from the Figma component set)

| Type | Property | Component |
|---|---|---|
| Boolean | `sortable` | Header Cell |
| Boolean | `pinned` | Header Cell |
| Boolean | `editable` | Cell |
| Boolean | `selected` | Row |
| Boolean | `hasError` | Row, Cell |
| Text | `columnLabel` | Header Cell |
| Text | `cellValue` | Cell |
| Text | `searchQuery` | Toolbar |
| Instance swap | `leadingSlot` | Row (status badge) |
| Instance swap | `trailingSlot` | Row (row action) |
| Instance swap | icon slot | Header Cell (unfold / sort-asc / sort-desc / filter) |

### Variants

- **Row** — Default, Hover, Selected, Disabled / read-only, Error
- **Header Cell** — Default, Sorted ascending, Sorted descending, Filter active
- **Cell** — Default, Editing, Error
- **Toolbar** — Default, Search active, Filters applied

`selected` / `hasError` are deliberately modeled as *independent* boolean
badges, separate from the full-variant container treatment — see the Row
"independent badges" story, matching the Figma component's own description.

### Responsive behavior (the "mock reference app screen")

`TrialBalanceGrid` (`src/components/trial-balance-grid/TrialBalanceGrid.tsx`)
composes everything into a "Ledger" app screen and reproduces the exact
collapse order specified on the Figma file's Responsive Demo page:

1. **≥ 900px (desktop)** — all columns inline, no scrolling.
2. **640–899px (tablet)** — Account Name (+ leading status + trailing action)
   freezes to the left/right edges; Debit / Credit / Notes / Ref # scroll
   horizontally beneath it. Notes hides first once the band gets tight
   (< 700px), before the mobile breakpoint.
3. **< 640px (mobile)** — the grid becomes a stacked card list; one card per
   account with label/value pairs, matching the Figma "card fallback" frame.

Layout is measured from the component's own rendered width via
`ResizeObserver` (`useContainerWidth.ts`), so it reacts identically whether
you resize the browser window, switch the Storybook viewport toolbar, or
drag the corner of the **Resizable Container** story.

Three custom Storybook viewport presets (`.storybook/preview.tsx`) pin to
the Figma reference frames exactly: **1280 / 744 / 390**.

## Design tokens

All colors, typography, density spacing and elevation are Material 3
component tokens (`md.comp.data-table.*`) extracted directly from the Figma
file's Design Tokens page, defined as CSS custom properties in
`src/components/trial-balance-grid/tokens.css` (each with the original
Figma token name in a comment).

## Getting started

```bash
npm install
npm run storybook       # dev server on http://localhost:6006
npm run build-storybook # static build → storybook-static/
npm run dev             # plain Vite preview of the grid outside Storybook
```

## Structure

```
src/components/trial-balance-grid/
  tokens.css                 design tokens (colors, type, density, elevation)
  types.ts                   shared Component Properties contract
  icons/Icons.tsx             inline icon set (instance-swap slot defaults)
  Cell.tsx / Cell.stories.tsx
  HeaderCell.tsx / HeaderCell.stories.tsx
  Row.tsx / Row.stories.tsx
  Toolbar.tsx / Toolbar.stories.tsx
  TrialBalanceGrid.tsx        the composed, responsive mock reference screen
  TrialBalanceGrid.stories.tsx
  MobileAccountCard.tsx       card layout used below the mobile breakpoint
  useContainerWidth.ts        ResizeObserver hook driving the responsive layout
  data.ts                     sample account data
  ComponentProperties.mdx     docs overview page
  index.ts                    public barrel export
```

`scripts/` holds the Playwright QA scripts used to screenshot every story and
verify zero console errors during development — not required to use the
components, but handy if you extend them.

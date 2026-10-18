---
name: wavingui
description: The rules for building any screen of a WavingEye product with @wavingeye/ui. Read before adding or changing a component, a screen, a colour, a piece of copy, or anything else a person sees. Covers the token-only rule, the budgets, the gallery rule, the UI-text rule and how a product sets its own accent.
---

# Building a screen with @wavingeye/ui

This skill ships inside the package, so it always matches the installed
version. The rules it summarises live in full beside it, in
`node_modules/@wavingeye/ui/docs/rules/`; read the one a change touches.

## Setup a product does once

- Import the kit's stylesheet **instead of** `tailwindcss`:
  `@import '@wavingeye/ui/wavingui.css';` It brings Tailwind, the theme, the
  motion utilities, the fonts and an `@source` for the kit's own classes.
- Load `theme-init.js` as a blocking script in `<head>` with
  `data-storage-key` naming where the product stores the theme choice. Never
  inline it: the target runtimes forbid inline script.
- Mount `useThemeSync(choice)` once at the root. Wrap the app in
  `LinkProvider` (the product's router link) and, if it is not in English,
  `LabelsProvider`.
- One copy of the kit per bundle. `modal.ts` counts open dialogs in module
  state, so two copies break the floating bar's hiding.

## Rules

1. **Roles only.** Paint with role utilities (`bg-surface`, `text-muted`,
   `border-border`, `bg-accent`, `bg-scrim`). The default Tailwind palette is
   switched off, so `bg-red-500` produces nothing. No hex value, shadow or
   radius is written in a component. (`docs/rules/theme.md`)
2. **A product may change its accent and nothing else.** Generate the five
   accent roles (`accent`, `accent-strong`, `accent-soft`, `accent-on`,
   `accent-wash`) for light and dark with the brand's solver
   (`@wavingeye/brand`, `tools/theme.mjs`) and override them after the kit's
   import. Every other role stays the kit's.
3. **Reuse before building.** Same job, same component. Check the kit's
   exports before writing a control; a new shared component goes into the kit
   with a gallery section in the same change, never into the product.
   (`docs/rules/ux-review-checklist.md`, section K)
4. **Budgets bound attention per state of a surface:** list row at most 3
   elements plus 1 exception marker; action bar at most 5 verbs, then overflow
   (`ACTION_BUDGET`); one chrome bar; one save affordance per settings scope.
   Over budget is a decision (replace, overflow, raise in writing, or ask the
   sponsor), never an append. (`docs/rules/surfaces.md`)
5. **No screen without a surface file** naming its reference product, what is
   taken, what is rejected, deviations and budget. (`docs/rules/surfaces.md`)
6. **Controls:** icon-only controls carry the kit's `Tooltip` and an
   `aria-label`, never `title`; targets are at least 24px; menus follow the APG
   pattern through `AnchoredPopover`; undo over "are you sure", a
   `ConfirmDialog` only for the irreversible. (`docs/rules/icon-only-controls.md`,
   `menus.md`, `action-bars.md`)
7. **Screen text has no em dash, no en dash and no spaced hyphen used as a
   dash.** Split the sentence or use a comma or colon; ranges use "to". Check:
   `node node_modules/@wavingeye/ui/tools/check-ui-text.mjs`.
   (`docs/rules/ui-text.md`)
8. **Runtime-safe:** no inline script, no `eval`, no remote fonts or assets.
   Everything a screen needs ships with the product.

## Where things are

| Need | Use |
|---|---|
| App frame, rail, global bar | `AppFrame`, `Rail`, `TopBar` |
| Light and dark | `ThemeToggle`, `useThemeSync`, `theme-init.js` |
| Page with title and actions | `Page`, `PageHeader` |
| Queue and pick layout | `Workspace` |
| Buttons | `Button`, `IconButton`, `ButtonLink`, `SplitButton` |
| Form fields | class recipes in `field` (`FIELD_INPUT`, `SEARCH_PILL`, `filterPill`) |
| Status | `Badge` |
| Selection and bulk actions | `Checkbox`, `AvatarSelector`, `ActionBar`, `FloatingBar` |
| Feedback | `Toast` with `useToast`, `ConfirmDialog`, `Skeleton*` |
| People | `Avatar`, `Person` |
| Brand mark | `BrandMark` with `mark` from `@wavingeye/brand/<product>/paths.json` |

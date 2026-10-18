# Inward research: what exists today (October 2026)

Step 2 of kagami's `deliver` loop, inward half: what the seed codebase already
has in the categories the kit covers. Written without reading the outward
inventory. Paths are in `SebiShepherd/hikaru` unless stated otherwise; line
numbers refer to commit `cfb0554`.

## Components (`apps/web/src/app/ui/`, 29 source files, 6 specs)

Every component styles itself through token utilities only (`bg-surface`,
`text-muted`, `rounded-field`, `shadow-popover`, `transition-press`), and none
uses a `dark:` variant, so the theme switch is entirely a token swap. All
visible copy is hardcoded English; Hikaru has no i18n layer. React 19 is
assumed (`ref` as a prop, no `forwardRef`, `Button.tsx:69`).

| Component | Class | Coupling to remove | Tests / gallery |
|---|---|---|---|
| Button, IconButton | generic | none | no own spec; IconButton not in gallery |
| ButtonLink | generic after decoupling | react-router `Link` (`Button.tsx:2`) | not in gallery |
| Badge | generic | none | gallery |
| Card, CardTitle, Overline | generic | none | gallery |
| Page, PageHeader | generic | none | not in gallery |
| Kbd | generic | needs `.optical-center` CSS | e2e ink test, gallery |
| Checkbox (incl. indeterminate) | generic | none | gallery indirect only |
| Avatar, AvatarSelector, SelectAll | generic | English default label | via `Person.spec`; SelectAll not in gallery |
| Person, SelectableAvatar | generic | English default `'Unknown'` | `Person.spec` |
| Tooltip | generic | ad hoc `z-[60]` | spec, e2e, gallery |
| AnchoredPopover | generic | none | indirect |
| SplitButton | generic | none | spec, e2e, gallery |
| ConfirmDialog | generic | `'Cancel'` default, `pop-in` CSS | not in gallery |
| Toast, ToastProvider | generic | `'Undo'`/`'Dismiss'`, `drain`/`pop-in` CSS | gallery |
| FloatingBar | generic | `modal.ts` singleton | via `ActionBar.spec`, gallery |
| ActionBar (`ACTION_BUDGET = 5`) | generic | its spec imports `support/BulkActionBar` | spec |
| Workspace (template) | generic | hardcoded breakpoints, English aria copy | gallery |
| Skeleton family, `useDelayedFlag` | generic | `.skeleton` CSS | four of six in gallery |
| HexColorPicker | generic after decoupling | `BRAND_PRESETS` constant (`:11`) | spec, gallery |
| `field.ts` recipes (`FOCUS_RING`, `FIELD*`, `POPOVER`, `MENU_ITEM`, `NAV_ROW*`, pills) | generic | must be scanned by Tailwind | partly in gallery |
| `modal.ts`, `opticalText`, `color.ts`, `useMediaQuery` | generic | `modal.ts` is a module singleton | `color.spec` |
| `when.ts` (`shortWhen`) | generic after decoupling | English units; spec lives in `support/` | indirect |
| BrandMark | generic after decoupling | imports `public/brand/marks.json` by relative path | `tools/check-brand.mjs`; not in gallery |
| `icons.ts`, RelatedRecords | domain | module registry, tRPC | none |

Candidates outside `ui/` that import only `ui/`: `support/SelectMenu.tsx`,
`support/FilterMenu.tsx`, `settings/SectionForm.tsx` (with `unsaved.tsx`). There
is no shared Menu, Radio or Select primitive; `AccountMenu` hand-rolls
`role=menu`, and its roving focus (`AccountMenu.tsx:71-107`) is the seed of one.

**Shell** (`apps/web/src/app/shell/`): the frame of `AppShell`, the icon rail in
`Sidebar`, the bar and `ThemeToggle` in `TopBar`, the dialog of
`CommandPalette` and the pure functions of `prefs/theme.ts` are generic once
tRPC, auth, org and server preferences are taken out. The pre-paint theme script
is inline in `apps/web/index.html:31-44`.

**Portal** (`apps/portal`) shares nothing: no imports from `ui/`, controls styled
inline, and `styles.css` is a stale copy of the old dark violet theme.

Size of the generic set: about 3,750 raw lines (2,290 without comments) in 27
files, 733 lines of specs, about 750 lines of shell of which roughly half
survives decoupling.

## Tokens and CSS (`apps/web/src/styles.css`, 442 lines)

- Light set in `@theme` (`:88-168`), dark as a `.dark {}` override (`:204-252`),
  `@custom-variant dark` (`:19`).
- All 22 roles of wavingbrand's vocabulary are present under the same names,
  plus `brand-navy`, `brand-tile`, `brand-tile-on` (identity layer) and nine
  `tag-*` colours in `@theme static` (domain).
- Shadows card, popover, bar; radii field, card, pill; one easing and three
  durations with `@utility transition-*`; Instrument Sans and IBM Plex Mono via
  six `@font-face` blocks with absolute `/fonts/` URLs.
- No type scale: `text-[13.5px]` 34 times, `[13px]` 26, `[12.5px]` 20 and more.
  No spacing or size tokens. `rounded-[10px]` 60 times untokenised; the
  "bubble" radius budgeted in `theme.md` has no token.
- Unlayered classes components depend on: `.skeleton`, `.rise`, `.fade-in`,
  `.pop-in`, `.drain`, `.optical-center`; global resets including
  `#root { height: 100% }`.
- Implicit roles with no token: scrim (`bg-fg/45`), tooltip (inverted `bg-fg`),
  focus ring (`ring-accent-wash`, about 1.1:1 on white, so focus rests on
  `border-accent` alone).
- Fonts are SIL OFL 1.1, and no licence text ships with them. wavingbrand
  ships `brand/fonts/OFL.txt` for Montserrat.

## Against wavingbrand

- `node tools/theme.mjs brand/themes/paper.json` emits the same names and the
  same `.dark` mechanism, so the solver is drop-in. Its values differ: `subtle`
  `#736d64` / `#888c99` against Hikaru's `#8f8a81` / `#7c8290`; lower-chroma
  status colours; `bg` loses most of Paper's warmth (`#fafafa` against
  `#fbfaf8`).
- hikaru#592 recomputed: `subtle` on `surface-raised` is 3.04:1 light and 3.93:1
  dark; the solver's values clear 4.5:1. `theme.md`'s "3.4:1" is wrong.
- wavingbrand's standalone `dist/tokens/theme.css` uses other names (`--we-*`)
  and a `[data-theme]` strategy, which matches neither the vocabulary nor
  Hikaru.
- Non-colour tokens (shadow, radius, motion, type) are outside wavingbrand's
  scope and have no owner.

## Rules written down

Product-agnostic and ready to move: `docs/design/surfaces/theme.md` (budgets for
accent, status hues, button variants, radii, shadows, motion; controls draw their
own states; edges that carry meaning use `subtle`), `gallery.md` (gallery
without Storybook, no network, every state), `menus.md` (WAI-ARIA APG, one
popover recipe, no positioning library), `icon-only-controls.md` (own tooltip,
24px target), `action-bars.md` (bar grammar, five verbs, undo over confirm), the
surface-file template and budgets in `surfaces/README.md`, most of
`docs/specs/ux-review-checklist.md` (sections B, C, E to K), `docs/design/ui-text.md`
with `tools/check-ui-text.mjs`, and the level map in `docs/specs/ui-templates.md`.
Section D of the checklist and every per-screen surface file stay in Hikaru.

## Verification

- `apps/web-e2e/src/ux-screenshots.spec.ts` shoots `/ui-gallery` at 1440, 1024
  and 820 for a judging agent.
- `visual-baseline.spec.ts` keeps a 1280x720 gallery baseline.
- `component-states.spec.ts` (343 lines) checks insets, menu widths, caret
  placement and glyph centring (`ink.ts`, pixel measurement with `sharp`) in
  both themes; everything but the tag test is generic.
- The gallery (`routes/UiGalleryPage.tsx`, 889 lines) is a dev route inside the
  authenticated shell, so it needs a login and the API, and it mixes domain
  components into the generic ones.
- kagami treats `ui/` and `shell/` as shared and the gallery as a surface.

## Risks for extraction

1. App imports inside components (`Button.tsx:2`, `BrandMark.tsx:1`) and specs
   that import domain code.
2. `modal.ts` counts open modals in module state; two copies of the kit in one
   bundle silently break FloatingBar hiding. React and the kit must be
   deduplicated.
3. Components depend on CSS that is not theirs: unlayered classes, utilities,
   theme keys, absolute font URLs, an ad hoc z-index scale.
4. Tailwind does not scan `node_modules`, so the kit's class strings are not
   generated without an `@source`.
5. Peer dependencies: React 19, Tailwind 4.3, lucide-react.
6. WebKitGTK versions vary by distro; `h-dvh` and `scrollbar-gutter` need
   checking there.
7. Hardcoded English copy in seven components.
8. Moving the gallery out of the shell changes every gallery baseline.
9. Documentation drift (`theme.md`'s contrast figure, the duplicated token table
   in `docs/design/README.md`, the portal's stale theme).

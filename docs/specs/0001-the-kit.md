# Spec 0001: the kit

Status: **draft, awaiting sponsor review.** Nothing is built before this is
approved.

Inputs: [`../research/outward.md`](../research/outward.md) (what the reference
kits do) and [`../research/inward.md`](../research/inward.md) (what Hikaru has).
Step 3 of kagami's `deliver` loop.

## What the kit is for

Every WavingEye product with a screen gets the same visual and interaction layer
without re-deciding it, and a change to that layer is made once and reaches
every product by a version bump. The kit owns what a screen is made of: tokens,
fonts, primitives, templates, the rules that bound them, and the machinery that
proves them. It does not own what a screen is for. UX and product decisions
stay with each product.

## Where it sits

```
wavingbrand   identity (mark, brand colours), role vocabulary, theme solver
     |
wavingui      theme values, non-colour tokens, fonts, components, rules, gallery
     |
products      Hikaru (web, portal), KnowYourLimit, later ones
```

wavingbrand keeps colour as identity and the contract every theme must satisfy.
wavingui supplies a theme that satisfies it and everything that is not colour.
The kit's CI runs wavingbrand's `tools/validate.mjs` against its own theme, so a
theme that breaks the brand's floors cannot ship.

## Decisions this spec makes

Each is argued from the research; the alternatives are in the exclusions.

1. **One versioned package, installed from a git tag.** Name `@wavingeye/ui`,
   next to `@wavingeye/brand`, consumed as
   `github:SebiShepherd/wavingui#vX.Y.Z`. The goal is "change once, every app
   follows", which a package gives and a copy-in registry does not
   (outward: distribution). Divergence goes through escape hatches on every
   component (`className`, `data-slot`), not through copies.
2. **Extraction first, unchanged.** v1 moves the generic set out of Hikaru with
   its behaviour and appearance intact, decoupled from Hikaru's router, API and
   copy. Redesigning while moving would re-baseline every screen twice and make
   the move unreviewable (Hikaru's rule 4: restructure before extension).
3. **Tailwind v4 is the styling contract.** The kit ships one CSS entry with
   `@theme`, the `.dark` override, `@utility` definitions, the classes
   components depend on, `@font-face` with relative URLs, and an `@source` that
   points Tailwind at the kit's own files, so a consumer adds one import and
   nothing else (inward risks 3 and 4).
4. **The gallery is the kit's product surface, built without Storybook.** A
   standalone Vite page with no login and no network, every component in every
   state, both themes, shot by Playwright. This keeps Hikaru's existing decision
   (`surfaces/gallery.md`) and its existing harness (outward: state coverage,
   Playwright `mount()` as the reference closest to it).
5. **The kit ships its rules for agents.** A skill inside the package, matched
   to the installed version, states the budgets, the token-only rule, the
   gallery rule and the UI-text rule, so an agent building any product reads
   the kit's rules for the version that product has installed (Porsche v4
   pattern, outward).
6. **Every consumer surface must work in every target runtime.** No inline
   script, no eval, no remote asset, fonts as files, CSS only. This satisfies
   Tauri, Electron and MV3 content security policies at once (outward:
   runtimes). The pre-paint theme snippet ships as a file for that reason.

## Capabilities

Priority: **P1** is v1 and blocks the first consumer migration. **P2** is v1 if
it fits the packet. **P3** is a named follow-up, not in v1.

### Tokens and theme

| # | Capability | Reference behaviour | Exists in Hikaru | Gap | P |
|---|---|---|---|---|---|
| T1 | 22 colour roles, light and dark | role tokens fixed across themes (Carbon, shadcn) | all 22, same names | move; fix `subtle` (hikaru#592) | P1 |
| T2 | Palette utilities unavailable, roles only | `--color-*: initial` (Tailwind) | not enforced | reset the default palette in the kit CSS | P1 |
| T3 | Non-colour tokens: 3 shadows, radii, easing, 3 durations | tokens for every themable value | present except a bubble radius | move; add the missing radius as a token | P1 |
| T4 | Implicit roles named: scrim, tooltip, focus ring | named roles for every surface and state (Carbon layers) | written as literals | name them; the focus ring must reach 3:1 (WCAG 2.4.11) | P1 |
| T5 | Theme validated against wavingbrand floors in CI | brand-owned contract | `tools/check-brand.mjs` in Hikaru | run `validate.mjs` in the kit | P1 |
| T6 | Theme input expressed for the solver | DTCG source, compiled | `brand/themes/paper.json` exists in wavingbrand | decide values (sponsor question 1) | P1 |
| T7 | z-index scale | named layers | ad hoc 10 to 60 | tokenise | P2 |
| T8 | Type scale and spacing tokens | standard in every reference | absent; 100+ arbitrary sizes | follow-up, it touches every screen | P3 |
| T9 | High-contrast theme | Primer | absent | follow-up | P3 |

### Components

| # | Capability | Reference behaviour | Exists in Hikaru | Gap | P |
|---|---|---|---|---|---|
| C1 | Button, IconButton, ButtonLink | variants plus link rendering without a router dependency | yes; ButtonLink imports react-router | take a link component as a prop | P1 |
| C2 | Badge, Card, Page, Kbd, Checkbox, Skeleton | | yes | move | P1 |
| C3 | Avatar, Person | | yes | label props | P1 |
| C4 | Tooltip, AnchoredPopover, SplitButton | portal, flip, APG keyboard behaviour | yes | move | P1 |
| C5 | ConfirmDialog, Toast | focus trap, undo | yes | label props | P1 |
| C6 | FloatingBar, ActionBar, Workspace | | yes | breakpoints as props; decouple spec | P1 |
| C7 | `field.ts` recipes | exported class recipes | yes | move | P1 |
| C8 | BrandMark | mark from the brand package | reads an app file | take `paths.json` data from `@wavingeye/brand` | P1 |
| C9 | Copy as props with English defaults | label props or a labels context | hardcoded in seven places | add | P1 |
| C10 | HexColorPicker, SelectMenu, FilterMenu, SectionForm | | yes | presets as a prop | P2 |
| C11 | Menu, Select, Radio primitives | headless layer (Base UI) | absent; AccountMenu hand-rolls one | follow-up, decide Base UI there | P3 |
| C12 | Command palette shell | | domain-wired | follow-up | P3 |

### Shell

| # | Capability | Reference behaviour | Exists in Hikaru | Gap | P |
|---|---|---|---|---|---|
| S1 | AppFrame with rail, bar and main slots | | inside AppShell | extract the frame | P1 |
| S2 | Rail (56px icon navigation) | | Sidebar, tRPC-fed | items as props | P1 |
| S3 | ThemeToggle and theme functions (system, light, dark) | root attribute or class | yes, bound to server preferences | storage injected by the product | P1 |
| S4 | Pre-paint theme snippet as a file | no inline script (MV3, Tauri CSP) | inline in `index.html` | ship `theme-init.js` with a configurable key | P1 |

### Gallery and verification

| # | Capability | Reference behaviour | Exists in Hikaru | Gap | P |
|---|---|---|---|---|---|
| G1 | Standalone gallery, every state, both themes, no network | Storybook practice without Storybook | inside the authenticated shell | new Vite page with the generic sections | P1 |
| G2 | Visual baselines of the gallery | Chromatic modes; `toHaveScreenshot` | one 1280x720 frame | per theme, at the kit's frames | P1 |
| G3 | Component-state checks | interaction tests per story | `component-states.spec.ts`, `ink.ts` | move the generic part | P1 |
| G4 | Unit specs | | six specs | move, decouple from `support/` | P1 |
| G5 | axe on the gallery | axe per story (all references) | absent | add | P2 |
| G6 | UX-judge screenshots at 1440, 1024, 820 | | yes | move | P2 |
| G7 | kagami configuration for the kit | | n/a | `kagami.config.mjs`, gallery as the surface | P2 |

### Rules

| # | Capability | Exists in Hikaru | Gap | P |
|---|---|---|---|---|
| R1 | Theme budgets and control rules | `surfaces/theme.md` | move, correct the contrast figure | P1 |
| R2 | Menus, icon-only controls, action bars | `surfaces/menus.md`, `icon-only-controls.md`, `action-bars.md` | move the generic parts | P1 |
| R3 | Surface-file template and budgets | `surfaces/README.md` | move | P1 |
| R4 | UX review checklist, generic sections | `docs/specs/ux-review-checklist.md` B, C, E to K | move | P1 |
| R5 | UI-text rule and its check | `docs/design/ui-text.md`, `tools/check-ui-text.mjs` | move | P1 |
| R6 | Agent skill in the package | absent | write it from R1 to R5 | P1 |

### Distribution and runtimes

| # | Capability | Reference behaviour | Gap | P |
|---|---|---|---|---|
| D1 | Semver tags; a tag builds a release | Primer, Porsche; wavingbrand's own release flow | add | P1 |
| D2 | Peer dependencies React 19, Tailwind 4.3, lucide-react; one copy of the kit per bundle | | declare; document the `modal.ts` singleton | P1 |
| D3 | Fonts with their OFL texts | OFL requires the licence to travel with the font | add both licences | P1 |
| D4 | Browser floor documented (Tailwind v4: Safari 16.4, Chrome 111, Firefox 128) | | write it; checking WebKitGTK is part of KYL's architecture step | P1 |
| D5 | Component status labels | Primer | follow-up | P3 |

## Consumers in v1

1. **Hikaru web** moves onto the kit and deletes its copies. Its screens must
   look the same, apart from the `subtle` fix and whatever sponsor question 1
   changes. This is a Hikaru packet on Hikaru's board.
2. **Hikaru portal** moves onto the kit. It shares nothing today, so it is the
   proof that the kit works for a consumer that did not grow it.
3. **KnowYourLimit** consumes it from its first screen.

## Acceptance criteria

Each is checkable on the running gallery or in a consumer without reading code.

1. The gallery opens from a fresh clone with one install and one command, with
   the network disabled, and shows every P1 component in every variant,
   disabled, empty and busy state, in light and dark.
2. A Tailwind default palette class such as `bg-red-500` produces no style in a
   consumer.
3. Changing one role value in the kit and bumping the version changes that colour
   in Hikaru web and the portal with no edit in either repository.
4. Every text-carrying role pair in both themes clears wavingbrand's floors; the
   kit's CI fails when one does not.
5. Keyboard focus is visible on every interactive component at 3:1 or better
   against its surroundings.
6. Hikaru web's visual baselines show no difference after the move except the
   documented `subtle` change.
7. The portal renders with the kit's fonts, theme and components, in both
   themes.
8. A page using the kit loads under a content security policy of
   `script-src 'self'; style-src 'self'; font-src 'self'` with no violation in
   the console.
9. An agent in a consuming repository finds the kit's rules in
   `node_modules/@wavingeye/ui/` without network access.
10. Two products installing the kit never bundle two copies of it.

## Exclusions, with reasons

- **A shadcn-style copy-in registry**, alone or as a hybrid. With two products
  and one developer, pulling every change into every app by hand costs more
  than designing escape hatches, and drift is the failure being designed out.
  Revisit when a product needs to diverge structurally.
- **Moving existing components onto Base UI.** It is the reference's behaviour
  layer, and new primitives (C11) are where to decide it. Rewriting working,
  tested components during an extraction would make the move unreviewable.
- **Storybook and Chromatic.** Hikaru rejected Storybook for its gallery, and
  the Playwright harness already exists; Chromatic adds a paid service for one
  reviewer.
- **Type scale and spacing tokens (T8).** Right and overdue, but they change
  every screen of every consumer, so they get their own packet after the move.
- **An i18n library.** Label props cover every current need.
- **Domain components** (tag colours, related records, module icon map,
  notifications feed, account menu): they stay in Hikaru.
- **Native toolkits (GTK, Qt) and React Native.** A native product would take the
  tokens only.

## Declared inventions

- The package name `@wavingeye/ui`, chosen to sit beside `@wavingeye/brand`.
- `theme-init.js` as a shipped file rather than a documented inline snippet,
  because every target runtime forbids inline script.
- Naming scrim, tooltip and focus-ring roles (T4). The references name layer and
  state roles; these three names are ours.

## Questions for the sponsor

These are about what the kit should be, so they are yours. Everything else above
is settled by the research unless you overrule it.

1. **Theme values.** (a) Keep Paper exactly, fixing only `subtle`. Screens stay
   as they are. (b) Adopt the solver's output in full. One source of truth for
   values, but Paper loses most of its warm ground and its status colours get
   duller. Recommendation: **(a) now**, and make the solver reproduce Paper,
   which is wavingbrand#4's open problem, before switching.
2. **One look or one family.** (a) Every product uses Paper unchanged. (b) Every
   product may set its own accent hue through the solver, the rest stays
   shared. Recommendation: **(b)**, because it costs one input file per product
   and lets KYL be told apart from Hikaru at a glance, while everything that
   makes the screens work stays identical.

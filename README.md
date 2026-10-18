# wavingui

The interface layer every WavingEye product shares: the theme "Paper", tokens,
fonts, components, the rules that bound them, and the gallery that proves them.
Brand identity and the colour contract live in
[wavingbrand](https://github.com/SebiShepherd/wavingbrand); this kit builds on
them and its CI holds the theme to the brand's floors.

```
npm ci
npm run check      # typecheck, build, unit specs, gates
npm run gallery    # the gallery, at http://localhost:4310
npm run e2e        # the built gallery under the runtime CSP, with state checks
npm run baselines  # re-render the visual baselines; this is how a change is approved
```

## Using it in a product

```
npm i github:SebiShepherd/wavingui#v0.1.0
```

Peer dependencies: React 19, Tailwind 4.3, lucide-react.

```css
/* Instead of @import 'tailwindcss': */
@import '@wavingeye/ui/wavingui.css';
```

```html
<script src="/theme-init.js" data-storage-key="myapp.preferences"></script>
```

Copy `node_modules/@wavingeye/ui/theme-init.js` into the product's public
directory, or serve it from there. It is a file because no target runtime allows
inline script.

```tsx
import { AppFrame, LinkProvider, Rail, ToastProvider, useThemeSync } from '@wavingeye/ui';
```

Agents building a product read `node_modules/@wavingeye/ui/skills/wavingui/SKILL.md`,
which matches the installed version, and the full rules in `docs/rules/`. The
UI-text check runs in any product:
`node node_modules/@wavingeye/ui/tools/check-ui-text.mjs`.

## A product's own accent

Every product uses the same theme except the accent. Generate the five accent
roles for light and dark with wavingbrand's solver and override them after the
import. Everything else stays the kit's, so a change here reaches every product
by a version bump.

## What is here

| Path | What it holds |
|---|---|
| `css/wavingui.css` | the theme, light and dark, the motion utilities, the classes components depend on, the fonts |
| `css/fonts/` | Instrument Sans and IBM Plex Mono, with their OFL licences |
| `src/` | components, shell, theme functions, `LinkProvider`, `LabelsProvider` |
| `dist/` | the build of `src/`, committed so a git install needs no compile; `gates/check-dist.mjs` keeps it exact |
| `theme-init.js` | the pre-paint theme script |
| `gallery/` | every component in every state, no network |
| `e2e/` | the gallery checks and the visual baselines |
| `gates/` | the theme against the brand's floors, the palette reset, dist/ against a fresh build |
| `tools/check-ui-text.mjs` | the UI-text rule, shipped for products to run |
| `docs/rules/` | the rules: theme, surfaces and budgets, menus, icon-only controls, action bars, gallery, UI text, templates, the UX review checklist |
| `skills/wavingui/` | the rules for agents, shipped in the package |
| `docs/specs/`, `docs/research/` | why the kit is shaped this way |

## Layers above the page

The kit uses a fixed z-order: 10 raised inside a component, 30 floating bars,
40 menus and pickers, 50 dialogs, popovers and toasts, 60 tooltips. A new layer
is a decision recorded here.

## Releasing

A version is a git tag on a commit whose gates are green. `dist/` is committed
and checked against a fresh build, so the tag is the release.

## Licensing

Code: Apache-2.0 (`LICENSE`). Fonts: SIL Open Font License 1.1, licences beside
the files in `css/fonts/`. The WavingEye mark is not part of this repository;
products pass it in from wavingbrand, under wavingbrand's terms.

# Outward research: what a shared UI kit is expected to be (October 2026)

Step 2 of kagami's `deliver` loop, outward half. Written without reading any
local code, so the inventory is not shaped by what already exists. Claims carry
their source; anything that could not be confirmed is marked _(unverified)_.

**References.** shadcn/ui, Radix Primitives, React Aria Components, Base UI,
GitHub Primer, IBM Carbon, Porsche Design System, Storybook 10, Chromatic,
Playwright component testing, Ladle, DTCG, Style Dictionary, Tailwind v4.
Chromatic is added next to Storybook because it is the default visual-regression
service for stories. Playwright `mount()` is added because it is stable and fits
an existing Playwright harness. Histoire is dropped: Vue-first, no React
consumer here.

## Facts from 2025 and 2026 that change the picture

- **DTCG is stable.** Version 2025.10 (2025-10-28) adds theming and multi-brand
  support, Display P3 and OKLCH colour, aliases and component-level references.
  It is a Community Group report, not on the W3C Standards Track
  ([W3C CG](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/),
  [FAQ](https://www.designtokens.org/faq/)).
- **Style Dictionary lags it.** v4 reads DTCG; full 2025.10 support is "work in
  progress in v5" ([docs](https://styledictionary.com/info/dtcg/)).
- **shadcn defaults to Base UI since July 2026.** Radix is not deprecated, new
  components ship for both, `-b radix` keeps Radix, and a migration skill moves
  components one at a time
  ([changelog](https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default)).
- **shadcn CLI v4 (March 2026)** adds `--diff` ("checks for registry updates so
  you can merge them with local changes"), `--dry-run`, `--view`, presets,
  `registry:base` for a whole design system in one payload, `registry:font`,
  `shadcn info` and agent skills
  ([changelog](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4)).
- **shadcn registries can be private GitHub repositories (August 2026).** Items
  are addressed as `owner/repo/item`, authenticated through `gh` locally and
  `GH_TOKEN` in CI, read pinned to the resolved commit
  ([changelog](https://ui.shadcn.com/docs/changelog/2026-08-private-github-registries));
  `registryDependencies` accept a tag or a SHA
  ([registry-item](https://ui.shadcn.com/docs/registry/registry-item-json)).
- **Base UI** (`@base-ui/react` 1.9.0) is unstyled and tree-shakable, and wants
  `isolation: isolate` on the app root for portalled popups
  ([quick start](https://base-ui.com/react/overview/quick-start)).
- **Storybook 10** (2025-10-28) is ESM-only; its Vitest addon runs stories as
  real-browser tests with a11y checks
  ([blog](https://storybook.js.org/blog/storybook-10/),
  [Vitest addon](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon)).
- **Playwright component testing is stable** as `fixtures.mount()`; it mounts on
  a gallery page you own, and `toHaveScreenshot` works on the mounted locator
  ([docs](https://playwright.dev/docs/test-components)).
- **Porsche v4 ships an agent knowledge skill inside its npm packages**,
  generated from the docs, so it always matches the installed version
  ([PDS](https://designsystem.porsche.com/v4/skills/knowledge/)).

## Inventory

### Distribution

| Capability | shadcn/ui | Headless (Radix, RAC, Base UI) | Primer | Carbon | Porsche | table-stakes? |
|---|---|---|---|---|---|---|
| Delivery | source copied into the app by CLI from a registry | npm | npm (`@primer/react`, `@primer/primitives`) | npm monorepo | npm per framework over web components | yes |
| Private distribution | namespaced registries with auth ([auth](https://ui.shadcn.com/docs/registry/authentication)); private GitHub repos | n/a | n/a | n/a | n/a | yes for a private kit |
| Whole-system payload | `registry:base`, presets | no | tokens package | themes package | `/tokens` export | yes |
| Agent integration | MCP server, skills | RAC: MCP, skills, llms.txt | no | no | version-matched skill in the package | expected in 2026 |

### Theming and tokens

| Capability | shadcn/ui | Primer | Carbon | Porsche | Tailwind v4 / DTCG | table-stakes? |
|---|---|---|---|---|---|---|
| Semantic role tokens | CSS vars in `:root`/`.dark` through `@theme inline`, OKLCH ([v4](https://ui.shadcn.com/docs/tailwind-v4)) | base and functional tiers | roles fixed across themes ([themes](https://carbondesignsystem.com/elements/themes/overview/)) | JS token objects | `@theme` namespaces, reset with `--color-*: initial` ([theme](https://tailwindcss.com/docs/theme)) | yes |
| Mode switching | `.dark` class | `data-color-mode` and friends | four themes | `color-scheme` + `light-dark()` | custom variant _(unverified)_ | yes |
| Layer and state roles | no | no | `$layer-01..03` with hover, active, selected ([tokens](https://carbondesignsystem.com/elements/color/tokens/)) | no | no | yes |
| Accessibility themes | no | high contrast, colour-blind, dimmed | no | no | multi-brand in DTCG | nice to have |
| Sharing across packages | `cssVars` on registry items | npm CSS | Sass | several integrations | shared `theme.css`; a package must be scanned with `@source`, node_modules is ignored by default ([source](https://tailwindcss.com/docs/detecting-classes-in-source-files)) | yes |

### Component layer and accessibility

| Capability | shadcn/ui | Radix | React Aria | Base UI | Primer / Carbon / Porsche | table-stakes? |
|---|---|---|---|---|---|---|
| Behaviour layer | Base UI default, Radix optional | own primitives | hooks plus components | unstyled, one package | styled, opinionated | yes: a headless layer, no hand-rolled ARIA |
| Styling hooks | `data-slot` on every part | `data-state` | state data attributes, render props ([RAC](https://react-aria.adobe.com/getting-started)) | `className`, examples for Tailwind | shadow DOM (Porsche) | yes |
| React 19 idiom | no `forwardRef`, `React.ComponentProps` | | | | | yes |
| a11y testing | | | forced-colours handling | | Carbon runs IBM's checker | yes: axe in CI |

### State coverage and visual testing

| Capability | Storybook 10 | Chromatic | Playwright `mount()` | Ladle | table-stakes? |
|---|---|---|---|---|---|
| State catalogue | CSF, tags | uses stories | a gallery page you own | CSF on Vite ([ladle.dev](https://ladle.dev/)) | yes |
| Interaction tests | play functions as Vitest browser tests | runs them | Playwright tests | no | yes |
| Visual regression | through Chromatic | snapshots, TurboSnap, modes for theme, viewport and locale ([docs](https://www.chromatic.com/docs/)) | `toHaveScreenshot`, baselines in the repo | no | yes |
| a11y | axe addon | axe per component | `@axe-core/playwright` _(unverified)_ | axe | yes |

### Documentation, versioning, drift

| Capability | Reference behaviour | table-stakes? |
|---|---|---|
| Per-component docs with live examples | all of shadcn, Primer, Carbon, Porsche, RAC | yes |
| Status labels | Primer: Experimental, Ready, Deprecated; breaking a Ready component is a major with a migration path ([status](https://primer.style/status), [lifecycle](https://primer.style/guides/component-lifecycle)) | yes |
| Semver | Primer and Carbon per package; Porsche per library ([versioning](https://designsystem.porsche.com/v3/must-know/versioning/)); shadcn per item pinned by tag or SHA | yes |
| Drift detection | shadcn `add --diff` and `shadcn info`; a package has no copies to drift | yes when copying |
| Migration aids | codemods, deprecation notes, agent migration skills | yes |
| Machine-readable docs | `shadcn docs`, RAC llms.txt, Porsche skill | expected in 2026 |

### Runtimes the kit has to work in

| Runtime | Engine | What constrains a kit |
|---|---|---|
| Tauri v2 on Linux | the distro's WebKitGTK ([prerequisites](https://v2.tauri.app/start/prerequisites/), [versions](https://v2.tauri.app/reference/webview-versions/)) | engine version varies by distro; CSP with nonces and hashes ([CSP](https://v2.tauri.app/security/csp/)) |
| Electron | bundled Chromium | CSP, context isolation, sandbox, custom protocol instead of `file://` ([security](https://www.electronjs.org/docs/latest/tutorial/security)) |
| MV3 extension | Chrome, Firefox | popup at most 800x600 ([action](https://developer.chrome.com/docs/extensions/reference/api/action), [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Popups)); `script-src 'self'`, no inline script or eval ([CSP](https://developer.chrome.com/docs/extensions/mv3/manifest/content_security_policy/)); no remote JS or WASM ([RHC](https://developer.chrome.com/docs/extensions/develop/migrate/remote-hosted-code)) |
| Capacitor 8 on Android | system WebView | floor is Chrome 60 ([docs](https://capacitorjs.com/docs/android)), below Tailwind v4's Chrome 111 |

## The distribution decision

**A versioned package** gives "change once, every app follows": one bump per
app, semver, deprecation warnings, a version-matched skill inside the package.
It costs escape hatches designed in advance, and every local tweak becomes an
API change or a fork.

**A copy-in registry** gives apps their own source, which agents edit directly,
and `--diff` reports upstream changes. It costs one manual merge per app per
change, and a behaviour fix has to be pulled everywhere.

**A hybrid** splits by how often a layer must stay identical. Tokens, theme CSS,
fonts, icons and the few primitives whose behaviour must not diverge go in the
package. Composites that apps are expected to adapt go in a registry, pinned and
diff-reported. It works only under one rule: components reference role tokens,
never palette values, so a copied component follows a theme change without being
re-pulled.

## Ranked by impact for this situation

1. Role tokens as the only styling vocabulary, palette utilities removed.
2. DTCG as the single source, compiled by a pinned build step.
3. A distribution model chosen deliberately (package, registry or hybrid).
4. A headless behaviour layer behind every interactive component.
5. A gallery with one story per state.
6. Visual regression across theme and viewport.
7. axe on every story in CI.
8. Drift detection in every consumer.
9. A version-matched agent skill shipped with the kit.
10. Status labels and a deprecation lifecycle.
11. A runtime-safe build: no inline script, no eval, no CDN, local fonts.
12. A documented browser floor, checked against the oldest WebKitGTK.
13. Theme and density as attributes on the root.
14. Compact layouts for small surfaces (800x600 popups, phone widths).
15. Escape hatches on every component (`className`, `data-slot`, `render`).

## What the runtimes demand

Avoid: remote JS or WASM, inline `<script>`, `eval`, runtime CSS-in-JS that
injects un-nonced styles, remote fonts, unfallbacked post-2023 CSS
(`light-dark()` needs Safari 17.5 and Chrome 123,
[caniuse](https://caniuse.com/mdn-css_types_color_light-dark); see
[Tailwind compatibility](https://tailwindcss.com/docs/compatibility)), `file://`
assumptions, fixed widths over 800 px, hover-only affordances.

Provide: a documented floor (Tailwind v4 needs Safari 16.4, Chrome 111, Firefox
128; the WebKitGTK-to-Safari mapping is _(unverified)_ and has to be tested on
the oldest target distro); a portal root with `isolation: isolate`; compact
density; focus handling that survives popup close-on-blur
([Chrome](https://developer.chrome.com/docs/extensions/develop/ui/add-popup));
either pre-built CSS or `@source` instructions for consumers.

## Gaps

Style Dictionary v5 status was confirmed only from its docs. Radix maintenance
was inferred from release cadence. The WebKitGTK-to-Safari mapping is
unverified. Chromatic's free quota was not checked.

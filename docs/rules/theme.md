# Surface: theme

> Carried over from Hikaru, where these rules were learned. Issue numbers such as #352 refer to `SebiShepherd/hikaru`; "the sponsor" is whoever owns the product applying the rule.

Reference: Linear (primary), Height and Notion (secondary), Freshdesk (density
check for the inbox in a light set)

Taken: a warm off-white ground with white panels rather than a grey one, so a
dense list reads as paper and not as a spreadsheet; one accent used only for
navigation state, the primary action, links and the unread dot; elevation
instead of outline, with borders kept for structural edges (pane dividers,
table rules, the edge of a card that meets a filled surface); pills for buttons,
search and filters; light and dark as equal token sets behind a class on `<html>`
with the theme stored as a per-person preference; skeletons in the shape of the
awaited content; ⌘K answering with records and actions together.

Rejected: a second accent for "secondary" actions (a bordered pill on the page
ground carries that meaning without spending a hue); a solid red destructive
button (it competes with the primary action at rest and is almost never what the
screen wants next, so destructive is a wash with the hue as its text); gradients
and tinted panel backgrounds (they make a status wash unreadable wherever they
land under one); an inverted dark toast (the app already has one floating-bar
vocabulary and a second surface for the same idea is the defect this file
exists to stop); a theme kept in `localStorage` (somebody who works in dark on
one machine means it on the next one).

Deviation:

- The choice is `system | light | dark`, not `light | dark`. The handoff asks
  for the initial value to come from `prefers-color-scheme`, which is what
  `system` is; making it a stored answer means somebody who has never chosen is
  not silently pinned to whatever their operating system said the first time
  they signed in. The chrome toggle flips between the two concrete sets; the
  third answer lives in the profile section, where it is a setting rather than
  a switch.
- The module rail stays a left rail at phone width instead of becoming a bottom
  bar. That is an information-architecture change with its own reachability
  suite (`apps/web-e2e/src/responsive.spec.ts`), and this change is a surface
  change. Tracked separately.
- Tag hues are tokens with a value per set rather than the one palette in the
  handoff. A hue tuned to carry text on a dark panel is invisible on white, and
  a tag stores the name, so what the name resolves to is the theme's business.

Budget:

- Colour roles: one accent, three status hues (success, warning, danger), each
  with exactly one wash. A fourth status hue is a new meaning.
- Button variants: five (primary, secondary, danger, warning, ghost), two sizes.
  A sixth is a decision, and overriding a variant's colour from a caller is not
  one - the override and the variant set the same property, so which wins is
  whatever order the stylesheet happened to emit.
- Radii: four (field 12, card 14, bubble 16, pill). Login's 18 is the one
  exception and it is written here.
- Elevation: three shadows (card, popover, floating bar). Anything that needs a
  fourth is one of those three.
- Motion: one easing, three durations (press 140, panel 240, overlay 200).
- Keyboard hints: one cap (`ui/Kbd`), 20px tall with an explicit line box,
  wherever a shortcut is named. There were three renderings of this and two
  were bare characters; a persona read the loose `L` on the layout toggle as a
  broken glyph, which is what a stray capital against a word looks like (#230).
  Whether a hint shows at all stays with the caller, because a keyboard hint on
  a device with no keyboard is noise.
- Form controls the platform draws for itself: **none of them.** `accent-color`
  looked like the cheap answer for the checkbox - one property, native
  semantics, an `indeterminate` that keeps working - and it tints the tick and
  the fill and leaves the _unchecked_ box to the browser, which draws a white
  square with a grey edge. That is right on a light page and a lit hole in a
  dark one, and there is no CSS for "the unchecked box", so there was nothing to
  override. `Checkbox` is `appearance-none` with both states drawn from these
  tokens. Any other native control we adopt is the same decision again: either
  the platform draws all of its states acceptably in both sets, or we draw all
  of them. Nine controls outside the inbox - seven checkboxes and two radios in
  settings, automation rules and the merge dialog - are still the platform's,
  and there is no shared radio at all yet (#468). The rule is what they are
  measured against, not a description of them.
- The company mark's tile: **two tokens that swap, never a colour baked into a
  file.** The mark arrived as `<img src=".../wavingeye-icon.svg">` with `#101554`
  painted behind it, and an `<img>` cannot inherit `currentColor`, so the tile
  stayed navy in the dark set at 1.01:1 against `surface`. Nothing was invisible
  and nothing was filed: the white mark inside still read, and what was missing
  was the _luminance_ edge of the tile around it, which is the half of a
  boundary that survives a bad panel or a viewer whose colour discrimination is
  reduced. `brand-tile` and `brand-tile-on` invert between the sets and
  `BrandMark` inlines the path, which is the only arrangement in which a logo
  follows a theme. 15.6:1 in dark, 16.7:1 in light. The rule generalises: any
  asset whose colour has to answer to the theme is inlined, and any asset that
  does not is a file.
- The brand assets are **generated, never drawn here.** Everything under
  `apps/web/public/brand/` is output of
  [wavingbrand](https://github.com/SebiShepherd/wavingbrand), with the source commit in
  `SOURCE.md` beside it. `tools/check-brand.mjs` holds this app to the rule that
  repository asks of a consumer: whatever carries the mark clears 3:1 against
  every surface it lands on, the mark clears 3:1 inside its own tile, and
  `accent` is not mistakable for the brand pink. It reads the built stylesheet
  as well as the source, because #265 was a token that was right where it was
  written and gone from the bundle.
- The edge of a control that is nothing but its edge: `subtle`, not `border`.
  `border` is for structural edges - pane dividers, table rules - and at
  #2c3038 on a #1b1d23 surface it is 1.25:1, which is fine for a rule between
  two rows and fails WCAG 2.2 SC 1.4.11 for the boundary that identifies a
  control. An empty checkbox is that boundary and nothing else. `subtle`
  clears 4.5:1 on every surface in both sets, which `gates/check-theme.mjs`
  holds to the brand's floors; `faint` is chrome only.
- Height of anything that centres its label: **stated, never inherited from a
  line-height.** The trim that centres a label on its letters
  (`optical-center`, `text-box: trim-both cap alphabetic`) removes exactly the
  half-leading a padded control was relying on, so `py-0.5` plus `leading-5` is
  a control with no height once the browser supports the property. The status
  pill was the one place this was not stated, and every badge in the product
  lost 12px the day browsers shipped `text-box`. Buttons are `h-8`/`h-[38px]`,
  the cap is `h-5`, the pill is `h-6`, and `component-states.spec.ts` measures
  the pill so the next one is caught by a number rather than by an eye.
- Where a menu's caret sits: **beside the words when the control hugs them, at
  the trailing edge when it spans a space.** A pill sized to its own label keeps
  the caret next to it, because there is nowhere else for it to be. A control
  that fills the width it is given puts the caret at its far edge, because one
  that follows the text is floating in the middle of the thing it belongs to.
  This was three coincidences before it was a rule - the details pane's section
  headers push it out with a spacer, the company picker pins it to `right-3`,
  and the settings timezone select does it because the platform does - and the
  inbox's queue picker arrived hugging its text inside a full-width pill, which
  read as a mistake beside them (the sponsor). The name truncates and
  the caret holds its place, never the other way round: the caret is furniture
  and the name is the answer to "what am I looking at".

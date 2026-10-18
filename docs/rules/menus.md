# Surface: Menus and anchored panels (everything that opens off a control)

> Carried over from Hikaru, where these rules were learned. Issue numbers such as #352 refer to `SebiShepherd/hikaru`; "the sponsor" is whoever owns the product applying the rule.

**Reference:** the WAI-ARIA Authoring Practices menu and dialog patterns
(primary, for focus and dismissal), Radix UI, Headless UI and Downshift
(secondary, for how a floating panel is positioned and why it leaves the flow).
Sources at the foot.

This file covers a shape rather than a screen: any panel that opens off a
trigger and floats over the page. Today that is the select menu, the filter
menu, the tag picker, the colour pickers and the account menu. They were built
separately, and the two rules below were decided separately in each of them,
which is how the same defect shipped twice in different components.

**Taken**

- **A panel leaves the flow.** It renders through a portal and is positioned
  against its trigger's rectangle. An absolutely positioned sibling is clipped
  by any ancestor with `overflow-hidden`, and no `z-index` escapes a clipping
  box - a list that rounds its rows with `overflow-hidden` will cut the menu of
  its own last row in half.
- **It flips when there is no room.** The placement decision reads the space
  below the trigger against the panel's measured height, and puts the panel
  above when below cannot hold it. A panel that is drawn first and measured
  never is a panel that hangs off the bottom of the window.
- **It follows its trigger** on scroll and resize, with the scroll listener
  captured, because a trigger usually sits inside a scrolling pane rather than
  on the document.
- **It is held inside the viewport horizontally**, so a control in a right-hand
  column does not open off the edge of the window.
- **Its width is measured, never inherited.** The panel is as wide as its
  trigger, capped at a reading width. A width _class_ on a portaled panel
  resolves against the viewport rather than against the pane the trigger sits
  in, so a trigger styled to fill its container drew a menu the width of the
  window - and the wider the screen, the worse it got.
- **A pill that leads with a face gets the inset a face needs.** A circle
  carries its own edge, so text padding leaves it floating away from the left
  while it sits a few pixels from the top and bottom; the horizontal inset
  matches the vertical one when the control leads with an avatar.
- **Focus follows the action that opened it.** A panel opened by a person takes
  focus, as the menu and dialog patterns require. A panel that stands open
  because a review surface rendered it that way was opened by nobody and takes
  no focus - focusing an off-screen element scrolls the page to it, so a sheet
  that stands several panels open would otherwise show a different part of
  itself depending on which panel won the race, and the first click anywhere on
  it would be swallowed by that scroll.
- **Dismissal is two different gestures with two different endings.** Escape
  and an explicit Done are keyboard dismissals: focus returns to the trigger. A
  pointer press elsewhere is not: focus stays where the pointer went. Returning
  focus on a pointer dismissal scrolls the trigger back into view between the
  press and the release, so the click the person was making never lands.
- **One panel appearance**: the `POPOVER` recipe, one radius, one shadow, one
  border. What differs between a select menu and a colour picker is contents,
  never chrome.

**Rejected**

- **A positioning library.** What this needs is an anchored panel, not a
  collision-detection engine with middleware. The rules above are twenty lines;
  a dependency for them would carry a rendering model as well.
- **A native `<select>`** where a menu carries people, colours or icons: it
  renders operating-system chrome, auto-sizes so a row of them looks ragged, and
  cannot carry the app's focus ring.
- **Closing on scroll.** Common, and it makes a menu opened near a list feel
  broken when the list moves under a trackpad's inertia. The panel moves with
  its trigger instead.

**Deviations from the references**

- Radix and Headless UI trap focus inside a menu panel and return it on every
  close. We return focus only on keyboard dismissal, for the pointer reason
  above. The dialog-shaped panels (the colour picker) keep the full trap,
  because their contents are a form rather than a list of one-shot choices.

**The trigger's contents sit inside it, evenly**

A pill leading with a face insets the circle by what it is inset from the top
and the bottom: 4px inside the edge of a 30px pill holding a 20px circle. The
colour trigger already did this with a uniform `p-1`, and the two now read as
the same control family.

The size and the inset are asked for as a **size** and a **variant**, never
passed as extra classes. Two utilities setting one property are resolved by the
order the stylesheet emitted them, not the order the caller wrote them: an
avatar handed `h-5 w-5` on top of its own `h-7 w-7` kept the larger one and
pressed against the pill's edge, and a pill handed `pl-1` on top of `px-2
sm:px-3` kept the wider inset and pushed the circle away from the left. Both
shipped, because both look approximately right in a screenshot.

`component-states.spec.ts` measures the four gaps and fails on unequal ones.
`node_modules/kagami/tools/measure-inset.mjs` is the same measurement on any
running page, and `measure-ink.mjs` beside it is its counterpart for a glyph
inside its box.

**Budget**

One shared `AnchoredPopover`, one appearance recipe, one dismissal rule. A
component that needs a second positioning behaviour states why here first; a
component that reimplements this one silently is a defect, not a variant.

**Sources**

- WAI-ARIA Authoring Practices, menu and menu button pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/menu/>
- WAI-ARIA Authoring Practices, dialog (modal) pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/>
- Radix UI popper/portal behaviour:
  <https://www.radix-ui.com/primitives/docs/utilities/portal>

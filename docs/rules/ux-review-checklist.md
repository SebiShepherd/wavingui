# UX review checklist (evaluator pass)

> Carried over from Hikaru, where these rules were learned. Issue numbers such as #352 refer to `SebiShepherd/hikaru`; "the sponsor" is whoever owns the product applying the rule.

The UX half of the evaluator pass (operating model in `CLAUDE.md`) judges
screenshots of every new or changed screen against this list. It exists because
each entry is a defect class we actually shipped once: a generic "does it look
good?" prompt missed all of them.

Feed this file to the reviewing agent together with the screenshots.

**What gets screenshotted.** Whole screens are not enough: they show one state
of each component at one width, which is how a color picker nobody could read
and a bulk bar that reshuffled at every width both shipped. The pass captures

1. the changed **screens**, including their open popovers and their other modes,
   and at more than one content length where a floating element is involved,
2. the **component gallery** (the gallery, development builds only) at 1440,
   1024 and 820 px, where every shared component appears in every variant,
   disabled state and empty state next to its siblings.

Comparison is the point: defects that are invisible on one screenshot become
obvious when the nine variants sit in a row.

Two standing questions for every judged screen, before the classes below:

1. **Provenance:** which reference-product screen is this the equivalent of, and
   does it behave like it? A capability that exists in no reference product is
   not automatically wrong, but it must be declared as invented (in the PR
   description) and judged twice as hard - invented UI is where "so einen
   Blödsinn denkt sich nur die KI aus" moments come from.
2. **On-theme rendering:** judge the screenshot as rendered on the real theme,
   not the intent. A control can be correct in code and useless on screen.

## L. The whole screen, against the whole reference

The class that was missing, and the one that let a dozen locally correct slices
add up to an overloaded screen. Judge the composition before judging any control
in it.

- **Open the surface file** (`docs/design/surfaces/<surface>.md`) and the
  reference screenshot next to the screenshot under review. No file means the
  slice was built without a reference pass, and that is the finding.
- **Count against the budget, per state.** List row: three information elements
  plus at most one exception marker. Action bar: five verbs, then overflow. One
  chrome bar per surface. Two always-open rows in a detail pane. A count over
  budget is a finding even when every element in it is individually justified -
  that is precisely the failure mode. But count what is on screen **at one
  moment**: a second layout, a menu, a folded section are separate states with
  separate budgets, and treating them as one total turns the rule against
  clutter into a rule against configurability.
- **A capability the reference ships is not removed to make room.** If the budget
  and a reference capability collide, the options are to move it into another
  state or to ask. Silently dropping it is a finding, not a simplification.
- **Every element traces to something.** Reference, budget, or a written
  deviation. An element that traces to none of the three is removed, not
  defended.
- **Ask what was taken away.** A restructuring slice that only adds has not
  restructured anything. If nothing came off the screen, say so.
- **Beware the reference read at component level.** "Gmail, Drive and Linear all
  use this shape" is an argument about one control and says nothing about whether
  the screen holding it is composed like the reference. The comparison is
  screen to screen.

## A. Capability completeness (the "where do I undo this?" class)

- **Every create has a delete, and a place to do it.** If the UI can create an
  entity (tag, team, view, macro, rule), an admin surface must list them, show
  what they are used by, and allow rename and delete. A picker that only grows
  is a defect.
- **Every destructive action is reversible or confirmed** - reversible actions
  (trash) need no prompt; irreversible ones (purge, permanent delete) do.
- **No orphaned data.** Entities with zero usage must be visible as such, so
  they can be cleaned up.
- Check against the reference product: where does _it_ put this management
  screen? (Freshdesk keeps tags under Admin, with usage counts and rename.)

## B. Layout stability

- **Selecting rows must not move the list.** A bulk bar that pushes the table
  down changes what is under the pointer between the first and second click.
  Replace an existing toolbar row in place, or float the bar; never insert into
  the document flow above the rows.
- **No horizontal jump when a control appears** (a "clear" affordance, a
  counter): reserve the slot permanently.
- **An affordance that appears on the first keystroke is a layout shift.** A
  save button that only exists once a form is dirty grows the card under the
  caret and pushes everything below it. Render it from the start, disabled.
- Nothing that repositions on hover or on data load.

## C. Every visual marker means something

- A dot, a color, a badge or an icon must be explainable in one sentence. If a
  color is shown but never chosen by anyone, either expose the choice or drop
  the marker.
- Colour must not be the only carrier of meaning (priority, status).
- **Text that carries data meets AA (4.5:1).** The dimmest token in the theme is
  for chrome, never for ticket ids, timestamps, "Unassigned" or a status badge.
- **Every value in an enum is distinguishable.** If High and Urgent render in
  the same hue, the marker is decoration.
- **Choices must be discriminable at a glance.** A color picker whose options
  look alike on the actual background, or any set of options a user cannot
  tell apart without squinting, is a defect. Swatches render the value at full
  strength, never through a low-opacity tint class. (We shipped a 4-color
  picker whose 15%-alpha swatches were indistinguishable on the dark theme.)

## D. Information architecture vs the reference products

Product-specific: each product writes its own section D against its own
reference products (which column a list spends, where a setting lives, which
audience a page serves). Hikaru's, against Freshdesk, Zendesk and HubSpot, is
the worked example.

## H. Deterministic layout

- **No emergent layout.** A `flex-wrap` toolbar is not responsive design; it is
  the absence of a decision, and the same action lands somewhere else at every
  width. Define the steps: full labels, then icon-only, then overflow.
- **Key the steps to the container, not the window** (`@container` queries). A
  toolbar's room depends on the column it sits in, not on the viewport.
- **A floating bar anchors to the viewport, not to the content.** A selection
  bar that rides up under the last row when the list is short reads as part of
  the list again. Give the page a full-height flex column so the bar parks at
  the bottom edge with the page's own padding as its margin, at any list length.
- **Nothing may be clipped or scrolled out of sight.** If a bar cannot fit, it
  collapses or wraps; controls must never disappear past an edge with no
  scrollbar. The way out of a mode (Clear, Cancel, Close) is always visible.
- **One recipe per state.** Disabled is one opacity everywhere, not three, and
  a disabled container dims its contents rather than leaving each control to
  dim itself.
- **A two-rail layout needs a stacking step.** A fixed sidebar plus a fixed
  section rail leaves no room for a form on a laptop screen; below the width
  where both fit, the inner rail stacks above the content.
- Group related controls and separate the groups with a divider that is actually
  visible on the surface it sits on (a `border`-colored rule on an `overlay`
  background renders as nothing).

## E. Mode and consequence clarity

- Any control that changes who sees the result (public reply vs internal note,
  publish vs draft) must state the consequence in words _and_ change the look
  of the surface it applies to.
- Disabled states must be visibly disabled, not just dimmed by a few percent.

## F. States

- Empty, loading and error states exist for every list and every form, and the
  empty state distinguishes "nothing here yet" from "nothing matches the
  filter" - with a way out of the filter.
- Placeholder text says what is missing ("Unassigned"), never a bare dash.

## G. House rules

- Proper custom components rather than native browser widgets (`<select>`,
  `<datalist>`, `<input type="color">`): they render OS chrome, size raggedly
  and cannot carry the app's focus ring. Where a native control survives for
  now (checkboxes), it must at least be themed (`accent-color`).
- **Options live behind a trigger, not spread across a row.** A palette, a set
  of modes or a list of values belongs in a popover opened from a control that
  shows the current value. Nine buttons per row is not a picker.
- No em dashes anywhere in the UI copy.
- Settings must be understandable without documentation.

## K. Consistency across surfaces

- **Same job, same component.** Two elements that do the same thing for the
  person using them (a bar that floats over a list and acts on it; a card that
  holds a form and its save) must be one component, not two that happen to look
  alike today. Hand-written twins drift within one increment, and the drift is
  invisible to anyone reviewing either surface on its own.
- **Share the appearance, compose the contents.** What a shared component owns is
  its surface, radius, border, shadow and spacing scale - the token-level
  decisions that make two bars read as one idea. What each caller owns is what
  goes inside it, and what it renders in each state. Copying a layout into a
  state it does not fit (a divider with nothing on one side, a slot held open for
  an action that is only ever disabled) is not consistency; it is a shape carried
  over without its purpose, and it looks like a bug. Where two callers genuinely
  need different positioning or density, that is a **named variant on the shared
  component**, not a second component and not a hand-written override. This is
  the standard design-system split: tokens and variants for appearance,
  composition for content.
- **Every shared shape appears in the gallery once, with each of its users next
  to it.** A judge looking at one screen cannot see that another screen solves
  the same problem differently; the gallery is the only place that comparison
  exists.
- **A layout choice belongs to the whole area, not to one screen in it.** If one
  settings section is wider than the others, the navigation rail moves as you
  move between them. Winning space on one screen is not worth a page that
  changes shape underneath the person reading it.

## J. Sticky and floating elements

- **A sticky element floats above the content, and sits on the container.** The
  border and the shadow are what separate it from the rows scrolling underneath;
  a full-width slab in the list's own colour reads as one more row, which is
  worse than not pinning it at all. But the gap belongs between the bar and the
  **content**, never between the bar and the panel's own bottom border: a bar
  hovering four pixels above that border shows a strip of panel behind it and
  reads as a rendering mistake. Docked inside a panel means flush with its edge;
  floating over a full-page list means clear of it.
- **A contextual bar appears with its context and leaves with it.** A bar that
  acts on a selection exists while something is selected; a bar that saves edits
  exists while there are edits, plus long enough afterwards to confirm the save.
  Held on screen the rest of the time it covers the last rows of the list to
  offer controls that cannot be used. Adobe Spectrum's action bar and Material's
  contextual action bar both work this way.
- **Pin at most one edge.** Two sticky boxes, one at the top and one at the
  bottom, squeeze the content into a slot and put two hard seams on the screen.
  If the heading and the save both want to be visible, the screen is asking for
  a different layout, not for a second sticky box. The answer is to unpin the
  heading, not to delete it: a panel that no longer names what is being edited
  has lost information, and the lone button left behind in an otherwise empty
  row is the visible symptom.
- **A control with nothing to do is not shown.** A permanently disabled Discard,
  Undo or Clear is furniture. Reserve the slot so nothing shifts, and put the
  action in it only while the action exists. This is the other half of the rule
  in class B: reserve the room, not the widget.
- **Use the width before adding height.** A long single-column list on a wide
  screen is a scroll nobody needed; group it into columns once there is room.

## I. Popovers, menus and live editing

- **Every way out means the same thing.** If Escape reverts, clicking away must
  revert too. A popover where one dismissal keeps the edit and another discards
  it will silently do the wrong one, because nothing on screen says which is
  which. Either every route commits (and undo lives in the enclosing form's own
  Discard), or every route reverts.
- **A field must survive being typed into one character at a time.** Anything
  that reformats, expands or normalises input has to wait for blur, Enter or
  paste; doing it mid-word rewrites the text under the caret and writes a value
  nobody chose.
- **Say what is wrong, never silently undo it.** A field that reverts on blur
  with no message reads as having eaten the input.
- **Reserve the room for messages and hints.** A validation line that appears on
  the first bad keystroke pushes the footer down, and for a popover that flips
  upward it moves the whole panel.
- **A popover decides its direction from the room it actually has.** Measure the
  trigger against the viewport and flip; a fixed downward popover gets clipped
  by whichever scroll container it happens to sit in.
- **Focus starts inside, stays inside, and comes back.** Opening moves focus to
  the current value (not to whatever is first), Tab cycles within the panel, and
  every close path returns focus to the trigger.
- **Selection and focus are different rings.** Reusing the selected treatment
  for focus makes every item look chosen while arrowing through.
- **Names belong on screen, not only in `title`.** A row of swatches with names
  in a tooltip is a row of unlabelled squares on touch and in a screenshot.
- **An icon must not promise a capability that does not exist.** A pipette means
  "sample from the screen"; an up-and-down chevron pair means "switch between
  these". Use them only where that is true.
- **Two menu entries must not lead to the same page.** If a redirect resolves
  one of them onto the other, one of the two is redundant.

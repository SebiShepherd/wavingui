# Surface: Action bars (every "act on this" in the app)

> Carried over from Hikaru, where these rules were learned. Issue numbers such as #352 refer to `SebiShepherd/hikaru`; "the sponsor" is whoever owns the product applying the rule.

**Reference:** Nielsen Norman Group's bulk-action guidelines (primary, for the
rules), Gmail (primary, for undo-instead-of-confirm), Google Contacts and Jira
(secondary, for the floating bar and its overflow), Intercom (secondary, for
bulk verbs matching single-record verbs). Sources at the foot.

This file covers a shape rather than a screen: the bar that appears when a
selection exists, wherever it appears. It exists because the same idea had four
implementations, and a fourth vocabulary for one idea is the thing the surface
files are here to stop.

**Taken**

- **One contextual bar**, floating at the foot of **the pane that holds the
  list**, appearing on selection and gone when the selection is. The pane, not
  the workspace: a bar centred on a row of panes drifts halfway across an open
  conversation, and then the same bar on a page whose list _is_ the page has a
  different anchor - which is what the consistency layer filed (#337).
- **Gone while a modal is open**, not merely behind it. The scrim is
  translucent, so a bar left underneath keeps its full colour and reads as a
  live control beside a modal question (#380). NN/g's second rule; Gmail, Google
  Contacts, Jira and ClickUp all land on it because it puts the verbs where the
  rows are.
- **One grammar inside it**: `selector | count of total | at most five verbs |
overflow`. The selector is first, which is where PatternFly puts a bulk
  selector, and it is the whole selection grammar in one control: a mixed box
  below full, a checked box at full, pressed below full it takes everything the
  list matches, pressed at full it puts the selection down. That is NN/g's
  "select all toggles to clear", and it is Intercom's inbox bar, checked live on
  2026-08-20: a box, "1/4 selected", four verbs and an overflow, with neither a
  select-all button nor an X.

  What this replaced was a separate "Select all N" button and a trailing Clear.
  Both were spent width in a 352px pane - the bar ran past its column and over
  the conversation beside it, then clipped its own control mid-word when the
  offer was shortened (`mt1t7ihm`). the sponsor's call, 2026-08-20, from the
  reference: two slightly less obvious affordances traded for a bar that fits.
  `Esc` still clears, and the box's tooltip says so.

- **Undo, not "are you sure"**, for anything reversible. NN/g's third rule and
  Gmail's model: do the thing, then offer to take it back. People confirm
  dialogs without reading them, so a dialog on a reversible action buys nothing
  and costs a click every time.
- **A real dialog for the irreversible ones.** Purging a ticket and deleting a
  contact destroy rows; those keep `ConfirmDialog`, which is what a dialog is
  for.
- **The bar teaches the keyboard**: each verb prints its shortcut.
- **The queue decides the verbs.** Spam offers "Not spam", trash offers restore
  and purge. That logic already existed and was right.

**Rejected**

- `window.confirm`. It was the confirmation on both reversible and irreversible
  actions, which is the wrong instrument in both cases: a browser dialog cannot
  be styled, cannot be undone, and blocks the tab.
- The three-step responsive folding (`layoutFor`, `useWidth`). With five verbs
  the bar fits at every width the app supports, so the machinery that decided
  which of eleven controls to hide has nothing left to decide.
- A page-level save bar for settings. The handover proposes one and its own
  reference notes say it is the least-verified part of the package, against a
  per-card behaviour that was a deliberate decision. Left alone until #108 gives
  it a reason.
- `ListRow`, `Chip`, `StatusDot`, `PriorityBar`, `SaveBar` as shared primitives
  for now. Each is in the handover's primitive table, and each currently has
  either no caller or exactly one. A gallery of correct components with no
  screen behind them is how the last drift started; they land when a second
  caller asks for them.
- A command palette to back the overflow menu. The palette exists now (#213),
  but it carries the app's verbs, not a selection's: an action bar acts on what
  is picked, and the palette has no idea what that is. What is still open in
  #135 is the shortcut registry a module would contribute verbs through.

**Deviation**

- The handover gives the toast 4 seconds. Guidance for a toast that carries an
  action is 5 to 10, because the person has to read it, decide, and reach it.
  Ours is 6.
- The handover folds status and priority into one "Resolve" verb with the full
  list behind it. Ours keeps **Set status** as the verb: our vocabulary has four
  statuses and no single dominant one, and resolve is one of them rather than
  the name of the menu. Priority moves into the overflow, where it belongs by
  frequency.
- The verbs are "Set status" and "Move to trash" rather than the shorter "Status"
  and "Trash" the handover uses. On this screen the queue pane already has a
  **Trash** and the list header already has a **Status**, and two controls with
  one word between them are two things a screen reader reads out identically.
  Short is worth less than unambiguous.
- Merge appears in the overflow only when exactly two rows are selected, rather
  than sitting in the bar permanently disabled. An always-disabled control
  teaches nothing.

**Responsive**

- **The bar folds against its own width, not the window's, at one threshold.**
  Below 820px the verbs are their icons and their accessible names. Nothing
  moves into a different control and nothing disappears, so the bar a person
  learns on a laptop is the bar they use on a phone. The number is the labelled
  bar's own width, measured, not a breakpoint borrowed from the window: set to
  what the icon bar needs instead, the tablet inbox got labels it had no room
  for and cut them off at its edge. One threshold and not two: a second one left
  a band where the verbs were icons while the chrome was still the labelled one,
  and the bar ran off its column at 1280px. The width is read once per resize, by the bar, and published to its
  contents - not because measuring is nicer than CSS, but because the same
  threshold has to decide two things and one of them cannot be done in CSS: a
  portalled tooltip cannot be switched by a container query. This is one
  boolean, not the three-step `layoutFor`/`useWidth` folding that was removed.
- **What gives, when the column is narrower than the bar wants to be, is
  anything optional - never a verb, and never a number.** The case that
  produced the rule is the selection's "Select all N": it
  shipped `shrink-0` beside `whitespace-nowrap`, which raises the bar's minimum
  width above the 352px queue pane, so the bar ran over the conversation beside
  it; shortened to "All N" it clipped mid-word in the 312px pane at 1024
  (`mt1t7ihm`). A control that widens the bar past its pane is a control that
  moved the bar, and one that shows half its word says less than nothing.
  `responsive.spec.ts` measures both halves at 390, 1024, 1280, 1440 and 1920:
  the bar inside its column, nothing in it clipped, and the offer reachable at
  every width.
- **An icon-only control in a bar is a square, not a short pill.** With the word
  gone the buttons came out 24px wide against 32px tall, and the menu triggers
  beside them stayed on the 30px filter pill, so a row of six controls had three
  shapes in it. `BAR_ICON_ONLY` sets both dimensions, and the pill takes its
  height as a parameter rather than as an override, because two height utilities
  on one element are resolved by the order Tailwind emitted them. **The inset is
  a parameter for a stronger reason: a responsive utility beats an unprefixed
  one whatever order they were written in.** `BAR_ICON_ONLY`'s `px-0` was
  appended to a base carrying `@sm/bar:px-3`, so above 384px every icon button
  kept 12px of padding either side of a 32px box, which leaves six, and the
  glyph shrank into it - a quarter-size icon on every screen larger than a
  phone, for two packets, while the phone the bar was checked on stayed below
  both thresholds. Padding is now picked (`BAR_PAD` or `BAR_ICON_ONLY`), never
  layered, and the bar sets `[&_svg]:shrink-0` so that a glyph is never what
  yields to a mistake in the box around it.
- **A verb showing only its icon carries a tooltip of ours; a verb showing its
  word carries none.** Both halves are the rule in
  `docs/design/surfaces/icon-only-controls.md`, and the bar is the surface where
  a control changes from one to the other while the page stays still.
- **The subject says both numbers at every width, and the word where it fits.**
  "1/30 selected": what the selection holds out of what it could hold. It is
  the count that answers "the box above the rows only took the page", which a
  separate "Select all N" button used to answer at the cost of eighty pixels
  the queue pane does not have (#439, #440). Below a 400px container the word
  "selected" goes and "1/30" stays, which reverses what this rule said until
  2026-08-21. It said a bare number was the same control worded two ways. What
  changed is a measurement: the bar is 290px with the word off and 345 with it
  on, and the pane it hangs in is 312-352px whenever a ticket is open beside it
  - on a 1440px screen as much as on a phone, because what constrains this bar
    is its column and not the window. So the word is not competing with a margin,
    it is competing with the gaps between six targets, and 55px buys all of them.
    The sentence is not lost: the toolbar's accessible name is "Actions for 1/30
    selected" at every width, so what a screen reader announces never changes.
    Intercom drops the same word at the same point (recorded live 2026-08-20).
    Where the words print, their width is reserved, so "1/30" and "10/30" put the
    verbs in the same place.
- **The chrome that separates things is not spare room.** With the labels the
  buttons and menu triggers take a tighter inset and a trigger drops its chevron
  - it is one of five icons there, and the chevron is what said "this opens
    something" when a label sat beside it. What used to go with them, and does
    not any more, is the gap between the controls and the divider after the count:
    closing both is what made the bar read as one dense block with the count
    touching the first verb, at every width the queue has, because the queue's
    pane never reaches the labelled threshold. Nine pixels of divider and 24 of
    gap, paid for by the word above, and the bar came out narrower than the dense
    one it replaced (290px against 300). `support.spec.ts` measures the overflow
    at three widths, and `responsive.spec.ts` measures the bar inside its column
    at five.
- **While a bulk action is in flight the whole bar refuses input.** Greying out
  two of five verbs and leaving the other three live says nothing true about
  either group.
- On a page that scrolls as a document the bar is pinned to the **window**, not
  to the end of the page. A bar at the end of the document means selecting a row
  at the top and then scrolling past everything to act on it, and on a phone the
  window's bottom edge is also where the thumb is.
- The contents have to fit inside the bar, not merely inside the window. The app
  shell is `overflow-hidden`, so a bar wider than its box is clipped rather than
  scrolled: every "no horizontal overflow" check passes while the way out of a
  selection sits past the right edge. `responsive.spec.ts` measures
  `scrollWidth - clientWidth` on the bar itself.

**Budget**

| Element    | Limit                                                             |
| ---------- | ----------------------------------------------------------------- |
| Action bar | 5 verbs, then overflow. Asserted by a unit test, not by good will |
| Subject    | 1 phrase, counting what is selected                               |
| Way out    | 1, always last                                                    |
| Toast      | 1 line + 1 action; 6s; one toast at a time                        |

The bar's budget is a test (`ui/ActionBar.spec.tsx`): a bar rendered with six
verbs fails the suite. A rule that only lives in this file is a rule that gets
broken in the session that writes it, which is why `node_modules/kagami/gates/check-surface-files.mjs`
exists and why this one is executable too.

## Sources

- <https://www.nngroup.com/videos/bulk-actions-design-guidelines/> - select all,
  a contextual action bar, and clear feedback with an undo.
- <https://www.nngroup.com/articles/user-control-and-freedom/> - undo as the
  remedy for a mistaken action, rather than a prompt before every action.
- <https://blog.logrocket.com/ux-design/sheets-dialogs-snackbars/> - when a
  snackbar is the right instrument and when a dialog is; an actionable snackbar
  needs 5 to 10 seconds.
- <https://uxplanet.org/confirmation-dialogs-how-to-design-dialogues-without-irritation-7b4cf2599956> -
  people confirm dialogs without reading them; if the action can be undone the
  confirmation is redundant.
- <https://uxdworld.com/best-practices-for-providing-actions-in-data-tables/> -
  the floating contextual bar and its "more actions" overflow.
- <https://www.intercom.com/help/en/articles/6584504-using-macros-in-the-inbox> -
  bulk verbs and single-record verbs are the same verbs.

- <https://www.patternfly.org/patterns/bulk-selection/> - read 2026-08-20: the
  bulk selector is a checkbox in the toolbar and "should be the first item";
  partial selection uses the minus icon; a text label reflects the total number
  of items selected.
- <https://www.nngroup.com/videos/bulk-actions-design-guidelines/> - read
  2026-08-20: provide select-all, a contextual action bar and undo; when
  everything is selected the "select all" option toggles to "clear".
- Intercom's inbox, checked live in the free trial on 2026-08-20: the bulk bar
  is a checkbox, "1/4 selected", an overflow and four square icon verbs, with no
  select-all button and no X; select-all and clear are both the checkbox.

# Surface: Icon-only controls (the module rail, row actions, chrome buttons)

> Carried over from Hikaru, where these rules were learned. Issue numbers such as #352 refer to `SebiShepherd/hikaru`; "the sponsor" is whoever owns the product applying the rule.

**Reference:** Zendesk's outer sidebar (primary), Intercom's help desk rail
(secondary). Sources at the foot.

Not a screen but a rule that crosses every screen: a control that shows only a
glyph has to be able to say what it is, and the browser's `title` cannot do it.

**Taken**

- **The rail stays icon-only, at 56px.** Both references arrange the shell the
  same way: a narrow icon rail for feature areas, with the labelled navigation
  in the pane beside it. Labels in the rail would spend the width twice.
- **Every icon-only target carries a tooltip of ours** (`ui/Tooltip.tsx`), shown
  after 400ms of hover and immediately on keyboard focus. `IconButton` renders
  one for every caller, so a new chrome button gets it without anybody
  remembering.
- **The trigger keeps its own `aria-label`, and the bubble is `aria-hidden`.**
  Wiring the bubble up as a description is how a control comes to announce its
  name twice.
- **A control's target is at least 24px, and the target is not the drawing.**
  WCAG 2.5.8 (AA) asks for "at least 24 by 24 CSS pixels", and the spacing
  exception does not save a control that sits on top of another target - which
  a row's selector does, because the row itself opens the ticket. So the target
  is grown by padding the control rather than by drawing it bigger: Material's
  own words for the same move are "an icon may appear to be 24 x 24 dp, but the
  padding surrounding it comprises the full 48 x 48 dp touch target". Here that
  is a 16px checkbox in a 28px label everywhere a list has one, and the queue's
  own row selector, whose 28px circle takes clicks 6px past itself in every
  direction: a 40px target. The padding belongs to the **control**, not to a
  `::after` beside it - a pseudo-element catches the click but is not what a
  test or a screen reader addresses.
- **The tooltip is a name, not a paragraph.** "Deactivate", not "Deactivate this
  colleague, which signs them out". What an action costs belongs in its
  confirmation, where there is room to say it and a chance to decline.

**Rejected**

- **The native `title`.** It waits about a second, never fires on Tab, cannot be
  styled against the surface it floats over, and does not exist in a screenshot
  - so an evaluator hovering the rail photographed nothing and filed the rail as
    unlabelled (#352, #353) while the markup had a name on every entry all along.
- **Visible labels in the rail, or a collapse toggle to get them.** The rail
  carried labels and a collapse control once; the labels repeated what the icon
  said and the toggle existed only to undo the width they cost. Decided again
  with the sponsor on 2026-08-18: tooltips only.
- **A tooltip on a control that already shows its word.** The filter pills drop
  their label on a phone and keep it above that, so the tooltip is passed
  `disabled` at the widths where the word is visible.

**Deviation**

- **Relative timestamps keep the native `title` for the exact instant.** It is
  a second reading of a value that is already on screen rather than the only
  name a control has, and one bubble per row in a long queue is a cost with no
  defect behind it.

**Budgets**

- Tooltip: **one line**, and never more than the control's name.
- Rail: **icons only**, one column, 56px. Anything that needs a word needs the
  navigation pane instead.

**Sources**

- Zendesk, introduction to the Support agent interface (the icon-only sidebar
  for moving between feature areas):
  <https://support.zendesk.com/hc/en-us/articles/4408883355546-Introduction-to-the-Support-agent-interface-standard-agent-interface>
- Intercom, setting up the Inbox (icon rail beside a labelled navigation
  column): <https://www.intercom.com/help/en/articles/10223008-setting-up-the-inbox>

- <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html> - read
  2026-08-20: SC 2.5.8 requires 24 by 24 CSS pixels, with exceptions for
  spacing, inline text and essential presentation; it "reduces the chances of
  erroneous activation due to either a tremor or reduced precision", so it is
  not only a touch rule.
- <https://support.google.com/accessibility/android/answer/7101858?hl=en> - read
  2026-08-20: 48 by 48 dp, made from padding around a smaller icon.

import type { ReactNode } from 'react';
import { Checkbox } from './Checkbox';
import {
  BAR_ICON_ONLY,
  BAR_PAD,
  FloatingBar,
  FloatingBarDivider,
  useBarLabels,
} from './FloatingBar';
import { Tooltip } from './Tooltip';
import { Kbd } from './Kbd';
import { useLabels } from './labels';

/** How many verbs a bar may show before the rest belong in the overflow. */
export const ACTION_BUDGET = 5;

export interface BarAction {
  readonly key: string;
  /** The verb. Always rendered: a bar of bare glyphs teaches nobody anything. */
  readonly label: string;
  readonly icon: ReactNode;
  /** Printed small beside the label, so the bar teaches the keyboard. */
  readonly shortcut?: string;
  readonly onSelect: () => void;
  readonly disabled?: boolean;
  /** `warning` for the irreversible one, which never shares a look with the rest. */
  readonly tone?: 'default' | 'warning';
}

/**
 * A verb that opens a menu rather than doing something at once. The caller
 * renders it, because the menus differ, but it still counts against the budget:
 * five things to choose between is five things to read, whatever they open.
 */
export interface BarMenu {
  readonly key: string;
  readonly node: ReactNode;
}

export type BarItem = BarAction | BarMenu;

function isMenu(item: BarItem): item is BarMenu {
  return 'node' in item;
}

interface ActionBarProps {
  /** What the selection holds. */
  readonly count: number;
  /** What it could hold: everything the list's current filter matches. */
  readonly total: number;
  /**
   * Whether part of this selection was picked under a different search, and so
   * is not among the `total` rows on screen.
   *
   * The denominator is the thing that lies when this is true. A selection may
   * outlive a search here on purpose - filtering to find the rest of a set is
   * something agents do - and `count/total` then states a ratio of two
   * different populations: it read "2 of 1 selected" over a queue holding one
   * row, and the bulk action went on to touch both (#262). So the ratio is
   * dropped rather than repaired; the count alone is true, and the pane the
   * list opens into says where the rest came from.
   */
  readonly beyondView?: boolean;
  /** Put the selection down. The bar's own box does this, at any count. */
  readonly onClear: () => void;
  /** At most `ACTION_BUDGET`. Beyond that, something moves into the overflow. */
  readonly actions: readonly BarItem[];
  /** The overflow control, composed by the caller (it needs a menu). */
  readonly overflow?: ReactNode;
  readonly busy?: boolean;
  /** See `FloatingBar`: a bar over a row of panes cannot be a sticky column. */
  readonly placement?: 'sticky' | 'overlay' | 'viewport';
  /**
   * Lift the bar clear of a strip pinned to the same bottom edge - see
   * `FloatingBar`. Declared here because it was not: the inbox passed it, no
   * interface on the way down mentioned it, nothing typechecks this app in CI
   * (#238), and so the bar sat on the layout switch for three evaluator runs
   * (#298, #362).
   */
  readonly clearsFooter?: boolean;
}

// The pill costs more width than the old rounded rectangle did, and this bar
// has to fit a 352px pane with five verbs on it. The steps are keyed to the
// bar's own container (`@container/bar` in `FloatingBar`), not to the window:
// the pane it hangs in is narrow on a wide screen, which is the case the
// viewport-keyed version got wrong.
// The inset is not here: it is `BAR_PAD` when the word is on and `BAR_ICON_ONLY`
// when it is off, picked once below. Carried in the base and overridden by
// appending, it silently won above 384px and squeezed every glyph to six pixels.
const BUTTON =
  'inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill border border-border bg-surface text-[13px] text-muted transition-press hover:bg-surface-raised hover:text-fg disabled:opacity-40';
const WARNING_BUTTON =
  'inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill bg-danger-wash text-[13px] font-semibold text-danger transition-press hover:brightness-95 disabled:opacity-40';

/**
 * The one shape for "act on what is selected".
 *
 * `FloatingBar` owns the appearance; this owns the **grammar** inside it:
 *
 *     selector | count of total | at most five verbs | overflow
 *
 * The selector is the first item, which is where PatternFly puts a bulk
 * selector, and it is the way out: mixed below full, checked at full, and it
 * clears at either. That is Intercom's bar, recorded live on 2026-08-20 - a
 * box tooltipped "Deselect", "2/4 selected", an overflow and four round icon
 * verbs, and no X and no select-all button in the bar at all.
 *
 * Widening the selection to the whole list is **not** here. It was, as a
 * "Select all N" button, and it did not fit a 352px column (`mt1t7ihm`); a
 * checkbox that selects everything when pressed below full was the other idea,
 * and it means the same gesture clears in Gmail and Intercom and takes 164 rows
 * here. It lives where Intercom puts the rest of the selection state: in the
 * pane the list opens into, which has room for words (`SelectionRest`).
 *
 * There were four vocabularies for this idea before: the inbox's eleven-control
 * pill, the role editor's save footer, the ticket overflow menu, and a bespoke
 * strip in the contacts list. Four shapes for one idea is what makes a suite
 * read as assembled rather than designed.
 *
 * The five-verb budget is the part that does the work. It is what makes removal
 * somebody's job: a sixth verb has to replace one or move into the overflow,
 * rather than being appended because appending is easy. It is asserted in
 * `ActionBar.spec.tsx`, because a budget that lives only in a document is one
 * that gets broken by whoever is in a hurry, including me.
 */
export function ActionBar({
  count,
  total,
  beyondView = false,
  onClear,
  actions,
  overflow,
  busy = false,
  placement = 'sticky',
  clearsFooter = false,
}: ActionBarProps) {
  const L = useLabels();
  const subject = beyondView ? L.selected(count) : L.selected(count, total);
  return (
    <FloatingBar label={`Actions for ${subject}`} placement={placement} clearsFooter={clearsFooter}>
      <Contents
        subject={subject}
        short={beyondView ? `${count}` : `${count}/${total}`}
        count={count}
        total={total}
        beyondView={beyondView}
        onClear={onClear}
        actions={actions}
        overflow={overflow}
        busy={busy}
      />
    </FloatingBar>
  );
}

/**
 * Inside the bar, where `useBarLabels` can be read: the provider is the bar
 * itself, so the grammar has to be a child of it rather than the same
 * component.
 */
function Contents({
  subject,
  short,
  count,
  total,
  beyondView,
  onClear,
  actions,
  overflow,
  busy,
}: {
  readonly subject: string;
  /** The same fact without the word, for a bar that cannot afford one. */
  readonly short: string;
  readonly count: number;
  readonly total: number;
  /** Some of what is held is not in this queue, so the two do not compare. */
  readonly beyondView: boolean;
  readonly onClear: () => void;
  readonly actions: readonly BarItem[];
  readonly overflow?: ReactNode;
  readonly busy: boolean;
}) {
  const L = useLabels();
  const { labels, tight, word } = useBarLabels();
  // Deliberately not truncated. Silently dropping a caller's sixth verb would
  // hide the mistake instead of showing it; the budget is caught by the spec,
  // where a violation is a failing build rather than a missing button.
  /*
   * "Full" is a claim about the selection against the queue, so it may only be
   * made when those two numbers are about the same population. Once a pick has
   * survived a search they are not - which is why the subject below drops the
   * denominator - and the box went on drawing a solid tick over a queue whose
   * visible rows were unselected (#686, second half). The same fact that
   * silences the ratio silences the tick.
   */
  const all = !beyondView && total > 0 && count >= total;
  return (
    <>
      {/* First in the bar, which is where a bulk selector belongs
          (https://www.patternfly.org/patterns/bulk-selection/). It says what is
          held - mixed below full, checked at full - and it is the way out at
          either, which is the gesture Gmail and Intercom share. */}
      {/* Sized for the target, not for the tick: the shared `Checkbox` grows its
          own hit area with padding it takes back with a negative margin, so a
          16px slot leaves that padding hanging over whatever is beside it -
          which at 390px is the count. Twenty-eight here, and it fits. */}
      <span className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center">
        <Tooltip label={L.deselect}>
          <span className="flex h-7 w-7 items-center justify-center">
            <Checkbox
              checked={all}
              someChecked={count > 0}
              onChange={onClear}
              label={L.deselectAll}
            />
          </span>
        </Tooltip>
      </span>
      {/* A fixed minimum, so "1/30 selected" and "10/30 selected" put the verbs
          in the same place. Without it every row picked nudged the whole bar
          (#337). */}
      <span
        className={`shrink-0 whitespace-nowrap font-semibold text-fg ${
          labels ? 'px-1 text-sm' : `pl-1 pr-2 ${word ? 'text-sm' : 'text-xs'}`
        } ${
          // Reserved width where there is room to reserve it (#337).
          labels ? 'min-w-[7.5rem]' : ''
        }`}
      >
        {/* Both numbers, always: what the selection holds and what it could
            hold. It is the count that answers "the box only took the page",
            which a separate "Select all N" button used to answer at the cost of
            eighty pixels the queue pane did not have (#439, #440).

            The word is what gives when the bar is narrow, and it is the only
            thing in here that can. "selected" is 55px; the bar it sits in is
            300px inside a 334px pane, so nothing else in the row can be made
            smaller without making a target smaller. Intercom drops the same
            word at the same point, and the full sentence stays in the toolbar's
            accessible name, so what is lost is a word beside a checked box and
            two numbers, not the fact. Recorded in
            docs/design/surfaces/action-bars.md, which said the opposite until
            the bar was measured. */}
        {word ? subject : short}
      </span>
      <FloatingBarDivider />

      {actions.map((item) =>
        isMenu(item) ? (
          <span key={item.key} className="contents">
            {item.node}
          </span>
        ) : (
          <Tooltip
            key={item.key}
            // Ours, not the browser's, and only where the word is gone: a
            // tooltip on a control that shows its label is noise, and `title`
            // on one that does not is unreachable by keyboard and invisible in
            // a screenshot (docs/design/surfaces/icon-only-controls.md).
            label={item.shortcut ? `${item.label} (${item.shortcut})` : item.label}
            disabled={labels}
          >
            <button
              type="button"
              disabled={item.disabled || busy}
              onClick={item.onSelect}
              // The shortcut is printed for the eye and hidden from the ear: read
              // aloud it turns "Move to trash" into "Move to trash number sign".
              aria-label={item.label}
              className={`${item.tone === 'warning' ? WARNING_BUTTON : BUTTON} ${
                tight ? BAR_ICON_ONLY : BAR_PAD
              }`}
            >
              {item.icon}
              {labels && <span>{item.label}</span>}
              {labels && item.shortcut && (
                <span aria-hidden className="ml-0.5 flex items-center">
                  <Kbd>{item.shortcut}</Kbd>
                </span>
              )}
            </button>
          </Tooltip>
        ),
      )}

      {overflow}
    </>
  );
}

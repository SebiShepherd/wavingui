import type { ReactNode } from 'react';
/** How many verbs a bar may show before the rest belong in the overflow. */
export declare const ACTION_BUDGET = 5;
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
export declare function ActionBar({ count, total, beyondView, onClear, actions, overflow, busy, placement, clearsFooter, }: ActionBarProps): import("react").JSX.Element;
export {};

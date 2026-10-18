import { type ReactNode } from 'react';
interface FloatingBarProps {
    readonly children: ReactNode;
    /** Accessible name, e.g. "Actions for 10 selected tickets". */
    readonly label: string;
    readonly role?: 'toolbar' | 'group';
    /**
     * Whether the bar floats clear of the bottom edge (over a full-page list) or
     * sits on it (docked inside a panel). Position, not appearance: a bar hovering
     * four pixels above a panel's own border reads as a rendering mistake.
     */
    readonly inset?: boolean;
    /** Ref for a caller that measures the bar to decide its own layout steps. */
    readonly wrapperRef?: React.RefObject<HTMLDivElement | null>;
    /**
     * How the bar finds the bottom edge.
     *
     * `sticky` (the default) is for a caller whose parent is a column: the bar is
     * the last thing in it and sticks while the list scrolls. `overlay` is for a
     * caller whose parent is a row of panes, where a sticky child would become a
     * column of its own and end up centred over whichever pane happened to be
     * last; it needs a positioned ancestor. `viewport` pins the bar to the bottom
     * of the window, for a page that scrolls as a document: there a sticky bar
     * sticks to the bottom of its own containing block, which is the end of the
     * page, so you have to scroll to the end to reach the actions for a selection
     * you made at the top.
     */
    readonly placement?: 'sticky' | 'overlay' | 'viewport';
    /**
     * Lift the bar clear of a strip pinned to the same bottom edge.
     *
     * A floating bar that covers a control does not read as floating over the
     * list, it reads as the control being gone - and the strip under the queue
     * holds the layout switch and the count, which are exactly what somebody
     * reaches for while a selection is open.
     */
    readonly clearsFooter?: boolean;
}
/**
 * What the bar has room for. `labels` prints the verbs; `tight` is its
 * complement, and it is what the chrome reads: no words means no dividers, a
 * tighter inset, and a menu trigger without its chevron. `inBar` says the
 * reader is inside a bar at all - a control that also lives elsewhere (the
 * queue chrome has the same menus) must fold with whichever box it is in, and
 * the defect that made this necessary was a bar where the menus printed their
 * labels and the plain buttons beside them did not, leaving the destructive one
 * as the only unlabelled control on screen.
 */
export declare function useBarLabels(): {
    labels: boolean;
    tight: boolean;
    word: boolean;
    inBar: boolean;
};
/**
 * What an icon-only control in a bar looks like: a square, not a short pill.
 *
 * The bar's buttons are `h-8` with horizontal padding, so with the word gone
 * they came out 24px wide against 32px tall - a column of slightly squashed
 * pills. Every reference inbox draws these as squares or circles (Intercom's
 * are circular, checked live 2026-08-20), and a row of them only reads as a row
 * when they share one shape. The height is set here too: the verbs are `h-8`
 * and the menu triggers are the 30px filter pill, which is right in the queue
 * chrome and two pixels short in a bar.
 */
/**
 * 28px below a 280px pane, because at 320 the pane is 264 and the bar wanted
 * 264 of content inside 246 of room - measured, 14px over its own edge, with
 * nothing to scroll it back. Four pixels off five squares and their gaps buys
 * more than that. It stays above the 24px floor WCAG 2.5.8 sets for a target.
 */
export declare const BAR_ICON_ONLY = "h-7 w-7 @[280px]/bar:h-8 @[280px]/bar:w-8 shrink-0 justify-center px-0";
/**
 * What a bar control is inset by while it still shows its word.
 *
 * Apart from the shape, and passed rather than overridden, for the reason
 * `field.ts` gives about heights and colours - with one addition that cost a
 * shipped defect. Two utilities setting one property are resolved by the order
 * Tailwind emits them, but a **responsive** utility beats an unprefixed one
 * whatever that order is. So `BAR_ICON_ONLY`'s `px-0` appended to a base
 * carrying `@sm/bar:px-3` did nothing above 384px: the icon buttons kept 12px
 * of padding either side of a 32px box, which leaves six, and the glyph shrank
 * into it. On a phone both thresholds are below the pane, which is why the bar
 * looked right there and wrong on every larger screen.
 */
export declare const BAR_PAD = "px-2 @sm/bar:px-3";
/**
 * A bar that floats over a scrolling list, pinned to the bottom.
 *
 * What is shared here is the **appearance**, not the contents: auto width,
 * centred, on `overlay` with a hairline and a deep shadow. Two
 * bars over two lists must not differ in surface, radius or shadow, because
 * then the screen has two vocabularies for one idea (Gmail, Drive, Linear and
 * Asana all land on the same shape for exactly this reason).
 *
 * What each caller composes for itself is what goes inside, and that is
 * deliberate. Copying a layout across states it does not fit - a divider with
 * nothing on one side of it, an action that is only ever disabled - is not
 * consistency, it is a shape carried over without its purpose. Callers pass the
 * children their state actually calls for, and render nothing when their state
 * calls for nothing.
 */
export declare function FloatingBar({ children, label, role, inset, wrapperRef, placement, clearsFooter, }: FloatingBarProps): import("react").JSX.Element | null;
/**
 * The divider between groups inside a floating bar.
 *
 * It used to be the first thing to go on a phone, on the grounds that
 * separating four icons costs more width than the separation buys. That was
 * measured wrong twice over: it was keyed to `@sm/bar`, which is the width of
 * the **pane** the bar floats in rather than of the bar, so it also vanished on
 * a 1024px desktop; and what it separates is not four icons but the sentence
 * from the verbs, which is the one boundary in this bar that a reader needs.
 * Nine pixels, against the 55 the count gives back by dropping its word.
 */
export declare function FloatingBarDivider(): import("react").JSX.Element;
export {};

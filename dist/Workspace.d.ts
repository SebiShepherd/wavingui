import { type ReactNode } from 'react';
/**
 * The workspace: a queue or list beside the thing you picked out of it.
 *
 * This is UI level 3 (`docs/specs/ui-templates.md`). It owns the geometry - how
 * the width is divided, which pane yields first, where a contextual bar sits,
 * what happens on a phone - and a module passes only content. Before it, every
 * screen decided those things for itself, which is why a record page started
 * 300px further right than the list it was reached from and why the inbox had
 * sixty lines of surface file about its own width.
 *
 * Three panes, one row:
 *
 *   nav (240px, from `lg`) | main (grows) | sidebar (opens on a pick)
 *
 * The sidebar carries **tabs**, so a picked record shows its conversation and
 * its attributes in one place instead of taking a second column for each. That
 * is what gives the list its width back (#163) and it is what the reference
 * products do.
 */
export interface WorkspaceTab {
    readonly id: string;
    readonly label: string;
    readonly content: ReactNode;
}
interface WorkspaceProps {
    /** Queues, folders, saved views. Hidden below `lg`, where the main pane is all there is room for. */
    readonly nav?: ReactNode;
    /** The list or table. Grows, unless `columns` gives it a width of its own. */
    readonly main: ReactNode;
    /**
     * The list is narrow by nature, so the pick may open **beside** it instead of
     * behind tabs, when the window is wide enough for both.
     *
     * Tabs exist because a table takes the whole width and the pick has to come
     * from somewhere. A chat list does not: it is three lines a row and it is
     * done at 22rem, which is why Intercom, Front and Zendesk all show the list,
     * the conversation and its attributes at once. Applying the tab strip to that
     * layout too solved a problem it does not have and hid the attributes behind
     * a click for no width gained (#208).
     *
     * The list then keeps its width whether or not something is picked, so
     * nothing moves under the pointer that picked it.
     */
    readonly columns?: boolean;
    /** The pick, as tabs. `null` closes the sidebar. */
    readonly tabs?: readonly WorkspaceTab[] | null;
    /** Named for the record, so the sidebar says what it is showing. */
    readonly sidebarTitle?: string;
    /**
     * Which record is open. The sidebar goes back to its first tab when this
     * changes and only then: keying it on the title instead meant that a title
     * arriving late (the list loads after a deep link) counted as a new record
     * and threw away the tab the person had just clicked.
     */
    readonly sidebarKey?: string | null;
    readonly onCloseSidebar?: () => void;
    /** What fills the sidebar's place on a wide screen while nothing is picked. */
    readonly resting?: ReactNode;
    /**
     * Bulk bars and the like: they overlay the **list pane** rather than joining
     * it, and rather than spanning every pane beside it.
     */
    readonly overlay?: ReactNode;
}
/**
 * When the secondary navigation is on screen, in the three forms the app needs
 * it: the rail's own classes, the mirror for whatever stands in for the rail
 * while it is away, and the query for code that has to decide rather than lay
 * out.
 *
 * One place, because these must agree. They did not: the rail yields to a
 * sidebar until `xl`, the inbox's queue picker stood in from `lg`, and between
 * 1024 and 1280 with a ticket open there was neither - no way to see or change
 * the queue across that whole range. Written as whole class strings because
 * Tailwind reads the source for literals and a composed one is a class that
 * never ships.
 */
export declare const RAIL: {
    /** No sidebar beside it: the rail has the width from `lg`. */
    readonly alone: "hidden lg:flex";
    /** A sidebar is open beside it, so the rail waits for `xl`. */
    readonly beside: "hidden xl:flex";
};
/** The mirror of `RAIL`: shown exactly while the rail is not. */
export declare const RAIL_STANDIN: {
    readonly alone: "lg:hidden";
    readonly beside: "xl:hidden";
};
/** The same fact for logic rather than layout. */
export declare const railOnScreen: (beside: boolean) => "(min-width: 1280px)" | "(min-width: 1024px)";
export declare function Workspace({ nav, main, columns: columnsWanted, tabs, sidebarTitle, sidebarKey, onCloseSidebar, resting, overlay, }: WorkspaceProps): import("react").JSX.Element;
export {};

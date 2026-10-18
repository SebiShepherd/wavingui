import type { ReactNode } from 'react';
/** How wide the column of content is allowed to get. */
export type PageWidth = 'default' | 'narrow';
/**
 * The padded, scrolling body most routes want.
 *
 * The shell used to supply this padding for every route, which made a
 * full-height surface like the support inbox impossible without fighting it.
 * Now the shell hands over a bare box and a route says which of the two it is:
 * a document that scrolls (this) or a workspace that fills the frame and
 * scrolls its own columns (the inbox).
 *
 * 1080px, not the full window: a table of four columns stretched across a
 * 2560px screen puts the name and the date at opposite ends of the desk. A
 * record with one column of fields gets `narrow`, because a line of prose is
 * unreadable long before 1080.
 */
export declare function Page({ children, width, }: {
    readonly children: ReactNode;
    readonly width?: PageWidth;
}): import("react").JSX.Element;
/**
 * The heading of a document page: title, one sentence, and whatever acts on the
 * whole page on the right. On a phone the actions go under the title, because
 * beside it they leave the title two words wide.
 */
export declare function PageHeader({ title, description, actions, }: {
    readonly title: string;
    readonly description?: string;
    readonly actions?: ReactNode;
}): import("react").JSX.Element;

import { type ReactNode } from 'react';
/**
 * The name of a control that shows only a glyph.
 *
 * Every icon-only target in the app used to set the native `title`, which is
 * the browser's tooltip and not ours: it waits about a second, it never appears
 * on keyboard focus, it cannot be styled to match the surface it floats over,
 * and it does not exist in a screenshot - so an evaluator hovering the rail saw
 * nothing and filed the rail as unlabelled (#352, #353). A control whose name
 * only appears in the accessibility tree is unlabelled to everyone looking at
 * the screen.
 *
 * The rail stays icon-only regardless: at 56px the width belongs to the
 * module's own navigation in the pane beside it, which is the arrangement both
 * references use - Zendesk's outer sidebar is icon-only navigation between
 * feature areas, and Intercom's help desk puts an icon rail beside a labelled
 * nav column. So the answer is the tooltip, done properly, rather than labels
 * or a collapse toggle.
 *
 * **It is a visual affordance, and only that.** The bubble is `aria-hidden` and
 * the trigger keeps its own `aria-label`: wiring `aria-describedby` to a
 * duplicate of the name is how a button comes to announce "Contacts, Contacts".
 * A trigger with no accessible name of its own is a bug this cannot paper over.
 *
 * Wrapping is `display: contents`, so the wrapper adds no box: a rail entry
 * stays a direct flex child of the rail and a row button stays where the row
 * put it. Events still bubble through a box-less element, and the rectangle
 * comes from the child that does have one.
 */
export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';
interface TooltipProps {
    /** What the control is called. The trigger must carry this name itself too. */
    readonly label: string;
    /** Which side to prefer. It flips when that side has no room. */
    readonly side?: TooltipSide;
    /**
     * Pass the trigger through untouched. For a control that shows its word at
     * one width and hides it at another: the same call site wants the tooltip
     * only where the word is gone, and a tooltip repeating a visible label is
     * noise.
     */
    readonly disabled?: boolean;
    readonly children: ReactNode;
}
export declare function Tooltip({ label, side, disabled, children }: TooltipProps): string | number | bigint | boolean | import("react").JSX.Element | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined;
export {};

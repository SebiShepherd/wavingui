import { type ReactNode, type RefObject } from 'react';
/**
 * Keep an overlay on screen until its exit has run.
 *
 * A dialog or toast that unmounts the moment it closes vanishes without the
 * motion it arrived with (wavingui#1). So the caller says whether the overlay
 * is wanted (`open`), and this says whether it is still drawn (`mounted`) and
 * whether it is on its way out (`leaving`, which picks the exit classes). With
 * reduced motion there is nothing to wait for and it unmounts at once.
 */
export declare function usePresence(open: boolean): {
    readonly mounted: boolean;
    readonly leaving: boolean;
};
interface DialogProps {
    /** Whether the dialog is wanted. Rendered with `false`, it plays its exit and then unmounts. */
    readonly open?: boolean;
    readonly title: string;
    /** Escape, the backdrop and every way out the caller offers end here. */
    readonly onClose: () => void;
    /** `alertdialog` for a question that interrupts, `dialog` for a task. */
    readonly role?: 'dialog' | 'alertdialog';
    /** What holds focus when it opens; the first focusable control otherwise. */
    readonly initialFocus?: RefObject<HTMLElement | null>;
    readonly width?: 'md' | 'lg';
    /** The buttons, right-aligned under the body. */
    readonly footer?: ReactNode;
    /** Something drawn before the title, such as a warning icon. */
    readonly leading?: ReactNode;
    readonly children?: ReactNode;
}
/**
 * The kit's modal: scrim, panel, title, body and footer, with focus held
 * inside, Escape and the backdrop closing it, the floating bar told to stand
 * back (`useModalPresence`), and a motion both ways. Products build their own
 * dialogs on this rather than copying its classes, so they open and close the
 * same way.
 */
export declare function Dialog({ open, ...props }: DialogProps): import("react").JSX.Element | null;
export {};

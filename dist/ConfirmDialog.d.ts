interface ConfirmDialogProps {
    /** Rendered with `false`, it plays its exit and then unmounts. */
    readonly open?: boolean;
    readonly title: string;
    /** What will happen, in words, including anything that cannot be undone. */
    readonly body: string;
    readonly confirmLabel: string;
    /** Destructive confirmations carry the warning treatment. */
    readonly destructive?: boolean;
    readonly busy?: boolean;
    readonly onConfirm: () => void;
    readonly onCancel: () => void;
    /**
     * What the way out is called. "Cancel" beside "Discard changes" asks the
     * reader which of the two cancels what; a dialog that guards unsaved work
     * says "Keep editing" instead.
     */
    readonly cancelLabel?: string;
}
/**
 * The app's confirmation, replacing `window.confirm` on destructive paths. The
 * native dialog cannot carry the theme, cannot state consequences in more than
 * one line, and puts the confirm button wherever the OS wants it. Escape and
 * the backdrop cancel; focus starts on Cancel so an accidental Enter does not
 * destroy anything.
 */
export declare function ConfirmDialog({ open, title, body, confirmLabel, cancelLabel, destructive, busy, onConfirm, onCancel, }: ConfirmDialogProps): import("react").JSX.Element;
export {};

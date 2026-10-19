import { type ReactNode } from 'react';
export interface ToastRequest {
    /** What happened, in the past tense: "3 tickets moved to trash". */
    readonly message: string;
    /** Offered as Undo. Reversible actions have one; the rest do not. */
    readonly undo?: (() => void) | undefined;
    /**
     * The one thing to do next, where taking it back is not the thing.
     *
     * A merge is final, so it has no undo; what the agent wants at that moment is
     * the ticket the messages moved into. Undo wins if both are given: a toast
     * with two buttons is a decision where a confirmation should have been.
     */
    readonly action?: {
        readonly label: string;
        readonly run: () => void;
    } | undefined;
}
interface ToastHandle {
    readonly show: (request: ToastRequest) => void;
}
/**
 * The toast itself, without the machinery that schedules it. Exported so the
 * gallery can render both of its states side by side: a component whose only
 * appearance is behind a click is a component nobody reviews.
 */
export declare function Toast({ message, undo, action, onDismiss, leaving, }: {
    readonly message: string;
    readonly undo?: (() => void) | undefined;
    readonly action?: {
        readonly label: string;
        readonly run: () => void;
    } | undefined;
    readonly onDismiss: () => void;
    /** Playing its exit; set by the provider between dismissal and unmount. */
    readonly leaving?: boolean;
}): import("react").JSX.Element;
/**
 * Feedback for actions that used to ask permission first.
 *
 * NN/g's third rule for bulk actions is clear feedback with a way to undo, and
 * Gmail is the reference implementation: do the thing, say what was done, and
 * offer to take it back. A confirmation dialog on a reversible action buys
 * nothing, because people confirm dialogs without reading them; it only costs a
 * click on every single use. Irreversible actions still get a real dialog.
 *
 * One toast at a time on purpose. A stack of them is a second list to read at
 * the moment somebody is trying to read the first one.
 */
export declare function ToastProvider({ children }: {
    readonly children: ReactNode;
}): import("react").JSX.Element;
/**
 * Say what just happened. Outside a provider this is a no-op rather than an
 * error: a missing toast must never be the reason a mutation appears to fail.
 */
export declare function useToast(): ToastHandle;
export {};

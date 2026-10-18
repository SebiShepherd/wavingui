import { type ReactNode } from 'react';
interface AnchoredPopoverProps {
    /** The element the panel hangs off. */
    readonly anchorRef: React.RefObject<HTMLElement | null>;
    /** Called for Escape and for a pointer press outside both trigger and panel. */
    readonly onDismiss: (viaKeyboard: boolean) => void;
    readonly children: ReactNode;
    /** Accessible name for the panel, where it needs one of its own. */
    readonly label?: string;
    readonly className?: string;
}
export declare function AnchoredPopover({ anchorRef, onDismiss, children, label, className, }: AnchoredPopoverProps): import("react").ReactPortal;
export {};

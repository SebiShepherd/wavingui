import { type ReactNode } from 'react';
/**
 * One verb, plus the other values that verb could have set.
 *
 * This is the shape both reference helpdesks use for a ticket's status, and
 * the reason is that a status with two editors on one screen has no stated
 * relation between them: is the button a shortcut for the dropdown, or
 * something else? Zendesk answers it with `Submit as [status]` - the arrow
 * beside the button is where every other status lives, and the ticket's own
 * field panel has no status in it. Intercom answers it with the state button in
 * the top right, whose menu holds the other states, while the sidebar holds
 * attributes. Neither product lets two controls set the same field.
 *
 * So: the wide half does the thing that is almost always wanted, and the
 * narrow half is where the rest of the vocabulary lives. The wide half may be
 * disabled - a resolved ticket cannot be resolved again - while the narrow half
 * stays live, because "put this back to open" is exactly what is wanted then.
 *
 * The shape is here rather than assembled from two `Button`s at the call site:
 * a pill split in two needs its corners squared where the halves meet, and a
 * caller adding `rounded-r-none` to a `rounded-pill` is relying on the order
 * Tailwind emitted the two rules in (`ui/Button.tsx` says the same about
 * colours).
 */
export interface SplitButtonOption {
    readonly value: string;
    readonly label: string;
    /** One line under the label saying what picking it means, where two options could be confused. */
    readonly description?: string;
    /** Marked with a tick and not offered as a change. */
    readonly current?: boolean;
    readonly disabled?: boolean;
}
interface SplitButtonProps {
    /** The wide half: what the screen thinks you want. */
    readonly label: string;
    readonly icon?: ReactNode;
    readonly onClick: () => void;
    readonly disabled?: boolean;
    /** Accessible name for the narrow half, e.g. "Set status". */
    readonly menuLabel: string;
    /**
     * Names the pair as one control, e.g. "Status". Without it the accessibility
     * tree shows two adjacent buttons with no stated relation, which is what a
     * screen reader hears and what the walkthroughs kept reporting as two
     * controls for one field (#428, #438, #376) - a shape that is obvious by
     * sight is not obvious in a snapshot.
     */
    readonly groupLabel: string;
    readonly options: readonly SplitButtonOption[];
    readonly onSelect: (value: string) => void;
    /**
     * Classes on the wide half's word, for a caller that wants it to fold at a
     * width only the caller knows about (a container query on its own pane).
     * The accessible name is on the button either way, so the control is called
     * the same thing whether or not its word is drawn.
     */
    readonly labelClassName?: string;
}
export declare function SplitButton({ label, icon, onClick, disabled, menuLabel, groupLabel, options, onSelect, labelClassName, }: SplitButtonProps): import("react").JSX.Element;
export {};

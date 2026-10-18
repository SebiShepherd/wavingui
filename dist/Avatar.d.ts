import type { ReactNode } from 'react';
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';
export type AvatarTone = 'neutral' | 'accent' | 'warning' | 'quiet';
/** First letter of a name, or a dash when there is no name to take one from. */
export declare function initial(name: string | null | undefined): string;
interface AvatarProps {
    /** Who it stands for. Used for the initial and, unless overridden, the title. */
    readonly name: string | null | undefined;
    /** Their picture. Fills the circle; falls back to the letters when absent. */
    readonly imageUrl?: string | null;
    /**
     * The letters, when the caller has a rule for them. `Person` passes this so
     * that which initials a name yields is decided in one place rather than by
     * whoever renders the circle.
     */
    readonly initials?: string;
    readonly size?: AvatarSize;
    readonly tone?: AvatarTone;
    /** Extra classes for a caller that also needs position or hover state. */
    readonly className?: string;
    /** Replaces the initial, for a state that is not a person (a tick, an icon). */
    readonly children?: ReactNode;
}
/**
 * The circle that stands for a person.
 *
 * There were five copies of `grid h-8 w-8 place-items-center rounded-full` with
 * four different sizes and three different tints, which is how a suite ends up
 * looking assembled rather than designed. This owns the **appearance**; what
 * goes inside and what wraps it stay the caller's, because the same circle is a
 * label in one place and a selection target in another.
 *
 * Decorative by default: the name it stands for is always written beside it, so
 * announcing the initial again would only add noise.
 */
export declare function Avatar({ name, imageUrl, initials, size, tone, className, children, }: AvatarProps): import("react").JSX.Element;
interface AvatarSelectorProps {
    readonly name: string | null | undefined;
    readonly imageUrl?: string | null;
    readonly initials?: string;
    readonly size?: AvatarSize;
    /** Whether this row is in the selection. */
    readonly selected: boolean;
    /**
     * A selection exists somewhere in the list.
     *
     * On a touch screen that turns every row's box on, because there is no hover
     * to reveal one with and the second pick would otherwise need a second
     * long-press. On a pointer device it changes nothing: Intercom keeps the
     * faces of the rows you have not picked and reveals the circle under the
     * pointer (recorded live 2026-08-20), and a list that flips every avatar to
     * an empty box the moment one row is picked loses the one thing the column
     * was for - who these tickets are from.
     */
    readonly selecting: boolean;
    readonly onChange: () => void;
    /** What is being selected: "Select HD-2026-0001". Never just "Select". */
    readonly label: string;
}
/**
 * The face a row wears, and the box it becomes when you go to select it.
 *
 * A permanent checkbox beside every row is the shape this replaces. It was
 * taken to make selection findable after two runs found it only by its
 * accessible name, and it cost the list a column of empty boxes in the case
 * that is almost all cases: nobody is selecting anything. The documented answer
 * is the swap, not the column - Material's selection pattern says "Avoid
 * persistently displaying checkboxes as part of each item" and puts the
 * selected state on "the item, or its associated avatar"
 * (https://m1.material.io/patterns/selection.html, read 2026-08-20), which is
 * what Gmail and Intercom both do with the sender's circle.
 *
 * Findability is answered by three things instead of the column, because a
 * control that exists only on hover is unreachable by keyboard, on touch and in
 * a screen reader (NN/g, hover-revealed controls):
 *
 *  - the input is always in the DOM with its name, so assistive technology and
 *    the e2e suite address it at rest; it is only invisible and click-through;
 *  - it appears on focus as well as on hover, so Tab reaches it;
 *  - the select-all in the chrome bar above is permanent, and on touch a
 *    long-press on the row opens selection mode (`ConversationList`).
 */
export declare function AvatarSelector({ name, imageUrl, initials, size, selected, selecting, onChange, label, }: AvatarSelectorProps): import("react").JSX.Element;
/** The width every selector column reserves, so headers line up with rows. */
export declare const SELECTOR_WIDTH = "w-7";
interface SelectAllProps {
    readonly checked: boolean;
    /** True while a part of the list is selected: the box says so as a dash. */
    readonly someChecked?: boolean;
    readonly onChange: () => void;
    readonly label?: string;
}
/**
 * Select-all, at the top of the column of row selectors.
 *
 * That position is the convention wherever a list has checkboxes: the header
 * cell of the leftmost column, directly above the controls it stands for.
 * Anywhere else and it reads as an unrelated control that happens to be nearby.
 * It is the same `Checkbox` those rows carry, centred in `SELECTOR_WIDTH` so it
 * sits over them rather than a few pixels to their left, and it shows the third
 * state: a part-selected list says so with a dash instead of claiming nothing
 * is picked.
 */
export declare function SelectAll({ checked, someChecked, onChange, label, }: SelectAllProps): import("react").JSX.Element;
export {};

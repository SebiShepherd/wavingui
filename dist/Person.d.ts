import type { ReactNode } from 'react';
import { type AvatarSize, type AvatarTone } from './Avatar';
/**
 * Everything the app knows about somebody it has to put on a screen.
 *
 * Deliberately loose: a requester is a name and an address with no account, a
 * colleague is an account, a contact is a CRM record. What they have in common
 * is the only thing this needs.
 */
export interface PersonLike {
    readonly name?: string | null;
    readonly email?: string | null;
    /** Their picture, once there is one. Falls back to initials until then. */
    readonly imageUrl?: string | null;
    /** A colleague who can no longer sign in. Rendered, never hidden. */
    readonly deactivated?: boolean;
}
/**
 * What to call them, and the same answer everywhere.
 *
 * The product had five answers to this question: `Unknown sender` in the list,
 * `Customer` on a message, `Unknown` in the ticket details, `Unassigned` in the
 * bulk bar, and in one place the raw user id. Which one you got depended on
 * which screen you were looking at, which is how the same requester came to be
 * rendered three different ways on one screen (#176).
 *
 * The order is fixed: what they are called, else what they wrote from, else a
 * named nothing. The caller chooses the named nothing, because "Unassigned" and
 * "Unknown sender" are genuinely different facts and only the caller knows
 * which one is true.
 */
export declare function personName(person: PersonLike, whenNameless?: string): string;
/**
 * The initials in the circle, from the name we are showing.
 *
 * Two letters where there are two words, one otherwise, and nothing at all from
 * an address: `ada@example.com` is `A` and so is `sebastian.schaefer@example.com`.
 * An address is not a name, and a local part split on its dots is not a first
 * name and a surname - reading `SS` out of it asserts something nobody said.
 * The contact page took its initial from `firstName` while the header showed the
 * full name, which is a second rule nobody wrote down.
 */
export declare function personInitials(person: PersonLike, whenNameless?: string): string;
interface PersonProps {
    readonly person: PersonLike;
    /** What to call them when they have neither name nor address. */
    readonly whenNameless?: string;
    readonly size?: AvatarSize;
    /**
     * What their circle means *here*: nobody in particular, us, an internal note,
     * somebody who cannot sign in. This stays with the caller on purpose - the
     * tint carries a relation, not an identity, and colouring by identity would
     * spend the component's one signal on decoration. A deactivated person
     * overrides it, because that fact outranks any of the four.
     */
    readonly tone?: AvatarTone;
    /** The second line: their address, their role, their company. */
    readonly secondary?: ReactNode;
    /** Trailing content on the name line, such as "(you)". */
    readonly badge?: ReactNode;
    readonly className?: string;
}
/**
 * One person, rendered the one way.
 *
 * Six screens grew six versions of this: their own fallback text, their own
 * truncation, their own idea of which initial to take, their own treatment of
 * somebody deactivated. Each was reasonable where it was written and the set of
 * them is what #176 and #219 are about.
 *
 * Both lines truncate. That is the part most often left out and the part that
 * breaks a layout: a name is unbounded, and a row that grows to fit one is a
 * row that pushes the time out of the screen.
 */
export declare function Person({ person, whenNameless, size, tone, secondary, badge, className, }: PersonProps): import("react").JSX.Element;
interface SelectableAvatarProps {
    /**
     * Who the row is about. A person rather than a string: the letters then come
     * from `personInitials` like every other circle in the app. Taking a name and
     * letting `Avatar` fall back to its first character is how one requester came
     * to be `N` in the list and `NB` in the panel beside it (#250).
     */
    readonly person: PersonLike;
    /** What to call them when they have neither name nor address. */
    readonly whenNameless?: string;
    readonly selected: boolean;
    readonly onToggle: () => void;
    /** What is being selected, for the accessible name: "Select HD-2026-0001". */
    readonly label: string;
    readonly size?: AvatarSize;
}
/**
 * The avatar doubles as the row's selection control.
 *
 * Gmail on mobile and Yahoo Mail both do this: tap the circle and a tick
 * replaces the initial. It is worth copying because a list of people already
 * spends a column on the circle, and a checkbox beside it spends a second one
 * on a control most rows never need. Hovering shows the intent before the
 * click, which is what keeps it discoverable on a pointer device.
 *
 * The same control is used by every list that selects rows, so selecting a
 * contact and selecting a ticket are the same gesture. It lives beside `Person`
 * rather than beside `Avatar` because what goes in the circle is a fact about
 * the person, and that fact is decided here.
 */
export declare function SelectableAvatar({ person, whenNameless, selected, onToggle, label, size, }: SelectableAvatarProps): import("react").JSX.Element;
export {};

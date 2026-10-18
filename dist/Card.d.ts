import type { ReactNode } from 'react';
/**
 * The classes that make a surface a card: 14px radius, panel colour, a soft
 * shadow instead of a frame.
 *
 * Paper separates by elevation, not by outline. The border stays only where a
 * card meets another filled surface, because a shadow needs ground under it to
 * be visible at all - that is what `bordered` is for, and it is the exception.
 */
export declare const CARD = "rounded-card bg-surface shadow-card";
interface CardProps {
    readonly children: ReactNode;
    /** Inner padding. `none` is for a card whose rows own their own padding. */
    readonly padding?: 'none' | 'sm' | 'md';
    /** Add the hairline, for a card sitting on a surface of the same colour. */
    readonly bordered?: boolean;
    readonly className?: string;
    /** Rises on hover. Only for a card that is itself a target. */
    readonly interactive?: boolean;
}
export declare function Card({ children, padding, bordered, interactive, className, }: CardProps): import("react").JSX.Element;
/**
 * A card's own heading. 15/600 with the description under it, which is the
 * step below a section title and above body text.
 */
export declare function CardTitle({ children, description, }: {
    readonly children: ReactNode;
    readonly description?: string;
}): import("react").JSX.Element;
/**
 * The small uppercase label over a group of fields or a list of tags. One
 * definition, because it appeared with three different letter-spacings.
 */
export declare function Overline({ children }: {
    readonly children: ReactNode;
}): import("react").JSX.Element;
export {};

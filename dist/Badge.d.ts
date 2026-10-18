import type { ReactNode } from 'react';
export type BadgeTone = 'accent' | 'success' | 'warning' | 'danger' | 'neutral';
interface BadgeProps {
    readonly tone?: BadgeTone;
    readonly children: ReactNode;
    /** A glyph before the word, for a marker that must read without its colour. */
    readonly icon?: ReactNode;
    readonly className?: string;
    readonly title?: string;
}
/**
 * The pill that carries a status, a marker or a count.
 *
 * `h-6`, and the height is the point rather than a tidier way to write
 * `py-0.5`. The label goes through `opticalText`, whose `text-box: trim-both`
 * cuts the half-leading off the inline box - so a pill sized by its
 * line-height has no line-height left to be sized by, and collapses onto the
 * cap height of an 11px word. Every other control that centres its label this
 * way already states a height (`Button` is `h-8`/`h-[38px]`, `Kbd` is `h-5`);
 * this one was the exception, and it only showed once browsers shipped the
 * property and the `@supports` guard around it started matching.
 */
export declare function Badge({ tone, children, icon, className, title }: BadgeProps): import("react").JSX.Element;
/** The tone for a badge, for a caller that renders the pill itself. */
export declare function badgeClass(tone: BadgeTone): string;
export {};

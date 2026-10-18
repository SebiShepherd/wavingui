import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { type TooltipSide } from './Tooltip';
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost';
export type ButtonSize = 'sm' | 'md';
/** The class list for one button, for a caller that cannot render a `<button>`. */
export declare function buttonClass(variant?: ButtonVariant, size?: ButtonSize, className?: string): string;
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
    readonly variant?: ButtonVariant;
    readonly size?: ButtonSize;
    readonly className?: string;
    readonly children?: ReactNode;
    /** React 19 passes `ref` as an ordinary prop, so no `forwardRef` is needed. */
    readonly ref?: Ref<HTMLButtonElement>;
}
export declare function Button({ variant, size, className, type, children, ...rest }: ButtonProps): import("react").JSX.Element;
interface ButtonLinkProps {
    readonly href: string;
    readonly variant?: ButtonVariant;
    readonly size?: ButtonSize;
    readonly className?: string;
    readonly children: ReactNode;
    readonly 'aria-label'?: string;
}
/**
 * The same shape for a target that is a route rather than an action. It renders
 * the product's link component (`LinkProvider`), so routing stays the product's.
 */
export declare function ButtonLink({ href, variant, size, className, children, ...rest }: ButtonLinkProps): import("react").JSX.Element;
interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
    /** Required: a button with no word in it has no name without one. */
    readonly label: string;
    readonly active?: boolean;
    readonly className?: string;
    /** Which side the tooltip prefers. It flips when that side has no room. */
    readonly tooltipSide?: TooltipSide;
    readonly children: ReactNode;
    /** React 19 passes `ref` as an ordinary prop, so no `forwardRef` is needed. */
    readonly ref?: Ref<HTMLButtonElement>;
}
/**
 * A round target holding one glyph: the chrome controls (bell, theme, close,
 * back). Square-with-rounded-corners was the old shape and it read as a small
 * card, which is what a card is for.
 *
 * The name is on the button for the accessibility tree and in a tooltip for
 * everyone else. It used to be the native `title`, which waits about a second,
 * never fires on keyboard focus and cannot be seen in a screenshot - which is
 * how a whole rail of these came to be filed as unlabelled (#352).
 */
export declare function IconButton({ label, active, className, tooltipSide, type, children, ...rest }: IconButtonProps): import("react").JSX.Element;
export {};

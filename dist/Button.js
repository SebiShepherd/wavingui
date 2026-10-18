import { jsx as _jsx } from "react/jsx-runtime";
import { useLink } from './link';
import { opticalText } from './opticalText';
import { Tooltip } from './Tooltip';
/**
 * The four things a button can be, and nothing else.
 *
 * `primary` is the one thing the screen wants next, `secondary` is everything
 * else that acts, `danger` is the one that destroys, `warning` is the action
 * that stays inside the house (an internal note, which must never be one
 * muscle-memory click away from a reply to the customer in the same colour),
 * and `ghost` is a verb that lives inside another surface - a menu row, a bar -
 * and must not draw a second frame inside it.
 *
 * A sixth is a new meaning, and a new meaning is a decision that belongs in the
 * surface file rather than in a `className`. Overriding a variant's colour from
 * a caller is worse than either: the override and the variant set the same
 * property, so which one applies depends on the order Tailwind emitted them
 * rather than on the order the caller wrote them.
 *
 * Destructive is a wash, not a fill: a solid red button competes with the
 * primary action for the eye at rest, and it is almost never what the screen
 * wants next. It is unmistakable the moment it is read, which is when it
 * matters.
 */
const VARIANT = {
    primary: 'bg-accent text-accent-on font-semibold hover:bg-accent-strong',
    secondary: 'border border-border bg-bg text-muted font-medium hover:text-fg hover:bg-surface',
    danger: 'bg-danger-wash text-danger font-semibold hover:brightness-95',
    warning: 'bg-warning-wash text-warning font-semibold hover:brightness-95',
    ghost: 'text-muted font-medium hover:bg-surface-raised hover:text-fg',
};
/**
 * Two heights. 38 is the button on a page, 32 the one inside a bar or a card
 * header where a full-height button would set the row's height for it.
 */
const SIZE = {
    sm: 'h-8 px-3.5 text-[13px]',
    md: 'h-[38px] px-4 text-[13.5px]',
};
const BASE = 
// A disabled button drops its fill rather than dimming it. At 45% opacity a
// filled primary still reads as the primary action, and the difference from
// the enabled one beside it is a shade - which is the whole complaint in
// #379: what looks clickable must be clickable. `disabled:` wins over the
// variant classes because it is written after them at the call site.
'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-pill transition-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:border disabled:border-border disabled:bg-surface disabled:font-medium disabled:text-subtle disabled:shadow-none';
/** The class list for one button, for a caller that cannot render a `<button>`. */
export function buttonClass(variant = 'secondary', size = 'md', className) {
    return `${BASE} ${SIZE[size]} ${VARIANT[variant]} ${className ?? ''}`;
}
export function Button({ variant = 'secondary', size = 'md', className, type = 'button', children, ...rest }) {
    return (_jsx("button", { type: type, className: buttonClass(variant, size, className), ...rest, children: opticalText(children) }));
}
/**
 * The same shape for a target that is a route rather than an action. It renders
 * the product's link component (`LinkProvider`), so routing stays the product's.
 */
export function ButtonLink({ href, variant = 'secondary', size = 'md', className, children, ...rest }) {
    const Link = useLink();
    return (_jsx(Link, { href: href, className: buttonClass(variant, size, className), ...rest, children: opticalText(children) }));
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
export function IconButton({ label, active = false, className, tooltipSide = 'bottom', type = 'button', children, ...rest }) {
    return (_jsx(Tooltip, { label: label, side: tooltipSide, children: _jsx("button", { type: type, "aria-label": label, className: `grid h-9 w-9 shrink-0 place-items-center rounded-pill transition-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-45 ${active ? 'bg-accent-wash text-accent' : 'text-muted hover:bg-surface-raised hover:text-fg'} ${className ?? ''}`, ...rest, children: opticalText(children) }) }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The classes that make a surface a card: 14px radius, panel colour, a soft
 * shadow instead of a frame.
 *
 * Paper separates by elevation, not by outline. The border stays only where a
 * card meets another filled surface, because a shadow needs ground under it to
 * be visible at all - that is what `bordered` is for, and it is the exception.
 */
export const CARD = 'rounded-card bg-surface shadow-card';
const PADDING = { none: '', sm: 'p-4', md: 'p-5 sm:p-6' };
export function Card({ children, padding = 'md', bordered = false, interactive = false, className, }) {
    return (_jsx("div", { className: `${CARD} ${PADDING[padding]} ${bordered ? 'border border-border' : ''} ${interactive ? 'transition-press hover:-translate-y-px hover:shadow-popover' : ''} ${className ?? ''}`, children: children }));
}
/**
 * A card's own heading. 15/600 with the description under it, which is the
 * step below a section title and above body text.
 */
export function CardTitle({ children, description, }) {
    return (_jsxs("div", { className: "mb-3", children: [_jsx("h2", { className: "text-[15px] font-semibold text-fg", children: children }), description && _jsx("p", { className: "mt-1 text-[13px] text-muted", children: description })] }));
}
/**
 * The small uppercase label over a group of fields or a list of tags. One
 * definition, because it appeared with three different letter-spacings.
 */
export function Overline({ children }) {
    return (_jsx("span", { className: "block text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle", children: children }));
}

import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Checkbox } from './Checkbox';
import { BAR_ICON_ONLY, BAR_PAD, FloatingBar, FloatingBarDivider, useBarLabels, } from './FloatingBar';
import { Tooltip } from './Tooltip';
import { Kbd } from './Kbd';
import { useLabels } from './labels';
/** How many verbs a bar may show before the rest belong in the overflow. */
export const ACTION_BUDGET = 5;
function isMenu(item) {
    return 'node' in item;
}
// The pill costs more width than the old rounded rectangle did, and this bar
// has to fit a 352px pane with five verbs on it. The steps are keyed to the
// bar's own container (`@container/bar` in `FloatingBar`), not to the window:
// the pane it hangs in is narrow on a wide screen, which is the case the
// viewport-keyed version got wrong.
// The inset is not here: it is `BAR_PAD` when the word is on and `BAR_ICON_ONLY`
// when it is off, picked once below. Carried in the base and overridden by
// appending, it silently won above 384px and squeezed every glyph to six pixels.
const BUTTON = 'inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill border border-border bg-surface text-[13px] text-muted transition-press hover:bg-surface-raised hover:text-fg disabled:opacity-40';
const WARNING_BUTTON = 'inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill bg-danger-wash text-[13px] font-semibold text-danger transition-press hover:brightness-95 disabled:opacity-40';
/**
 * The one shape for "act on what is selected".
 *
 * `FloatingBar` owns the appearance; this owns the **grammar** inside it:
 *
 *     selector | count of total | at most five verbs | overflow
 *
 * The selector is the first item, which is where PatternFly puts a bulk
 * selector, and it is the way out: mixed below full, checked at full, and it
 * clears at either. That is Intercom's bar, recorded live on 2026-08-20 - a
 * box tooltipped "Deselect", "2/4 selected", an overflow and four round icon
 * verbs, and no X and no select-all button in the bar at all.
 *
 * Widening the selection to the whole list is **not** here. It was, as a
 * "Select all N" button, and it did not fit a 352px column (`mt1t7ihm`); a
 * checkbox that selects everything when pressed below full was the other idea,
 * and it means the same gesture clears in Gmail and Intercom and takes 164 rows
 * here. It lives where Intercom puts the rest of the selection state: in the
 * pane the list opens into, which has room for words (`SelectionRest`).
 *
 * There were four vocabularies for this idea before: the inbox's eleven-control
 * pill, the role editor's save footer, the ticket overflow menu, and a bespoke
 * strip in the contacts list. Four shapes for one idea is what makes a suite
 * read as assembled rather than designed.
 *
 * The five-verb budget is the part that does the work. It is what makes removal
 * somebody's job: a sixth verb has to replace one or move into the overflow,
 * rather than being appended because appending is easy. It is asserted in
 * `ActionBar.spec.tsx`, because a budget that lives only in a document is one
 * that gets broken by whoever is in a hurry, including me.
 */
export function ActionBar({ count, total, beyondView = false, onClear, actions, overflow, busy = false, placement = 'sticky', clearsFooter = false, }) {
    const L = useLabels();
    const subject = beyondView ? L.selected(count) : L.selected(count, total);
    return (_jsx(FloatingBar, { label: `Actions for ${subject}`, placement: placement, clearsFooter: clearsFooter, children: _jsx(Contents, { subject: subject, short: beyondView ? `${count}` : `${count}/${total}`, count: count, total: total, beyondView: beyondView, onClear: onClear, actions: actions, overflow: overflow, busy: busy }) }));
}
/**
 * Inside the bar, where `useBarLabels` can be read: the provider is the bar
 * itself, so the grammar has to be a child of it rather than the same
 * component.
 */
function Contents({ subject, short, count, total, beyondView, onClear, actions, overflow, busy, }) {
    const L = useLabels();
    const { labels, tight, word } = useBarLabels();
    // Deliberately not truncated. Silently dropping a caller's sixth verb would
    // hide the mistake instead of showing it; the budget is caught by the spec,
    // where a violation is a failing build rather than a missing button.
    /*
     * "Full" is a claim about the selection against the queue, so it may only be
     * made when those two numbers are about the same population. Once a pick has
     * survived a search they are not - which is why the subject below drops the
     * denominator - and the box went on drawing a solid tick over a queue whose
     * visible rows were unselected (#686, second half). The same fact that
     * silences the ratio silences the tick.
     */
    const all = !beyondView && total > 0 && count >= total;
    return (_jsxs(_Fragment, { children: [_jsx("span", { className: "ml-1 flex h-7 w-7 shrink-0 items-center justify-center", children: _jsx(Tooltip, { label: L.deselect, children: _jsx("span", { className: "flex h-7 w-7 items-center justify-center", children: _jsx(Checkbox, { checked: all, someChecked: count > 0, onChange: onClear, label: L.deselectAll }) }) }) }), _jsx("span", { className: `shrink-0 whitespace-nowrap font-semibold text-fg ${labels ? 'px-1 text-sm' : `pl-1 pr-2 ${word ? 'text-sm' : 'text-xs'}`} ${
                // Reserved width where there is room to reserve it (#337).
                labels ? 'min-w-[7.5rem]' : ''}`, children: word ? subject : short }), _jsx(FloatingBarDivider, {}), actions.map((item) => isMenu(item) ? (_jsx("span", { className: "contents", children: item.node }, item.key)) : (_jsx(Tooltip, { 
                // Ours, not the browser's, and only where the word is gone: a
                // tooltip on a control that shows its label is noise, and `title`
                // on one that does not is unreachable by keyboard and invisible in
                // a screenshot (docs/design/surfaces/icon-only-controls.md).
                label: item.shortcut ? `${item.label} (${item.shortcut})` : item.label, disabled: labels, children: _jsxs("button", { type: "button", disabled: item.disabled || busy, onClick: item.onSelect, "aria-label": item.label, className: `${item.tone === 'warning' ? WARNING_BUTTON : BUTTON} ${tight ? BAR_ICON_ONLY : BAR_PAD}`, children: [item.icon, labels && _jsx("span", { children: item.label }), labels && item.shortcut && (_jsx("span", { "aria-hidden": true, className: "ml-0.5 flex items-center", children: _jsx(Kbd, { children: item.shortcut }) }))] }) }, item.key))), overflow] }));
}

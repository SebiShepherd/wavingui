import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useLayoutEffect, useRef, useState, } from 'react';
import { useAnyModalOpen } from './modal';
/**
 * Whether the bar has room for words.
 *
 * One boolean, measured once per resize on the bar itself, because two things
 * have to agree about it and only one of them can be done in CSS: which
 * controls show their label, and which controls therefore need a tooltip to say
 * what they are (`docs/design/surfaces/icon-only-controls.md` rejects both a
 * tooltip on a control showing its word and the native `title` on one that is
 * not). A portalled tooltip cannot be switched by a container query, so the
 * query cannot be the source of truth.
 *
 * This is not the three-step `layoutFor`/`useWidth` folding that was removed:
 * there is one threshold and one answer, and nothing moves between controls.
 */
const BarLabels = createContext({ labels: true, tight: false, word: true, inBar: false });
/**
 * What the bar has room for. `labels` prints the verbs; `tight` is its
 * complement, and it is what the chrome reads: no words means no dividers, a
 * tighter inset, and a menu trigger without its chevron. `inBar` says the
 * reader is inside a bar at all - a control that also lives elsewhere (the
 * queue chrome has the same menus) must fold with whichever box it is in, and
 * the defect that made this necessary was a bar where the menus printed their
 * labels and the plain buttons beside them did not, leaving the destructive one
 * as the only unlabelled control on screen.
 */
export function useBarLabels() {
    return useContext(BarLabels);
}
/**
 * Below this the bar drops its labels, and with them its chrome.
 *
 * One threshold, two effects, because they are the same question asked twice: a
 * bar with no room for words has no room for the dividers, gaps, insets and
 * chevrons that framed them either. Two thresholds shipped briefly and left a
 * band between them where the verbs were icons and the chrome was still the
 * labelled one, and the bar ran over the edge of its column.
 *
 * The number is the labelled bar's own width, measured: five verbs, an
 * overflow, a subject and a way out come to about 800px with their words on.
 * Set to what the icons need (512) instead, the tablet inbox got labels it had
 * no room for and cut them off at the edge. `responsive.spec.ts` and
 * `support.spec.ts` measure this at seven widths between them.
 */
const LABEL_WIDTH = 820;
/**
 * Below this the count drops the word "selected" and shows the numbers alone.
 *
 * A second threshold, which the removed three-step folding is a warning about -
 * so it is scoped to the one thing that folding got wrong. Nothing moves
 * between controls here and no control changes what it needs to explain itself:
 * what gives is a word beside a checked box and two numbers, and the toolbar's
 * accessible name keeps the sentence for anybody reading it aloud.
 *
 * The number is measured, not chosen: the bar is 290px wide with the word off
 * and 345 with it on, inside a wrapper that insets it by 8 either side. 400
 * leaves the word on wherever it fits and takes it off in the queue's own pane,
 * which is 312-352px whenever a ticket is open beside it - narrow on a 1440px
 * screen, which is the case a viewport-keyed threshold gets wrong. Intercom
 * drops the same word at the same point (recorded live 2026-08-20).
 */
const WORD_WIDTH = 400;
/**
 * What an icon-only control in a bar looks like: a square, not a short pill.
 *
 * The bar's buttons are `h-8` with horizontal padding, so with the word gone
 * they came out 24px wide against 32px tall - a column of slightly squashed
 * pills. Every reference inbox draws these as squares or circles (Intercom's
 * are circular, checked live 2026-08-20), and a row of them only reads as a row
 * when they share one shape. The height is set here too: the verbs are `h-8`
 * and the menu triggers are the 30px filter pill, which is right in the queue
 * chrome and two pixels short in a bar.
 */
/**
 * 28px below a 280px pane, because at 320 the pane is 264 and the bar wanted
 * 264 of content inside 246 of room - measured, 14px over its own edge, with
 * nothing to scroll it back. Four pixels off five squares and their gaps buys
 * more than that. It stays above the 24px floor WCAG 2.5.8 sets for a target.
 */
export const BAR_ICON_ONLY = 'h-7 w-7 @[280px]/bar:h-8 @[280px]/bar:w-8 shrink-0 justify-center px-0';
/**
 * What a bar control is inset by while it still shows its word.
 *
 * Apart from the shape, and passed rather than overridden, for the reason
 * `field.ts` gives about heights and colours - with one addition that cost a
 * shipped defect. Two utilities setting one property are resolved by the order
 * Tailwind emits them, but a **responsive** utility beats an unprefixed one
 * whatever that order is. So `BAR_ICON_ONLY`'s `px-0` appended to a base
 * carrying `@sm/bar:px-3` did nothing above 384px: the icon buttons kept 12px
 * of padding either side of a 32px box, which leaves six, and the glyph shrank
 * into it. On a phone both thresholds are below the pane, which is why the bar
 * looked right there and wrong on every larger screen.
 */
export const BAR_PAD = 'px-2 @sm/bar:px-3';
/**
 * A bar that floats over a scrolling list, pinned to the bottom.
 *
 * What is shared here is the **appearance**, not the contents: auto width,
 * centred, on `overlay` with a hairline and a deep shadow. Two
 * bars over two lists must not differ in surface, radius or shadow, because
 * then the screen has two vocabularies for one idea (Gmail, Drive, Linear and
 * Asana all land on the same shape for exactly this reason).
 *
 * What each caller composes for itself is what goes inside, and that is
 * deliberate. Copying a layout across states it does not fit - a divider with
 * nothing on one side of it, an action that is only ever disabled - is not
 * consistency, it is a shape carried over without its purpose. Callers pass the
 * children their state actually calls for, and render nothing when their state
 * calls for nothing.
 */
export function FloatingBar({ children, label, role = 'toolbar', inset = true, wrapperRef, placement = 'sticky', clearsFooter = false, }) {
    const boxRef = useRef(null);
    const [room, setRoom] = useState({ labels: true, tight: false, word: true, inBar: true });
    // A dialog dims the page it is asking about; this bar used to keep its own
    // surface, its own shadow and its own click targets over that dim, and the
    // rows it acted on were the rows the dialog was asking about (#443). Gone
    // rather than dimmed or merely restacked: a translucent scrim over a bar
    // still reads as an available bar, and one left underneath at a lower z is
    // still reachable by Tab.
    const modal = useAnyModalOpen();
    useLayoutEffect(() => {
        const box = boxRef.current;
        // No observer means no measurement, and the honest default is the wider
        // bar: jsdom has none, and a test asserting on a bar that decided it was
        // narrow because nothing has a width there would be asserting on jsdom.
        if (!box || typeof ResizeObserver === 'undefined')
            return;
        const observer = new ResizeObserver(([entry]) => {
            const width = entry?.contentRect.width ?? LABEL_WIDTH;
            const labels = width >= LABEL_WIDTH;
            setRoom({ labels, tight: !labels, word: width >= WORD_WIDTH, inBar: true });
        });
        observer.observe(box);
        return () => observer.disconnect();
    }, []);
    if (modal)
        return null;
    return (_jsx("div", { ref: (node) => {
            boxRef.current = node;
            if (wrapperRef)
                wrapperRef.current = node;
        }, 
        // `@container/bar`: what the bar has to fit is the pane it hangs in, not
        // the window. In the chat layout that pane is 352px wide inside a 1440px
        // window, so folding keyed to the viewport kept every label and the bar
        // ran out over the conversation beside it (#298, #337).
        className: `@container/bar pointer-events-none z-30 flex justify-center ${placement === 'overlay'
            ? 'absolute inset-x-0 bottom-0'
            : placement === 'viewport'
                ? 'fixed inset-x-0 bottom-0'
                : 'sticky bottom-0 mt-auto'} px-2 ${
        // One padding-bottom, picked here. Three classes used to set it -
        // `pb-1` from the inset, `pb-3` from the viewport placement, `pb-11`
        // from clearing the footer - and which of them applied was decided by
        // the order Tailwind emitted them in, not by the order written. The
        // bar landed on the inbox footer and hid the layout switch behind it.
        clearsFooter ? 'pb-11' : placement === 'viewport' ? 'pb-3' : inset ? 'pb-1' : ''}`, children: _jsx("div", { role: role, "aria-label": label, 
            // `max-w-full` plus the wrapper's padding keeps the bar inside a narrow
            // window instead of running off both edges, and `min-w-0` lets the
            // children shrink rather than forcing it wider than the screen. No
            // `overflow` here on purpose: the menus inside open upward and out of
            // the bar, and any overflow value but `visible` clips them.
            // `[&_svg]:shrink-0`: a glyph is the one thing in here that must not
            // give. Every control in a bar is `shrink-0`, but their icons were not,
            // so when a control's own padding left less room than the glyph asked
            // for, the glyph is what yielded - silently, and only at the widths
            // where the padding was wrong.
            className: `pointer-events-auto flex min-w-0 max-w-full items-center rounded-card border border-border bg-overlay py-2 shadow-bar [&_svg]:shrink-0 ${
            // The inset is part of the same answer as the labels; the gap is
            // not, and it used to be. Collapsing both left the count touching the
            // first verb and the verbs touching each other at every width the
            // queue has, because the queue's pane is narrow on a wide screen and
            // the labels never fit there. The gap is now paid for by the word the
            // count drops (`ActionBar`), which is worth more than it costs: 55px
            // for 24px of separation between six targets.
            room.labels ? 'gap-1 px-2' : 'gap-1 px-1'}`, children: _jsx(BarLabels.Provider, { value: room, children: children }) }) }));
}
/**
 * The divider between groups inside a floating bar.
 *
 * It used to be the first thing to go on a phone, on the grounds that
 * separating four icons costs more width than the separation buys. That was
 * measured wrong twice over: it was keyed to `@sm/bar`, which is the width of
 * the **pane** the bar floats in rather than of the bar, so it also vanished on
 * a 1024px desktop; and what it separates is not four icons but the sentence
 * from the verbs, which is the one boundary in this bar that a reader needs.
 * Nine pixels, against the 55 the count gives back by dropping its word.
 */
export function FloatingBarDivider() {
    return _jsx("span", { "aria-hidden": true, className: "mx-1 h-6 w-px shrink-0 bg-border" });
}

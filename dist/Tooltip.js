import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
/**
 * Long enough that sweeping the pointer across a toolbar does not flash five
 * bubbles, short enough to answer someone who has stopped on one thing and is
 * asking what it is. Keyboard focus does not wait: arriving by Tab is already
 * deliberate.
 */
const HOVER_DELAY_MS = 400;
const GAP = 8;
const MARGIN = 8;
export function Tooltip({ label, side = 'top', disabled = false, children }) {
    const wrapRef = useRef(null);
    const timer = useRef(null);
    const [open, setOpen] = useState(false);
    const cancel = useCallback(() => {
        if (timer.current)
            clearTimeout(timer.current);
        timer.current = null;
    }, []);
    const hide = useCallback(() => {
        cancel();
        setOpen(false);
    }, [cancel]);
    useEffect(() => cancel, [cancel]);
    if (disabled)
        return children;
    return (_jsxs("span", { ref: wrapRef, style: { display: 'contents' }, onMouseEnter: () => {
            cancel();
            timer.current = setTimeout(() => setOpen(true), HOVER_DELAY_MS);
        }, onMouseLeave: hide, 
        // A press is an answer to the question the tooltip asks, so the bubble
        // goes rather than hanging over whatever the click just opened.
        onMouseDown: hide, onFocus: (event) => {
            // Only the focus a person can see. Clicking a button focuses it too,
            // and a bubble that appears on every click is noise.
            if (event.target.matches?.(':focus-visible'))
                setOpen(true);
        }, onBlur: hide, onKeyDown: (event) => {
            if (event.key === 'Escape')
                hide();
        }, children: [children, open && _jsx(Bubble, { anchor: wrapRef, label: label, side: side })] }));
}
/**
 * The bubble itself, portaled for the same reason the anchored popover is: no
 * `z-index` escapes an ancestor's clipping box, and these hang off controls
 * inside scrolling panes and rounded cards.
 */
function Bubble({ anchor, label, side, }) {
    const ref = useRef(null);
    const [box, setBox] = useState(null);
    const place = useCallback(() => {
        // The wrapper is `display: contents` and so has no rectangle of its own.
        // The trigger it wraps does.
        const trigger = anchor.current?.firstElementChild;
        const bubble = ref.current;
        if (!trigger)
            return;
        const rect = trigger.getBoundingClientRect();
        const width = bubble?.offsetWidth ?? 0;
        const height = bubble?.offsetHeight ?? 0;
        const room = {
            top: rect.top,
            bottom: window.innerHeight - rect.bottom,
            left: rect.left,
            right: window.innerWidth - rect.right,
        };
        const needed = side === 'top' || side === 'bottom' ? height + GAP : width + GAP;
        const opposite = {
            top: 'bottom',
            bottom: 'top',
            left: 'right',
            right: 'left',
        };
        const used = room[side] < needed && room[opposite[side]] >= needed ? opposite[side] : side;
        const clamp = (value, extent, limit) => Math.max(MARGIN, Math.min(value, limit - extent - MARGIN));
        const top = used === 'top'
            ? rect.top - height - GAP
            : used === 'bottom'
                ? rect.bottom + GAP
                : rect.top + rect.height / 2 - height / 2;
        const left = used === 'left'
            ? rect.left - width - GAP
            : used === 'right'
                ? rect.right + GAP
                : rect.left + rect.width / 2 - width / 2;
        setBox({
            top: clamp(top, height, window.innerHeight),
            left: clamp(left, width, window.innerWidth),
        });
    }, [anchor, side]);
    useLayoutEffect(() => {
        place();
        // A second pass once the bubble has been measured: the first runs before
        // the browser knows how wide the text made it, and the width is what
        // decides both the flip and the centring.
        const frame = requestAnimationFrame(place);
        return () => cancelAnimationFrame(frame);
    }, [place, label]);
    useEffect(() => {
        const onScroll = () => place();
        // `capture`, because the trigger usually sits in a pane whose scroll does
        // not reach the window.
        window.addEventListener('scroll', onScroll, true);
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll, true);
            window.removeEventListener('resize', onScroll);
        };
    }, [place]);
    return createPortal(_jsx("div", { ref: ref, role: "tooltip", "aria-hidden": true, "data-tooltip": true, style: {
            position: 'fixed',
            top: box?.top ?? -9999,
            left: box?.left ?? -9999,
            visibility: box ? 'visible' : 'hidden',
        }, className: "pointer-events-none z-[60] max-w-64 rounded-[8px] bg-fg px-2 py-1 text-xs font-medium text-bg shadow-popover", children: label }), document.body);
}

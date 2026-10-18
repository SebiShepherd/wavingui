import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Placeholders in the shape of what is coming.
 *
 * The rule they exist for: a wait long enough to notice is answered with the
 * layout of the answer, not with the word `Loading…`. Somebody who can see that
 * a list of people is arriving has already started reading the screen; somebody
 * looking at a centred sentence is waiting for it to be replaced.
 *
 * They are also deliberately late. Below roughly 300ms a placeholder is a flash
 * of furniture that the real content immediately replaces, which reads worse
 * than a blank moment - see `useDelayedFlag`.
 */
import { useEffect, useState } from 'react';
import { useLabels } from './labels';
/**
 * True only once a condition has held for `delayMs`.
 *
 * The whole point of a skeleton is to cover a wait people can feel. A fast
 * answer covered by one flashes twice: placeholder in, placeholder out.
 */
export function useDelayedFlag(active, delayMs = 300) {
    const [shown, setShown] = useState(false);
    useEffect(() => {
        if (!active) {
            setShown(false);
            return;
        }
        const timer = setTimeout(() => setShown(true), delayMs);
        return () => clearTimeout(timer);
    }, [active, delayMs]);
    return shown;
}
/** One sweeping block. `width` is a Tailwind class so callers stay declarative. */
export function SkeletonBar({ width = 'w-full', height = 'h-2.5', delay = 0, className, }) {
    return (_jsx("span", { "aria-hidden": true, className: `skeleton block ${width} ${height} ${className ?? ''}`, style: delay ? { animationDelay: `${delay}ms` } : undefined }));
}
/** The circle a row spends on a person, while the person is still arriving. */
export function SkeletonAvatar({ size = 'h-8 w-8' }) {
    return _jsx("span", { "aria-hidden": true, className: `skeleton shrink-0 rounded-full ${size}` });
}
/**
 * The list shape: a circle and two lines, repeated. Used by the conversation
 * queue and by anything else that is a list of people.
 */
export function SkeletonRows({ rows = 5, className, }) {
    const loading = useLabels().loading;
    return (_jsx("div", { role: "status", "aria-label": loading, className: className, children: Array.from({ length: rows }, (_, index) => (_jsxs("div", { className: "flex items-center gap-3 px-3 py-3.5", children: [_jsx(SkeletonAvatar, {}), _jsxs("span", { className: "flex min-w-0 flex-1 flex-col gap-2", children: [_jsx(SkeletonBar, { width: "w-1/2" }), _jsx(SkeletonBar, { width: "w-5/6", delay: 200 })] })] }, index))) }));
}
/** The table shape: the same column grid the real rows use. */
export function SkeletonTableRows({ rows = 5, columns = 'grid-cols-[28px_1fr_1fr_140px]', }) {
    const loading = useLabels().loading;
    return (_jsx("div", { role: "status", "aria-label": loading, children: Array.from({ length: rows }, (_, index) => (_jsxs("div", { className: `grid h-[60px] items-center gap-4 px-5 ${columns}`, children: [_jsx(SkeletonAvatar, { size: "h-7 w-7" }), _jsx(SkeletonBar, { width: "w-3/5" }), _jsx(SkeletonBar, { width: "w-4/5", delay: 150 }), _jsx(SkeletonBar, { width: "w-1/2", delay: 300 })] }, index))) }));
}
/** The card shape: a label line and a number under it. */
export function SkeletonCards({ cards = 3 }) {
    const loading = useLabels().loading;
    return (_jsx(_Fragment, { children: Array.from({ length: cards }, (_, index) => (_jsxs("div", { role: "status", "aria-label": loading, className: "h-[108px] rounded-card border border-border bg-surface p-5", children: [_jsx(SkeletonBar, { width: "w-2/5" }), _jsx(SkeletonBar, { width: "w-3/5", height: "h-5", delay: 200, className: "mt-4" })] }, index))) }));
}
/** A block of prose, for a detail pane whose fields are still arriving. */
export function SkeletonLines({ lines = 3 }) {
    const loading = useLabels().loading;
    return (_jsx("div", { role: "status", "aria-label": loading, className: "flex flex-col gap-2.5", children: Array.from({ length: lines }, (_, index) => (_jsx(SkeletonBar, { width: index === lines - 1 ? 'w-2/3' : 'w-full', delay: index * 150 }, index))) }));
}

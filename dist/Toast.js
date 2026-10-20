import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Undo2, X } from 'lucide-react';
import { useLabels } from './labels';
import { usePresence } from './Dialog';
/** How long an actionable toast stays. */
const LIFETIME_MS = 6_000;
const ToastContext = createContext(null);
/**
 * The toast itself, without the machinery that schedules it. Exported so the
 * gallery can render both of its states side by side: a component whose only
 * appearance is behind a click is a component nobody reviews.
 */
export function Toast({ message, undo, action, onDismiss, leaving = false, onExited, }) {
    const L = useLabels();
    const offered = undo ? null : action;
    return (_jsxs("div", { role: "status", "aria-live": "polite", onAnimationEnd: (event) => {
            if (leaving && event.target === event.currentTarget)
                onExited?.();
        }, className: `${leaving ? 'pop-out' : 'pop-in'} pointer-events-auto min-w-[280px] overflow-hidden rounded-card border border-border bg-overlay px-3.5 py-2.5 shadow-bar`, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-sm text-fg", children: message }), undo && (_jsxs("button", { type: "button", onClick: undo, className: "ml-auto inline-flex items-center gap-1.5 rounded-pill px-2 py-1 text-sm font-semibold text-accent transition-press hover:bg-accent-wash", children: [_jsx(Undo2, { className: "h-4 w-4", "aria-hidden": true }), L.undo] })), offered && (_jsx("button", { type: "button", onClick: offered.run, className: "ml-auto inline-flex items-center gap-1.5 rounded-pill px-2 py-1 text-sm font-semibold text-accent transition-press hover:bg-accent-wash", children: offered.label })), _jsx("button", { type: "button", "aria-label": L.dismiss, onClick: onDismiss, className: `rounded-pill p-1 text-subtle transition-press hover:text-fg ${undo || offered ? '' : 'ml-auto'}`, children: _jsx(X, { className: "h-3.5 w-3.5", "aria-hidden": true }) })] }), undo && (_jsx("span", { "aria-hidden": true, className: "drain mt-2 block h-[3px] rounded-full bg-accent", style: { animationDuration: `${LIFETIME_MS}ms` } }))] }));
}
/**
 * Feedback for actions that used to ask permission first.
 *
 * NN/g's third rule for bulk actions is clear feedback with a way to undo, and
 * Gmail is the reference implementation: do the thing, say what was done, and
 * offer to take it back. A confirmation dialog on a reversible action buys
 * nothing, because people confirm dialogs without reading them; it only costs a
 * click on every single use. Irreversible actions still get a real dialog.
 *
 * One toast at a time on purpose. A stack of them is a second list to read at
 * the moment somebody is trying to read the first one.
 */
export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);
    // The toast just dismissed, drawn while its exit runs.
    const last = useRef(null);
    if (toast)
        last.current = toast;
    const { mounted, leaving, onExited } = usePresence(toast !== null);
    const current = toast ?? last.current;
    const show = useCallback((request) => {
        setToast({ ...request, id: Date.now() });
    }, []);
    useEffect(() => {
        if (!toast)
            return;
        const timer = setTimeout(() => setToast(null), LIFETIME_MS);
        return () => clearTimeout(timer);
    }, [toast]);
    return (_jsxs(ToastContext.Provider, { value: { show }, children: [children, mounted && current && (
            // Out of the floating bar's way, which it used to sit exactly on top
            // of: both are bottom-centred, so a confirmation covered the "Set
            // status" and "Tag" buttons of the very bulk bar that raised it, while
            // the selection was still live.
            //
            // Above it at every width. "Beside it on a wide screen" was the rule
            // before, and beside it is where the bar keeps its way out of selection
            // mode: the confirmation covered "Clear" while the selection it was
            // confirming was still live.
            // The two are deliberately the same kind of surface (one floating-bar
            // vocabulary, per docs/design/surfaces/theme.md), which is exactly why
            // they must not stack: two identical bars in one place read as one bar
            // that changed its mind.
            _jsx("div", { className: "pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 sm:justify-end sm:pr-6", children: _jsx(Toast, { message: current.message, undo: current.undo
                        ? () => {
                            current.undo?.();
                            setToast(null);
                        }
                        : undefined, action: current.action
                        ? {
                            label: current.action.label,
                            run: () => {
                                current.action?.run();
                                setToast(null);
                            },
                        }
                        : undefined, onDismiss: () => setToast(null), leaving: leaving, onExited: onExited }) }))] }));
}
/**
 * Say what just happened. Outside a provider this is a no-op rather than an
 * error: a missing toast must never be the reason a mutation appears to fail.
 */
export function useToast() {
    return useContext(ToastContext) ?? { show: () => undefined };
}

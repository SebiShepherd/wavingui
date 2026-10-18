import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { useModalPresence } from './modal';
/**
 * The app's confirmation, replacing `window.confirm` on destructive paths. The
 * native dialog cannot carry the theme, cannot state consequences in more than
 * one line, and puts the confirm button wherever the OS wants it. Escape and
 * the backdrop cancel; focus starts on Cancel so an accidental Enter does not
 * destroy anything.
 */
export function ConfirmDialog({ title, body, confirmLabel, cancelLabel = 'Cancel', destructive = false, busy = false, onConfirm, onCancel, }) {
    useModalPresence();
    const cancelRef = useRef(null);
    useEffect(() => {
        cancelRef.current?.focus();
        function onKeyDown(event) {
            if (event.key === 'Escape')
                onCancel();
        }
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onCancel]);
    return (_jsx("div", { className: "fixed inset-0 z-50 grid place-items-center bg-scrim p-4", onMouseDown: (event) => {
            if (event.target === event.currentTarget)
                onCancel();
        }, children: _jsxs("div", { role: "alertdialog", "aria-modal": "true", "aria-label": title, className: "pop-in w-full max-w-md rounded-[18px] border border-border bg-overlay p-6 shadow-popover", children: [_jsxs("div", { className: "flex items-start gap-3", children: [destructive && (_jsx(AlertTriangle, { className: "mt-0.5 h-5 w-5 shrink-0 text-danger", "aria-hidden": true })), _jsxs("div", { children: [_jsx("h2", { className: "text-[17px] font-semibold text-fg", children: title }), _jsx("p", { className: "mt-2.5 text-sm leading-relaxed text-muted", children: body })] })] }), _jsxs("div", { className: "mt-6 flex items-center justify-end gap-2.5", children: [_jsx(Button, { ref: cancelRef, variant: "secondary", onClick: onCancel, children: cancelLabel }), _jsx(Button, { variant: destructive ? 'danger' : 'primary', disabled: busy, onClick: onConfirm, children: busy ? 'Working…' : confirmLabel })] })] }) }));
}

import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { Dialog } from './Dialog';
/**
 * The app's confirmation, replacing `window.confirm` on destructive paths. The
 * native dialog cannot carry the theme, cannot state consequences in more than
 * one line, and puts the confirm button wherever the OS wants it. Escape and
 * the backdrop cancel; focus starts on Cancel so an accidental Enter does not
 * destroy anything.
 */
export function ConfirmDialog({ open = true, title, body, confirmLabel, cancelLabel = 'Cancel', destructive = false, busy = false, onConfirm, onCancel, }) {
    const cancelRef = useRef(null);
    return (_jsx(Dialog, { open: open, role: "alertdialog", title: title, onClose: onCancel, initialFocus: cancelRef, leading: destructive ? _jsx(AlertTriangle, { className: "mt-0.5 h-5 w-5 shrink-0 text-danger", "aria-hidden": true }) : undefined, footer: _jsxs(_Fragment, { children: [_jsx(Button, { ref: cancelRef, variant: "secondary", onClick: onCancel, children: cancelLabel }), _jsx(Button, { variant: destructive ? 'danger' : 'primary', disabled: busy, onClick: onConfirm, children: busy ? 'Working…' : confirmLabel })] }), children: _jsx("p", { className: "mt-2.5 text-sm leading-relaxed text-muted", children: body }) }));
}

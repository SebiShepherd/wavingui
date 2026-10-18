import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { AnchoredPopover } from './AnchoredPopover';
import { MENU_ITEM, POPOVER } from './field';
import { opticalText } from './opticalText';
const HALF = 'inline-flex items-center bg-accent text-accent-on transition-press hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-45';
export function SplitButton({ label, icon, onClick, disabled = false, menuLabel, groupLabel, options, onSelect, labelClassName, }) {
    const caretRef = useRef(null);
    const [open, setOpen] = useState(false);
    return (_jsxs("div", { role: "group", "aria-label": groupLabel, className: "inline-flex h-8 shrink-0 items-stretch overflow-hidden rounded-pill", children: [_jsxs("button", { type: "button", disabled: disabled, onClick: onClick, "aria-label": label, className: `${HALF} gap-2 whitespace-nowrap px-3 text-[13px] font-semibold`, children: [icon, _jsx("span", { className: labelClassName, children: opticalText(label) })] }), _jsx("button", { ref: caretRef, type: "button", "aria-label": menuLabel, "aria-expanded": open, "aria-haspopup": "menu", onClick: () => setOpen((value) => !value), className: `${HALF} w-7 justify-center border-l border-accent-on/25`, children: _jsx(ChevronDown, { className: "h-3.5 w-3.5", "aria-hidden": true }) }), open && (_jsxs(AnchoredPopover, { anchorRef: caretRef, label: menuLabel, onDismiss: () => {
                    setOpen(false);
                    caretRef.current?.focus();
                }, className: `min-w-44 p-1 ${POPOVER}`, children: [_jsx("p", { className: "px-2.5 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-subtle", children: menuLabel }), options.map((option) => (_jsxs("button", { type: "button", role: "menuitem", disabled: option.disabled, onClick: () => {
                            setOpen(false);
                            if (!option.current)
                                onSelect(option.value);
                        }, className: `${MENU_ITEM} ${option.current ? 'text-fg' : ''} disabled:opacity-45`, children: [_jsx(Check, { className: `h-3.5 w-3.5 shrink-0 ${option.current ? 'text-accent' : 'invisible'}`, "aria-hidden": true }), _jsxs("span", { className: "flex min-w-0 flex-col items-start", children: [_jsx("span", { className: "truncate", children: option.label }), option.description && (_jsx("span", { className: "text-[11px] font-normal leading-tight text-subtle", children: option.description }))] })] }, option.value)))] }))] }));
}

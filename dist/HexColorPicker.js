import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Slash } from 'lucide-react';
import { clamp, hexToHsv, hsvToHex, normaliseHex, readableOn } from './color';
import { useLabels } from './labels';
/**
 * Ten hues at a saturation that survives an email client's white background,
 * each with the name a person would use for it. A brand accent is picked from a
 * shortlist far more often than mixed by hand, so the presets sit above the
 * mixing surface, not below it.
 */
export const BRAND_PRESETS = [
    { hex: '#2563eb', name: 'Blue' },
    { hex: '#4f46e5', name: 'Indigo' },
    { hex: '#7c3aed', name: 'Violet' },
    { hex: '#c026d3', name: 'Fuchsia' },
    { hex: '#db2777', name: 'Pink' },
    { hex: '#dc2626', name: 'Red' },
    { hex: '#ea580c', name: 'Orange' },
    { hex: '#ca8a04', name: 'Amber' },
    { hex: '#16a34a', name: 'Green' },
    { hex: '#0d9488', name: 'Teal' },
];
/**
 * Presets, mixing surface, hue rail, hex field, the permanently reserved
 * message row and the footer. Used to decide which way the popover opens, so it
 * has to include every row that is always rendered.
 */
const POPOVER_HEIGHT = 404;
/**
 * Pick a colour by hue and shade, from a named preset, or by typing a hex
 * value.
 *
 * Built rather than delegated to `input[type=color]`: the native control opens
 * the operating system's picker, which carries none of the theme, cannot show
 * brand presets, and renders as a different widget on every platform. The three
 * routes to a colour are the ones the reference suites offer, and all three
 * write the same normalised `#rrggbb`.
 *
 * It edits live: every preset, drag and valid hex writes straight through, and
 * closing it (Done, Escape, or clicking away) all mean the same thing, so there
 * is no gesture that silently keeps or silently discards. Undo is the enclosing
 * section's own Discard, which is where undo lives for every other field.
 *
 * The trigger carries the value in words as well as in colour, so the row needs
 * no second, inert readout beside it.
 */
export function HexColorPicker({ value, onChange, label, fallback = '#2563eb', clearable = false, disabled = false, defaultOpen = false, presets = BRAND_PRESETS, }) {
    const [open, setOpen] = useState(defaultOpen);
    const [dropUp, setDropUp] = useState(false);
    const containerRef = useRef(null);
    const triggerRef = useRef(null);
    const effective = normaliseHex(value) ?? fallback;
    const isSet = value !== '';
    // Which way it opens is decided from the room actually left below the
    // trigger: the settings rail stacks above the form under `lg`, which pushes
    // this row far enough down that a downward popover would be cut off.
    // A panel standing open from the start (the gallery's) was opened by nobody,
    // so where the page happens to be scrolled must not decide its direction: it
    // opens down, below the room its caller reserved, every time.
    useLayoutEffect(() => {
        if (!open || defaultOpen)
            return;
        const box = triggerRef.current?.getBoundingClientRect();
        if (!box)
            return;
        const below = window.innerHeight - box.bottom;
        setDropUp(below < POPOVER_HEIGHT && box.top > below);
    }, [open, defaultOpen]);
    /**
     * `returnFocus` is not a nicety. Escape and Done are keyboard dismissals and
     * must put focus back on the trigger, which is what the dialog pattern
     * requires. A click elsewhere is not: focusing the trigger scrolls it back
     * into view, and that scroll happens *between* the pointer's press and its
     * release, so the click the person was actually making never lands on
     * whatever they aimed at. On the gallery, where several pickers stand open at
     * once, the first click on the page did nothing at all - and it was a
     * Playwright test failing on exactly that which found it (#265).
     */
    const close = useCallback((returnFocus = true) => {
        setOpen(false);
        if (returnFocus)
            triggerRef.current?.focus();
    }, []);
    useEffect(() => {
        if (!open)
            return;
        function onPointerDown(event) {
            if (!containerRef.current?.contains(event.target))
                close(false);
        }
        document.addEventListener('mousedown', onPointerDown);
        return () => document.removeEventListener('mousedown', onPointerDown);
    }, [open, close]);
    return (_jsxs("div", { ref: containerRef, className: "relative", children: [_jsxs("button", { ref: triggerRef, type: "button", "aria-label": label, "aria-expanded": open, "aria-haspopup": "dialog", disabled: disabled, onClick: () => (open ? close() : setOpen(true)), 
                // One disabled recipe, the same one the tag picker uses: the control
                // dims as a whole and keeps showing its real value.
                className: "inline-flex items-center gap-2 rounded-[10px] border border-border bg-bg p-1 pr-1.5 transition-press hover:border-accent/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent-wash disabled:opacity-40", children: [_jsx("span", { "aria-hidden": true, style: { backgroundColor: isSet ? effective : 'transparent' }, className: `grid h-6 w-6 place-items-center rounded ring-1 ring-black/30 ${isSet ? '' : 'border border-dashed border-subtle'}`, children: !isSet && _jsx(Slash, { className: "h-3 w-3 text-subtle", "aria-hidden": true }) }), _jsx("span", { className: "font-mono text-xs text-muted", children: isSet ? effective : 'None' }), _jsx(ChevronDown, { className: "h-3 w-3 text-subtle", "aria-hidden": true })] }), open && (_jsx(ColorPopover, { value: effective, isSet: isSet, clearable: clearable, label: label, presets: presets, dropUp: dropUp, onChange: onChange, onClose: () => close(), 
                // Focus follows the action that opened the panel. A panel that was
                // never opened by anybody - the gallery renders several standing open
                // so their states can be reviewed - must not take focus: each one
                // scrolls the page to itself on mount, and whichever wins also sets
                // the hint row to the preset it landed on, which made the gallery
                // render differently between two runs of the same build.
                takeFocus: !defaultOpen }))] }));
}
const AREA_HEIGHT = 132;
/** While typing, only a full six-digit value is a colour. */
const SIX_DIGITS = /^#?[0-9a-fA-F]{6}$/;
function ColorPopover({ value, isSet, clearable, label, presets, dropUp, onChange, onClose, takeFocus, }) {
    const L = useLabels();
    const [hsv, setHsv] = useState(() => hexToHsv(value));
    // What the person is typing, which is briefly not a colour yet.
    const [typed, setTyped] = useState(value);
    const [invalid, setInvalid] = useState(false);
    /** The preset under the pointer or the caret, named in the popover's own row. */
    const [hint, setHint] = useState(null);
    const areaRef = useRef(null);
    const panelRef = useRef(null);
    // What this field last wrote out. Without it the value coming back would
    // rewrite the text under the caret on every keystroke.
    const emitted = useRef(value);
    const write = useCallback((hex) => {
        emitted.current = hex;
        onChange(hex);
    }, [onChange]);
    useEffect(() => {
        setHsv(hexToHsv(value));
        if (value !== emitted.current) {
            setTyped(value);
            setInvalid(false);
        }
    }, [value]);
    // Focus starts inside the popover and Tab stays there, as a dialog requires.
    // It starts on the current colour where there is one, so the name row and the
    // check mark agree instead of naming whichever swatch happens to be first.
    useEffect(() => {
        if (takeFocus) {
            const panel = panelRef.current;
            const current = panel?.querySelector('[aria-pressed="true"]');
            (current ?? panel?.querySelector('button'))?.focus();
        }
        function onKeyDown(event) {
            if (event.key === 'Escape') {
                onClose();
                return;
            }
            if (event.key !== 'Tab' || !panelRef.current)
                return;
            const focusable = [
                ...panelRef.current.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])'),
            ];
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (!first || !last)
                return;
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            }
            else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onClose, takeFocus]);
    const commit = useCallback((next) => {
        setHsv(next);
        const hex = hsvToHex(next);
        setTyped(hex);
        setInvalid(false);
        write(hex);
    }, [write]);
    const pickFromArea = useCallback((event) => {
        const box = areaRef.current?.getBoundingClientRect();
        if (!box)
            return;
        commit({
            h: hsv.h,
            s: clamp((event.clientX - box.left) / box.width, 0, 1),
            v: 1 - clamp((event.clientY - box.top) / box.height, 0, 1),
        });
    }, [commit, hsv.h]);
    const hueHex = hsvToHex({ h: hsv.h, s: 1, v: 1 });
    const marker = readableOn(value);
    const selected = presets.find((preset) => isSet && preset.hex === value);
    return (_jsxs("div", { ref: panelRef, role: "dialog", "aria-label": `${label} picker`, 
        // Anchored to the trigger's left edge: the trigger is narrow, so a
        // right-anchored popover hangs back across the page and reads as
        // belonging to whatever sits to its left.
        className: `absolute left-0 z-40 w-64 space-y-3 rounded-field border border-border bg-overlay p-3 shadow-popover ${dropUp ? 'bottom-full mb-1' : 'mt-1'}`, children: [_jsxs("div", { children: [_jsx("div", { className: "grid grid-cols-5 gap-2", children: presets.map((preset) => {
                            const isCurrent = isSet && preset.hex === value;
                            return (_jsx("button", { type: "button", "aria-label": preset.name, "aria-pressed": isCurrent, onClick: () => {
                                    setTyped(preset.hex);
                                    setInvalid(false);
                                    write(preset.hex);
                                }, onMouseEnter: () => setHint(preset.name), onMouseLeave: () => setHint(null), onFocus: () => setHint(preset.name), onBlur: () => setHint(null), style: { backgroundColor: preset.hex }, 
                                // Selection is the light ring; focus is the accent ring. The
                                // two must not look alike or arrowing through the palette makes
                                // every swatch look chosen.
                                className: `grid h-7 w-full place-items-center rounded transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-overlay ${isCurrent ? 'ring-2 ring-fg ring-offset-1 ring-offset-overlay' : ''}`, children: isCurrent && (_jsx(Check, { className: "h-3.5 w-3.5", style: { color: readableOn(preset.hex) }, "aria-hidden": true })) }, preset.hex));
                        }) }), _jsx("p", { className: "mt-1.5 h-4 text-xs text-subtle", children: hint ?? selected?.name ?? (isSet ? L.customColour : L.noColour) })] }), _jsx("div", { ref: areaRef, role: "slider", tabIndex: 0, "aria-label": L.saturationBrightness, "aria-valuetext": `Saturation ${Math.round(hsv.s * 100)} percent, brightness ${Math.round(hsv.v * 100)} percent`, "aria-valuenow": Math.round(hsv.s * 100), "aria-valuemin": 0, "aria-valuemax": 100, onPointerDown: (event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    pickFromArea(event);
                }, onPointerMove: (event) => {
                    if (event.buttons === 1)
                        pickFromArea(event);
                }, onKeyDown: (event) => {
                    const step = event.shiftKey ? 0.1 : 0.02;
                    const moves = {
                        ArrowLeft: { s: clamp(hsv.s - step, 0, 1) },
                        ArrowRight: { s: clamp(hsv.s + step, 0, 1) },
                        ArrowUp: { v: clamp(hsv.v + step, 0, 1) },
                        ArrowDown: { v: clamp(hsv.v - step, 0, 1) },
                    };
                    const move = moves[event.key];
                    if (!move)
                        return;
                    event.preventDefault();
                    commit({ ...hsv, ...move });
                }, style: {
                    height: AREA_HEIGHT,
                    backgroundColor: hueHex,
                    backgroundImage: 'linear-gradient(to top, #000, rgba(0,0,0,0)), linear-gradient(to right, #fff, rgba(255,255,255,0))',
                }, className: "relative w-full cursor-crosshair touch-none rounded-[10px] ring-1 ring-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent", children: _jsx("span", { "aria-hidden": true, style: {
                        left: `${hsv.s * 100}%`,
                        top: `${(1 - hsv.v) * 100}%`,
                        borderColor: marker,
                    }, className: "pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-[0_0_0_1px_rgba(0,0,0,0.4)]" }) }), _jsx(HueSlider, { hue: hsv.h, onChange: (h) => commit({ ...hsv, h }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { "aria-hidden": true, style: { backgroundColor: value }, className: "h-7 w-7 shrink-0 rounded ring-1 ring-black/30" }), _jsx("input", { "aria-label": `${label} hex value`, "aria-invalid": invalid, value: typed, spellCheck: false, autoComplete: "off", onChange: (event) => {
                                    const next = event.target.value;
                                    setTyped(next);
                                    // Only a complete six-digit value counts while typing. Expanding
                                    // the three-digit shorthand here would rewrite the field under
                                    // the caret after the third character.
                                    if (SIX_DIGITS.test(next.trim())) {
                                        const hex = normaliseHex(next);
                                        setInvalid(false);
                                        setHsv(hexToHsv(hex));
                                        write(hex);
                                        return;
                                    }
                                    setInvalid(next.trim() !== '');
                                }, onBlur: () => {
                                    // The shorthand is accepted here, where the caret has left.
                                    const hex = normaliseHex(typed);
                                    if (!hex)
                                        return;
                                    setTyped(hex);
                                    setInvalid(false);
                                    setHsv(hexToHsv(hex));
                                    write(hex);
                                }, className: `w-full rounded-[10px] border bg-bg px-2 py-1.5 font-mono text-sm text-fg focus:outline-none focus:ring-1 ${invalid
                                    ? 'border-warning focus:border-warning focus:ring-warning/50'
                                    : 'border-border focus:border-accent focus:ring-accent-wash'}` })] }), _jsx("p", { role: invalid ? 'alert' : undefined, className: "mt-1.5 h-4 text-xs text-danger", children: invalid ? 'Six hex digits, such as #2563eb.' : '' })] }), _jsxs("div", { className: "flex items-center justify-between gap-2 border-t border-border pt-3", children: [clearable ? (_jsx("button", { type: "button", onClick: () => {
                            write('');
                            onClose();
                        }, className: "whitespace-nowrap rounded-[10px] border border-border px-2.5 py-1.5 text-xs text-muted transition-press hover:border-accent/40 hover:text-fg", children: "No colour" })) : (_jsx("span", {})), _jsx("button", { type: "button", onClick: onClose, className: "inline-flex h-[38px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-pill bg-accent px-4 text-[13.5px] font-semibold text-accent-on transition-press hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-45", children: "Done" })] })] }));
}
/**
 * The hue rail. `input[type=range]` cannot carry a spectrum track and a thumb
 * that shows the picked hue, so it is drawn here and keeps the slider role.
 * The visible track is 12px; the pointer target around it is 24, which is the
 * smallest a control is allowed to be.
 */
function HueSlider({ hue, onChange, }) {
    const L = useLabels();
    const railRef = useRef(null);
    function pick(event) {
        const box = railRef.current?.getBoundingClientRect();
        if (!box)
            return;
        onChange(clamp((event.clientX - box.left) / box.width, 0, 1) * 360);
    }
    return (_jsx("div", { role: "slider", tabIndex: 0, "aria-label": L.hue, "aria-valuenow": Math.round(hue), "aria-valuemin": 0, "aria-valuemax": 360, onPointerDown: (event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            pick(event);
        }, onPointerMove: (event) => {
            if (event.buttons === 1)
                pick(event);
        }, onKeyDown: (event) => {
            const step = event.shiftKey ? 30 : 5;
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                onChange((hue - step + 360) % 360);
            }
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                onChange((hue + step) % 360);
            }
        }, className: "flex h-6 w-full cursor-pointer touch-none items-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent", children: _jsx("div", { ref: railRef, "aria-hidden": true, style: {
                backgroundImage: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
            }, className: "relative h-3 w-full rounded-full ring-1 ring-black/30", children: _jsx("span", { style: {
                    left: `${(hue / 360) * 100}%`,
                    backgroundColor: hsvToHex({ h: hue, s: 1, v: 1 }),
                }, className: "pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)]" }) }) }));
}

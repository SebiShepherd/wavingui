import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The WavingEye mark, inline rather than linked.
 *
 * It used to be `<img src="/brand/wavingeye-icon.svg">`, which is a navy tile
 * with a white mark baked into the file. An `<img>` cannot inherit
 * `currentColor`, so the tile stayed navy in dark mode and sat at 1.01:1
 * against `--color-surface`: the mark inside it was still visible, and the tile
 * around it had no edge at all, so the logo read as a glyph floating in the
 * sidebar rather than as a product tile.
 *
 * Inline, the tile takes `--color-brand-tile` and the mark takes
 * `--color-brand-tile-on`, and the pair inverts on dark. The brand's own check
 * (`tools/check-theme.mjs`) reads those two tokens out of `wavingui.css` and
 * fails the build if either drops under 3:1 against a surface the kit paints.
 *
 * The path data comes from the product, which reads it from the brand package
 * (`import paths from '@wavingeye/brand/<product>/paths.json'`), so the kit
 * draws whichever product's mark it is handed and never carries one itself.
 */
const SIZE = {
    sm: 'h-8 w-8 rounded-[10px]',
    md: 'h-10 w-10 rounded-field',
    lg: 'h-12 w-12 rounded-card',
};
/**
 * The mark sits at half the tile's width, which is the share that survives a
 * circular launcher mask, and it is lifted by a fortieth of the tile because
 * its mass is all in the base bar and a measured centring reads low.
 */
const INSET = 0.25;
const LIFT = 0.022;
export function BrandMark({ mark, size = 'sm', label = '', className = '' }) {
    const [w, h] = mark.viewBox.split(' ').slice(2).map(Number);
    const box = w / (1 - INSET * 2);
    const x = (box - w) / 2;
    const y = (box - h) / 2 - box * LIFT;
    return (_jsxs("svg", { viewBox: `0 0 ${box} ${box}`, role: "img", "aria-label": label || undefined, "aria-hidden": label ? undefined : true, className: `${SIZE[size]} shrink-0 bg-brand-tile text-brand-tile-on ${className}`, children: [label ? _jsx("title", { children: label }) : null, _jsx("g", { transform: `translate(${x} ${y})`, children: _jsx("path", { d: mark.d, fill: "currentColor", fillRule: (mark.fillRule ?? 'nonzero') }) })] }));
}

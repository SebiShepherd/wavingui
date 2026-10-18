import type { ReactNode } from 'react';
/**
 * One key, drawn as a key.
 *
 * The product had three renderings of this: a proper cap in the search field,
 * and two bare characters, one in the bulk bar and one on the inbox layout
 * toggle. An evaluation persona read the bare one as a broken glyph, which is
 * the correct reading of a stray capital sitting against a word (#230). The
 * shortcut is real; only its rendering was not.
 *
 * The cap is the whole message: the box says "this is a thing you press"
 * without a sentence. Small, quiet, and never the loudest thing in its row - a
 * hint that competes with the label it annotates has the emphasis backwards.
 *
 * The explicit line box is load-bearing, and is why this is a component rather
 * than a class string somebody remembers: the glyph sits above the midline of
 * its own em box, so a `kbd` left to its font metrics reads high however well
 * its container is centred.
 *
 * The glyph is centred on its own ink rather than on its line box
 * (`optical-center` in `styles.css`), which is the same rule every other
 * fixed-height control here now follows. Two hand-measured nudges lived on this
 * line before it, in opposite directions, which is what a per-component number
 * is worth.
 *
 * `tools/measure-ink.mjs <url> kbd` is how the claim is checked: it renders the
 * cap at ten times scale and reports the ink's gap above and below.
 *
 * Whether it shows at all is the caller's business (a keyboard hint on a device
 * with no keyboard is noise), so callers wrap it rather than restyle it.
 */
export declare function Kbd({ children }: {
    readonly children: ReactNode;
}): import("react").JSX.Element;

/**
 * Ten hues at a saturation that survives an email client's white background,
 * each with the name a person would use for it. A brand accent is picked from a
 * shortlist far more often than mixed by hand, so the presets sit above the
 * mixing surface, not below it.
 */
export declare const BRAND_PRESETS: readonly [{
    readonly hex: "#2563eb";
    readonly name: "Blue";
}, {
    readonly hex: "#4f46e5";
    readonly name: "Indigo";
}, {
    readonly hex: "#7c3aed";
    readonly name: "Violet";
}, {
    readonly hex: "#c026d3";
    readonly name: "Fuchsia";
}, {
    readonly hex: "#db2777";
    readonly name: "Pink";
}, {
    readonly hex: "#dc2626";
    readonly name: "Red";
}, {
    readonly hex: "#ea580c";
    readonly name: "Orange";
}, {
    readonly hex: "#ca8a04";
    readonly name: "Amber";
}, {
    readonly hex: "#16a34a";
    readonly name: "Green";
}, {
    readonly hex: "#0d9488";
    readonly name: "Teal";
}];
export interface ColorPreset {
    readonly hex: string;
    readonly name: string;
}
interface HexColorPickerProps {
    /** A `#rrggbb` value, or empty when the colour is unset. */
    readonly value: string;
    readonly onChange: (hex: string) => void;
    /** Accessible name for the trigger, e.g. "Accent colour". */
    readonly label: string;
    /** The colour the mixing surface starts from while nothing is set. */
    readonly fallback?: string;
    /** Offer "No colour", for settings where empty means "omit". */
    readonly clearable?: boolean;
    readonly disabled?: boolean;
    /** Gallery-only: render the popover open so its states can be reviewed. */
    readonly defaultOpen?: boolean;
    /** The shortlist above the mixing surface. Defaults to `BRAND_PRESETS`. */
    readonly presets?: readonly ColorPreset[];
}
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
export declare function HexColorPicker({ value, onChange, label, fallback, clearable, disabled, defaultOpen, presets, }: HexColorPickerProps): import("react").JSX.Element;
export {};

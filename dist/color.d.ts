/** Hue 0-360, saturation and value 0-1. */
export interface Hsv {
    readonly h: number;
    readonly s: number;
    readonly v: number;
}
export declare function isHex(value: string): boolean;
/**
 * Accepts what people actually paste: with or without the hash, three digits or
 * six, any case. Returns a normalised `#rrggbb` in lower case, or null.
 */
export declare function normaliseHex(value: string): string | null;
export declare function hexToHsv(hex: string): Hsv;
export declare function hsvToHex({ h, s, v }: Hsv): string;
/**
 * Relative luminance per WCAG 2.1, used to decide whether a marker drawn on a
 * colour should be black or white.
 */
export declare function luminance(hex: string): number;
export declare function readableOn(hex: string): string;
export declare function clamp(value: number, min: number, max: number): number;

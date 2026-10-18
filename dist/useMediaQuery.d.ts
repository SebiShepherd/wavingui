/**
 * A media query as state, kept in step with the window.
 *
 * The inbox already asked this question once and answered it only at mount, so
 * a window that changed size afterwards kept the answer from before. A layout
 * decision that a resize cannot reach is a layout decision that is wrong half
 * the time on a tablet that rotates.
 */
export declare function useMediaQuery(query: string, whenUnknown?: boolean): boolean;

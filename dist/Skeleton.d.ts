/**
 * True only once a condition has held for `delayMs`.
 *
 * The whole point of a skeleton is to cover a wait people can feel. A fast
 * answer covered by one flashes twice: placeholder in, placeholder out.
 */
export declare function useDelayedFlag(active: boolean, delayMs?: number): boolean;
/** One sweeping block. `width` is a Tailwind class so callers stay declarative. */
export declare function SkeletonBar({ width, height, delay, className, }: {
    readonly width?: string;
    readonly height?: string;
    /** Staggers the sweep between bars of one row, so it reads as one object. */
    readonly delay?: number;
    readonly className?: string;
}): import("react").JSX.Element;
/** The circle a row spends on a person, while the person is still arriving. */
export declare function SkeletonAvatar({ size }: {
    readonly size?: string;
}): import("react").JSX.Element;
/**
 * The list shape: a circle and two lines, repeated. Used by the conversation
 * queue and by anything else that is a list of people.
 */
export declare function SkeletonRows({ rows, className, }: {
    readonly rows?: number;
    readonly className?: string;
}): import("react").JSX.Element;
/** The table shape: the same column grid the real rows use. */
export declare function SkeletonTableRows({ rows, columns, }: {
    readonly rows?: number;
    readonly columns?: string;
}): import("react").JSX.Element;
/** The card shape: a label line and a number under it. */
export declare function SkeletonCards({ cards }: {
    readonly cards?: number;
}): import("react").JSX.Element;
/** A block of prose, for a detail pane whose fields are still arriving. */
export declare function SkeletonLines({ lines }: {
    readonly lines?: number;
}): import("react").JSX.Element;

import { type ReactNode } from 'react';
/**
 * The words the kit itself puts on screen, in one place a product can replace.
 *
 * Components take their own content as props; these are only the fixed words
 * a component adds on its own (a close button, a loading announcement). One
 * provider rather than a prop on each component, because a product translates
 * once, not at every call site. English is the default.
 */
export interface Labels {
    readonly close: string;
    readonly details: string;
    readonly dismiss: string;
    readonly undo: string;
    readonly loading: string;
    readonly deselect: string;
    readonly deselectAll: string;
    readonly selected: (count: number, total?: number) => string;
    readonly customColour: string;
    readonly noColour: string;
    readonly saturationBrightness: string;
    readonly hue: string;
    readonly navigation: string;
    readonly comingSoon: (label: string) => string;
    readonly switchTheme: (to: 'light' | 'dark') => string;
}
export declare const ENGLISH: Labels;
export declare function LabelsProvider({ labels, children, }: {
    readonly labels: Partial<Labels>;
    readonly children: ReactNode;
}): import("react").JSX.Element;
export declare function useLabels(): Labels;

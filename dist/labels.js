import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
export const ENGLISH = {
    close: 'Close',
    details: 'Details',
    dismiss: 'Dismiss',
    undo: 'Undo',
    loading: 'Loading',
    deselect: 'Deselect (Esc)',
    deselectAll: 'Deselect all',
    selected: (count, total) => (total === undefined ? `${count} selected` : `${count}/${total} selected`),
    customColour: 'Custom colour',
    noColour: 'No colour set',
    saturationBrightness: 'Saturation and brightness',
    hue: 'Hue',
    navigation: 'Navigation',
    comingSoon: (label) => `${label}, coming soon`,
    switchTheme: (to) => `Switch to the ${to} theme`,
};
const LabelsContext = createContext(ENGLISH);
export function LabelsProvider({ labels, children, }) {
    return _jsx(LabelsContext.Provider, { value: { ...ENGLISH, ...labels }, children: children });
}
export function useLabels() {
    return useContext(LabelsContext);
}

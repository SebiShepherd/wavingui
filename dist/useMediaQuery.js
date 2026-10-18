import { useEffect, useState } from 'react';
/**
 * A media query as state, kept in step with the window.
 *
 * The inbox already asked this question once and answered it only at mount, so
 * a window that changed size afterwards kept the answer from before. A layout
 * decision that a resize cannot reach is a layout decision that is wrong half
 * the time on a tablet that rotates.
 */
export function useMediaQuery(query, whenUnknown = true) {
    const [matches, setMatches] = useState(() => {
        // Where nobody can answer - server render, jsdom - the caller says what to
        // assume. The inbox assumes there is room, because guessing "phone" on a
        // desktop takes a layout away from somebody who has the width for it.
        if (typeof window === 'undefined' || !window.matchMedia)
            return whenUnknown;
        return window.matchMedia(query).matches;
    });
    useEffect(() => {
        const list = window.matchMedia?.(query);
        if (!list)
            return;
        setMatches(list.matches);
        const onChange = (event) => setMatches(event.matches);
        list.addEventListener('change', onChange);
        return () => list.removeEventListener('change', onChange);
    }, [query]);
    return matches;
}

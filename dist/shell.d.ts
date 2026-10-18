import type { ReactNode } from 'react';
import { type ThemeChoice } from './theme';
/**
 * The application frame: a rail on the left, one global bar above the content,
 * and the content itself.
 *
 * The content area is not padded and does not scroll. A screen decides whether
 * it is a document (`Page` supplies padding and scrolling) or a workspace that
 * fills the frame and scrolls its own columns.
 *
 * `h-dvh`, not `h-screen`: on a phone `100vh` ignores the browser's own chrome,
 * so the last strip of the app sits below the fold with no way to reach it.
 */
export declare function AppFrame({ rail, bar, children, }: {
    readonly rail?: ReactNode;
    readonly bar?: ReactNode;
    readonly children: ReactNode;
}): import("react").JSX.Element;
/** The global bar's frame: one height, one surface. Its contents are the product's. */
export declare function TopBar({ children }: {
    readonly children: ReactNode;
}): import("react").JSX.Element;
export interface RailItem {
    readonly id: string;
    readonly label: string;
    readonly href: string;
    readonly icon: ReactNode;
    readonly active?: boolean;
    /** Shown, named and not reachable: a destination that is planned. */
    readonly soon?: boolean;
}
/**
 * Icons-only navigation, 56px wide.
 *
 * The width belongs to a screen's own navigation, not to repeating words the
 * icons already carry (Zendesk's outer sidebar works the same way). The label
 * is never visible, so every target carries a tooltip and an accessible name;
 * the tooltip is the kit's own because the native `title` waits a second, never
 * fires on keyboard focus and does not exist in a screenshot. Active is a filled
 * pill with `aria-current`, so it is more than colour.
 *
 * The product says which item is active: the kit has no router.
 */
export declare function Rail({ brand, items, footer, }: {
    readonly brand?: ReactNode;
    readonly items: readonly RailItem[];
    /** Settings, the account, anything pinned to the bottom. */
    readonly footer?: ReactNode;
}): import("react").JSX.Element;
/**
 * Light or dark, as one button that names the set it will move to. `system`
 * resolves first, so following a dark operating system and pressing the sun
 * means light. Where the choice is stored is the product's business.
 */
export declare function ThemeToggle({ choice, onChange, className, }: {
    readonly choice: ThemeChoice;
    readonly onChange: (choice: ThemeChoice) => void;
    readonly className?: string;
}): import("react").JSX.Element;

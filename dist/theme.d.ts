export type ThemeChoice = 'system' | 'light' | 'dark';
/**
 * What `system` currently means. Outside a browser light is the honest answer:
 * it is the default set, so assuming it cannot flash the wrong one.
 */
export declare function prefersDark(): boolean;
/** The choice, resolved against the operating system. */
export declare function resolveTheme(choice: ThemeChoice): 'light' | 'dark';
/** Mirror a resolved theme onto the document. The only writer of that class. */
export declare function applyTheme(choice: ThemeChoice): void;
/**
 * Keep the document in step with a choice the product stores wherever it likes
 * (Hikaru on the server, a desktop app in a file). Mounted once, at the root.
 *
 * The first paint is already right, because `theme-init.js` sets the class
 * before React starts; this keeps it right when the choice changes, and while
 * the choice is `system` it follows the operating system as it changes.
 */
export declare function useThemeSync(choice: ThemeChoice): void;

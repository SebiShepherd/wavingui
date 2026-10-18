import { useEffect } from 'react';

export type ThemeChoice = 'system' | 'light' | 'dark';

/** The class the dark token set hangs off. `wavingui.css` defines `.dark`. */
const DARK_CLASS = 'dark';

/**
 * What `system` currently means. Outside a browser light is the honest answer:
 * it is the default set, so assuming it cannot flash the wrong one.
 */
export function prefersDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/** The choice, resolved against the operating system. */
export function resolveTheme(choice: ThemeChoice): 'light' | 'dark' {
  if (choice === 'system') return prefersDark() ? 'dark' : 'light';
  return choice;
}

/** Mirror a resolved theme onto the document. The only writer of that class. */
export function applyTheme(choice: ThemeChoice): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle(DARK_CLASS, resolveTheme(choice) === 'dark');
}

/**
 * Keep the document in step with a choice the product stores wherever it likes
 * (Hikaru on the server, a desktop app in a file). Mounted once, at the root.
 *
 * The first paint is already right, because `theme-init.js` sets the class
 * before React starts; this keeps it right when the choice changes, and while
 * the choice is `system` it follows the operating system as it changes.
 */
export function useThemeSync(choice: ThemeChoice): void {
  useEffect(() => {
    applyTheme(choice);
    if (choice !== 'system' || !window.matchMedia) return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [choice]);
}

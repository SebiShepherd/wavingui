import { type RefObject } from 'react';
/**
 * Register a modal for as long as the component rendering it is mounted.
 *
 * `active` is for the dialogs that mount closed and return null - the command
 * palette is always in the tree - so that "mounted" and "on screen" are the
 * same fact here.
 */
export declare function useModalPresence(active?: boolean): void;
/**
 * Keyboard focus, for as long as a dialog is on screen.
 *
 * Three things, all of which the app was doing in one dialog and nowhere else:
 * put focus inside when it opens, keep Tab from walking out of it, and give
 * focus back to whatever opened it on the way out. Without them a dialog
 * opened from the keyboard leaves focus on its trigger, and every Tab after
 * that walks the controls under the scrim - `aria-modal` says the rest is
 * inert, and the browser does not make it so.
 *
 * `ref` is the dialog's own element. `initial` is what should hold focus when
 * it opens; the dialog's first focusable is used when it is absent.
 */
export declare function useDialogFocus(ref: RefObject<HTMLElement | null>, initial?: RefObject<HTMLElement | null>): void;
/** True while any modal is mounted. Server snapshot is `false`: nothing is up yet. */
export declare function useAnyModalOpen(): boolean;

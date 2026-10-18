import { useEffect, useSyncExternalStore } from 'react';
/**
 * Whether anything modal is on screen, app-wide.
 *
 * A dialog dims the page with its own scrim, and everything under that scrim is
 * meant to read as out of reach. A floating bar does not: it is positioned by
 * the pane it belongs to, it carries its own surface and shadow, and it went on
 * painting at full strength over the dimmed list beneath it while the ticket's
 * merge dialog asked about the very rows it held (#443).
 *
 * The bar could not see the dialog because there is no one dialog: four screens
 * each write their own `fixed inset-0` scrim. Rather than route "a dialog is
 * open" down through the props of every page between them, this is one counter
 * every modal joins on mount and leaves on unmount, and one hook the chrome
 * subscribes to. A module-level store rather than a context because the two
 * ends are in unrelated trees - the dialog is a child of the ticket pane, the
 * bar is a child of the queue - and a provider high enough to hold both would
 * re-render the whole app on every dialog.
 *
 * Counted, not a boolean: a confirm raised from inside a dialog closes first,
 * and a boolean would report the page as clear while the outer dialog is still
 * up.
 */
let openModals = 0;
const listeners = new Set();
function emit() {
    for (const listener of listeners)
        listener();
}
function subscribe(listener) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}
/**
 * Register a modal for as long as the component rendering it is mounted.
 *
 * `active` is for the dialogs that mount closed and return null - the command
 * palette is always in the tree - so that "mounted" and "on screen" are the
 * same fact here.
 */
export function useModalPresence(active = true) {
    useEffect(() => {
        if (!active)
            return;
        openModals += 1;
        emit();
        return () => {
            openModals -= 1;
            emit();
        };
    }, [active]);
}
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
export function useDialogFocus(ref, initial) {
    useEffect(() => {
        const node = ref.current;
        if (!node)
            return;
        // Rebound so the narrowing survives into the closures below.
        const dialog = node;
        const opener = document.activeElement;
        const focusable = () => [
            ...dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        ].filter((element) => element.offsetParent !== null);
        (initial?.current ?? focusable()[0] ?? dialog).focus();
        function onKeyDown(event) {
            if (event.key !== 'Tab')
                return;
            const stops = focusable();
            if (stops.length === 0)
                return;
            const first = stops[0];
            const last = stops[stops.length - 1];
            const on = document.activeElement;
            // Wrapping rather than blocking: Tab from the last control is how a
            // keyboard user reaches the first one, and a dialog that swallows it
            // makes the trip one way.
            if (!event.shiftKey && (on === last || !dialog.contains(on))) {
                event.preventDefault();
                first.focus();
            }
            else if (event.shiftKey && (on === first || !dialog.contains(on))) {
                event.preventDefault();
                last.focus();
            }
        }
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            // Back where it came from: a dialog that dismisses into nothing leaves a
            // keyboard user at the top of the document.
            opener?.focus?.();
        };
        // Mount and unmount: the dialog is rendered conditionally, so those are the
        // moments it opens and closes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
/** True while any modal is mounted. Server snapshot is `false`: nothing is up yet. */
export function useAnyModalOpen() {
    return useSyncExternalStore(subscribe, () => openModals > 0, () => false);
}

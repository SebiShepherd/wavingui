import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Undo2, X } from 'lucide-react';
import { useLabels } from './labels';

/** How long an actionable toast stays. */
const LIFETIME_MS = 6_000;

export interface ToastRequest {
  /** What happened, in the past tense: "3 tickets moved to trash". */
  readonly message: string;
  /** Offered as Undo. Reversible actions have one; the rest do not. */
  readonly undo?: (() => void) | undefined;
  /**
   * The one thing to do next, where taking it back is not the thing.
   *
   * A merge is final, so it has no undo; what the agent wants at that moment is
   * the ticket the messages moved into. Undo wins if both are given: a toast
   * with two buttons is a decision where a confirmation should have been.
   */
  readonly action?: { readonly label: string; readonly run: () => void } | undefined;
}

interface ToastState extends ToastRequest {
  readonly id: number;
}

interface ToastHandle {
  readonly show: (request: ToastRequest) => void;
}

const ToastContext = createContext<ToastHandle | null>(null);

/**
 * The toast itself, without the machinery that schedules it. Exported so the
 * gallery can render both of its states side by side: a component whose only
 * appearance is behind a click is a component nobody reviews.
 */
export function Toast({
  message,
  undo,
  action,
  onDismiss,
}: {
  readonly message: string;
  readonly undo?: (() => void) | undefined;
  readonly action?: { readonly label: string; readonly run: () => void } | undefined;
  readonly onDismiss: () => void;
}) {
  const L = useLabels();
  const offered = undo ? null : action;
  return (
    <div
      role="status"
      aria-live="polite"
      className="pop-in pointer-events-auto min-w-[280px] overflow-hidden rounded-card border border-border bg-overlay px-3.5 py-2.5 shadow-bar"
    >
      <div className="flex items-center gap-3">
        <span className="text-sm text-fg">{message}</span>
        {undo && (
          <button
            type="button"
            onClick={undo}
            className="ml-auto inline-flex items-center gap-1.5 rounded-pill px-2 py-1 text-sm font-semibold text-accent transition-press hover:bg-accent-wash"
          >
            <Undo2 className="h-4 w-4" aria-hidden />
            {L.undo}
          </button>
        )}
        {offered && (
          <button
            type="button"
            onClick={offered.run}
            className="ml-auto inline-flex items-center gap-1.5 rounded-pill px-2 py-1 text-sm font-semibold text-accent transition-press hover:bg-accent-wash"
          >
            {offered.label}
          </button>
        )}
        <button
          type="button"
          aria-label={L.dismiss}
          onClick={onDismiss}
          className={`rounded-pill p-1 text-subtle transition-press hover:text-fg ${undo || offered ? '' : 'ml-auto'}`}
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
      {/* Only where there is something to lose by waiting: the bar is how long
          the way back is still open, so on a toast with no undo it would be a
          countdown to nothing. */}
      {undo && (
        <span
          aria-hidden
          className="drain mt-2 block h-[3px] rounded-full bg-accent"
          style={{ animationDuration: `${LIFETIME_MS}ms` }}
        />
      )}
    </div>
  );
}

/**
 * Feedback for actions that used to ask permission first.
 *
 * NN/g's third rule for bulk actions is clear feedback with a way to undo, and
 * Gmail is the reference implementation: do the thing, say what was done, and
 * offer to take it back. A confirmation dialog on a reversible action buys
 * nothing, because people confirm dialogs without reading them; it only costs a
 * click on every single use. Irreversible actions still get a real dialog.
 *
 * One toast at a time on purpose. A stack of them is a second list to read at
 * the moment somebody is trying to read the first one.
 */
export function ToastProvider({ children }: { readonly children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const show = useCallback((request: ToastRequest) => {
    setToast({ ...request, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), LIFETIME_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        // Out of the floating bar's way, which it used to sit exactly on top
        // of: both are bottom-centred, so a confirmation covered the "Set
        // status" and "Tag" buttons of the very bulk bar that raised it, while
        // the selection was still live.
        //
        // Above it at every width. "Beside it on a wide screen" was the rule
        // before, and beside it is where the bar keeps its way out of selection
        // mode: the confirmation covered "Clear" while the selection it was
        // confirming was still live.
        // The two are deliberately the same kind of surface (one floating-bar
        // vocabulary, per docs/design/surfaces/theme.md), which is exactly why
        // they must not stack: two identical bars in one place read as one bar
        // that changed its mind.
        <div className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 sm:justify-end sm:pr-6">
          <Toast
            message={toast.message}
            undo={
              toast.undo
                ? () => {
                    toast.undo?.();
                    setToast(null);
                  }
                : undefined
            }
            action={
              toast.action
                ? {
                    label: toast.action.label,
                    run: () => {
                      toast.action?.run();
                      setToast(null);
                    },
                  }
                : undefined
            }
            onDismiss={() => setToast(null)}
          />
        </div>
      )}
    </ToastContext.Provider>
  );
}

/**
 * Say what just happened. Outside a provider this is a no-op rather than an
 * error: a missing toast must never be the reason a mutation appears to fail.
 */
export function useToast(): ToastHandle {
  return useContext(ToastContext) ?? { show: () => undefined };
}

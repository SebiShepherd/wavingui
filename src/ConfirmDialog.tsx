import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { useModalPresence } from './modal';

interface ConfirmDialogProps {
  readonly title: string;
  /** What will happen, in words, including anything that cannot be undone. */
  readonly body: string;
  readonly confirmLabel: string;
  /** Destructive confirmations carry the warning treatment. */
  readonly destructive?: boolean;
  readonly busy?: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  /**
   * What the way out is called. "Cancel" beside "Discard changes" asks the
   * reader which of the two cancels what; a dialog that guards unsaved work
   * says "Keep editing" instead.
   */
  readonly cancelLabel?: string;
}

/**
 * The app's confirmation, replacing `window.confirm` on destructive paths. The
 * native dialog cannot carry the theme, cannot state consequences in more than
 * one line, and puts the confirm button wherever the OS wants it. Escape and
 * the backdrop cancel; focus starts on Cancel so an accidental Enter does not
 * destroy anything.
 */
export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useModalPresence();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-scrim p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        className="pop-in w-full max-w-md rounded-[18px] border border-border bg-overlay p-6 shadow-popover"
      >
        <div className="flex items-start gap-3">
          {destructive && (
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden />
          )}
          <div>
            <h2 className="text-[17px] font-semibold text-fg">{title}</h2>
            <p className="mt-2.5 text-sm leading-relaxed text-muted">{body}</p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <Button ref={cancelRef} variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={destructive ? 'danger' : 'primary'} disabled={busy} onClick={onConfirm}>
            {busy ? 'Working…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

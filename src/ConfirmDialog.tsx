import { useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { Dialog } from './Dialog';

interface ConfirmDialogProps {
  /** Rendered with `false`, it plays its exit and then unmounts. */
  readonly open?: boolean;
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
  open = true,
  title,
  body,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <Dialog
      open={open}
      role="alertdialog"
      title={title}
      onClose={onCancel}
      initialFocus={cancelRef}
      leading={destructive ? <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden /> : undefined}
      footer={
        <>
          <Button ref={cancelRef} variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={destructive ? 'danger' : 'primary'} disabled={busy} onClick={onConfirm}>
            {busy ? 'Working…' : confirmLabel}
          </Button>
        </>
      }
    >
      <p className="mt-2.5 text-sm leading-relaxed text-muted">{body}</p>
    </Dialog>
  );
}

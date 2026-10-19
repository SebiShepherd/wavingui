import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { useDialogFocus, useModalPresence } from './modal';

/** `--duration-overlay`, the length of the exit the overlay is kept mounted for. */
const OVERLAY_MS = 200;

/**
 * Keep an overlay on screen until its exit has run.
 *
 * A dialog or toast that unmounts the moment it closes vanishes without the
 * motion it arrived with (wavingui#1). So the caller says whether the overlay
 * is wanted (`open`), and this says whether it is still drawn (`mounted`) and
 * whether it is on its way out (`leaving`, which picks the exit classes). With
 * reduced motion there is nothing to wait for and it unmounts at once.
 */
export function usePresence(open: boolean): { readonly mounted: boolean; readonly leaving: boolean } {
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    const reduced = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => setMounted(false), reduced ? 0 : OVERLAY_MS);
    return () => window.clearTimeout(timer);
  }, [open]);
  return { mounted: mounted || open, leaving: mounted && !open };
}

interface DialogProps {
  /** Whether the dialog is wanted. Rendered with `false`, it plays its exit and then unmounts. */
  readonly open?: boolean;
  readonly title: string;
  /** Escape, the backdrop and every way out the caller offers end here. */
  readonly onClose: () => void;
  /** `alertdialog` for a question that interrupts, `dialog` for a task. */
  readonly role?: 'dialog' | 'alertdialog';
  /** What holds focus when it opens; the first focusable control otherwise. */
  readonly initialFocus?: RefObject<HTMLElement | null>;
  readonly width?: 'md' | 'lg';
  /** The buttons, right-aligned under the body. */
  readonly footer?: ReactNode;
  /** Something drawn before the title, such as a warning icon. */
  readonly leading?: ReactNode;
  readonly children?: ReactNode;
}

/**
 * The kit's modal: scrim, panel, title, body and footer, with focus held
 * inside, Escape and the backdrop closing it, the floating bar told to stand
 * back (`useModalPresence`), and a motion both ways. Products build their own
 * dialogs on this rather than copying its classes, so they open and close the
 * same way.
 */
export function Dialog({ open = true, ...props }: DialogProps) {
  const { mounted, leaving } = usePresence(open);
  if (!mounted) return null;
  return <Panel {...props} leaving={leaving} />;
}

function Panel({
  title,
  onClose,
  role = 'dialog',
  initialFocus,
  width = 'md',
  footer,
  leading,
  children,
  leaving,
}: Omit<DialogProps, 'open'> & { readonly leaving: boolean }) {
  const panel = useRef<HTMLDivElement>(null);
  useModalPresence();
  useDialogFocus(panel, initialFocus);

  useEffect(() => {
    if (leaving) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, leaving]);

  return (
    <div
      className={`fixed inset-0 z-50 grid place-items-center bg-scrim p-4 ${leaving ? 'scrim-out pointer-events-none' : 'scrim-in'}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panel}
        role={role}
        aria-modal="true"
        aria-label={title}
        className={`${leaving ? 'pop-out' : 'pop-in'} max-h-[calc(100dvh-2rem)] w-full overflow-y-auto rounded-[18px] border border-border bg-overlay p-6 shadow-popover ${width === 'lg' ? 'max-w-lg' : 'max-w-md'}`}
      >
        <div className="flex items-start gap-3">
          {leading}
          <div className="min-w-0 flex-1">
            <h2 className="text-[17px] font-semibold text-fg">{title}</h2>
            {children}
          </div>
        </div>
        {footer && <div className="mt-6 flex flex-wrap items-center justify-end gap-2.5">{footer}</div>}
      </div>
    </div>
  );
}

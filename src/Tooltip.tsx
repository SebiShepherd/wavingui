import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * The name of a control that shows only a glyph.
 *
 * Every icon-only target in the app used to set the native `title`, which is
 * the browser's tooltip and not ours: it waits about a second, it never appears
 * on keyboard focus, it cannot be styled to match the surface it floats over,
 * and it does not exist in a screenshot - so an evaluator hovering the rail saw
 * nothing and filed the rail as unlabelled (#352, #353). A control whose name
 * only appears in the accessibility tree is unlabelled to everyone looking at
 * the screen.
 *
 * The rail stays icon-only regardless: at 56px the width belongs to the
 * module's own navigation in the pane beside it, which is the arrangement both
 * references use - Zendesk's outer sidebar is icon-only navigation between
 * feature areas, and Intercom's help desk puts an icon rail beside a labelled
 * nav column. So the answer is the tooltip, done properly, rather than labels
 * or a collapse toggle.
 *
 * **It is a visual affordance, and only that.** The bubble is `aria-hidden` and
 * the trigger keeps its own `aria-label`: wiring `aria-describedby` to a
 * duplicate of the name is how a button comes to announce "Contacts, Contacts".
 * A trigger with no accessible name of its own is a bug this cannot paper over.
 *
 * Wrapping is `display: contents`, so the wrapper adds no box: a rail entry
 * stays a direct flex child of the rail and a row button stays where the row
 * put it. Events still bubble through a box-less element, and the rectangle
 * comes from the child that does have one.
 */

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

/**
 * Long enough that sweeping the pointer across a toolbar does not flash five
 * bubbles, short enough to answer someone who has stopped on one thing and is
 * asking what it is. Keyboard focus does not wait: arriving by Tab is already
 * deliberate.
 */
const HOVER_DELAY_MS = 400;
const GAP = 8;
const MARGIN = 8;

interface TooltipProps {
  /** What the control is called. The trigger must carry this name itself too. */
  readonly label: string;
  /** Which side to prefer. It flips when that side has no room. */
  readonly side?: TooltipSide;
  /**
   * Pass the trigger through untouched. For a control that shows its word at
   * one width and hides it at another: the same call site wants the tooltip
   * only where the word is gone, and a tooltip repeating a visible label is
   * noise.
   */
  readonly disabled?: boolean;
  readonly children: ReactNode;
}

export function Tooltip({ label, side = 'top', disabled = false, children }: TooltipProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);

  const cancel = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const hide = useCallback(() => {
    cancel();
    setOpen(false);
  }, [cancel]);

  useEffect(() => cancel, [cancel]);

  if (disabled) return children;

  return (
    <span
      ref={wrapRef}
      style={{ display: 'contents' }}
      onMouseEnter={() => {
        cancel();
        timer.current = setTimeout(() => setOpen(true), HOVER_DELAY_MS);
      }}
      onMouseLeave={hide}
      // A press is an answer to the question the tooltip asks, so the bubble
      // goes rather than hanging over whatever the click just opened.
      onMouseDown={hide}
      onFocus={(event) => {
        // Only the focus a person can see. Clicking a button focuses it too,
        // and a bubble that appears on every click is noise.
        if ((event.target as HTMLElement).matches?.(':focus-visible')) setOpen(true);
      }}
      onBlur={hide}
      onKeyDown={(event) => {
        if (event.key === 'Escape') hide();
      }}
    >
      {children}
      {open && <Bubble anchor={wrapRef} label={label} side={side} />}
    </span>
  );
}

/**
 * The bubble itself, portaled for the same reason the anchored popover is: no
 * `z-index` escapes an ancestor's clipping box, and these hang off controls
 * inside scrolling panes and rounded cards.
 */
function Bubble({
  anchor,
  label,
  side,
}: {
  readonly anchor: React.RefObject<HTMLSpanElement | null>;
  readonly label: string;
  readonly side: TooltipSide;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ top: number; left: number } | null>(null);

  const place = useCallback(() => {
    // The wrapper is `display: contents` and so has no rectangle of its own.
    // The trigger it wraps does.
    const trigger = anchor.current?.firstElementChild as HTMLElement | null;
    const bubble = ref.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const width = bubble?.offsetWidth ?? 0;
    const height = bubble?.offsetHeight ?? 0;

    const room = {
      top: rect.top,
      bottom: window.innerHeight - rect.bottom,
      left: rect.left,
      right: window.innerWidth - rect.right,
    };
    const needed = side === 'top' || side === 'bottom' ? height + GAP : width + GAP;
    const opposite: Record<TooltipSide, TooltipSide> = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left',
    };
    const used = room[side] < needed && room[opposite[side]] >= needed ? opposite[side] : side;

    const clamp = (value: number, extent: number, limit: number) =>
      Math.max(MARGIN, Math.min(value, limit - extent - MARGIN));

    const top =
      used === 'top'
        ? rect.top - height - GAP
        : used === 'bottom'
          ? rect.bottom + GAP
          : rect.top + rect.height / 2 - height / 2;
    const left =
      used === 'left'
        ? rect.left - width - GAP
        : used === 'right'
          ? rect.right + GAP
          : rect.left + rect.width / 2 - width / 2;

    setBox({
      top: clamp(top, height, window.innerHeight),
      left: clamp(left, width, window.innerWidth),
    });
  }, [anchor, side]);

  useLayoutEffect(() => {
    place();
    // A second pass once the bubble has been measured: the first runs before
    // the browser knows how wide the text made it, and the width is what
    // decides both the flip and the centring.
    const frame = requestAnimationFrame(place);
    return () => cancelAnimationFrame(frame);
  }, [place, label]);

  useEffect(() => {
    const onScroll = () => place();
    // `capture`, because the trigger usually sits in a pane whose scroll does
    // not reach the window.
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [place]);

  return createPortal(
    <div
      ref={ref}
      role="tooltip"
      aria-hidden
      data-tooltip
      style={{
        position: 'fixed',
        top: box?.top ?? -9999,
        left: box?.left ?? -9999,
        visibility: box ? 'visible' : 'hidden',
      }}
      className="pointer-events-none z-[60] max-w-64 rounded-[8px] bg-fg px-2 py-1 text-xs font-medium text-bg shadow-popover"
    >
      {label}
    </div>,
    document.body,
  );
}

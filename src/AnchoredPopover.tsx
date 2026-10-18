import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * A panel that hangs off a trigger and is not clipped by anything around it.
 *
 * Every menu in the app used to be an absolutely positioned sibling of its
 * trigger, which works until an ancestor sets `overflow-hidden` - and the
 * members list does, to keep its divided rows inside the card's rounded
 * corners. The result was a role menu cut off at the card's bottom edge, with
 * the last row's menu almost entirely invisible (#266). No `z-index` escapes a
 * clipping box; only leaving the box does.
 *
 * So the panel is rendered into `document.body` and positioned in viewport
 * coordinates against the trigger's rectangle. That is the same answer the
 * headless-UI libraries reach (Radix, Headless UI and Downshift all portal
 * their floating elements for exactly this reason); it is written here rather
 * than taken as a dependency because what we need is one small anchored panel,
 * not a positioning engine.
 *
 * Two behaviours come with leaving the flow, and both are the point:
 *
 *  - **It flips up** when the space below the trigger cannot hold it. The old
 *    in-flow menus could not do this: they had no idea how tall they were until
 *    they were already drawn in the wrong place.
 *  - **It follows the trigger** on scroll and resize, because a fixed-position
 *    panel over a scrolling list would otherwise sit still while its trigger
 *    walks away.
 */

/** Breathing room between the trigger and the panel, and off the viewport edge. */
const GAP = 8;
const MARGIN = 8;
/**
 * The panel is as wide as its trigger and no wider, up to a reading width.
 *
 * Width has to be measured rather than inherited: a portaled panel's relative
 * width resolves against the viewport, so a trigger styled `w-full` inside a
 * 320px pane drew a menu the width of the window. The cap is what keeps a very
 * wide trigger - a full-width field on a large screen - from producing a menu
 * of five words spread across half a metre.
 */
const MAX_WIDTH = 420;

interface AnchoredPopoverProps {
  /** The element the panel hangs off. */
  readonly anchorRef: React.RefObject<HTMLElement | null>;
  /** Called for Escape and for a pointer press outside both trigger and panel. */
  readonly onDismiss: (viaKeyboard: boolean) => void;
  readonly children: ReactNode;
  /** Accessible name for the panel, where it needs one of its own. */
  readonly label?: string;
  readonly className?: string;
}

export function AnchoredPopover({
  anchorRef,
  onDismiss,
  children,
  label,
  className = '',
}: AnchoredPopoverProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  // Nothing is drawn until the first measurement, so the panel never appears at
  // the top-left corner for a frame before it finds its trigger.
  const [box, setBox] = useState<{ top: number; left: number; width: number } | null>(null);

  const place = useCallback(() => {
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const height = panel?.offsetHeight ?? 0;
    const width = panel?.offsetWidth ?? rect.width;

    const below = window.innerHeight - rect.bottom - MARGIN;
    const above = rect.top - MARGIN;
    const flip = height > below && above > below;

    // Held inside the viewport horizontally: a menu on a right-hand column
    // would otherwise hang off the edge of the window.
    const panelWidth = Math.min(
      Math.max(rect.width, width),
      MAX_WIDTH,
      window.innerWidth - 2 * MARGIN,
    );
    const left = Math.max(MARGIN, Math.min(rect.left, window.innerWidth - panelWidth - MARGIN));
    setBox({
      top: flip ? Math.max(MARGIN, rect.top - height - GAP) : rect.bottom + GAP,
      left,
      width: panelWidth,
    });
  }, [anchorRef]);

  useLayoutEffect(() => {
    place();
    // A second pass once the panel has been measured: the first runs before the
    // browser knows how tall the panel is, which is what decides the flip.
    const frame = requestAnimationFrame(place);
    return () => cancelAnimationFrame(frame);
  }, [place, children]);

  useEffect(() => {
    // `capture` because the trigger usually sits inside a scrolling pane, and a
    // scroll there does not bubble to the window.
    const onScroll = () => place();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || anchorRef.current?.contains(target)) return;
      onDismiss(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onDismiss(true);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [place, onDismiss, anchorRef]);

  return createPortal(
    <div
      ref={panelRef}
      role="group"
      aria-label={label}
      style={{
        position: 'fixed',
        top: box?.top ?? -9999,
        left: box?.left ?? -9999,
        width: box?.width,
        visibility: box ? 'visible' : 'hidden',
      }}
      className={`z-50 ${className}`}
    >
      {children}
    </div>,
    document.body,
  );
}

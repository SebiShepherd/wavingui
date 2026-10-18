import { useEffect, useRef } from 'react';
import { Check, Minus } from 'lucide-react';

interface CheckboxProps {
  readonly checked: boolean;
  /**
   * Some of what this box stands for is selected, not all of it. Only a
   * select-all has anything to say here; a row's own box is on or off.
   */
  readonly someChecked?: boolean;
  readonly onChange: () => void;
  /** What is being selected: "Select HD-2026-0001". Never just "Select". */
  readonly label: string;
  readonly className?: string;
}

/**
 * The one box that says "this is picked".
 *
 * One component because the app had two shapes for the idea - a square box in a
 * list header and a round tick inside an avatar in the rows under it - and a
 * header control that looks nothing like the controls it commands reads as an
 * unrelated widget that happens to sit above them.
 *
 * The third state is the one that has to be here rather than at the callers:
 * `indeterminate` is not an attribute, it is a DOM property, so it cannot be
 * written in JSX and every caller that tried got a box that showed "none
 * selected" while five rows were selected under it.
 *
 * The skin is ours rather than the browser's. `accent-color` tints the tick and
 * the fill and leaves the *unchecked* box to the platform, which draws it as a
 * white square with a grey edge - correct on a light page and a bright hole in
 * a dark one, which is what the queue header looked like. There is no CSS for
 * "the unchecked box", so the whole control is `appearance-none` and the two
 * states are drawn here from the same tokens as everything else: transparent
 * with an edge at rest, the accent filled with `accent-on` on it when it holds
 * something. Both reference inboxes do this; so does every design system with a
 * checkbox in it, and for this reason.
 *
 * The edge is `subtle`, not `border`. `border` is what panels and rows are
 * drawn with - #2c3038 on a #1b1d23 surface, 1.25:1 - and an empty box is
 * nothing but its edge, so that edge is the boundary WCAG 2.2 SC 1.4.11 asks
 * for 3:1 of. `subtle` measures 4.4:1 in the dark theme and 3.4:1 in the light
 * one; `faint`, the next step in, is 2.7:1 and fails.
 */
export function Checkbox({
  checked,
  someChecked = false,
  onChange,
  label,
  className,
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  const partial = someChecked && !checked;

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = partial;
  }, [partial]);

  return (
    // The box is 16px and the thing you have to hit is 28. WCAG 2.5.8 asks for
    // 24 CSS pixels of target and this one missed it by eight in every list
    // header and every table row; the label carries the extra as padding it
    // takes back with a negative margin, so nothing in the row moves. Material
    // does the same thing - the icon looks 24dp, the padding around it makes
    // the target 48.
    <label className="relative -m-1.5 inline-flex cursor-pointer items-center justify-center p-1.5">
      <input
        ref={ref}
        type="checkbox"
        aria-label={label}
        checked={checked}
        onChange={onChange}
        className={`h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-[5px] border transition-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-bg ${
          // One of two sets, never a base plus an override: `border-border` and
          // `border-accent` set the same property, and which of two such classes
          // applies is decided by the order Tailwind emitted them rather than by
          // the order they were written (`field.ts` says the same about pills).
          checked || partial
            ? 'border-accent bg-accent'
            : 'border-subtle bg-transparent hover:border-muted'
        } ${className ?? ''}`}
      />
      {/* Drawn over the box rather than inside it: an `appearance-none` input
          has no content box to put a glyph in. `inset-1.5` is the label's own
          padding, so this lands exactly on the 16px box however the caller
          sizes the target around it. */}
      {(checked || partial) && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-1.5 flex items-center justify-center text-accent-on"
        >
          {partial ? (
            <Minus className="h-3 w-3" strokeWidth={3} />
          ) : (
            <Check className="h-3 w-3" strokeWidth={3} />
          )}
        </span>
      )}
    </label>
  );
}

import { useRef, useState, type ReactNode } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { AnchoredPopover } from './AnchoredPopover';
import { MENU_ITEM, POPOVER } from './field';
import { opticalText } from './opticalText';

/**
 * One verb, plus the other values that verb could have set.
 *
 * This is the shape both reference helpdesks use for a ticket's status, and
 * the reason is that a status with two editors on one screen has no stated
 * relation between them: is the button a shortcut for the dropdown, or
 * something else? Zendesk answers it with `Submit as [status]` - the arrow
 * beside the button is where every other status lives, and the ticket's own
 * field panel has no status in it. Intercom answers it with the state button in
 * the top right, whose menu holds the other states, while the sidebar holds
 * attributes. Neither product lets two controls set the same field.
 *
 * So: the wide half does the thing that is almost always wanted, and the
 * narrow half is where the rest of the vocabulary lives. The wide half may be
 * disabled - a resolved ticket cannot be resolved again - while the narrow half
 * stays live, because "put this back to open" is exactly what is wanted then.
 *
 * The shape is here rather than assembled from two `Button`s at the call site:
 * a pill split in two needs its corners squared where the halves meet, and a
 * caller adding `rounded-r-none` to a `rounded-pill` is relying on the order
 * Tailwind emitted the two rules in (`ui/Button.tsx` says the same about
 * colours).
 */

export interface SplitButtonOption {
  readonly value: string;
  readonly label: string;
  /** One line under the label saying what picking it means, where two options could be confused. */
  readonly description?: string;
  /** Marked with a tick and not offered as a change. */
  readonly current?: boolean;
  readonly disabled?: boolean;
  /**
   * `danger` for the one option that undoes what the control is for (removing
   * a lock from a lock control): drawn in the danger colour below a rule, with
   * its icon in the tick's place, so it is not read as one more value.
   */
  readonly tone?: 'danger';
  readonly icon?: ReactNode;
}

interface SplitButtonProps {
  /** The wide half: what the screen thinks you want. */
  readonly label: string;
  readonly icon?: ReactNode;
  readonly onClick: () => void;
  readonly disabled?: boolean;
  /** Accessible name for the narrow half, e.g. "Set status". */
  readonly menuLabel: string;
  /**
   * Names the pair as one control, e.g. "Status". Without it the accessibility
   * tree shows two adjacent buttons with no stated relation, which is what a
   * screen reader hears and what the walkthroughs kept reporting as two
   * controls for one field (#428, #438, #376) - a shape that is obvious by
   * sight is not obvious in a snapshot.
   */
  readonly groupLabel: string;
  readonly options: readonly SplitButtonOption[];
  readonly onSelect: (value: string) => void;
  /**
   * Classes on the wide half's word, for a caller that wants it to fold at a
   * width only the caller knows about (a container query on its own pane).
   * The accessible name is on the button either way, so the control is called
   * the same thing whether or not its word is drawn.
   */
  readonly labelClassName?: string;
}

const HALF =
  'inline-flex items-center bg-accent text-accent-on transition-press hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-45';

export function SplitButton({
  label,
  icon,
  onClick,
  disabled = false,
  menuLabel,
  groupLabel,
  options,
  onSelect,
  labelClassName,
}: SplitButtonProps) {
  const caretRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <div
      role="group"
      aria-label={groupLabel}
      className="inline-flex h-8 shrink-0 items-stretch overflow-hidden rounded-pill"
    >
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        aria-label={label}
        className={`${HALF} gap-2 whitespace-nowrap px-3 text-[13px] font-semibold`}
      >
        {icon}
        {/* `hidden` removes the word as a flex item, so the gap beside it goes
            with it and the half collapses to a square around the tick. */}
        <span className={labelClassName}>{opticalText(label)}</span>
      </button>

      {/* The divider is on the caret rather than between the two, so it does
          not survive as a stray line when the wide half is disabled and pales. */}
      <button
        ref={caretRef}
        type="button"
        aria-label={menuLabel}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className={`${HALF} w-7 justify-center border-l border-accent-on/25`}
      >
        <ChevronDown className="h-3.5 w-3.5" aria-hidden />
      </button>

      {open && (
        <AnchoredPopover
          anchorRef={caretRef}
          label={menuLabel}
          onDismiss={() => {
            setOpen(false);
            caretRef.current?.focus();
          }}
          className={`min-w-44 p-1 ${POPOVER}`}
        >
          {/* The menu says what it sets. The wide half beside it is one value of
              the same field, and a menu that opens onto a bare list of statuses
              leaves the reader to infer that. */}
          <p className="px-2.5 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-subtle">
            {menuLabel}
          </p>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="menuitem"
              disabled={option.disabled}
              onClick={() => {
                setOpen(false);
                if (!option.current) onSelect(option.value);
              }}
              className={`${MENU_ITEM} ${option.current ? 'text-fg' : ''} ${
                option.tone === 'danger'
                  ? 'mt-1 rounded-t-none border-t border-border !text-danger hover:bg-danger-wash'
                  : ''
              } disabled:opacity-45`}
            >
              {option.icon ? (
                <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center" aria-hidden>
                  {option.icon}
                </span>
              ) : (
                <Check
                  className={`h-3.5 w-3.5 shrink-0 ${option.current ? 'text-accent' : 'invisible'}`}
                  aria-hidden
                />
              )}
              <span className="flex min-w-0 flex-col items-start">
                <span className="truncate">{option.label}</span>
                {option.description && (
                  <span className="text-[11px] font-normal leading-tight text-subtle">
                    {option.description}
                  </span>
                )}
              </span>
            </button>
          ))}
        </AnchoredPopover>
      )}
    </div>
  );
}

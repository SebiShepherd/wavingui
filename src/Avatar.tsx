import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { Checkbox } from './Checkbox';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';
export type AvatarTone = 'neutral' | 'accent' | 'warning' | 'quiet';

const SIZE: Record<AvatarSize, string> = {
  // Small enough to sit inside a 30px pill with a real inset around it. It is a
  // size rather than a class a caller passes in, because two utilities setting
  // the same property are decided by the order Tailwind emitted them, not by
  // the order the caller wrote them - and the caller silently loses.
  xs: 'h-5 w-5 text-[10px]',
  sm: 'h-7 w-7 text-xs',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
};

/**
 * Four tints, each meaning something: nobody in particular, us, an internal
 * message, and somebody who cannot sign in. A fifth would need a fifth meaning.
 */
const TONE: Record<AvatarTone, string> = {
  neutral: 'bg-surface-raised text-muted',
  accent: 'bg-accent-wash text-accent',
  warning: 'bg-warning-wash text-warning',
  quiet: 'bg-surface-raised text-subtle',
};

/** First letter of a name, or a dash when there is no name to take one from. */
export function initial(name: string | null | undefined): string {
  const trimmed = name?.trim();
  return trimmed ? trimmed.slice(0, 1).toUpperCase() : '-';
}

interface AvatarProps {
  /** Who it stands for. Used for the initial and, unless overridden, the title. */
  readonly name: string | null | undefined;
  /** Their picture. Fills the circle; falls back to the letters when absent. */
  readonly imageUrl?: string | null;
  /**
   * The letters, when the caller has a rule for them. `Person` passes this so
   * that which initials a name yields is decided in one place rather than by
   * whoever renders the circle.
   */
  readonly initials?: string;
  readonly size?: AvatarSize;
  readonly tone?: AvatarTone;
  /** Extra classes for a caller that also needs position or hover state. */
  readonly className?: string;
  /** Replaces the initial, for a state that is not a person (a tick, an icon). */
  readonly children?: ReactNode;
}

/**
 * The circle that stands for a person.
 *
 * There were five copies of `grid h-8 w-8 place-items-center rounded-full` with
 * four different sizes and three different tints, which is how a suite ends up
 * looking assembled rather than designed. This owns the **appearance**; what
 * goes inside and what wraps it stay the caller's, because the same circle is a
 * label in one place and a selection target in another.
 *
 * Decorative by default: the name it stands for is always written beside it, so
 * announcing the initial again would only add noise.
 */
export function Avatar({
  name,
  imageUrl,
  initials,
  size = 'md',
  tone = 'neutral',
  className,
  children,
}: AvatarProps) {
  return (
    <span
      aria-hidden
      // `leading-none` matters: with a line-height the glyph sits inside a box
      // taller than itself and centring the box leaves the letter visibly high
      // in the circle. Centring is what a circle with one letter in it is for.
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full text-center font-medium leading-none ${SIZE[size]} ${TONE[tone]} ${className ?? ''}`}
    >
      {/* The picture wins where there is one, and the letters stay underneath
          it rather than being replaced: an image that fails to load leaves the
          circle showing what it always showed. `children` still outranks both,
          because a tick is a state and not a person. */}
      {children ??
        (imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          (initials ?? initial(name))
        ))}
    </span>
  );
}

interface AvatarSelectorProps {
  readonly name: string | null | undefined;
  readonly imageUrl?: string | null;
  readonly initials?: string;
  readonly size?: AvatarSize;
  /** Whether this row is in the selection. */
  readonly selected: boolean;
  /**
   * A selection exists somewhere in the list.
   *
   * On a touch screen that turns every row's box on, because there is no hover
   * to reveal one with and the second pick would otherwise need a second
   * long-press. On a pointer device it changes nothing: Intercom keeps the
   * faces of the rows you have not picked and reveals the circle under the
   * pointer (recorded live 2026-08-20), and a list that flips every avatar to
   * an empty box the moment one row is picked loses the one thing the column
   * was for - who these tickets are from.
   */
  readonly selecting: boolean;
  readonly onChange: () => void;
  /** What is being selected: "Select HD-2026-0001". Never just "Select". */
  readonly label: string;
}

/**
 * The face a row wears, and the box it becomes when you go to select it.
 *
 * A permanent checkbox beside every row is the shape this replaces. It was
 * taken to make selection findable after two runs found it only by its
 * accessible name, and it cost the list a column of empty boxes in the case
 * that is almost all cases: nobody is selecting anything. The documented answer
 * is the swap, not the column - Material's selection pattern says "Avoid
 * persistently displaying checkboxes as part of each item" and puts the
 * selected state on "the item, or its associated avatar"
 * (https://m1.material.io/patterns/selection.html, read 2026-08-20), which is
 * what Gmail and Intercom both do with the sender's circle.
 *
 * Findability is answered by three things instead of the column, because a
 * control that exists only on hover is unreachable by keyboard, on touch and in
 * a screen reader (NN/g, hover-revealed controls):
 *
 *  - the input is always in the DOM with its name, so assistive technology and
 *    the e2e suite address it at rest; it is only invisible and click-through;
 *  - it appears on focus as well as on hover, so Tab reaches it;
 *  - the select-all in the chrome bar above is permanent, and on touch a
 *    long-press on the row opens selection mode (`ConversationList`).
 */
export function AvatarSelector({
  name,
  imageUrl,
  initials,
  size = 'sm',
  selected,
  selecting,
  onChange,
  label,
}: AvatarSelectorProps) {
  const state = selected ? 'selected' : selecting ? 'selecting' : 'rest';
  return (
    <label
      data-state={state}
      className={`group/selector relative flex shrink-0 cursor-pointer items-center justify-center ${SIZE[size]}`}
      onClick={(event) => event.stopPropagation()}
    >
      {/* The real control, invisible and still everything it was: it keeps its
          name, the keyboard and the checked state, and the two circles are
          drawn from it with `peer-*`.
          
          It is also the hit area, and it is larger than the picture: six pixels
          past the circle on every side makes a 40px target out of a 28px
          drawing without moving anything in the row. WCAG 2.5.8 asks for 24 CSS
          pixels and the checkbox this replaces was 16; Material asks for 48 and
          does exactly this - "an icon may appear to be 24 x 24 dp, but the
          padding surrounding it comprises the full 48 x 48 dp touch target".
          Not a `::after` on the label: a pseudo-element extends where a click
          lands but is not the control, so the box a test or a screen reader
          addresses would still have been the 16px one. */}
      <input
        type="checkbox"
        className="peer absolute -inset-1.5 z-10 cursor-pointer appearance-none opacity-0"
        checked={selected}
        onChange={onChange}
        aria-label={label}
      />
      <Avatar
        name={name}
        imageUrl={imageUrl ?? null}
        {...(initials ? { initials } : {})}
        size={size}
        className={`transition-opacity ${
          // `[@media(hover:hover)]` and not a bare `group-hover`: a touch
          // browser fires hover on tap and keeps it, so without the query the
          // face would vanish on the row you just tapped and stay gone.
          selected
            ? 'opacity-0'
            : `opacity-100 [@media(hover:hover)]:group-hover/selector:opacity-0 peer-focus-visible:opacity-0 ${
                selecting ? '[@media(hover:none)]:opacity-0' : ''
              }`
        }`}
      />
      {/* The selector, in the circle the face was in. Grey with a grey tick
          where it is only offered, filled where it is taken - which is the
          weight Intercom gives the same two states, and it is why the swap
          reads as one control changing rather than as a box appearing on top
          of a picture. */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 grid place-items-center rounded-full border transition-opacity peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-bg ${
          selected
            ? 'border-accent bg-accent text-accent-on opacity-100'
            : `border-subtle bg-surface-raised text-subtle opacity-0 [@media(hover:hover)]:group-hover/selector:opacity-100 peer-focus-visible:opacity-100 ${
                selecting ? '[@media(hover:none)]:opacity-100' : ''
              }`
        }`}
      >
        <Check className="h-4 w-4" aria-hidden />
      </span>
    </label>
  );
}

/** The width every selector column reserves, so headers line up with rows. */
export const SELECTOR_WIDTH = 'w-7';

interface SelectAllProps {
  readonly checked: boolean;
  /** True while a part of the list is selected: the box says so as a dash. */
  readonly someChecked?: boolean;
  readonly onChange: () => void;
  readonly label?: string;
}

/**
 * Select-all, at the top of the column of row selectors.
 *
 * That position is the convention wherever a list has checkboxes: the header
 * cell of the leftmost column, directly above the controls it stands for.
 * Anywhere else and it reads as an unrelated control that happens to be nearby.
 * It is the same `Checkbox` those rows carry, centred in `SELECTOR_WIDTH` so it
 * sits over them rather than a few pixels to their left, and it shows the third
 * state: a part-selected list says so with a dash instead of claiming nothing
 * is picked.
 */
export function SelectAll({
  checked,
  someChecked = false,
  onChange,
  label = 'Select all',
}: SelectAllProps) {
  return (
    <span className={`flex ${SELECTOR_WIDTH} shrink-0 items-center justify-center`}>
      <Checkbox checked={checked} someChecked={someChecked} onChange={onChange} label={label} />
    </span>
  );
}

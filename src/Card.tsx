import type { ReactNode } from 'react';

/**
 * The classes that make a surface a card: 14px radius, panel colour, a soft
 * shadow instead of a frame.
 *
 * Paper separates by elevation, not by outline. The border stays only where a
 * card meets another filled surface, because a shadow needs ground under it to
 * be visible at all - that is what `bordered` is for, and it is the exception.
 */
export const CARD = 'rounded-card bg-surface shadow-card';

interface CardProps {
  readonly children: ReactNode;
  /** Inner padding. `none` is for a card whose rows own their own padding. */
  readonly padding?: 'none' | 'sm' | 'md';
  /** Add the hairline, for a card sitting on a surface of the same colour. */
  readonly bordered?: boolean;
  readonly className?: string;
  /** Rises on hover. Only for a card that is itself a target. */
  readonly interactive?: boolean;
}

const PADDING = { none: '', sm: 'p-4', md: 'p-5 sm:p-6' } as const;

export function Card({
  children,
  padding = 'md',
  bordered = false,
  interactive = false,
  className,
}: CardProps) {
  return (
    <div
      className={`${CARD} ${PADDING[padding]} ${bordered ? 'border border-border' : ''} ${
        interactive ? 'transition-press hover:-translate-y-px hover:shadow-popover' : ''
      } ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

/**
 * A card's own heading. 15/600 with the description under it, which is the
 * step below a section title and above body text.
 */
export function CardTitle({
  children,
  description,
}: {
  readonly children: ReactNode;
  readonly description?: string;
}) {
  return (
    <div className="mb-3">
      <h2 className="text-[15px] font-semibold text-fg">{children}</h2>
      {description && <p className="mt-1 text-[13px] text-muted">{description}</p>}
    </div>
  );
}

/**
 * The small uppercase label over a group of fields or a list of tags. One
 * definition, because it appeared with three different letter-spacings.
 */
export function Overline({ children }: { readonly children: ReactNode }) {
  return (
    <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle">
      {children}
    </span>
  );
}

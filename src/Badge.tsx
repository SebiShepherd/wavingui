import type { ReactNode } from 'react';
import { opticalText } from './opticalText';

export type BadgeTone = 'accent' | 'success' | 'warning' | 'danger' | 'neutral';

/**
 * A badge is one token pair - a wash and the hue on it - rather than a hue plus
 * an opacity guess. The old `bg-warning/15` stacked differently on the page, on
 * a card and on a selected row, and in the light set it stopped being legible
 * anywhere.
 */
const TONE: Record<BadgeTone, string> = {
  accent: 'bg-accent-wash text-accent',
  success: 'bg-success-wash text-success',
  warning: 'bg-warning-wash text-warning',
  danger: 'bg-danger-wash text-danger',
  neutral: 'bg-surface-raised text-muted',
};

interface BadgeProps {
  readonly tone?: BadgeTone;
  readonly children: ReactNode;
  /** A glyph before the word, for a marker that must read without its colour. */
  readonly icon?: ReactNode;
  readonly className?: string;
  readonly title?: string;
}

/**
 * The pill that carries a status, a marker or a count.
 *
 * `h-6`, and the height is the point rather than a tidier way to write
 * `py-0.5`. The label goes through `opticalText`, whose `text-box: trim-both`
 * cuts the half-leading off the inline box - so a pill sized by its
 * line-height has no line-height left to be sized by, and collapses onto the
 * cap height of an 11px word. Every other control that centres its label this
 * way already states a height (`Button` is `h-8`/`h-[38px]`, `Kbd` is `h-5`);
 * this one was the exception, and it only showed once browsers shipped the
 * property and the `@supports` guard around it started matching.
 */
export function Badge({ tone = 'neutral', children, icon, className, title }: BadgeProps) {
  return (
    <span
      title={title}
      className={`inline-flex h-6 shrink-0 items-center gap-1 rounded-pill px-2.5 text-[11px] font-semibold ${TONE[tone]} ${className ?? ''}`}
    >
      {icon}
      {opticalText(children)}
    </span>
  );
}

/** The tone for a badge, for a caller that renders the pill itself. */
export function badgeClass(tone: BadgeTone): string {
  return TONE[tone];
}

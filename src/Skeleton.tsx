/**
 * Placeholders in the shape of what is coming.
 *
 * The rule they exist for: a wait long enough to notice is answered with the
 * layout of the answer, not with the word `Loading…`. Somebody who can see that
 * a list of people is arriving has already started reading the screen; somebody
 * looking at a centred sentence is waiting for it to be replaced.
 *
 * They are also deliberately late. Below roughly 300ms a placeholder is a flash
 * of furniture that the real content immediately replaces, which reads worse
 * than a blank moment - see `useDelayedFlag`.
 */
import { useEffect, useState } from 'react';
import { useLabels } from './labels';

/**
 * True only once a condition has held for `delayMs`.
 *
 * The whole point of a skeleton is to cover a wait people can feel. A fast
 * answer covered by one flashes twice: placeholder in, placeholder out.
 */
export function useDelayedFlag(active: boolean, delayMs = 300): boolean {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!active) {
      setShown(false);
      return;
    }
    const timer = setTimeout(() => setShown(true), delayMs);
    return () => clearTimeout(timer);
  }, [active, delayMs]);
  return shown;
}

/** One sweeping block. `width` is a Tailwind class so callers stay declarative. */
export function SkeletonBar({
  width = 'w-full',
  height = 'h-2.5',
  delay = 0,
  className,
}: {
  readonly width?: string;
  readonly height?: string;
  /** Staggers the sweep between bars of one row, so it reads as one object. */
  readonly delay?: number;
  readonly className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`skeleton block ${width} ${height} ${className ?? ''}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    />
  );
}

/** The circle a row spends on a person, while the person is still arriving. */
export function SkeletonAvatar({ size = 'h-8 w-8' }: { readonly size?: string }) {
  return <span aria-hidden className={`skeleton shrink-0 rounded-full ${size}`} />;
}

/**
 * The list shape: a circle and two lines, repeated. Used by the conversation
 * queue and by anything else that is a list of people.
 */
export function SkeletonRows({
  rows = 5,
  className,
}: {
  readonly rows?: number;
  readonly className?: string;
}) {
  const loading = useLabels().loading;
  return (
    <div role="status" aria-label={loading} className={className}>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-3 px-3 py-3.5">
          <SkeletonAvatar />
          <span className="flex min-w-0 flex-1 flex-col gap-2">
            <SkeletonBar width="w-1/2" />
            <SkeletonBar width="w-5/6" delay={200} />
          </span>
        </div>
      ))}
    </div>
  );
}

/** The table shape: the same column grid the real rows use. */
export function SkeletonTableRows({
  rows = 5,
  columns = 'grid-cols-[28px_1fr_1fr_140px]',
}: {
  readonly rows?: number;
  readonly columns?: string;
}) {
  const loading = useLabels().loading;
  return (
    <div role="status" aria-label={loading}>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className={`grid h-[60px] items-center gap-4 px-5 ${columns}`}>
          <SkeletonAvatar size="h-7 w-7" />
          <SkeletonBar width="w-3/5" />
          <SkeletonBar width="w-4/5" delay={150} />
          <SkeletonBar width="w-1/2" delay={300} />
        </div>
      ))}
    </div>
  );
}

/** The card shape: a label line and a number under it. */
export function SkeletonCards({ cards = 3 }: { readonly cards?: number }) {
  const loading = useLabels().loading;
  return (
    <>
      {Array.from({ length: cards }, (_, index) => (
        <div
          key={index}
          role="status"
          aria-label={loading}
          className="h-[108px] rounded-card border border-border bg-surface p-5"
        >
          <SkeletonBar width="w-2/5" />
          <SkeletonBar width="w-3/5" height="h-5" delay={200} className="mt-4" />
        </div>
      ))}
    </>
  );
}

/** A block of prose, for a detail pane whose fields are still arriving. */
export function SkeletonLines({ lines = 3 }: { readonly lines?: number }) {
  const loading = useLabels().loading;
  return (
    <div role="status" aria-label={loading} className="flex flex-col gap-2.5">
      {Array.from({ length: lines }, (_, index) => (
        <SkeletonBar
          key={index}
          width={index === lines - 1 ? 'w-2/3' : 'w-full'}
          delay={index * 150}
        />
      ))}
    </div>
  );
}

import type { ReactNode } from 'react';

/** How wide the column of content is allowed to get. */
export type PageWidth = 'default' | 'narrow';

/**
 * The padded, scrolling body most routes want.
 *
 * The shell used to supply this padding for every route, which made a
 * full-height surface like the support inbox impossible without fighting it.
 * Now the shell hands over a bare box and a route says which of the two it is:
 * a document that scrolls (this) or a workspace that fills the frame and
 * scrolls its own columns (the inbox).
 *
 * 1080px, not the full window: a table of four columns stretched across a
 * 2560px screen puts the name and the date at opposite ends of the desk. A
 * record with one column of fields gets `narrow`, because a line of prose is
 * unreadable long before 1080.
 */
export function Page({
  children,
  width = 'default',
}: {
  readonly children: ReactNode;
  readonly width?: PageWidth;
}) {
  return (
    <div className="h-full overflow-auto p-4 sm:p-8 [scrollbar-gutter:stable]">
      <div className={`mx-auto ${width === 'narrow' ? 'max-w-[720px]' : 'max-w-[1080px]'}`}>
        {children}
      </div>
    </div>
  );
}

/**
 * The heading of a document page: title, one sentence, and whatever acts on the
 * whole page on the right. On a phone the actions go under the title, because
 * beside it they leave the title two words wide.
 */
export function PageHeader({
  title,
  description,
  actions,
}: {
  readonly title: string;
  readonly description?: string;
  readonly actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-[26px] font-semibold leading-tight text-fg">{title}</h1>
        {description && <p className="mt-1.5 text-[14.5px] text-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}

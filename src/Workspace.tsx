import { useEffect, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { useMediaQuery } from './useMediaQuery';
import { useLabels } from './labels';

/**
 * The workspace: a queue or list beside the thing you picked out of it.
 *
 * This is UI level 3 (`docs/specs/ui-templates.md`). It owns the geometry - how
 * the width is divided, which pane yields first, where a contextual bar sits,
 * what happens on a phone - and a module passes only content. Before it, every
 * screen decided those things for itself, which is why a record page started
 * 300px further right than the list it was reached from and why the inbox had
 * sixty lines of surface file about its own width.
 *
 * Three panes, one row:
 *
 *   nav (240px, from `lg`) | main (grows) | sidebar (opens on a pick)
 *
 * The sidebar carries **tabs**, so a picked record shows its conversation and
 * its attributes in one place instead of taking a second column for each. That
 * is what gives the list its width back (#163) and it is what the reference
 * products do.
 */
export interface WorkspaceTab {
  readonly id: string;
  readonly label: string;
  readonly content: ReactNode;
}

interface WorkspaceProps {
  /** Queues, folders, saved views. Hidden below `lg`, where the main pane is all there is room for. */
  readonly nav?: ReactNode;
  /** The list or table. Grows, unless `columns` gives it a width of its own. */
  readonly main: ReactNode;
  /**
   * The list is narrow by nature, so the pick may open **beside** it instead of
   * behind tabs, when the window is wide enough for both.
   *
   * Tabs exist because a table takes the whole width and the pick has to come
   * from somewhere. A chat list does not: it is three lines a row and it is
   * done at 22rem, which is why Intercom, Front and Zendesk all show the list,
   * the conversation and its attributes at once. Applying the tab strip to that
   * layout too solved a problem it does not have and hid the attributes behind
   * a click for no width gained (#208).
   *
   * The list then keeps its width whether or not something is picked, so
   * nothing moves under the pointer that picked it.
   */
  readonly columns?: boolean;
  /** The pick, as tabs. `null` closes the sidebar. */
  readonly tabs?: readonly WorkspaceTab[] | null;
  /** Named for the record, so the sidebar says what it is showing. */
  readonly sidebarTitle?: string;
  /**
   * Which record is open. The sidebar goes back to its first tab when this
   * changes and only then: keying it on the title instead meant that a title
   * arriving late (the list loads after a deep link) counted as a new record
   * and threw away the tab the person had just clicked.
   */
  readonly sidebarKey?: string | null;
  readonly onCloseSidebar?: () => void;
  /** What fills the sidebar's place on a wide screen while nothing is picked. */
  readonly resting?: ReactNode;
  /**
   * Bulk bars and the like: they overlay the **list pane** rather than joining
   * it, and rather than spanning every pane beside it.
   */
  readonly overlay?: ReactNode;
}

/**
 * When the secondary navigation is on screen, in the three forms the app needs
 * it: the rail's own classes, the mirror for whatever stands in for the rail
 * while it is away, and the query for code that has to decide rather than lay
 * out.
 *
 * One place, because these must agree. They did not: the rail yields to a
 * sidebar until `xl`, the inbox's queue picker stood in from `lg`, and between
 * 1024 and 1280 with a ticket open there was neither - no way to see or change
 * the queue across that whole range. Written as whole class strings because
 * Tailwind reads the source for literals and a composed one is a class that
 * never ships.
 */
export const RAIL = {
  /** No sidebar beside it: the rail has the width from `lg`. */
  alone: 'hidden lg:flex',
  /** A sidebar is open beside it, so the rail waits for `xl`. */
  beside: 'hidden xl:flex',
} as const;

/** The mirror of `RAIL`: shown exactly while the rail is not. */
export const RAIL_STANDIN = {
  alone: 'lg:hidden',
  beside: 'xl:hidden',
} as const;

/** The same fact for logic rather than layout. */
export const railOnScreen = (beside: boolean) =>
  beside ? '(min-width: 1280px)' : '(min-width: 1024px)';

export function Workspace({
  nav,
  main,
  columns: columnsWanted,
  tabs,
  sidebarTitle,
  sidebarKey,
  onCloseSidebar,
  resting,
  overlay,
}: WorkspaceProps) {
  const L = useLabels();
  const open = Boolean(tabs && tabs.length > 0);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const current = tabs?.find((tab) => tab.id === activeTab) ?? tabs?.[0] ?? null;

  // 1440 is where four columns stop being cramped: 56 for the rail, 240 for the
  // nav, 352 for the list and 320 for the attributes leaves the conversation
  // 500, which is more than the tabbed sidebar gave it. Below that the tabs are
  // the better answer and stay.
  //
  // Unknown counts as "no room": this defaults to the arrangement that fits
  // everywhere, and only opens up when the browser says it can.
  const roomForColumns = useMediaQuery('(min-width: 1440px)', false);
  const columns = Boolean(columnsWanted && roomForColumns);
  const [first, ...rest] = tabs ?? [];
  const split = columns && open && rest.length > 0;

  // A new pick shows the first tab. Staying on "Details" because that is where
  // the last record was left means opening a conversation and being shown its
  // attributes instead of the conversation.
  //
  // Keyed by what the tabs *are*, not by the array they arrived in: a consumer
  // builds that array inline, so every render of the page produced a new
  // identity and this effect put the tab back to the first one the moment
  // anything re-rendered. The click landed and was undone before paint.
  useEffect(() => {
    setActiveTab(null);
  }, [sidebarKey]);

  return (
    <div className="relative flex h-full min-w-0">
      {/* Who yields first, stated once for every workspace: the secondary nav.
          Below `xl` the sidebar and the list together need everything, and at
          1024 keeping the nav left the table 264px for 320px of columns. The
          nav comes back the moment the sidebar closes, and what it holds is
          reachable from the list's own filters meanwhile. */}
      {nav && <div className={`w-60 shrink-0 ${RAIL[open ? 'beside' : 'alone']}`}>{nav}</div>}

      {/* The main pane keeps its width when the sidebar opens: the sidebar has
          a width of its own and takes it from what is left, never from the
          list. On a phone there is room for one pane, so the pick replaces the
          list rather than squeezing it.

          In columns, the list is the pane with the fixed width and everything
          to its right grows, which is how the reference inboxes divide it and
          why nothing shifts when a row is picked: the list was already 22rem
          before the pick and is 22rem after it. */}
      <div
        className={`relative flex h-full min-w-0 ${
          columns ? 'w-[22rem] shrink-0 2xl:w-[24rem]' : 'flex-1'
        } ${open && !split ? 'max-lg:hidden' : ''}`}
      >
        {main}
        {/* Inside the list pane, not across the row of panes. A bar that acts
            on selected rows belongs over the rows: centred on the workspace it
            reached halfway across an open conversation, and its anchor then
            differed from the same bar on a page whose list is the page (#337).
            The rule is one line long now: the bar centres on the pane that
            holds the list. */}
        {overlay}
      </div>

      {split ? (
        <>
          <section
            aria-label={sidebarTitle ?? L.details}
            className="flex h-full min-w-0 flex-1 flex-col border-l border-border bg-bg"
          >
            {first?.content}
          </section>
          {/* The attributes, beside the conversation rather than behind it.
              One rail whatever the tab count: a second and third tab stack
              here, which is where Intercom puts its own extra one. */}
          <div className="flex h-full w-[20rem] shrink-0 flex-col border-l border-border bg-bg 2xl:w-[22rem]">
            <div className="flex h-11 shrink-0 items-center gap-1 border-b border-border px-3">
              {rest.length === 1 ? (
                <h2 className="text-sm font-medium text-fg">{rest[0].label}</h2>
              ) : (
                rest.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={(current?.id ?? rest[0].id) === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-[10px] px-2.5 py-1.5 text-sm transition-press ${
                      (current?.id ?? rest[0].id) === tab.id
                        ? 'bg-surface-raised font-medium text-fg'
                        : 'text-muted hover:text-fg'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))
              )}
              {onCloseSidebar && <CloseButton onClick={onCloseSidebar} />}
            </div>
            <div className="flex min-h-0 flex-1 flex-col">
              {(rest.find((tab) => tab.id === activeTab) ?? rest[0]).content}
            </div>
          </div>
        </>
      ) : open ? (
        <section
          aria-label={sidebarTitle ?? L.details}
          className="flex h-full w-full min-w-0 shrink-0 flex-col border-l border-border bg-bg lg:w-[26rem] xl:w-[34rem] 2xl:w-[40rem]"
        >
          <div className="flex h-11 shrink-0 items-center gap-1 border-b border-border px-2">
            {tabs?.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={current?.id === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-[10px] px-2.5 py-1.5 text-sm transition-press ${
                  current?.id === tab.id
                    ? 'bg-surface-raised font-medium text-fg'
                    : 'text-muted hover:text-fg'
                }`}
              >
                {tab.label}
              </button>
            ))}
            {onCloseSidebar && <CloseButton onClick={onCloseSidebar} />}
          </div>
          <div className="flex min-h-0 flex-1 flex-col">{current?.content}</div>
        </section>
      ) : (
        resting && (
          // The same width the sidebar takes, so picking a record does not
          // shift the list sideways under the pointer that picked it. In
          // columns the list already has its width, so this simply fills what
          // is left rather than matching anything.
          <div
            className={`hidden flex-col items-center justify-center gap-3 border-l border-border bg-bg lg:flex ${
              columns ? 'min-w-0 flex-1' : 'w-[26rem] shrink-0 xl:w-[34rem] 2xl:w-[40rem]'
            }`}
          >
            {resting}
          </div>
        )
      )}
    </div>
  );
}

function CloseButton({ onClick }: { readonly onClick: () => void }) {
  const L = useLabels();
  return (
    <Tooltip label={L.close}>
      <button
        type="button"
        aria-label={L.close}
        onClick={onClick}
        className="ml-auto grid h-8 w-8 place-items-center rounded-[10px] text-muted transition-press hover:bg-surface-raised hover:text-fg"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </Tooltip>
  );
}

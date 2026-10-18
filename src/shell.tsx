import type { ReactNode } from 'react';
import { Moon, Sun } from 'lucide-react';
import { IconButton } from './Button';
import { useLabels } from './labels';
import { useLink } from './link';
import { resolveTheme, type ThemeChoice } from './theme';
import { Tooltip } from './Tooltip';

/**
 * The application frame: a rail on the left, one global bar above the content,
 * and the content itself.
 *
 * The content area is not padded and does not scroll. A screen decides whether
 * it is a document (`Page` supplies padding and scrolling) or a workspace that
 * fills the frame and scrolls its own columns.
 *
 * `h-dvh`, not `h-screen`: on a phone `100vh` ignores the browser's own chrome,
 * so the last strip of the app sits below the fold with no way to reach it.
 */
export function AppFrame({
  rail,
  bar,
  children,
}: {
  readonly rail?: ReactNode;
  readonly bar?: ReactNode;
  readonly children: ReactNode;
}) {
  return (
    <div className="flex h-dvh overflow-hidden bg-bg text-fg">
      {rail}
      <div className="flex min-w-0 flex-1 flex-col">
        {bar}
        <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}

/** The global bar's frame: one height, one surface. Its contents are the product's. */
export function TopBar({ children }: { readonly children: ReactNode }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
      {children}
    </header>
  );
}

export interface RailItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly icon: ReactNode;
  readonly active?: boolean;
  /** Shown, named and not reachable: a destination that is planned. */
  readonly soon?: boolean;
}

const RAIL_TARGET = 'grid h-10 w-10 place-items-center rounded-[10px]';

/**
 * Icons-only navigation, 56px wide.
 *
 * The width belongs to a screen's own navigation, not to repeating words the
 * icons already carry (Zendesk's outer sidebar works the same way). The label
 * is never visible, so every target carries a tooltip and an accessible name;
 * the tooltip is the kit's own because the native `title` waits a second, never
 * fires on keyboard focus and does not exist in a screenshot. Active is a filled
 * pill with `aria-current`, so it is more than colour.
 *
 * The product says which item is active: the kit has no router.
 */
export function Rail({
  brand,
  items,
  footer,
}: {
  readonly brand?: ReactNode;
  readonly items: readonly RailItem[];
  /** Settings, the account, anything pinned to the bottom. */
  readonly footer?: ReactNode;
}) {
  const L = useLabels();
  const Link = useLink();
  return (
    <aside className="flex h-full w-14 shrink-0 flex-col items-center border-r border-border bg-surface py-2">
      {brand ? <div className="mb-3">{brand}</div> : null}
      <nav aria-label={L.navigation} className="flex flex-1 flex-col items-center gap-1">
        {items.map((item) =>
          item.soon ? (
            <Tooltip key={item.id} label={L.comingSoon(item.label)} side="right">
              <span
                aria-label={L.comingSoon(item.label)}
                aria-disabled
                className={`${RAIL_TARGET} cursor-not-allowed text-faint`}
              >
                {item.icon}
              </span>
            </Tooltip>
          ) : (
            <Tooltip key={item.id} label={item.label} side="right">
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={item.active ? 'page' : undefined}
                className={`${RAIL_TARGET} transition-press ${
                  item.active
                    ? 'bg-accent-wash text-accent'
                    : 'text-muted hover:bg-surface-raised hover:text-fg'
                }`}
              >
                {item.icon}
              </Link>
            </Tooltip>
          ),
        )}
      </nav>
      {footer ? <div className="mt-1 flex w-full flex-col items-center gap-1 px-1">{footer}</div> : null}
    </aside>
  );
}

/**
 * Light or dark, as one button that names the set it will move to. `system`
 * resolves first, so following a dark operating system and pressing the sun
 * means light. Where the choice is stored is the product's business.
 */
export function ThemeToggle({
  choice,
  onChange,
  className,
}: {
  readonly choice: ThemeChoice;
  readonly onChange: (choice: ThemeChoice) => void;
  readonly className?: string;
}) {
  const L = useLabels();
  const dark = resolveTheme(choice) === 'dark';
  return (
    <IconButton
      label={L.switchTheme(dark ? 'light' : 'dark')}
      onClick={() => onChange(dark ? 'light' : 'dark')}
      className={className}
    >
      {dark ? (
        <Sun className="h-[18px] w-[18px]" aria-hidden />
      ) : (
        <Moon className="h-[18px] w-[18px]" aria-hidden />
      )}
    </IconButton>
  );
}

import { useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  Archive,
  Bell,
  Check,
  Gauge,
  Home,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Tag,
  Trash2,
} from 'lucide-react';
import wavingeye from '@wavingeye/brand/wavingeye/paths.json';
import {
  ActionBar,
  Avatar,
  AvatarSelector,
  Badge,
  BrandMark,
  Button,
  Card,
  CardTitle,
  Checkbox,
  ConfirmDialog,
  Dialog,
  FIELD_INPUT,
  FIELD_INVALID,
  FILTER_PILL,
  filterPill,
  FloatingBar,
  FloatingBarDivider,
  HexColorPicker,
  IconButton,
  Kbd,
  Overline,
  PageHeader,
  Person,
  Rail,
  SEARCH_INPUT,
  SEARCH_PILL,
  SkeletonCards,
  SkeletonLines,
  SkeletonRows,
  SkeletonTableRows,
  SplitButton,
  ThemeToggle,
  Toast,
  Tooltip,
  TopBar,
  useThemeSync,
  useToast,
  Workspace,
  type ThemeChoice,
} from '../src';

/**
 * The component gallery: every shared component in every state it can be in,
 * on one page, with no server and no network behind it.
 *
 * It is the kit's product surface. Screenshotting product screens only ever
 * captures one state of each component at one width, so the gallery is what the
 * visual baselines, the state checks and the reviewing agent look at. A
 * component that is not here is not reviewed.
 */
function GalleryPane({ label }: { readonly label: string }) {
  return (
    <div className="grid h-full w-full place-items-center bg-surface text-xs uppercase tracking-wide text-subtle">
      {label}
    </div>
  );
}

/** A face, inline, so the picture state renders with no upload behind it. */
const SAMPLE_FACE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#2b5ce6"/><circle cx="32" cy="26" r="12" fill="#fbfaf8"/><path d="M8 64c0-13 11-20 24-20s24 7 24 20z" fill="#fbfaf8"/></svg>',
  );

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open', current: true },
  { value: 'pending', label: 'Pending' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

function readTheme(): ThemeChoice {
  try {
    const stored = localStorage.getItem('wavingui.gallery.theme');
    return stored === 'dark' || stored === 'light' ? stored : 'system';
  } catch {
    return 'system';
  }
}

export function Gallery() {
  const [theme, setTheme] = useState<ThemeChoice>(readTheme);
  const [brandColor, setBrandColor] = useState('#2563eb');
  const [unsetColor, setUnsetColor] = useState('');
  const [checked, setChecked] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const toast = useToast();
  const noop = () => undefined;
  useThemeSync(theme);

  function changeTheme(next: ThemeChoice) {
    setTheme(next);
    try {
      localStorage.setItem('wavingui.gallery.theme', next);
    } catch {
      // Storage is a convenience here; the toggle still works without it.
    }
  }

  return (
    <div className="mx-auto max-w-[1080px] space-y-8 px-6 py-8 pb-24">
      <header className="flex items-start gap-4">
        <div className="flex-1">
          <h1 className="text-[26px] font-semibold leading-tight text-fg">wavingui gallery</h1>
          <p className="mt-1.5 text-[14.5px] text-muted">
            Every shared component in every state, in whichever theme is on.
          </p>
        </div>
        <ThemeToggle choice={theme} onChange={changeTheme} />
      </header>

      <Section title="Shell" note="Rail, global bar and theme toggle. The product says which rail item is active.">
        <div className="flex h-56 overflow-hidden rounded-field border border-border">
          <Rail
            brand={<BrandMark mark={wavingeye.mark} label="WavingEye" />}
            items={[
              { id: 'home', label: 'Home', href: '#home', icon: <Home className="h-5 w-5" aria-hidden />, active: true },
              { id: 'limits', label: 'Limits', href: '#limits', icon: <Gauge className="h-5 w-5" aria-hidden /> },
              { id: 'locks', label: 'Locks', href: '#locks', icon: <ShieldCheck className="h-5 w-5" aria-hidden />, soon: true },
            ]}
            footer={
              <Tooltip label="Settings" side="right">
                <a href="#settings" aria-label="Settings" className="grid h-10 w-10 place-items-center rounded-[10px] text-muted transition-press hover:bg-surface-raised hover:text-fg">
                  <Settings className="h-5 w-5" aria-hidden />
                </a>
              </Tooltip>
            }
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar>
              <span className="text-sm text-muted">Global bar</span>
              <ThemeToggle choice={theme} onChange={changeTheme} className="ml-auto" />
            </TopBar>
            <GalleryPane label="content" />
          </div>
        </div>
      </Section>

      <Section title="Brand mark" note="The product hands the kit its mark from @wavingeye/brand; the tile inverts in dark.">
        <div className="flex items-center gap-4">
          <BrandMark mark={wavingeye.mark} size="sm" />
          <BrandMark mark={wavingeye.mark} size="md" />
          <BrandMark mark={wavingeye.mark} size="lg" label="WavingEye" />
        </div>
      </Section>

      <Section title="Page header" note="Title, one line of description, actions on the right.">
        <PageHeader
          title="Limits"
          description="What each app and site may take from your day."
          actions={<Button variant="primary">New limit</Button>}
        />
      </Section>

      <Section title="Badges" note="Every tone, with and without an icon.">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="neutral">Neutral</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="success" icon={<Check className="h-3 w-3" aria-hidden />}>Success</Badge>
          <Badge tone="warning" icon={<AlertTriangle className="h-3 w-3" aria-hidden />}>Warning</Badge>
          <Badge tone="danger">Danger</Badge>
        </div>
      </Section>

      <Section title="Checkbox" note="Unchecked, checked, partly checked.">
        <div className="flex items-center gap-6">
          <Checkbox checked={false} onChange={noop} label="Unchecked" />
          <Checkbox checked={checked} onChange={() => setChecked((v) => !v)} label="Checked" />
          <Checkbox checked={false} someChecked onChange={noop} label="Partly checked" />
        </div>
      </Section>

      <Section title="Icon buttons" note="Round, one glyph, named by a tooltip and an accessible name.">
        <div className="flex items-center gap-3">
          <IconButton label="Notifications">
            <Bell className="h-[18px] w-[18px]" aria-hidden />
          </IconButton>
          <IconButton label="Search" active>
            <Search className="h-[18px] w-[18px]" aria-hidden />
          </IconButton>
          <IconButton label="Add" disabled>
            <Plus className="h-[18px] w-[18px]" aria-hidden />
          </IconButton>
        </div>
      </Section>

      <Section title="Confirm dialog" note="Only for what cannot be undone; everything else gets an undo toast.">
        <Button variant="danger" onClick={() => setConfirming(true)}>
          Delete limit
        </Button>
        <ConfirmDialog
          open={confirming}
          title="Delete this limit?"
          body="Its history goes with it. This cannot be undone."
          confirmLabel="Delete limit"
          destructive
          onConfirm={() => setConfirming(false)}
          onCancel={() => setConfirming(false)}
        />
      </Section>

      <Section
        title="Dialog"
        note="A task in a modal: title, body and the buttons that end it. Opens and closes with a motion; Escape and the backdrop close it."
      >
        <Button variant="secondary" onClick={() => setDialogOpen(true)}>
          Lock for a while
        </Button>
        <Dialog
          open={dialogOpen}
          title="Lock with a timer"
          onClose={() => setDialogOpen(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setDialogOpen(false)}>
                Lock for 1 hour
              </Button>
            </>
          }
        >
          <p className="mt-2.5 text-sm leading-relaxed text-muted">
            Until the timer runs out, the block can be tightened and not loosened.
          </p>
        </Dialog>
      </Section>

      <Section
        title="Brand colour"
        note="Free colour, not a palette entry: presets, a mixing surface and a hex field, all writing the same value."
      >
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">Set:</span>
            <HexColorPicker
              label="Gallery brand colour"
              value={brandColor}
              onChange={setBrandColor}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">Unset, clearable:</span>
            <HexColorPicker
              label="Gallery optional colour"
              value={unsetColor}
              clearable
              onChange={setUnsetColor}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">Disabled:</span>
            <HexColorPicker
              label="Disabled brand colour"
              value="#16a34a"
              onChange={noop}
              disabled
            />
          </div>
        </div>

        {/* Open, so the presets, the mixing surface, the hue rail and the
            footer are reviewable without interaction. Each gets its own row
            with the popover's height reserved, or one would cover the next. */}
        <div className="space-y-2">
          <p className="text-sm text-muted">Open, a preset selected:</p>
          <div className="h-[470px]">
            <HexColorPicker
              label="Gallery open colour"
              value={brandColor}
              defaultOpen
              onChange={setBrandColor}
            />
          </div>
          <p className="text-sm text-muted">Open, nothing set, clearable:</p>
          <div className="h-[470px]">
            <HexColorPicker
              label="Gallery open optional colour"
              value={unsetColor}
              clearable
              defaultOpen
              onChange={setUnsetColor}
            />
          </div>
        </div>
      </Section>
      <Section
        title="Tooltip"
        note="The name of a control that shows only a glyph. Hover for 400ms or Tab to it; the native title did neither in under a second and never in a screenshot."
      >
        <div className="flex flex-wrap items-center gap-6">
          {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
            <Tooltip key={side} label={`Opens ${side}`} side={side}>
              <button
                type="button"
                aria-label={`Opens ${side}`}
                className="grid h-9 w-9 place-items-center rounded-pill border border-border text-muted"
              >
                <Bell className="h-4 w-4" aria-hidden />
              </button>
            </Tooltip>
          ))}
          <span className="text-xs text-subtle">
            The bubble is `aria-hidden`: the trigger carries the name itself, and a description that
            repeats it makes the control announce twice.
          </span>
        </div>
      </Section>
      <Section
        title="Split button"
        note="One verb, plus the other values that verb could have set. The wide half can be spent while the caret stays live."
      >
        <div className="flex flex-wrap items-center gap-6">
          <SplitButton
            label="Resolve"
            icon={<Check className="h-4 w-4" aria-hidden />}
            onClick={noop}
            menuLabel="Other statuses"
            groupLabel="Status"
            options={STATUS_OPTIONS}
            onSelect={noop}
          />
          <SplitButton
            label="Resolved"
            icon={<Check className="h-4 w-4" aria-hidden />}
            disabled
            onClick={noop}
            menuLabel="Other statuses"
            groupLabel="Status"
            options={STATUS_OPTIONS}
            onSelect={noop}
          />
          <span className="text-xs text-subtle">
            A resolved ticket cannot be resolved again; putting it back to open is exactly what is
            wanted then, so the caret is never disabled with the verb.
          </span>
        </div>
      </Section>
      <Section
        title="Floating bar"
        note="One appearance, every user of it side by side, in each state it actually has. What is shared is surface, radius, border and shadow; what each caller composes is its own contents, because a divider with one empty side is a shape carried over without its purpose."
      >
        <div className="relative flex h-40 flex-col rounded-field border border-border bg-bg p-2">
          <p className="text-xs text-subtle">A selection (floats clear of the edge)</p>
          <ActionBar
            count={3}
            total={12}
            onClear={noop}
            actions={[
              { key: 'tag', label: 'Tag', icon: <Tag className="h-4 w-4" aria-hidden />, onSelect: noop },
              { key: 'archive', label: 'Archive', icon: <Archive className="h-4 w-4" aria-hidden />, onSelect: noop },
              { key: 'trash', label: 'Delete', icon: <Trash2 className="h-4 w-4" aria-hidden />, onSelect: noop, tone: 'warning' },
            ]}
          />
        </div>
        <div className="relative flex h-40 flex-col rounded-field border border-border bg-bg p-2">
          <p className="text-xs text-subtle">Role editor, unsaved changes (docked on the edge)</p>
          <FloatingBar role="group" inset={false} label="Save Admin">
            <Button size="sm" variant="primary">
              Save Admin
            </Button>
            <span className="px-2 text-sm text-muted">Discard</span>
            <FloatingBarDivider />
            <span className="whitespace-nowrap px-2 text-xs text-subtle">2 added, 1 removed</span>
          </FloatingBar>
        </div>
        <div className="relative flex h-40 flex-col rounded-field border border-border bg-bg p-2">
          <p className="text-xs text-subtle">
            Role editor, just saved (the confirmation and nothing else)
          </p>
          <FloatingBar role="group" inset={false} label="Save Admin">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap px-2 py-0.5 text-sm text-success">
              <Check className="h-4 w-4" aria-hidden />
              Saved
            </span>
          </FloatingBar>
        </div>
        <p className="text-xs text-subtle">
          With nothing changed and nothing just saved, the role editor renders no bar at all: it
          would cover the last rows of the list to offer a button that cannot be pressed.
        </p>
      </Section>
      <Section
        title="Avatar"
        note="Three sizes and four tints, each tint meaning something: nobody in particular, us, an internal message, somebody who cannot sign in. There were five hand-written copies of this circle before, in four sizes."
      >
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name="Ada Lovelace" size="sm" />
          <Avatar name="Ada Lovelace" size="md" />
          <Avatar name="Ada Lovelace" size="lg" />
          <Avatar name="Bo Brand" tone="accent" />
          <Avatar name="Internal note" tone="warning" />
          <Avatar name="Casey Gone" tone="quiet" />
          <Avatar name={null} />
          <Avatar name="Selected" tone="accent" className="bg-accent text-accent-on">
            <Check className="h-4 w-4" aria-hidden />
          </Avatar>
        </div>
      </Section>
      <Section
        title="Avatar as selector"
        note="What a list row wears instead of a checkbox column: the face. It swaps to a box on hover and on focus, a picked row keeps its box, and the rows that are not picked keep their faces - which is what Intercom does. On a touch screen a long-press opens selection mode and every row then shows its box. The box is in the DOM under its own name even while invisible, so it is reachable by keyboard and by a screen reader; hover one to see the swap."
      >
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col items-center gap-1.5">
            <AvatarSelector
              name="Ada Lovelace"
              selected={false}
              selecting={false}
              onChange={noop}
              label="Select HD-2026-0001"
            />
            <span className="text-xs text-subtle">at rest</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <AvatarSelector
              name="Ada Lovelace"
              selected={false}
              selecting
              onChange={noop}
              label="Select HD-2026-0002"
            />
            <span className="text-xs text-subtle">selection open, on touch</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <AvatarSelector
              name="Ada Lovelace"
              selected
              selecting
              onChange={noop}
              label="Select HD-2026-0003"
            />
            <span className="text-xs text-subtle">picked</span>
          </div>
        </div>
      </Section>
      <Section
        title="Toast"
        note="What replaced the browser confirmation on everything that can be taken back. One at a time, six seconds, and the way back is in the toast rather than in a dialog beforehand. Where the action is final there is no way back to offer, so the toast carries the one thing worth doing next instead."
      >
        <div className="flex flex-wrap items-start gap-4">
          <Toast message="3 tickets moved to trash" undo={noop} onDismiss={noop} />
          <Toast message="Export started" onDismiss={noop} />
          <Toast
            message="Merged into HD-2026-0297"
            action={{ label: 'Open it', run: noop }}
            onDismiss={noop}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() =>
              toast.show({ message: '3 tickets moved to trash', undo: () => undefined })
            }
            className={FILTER_PILL}
          >
            Show one with Undo
          </button>
          <button
            type="button"
            onClick={() => toast.show({ message: 'Export started' })}
            className={FILTER_PILL}
          >
            Show one without
          </button>
        </div>
      </Section>
      <Section
        title="Workspace"
        note="UI level 3: the shape a queue-and-its-pick screen has. The template owns the geometry, a module passes the content, and both states are here because a picked record and a resting one are two different screens."
      >
        <div className="h-72 overflow-hidden rounded-field border border-border">
          <Workspace
            nav={<GalleryPane label="Queues" />}
            main={<GalleryPane label="List or table" />}
            resting={<p className="text-sm text-muted">Pick something to read it.</p>}
          />
        </div>
        <div className="h-72 overflow-hidden rounded-field border border-border">
          <Workspace
            nav={<GalleryPane label="Queues" />}
            main={<GalleryPane label="List or table" />}
            sidebarKey="one"
            sidebarTitle="A picked record"
            onCloseSidebar={noop}
            tabs={[
              { id: 'thread', label: 'Thread', content: <GalleryPane label="The conversation" /> },
              { id: 'details', label: 'Details', content: <GalleryPane label="Its attributes" /> },
            ]}
          />
        </div>
      </Section>
      <Section
        title="A person"
        note="One rule for who somebody is: name, else address, else a nothing the caller names. Two letters from two words, one from one, never a letter from an email domain. Both lines truncate. Somebody who cannot sign in is rendered, not hidden. There were six versions of this, which is what one requester rendered three ways on one screen is made of."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Person
            person={{ name: 'Nadia Bloom', email: 'nadia@example.com' }}
            secondary="nadia@example.com"
          />
          {/* With a picture, which is the state the same component reaches once
              somebody has uploaded one (#222 B.1). A data URL, so the gallery
              needs neither a signed-in person nor a stored object to show it. */}
          <Person
            person={{ name: 'Nadia Bloom', email: 'nadia@example.com', imageUrl: SAMPLE_FACE }}
            secondary="With a picture"
          />
          <Person person={{ email: 'ada.lovelace@example.com' }} secondary="No name on file" />
          <Person person={{}} whenNameless="Unknown sender" secondary="Wrote in from a form" />
          <Person
            person={{ name: 'Casey Colleague', email: 'casey@example.com', deactivated: true }}
            secondary="Deactivated, cannot sign in"
          />
          <Person
            person={{ name: 'Sam Owner', email: 'sam@example.com' }}
            size="md"
            tone="accent"
            secondary="Owner"
            badge={<span className="shrink-0 text-xs text-subtle">(you)</span>}
          />
          <Person
            person={{ name: 'A Requester With A Very Long Name Indeed' }}
            secondary="and a second line that also has more words in it than the column has room for"
          />
        </div>
      </Section>
      <Section
        title="Keyboard hints"
        note="One cap, wherever a shortcut is named. There were three renderings of this, and two of them were bare characters: a persona read the loose L on the layout toggle as a broken glyph, which is what a stray capital against a word looks like."
      >
        <div className="flex flex-wrap items-center gap-4">
          <Kbd>⌘K</Kbd>
          <Kbd>L</Kbd>
          <Kbd>#</Kbd>
          <span className="flex items-center gap-1.5 text-[13px] text-muted">
            Beside a label it annotates <Kbd>E</Kbd>
          </span>
        </div>
      </Section>
      <Section
        title="Buttons"
        note="Four variants, two sizes, and each one disabled beside itself. A fifth variant would be a fifth meaning."
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="primary">
            <Plus className="h-4 w-4" aria-hidden />
            Primary
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Delete</Button>
          <Button variant="warning">Add note</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="primary" disabled>
            <Plus className="h-4 w-4" aria-hidden />
            Primary
          </Button>
          <Button variant="secondary" disabled>
            Secondary
          </Button>
          <Button variant="danger" disabled>
            Delete
          </Button>
          <Button variant="warning" disabled>
            Add note
          </Button>
          <Button variant="ghost" disabled>
            Ghost
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button size="sm" variant="primary">
            Small primary
          </Button>
          <Button size="sm" variant="secondary">
            Small secondary
          </Button>
          <Button size="sm" variant="danger">
            Small danger
          </Button>
        </div>
      </Section>
      <Section
        title="Fields"
        note="One height, one radius, one focus treatment, whatever the control underneath is. Search and filter are pills instead, because they float on a pane rather than sitting in a form."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <span className="block text-[13.5px] font-medium text-fg">Empty</span>
            <input className={FIELD_INPUT} placeholder="you@company.com" readOnly />
            <p className="text-[12.5px] text-subtle">Used for sign-in and notifications.</p>
          </div>
          <div className="space-y-1.5">
            <span className="block text-[13.5px] font-medium text-fg">Filled</span>
            <input className={FIELD_INPUT} readOnly value="elena.brooks@wavingeye.com" />
          </div>
          <div className="space-y-1.5">
            <span className="block text-[13.5px] font-medium text-fg">Rejected</span>
            <input className={`${FIELD_INPUT} ${FIELD_INVALID}`} readOnly value="not-an-email" />
            <p className="text-[12.5px] text-danger">That is not an email address.</p>
          </div>
          <div className="space-y-1.5">
            <span className="block text-[13.5px] font-medium text-fg">Disabled</span>
            <input className={FIELD_INPUT} disabled value="Cannot be changed" readOnly />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <label className={`${SEARCH_PILL} w-56`}>
            <Search className="h-4 w-4 shrink-0 text-subtle" aria-hidden />
            <input className={SEARCH_INPUT} placeholder="Search this queue…" readOnly />
          </label>
          <button type="button" className={FILTER_PILL}>
            Status
          </button>
          <button type="button" className={filterPill(true)}>
            Latest
          </button>
        </div>
      </Section>
      <Section
        title="Cards"
        note="Elevation, not outline. The bordered variant is for a card that meets another filled surface, where a shadow has no ground to fall on."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Card padding="sm">
            <CardTitle description="A soft shadow on the page.">Plain</CardTitle>
            <p className="text-sm text-muted">Body text.</p>
          </Card>
          <Card padding="sm" bordered>
            <CardTitle description="Hairline plus shadow.">Bordered</CardTitle>
            <p className="text-sm text-muted">Body text.</p>
          </Card>
          <Card padding="sm" interactive>
            <CardTitle description="Rises under the pointer.">Interactive</CardTitle>
            <p className="text-sm text-muted">Body text.</p>
          </Card>
        </div>
        <div>
          <Overline>Overline</Overline>
          <p className="mt-1.5 text-sm text-fg">The label over a group of fields or tags.</p>
        </div>
      </Section>
      <Section
        title="Skeletons"
        note="The shape of what is coming, not the word Loading. Each one mirrors the layout it stands in, and none of them appears before the wait passes 300ms."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-1.5 text-xs text-subtle">List rows (the queue)</p>
            <Card padding="none" className="overflow-hidden py-1.5">
              <SkeletonRows rows={3} />
            </Card>
          </div>
          <div>
            <p className="mb-1.5 text-xs text-subtle">Table rows (contacts)</p>
            <Card padding="none" className="overflow-hidden py-1.5">
              <SkeletonTableRows rows={3} />
            </Card>
          </div>
          <div>
            <p className="mb-1.5 text-xs text-subtle">Stat cards (the dashboard)</p>
            <div className="grid grid-cols-2 gap-3">
              <SkeletonCards cards={2} />
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-xs text-subtle">Lines (a record's fields)</p>
            <Card padding="sm">
              <SkeletonLines lines={4} />
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  note,
  children,
}: {
  readonly title: string;
  readonly note?: string;
  readonly children: ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-card bg-surface p-5 shadow-card sm:p-6">
      <div>
        <h2 className="text-[15px] font-semibold text-fg">{title}</h2>
        {note && <p className="mt-1 text-xs text-subtle">{note}</p>}
      </div>
      {children}
    </section>
  );
}

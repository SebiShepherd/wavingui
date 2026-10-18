/**
 * The form vocabulary, as class lists rather than as components.
 *
 * Every screen builds its own inputs - a select here, a textarea there, a
 * number with a suffix - so wrapping them in components would mean a prop for
 * every difference. What actually has to be identical is the *look*: one
 * height, one radius, one focus treatment. That is what lives here, and it is
 * what made a settings field and a contact field visibly different controls
 * before.
 */
/** The focus treatment, on its own so a custom control can wear it too. */
export const FOCUS_RING = 'focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent-wash';
/** A text input, a select or a textarea. 40px high, 12px radius. */
export const FIELD = `w-full rounded-field border border-border bg-bg px-3.5 text-sm text-fg transition-press placeholder:text-subtle disabled:opacity-50 ${FOCUS_RING}`;
/** The same, sized for a single line. Textareas set their own height. */
export const FIELD_INPUT = `${FIELD} h-10`;
/** A field that failed validation. Replaces the border, keeps everything else. */
export const FIELD_INVALID = 'border-danger focus:border-danger focus:ring-danger-wash';
/** The label above a field. */
export const FIELD_LABEL = 'text-[13.5px] font-medium text-fg';
/** The sentence under a field that explains what it does. */
export const FIELD_HINT = 'text-[12.5px] text-subtle';
/**
 * A search field or a filter control in the chrome of a list.
 *
 * These are pills, not boxes: they float on a pane rather than sitting in a
 * form, and the shape is what tells them apart from the fields inside a card.
 */
export const SEARCH_PILL = `flex h-9 items-center gap-2 rounded-pill border border-border bg-surface px-3.5 transition-press focus-within:border-accent focus-within:ring-[3px] focus-within:ring-accent-wash`;
/** The bare input inside a `SEARCH_PILL`. */
export const SEARCH_INPUT = 'w-full min-w-0 bg-transparent text-[13.5px] text-fg placeholder:text-subtle focus:outline-none';
/**
 * A filter or sort control in a chrome bar: same pill, smaller, a button.
 *
 * Shape only. The colours are the two states below, and they are deliberately
 * not folded into this constant: `border-border` and `border-accent` set the
 * same property, so a caller concatenating "the base plus the active bit" would
 * be relying on the order Tailwind happened to emit them in rather than on the
 * order it wrote them. Always pass exactly one of the two.
 */
export const FILTER_PILL_BASE = 'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill border text-[13px] transition-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-45';
/**
 * The pill's height, apart from the rest of it, because one caller needs a
 * different one: inside a selection bar these triggers stand beside `h-8`
 * verbs, and a 30px trigger in a row of 32px squares is a row that does not
 * line up. Passed rather than overridden - two height utilities on one element
 * are resolved by the order Tailwind emitted them, not by the order written.
 */
export const FILTER_PILL_HEIGHT = 'h-[30px]';
/**
 * The inset, as one of two sets rather than as a base plus an override.
 *
 * Same rule as the colours above: `px-2` and `pl-[5px]` set the same property,
 * so a caller adding the second to the first is trusting the order Tailwind
 * emitted them in. A pill that leads with a face wants the circle inset by as
 * much as it is from the top and bottom - 4px inside a 30px pill holding a
 * 20px circle and a 1px edge - while a pill leading with a word wants the text
 * is wider. Two sets, pick one.
 *
 * Narrower below `sm`: three of these live in the bulk action bar, and on a
 * 390px screen the wider inset is what pushes the way out of the bar off the
 * edge.
 *
 * `NONE` is for a pill that has shrunk to a square around one glyph. It is a
 * member of this set rather than a `px-0` a caller appends, because appending
 * it did not work: the responsive `sm:px-3` above beats an unprefixed `px-0`
 * whatever order they are written in, so the square kept 12px of inset either
 * side of a 32px box and squeezed its own icon to six pixels.
 */
export const FILTER_PILL_PAD = 'px-2 sm:px-3';
export const FILTER_PILL_PAD_AVATAR = 'pl-1 pr-2 sm:pr-3';
export const FILTER_PILL_PAD_NONE = 'px-0';
export const FILTER_PILL_IDLE = 'border-border bg-surface text-muted hover:text-fg';
/** The pill while its menu is open or its filter is set. */
export const FILTER_PILL_ACTIVE = 'border-accent bg-accent-wash font-medium text-accent';
/** The everyday pill: shape plus the resting colours. */
export const FILTER_PILL = `${FILTER_PILL_BASE} ${FILTER_PILL_HEIGHT} ${FILTER_PILL_PAD} ${FILTER_PILL_IDLE}`;
/**
 * Shape plus whichever state the caller is in, and whichever inset its contents
 * need. `leading: 'avatar'` is for a pill whose first child is a circle;
 * `'icon'` is for one that is nothing but a glyph and sets its width itself.
 */
export function filterPill(active, leading, height = FILTER_PILL_HEIGHT) {
    const pad = leading === 'avatar'
        ? FILTER_PILL_PAD_AVATAR
        : leading === 'icon'
            ? FILTER_PILL_PAD_NONE
            : FILTER_PILL_PAD;
    return `${FILTER_PILL_BASE} ${height} ${pad} ${active ? FILTER_PILL_ACTIVE : FILTER_PILL_IDLE}`;
}
/** A menu or popover opening from a control. */
export const POPOVER = 'rounded-card border border-border bg-overlay shadow-popover';
/** A row inside a menu. */
export const MENU_ITEM = 'flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-left text-sm text-muted transition-press hover:bg-surface-raised hover:text-fg focus:outline-none focus-visible:bg-surface-raised focus-visible:text-fg focus-visible:ring-2 focus-visible:ring-accent';
/**
 * A navigation row that can be the current one: queues, settings sections, rail
 * entries. Active is a filled surface, not an edge - the inset bar it replaces
 * needed a border on one side only, which no other element in the app has.
 */
export const NAV_ROW = 'flex items-center gap-2.5 rounded-[10px] px-2.5 text-sm transition-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent';
export const NAV_ROW_ACTIVE = 'bg-accent-wash font-semibold text-accent';
export const NAV_ROW_IDLE = 'text-muted hover:bg-surface-raised hover:text-fg';

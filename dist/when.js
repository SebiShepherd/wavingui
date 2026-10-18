/**
 * Short relative time for a queue that is scanned rather than read: "4m", "3h",
 * "2d". The exact timestamp is in the title attribute.
 *
 * Rendered in a fixed-width, right-aligned `<time datetime>` with tabular
 * figures, which is what every mail-shaped queue does (Gmail, Intercom,
 * Zendesk) and is better on its own terms: a column of ages that share a right
 * edge is scannable, and one whose width follows its text is not.
 *
 * It also stops the row moving. "23h" becoming "1d" is text that changes with
 * the clock and nothing else, so a pixel baseline has to exclude it - and an
 * excluded region that changes *size* leaks a few pixels either side, which is
 * a red run about arithmetic. A fixed box excludes cleanly.
 *
 * A fixed box only works if everything this can return fits in it. Anything
 * older than a month is therefore a two-digit day and month - "25.09." rather
 * than "25.09.2026" - because the full locale date in a column sized for "3d"
 * is a clipped date, and a clipped date is worse than a wide column. Numeric
 * rather than a month name: an abbreviated month varies by locale from "Jun"
 * to "Sept.", which is a variable width in a box whose whole point is to be
 * fixed. The year goes because a queue is scanned for recency, and the exact
 * instant is in the title attribute.
 *
 * It lives here rather than with the queue because the notification panel
 * needs the same words: it stamped entries "8/15/2026, 2:17:41 AM" while every
 * list beside it said "2m", so lining a notification up with its ticket meant
 * converting in your head (#178). One formatter, one vocabulary.
 *
 * `ConversationList.spec.tsx` holds it to the width the column was sized for.
 */
export function shortWhen(value) {
    const minutes = Math.round((Date.now() - new Date(value).getTime()) / 60000);
    if (minutes < 1)
        return 'now';
    if (minutes < 60)
        return `${minutes}m`;
    const hours = Math.round(minutes / 60);
    if (hours < 24)
        return `${hours}h`;
    const days = Math.round(hours / 24);
    if (days < 30)
        return `${days}d`;
    return new Date(value).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' });
}

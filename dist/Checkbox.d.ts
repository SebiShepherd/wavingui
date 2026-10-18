interface CheckboxProps {
    readonly checked: boolean;
    /**
     * Some of what this box stands for is selected, not all of it. Only a
     * select-all has anything to say here; a row's own box is on or off.
     */
    readonly someChecked?: boolean;
    readonly onChange: () => void;
    /** What is being selected: "Select HD-2026-0001". Never just "Select". */
    readonly label: string;
    readonly className?: string;
}
/**
 * The one box that says "this is picked".
 *
 * One component because the app had two shapes for the idea - a square box in a
 * list header and a round tick inside an avatar in the rows under it - and a
 * header control that looks nothing like the controls it commands reads as an
 * unrelated widget that happens to sit above them.
 *
 * The third state is the one that has to be here rather than at the callers:
 * `indeterminate` is not an attribute, it is a DOM property, so it cannot be
 * written in JSX and every caller that tried got a box that showed "none
 * selected" while five rows were selected under it.
 *
 * The skin is ours rather than the browser's. `accent-color` tints the tick and
 * the fill and leaves the *unchecked* box to the platform, which draws it as a
 * white square with a grey edge - correct on a light page and a bright hole in
 * a dark one, which is what the queue header looked like. There is no CSS for
 * "the unchecked box", so the whole control is `appearance-none` and the two
 * states are drawn here from the same tokens as everything else: transparent
 * with an edge at rest, the accent filled with `accent-on` on it when it holds
 * something. Both reference inboxes do this; so does every design system with a
 * checkbox in it, and for this reason.
 *
 * The edge is `subtle`, not `border`. `border` is what panels and rows are
 * drawn with - #2c3038 on a #1b1d23 surface, 1.25:1 - and an empty box is
 * nothing but its edge, so that edge is the boundary WCAG 2.2 SC 1.4.11 asks
 * for 3:1 of. `subtle` measures 4.4:1 in the dark theme and 3.4:1 in the light
 * one; `faint`, the next step in, is 2.7:1 and fails.
 */
export declare function Checkbox({ checked, someChecked, onChange, label, className, }: CheckboxProps): import("react").JSX.Element;
export {};

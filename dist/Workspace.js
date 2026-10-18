import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { useMediaQuery } from './useMediaQuery';
import { useLabels } from './labels';
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
};
/** The mirror of `RAIL`: shown exactly while the rail is not. */
export const RAIL_STANDIN = {
    alone: 'lg:hidden',
    beside: 'xl:hidden',
};
/** The same fact for logic rather than layout. */
export const railOnScreen = (beside) => beside ? '(min-width: 1280px)' : '(min-width: 1024px)';
export function Workspace({ nav, main, columns: columnsWanted, tabs, sidebarTitle, sidebarKey, onCloseSidebar, resting, overlay, }) {
    const L = useLabels();
    const open = Boolean(tabs && tabs.length > 0);
    const [activeTab, setActiveTab] = useState(null);
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
    return (_jsxs("div", { className: "relative flex h-full min-w-0", children: [nav && _jsx("div", { className: `w-60 shrink-0 ${RAIL[open ? 'beside' : 'alone']}`, children: nav }), _jsxs("div", { className: `relative flex h-full min-w-0 ${columns ? 'w-[22rem] shrink-0 2xl:w-[24rem]' : 'flex-1'} ${open && !split ? 'max-lg:hidden' : ''}`, children: [main, overlay] }), split ? (_jsxs(_Fragment, { children: [_jsx("section", { "aria-label": sidebarTitle ?? L.details, className: "flex h-full min-w-0 flex-1 flex-col border-l border-border bg-bg", children: first?.content }), _jsxs("div", { className: "flex h-full w-[20rem] shrink-0 flex-col border-l border-border bg-bg 2xl:w-[22rem]", children: [_jsxs("div", { className: "flex h-11 shrink-0 items-center gap-1 border-b border-border px-3", children: [rest.length === 1 ? (_jsx("h2", { className: "text-sm font-medium text-fg", children: rest[0].label })) : (rest.map((tab) => (_jsx("button", { type: "button", role: "tab", "aria-selected": (current?.id ?? rest[0].id) === tab.id, onClick: () => setActiveTab(tab.id), className: `rounded-[10px] px-2.5 py-1.5 text-sm transition-press ${(current?.id ?? rest[0].id) === tab.id
                                            ? 'bg-surface-raised font-medium text-fg'
                                            : 'text-muted hover:text-fg'}`, children: tab.label }, tab.id)))), onCloseSidebar && _jsx(CloseButton, { onClick: onCloseSidebar })] }), _jsx("div", { className: "flex min-h-0 flex-1 flex-col", children: (rest.find((tab) => tab.id === activeTab) ?? rest[0]).content })] })] })) : open ? (_jsxs("section", { "aria-label": sidebarTitle ?? L.details, className: "flex h-full w-full min-w-0 shrink-0 flex-col border-l border-border bg-bg lg:w-[26rem] xl:w-[34rem] 2xl:w-[40rem]", children: [_jsxs("div", { className: "flex h-11 shrink-0 items-center gap-1 border-b border-border px-2", children: [tabs?.map((tab) => (_jsx("button", { type: "button", role: "tab", "aria-selected": current?.id === tab.id, onClick: () => setActiveTab(tab.id), className: `rounded-[10px] px-2.5 py-1.5 text-sm transition-press ${current?.id === tab.id
                                    ? 'bg-surface-raised font-medium text-fg'
                                    : 'text-muted hover:text-fg'}`, children: tab.label }, tab.id))), onCloseSidebar && _jsx(CloseButton, { onClick: onCloseSidebar })] }), _jsx("div", { className: "flex min-h-0 flex-1 flex-col", children: current?.content })] })) : (resting && (
            // The same width the sidebar takes, so picking a record does not
            // shift the list sideways under the pointer that picked it. In
            // columns the list already has its width, so this simply fills what
            // is left rather than matching anything.
            _jsx("div", { className: `hidden flex-col items-center justify-center gap-3 border-l border-border bg-bg lg:flex ${columns ? 'min-w-0 flex-1' : 'w-[26rem] shrink-0 xl:w-[34rem] 2xl:w-[40rem]'}`, children: resting })))] }));
}
function CloseButton({ onClick }) {
    const L = useLabels();
    return (_jsx(Tooltip, { label: L.close, children: _jsx("button", { type: "button", "aria-label": L.close, onClick: onClick, className: "ml-auto grid h-8 w-8 place-items-center rounded-[10px] text-muted transition-press hover:bg-surface-raised hover:text-fg", children: _jsx(X, { className: "h-4 w-4", "aria-hidden": true }) }) }));
}

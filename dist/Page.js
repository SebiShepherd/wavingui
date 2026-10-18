import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
export function Page({ children, width = 'default', }) {
    return (_jsx("div", { className: "h-full overflow-auto p-4 sm:p-8 [scrollbar-gutter:stable]", children: _jsx("div", { className: `mx-auto ${width === 'narrow' ? 'max-w-[720px]' : 'max-w-[1080px]'}`, children: children }) }));
}
/**
 * The heading of a document page: title, one sentence, and whatever acts on the
 * whole page on the right. On a phone the actions go under the title, because
 * beside it they leave the title two words wide.
 */
export function PageHeader({ title, description, actions, }) {
    return (_jsxs("div", { className: "mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h1", { className: "text-[26px] font-semibold leading-tight text-fg", children: title }), description && _jsx("p", { className: "mt-1.5 text-[14.5px] text-muted", children: description })] }), actions && _jsx("div", { className: "flex shrink-0 flex-wrap items-center gap-2.5", children: actions })] }));
}

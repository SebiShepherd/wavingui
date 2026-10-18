import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
function Anchor({ href, children, ...rest }) {
    return (_jsx("a", { href: href, ...rest, children: children }));
}
const LinkContext = createContext(Anchor);
export function LinkProvider({ component, children, }) {
    return _jsx(LinkContext.Provider, { value: component, children: children });
}
export function useLink() {
    return useContext(LinkContext);
}

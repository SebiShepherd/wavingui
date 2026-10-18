import { type ComponentType, type ReactNode } from 'react';
/**
 * How the kit renders a link, supplied by the product.
 *
 * The kit has no router: a web app routes with react-router, a desktop shell
 * may not route at all. So a component that navigates renders whatever the
 * product puts in `LinkProvider`, and a plain `<a>` when nothing is there.
 * Hikaru passes a wrapper around react-router's `Link` that maps `href` to `to`.
 */
export interface LinkProps {
    readonly href: string;
    readonly className?: string;
    readonly children?: ReactNode;
    readonly 'aria-label'?: string;
    readonly 'aria-current'?: 'page' | undefined;
}
export type LinkComponent = ComponentType<LinkProps>;
export declare function LinkProvider({ component, children, }: {
    readonly component: LinkComponent;
    readonly children: ReactNode;
}): import("react").JSX.Element;
export declare function useLink(): LinkComponent;

import { createContext, useContext, type ComponentType, type ReactNode } from 'react';

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

function Anchor({ href, children, ...rest }: LinkProps) {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}

const LinkContext = createContext<LinkComponent>(Anchor);

export function LinkProvider({
  component,
  children,
}: {
  readonly component: LinkComponent;
  readonly children: ReactNode;
}) {
  return <LinkContext.Provider value={component}>{children}</LinkContext.Provider>;
}

export function useLink(): LinkComponent {
  return useContext(LinkContext);
}

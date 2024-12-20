import { useContext } from 'react';
import { Link, LinkProps, Location, To, useLocation } from 'react-router-dom';
import { PageContext } from './applyPagePaths/plugin';
import { useGetRedirectUrl } from './enablePages';
import { useI18n } from './i18n';

type DynamicLinkProps<T extends React.ElementType> = {
  to?: To;
  as?: T;
  variables?: object;
  pageId?: string;
  searchParams?: object;
} & Omit<React.ComponentPropsWithoutRef<T>, 'to'> &
  Partial<Pick<LinkProps, 'to'>>;

export function DynamicLink<T extends React.ElementType = typeof Link>({
  to = '.',
  as,
  variables,
  pageId,
  searchParams,
  ...props
}: DynamicLinkProps<T>): React.ReactElement {
  // Localize the link
  const { localizeLink } = useI18n();
  // const { pages } = useConfig();
  const location = useLocation();
  const pages = useContext(PageContext);

  const toString = convertTo2String(to, location);
  let toResult = localizeLink(toString);
  // Replace the link with a link to gbif if the target route is disabled
  const redirectToGbifLink = useGetRedirectUrl(toResult);

  // if a pageId is provided, use the pageId to get the link
  if (pageId && pages) {
    // first find the page with the provided pageId
    const page = pages.find((page) => page.id === pageId);
    if (page?.path) {
      // use the path provided
      to = `/${page.path}`;
      if (variables) {
        // replace the variables in the path
        Object.entries(variables).forEach(([key, value]) => {
          to = to.replace(`:${key}`, value);
        });
      }
      if (searchParams) {
        if (to.includes('?')) {
          to = `${to}&${new URLSearchParams(searchParams).toString()}`;
        } else {
          to = `${to}?${new URLSearchParams(searchParams).toString()}`;
        }
      }
      const customString = convertTo2String(to, location);
      const customTo = localizeLink(customString);

      if (page.isCustom) {
        return <a {...props} href={customTo} />;
      } else {
        toResult = customTo;
      }
    }
  }

  if (redirectToGbifLink) {
    return <a {...props} href={redirectToGbifLink} />;
  }

  // If preview=true is present in the query params, add it to the link
  const preview = new URLSearchParams(location.search).get('preview') === 'true';
  if (preview) {
    toResult = `${toResult}${toResult.includes('?') ? '&' : '?'}preview=true`;
  }

  const LinkComponent = as ?? Link;
  return <LinkComponent to={toResult} {...props} />;
}

function convertTo2String(to: To, location: Location<any>): string {
  if (typeof to === 'string') {
    return to;
  }

  const pathname = to.pathname ?? '.';
  const search = to.search ?? location.search;
  const hash = to.hash ?? location.hash;

  let link = pathname;
  if (search) link += `?${search}`;
  if (hash) link += `#${hash}`;

  return link;
}

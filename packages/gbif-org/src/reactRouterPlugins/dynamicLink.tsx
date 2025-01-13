import { ParentPagesContext } from '@/components/standaloneWrapper';
import { ParamQuery, stringify } from '@/utils/querystring';
import { useContext, useMemo } from 'react';
import { Link, LinkProps, Location, To, useLocation } from 'react-router-dom';
import { PageContext } from './applyPagePaths/plugin';
import { useGetRedirectUrl } from './enablePages';
import { useI18n } from './i18n';

type DynamicLinkProps<T extends React.ElementType> = {
  to?: To;
  as?: T;
  variables?: object;
  pageId?: string;
  searchParams?: ParamQuery;
} & Omit<React.ComponentPropsWithoutRef<T>, 'to'> &
  Partial<Pick<LinkProps, 'to'>>;

export function useDynamicLink({
  to,
  variables,
  pageId,
  searchParams,
}: {
  to: To;
  variables?: object;
  pageId?: string;
  searchParams?: ParamQuery;
}): { to: string; type: 'href' | 'link' } {
  const { localizeLink } = useI18n();
  const location = useLocation();
  const currentPages = useContext(PageContext);
  const parentPages = useContext(ParentPagesContext);

  const pages = parentPages ?? currentPages;

  const toAsString = convertTo2String(to, location);
  const toLocalized = localizeLink(toAsString);
  // Replace the link with a link to gbif if the target route is disabled
  const redirectToGbifLink = useGetRedirectUrl(toLocalized);

  const result = useMemo<{ to: string; type: 'link' | 'href' }>(() => {
    let isHref = false;
    let link = toLocalized;
    // if a pageId is provided, use the pageId to get the link
    if (pageId && pages) {
      // first find the page with the provided pageId
      const page = pages.find((page) => page.id === pageId);
      if (page?.isCustom) {
        isHref = true;
      }
      if (page?.path) {
        // use the path provided

        link = page.path;
        // if path do not start with http and not with a slash, then add a slash to the begining
        if (!link.startsWith('http') && !link.startsWith('/')) {
          link = `/${link}`;
        }

        if (variables) {
          // replace the variables in the path
          Object.entries(variables).forEach(([key, value]) => {
            link = (link as string).replace(`:${key}`, value);
          });
        }
        if (searchParams) {
          if (link.includes('?')) {
            link = `${link}&${stringify(searchParams)}`;
          } else {
            link = `${link}?${stringify(searchParams)}`;
          }
        }
        link = localizeLink(link);

        if (page.isCustom) {
          return { to: link, type: 'href' };
        }
      }
    }

    if (redirectToGbifLink) {
      return { to: redirectToGbifLink, type: 'href' };
    }

    if (isHref) {
      return { to: link, type: 'href' };
    }

    // If preview=true is present in the query params, add it to the link
    const preview = new URLSearchParams(location.search).get('preview') === 'true';
    if (preview) {
      link = `${link}${link.includes('?') ? '&' : '?'}preview=true`;
    }

    return { to: link, type: 'link' };
  }, [
    variables,
    pageId,
    searchParams,
    pages,
    location,
    toLocalized,
    localizeLink,
    redirectToGbifLink,
  ]);

  return result;
}

export function DynamicLink<T extends React.ElementType = typeof Link>({
  to = '.',
  as,
  variables,
  pageId,
  searchParams,
  ...props
}: DynamicLinkProps<T>): React.ReactElement {
  const link = useDynamicLink({ to, variables, pageId, searchParams });
  if (link.type === 'href') {
    return <a {...props} href={link.to} />;
  } else {
    const LinkComponent = as ?? Link;
    return <LinkComponent to={link.to} {...props} />;
  }
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

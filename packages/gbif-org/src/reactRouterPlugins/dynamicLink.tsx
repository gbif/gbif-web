import { ParentPagesContext } from '@/components/standaloneWrapper';
import { ParamQuery, stringify } from '@/utils/querystring';
import { useContext, useMemo } from 'react';
import { Link, LinkProps, useLocation } from 'react-router-dom';
import { PageContext } from './applyPagePaths/plugin';
import { useI18n } from './i18n';

export type DynamicLinkProps<T extends React.ElementType> = {
  to?: string;
  as?: T;
  variables?: Record<string, string>;
  pageId?: string;
  searchParams?: ParamQuery;
  keepExistingSearchParams?: boolean;
} & Omit<React.ComponentPropsWithoutRef<T>, 'to'> &
  Partial<Pick<LinkProps, 'to'>>;

/**
 * This is not ideal as it doesn't handle disabled routes and redirects to gbif.org
 */
export function useLink() {
  const { localizeLink, locale } = useI18n();
  const location = useLocation();
  const currentPages = useContext(PageContext);
  const parentPages = useContext(ParentPagesContext);
  const pages = parentPages ?? currentPages;

  const createLink = useMemo(() => {
    return ({
      pageId,
      variables = {},
      searchParams,
      keepExistingSearchParams = false,
    }: {
      pageId: string;
      variables?: Record<string, string>;
      searchParams?: ParamQuery;
      keepExistingSearchParams?: boolean;
    }): {
      to: string | null;
      type: 'href' | 'link';
    } => {
      let isHref = false;
      let link: string | null = null;
      // if a pageId is provided, use the pageId to get the link
      if (pageId && pages) {
        // first find the page with the provided pageId
        const page = pages.find((page) => page.id === pageId);

        // if unknown pageId, return null
        if (!page) {
          return { to: null, type: 'href' };
        }
        // if the page is disabled, return the redirect link
        if (page.redirect) {
          // merge variables from props with local variables
          const redirectLink = page.gbifRedirect?.(variables, locale);
          return { to: redirectLink ?? null, type: 'href' };
        }

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
              const reg = new RegExp(`:${key}(?=/|$)`);
              link = (link as string).replace(reg, value);
            });
          }
          if (searchParams) {
            if (link.includes('?')) {
              link = `${link}&${stringify(searchParams)}`;
            } else {
              link = `${link}?${stringify(searchParams)}`;
            }
          }

          if (keepExistingSearchParams && location.search) {
            link = `${link}${link.includes('?') ? '&' : '?'}${location.search.slice(1)}`;
          }

          link = localizeLink(link);

          if (page.isCustom) {
            return { to: link, type: 'href' };
          }
        } else {
          return { to: null, type: 'href' };
        }
      }

      if (isHref) {
        return { to: link, type: 'href' };
      }

      // If preview=true is present in the query params, add it to the link
      const preview = new URLSearchParams(location.search).get('preview') === 'true';
      if (link && preview) {
        link = `${link}${link.includes('?') ? '&' : '?'}preview=true`;
      }

      return { to: link, type: 'link' };
    };
  }, [pages, localizeLink, locale, location.search]);
  return createLink;
}

export function useDynamicLink({
  to = '.',
  variables,
  pageId,
  searchParams,
  keepExistingSearchParams = false,
}: {
  to?: string;
  variables?: Record<string, string>;
  pageId?: string;
  searchParams?: ParamQuery;
  keepExistingSearchParams?: boolean;
}): { to: string; type: 'href' | 'link' } {
  const createLink = useLink();
  const currentPages = useContext(PageContext);
  const parentPages = useContext(ParentPagesContext);

  const pages = parentPages ?? currentPages;

  const result = useMemo<{ to: string; type: 'link' | 'href' }>(() => {
    // if a pageId is provided, use the pageId to get the link
    if (pageId && pages) {
      const { to: link, type } = createLink({
        pageId,
        variables,
        searchParams,
        keepExistingSearchParams,
      });
      if (!link) {
        console.warn(`Page with id ${pageId} not found`);
      }
      return { to: link ?? '', type };
    } else {
      if (!to) {
        console.warn('No pageId or "to" provided');
      }
      return { to: to ?? '', type: 'link' };
    }
  }, [variables, pageId, searchParams, pages, to, createLink, keepExistingSearchParams]);

  return result;
}

export function DynamicLink<T extends React.ElementType = typeof Link>({
  to = '.',
  as,
  variables,
  pageId,
  searchParams,
  keepExistingSearchParams,
  ...props
}: DynamicLinkProps<T>): React.ReactElement {
  const link = useDynamicLink({ to, variables, pageId, searchParams, keepExistingSearchParams });
  if (link.type === 'href') {
    return <a {...props} href={link.to} />;
  } else {
    const LinkComponent = as ?? Link;
    return <LinkComponent to={link.to} {...props} />;
  }
}

import { ParentPagesContext } from '@/components/standaloneWrapper';
import { ParamQuery, stringify } from '@/utils/querystring';
import { useCallback, useContext, useMemo } from 'react';
import { Link, LinkProps, useLocation, useNavigate } from 'react-router-dom';
import { PageContext } from './applyPagePaths/plugin';
import { useI18n } from './i18n';

export type LinkData = {
  to: string | object | null;
  type: 'href' | 'link';
};

export type DynamicLinkProps<T extends React.ElementType> = {
  to?: string;
  as?: T;
  variables?: Record<string, string>;
  pageId?: string;
  searchParams?: ParamQuery;
  path?: string;
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
      path,
    }: {
      pageId?: string;
      variables?: Record<string, string>;
      searchParams?: ParamQuery;
      keepExistingSearchParams?: boolean;
      path?: string;
    }): LinkData => {
      let isHref = false;
      let link: string | null = null;
      // if a pageId is provided, use the pageId to get the link

      if (pageId === 'taxonKey' && variables.key && variables.datasetKey) {
        if (variables.datasetKey !== import.meta.env.PUBLIC_DEFAULT_CHECKLIST_KEY) {
          pageId = 'datasetKey';
          path = `/taxon/${encodeURIComponent(variables.key)}`;
          variables = { key: variables.datasetKey };
        }
      }
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
          const redirectLink = page.gbifRedirect?.(variables, locale, searchParams);
          return { to: redirectLink ?? null, type: 'href' };
        }

        if (page?.isCustom) {
          isHref = true;
        }
        if (page?.path) {
          // use the path provided

          link = page.path + (path ?? '');
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

      if (!pageId && searchParams) {
        link = location.pathname;

        if (link.includes('?')) {
          link = `${link}&${stringify(searchParams)}`;
        } else {
          link = `${link}?${stringify(searchParams)}`;
        }

        if (keepExistingSearchParams && location.search) {
          link = `${link}${link.includes('?') ? '&' : '?'}${location.search.slice(1)}`;
        }
      }

      // If preview=true is present in the query params, add it to the link
      const preview = new URLSearchParams(location.search).get('preview') === 'true';
      if (link && preview) {
        link = `${link}${link.includes('?') ? '&' : '?'}preview=true`;
      }

      // If contentType=literature is present, use href instead of link
      if (searchParams?.contentType === 'literature') {
        return { to: link, type: 'href' };
      }

      return { to: link, type: 'link' };
    };
  }, [pages, localizeLink, locale, location.search, location.pathname]);
  return createLink;
}

export function useDynamicLink({
  to = '.',
  variables,
  pageId,
  searchParams,
  keepExistingSearchParams = false,
  path,
}: {
  to?: string | object;
  variables?: Record<string, string>;
  pageId?: string;
  searchParams?: ParamQuery;
  keepExistingSearchParams?: boolean;
  path?: string;
}): LinkData {
  const createLink = useLink();
  const { localizeLink } = useI18n();
  const location = useLocation();
  const currentPages = useContext(PageContext);
  const parentPages = useContext(ParentPagesContext);

  const pages = parentPages ?? currentPages;

  const result = useMemo<LinkData>(() => {
    // if a pageId is provided, use the pageId to get the link (this also works for links without a pageId, but with searchParams)
    if ((pageId || searchParams) && pages) {
      const { to: link, type } = createLink({
        pageId,
        variables,
        searchParams,
        keepExistingSearchParams,
        path,
      });
      if (!link) {
        console.warn(`Page with id ${pageId} not found`);
      }
      return { to: link ?? '', type };
    } else if (typeof to === 'string' && to !== '') {
      let localizedTo = localizeLink(to);

      // If preview=true is present in the current query params, add it to the link
      const preview = new URLSearchParams(location.search).get('preview') === 'true';
      if (preview) {
        localizedTo = `${localizedTo}${localizedTo.includes('?') ? '&' : '?'}preview=true`;
      }

      // If contentType=literature is present in the URL, use href instead of link
      if (to.includes('contentType=literature')) {
        return { to: localizedTo, type: 'href' };
      }

      return { to: localizedTo, type: 'link' };
    } else {
      if (!to) {
        console.warn('No pageId or "to" provided');
      }
      return { to: to ?? '', type: 'link' };
    }
  }, [
    variables,
    pageId,
    searchParams,
    path,
    pages,
    to,
    createLink,
    keepExistingSearchParams,
    localizeLink,
    location.search,
  ]);

  return result;
}

export function DynamicLink<T extends React.ElementType = typeof Link>({
  to = '.',
  as,
  variables,
  pageId,
  searchParams,
  path,
  keepExistingSearchParams,
  ...props
}: DynamicLinkProps<T>): React.ReactElement {
  const linkData = useDynamicLink({
    to,
    variables,
    pageId,
    searchParams,
    keepExistingSearchParams,
    path,
  });

  return <DynamicLinkPresentation linkData={linkData} as={as} {...props} />;
}

type DynamicLinkPresentationProps<T extends React.ElementType> = {
  linkData: LinkData;
  as?: T;
  children?: React.ReactNode;
  [key: string]: any; // For remaining props
};

export function DynamicLinkPresentation<T extends React.ElementType = typeof Link>({
  linkData,
  as,
  ...props
}: DynamicLinkPresentationProps<T>): React.ReactElement {
  if (linkData.type === 'href') {
    return <a {...props} href={linkData.to!} />;
  } else {
    const LinkComponent = as ?? Link;
    return <LinkComponent to={linkData.to!} {...props} />;
  }
}

export function useDynamicNavigate() {
  const createLink = useLink();
  const navigate = useNavigate();
  const dynamicNavigate = useCallback(
    (...args: Parameters<typeof createLink>) => {
      const link = createLink(...args);
      if (!link.to) return;

      if (link.type === 'href' && typeof link.to === 'string') {
        window.location.href = link.to;
        return;
      }

      if (link.type === 'link') {
        navigate(link.to);
        return;
      }
    },
    [createLink, navigate]
  );

  return dynamicNavigate;
}

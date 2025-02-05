import { DynamicLinkProps, LinkData, useDynamicLink } from '@/reactRouterPlugins/dynamicLink';
import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

export type RowLinkOptions<T> = { createDrawerKey: (item: T) => string } | { pageId: string };

type UseRowLinkOptions<T> = {
  rowLinkOptions: RowLinkOptions<T>;
  keySelector: (item: T) => string;
};

export type CreateRowLink<T> = (item: T) => LinkData;

const KEY_PLACEHOLDER = '__KEY__';

export function useRowLink<T>({
  rowLinkOptions,
  keySelector,
}: UseRowLinkOptions<T>): CreateRowLink<T> {
  const dynamicLinkArgs: DynamicLinkProps<typeof Link> = useMemo(() => {
    if ('createDrawerKey' in rowLinkOptions) {
      return {
        to: '.',
        searchParams: { entity: KEY_PLACEHOLDER },
        keepExistingSearchParams: true,
      };
    }

    return {
      pageId: rowLinkOptions.pageId,
      variables: { key: KEY_PLACEHOLDER },
    };
  }, [rowLinkOptions]);

  const link = useDynamicLink(dynamicLinkArgs);

  return useCallback(
    (item: T) => {
      if ('createDrawerKey' in rowLinkOptions) {
        return {
          type: link.type,
          to: link.to.replace(KEY_PLACEHOLDER, rowLinkOptions.createDrawerKey(item)),
        };
      }

      return {
        type: link.type,
        to: link.to.replace(KEY_PLACEHOLDER, keySelector(item)),
      };
    },
    [link.to, link.type, rowLinkOptions, keySelector]
  );
}

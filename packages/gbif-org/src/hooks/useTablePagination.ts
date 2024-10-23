import React from 'react';
import { useSearchParams } from 'react-router-dom';

type UseTablePaginationResult = {
  nextLink: string | undefined;
  firstLink: string | undefined;
  previousLink: string | undefined;
};

type PaginationOptions = {
  pageSize: number;
};

function createLink(from: number, otherParams: string): string {
  let link = `?from=${Math.max(from, 0)}`;
  if (otherParams !== '') {
    link += `&${otherParams}`;
  }
  return link;
}

export function useTablePagination(options: PaginationOptions): UseTablePaginationResult {
  const [searchParams] = useSearchParams();
  const from = parseInt(searchParams.get('from') ?? '0');

  const otherParams = React.useMemo(() => {
    const clone = new URLSearchParams(searchParams);
    clone.delete('from');
    return clone.toString();
  }, [searchParams]);

  // TODO : Add end of results validation
  const nextLink = createLink(from + options.pageSize, otherParams);
  const previousLink = from > 0 ? createLink(from - options.pageSize, otherParams) : undefined;
  const firstLink = from > 0 ? createLink(0, otherParams) : undefined;

  return { firstLink, nextLink, previousLink };
}

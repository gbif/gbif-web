import { PaginationState, SetPaginationState } from './usePaginationState';

type Options = {
  paginationState: PaginationState;
  setPaginationState: SetPaginationState;
  rowCount?: number;
};

type Result = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  firstPage(): void;
  previousPage(): void;
  nextPage(): void;
  pageCount?: number;
  pageNumber: number;
};

export function usePagination({ paginationState, setPaginationState, rowCount }: Options): Result {
  // Handle loading state
  if (!rowCount) {
    return {
      hasNextPage: false,
      hasPreviousPage: false,
      firstPage: () => {},
      previousPage: () => {},
      nextPage: () => {},
      pageCount: undefined,
      pageNumber: paginationState.pageIndex + 1,
    };
  }

  const pageCount = Math.ceil(rowCount / paginationState.pageSize);
  const currentPage = paginationState.pageIndex + 1;

  return {
    hasNextPage: currentPage < pageCount,
    hasPreviousPage: currentPage > 1,
    firstPage: () => {
      setPaginationState((prev) => ({
        ...prev,
        pageIndex: 0,
      }));
    },
    previousPage: () => {
      setPaginationState((prev) => ({
        ...prev,
        pageIndex: Math.max(0, prev.pageIndex - 1),
      }));
    },
    nextPage: () => {
      setPaginationState((prev) => ({
        ...prev,
        pageIndex: Math.min(pageCount - 1, prev.pageIndex + 1),
      }));
    },
    pageCount,
    pageNumber: currentPage,
  };
}

import { FilterContext } from '@/contexts/filter';
import { PaginationState } from '@tanstack/react-table';
import { useContext, useEffect, useRef } from 'react';

export function useResetPaginationOnFilterChange(
  setPaginationState: React.Dispatch<React.SetStateAction<PaginationState>>
) {
  const filterContext = useContext(FilterContext);

  // We use this to make sure we don't accidentally reset the pagination when the component mounts (e.g when changing the language)
  const prevFilterHash = useRef(filterContext.filterHash);

  // Go back to the first page when the filters change
  useEffect(() => {
    if (prevFilterHash.current !== filterContext.filterHash) {
      setPaginationState((prev) => ({ ...prev, pageIndex: 0 }));
    }
    prevFilterHash.current = filterContext.filterHash;
  }, [filterContext.filterHash, setPaginationState]);
}

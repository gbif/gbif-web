import { useStateAsRef } from '@/hooks/useStateAsRef';
import { PaginationState } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function usePaginationState(): [
  PaginationState,
  React.Dispatch<React.SetStateAction<PaginationState>>
] {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageSize, setPageSize] = useState(20);

  const from = parseInt(searchParams.get('from') ?? '0');

  // This ref is used to help limit the amount of renrenders the table does when changing filters
  const searchParamsRef = useStateAsRef(searchParams);

  const setFrom = useCallback(
    (from: number) => {
      const newSearchParams = new URLSearchParams(searchParamsRef.current);

      if (from === 0) {
        // Remove the from parameter if it is 0
        newSearchParams.delete('from');
        return setSearchParams(newSearchParams);
      }

      newSearchParams.set('from', from.toString());
      setSearchParams(newSearchParams);
    },
    [setSearchParams]
  );

  const state: PaginationState = useMemo(() => {
    return { pageIndex: Math.floor(from / pageSize), pageSize };
  }, [from, pageSize]);

  // This ref is used to help limit the amount of renrenders the table does when changing filters
  const stateRef = useStateAsRef(state);

  const setPaginationState = useCallback(
    (updaterOrValue: React.SetStateAction<PaginationState>) => {
      let newState: PaginationState;

      if (typeof updaterOrValue === 'function') {
        newState = updaterOrValue(stateRef.current);
      } else {
        newState = updaterOrValue;
      }

      setFrom(newState.pageIndex * newState.pageSize);
      setPageSize(newState.pageSize);
    },
    [setFrom, setPageSize]
  );

  return [state, setPaginationState];
}

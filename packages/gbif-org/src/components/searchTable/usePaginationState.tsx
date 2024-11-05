import { PaginationState } from '@tanstack/react-table';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function usePaginationState(): [
  PaginationState,
  React.Dispatch<React.SetStateAction<PaginationState>>
] {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageSize, setPageSize] = useState(20);

  const from = parseInt(searchParams.get('from') ?? '0');
  const setFrom = (from: number) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (from === 0) {
      // Remove the from parameter if it is 0
      newSearchParams.delete('from');
      return setSearchParams(newSearchParams);
    }

    newSearchParams.set('from', from.toString());
    setSearchParams(newSearchParams);
  };

  const setPaginationState = (updaterOrValue: React.SetStateAction<PaginationState>) => {
    let newState: PaginationState;

    if (typeof updaterOrValue === 'function') {
      const oldState: PaginationState = { pageIndex: Math.floor(from / pageSize), pageSize };
      newState = updaterOrValue(oldState);
    } else {
      newState = updaterOrValue;
    }

    setFrom(newState.pageIndex * newState.pageSize);
    setPageSize(newState.pageSize);
  };

  return [{ pageIndex: Math.floor(from / pageSize), pageSize }, setPaginationState];
}

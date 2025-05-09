import { useIntParam } from '@/hooks/useParam';
import { useStateAsRef } from '@/hooks/useStateAsRef';
import { Setter } from '@/types';
import { useCallback, useMemo, useState } from 'react';

export type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

export type SetPaginationState = Setter<PaginationState>;

export function usePaginationState({ pageSize: size }: { pageSize?: number } = {}): [
  PaginationState,
  SetPaginationState
] {
  const [from, setFrom] = useIntParam({
    key: 'from',
    hideDefault: true,
    defaultValue: 0,
  });
  const [pageSize, setPageSize] = useState(size ?? 20);

  const state: PaginationState = useMemo(() => {
    return { pageIndex: Math.floor(from / pageSize), pageSize };
  }, [from, pageSize]);

  // This ref is used to help limit the amount of renrenders the table does when changing filters
  const stateRef = useStateAsRef(state);

  const setPaginationState: SetPaginationState = useCallback(
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

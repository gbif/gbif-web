import { useToast } from '@/components/ui/use-toast';
import { useIntParam } from '@/hooks/useParam';
import { useStateAsRef } from '@/hooks/useStateAsRef';
import { Setter } from '@/types';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

export type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

export type SetPaginationState = Setter<PaginationState>;

export function usePaginationState({
  pageSize: size,
  maxResults = 2500,
}: { pageSize?: number; maxResults?: number } = {}): [PaginationState, SetPaginationState] {
  const [from, setFrom] = useIntParam({
    key: 'from',
    hideDefault: true,
    defaultValue: 0,
  });
  const [pageSize, setPageSize] = useState(size ?? 20);
  const { toast } = useToast();
  const { formatMessage } = useIntl();

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

      if ((newState.pageIndex + 1) * newState.pageSize > maxResults) {
        toast({
          title: formatMessage(
            { id: 'error.maximumResultLimitExceeded' },
            { MAX_RESULTS: maxResults }
          ),
          variant: 'destructive',
        });
        return;
      }
      setFrom(newState.pageIndex * newState.pageSize);
      setPageSize(newState.pageSize);
    },
    [setFrom, setPageSize, formatMessage, maxResults, toast]
  );

  return [state, setPaginationState];
}

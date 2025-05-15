import { ActionsProps } from './components/header/head';

export { LinkOption } from './components/body/linkOption';
export { SetAsFilter } from './components/body/setAsFilter';
export { SetAsFilterList } from './components/body/setAsFilterList';
export {
  useAvailableAndDefaultEnabledColumns,
  type FallbackTableOptions,
} from './hooks/useAvailableAndDefaultEnabledColumns';
export { usePaginationState } from './hooks/usePaginationState';
export { useRowLink, type RowLinkOptions } from './hooks/useRowLink';
export { default as SearchTable } from './table';

export type ColumnDef<T> = {
  id: string;
  header: string;
  disableHiding?: boolean; // default true
  filterKey?: string; // default same as id
  minWidth?: number;
  cell(value: T): React.ReactNode;
  // a react component that is inserted in the header.
  Actions?: React.FC<ActionsProps>;
  sort?: {
    sortBy: string; // the field to sort by
    message?: React.ReactNode;
    localStorageKey: string; // the key to use for local storage
  };
};

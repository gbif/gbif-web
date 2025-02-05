export { SetAsFilter } from './components/body/setAsFilter';
export { SetAsFilterList } from './components/body/setAsFilterList';
export { LinkOption } from './components/body/linkOption';
export { default as SearchTable } from './table';
export {
  type FallbackTableOptions,
  useAvailableAndDefaultEnabledColumns,
} from './hooks/useAvailableAndDefaultEnabledColumns';
export { type RowLinkOptions, useRowLink } from './hooks/useRowLink';
export { usePaginationState } from './hooks/usePaginationState';

export type ColumnDef<T> = {
  id: string;
  header: string;
  disableHiding?: boolean; // default true
  filterKey?: string; // default same as id
  minWidth?: number;
  cell(value: T): React.ReactNode;
};

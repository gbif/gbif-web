import '@tanstack/react-table';
import { RowData } from '@tanstack/react-table';
import { FilterSetting } from '../filters/filterTools';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    noCellPadding?: boolean;
    filter: FilterSetting;
  }
}

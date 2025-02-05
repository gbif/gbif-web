import { SimpleTooltip } from '@/components/simpleTooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SlOptionsVertical } from 'react-icons/sl';
import { FormattedMessage } from 'react-intl';
import {
  ResetColumnVisibility,
  ToggleColumnVisibility,
  VisibleColumns,
} from '../../hooks/useColumnVisibility';
import { ColumnDef } from '../..';

type Props = {
  resetColumnVisibility: ResetColumnVisibility;
  toggleColumnVisibility: ToggleColumnVisibility;
  orderedColumns: ColumnDef<unknown>[];
  visibleColumns: VisibleColumns;
};

export function ColumnVisibilityPopover({
  resetColumnVisibility,
  visibleColumns,
  orderedColumns,
  toggleColumnVisibility,
}: Props) {
  return (
    <Popover>
      <SimpleTooltip i18nKey="search.table.columnVisibility" asChild side="right">
        <PopoverTrigger className="g-pr-3 g-pl-1 hover:g-text-primary-500">
          {/* This 16px width match the drawer icon in the left most cell */}
          <div className="g-w-[16px]">
            <SlOptionsVertical size={14} />
          </div>
        </PopoverTrigger>
      </SimpleTooltip>
      <PopoverContent className="g-p-3 g-flex g-flex-col g-gap-3 g-overflow-y-scroll g-max-h-96">
        {orderedColumns.map((column) => (
          <div key={column.id} className="g-flex g-items-center g-gap-2">
            <Checkbox
              id={column.id}
              checked={visibleColumns.has(column.id)}
              disabled={column.disableHiding ?? false}
              onCheckedChange={() => toggleColumnVisibility(column.id)}
            />
            <label
              htmlFor={column.id}
              className="g-cursor-pointer g-text-sm g-font-medium peer-disabled:g-cursor-not-allowed peer-disabled:g-opacity-70"
            >
              <FormattedMessage id={column.header} />
            </label>
          </div>
        ))}
        <button
          onClick={resetColumnVisibility}
          className="g-text-primary-500 g-font-medium g-text-sm"
        >
          <FormattedMessage id="search.table.resetColumnVisibility" />
        </button>
      </PopoverContent>
    </Popover>
  );
}

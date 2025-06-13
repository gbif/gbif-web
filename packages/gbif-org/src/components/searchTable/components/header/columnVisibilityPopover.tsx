import { SimpleTooltip } from '@/components/simpleTooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SlOptionsVertical } from 'react-icons/sl';
import { FormattedMessage } from 'react-intl';
import { ColumnDef } from '../..';
import {
  ResetColumnVisibility,
  ToggleColumnVisibility,
  VisibleColumns,
} from '../../hooks/useColumnVisibility';

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
      <PopoverContent className="g-flex g-flex-col g-p-0">
        <div className="g-font-medium g-text-sm g-flex-none g-p-2 g-border-b">
          <FormattedMessage id="search.table.columnVisibility" />
        </div>
        <div className="g-max-h-96 g-overflow-y-scroll g-flex-1 gbif-small-scrollbar">
          {orderedColumns.map((column) => (
            <div key={column.id} className="g-flex g-items-center g-gap-2 g-my-2 g-px-2">
              <Checkbox
                id={column.id}
                checked={visibleColumns.has(column.id)}
                disabled={column.disableHiding ?? false}
                onCheckedChange={() => toggleColumnVisibility(column.id)}
              />
              <label
                htmlFor={column.id}
                className="g-cursor-pointer g-text-sm peer-disabled:g-cursor-not-allowed peer-disabled:g-opacity-70"
              >
                <FormattedMessage id={column.header} />
              </label>
            </div>
          ))}
        </div>
        <button
          onClick={resetColumnVisibility}
          className="g-text-primary-500 g-font-medium g-text-sm g-flex-none g-p-2 g-border-t"
        >
          <FormattedMessage id="search.table.resetColumnVisibility" />
        </button>
      </PopoverContent>
    </Popover>
  );
}

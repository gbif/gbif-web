import { SetAsFilter } from './setAsFilter';
import { InlineLineClamp } from '@/components/inlineLineClamp';

type Props<T> = {
  filterIsActive: boolean;
  field: string;
  items: T[] | undefined | null;
  selectFilterValue?: (value: T) => any;
  renderValue?: (value: T) => React.ReactNode;
};

export function SetAsFilterList<T>({
  filterIsActive,
  field,
  items,
  selectFilterValue,
  renderValue,
}: Props<T>) {
  if (!items) return null;

  return (
    <InlineLineClamp className="-g-ml-0.5">
      {items.map((item, idx) => {
        const filterValue =
          typeof selectFilterValue === 'function' ? selectFilterValue(item) : item;
        const renderedValue = typeof renderValue === 'function' ? renderValue(item) : item;

        return (
          <SetAsFilter
            key={filterValue}
            filterIsActive={filterIsActive}
            field={field}
            value={filterValue}
            className="g-ml-0"
          >
            {renderedValue as any}
            {idx < items.length - 1 && ', '}
          </SetAsFilter>
        );
      })}
    </InlineLineClamp>
  );
}

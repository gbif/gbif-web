import { InlineLineClamp } from '@/components/inlineLineClamp';
import { SetAsFilter } from './setAsFilter';

type Props<T> = {
  field: string;
  items: T[] | undefined | null;
  selectFilterValue?: (value: T) => any;
  renderValue?: (value: T) => React.ReactNode;
};

export function SetAsFilterList<T>({ field, items, selectFilterValue, renderValue }: Props<T>) {
  if (!items) return null;

  return (
    <InlineLineClamp className="-g-ms-0.5">
      {items.map((item, idx) => {
        const filterValue =
          typeof selectFilterValue === 'function' ? selectFilterValue(item) : item;
        const renderedValue = typeof renderValue === 'function' ? renderValue(item) : item;

        return (
          <SetAsFilter key={idx} field={field} value={filterValue} className="g-ms-0">
            {renderedValue as any}
            {idx < items.length - 1 && ', '}
          </SetAsFilter>
        );
      })}
    </InlineLineClamp>
  );
}

import { MultiOptionsFilterComponent } from './multiOptionsFilter';
import { FilterType, TableFilter } from './types';
import { SetFilter } from '@/hooks/useFilters';

type Props = {
  filters: Array<TableFilter>;
  setFilter: SetFilter;
};

export function TableFilters({ filters, setFilter }: Props) {
  return (
    <div className='g-flex'>
      {filters.map((filter) => {
        switch (filter.type) {
          case FilterType.MultiOptionsFilter:
            return (
              <MultiOptionsFilterComponent
                key={filter.name}
                filter={filter}
                onSubmit={(data) => setFilter({ id: filter.id, values: data.values })}
              />
            );
        }
      })}
    </div>
  );
}

import { SearchInput } from '@/components/searchInput';
import { Button } from '@/components/ui/button';
import { FilterContext, FilterType } from '@/contexts/filter';
import { remove } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';

type QFilterProps = {
  className?: string;
  filterHandle: string;
  onApply?: ({ keepOpen, filter }: { keepOpen?: boolean; filter?: FilterType }) => void;
  onCancel?: () => void;
};

export const QFilter = React.forwardRef<HTMLInputElement, QFilterProps>(
  ({ className, filterHandle, onApply, onCancel, ...props }: QFilterProps, ref) => {
    const currentFilterContext = useContext(FilterContext);
    const { filter, add, setField, filterHash } = currentFilterContext;
    const [q, setQ] = useState<string>('');
    const [pristine, setPristine] = useState(true);

    useEffect(() => {
      // filter has changed updateed the listed of selected values
      const filterQ = filter?.must?.[filterHandle]?.[0] ?? '';
      setQ(filterQ);
      // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterHash, filterHandle]);

    return (
      <div className="g-flex g-flex-col">
        <div className="g-flex g-flex-none">
          <SearchInput
            ref={ref}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPristine(false);
            }}
            placeholder="Search"
            className="g-border-slate-100 g-w-full g-py-1.5 g-px-4"
            onKeyDown={(e) => {
              // if user press enter, then update the value
              if (e.key === 'Enter') {
                if (e.currentTarget.value !== '') {
                  const filter = add(filterHandle, e.currentTarget.value);
                  onApply?.({ keepOpen: false, filter });
                } else {
                  onApply?.({ keepOpen: false, filter: setField(filterHandle, []) });
                }
              }
            }}
          />
        </div>
        {onApply && onCancel && (
          <div className="g-flex-none g-py-2 g-px-2 g-flex g-justify-between g-border-t">
            <Button size="sm" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            {!pristine && (
              <Button
                size="sm"
                onClick={() => {
                  const filter = add(filterHandle, q);
                  onApply({ keepOpen: false, filter });
                }}
              >
                Apply
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

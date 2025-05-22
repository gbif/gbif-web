import { SearchInput } from '@/components/searchInput';
import { FilterContext } from '@/contexts/filter';
import { cn } from '@/utils/shadcn';
import React, { useContext, useEffect, useState } from 'react';
import { AdditionalFilterProps, ApplyCancel, filterFreeTextConfig } from './filterTools';

type QFilterProps = Omit<filterFreeTextConfig, 'filterType' | 'filterTranslation'> &
  AdditionalFilterProps & {
    className?: string;
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
      <div className={cn('g-flex g-flex-col g-max-h-[100dvh]', className)}>
        <div className="g-flex g-flex-none">
          <SearchInput
            ref={ref}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPristine(false);
            }}
            placeholder="Search"
            className="g-border b-gorder-solid g-border-slate-100 g-w-full g-py-1.5 g-px-4 g-text-sm"
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
        <ApplyCancel onApply={onApply} onCancel={onCancel} pristine={pristine} />
      </div>
    );
  }
);

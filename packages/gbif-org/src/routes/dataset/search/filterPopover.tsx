import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { FilterContext, FilterProvider, FilterType } from '@/contexts/filter';
import { cn } from '@/utils/shadcn';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useUncontrolledProp } from 'uncontrollable';
import { MdClose } from 'react-icons/md';

function FilterApplyContent({
  children,
  setOpen,
  titleTranslationKey,
  ...props
}: {
  children: React.ReactNode;
  titleTranslationKey?: string;
  setOpen: (b: boolean) => void;
}) {
  const currentFilterContext = useContext(FilterContext);
  const [tmpFilter, setFilter] = useState(currentFilterContext.filter);

  useEffect(() => {
    setFilter(currentFilterContext.filter);
  }, [currentFilterContext.filterHash]);

  const onApply = useCallback(() => {
    currentFilterContext.setFilter(tmpFilter);
    setOpen(false);
  }, [tmpFilter, currentFilterContext]);

  const onCancel = useCallback(() => {
    setFilter(currentFilterContext.filter);
    setOpen(false);
  }, [currentFilterContext.filterHash]);

  const onFilterChange = useCallback((filter: FilterType) => {
    setFilter(filter);
  }, []);

  return (
    <FilterProvider filter={tmpFilter} onChange={onFilterChange}>
      <PopoverContent
        onPointerDownOutside={onApply}
        align="start"
        className="g-flex g-flex-col g-p-0 g-w-96 g-max-w-[var(--radix-popper-available-width)] g-shadow-[0_10px_600px_-12px_rgba(0,0,0,0.2)]"
        // style={{ boxShadow: '0 0 10000px 10000px rgba(0, 0, 0, 0.25)' }}
      >
        <>
          {/* <h3 className="g-px-4 g-py-2 g-font-bold g-text-sm g-border-b">
            {<FormattedMessage id={titleTranslationKey} />}
          </h3> */}
          {children}
          <div className="g-py-2 g-px-2 g-flex g-justify-between g-border-t">
            <Button size="sm" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={onApply}>
              Apply
            </Button>
          </div>
        </>
      </PopoverContent>
    </FilterProvider>
  );
}

export function FilterPopover({
  open,
  setOpen,
  filterHandle,
  DisplayName,
  children,
  titleTranslationKey,
}: {
  open?: boolean;
  setOpen?: (b: boolean) => void;
  filterHandle: string;
  DisplayName: React.ComponentType<{ id: string }>;
  children: React.ReactNode;
  titleTranslationKey: string;
}) {
  const [controlledOpen, setControlledOpen] = useUncontrolledProp(open, false, setOpen);
  return (
    <Popover open={controlledOpen} onOpenChange={setControlledOpen}>
      <PopoverTrigger asChild>
        <FilterButton
          className="g-my-2 g-mx-1 g-max-w-96"
          filterHandle={filterHandle}
          DisplayName={DisplayName}
          titleTranslationKey={titleTranslationKey}
        />
      </PopoverTrigger>
      <FilterApplyContent setOpen={setControlledOpen}>{children}</FilterApplyContent>
    </Popover>
  );
}

function getFilterSummary(filter: FilterType, handle: string) {
  const must = filter?.must?.[handle] || [];
  const mustNot = filter?.mustNot?.[handle] || [];

  // check if there is a isNull or isNotNull filter among the filters
  const isNull = must?.[0]?.type === 'isNull' && must.length === 1;
  const isNotNull = must?.[0]?.type === 'isNotNull' && must.length === 1;

  return {
    defaultCount: must.length + mustNot.length,
    hasNegations: mustNot.length > 0,
    mixed: must.length > 0 && mustNot.length > 0,
    isNull,
    isNotNull,
    firstValue: must?.[0] || mustNot?.[0],
  };
}

interface FilterButtonProps {
  title?: string;
  titleTranslationKey?: string;
  hideSingleValues?: boolean;
  className?: string;
  filterHandle: string;
  onClear?: () => void;
  getCount?: (filter: any) => number;
  DisplayName?: React.ComponentType<{ id: string }>;
}

const FilterButton = React.forwardRef<HTMLButtonElement, FilterButtonProps>(
  (
    {
      title,
      titleTranslationKey = 'phrases.unknown',
      hideSingleValues,
      className,
      filterHandle,
      onClear,
      getCount,
      DisplayName = ({ id }) => <>{id}</>,
      ...props
    },
    ref
  ) => {
    const currentFilterContext = useContext(FilterContext);
    const { defaultCount, hasNegations, mixed, isNull, isNotNull, firstValue } = getFilterSummary(
      currentFilterContext.filter,
      filterHandle
    );
    const count = getCount ? getCount(currentFilterContext.filter) : defaultCount;

    // first get number of filters applied. Using getcount if it is defined, otherwise use the filterHandle

    const handleClear = () => {
      if (typeof onClear === 'function') onClear();
      currentFilterContext.setFullField(filterHandle, [], []);
    };

    if (count === 0)
      return (
        <InactiveFilterButton {...props} titleTranslationKey={titleTranslationKey} ref={ref} />
      );

    const showFirstValue = count === 1 && !isNull && !isNotNull && !hideSingleValues;

    return (
      <ActiveFilterButton className={className} ref={ref} handleClear={handleClear} {...props}>
        <span className="g-overflow-ellipsis g-overflow-hidden">
          {showFirstValue && (
            <>
              <DisplayName id={firstValue} />
            </>
          )}
          {count >= 1 && !showFirstValue && (
            <>
              {
                <FormattedMessage
                  id={titleTranslationKey}
                  defaultMessage={titleTranslationKey || 'Unknown'}
                />
              }
              : {count}
            </>
          )}
        </span>
      </ActiveFilterButton>
    );
  }
);

interface InactiveFilterButtonProps {
  className?: string;
  titleTranslationKey: string;
}

interface ActiveFilterButtonProps {
  className?: string;
  handleClear?: () => void;
  children?: React.ReactNode;
}

const InactiveFilterButton = React.forwardRef<HTMLButtonElement, InactiveFilterButtonProps>(
  ({ className, titleTranslationKey, ...props }, ref) => {
    return (
      <Button
        {...props}
        ref={ref}
        variant="outline"
        role="combobox"
        className={cn('g-my-2 g-mx-1 g-border-primary-500')}
        style={{ justifyContent: 'space-between' }}
      >
        <FormattedMessage
          id={titleTranslationKey}
          defaultMessage={titleTranslationKey || 'Unknown'}
        />
      </Button>
    );
  }
);

const ActiveFilterButton = React.forwardRef<HTMLButtonElement, ActiveFilterButtonProps>(
  ({ className, handleClear, children, ...props }, ref: React.Ref<HTMLButtonElement>) => {
    return (
      <div className={cn('g-inline-flex g-rounded-md g-shadow-sm" role="group', className)}>
        <Button
          ref={ref}
          type="button"
          className="g-overflow-hidden g-whitespace-nowrap g-flex-auto g-rounded-e-none g-rounded-s"
          {...props}
        >
          <span className="g-overflow-ellipsis g-overflow-hidden">{children}</span>
        </Button>
        <Button
          onClick={handleClear}
          type="button"
          aria-label="Clear filter"
          className="g-rounded-s-none g-rounded-e g-px-2"
        >
          <span>
            <MdClose />
          </span>
        </Button>
      </div>
    );
  }
);
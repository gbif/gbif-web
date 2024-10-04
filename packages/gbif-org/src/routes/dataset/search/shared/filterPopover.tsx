import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { FilterContext, FilterProvider, FilterType } from '@/contexts/filter';
import { cn } from '@/utils/shadcn';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useUncontrolledProp } from 'uncontrollable';
import { MdClose } from 'react-icons/md';

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

export const FilterButton = React.forwardRef<HTMLButtonElement, FilterButtonProps>(
  (
    {
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
        <InactiveFilterButton
          {...props}
          className={className}
          titleTranslationKey={titleTranslationKey}
          ref={ref}
        />
      );

    const showFirstValue = count === 1 && !isNull && !isNotNull && !hideSingleValues;

    return (
      <ActiveFilterButton className={className} ref={ref} handleClear={handleClear} {...props}>
        <span className={`g-overflow-ellipsis g-flex g-items-center g-w-full`}>
          <span className="g-flex-auto g-text-start">
            <FormattedMessage
              id={titleTranslationKey}
              defaultMessage={titleTranslationKey || 'Unknown'}
            />
          </span>
          {showFirstValue && (
            <span className="g-flex-auto g-text-start g-overflow-ellipsis g-overflow-hidden">
              <span className="g-mx-1">:</span>
              <DisplayName id={firstValue} />
            </span>
          )}
          {count >= 1 && !showFirstValue && (
            <>
              <span className="g-ms-2 -g-me-2 g-p-1 g-px-2 g-rounded-lg g-bg-slate-950/20 g-flex-none">
                {count}
              </span>
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
        variant="primaryOutline"
        role="combobox"
        className={cn('g-justify-between', className)}
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
          className="g-overflow-hidden g-whitespace-nowrap g-flex-auto g-rounded-e-none g-rounded-s g-justify-between"
          {...props}
        >
          <span className="g-overflow-ellipsis g-w-full">{children}</span>
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

export function FilterPopover({
  open,
  setOpen,
  children,
  trigger,
}: {
  open?: boolean;
  setOpen?: (b: boolean) => void;
  children: React.ReactElement<
    {
      onApply?: ({ keepOpen }: { keepOpen?: boolean }) => void;
      onCancel: () => void;
      pristine: boolean;
    } & React.RefAttributes<HTMLDivElement>
  >;
  trigger: React.ReactNode;
}) {
  const [controlledOpen, setControlledOpen] = useUncontrolledProp(open, false, setOpen);
  const focusRef = useRef<HTMLDivElement>(null);
  const currentFilterContext = useContext(FilterContext);
  const [tmpFilter, setFilter] = useState(currentFilterContext.filter);
  const [pristine, setPristine] = useState(true);
  const child = React.Children.only(children);

  useEffect(() => {
    setFilter(currentFilterContext.filter);
    setPristine(true);
  }, [currentFilterContext.filterHash]);

  const onApply = useCallback(
    ({ keepOpen }: { keepOpen?: boolean } = {}) => {
      currentFilterContext.setFilter(tmpFilter);
      if (!keepOpen) setControlledOpen(false);
      setPristine(true);
    },
    [tmpFilter, currentFilterContext, setControlledOpen]
  );

  const onCancel = useCallback(() => {
    setFilter(currentFilterContext.filter);
    setControlledOpen(false);
    setPristine(true);
  }, [currentFilterContext.filterHash, setControlledOpen]);

  const onFilterChange = useCallback((filter: FilterType) => {
    setFilter(filter);
    setPristine(false);
  }, []);

  return (
    <Popover open={controlledOpen} onOpenChange={setControlledOpen}>
      <PopoverTrigger asChild>{trigger ?? <span>test</span>}</PopoverTrigger>
      <PopoverContent
        onPointerDownOutside={() => onApply({keepOpen: false})}
        onOpenAutoFocus={(event) => {
          if (focusRef?.current) {
            event.preventDefault();
            focusRef?.current?.focus();
          }
        }}
        onEscapeKeyDown={onCancel}
        align="start"
        className="g-flex g-flex-col g-p-0 g-w-96 g-max-w-[var(--radix-popper-available-width)] g-shadow-[0_10px_600px_-12px_rgba(0,0,0,0.2)]"
      >
        <FilterProvider filter={tmpFilter} onChange={onFilterChange}>
          {React.isValidElement(child) &&
            React.cloneElement(child, {
              onApply,
              onCancel,
              pristine,
              ref: focusRef,
            })}
        </FilterProvider>
      </PopoverContent>
    </Popover>
  );
}

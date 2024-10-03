import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { FilterContext, FilterProvider, FilterType } from '@/contexts/filter';
import { cn } from '@/utils/shadcn';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useUncontrolledProp } from 'uncontrollable';
import { MdClose } from 'react-icons/md';
import { set } from 'lodash';

function FilterApplyContent({
  children,
  setOpen,
  ...props
}: {
  children: React.ReactElement<
    {
      onApply?: ({ keepOpen }: { keepOpen?: boolean }) => void;
      onCancel: () => void;
    } & React.RefAttributes<HTMLDivElement>
  >;
  setOpen: (b: boolean) => void;
}) {
  const focusRef = useRef<HTMLDivElement>(null);
  const currentFilterContext = useContext(FilterContext);
  const [tmpFilter, setFilter] = useState(currentFilterContext.filter);
  const [unTouched, setUnTouched] = useState(true);
  const child = React.Children.only(children);

  useEffect(() => {
    setFilter(currentFilterContext.filter);
    setUnTouched(true);
  }, [currentFilterContext.filterHash]);

  const onApply = useCallback(() => {
    currentFilterContext.setFilter(tmpFilter);
    setOpen(false);
    setUnTouched(true);
  }, [tmpFilter, currentFilterContext, setOpen]);

  const onCancel = useCallback(() => {
    setFilter(currentFilterContext.filter);
    setOpen(false);
    setUnTouched(true);
  }, [currentFilterContext.filterHash, setOpen]);

  const onFilterChange = useCallback((filter: FilterType) => {
    setFilter(filter);
    setUnTouched(false);
  }, []);

  return (
    <FilterProvider filter={tmpFilter} onChange={onFilterChange}>
      <PopoverContent
        onPointerDownOutside={onApply}
        onOpenAutoFocus={(event) => {
          if (focusRef?.current) {
            event.preventDefault();
            focusRef?.current?.focus();
          }
        }}
        onEscapeKeyDown={onCancel}
        align="start"
        className="g-flex g-flex-col g-p-0 g-w-96 g-max-w-[var(--radix-popper-available-width)] g-shadow-[0_10px_600px_-12px_rgba(0,0,0,0.2)]"
        // style={{ boxShadow: '0 0 10000px 10000px rgba(0, 0, 0, 0.25)' }}
      >
        <>
          {/* <h3 className="g-px-4 g-py-2 g-font-bold g-text-sm g-border-b">
            {<FormattedMessage id={titleTranslationKey} />}
          </h3> */}
          {React.isValidElement(child) &&
            React.cloneElement(child, {
              onApply,
              onCancel,
              ref: focusRef as React.Ref<HTMLDivElement>,
            })}
          {!unTouched && (
            <div className="g-py-2 g-px-2 g-flex g-justify-between g-border-t">
              <Button size="sm" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={onApply}>
                Apply
              </Button>
            </div>
          )}
        </>
      </PopoverContent>
    </FilterProvider>
  );
}

export function FilterPopover({
  open,
  setOpen,
  children,
  trigger,
}: {
  open?: boolean;
  setOpen?: (b: boolean) => void;
  filterHandle: string;
  DisplayName: React.ComponentType<{ id: string }>;
  children: React.ReactNode;
  trigger: React.ReactNode;
  titleTranslationKey: string;
}) {
  const [controlledOpen, setControlledOpen] = useUncontrolledProp(open, false, setOpen);
  return (
    <Popover open={controlledOpen} onOpenChange={setControlledOpen}>
      <PopoverTrigger asChild>{trigger ?? <span>test</span>}</PopoverTrigger>
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

export function FilterApplyPopover({
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
      unTouched: boolean;
    } & React.RefAttributes<HTMLDivElement>
  >;
  trigger: React.ReactNode;
}) {
  const [controlledOpen, setControlledOpen] = useUncontrolledProp(open, false, setOpen);
  const focusRef = useRef<HTMLDivElement>(null);
  const currentFilterContext = useContext(FilterContext);
  const [tmpFilter, setFilter] = useState(currentFilterContext.filter);
  const [unTouched, setUnTouched] = useState(true);
  const child = React.Children.only(children);

  useEffect(() => {
    setFilter(currentFilterContext.filter);
    setUnTouched(true);
  }, [currentFilterContext.filterHash]);

  const onApply = useCallback(
    ({ keepOpen }: { keepOpen?: boolean }) => {
      currentFilterContext.setFilter(tmpFilter);
      if (!keepOpen) setControlledOpen(false);
      setUnTouched(true);
    },
    [tmpFilter, currentFilterContext, setControlledOpen]
  );

  const onCancel = useCallback(() => {
    setFilter(currentFilterContext.filter);
    setControlledOpen(false);
    setUnTouched(true);
  }, [currentFilterContext.filterHash, setControlledOpen]);

  const onFilterChange = useCallback((filter: FilterType) => {
    setFilter(filter);
    setUnTouched(false);
  }, []);

  return (
    <Popover open={controlledOpen} onOpenChange={setControlledOpen}>
      <PopoverTrigger asChild>{trigger ?? <span>test</span>}</PopoverTrigger>
      <PopoverContent
        onPointerDownOutside={onApply}
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
              unTouched,
              ref: focusRef,
            })}
        </FilterProvider>
      </PopoverContent>
    </Popover>
  );
}

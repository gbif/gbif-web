import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { FilterContext, FilterType } from '@/contexts/filter';
import { cn } from '@/utils/shadcn';
import { Button } from '@/components/ui/button';
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
  getCount?: (filter: unknown) => number;
  DisplayName?: React.ComponentType<{ id: string | number | object }>;
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
    const { defaultCount, isNull, isNotNull, firstValue } = getFilterSummary(
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

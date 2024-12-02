import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { FilterContext } from '@/contexts/filter';
import { cn } from '@/utils/shadcn';
import { Button } from '@/components/ui/button';
import { MdClose } from 'react-icons/md';
import { getFilterSummary } from './filterTools';

interface FilterButtonProps {
  title?: string;
  titleTranslationKey?: string;
  hideSingleValues?: boolean;
  className?: string;
  filterHandle: string;
  onClear?: () => void;
  getCount?: (filter: unknown) => number;
  displayName?: React.ComponentType<{ id: string | number | object }>;
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
      displayName: DisplayName = ({ id }) => <>{id}</>,
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

    const showFirstValue = count === 1 && !isNull && !isNotNull && !hideSingleValues && !mixed;

    return (
      <ActiveFilterButton className={className} ref={ref} handleClear={handleClear} {...props}>
        <span className={`g-overflow-ellipsis g-flex g-items-center`}>
          <span className="g-flex-auto g-text-start">
            {hasNegations && !mixed && (<span className="g-me-2 g-pe-2 g-border-e g-border-e-primary-700"><FormattedMessage id="filterSupport.exclude" /></span>)}
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
              <span className="g-ms-2 -g-me-2 g-px-2 g-rounded-lg g-bg-slate-950/20 g-flex-none">
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

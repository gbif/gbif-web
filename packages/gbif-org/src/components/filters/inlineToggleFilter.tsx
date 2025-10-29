import { FilterContext } from '@/contexts/filter';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/utils/shadcn';
import { useContext } from 'react';
import { FormattedMessage } from 'react-intl';

export function InlineToggleFilter({
  className,
  filterHandle,
  options,
}: {
  className?: string;
  filterHandle: string;
  options: Array<{ value: string; labelKey: string }>;
}) {
  const { filter, setField } = useContext(FilterContext);

  // First option is always the default
  const defaultVal = options[0]?.value || '';
  const currentValue = filter.must?.[filterHandle]?.[0] || defaultVal;

  return (
    <ToggleGroup
      type="single"
      value={currentValue}
      onValueChange={(value) => setField(filterHandle, [value])}
      className={cn('g-mx-1 g-mb-1 g-h-8 g-overflow-hidden', className)}
      variant="primary"
    >
      {options.map((option, index) => {
        const isLast = index === options.length - 1;
        const isFirst = index === 0;

        return (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            variant="primary"
            className={cn(
              'g-h-8 g-py-0 g-flex g-items-center g-justify-center g-px-3 !g-border-0',
              {
                'g-border-r g-border-r-solid g-border-r-primary-500 data-[state=on]:g-border-r-primary-600':
                  !isLast,
              },
              { 'g-rounded-none': isFirst || isLast }
            )}
          >
            <FormattedMessage id={option.labelKey} defaultMessage={option.value} />
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
}

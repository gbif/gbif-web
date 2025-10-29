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
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          variant="primary"
          className="g-h-8 g-py-0 g-px-3 g-flex g-items-center g-justify-center g-border-0 data-[state=off]:g-text-slate-600 g-ring-inset g-rounded-none"
        >
          <FormattedMessage id={option.labelKey} defaultMessage={option.value} />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/utils/shadcn';
import React from 'react';
import { MdClear } from 'react-icons/md';

export interface FilterOption {
  key: string;
  label: React.ReactNode;
}

interface FilterButtonGroupProps {
  options: FilterOption[];
  selectedValue: string | null;
  onSelect: (value: string | null) => void;
  allLabel?: React.ReactNode;
  clearLabel?: React.ReactNode;
  activeProps?: Partial<ButtonProps>;
  inactiveProps?: Partial<ButtonProps>;
  clearProps?: Partial<ButtonProps>;
  className?: string;
}

export function FilterButtonGroup({
  className,
  options,
  selectedValue,
  onSelect,
  allLabel,
  clearLabel,
  activeProps = { variant: 'default' },
  inactiveProps = { variant: 'primaryOutline' },
  clearProps = { variant: 'destructiveSecondary' },
}: FilterButtonGroupProps) {
  return (
    <div className={cn('g-flex g-flex-wrap g-gap-2', className)}>
      <Button
        {...(selectedValue === null ? activeProps : inactiveProps)}
        onClick={() => onSelect(null)}
      >
        {allLabel}
      </Button>
      {options.map((option) => (
        <Button
          key={option.key}
          onClick={() => onSelect(option.key)}
          {...(selectedValue === option.key ? activeProps : inactiveProps)}
        >
          {option.label}
        </Button>
      ))}
      {selectedValue && (
        <Button onClick={() => onSelect(null)} {...clearProps}>
          <MdClear className="g-h-4 g-w-4 g-me-1" />
          {clearLabel}
        </Button>
      )}
    </div>
  );
}

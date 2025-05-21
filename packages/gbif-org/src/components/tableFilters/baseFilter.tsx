import { cn } from '@/utils/shadcn';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Separator } from '../ui/separator';
import { Option } from './types';

interface Props {
  name: string;
  selectedOptions: Option[];
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function BaseFilter({ name, children, selectedOptions, isOpen, setIsOpen }: Props) {
  return (
    <Popover key={name} onOpenChange={setIsOpen} modal open={isOpen}>
      <PopoverTrigger
        className={cn('g-border g-border-solid g-py-1 g-px-2 ', {
          'g-border-primary g-text-primary': selectedOptions.length === 0,
          'g-bg-primary g-text-primary-foreground': selectedOptions.length > 0,
        })}
      >
        {selectedOptions.length === 0
          ? name
          : selectedOptions.length === 1
          ? `${name}: ${selectedOptions[0].label}`
          : `${name}: ${selectedOptions.length}`}
      </PopoverTrigger>
      <PopoverContent className="g-p-0">
        <div className="g-p-4">{name}</div>
        <Separator />
        <div className="g-p-4">{children}</div>
      </PopoverContent>
    </Popover>
  );
}

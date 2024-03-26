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
        className={cn('border py-1 px-2 ', {
          'border-primary text-primary': selectedOptions.length === 0,
          'bg-primary text-primary-foreground': selectedOptions.length > 0,
        })}
      >
        {selectedOptions.length === 0
          ? name
          : selectedOptions.length === 1
          ? `${name}: ${selectedOptions[0].label}`
          : `${name}: ${selectedOptions.length}`}
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <div className="p-4">{name}</div>
        <Separator />
        <div className="p-4">{children}</div>
      </PopoverContent>
    </Popover>
  );
}

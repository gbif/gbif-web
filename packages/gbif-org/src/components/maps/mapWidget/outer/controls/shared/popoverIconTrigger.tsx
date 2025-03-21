import { Button } from '@/components/ui/button';
import { PopoverTrigger } from '@/components/ui/popover';
import type { IconType } from 'react-icons';

type Props = {
  icon: IconType;
};

export function PopoverIconTrigger({ icon: Icon }: Props) {
  return (
    <PopoverTrigger asChild>
      <Button
        size="icon"
        variant="outline"
        className="g-h-8 g-w-8 g-border-gray-200 g-text-gray-500 hover:g-text-gray-600 hover:g-border-gray-300"
      >
        <Icon size={18} />
      </Button>
    </PopoverTrigger>
  );
}

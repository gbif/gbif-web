import {
  MdInfoOutline,
} from 'react-icons/md';
import { cn } from '@/utils/shadcn';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export function AboutButton({className, children}: {className?: string, children?: React.ReactNode}) {
  return (
    <Popover>
      <SimpleTooltip delayDuration={300} title="About this filter" side="top">
        <PopoverTrigger>
          <MdInfoOutline className={cn("", className)} />
        </PopoverTrigger>
      </SimpleTooltip>
      <PopoverContent className='g-w-96'>
        {children}
      </PopoverContent>
    </Popover>
  );
}

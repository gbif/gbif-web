import { MdInfoOutline } from 'react-icons/md';
import { cn } from '@/utils/shadcn';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export function AboutButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <span>
          <SimpleTooltip delayDuration={300} title="About this filter" side="top" asChild>
            <span>
              <MdInfoOutline className={cn('', className)} />
            </span>
          </SimpleTooltip>
        </span>
      </PopoverTrigger>
      <PopoverContent className="g-w-96">{children}</PopoverContent>
    </Popover>
  );
}

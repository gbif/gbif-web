import { SimpleTooltip } from '@/components/simpleTooltip';
import { cn } from '@/utils/shadcn';
import { MdInfoOutline } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
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
          <SimpleTooltip
            delayDuration={300}
            title={<FormattedMessage id="filterSupport.aboutThisFilter" />}
            side="top"
            asChild
          >
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

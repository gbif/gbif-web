import { SimpleTooltip } from '@/components/simpleTooltip';
import { cn } from '@/utils/shadcn';
import { MdInfoOutline } from 'react-icons/md';
import { useIntl } from 'react-intl';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export const iconButtonClass =
  'g-inline-flex g-items-center g-justify-center g-min-w-11 g-min-h-11 sm:g-min-w-7 sm:g-min-h-7 g-text-xl sm:g-text-base g-rounded hover:g-bg-slate-100';

export function AboutButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { formatMessage } = useIntl();
  const aboutLabel = formatMessage({ id: 'filterSupport.aboutThisFilter' });
  return (
    <Popover>
      <PopoverTrigger aria-label={aboutLabel} className={cn(iconButtonClass, className)}>
        <SimpleTooltip delayDuration={300} title={aboutLabel} side="top" asChild>
          <span>
            <MdInfoOutline className={cn('', className)} />
          </span>
        </SimpleTooltip>
      </PopoverTrigger>
      <PopoverContent className="g-w-96">{children}</PopoverContent>
    </Popover>
  );
}

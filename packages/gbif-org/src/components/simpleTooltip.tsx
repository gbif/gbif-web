import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export function SimpleTooltip({
  title,
  delayDuration = 0,
  children,
  side,
}: {
  title: React.ReactNode;
  delayDuration?: number;
  children: React.ReactNode;
  side: 'top' | 'right' | 'bottom' | 'left';
}) {
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger tabIndex={-1} asChild>{children}</TooltipTrigger>
      <TooltipContent className='g-max-w-96 g-pointer-events-none' side={side}>{title}</TooltipContent>
    </Tooltip>
  );
}

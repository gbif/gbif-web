import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export function SimpleTooltip({
  title,
  children,
  side,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent side={side}>{title}</TooltipContent>
    </Tooltip>
  );
}

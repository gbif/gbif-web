import { FormattedMessage } from 'react-intl';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { TooltipContentProps } from '@radix-ui/react-tooltip';

type Props = {
  title: React.ReactNode;
  delayDuration?: number;
  children: React.ReactNode;
  disableHoverableContent?: boolean;
  side?: TooltipContentProps['side'];
};

export function SimpleTooltip({ title, delayDuration = 0, children, side, disableHoverableContent }: Props) {
  return (
    <Tooltip delayDuration={delayDuration} disableHoverableContent={disableHoverableContent}>
      <TooltipTrigger tabIndex={-1} asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent className="g-max-w-96 g-pointer-events-none g-z-50" side={side}>
        {typeof title !== 'string' ? title : <FormattedMessage id={title} />}
      </TooltipContent>
    </Tooltip>
  );
}

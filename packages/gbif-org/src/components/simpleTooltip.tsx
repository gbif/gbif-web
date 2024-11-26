import { FormattedMessage } from 'react-intl';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { TooltipContentProps } from '@radix-ui/react-tooltip';

type Props = {
  title?: React.ReactNode;
  i18nKey?: string;
  delayDuration?: number;
  children: React.ReactNode;
  disableHoverableContent?: boolean;
  side?: TooltipContentProps['side'];
};

export function SimpleTooltip({
  title,
  delayDuration = 0,
  children,
  side,
  disableHoverableContent,
  i18nKey,
}: Props) {
  return (
    <Tooltip delayDuration={delayDuration} disableHoverableContent={disableHoverableContent}>
      <TooltipTrigger className="g-pointer-events-auto" tabIndex={-1} asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent className="g-max-w-96 g-pointer-events-none g-z-30" side={side}>
        {i18nKey ? <FormattedMessage id={i18nKey} /> : title}
      </TooltipContent>
    </Tooltip>
  );
}

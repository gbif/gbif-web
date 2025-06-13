import { TooltipContentProps } from '@radix-ui/react-tooltip';
import { FormattedMessage } from 'react-intl';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type Props = {
  title?: React.ReactNode;
  i18nKey?: string;
  i18nDefaultMessage?: string;
  delayDuration?: number;
  children: React.ReactNode;
  disableHoverableContent?: boolean;
  side?: TooltipContentProps['side'];
  asChild?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function SimpleTooltip({
  title,
  delayDuration = 0,
  children,
  side,
  disableHoverableContent,
  i18nKey,
  i18nDefaultMessage,
  asChild,
  open,
  onOpenChange,
}: Props) {
  return (
    <TooltipProvider>
      <Tooltip
        open={open}
        onOpenChange={onOpenChange}
        delayDuration={delayDuration}
        disableHoverableContent={disableHoverableContent}
      >
        <TooltipTrigger className="g-pointer-events-auto" tabIndex={-1} asChild={asChild}>
          {children}
        </TooltipTrigger>
        <TooltipContent className="g-max-w-96 g-pointer-events-none g-z-30" side={side}>
          {i18nKey ? <FormattedMessage id={i18nKey} defaultMessage={i18nDefaultMessage} /> : title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

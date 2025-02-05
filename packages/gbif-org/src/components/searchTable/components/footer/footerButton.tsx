import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Props = {
  onClick: () => void;
  icon: React.ReactNode;
  toolTip: React.ReactNode;
  disable: boolean;
};

export function FooterButton({ icon, toolTip, onClick, disable }: Props) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            disabled={disable}
            onClick={onClick}
            variant="ghost"
            className="g-h-8 g-w-8 g-p-0"
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{toolTip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

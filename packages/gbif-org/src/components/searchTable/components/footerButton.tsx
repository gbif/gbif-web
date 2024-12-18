import { Button } from '../../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';

type Props = {
  onClick: () => void;
  icon: React.ReactNode;
  toolTip: React.ReactNode;
};

export function FooterButton({ icon, toolTip, onClick }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button onClick={onClick} variant="ghost" className="g-h-8 g-w-8 g-p-0">
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{toolTip}</TooltipContent>
    </Tooltip>
  );
}

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/shadcn';
import { MdClose } from 'react-icons/md';

export function FilterButton({
  onClear,
  onOpen,
  children,
  selectedLabel, // a react object or a string
  isInputHidden,
  className,
}: {
  onClear: () => void;
  onOpen: () => void;
  selectedLabel: string | React.ReactNode;
  className?: string;
  isInputHidden: boolean;
  children: React.ReactNode;
}) {
  if (!isInputHidden) {
    return children;
  }
  return (
    <div className={cn('g-inline-block g-items-center g-me-2', className)}>
      <div className="g-inline-flex g-rounded-md g-shadow-sm" role="group">
        <Button onClick={onOpen} type="button" className="g-flex-auto g-rounded-e-none g-rounded-s">
          {selectedLabel}
        </Button>
        <Button onClick={onClear} type="button" className="g-rounded-s-none g-rounded-e g-px-2">
          <span>
            <MdClose />
          </span>
        </Button>
      </div>
    </div>
  );
}
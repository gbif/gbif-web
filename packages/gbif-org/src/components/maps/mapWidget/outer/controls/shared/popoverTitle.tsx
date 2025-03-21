import { PopoverClose } from '@radix-ui/react-popover';
import { MdClose } from 'react-icons/md';

type Props = { children: React.ReactElement };

export function PopoverTitle({ children }: Props) {
  return (
    <div className="g-flex g-flex-nowrap g-items-center g-border-b g-p-2 g-px-4">
      <h3 className="g-flex-auto g-text-slate-800 g-text-sm g-font-semibold">{children}</h3>
      <PopoverClose asChild className="g-cursor-pointer">
        <MdClose size={18} />
      </PopoverClose>
    </div>
  );
}

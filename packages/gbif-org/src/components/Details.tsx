import { cn } from '@/utils/shadcn';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import { useUncontrolledProp } from 'uncontrollable';

export function Details({
  summary,
  summaryClassName,
  iconClassName,
  className,
  open,
  onToggle,
  children,
  ...props
}: {
  summary: React.ReactNode;
  summaryClassName?: string;
  iconClassName?: string;
  className?: string;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  const [controlledValue, onControlledChange] = useUncontrolledProp(
    open,
    false,
    onToggle
  );
  
  return <details className={cn('', className)} {...props} open={controlledValue} >
    <summary className={cn('py-2 list-none flex flex-nowrap items-start', summaryClassName)}
      onClick={e => {
        if (e.target.href) return;
        e.preventDefault();
        onControlledChange(!controlledValue);
      }}>
        <div className="flex-auto">{summary}</div>
        <div className={cn(`flex-none text-slate-500 ${open ? '' : ''}`, iconClassName)}>{controlledValue ? <MdArrowDropUp /> : <MdArrowDropDown />}</div>
      </summary>
    <div>
      {children}
    </div>
  </details>
}

Details.displayName = 'Details';
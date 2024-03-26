import { NavLink } from 'react-router-dom';
import { DynamicLink } from './DynamicLink';
import { cn } from '@/utils/shadcn';

type Props = {
  to: string;
  children: React.ReactNode;
  className?: string;
};

export function TabLink({ to, children, className }: Props) {
  return (
    <DynamicLink
      end
      to={to}
      as={NavLink}
      className={({ isActive }) =>
        cn('flex leading-6 font-normal pt-3 pb-2.5 border-b-2 px-3', {
          'text-primary-500 border-current': isActive,
          'text-slate-900 border-transparent hover:border-slate-300 dark:text-slate-200 dark:hover:border-slate-700':
            !isActive,
          className,
        })
      }
    >
      {children}
    </DynamicLink>
  );
}

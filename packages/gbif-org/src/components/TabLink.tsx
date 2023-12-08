import { NavLink } from 'react-router-dom';
import { DynamicLink } from './DynamicLink';
import { cn } from '@/utils/shadcn';

type Props = {
  to: string;
  children: React.ReactNode;
};

export function TabLink({ to, children }: Props) {
  return (
    <DynamicLink
      end
      to={to}
      as={NavLink}
      className={({ isActive }) =>
        cn('flex text-sm leading-6 font-semibold pt-3 pb-2.5 border-b-2 -mb-px', {
          'text-sky-500 border-current': isActive,
          'text-slate-900 border-transparent hover:border-slate-300 dark:text-slate-200 dark:hover:border-slate-700':
            !isActive,
        })
      }
    >
      {children}
    </DynamicLink>
  );
}

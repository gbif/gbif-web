import { NavLink } from 'react-router-dom';
import { DynamicLink } from './dynamicLink';
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
        cn('g-flex g-leading-6 g-font-normal g-pt-3 g-pb-2.5 g-border-b-2 g-px-3', {
          'g-text-primary-500 g-border-current': isActive,
          'g-text-slate-900 g-border-transparent hover:g-border-slate-300 dark:g-text-slate-200 dark:hover:g-border-slate-700':
            !isActive
        }, className)
      }
    >
      {children}
    </DynamicLink>
  );
}

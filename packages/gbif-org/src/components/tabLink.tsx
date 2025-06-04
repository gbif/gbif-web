import { DynamicLink } from '@/reactRouterPlugins';
import { cn } from '@/utils/shadcn';
import { NavLink, To } from 'react-router-dom';

type Props = {
  to: To;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  autoDetectActive?: boolean;
};

// The "auto detection" is just react-router-dom's NavLink's isActive prop
// It does not work with search params. All tabs would just be active.
// Therefore we make the "auto detection" optional.

export function TabLink({ to, children, className, isActive, autoDetectActive }: Props) {
  const classNames = (isActive: boolean) =>
    cn(
      'g-flex g-leading-6 g-font-normal g-pt-3 g-pb-2.5 g-border-solid g-border-b-2 g-px-3',
      isActive
        ? 'g-text-primary-500 g-border-current hover:g-text-primary-500 hover:g-border-current'
        : 'g-text-slate-900 g-border-transparent hover:g-border-slate-300 dark:g-text-slate-200 dark:hover:g-border-slate-700',
      className
    );

  if (autoDetectActive)
    return (
      <DynamicLink
        to={to}
        end
        as={NavLink}
        preventScrollReset
        className={(navLinkProps) => classNames(isActive || navLinkProps.isActive)}
      >
        {children}
      </DynamicLink>
    );

  return (
    <DynamicLink preventScrollReset to={to} className={classNames(isActive ?? false)}>
      {children}
    </DynamicLink>
  );
}

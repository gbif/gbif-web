import { DynamicLink } from '@/reactRouterPlugins';
import { cn } from '@/utils/shadcn';
import { IconType } from 'react-icons';

type Props = {
  icon: IconType;
  iconSize?: number;
  url: string;
  className?: string;
  children: React.ReactNode;
};

export function BaseHeaderActionLink({
  icon: Icon,
  iconSize = 16,
  url,
  children,
  className,
}: Props) {
  return (
    <DynamicLink
      className={cn(
        'g-text-sm g-inline-flex g-items-center g-cursor-pointer hover:g-underline g-text-inherit',
        className
      )}
      to={url}
    >
      <Icon size={iconSize} />
      <span className="g-ml-1">{children}</span>
    </DynamicLink>
  );
}

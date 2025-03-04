import { DynamicLink } from '@/reactRouterPlugins';
import { IconType } from 'react-icons';

type Props = {
  icon: IconType;
  iconSize?: number;
  url: string;
  children: React.ReactNode;
};

export function BaseHeaderActionLink({ icon: Icon, iconSize = 16, url, children }: Props) {
  return (
    <DynamicLink
      className="g-text-sm g-inline-flex g-items-center g-cursor-pointer hover:g-underline g-text-inherit"
      to={url}
    >
      <Icon size={iconSize} />
      <span className="g-ml-1">{children}</span>
    </DynamicLink>
  );
}

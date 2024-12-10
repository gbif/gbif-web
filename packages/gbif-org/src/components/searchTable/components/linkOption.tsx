import { DynamicLink } from '@/reactRouterPlugins';
import { MdLink } from 'react-icons/md';

type Props = {
  to: string;
  children: React.ReactNode;
};

export function LinkOption({ to, children }: Props) {
  return (
    <div>
      <DynamicLink to={to} className="g-pointer-events-auto">
        <span className="g-pr-1">
          <MdLink />
        </span>
      </DynamicLink>
      {children}
    </div>
  );
}

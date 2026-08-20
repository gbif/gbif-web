import { DynamicLink } from '@/reactRouterPlugins';
import { MdLink } from 'react-icons/md';

type Props = {
  to: string;
  pageId: string;
  variables?: Record<string, any>;
  children: React.ReactNode;
};

export function LinkOption({ to, pageId, variables, children }: Props) {
  return (
    <div>
      <DynamicLink
        to={to}
        pageId={pageId}
        variables={variables}
        className="g-pointer-events-auto hover:g-text-primary-500 hover:g-underline"
      >
        <span className="g-pe-1">
          <MdLink />
        </span>
      </DynamicLink>
      {children}
    </div>
  );
}

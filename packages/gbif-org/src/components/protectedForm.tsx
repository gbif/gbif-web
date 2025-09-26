import { useUser } from '@/contexts/UserContext';
import { cn } from '@/utils/shadcn';
import { Button } from './ui/button';
import { DynamicLink } from '@/reactRouterPlugins';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
  className?: string;
  title: React.ReactNode;
  message: React.ReactNode;
};

export function ProtectedForm({ children, className, title, message }: Props) {
  const { isLoggedIn } = useUser();
  const { pathname, search } = useLocation();
  if (isLoggedIn) return children;

  return (
    <div
      className={cn(
        'g-bg-gray-50 g-py-28 g-px-2 g-flex g-flex-col g-items-center g-shadow-sm',
        className
      )}
    >
      <h3 className="g-font-medium g-text-xl g-text-center">{title}</h3>

      <p className="g-text-sm g-pt-1 g-text-center">{message}</p>

      <div className="g-pt-12 g-flex g-flex-col">
        <Button asChild className="g-min-w-64 g-mb-2">
          <DynamicLink pageId="user-login" searchParams={{ returnUrl: `${pathname}${search}` }}>
            <FormattedMessage id="profile.signIn" />
          </DynamicLink>
        </Button>

        <div className="g-text-center g-text-sm g-text-gray-500">
          <FormattedMessage id="profile.dontHaveAccount" />{' '}
          <DynamicLink
            to="/user/register"
            className="g-font-medium g-text-primary-700 hover:g-text-primary-600"
          >
            <FormattedMessage id="profile.registerNow" />
          </DynamicLink>
        </div>
      </div>
    </div>
  );
}

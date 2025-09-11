import { useUser } from '@/contexts/UserContext';
import { cn } from '@/utils/shadcn';
import { Button } from './ui/button';
import { DynamicLink } from '@/reactRouterPlugins';
import { FormattedMessage } from 'react-intl';

type Props = {
  children: React.ReactNode;
  className?: string;
  title: React.ReactNode;
  message: React.ReactNode;
};

export function ProtectedForm({ children, className, title, message }: Props) {
  const { isLoggedIn } = useUser();
  if (isLoggedIn) return children;

  return (
    <div
      className={cn('g-bg-gray-50 g-py-28 g-flex g-flex-col g-items-center g-shadow-sm', className)}
    >
      <h3 className="g-font-medium g-text-xl">{title}</h3>

      <p className="g-text-sm g-pt-1">{message}</p>

      <div className="g-pt-12 g-grid g-grid-cols-2 g-gap-2 g-justify-center">
        <Button asChild>
          <DynamicLink to="/user/login">
            <FormattedMessage id="profile.loginText" />
          </DynamicLink>
        </Button>

        <Button asChild variant="outline">
          <DynamicLink to="/user/register">
            <FormattedMessage id="profile.register" />
          </DynamicLink>
        </Button>
      </div>
    </div>
  );
}

import { useUser } from '@/contexts/UserContext';
import { useI18n } from '@/reactRouterPlugins';
import { useLocation, useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = '/user/login' }: ProtectedRouteProps) {
  const { user, isLoading } = useUser();
  const { localizeLink } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  // Show loading state while checking authentication
  if (isLoading) {
    // TODO find reusable loader component and ideally move check to a data loader.
    return (
      <div className="g-flex g-items-center g-justify-center g-min-h-screen">
        <div className="g-animate-spin g-rounded-full g-h-8 g-w-8 g-border-b-2 g-border-indigo-600"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login with return URL
  if (!user) {
    // get all known routes from the react router
    const localizedRedirectTo = localizeLink(redirectTo);
    navigate(localizedRedirectTo, {
      state: { from: location.pathname },
      replace: true,
    });
    return null;
  }
  // User is authenticated, render the protected content
  return <>{children}</>;
}

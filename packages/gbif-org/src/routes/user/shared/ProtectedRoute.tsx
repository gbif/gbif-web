import { useUser } from '@/contexts/UserContext';
import { useI18n } from '@/reactRouterPlugins';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
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
    return <ArticleSkeleton />;
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

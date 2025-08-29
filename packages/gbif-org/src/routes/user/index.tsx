import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { Navigate } from 'react-router-dom';
import { ArticleSkeleton } from '../resource/key/components/articleSkeleton';
import { ConfirmPage, confirmLoader } from './confirm/confirm';
import { DerivedDatasets } from './derivedDatasets/derivedDatasets';
import { Downloads } from './downloads/downloads';
import { LoginPage, RegistrationPage } from './login/login';
import Profile from './profile/profile';
import { UserProfileLayoutWrapper } from './profile/profileLayout';
import { ProtectedRoute } from './shared/ProtectedRoute';
import { UpdateEmailPage } from './updateEmail/updateEmail';
import { UpdatePasswordPage, updatePasswordLoader } from './updatePassword/updatePassword';

export const userRoutes: RouteObjectWithPlugins[] = [
  {
    id: 'user-login',
    path: 'user/login',
    element: <LoginPage />,
  },
  {
    id: 'user-register',
    path: 'user/register',
    element: <RegistrationPage />,
  },
  {
    id: 'user-updatePassword',
    path: 'user/update-password',
    loader: updatePasswordLoader,
    loadingElement: <span>loading</span>,
    element: <UpdatePasswordPage />,
  },
  {
    id: 'user-changeEmail',
    path: 'user/change-email',
    element: (
      <ProtectedRoute>
        <UpdateEmailPage />
      </ProtectedRoute>
    ),
  },
  {
    id: 'user-confirm',
    path: 'user/confirm',
    loader: confirmLoader,
    loadingElement: <ArticleSkeleton />,
    element: <ConfirmPage />,
  },
  {
    id: 'user-profile',
    path: 'user',
    element: (
      <ProtectedRoute>
        <UserProfileLayoutWrapper />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (() => {
          return <Navigate to="profile" replace />;
        })(),
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'download',
        element: <Downloads />,
      },
      {
        path: 'derived-datasets',
        element: <DerivedDatasets />,
      },
      {
        path: 'validations',
        element: <span>validations</span>,
      },
    ],
  },
];

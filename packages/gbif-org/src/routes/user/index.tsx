import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { Navigate } from 'react-router-dom';
import { ConfirmPage, confirmLoader } from './confirm/confirm';
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
    loader: () => <span>loading</span>,
    loadingElement: <span>loading</span>,
    element: <LoginPage />,
  },
  {
    id: 'user-register',
    path: 'user/register',
    loader: () => <span>loading</span>,
    loadingElement: <span>loading</span>,
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
    loader: () => <span>loading</span>,
    loadingElement: <span>loading</span>,
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
    loadingElement: <span>loading</span>,
    element: <ConfirmPage />,
  },
  {
    id: 'user-profile',
    path: 'user',
    loader: () => <span>loading</span>,
    loadingElement: <span>loading</span>,
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
        element: <span>downloads</span>,
      },
      {
        path: 'validations',
        element: <span>validations</span>,
      },
    ],
  },
];

import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { Navigate } from 'react-router-dom';
import { LoginPage, RegistrationPage } from './login/login';
import { Profile, UserProfileLayoutWrapper } from './profile/profile';

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
    id: 'user-forgotpassword',
    path: 'user/forgotpassword',
    loader: () => <span>loading</span>,
    loadingElement: <span>loading</span>,
    element: <span>elforgot passwordement</span>,
  },
  {
    id: 'user-profile',
    path: 'user/',
    loader: () => <span>loading</span>,
    loadingElement: <span>loading</span>,
    element: <UserProfileLayoutWrapper />,
    children: [
      {
        index: true,
        element: <Navigate to="profile" replace />,
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

import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { Navigate, Outlet } from 'react-router-dom';
import { LoginPage, RegistrationPage } from './login/login';

const UserLayout = () => {
  return (
    <div>
      <header>
        <h1>User Dashboard</h1>
        {/* Render common user info like name, avatar, etc. */}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

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
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="profile" replace />,
      },
      {
        path: 'profile',
        element: <span>profile</span>,
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

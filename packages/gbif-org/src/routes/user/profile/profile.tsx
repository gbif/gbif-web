import { ClientSideOnly } from '@/components/clientSideOnly';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { CardContent as CardContentSmall, Card as SidebarCard } from '@/components/ui/smallCard';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaGithub as SocialIconGithub, FaGoogle as SocialIconGoogle } from 'react-icons/fa';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';
import { logout, whoAmI } from '../login/auth';

export const ProfileSkeleton = ArticleSkeleton;

export const Profile = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Main</CardTitle>
      </CardHeader>
    </Card>
  );
};

export function UserProfileLayoutWrapper() {
  return (
    <ClientSideOnly>
      <UserProfileLayout />
    </ClientSideOnly>
  );
}

export function UserProfileLayout() {
  const [user, setUser] = useLocalStorage('user', null);
  const navigate = useNavigate();
  useEffect(() => {
    whoAmI()
      .then((response) => {
        if (response.user) {
          setUser(response.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
      });
  }, [setUser]);

  const logoutHandler = () => {
    logout()
      .then(() => {
        setUser(null);
        // TODO: navigate to home page using react router
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
        alert('Failed to logout'); // TODO
      });
  };
  return (
    <>
      <Helmet>
        <title>Profile</title>
        {/* TODO we need much richer meta data. Especially for datasets.  */}
      </Helmet>
      <article>
        <PageContainer topPadded hasDataHeader className="g-bg-white">
          <ArticleTextContainer className="g-max-w-screen-xl ">
            <div className="g-flex g-gap-4 g-h-full g-pb-16 g-flex-row">
              <div className="g-flex-none">
                <SideBar />
              </div>
              <div className="g-flex-1">
                <Button onClick={() => logoutHandler()}>Logout</Button>
                <pre>{JSON.stringify(user, null, 2)}</pre>
                <div className="g-grid g-grid-cols-2 g-gap-3">
                  {user?.connectedAcounts?.google ? (
                    <a
                      href="/auth/google/disconnect"
                      className="g-flex g-items-center g-justify-center g-px-4 g-py-2 g-border g-border-gray-300 g-rounded-lg g-shadow-sm g-bg-white hover:g-bg-gray-50 focus:g-outline-none focus:g-ring-2 focus:g-ring-offset-2 focus:g-ring-indigo-500"
                    >
                      <SocialIconGoogle className="g-h-5 g-w-5 g-text-gray-700" />
                      <span className="g-ml-2 g-text-gray-700">Disconnect Google</span>
                    </a>
                  ) : (
                    <a
                      href="/auth/google/connect"
                      className="g-flex g-items-center g-justify-center g-px-4 g-py-2 g-border g-border-gray-300 g-rounded-lg g-shadow-sm g-bg-white hover:g-bg-gray-50 focus:g-outline-none focus:g-ring-2 focus:g-ring-offset-2 focus:g-ring-indigo-500"
                    >
                      <SocialIconGoogle className="g-h-5 g-w-5 g-text-gray-700" />
                      <span className="g-ml-2 g-text-gray-700">Connect with Google</span>
                    </a>
                  )}
                  {user?.connectedAcounts?.github ? (
                    <a
                      href="/auth/github/disconnect"
                      className="g-flex g-items-center g-justify-center g-px-4 g-py-2 g-border g-border-gray-300 g-rounded-lg g-shadow-sm g-bg-white hover:g-bg-gray-50 focus:g-outline-none focus:g-ring-2 focus:g-ring-offset-2 focus:g-ring-indigo-500"
                    >
                      <SocialIconGithub className="g-h-5 g-w-5 g-text-gray-700" />
                      <span className="g-ml-2 g-text-gray-700">Disconnect GitHub</span>
                    </a>
                  ) : (
                    <a
                      href="/auth/github/connect"
                      className="g-flex g-items-center g-justify-center g-px-4 g-py-2 g-border g-border-gray-300 g-rounded-lg g-shadow-sm g-bg-white hover:g-bg-gray-50 focus:g-outline-none focus:g-ring-2 focus:g-ring-offset-2 focus:g-ring-indigo-500"
                    >
                      <SocialIconGithub className="g-h-5 g-w-5 g-text-gray-700" />
                      <span className="g-ml-2 g-text-gray-700">Connect with GitHub</span>
                    </a>
                  )}
                </div>
                <Outlet />
              </div>
            </div>
          </ArticleTextContainer>
        </PageContainer>
      </article>
    </>
  );
}

function SideBar() {
  return (
    <SidebarCard>
      Sidebar
      <CardContentSmall>
        <ul>
          <li>
            <Link to="profile">Profile</Link>
          </li>
          <li>
            <Link to="download">Downloads</Link>
          </li>
        </ul>
      </CardContentSmall>
    </SidebarCard>
  );
}

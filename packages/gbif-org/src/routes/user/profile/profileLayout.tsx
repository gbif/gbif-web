import { ClientSideOnly } from '@/components/clientSideOnly';
import { JazzIcon } from '@/components/JazzIcon/index';
import { Tabs } from '@/components/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import { useUser } from '@/contexts/UserContext';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { Helmet } from 'react-helmet-async';
import { LuLogOut as LogOut } from 'react-icons/lu';
import { useIntl } from 'react-intl';
import { Outlet, useNavigate } from 'react-router-dom';

export const ProfileSkeleton = ArticleSkeleton;

export function UserProfileLayoutWrapper() {
  return (
    <ClientSideOnly>
      <UserProfileLayout />
    </ClientSideOnly>
  );
}

export function UserProfileLayout() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  // Tab links similar to publisher page
  const tabs = [
    {
      to: 'profile',
      children: (
        <>
          <span>{formatMessage({ id: 'profile.profile' })}</span>
        </>
      ),
    },
    {
      to: 'download',
      children: (
        <>
          <span>{formatMessage({ id: 'profile.downloads' })}</span>
        </>
      ),
    },
    {
      to: 'derived-datasets',
      children: (
        <>
          <span>{formatMessage({ id: 'profile.derivedDatasets' })}</span>
        </>
      ),
    },
    {
      to: 'validations',
      children: (
        <>
          <span>{formatMessage({ id: 'profile.validations' })}</span>
        </>
      ),
    },
  ];

  const logoutHandler = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.log(err);
      alert('Failed to logout');
    }
  };

  if (!user) {
    return <ProfileSkeleton />;
  }

  return (
    <>
      <Helmet>
        <title>Profile - GBIF</title>
      </Helmet>
      <article>
        <PageContainer topPadded hasDataHeader className="g-bg-gray-50">
          <ArticleTextContainer className="g-max-w-screen-xl">
            <div className="g-min-h-screen g-bg-gray-50">
              <div className="g-max-w-4xl g-mx-auto g-px-4 g-py-8">
                {/* Header with integrated tabs */}
                <Card className="g-mb-6">
                  <div className="g-p-6">
                    <div className="g-flex g-items-center g-justify-between">
                      <div className="g-flex g-items-center g-space-x-4">
                        <div className="g-relative">
                          {user?.photo ? (
                            <img
                              src={user.photo}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="g-w-20 g-h-20 g-object-cover g-rounded-lg"
                            />
                          ) : (
                            <JazzIcon
                              seed={user?.userName || user.email}
                              className="g-w-20 g-h-20 g-overflow-hidden g-rounded-lg g-block"
                            />
                          )}
                        </div>
                        <div className="g-flex-1">
                          <h1 className="g-text-2xl g-font-bold g-text-gray-900 g-mb-1">
                            {user.firstName && (
                              <>
                                {user.firstName} {user.lastName}
                              </>
                            )}
                            {!user.firstName && <>{user.userName}</>}
                          </h1>
                          <p className="g-text-sm g-text-gray-600 g-mb-2">{user.email}</p>
                          {/* <p className="g-text-sm g-text-gray-700 g-leading-relaxed">
                            {user.bio}
                          </p> */}
                        </div>
                      </div>
                      <div>
                        <Button
                          variant="outline"
                          onClick={logoutHandler}
                          className="g-flex g-items-center g-space-x-2"
                        >
                          <LogOut className="g-w-4 g-h-4" />
                          <span>{formatMessage({ id: 'profile.logout' })}</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Tabs integrated at bottom of card */}
                  <div className="g-border-t">
                    <Tabs links={tabs} />
                  </div>
                </Card>
                <Outlet />
              </div>
            </div>
          </ArticleTextContainer>
        </PageContainer>
      </article>
    </>
  );
}

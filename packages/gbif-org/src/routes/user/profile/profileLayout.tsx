import { JazzIcon } from '@/components/JazzIcon/index';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientSideOnly } from '@/components/clientSideOnly';
import { useUser } from '@/contexts/UserContext';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { Helmet } from 'react-helmet-async';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useIntl } from 'react-intl';
import country from '@/enums/basic/country.json';
import {
  LuDownload as Download,
  LuUser as User,
} from 'react-icons/lu';

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
  const location = useLocation();
  const { formatMessage } = useIntl();

  // Country options
  const countryOptions = useMemo(() => {
    return country.map((code) => ({
      value: code,
      label: formatMessage({ id: `enums.countryCode.${code}` }),
    }));
  }, [formatMessage]);

  // Determine active tab from route
  const getActiveTab = () => {
    if (location.pathname.includes('/downloads')) return 'downloads';
    return 'profile';
  };

  const [activeTab, setActiveTab] = useState<'profile' | 'downloads'>(getActiveTab());

  // Use real user data or fallback
  const userInfo = {
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    email: user?.email || 'john.doe@example.com',
    country: user?.settings?.country || '',
    language: user?.settings?.locale || 'en',
  };

  const logoutHandler = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.log(err);
      alert('Failed to logout');
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'profile' | 'downloads');
    if (value === 'downloads') {
      navigate('/user/profile/downloads');
    } else {
      navigate('/user/profile');
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
                {/* Header */}
                <div className="g-bg-white g-rounded-lg g-shadow-sm g-p-6 g-mb-6">
                  <div className="g-flex g-items-center g-space-x-4">
                    <div className="g-relative">
                      {user?.photo ? (
                        <img
                          src={user.photo}
                          alt={`${userInfo.firstName} ${userInfo.lastName}`}
                          className="g-w-20 g-h-20 g-object-cover g-rounded-lg"
                        />
                      ) : (
                        <JazzIcon
                          seed={user?.userName || 'user'}
                          className="g-w-20 g-h-20 g-overflow-hidden g-rounded-lg"
                        />
                      )}
                    </div>
                    <div className="g-flex-1">
                      <h1 className="g-text-2xl g-font-bold g-text-gray-900 g-mb-1">
                        {userInfo.firstName} {userInfo.lastName}
                      </h1>
                      <p className="g-text-sm g-text-gray-600 g-mb-2">{userInfo.email}</p>
                      <p className="g-text-sm g-text-gray-700 g-leading-relaxed">{userInfo.bio}</p>
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <Tabs value={activeTab} onValueChange={handleTabChange} className="g-mb-6">
                  <TabsList className="g-bg-transparent">
                    <TabsTrigger value="profile" className="g-flex g-items-center g-space-x-2">
                      <User className="g-w-4 g-h-4" />
                      <span>Profile Information</span>
                    </TabsTrigger>
                    <TabsTrigger value="downloads" className="g-flex g-items-center g-space-x-2">
                      <Download className="g-w-4 g-h-4" />
                      <span>My Downloads</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Profile Tab Content */}
                  <TabsContent value="profile">
                    <Outlet />
                  </TabsContent>

                  {/* Downloads Tab Content */}
                  <TabsContent value="downloads">
                    <Outlet />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </ArticleTextContainer>
        </PageContainer>
      </article>
    </>
  );
}
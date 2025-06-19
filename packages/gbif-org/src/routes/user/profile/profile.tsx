import { ClientSideOnly } from '@/components/clientSideOnly';
import { JazzIcon } from '@/components/JazzIcon/index';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { CardContent as CardContentSmall, Card as SidebarCard } from '@/components/ui/smallCard';
import { useUser } from '@/contexts/UserContext';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { Helmet } from 'react-helmet-async';
import {
  FaBell,
  FaCalendar,
  FaCog,
  FaDownload,
  FaEnvelope,
  FaEye,
  FaShieldAlt as FaShield,
  FaUser,
  FaGithub as SocialIconGithub,
  FaGoogle as SocialIconGoogle,
} from 'react-icons/fa';
import { MdBusiness, MdEdit, MdLanguage, MdLocationOn, MdVerified } from 'react-icons/md';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ProfilePage from './profile_idea';

export const ProfileSkeleton = ArticleSkeleton;

export const Profile = () => {
  const { user } = useUser();
  if (!user) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="g-space-y-6">
      {/* Profile Header */}
      <ProfilePage />
      <Card>
        <CardHeader className="g-pb-2">
          <div className="g-flex g-items-start g-justify-between">
            <div className="g-flex g-items-center g-space-x-4">
              <div className="g-relative">
                <div className="g-h-20 g-w-20 g-rounded-full g-bg-gradient-to-r g-from-blue-500 g-to-purple-600 g-flex g-items-center g-justify-center">
                  <FaUser className="g-h-8 g-w-8 g-text-white" />
                </div>
                {user?.verified && (
                  <div className="g-absolute -g-bottom-1 -g-right-1 g-bg-green-500 g-rounded-full g-p-1">
                    <MdVerified className="g-h-4 g-w-4 g-text-white" />
                  </div>
                )}
              </div>
              <div>
                <div className="g-flex g-items-center g-space-x-2">
                  <JazzIcon
                    seed={user.userName}
                    className="g-w-16 g-h-16 g-overflow-hidden g-rounded-lg"
                  />
                  <h1 className="g-text-2xl g-font-bold g-text-gray-900">
                    {user?.name || user?.username || 'User'}
                  </h1>
                  {user?.verified && <MdVerified className="g-h-5 g-w-5 g-text-green-500" />}
                </div>
                <p className="g-text-gray-600">@{user?.userName || 'username'}</p>
                <div className="g-flex g-items-center g-space-x-4 g-mt-2 g-text-sm g-text-gray-500">
                  {user?.email && (
                    <div className="g-flex g-items-center g-space-x-1">
                      <FaEnvelope className="g-h-3 g-w-3" />
                      <span>{user.email}</span>
                    </div>
                  )}
                  {user?.country && (
                    <div className="g-flex g-items-center g-space-x-1">
                      <MdLocationOn className="g-h-3 g-w-3" />
                      <span>{user.country}</span>
                    </div>
                  )}
                  {user?.joinDate && (
                    <div className="g-flex g-items-center g-space-x-1">
                      <FaCalendar className="g-h-3 g-w-3" />
                      <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="g-flex g-items-center g-space-x-2">
              <MdEdit className="g-h-4 g-w-4" />
              <span>Edit Profile</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      <div className="g-grid g-grid-cols-1 md:g-grid-cols-4 g-gap-4">
        <Card>
          <div className="g-p-6">
            <div className="g-flex g-items-center g-justify-between">
              <div>
                <p className="g-text-sm g-font-medium g-text-gray-600">Downloads</p>
                <p className="g-text-2xl g-font-bold g-text-gray-900">
                  {user?.stats?.downloads || 0}
                </p>
              </div>
              <div className="g-p-3 g-bg-blue-100 g-rounded-lg">
                <FaDownload className="g-h-6 g-w-6 g-text-blue-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="g-p-6">
            <div className="g-flex g-items-center g-justify-between">
              <div>
                <p className="g-text-sm g-font-medium g-text-gray-600">Data Views</p>
                <p className="g-text-2xl g-font-bold g-text-gray-900">{user?.stats?.views || 0}</p>
              </div>
              <div className="g-p-3 g-bg-green-100 g-rounded-lg">
                <FaEye className="g-h-6 g-w-6 g-text-green-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="g-p-6">
            <div className="g-flex g-items-center g-justify-between">
              <div>
                <p className="g-text-sm g-font-medium g-text-gray-600">Organizations</p>
                <p className="g-text-2xl g-font-bold g-text-gray-900">
                  {user?.stats?.organizations || 0}
                </p>
              </div>
              <div className="g-p-3 g-bg-purple-100 g-rounded-lg">
                <MdBusiness className="g-h-6 g-w-6 g-text-purple-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="g-p-6">
            <div className="g-flex g-items-center g-justify-between">
              <div>
                <p className="g-text-sm g-font-medium g-text-gray-600">Last Active</p>
                <p className="g-text-2xl g-font-bold g-text-gray-900">Today</p>
              </div>
              <div className="g-p-3 g-bg-orange-100 g-rounded-lg">
                <FaCalendar className="g-h-6 g-w-6 g-text-orange-600" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="g-grid g-grid-cols-1 lg:g-grid-cols-3 g-gap-6">
        {/* Connected Accounts */}
        <div className="lg:g-col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="g-flex g-items-center g-space-x-2">
                <FaShield className="g-h-5 g-w-5" />
                <span>Connected Accounts</span>
              </CardTitle>
            </CardHeader>
            <div className="g-p-6 g-pt-0">
              <div className="g-space-y-4">
                <div className="g-flex g-items-center g-justify-between g-p-4 g-border g-border-gray-200 g-rounded-lg">
                  <div className="g-flex g-items-center g-space-x-3">
                    <div className="g-p-2 g-bg-red-100 g-rounded-lg">
                      <SocialIconGoogle className="g-h-5 g-w-5 g-text-red-600" />
                    </div>
                    <div>
                      <p className="g-font-medium g-text-gray-900">Google</p>
                      <p className="g-text-sm g-text-gray-500">
                        {user?.connectedAccounts?.google ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  {user?.connectedAccounts?.google ? (
                    <a
                      href="/auth/google/disconnect"
                      className="g-px-4 g-py-2 g-text-sm g-font-medium g-text-red-600 g-bg-red-50 g-border g-border-red-200 g-rounded-md hover:g-bg-red-100 focus:g-outline-none focus:g-ring-2 focus:g-ring-red-500"
                    >
                      Disconnect
                    </a>
                  ) : (
                    <a
                      href="/auth/google/connect"
                      className="g-px-4 g-py-2 g-text-sm g-font-medium g-text-blue-600 g-bg-blue-50 g-border g-border-blue-200 g-rounded-md hover:g-bg-blue-100 focus:g-outline-none focus:g-ring-2 focus:g-ring-blue-500"
                    >
                      Connect
                    </a>
                  )}
                </div>

                <div className="g-flex g-items-center g-justify-between g-p-4 g-border g-border-gray-200 g-rounded-lg">
                  <div className="g-flex g-items-center g-space-x-3">
                    <div className="g-p-2 g-bg-gray-100 g-rounded-lg">
                      <SocialIconGithub className="g-h-5 g-w-5 g-text-gray-700" />
                    </div>
                    <div>
                      <p className="g-font-medium g-text-gray-900">GitHub</p>
                      <p className="g-text-sm g-text-gray-500">
                        {user?.connectedAccounts?.github ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  {user?.connectedAccounts?.github ? (
                    <a
                      href="/auth/github/disconnect"
                      className="g-px-4 g-py-2 g-text-sm g-font-medium g-text-red-600 g-bg-red-50 g-border g-border-red-200 g-rounded-md hover:g-bg-red-100 focus:g-outline-none focus:g-ring-2 focus:g-ring-red-500"
                    >
                      Disconnect
                    </a>
                  ) : (
                    <a
                      href="/auth/github/connect"
                      className="g-px-4 g-py-2 g-text-sm g-font-medium g-text-blue-600 g-bg-blue-50 g-border g-border-blue-200 g-rounded-md hover:g-bg-blue-100 focus:g-outline-none focus:g-ring-2 focus:g-ring-blue-500"
                    >
                      Connect
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Account Settings */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="g-flex g-items-center g-space-x-2">
                <FaCog className="g-h-5 g-w-5" />
                <span>Quick Settings</span>
              </CardTitle>
            </CardHeader>
            <div className="g-p-6 g-pt-0 g-space-y-4">
              <div className="g-flex g-items-center g-justify-between">
                <div className="g-flex g-items-center g-space-x-2">
                  <FaBell className="g-h-4 g-w-4 g-text-gray-500" />
                  <span className="g-text-sm g-font-medium">Email Notifications</span>
                </div>
                <button className="g-relative g-inline-flex g-h-6 g-w-11 g-flex-shrink-0 g-cursor-pointer g-rounded-full g-border-2 g-border-transparent g-bg-gray-200 g-transition-colors g-duration-200 g-ease-in-out focus:g-outline-none focus:g-ring-2 focus:g-ring-blue-500">
                  <span className="g-translate-x-0 g-pointer-events-none g-inline-block g-h-5 g-w-5 g-transform g-rounded-full g-bg-white g-shadow g-ring-0 g-transition g-duration-200 g-ease-in-out"></span>
                </button>
              </div>

              <div className="g-flex g-items-center g-justify-between">
                <div className="g-flex g-items-center g-space-x-2">
                  <FaShield className="g-h-4 g-w-4 g-text-gray-500" />
                  <span className="g-text-sm g-font-medium">Two-Factor Auth</span>
                </div>
                <span className="g-px-2 g-py-1 g-text-xs g-font-medium g-text-red-600 g-bg-red-100 g-rounded-full">
                  Disabled
                </span>
              </div>

              <div className="g-flex g-items-center g-justify-between">
                <div className="g-flex g-items-center g-space-x-2">
                  <MdLanguage className="g-h-4 g-w-4 g-text-gray-500" />
                  <span className="g-text-sm g-font-medium">Language</span>
                </div>
                <span className="g-text-sm g-text-gray-600">English</span>
              </div>

              <div className="g-pt-4 g-border-t">
                <Button variant="outline" size="sm" className="g-w-full g-justify-center">
                  View All Settings
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Debug Info (temporary) */}
      {process.env.NODE_ENV === 'development' && (
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <div className="g-p-6 g-pt-0">
            <pre className="g-text-xs g-bg-gray-50 g-p-4 g-rounded g-overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </Card>
      )}
    </div>
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
  const { logout } = useUser();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.log(err);
      alert('Failed to logout');
    }
  };

  return (
    <>
      <Helmet>
        <title>Profile - GBIF</title>
      </Helmet>
      <article>
        <PageContainer topPadded hasDataHeader className="g-bg-gray-50">
          <ArticleTextContainer className="g-max-w-screen-xl">
            <div className="g-flex g-gap-6 g-h-full g-pb-16 g-flex-row">
              <div className="g-flex-none g-w-64">
                <SideBar onLogout={logoutHandler} />
              </div>
              <div className="g-flex-1 g-min-w-0">
                <Outlet />
              </div>
            </div>
          </ArticleTextContainer>
        </PageContainer>
      </article>
    </>
  );
}

function SideBar({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="g-space-y-4">
      <SidebarCard>
        <div className="g-p-4">
          <h3 className="g-font-semibold g-text-gray-900 g-mb-3">Account</h3>
          <CardContentSmall className="g-p-0">
            <nav className="g-space-y-1">
              <Link
                to="/user/profile"
                className="g-flex g-items-center g-space-x-2 g-px-3 g-py-2 g-text-sm g-font-medium g-text-gray-700 g-rounded-md hover:g-bg-gray-100 hover:g-text-gray-900"
              >
                <FaUser className="g-h-4 g-w-4" />
                <span>Profile</span>
              </Link>
              <Link
                to="/user/profile/downloads"
                className="g-flex g-items-center g-space-x-2 g-px-3 g-py-2 g-text-sm g-font-medium g-text-gray-700 g-rounded-md hover:g-bg-gray-100 hover:g-text-gray-900"
              >
                <FaDownload className="g-h-4 g-w-4" />
                <span>Downloads</span>
              </Link>
              <Link
                to="/user/profile/settings"
                className="g-flex g-items-center g-space-x-2 g-px-3 g-py-2 g-text-sm g-font-medium g-text-gray-700 g-rounded-md hover:g-bg-gray-100 hover:g-text-gray-900"
              >
                <FaCog className="g-h-4 g-w-4" />
                <span>Settings</span>
              </Link>
            </nav>
          </CardContentSmall>
        </div>
      </SidebarCard>

      <SidebarCard>
        <div className="g-p-4">
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="g-w-full g-justify-center g-text-red-600 g-border-red-200 hover:g-bg-red-50 hover:g-border-red-300"
          >
            Sign Out
          </Button>
        </div>
      </SidebarCard>
    </div>
  );
}

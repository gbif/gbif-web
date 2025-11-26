import { GbifLogoIcon } from '@/components/icons/icons';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { HeaderQuery } from '@/gql/graphql';
import { DynamicLink, useI18n } from '@/reactRouterPlugins';
import { FiActivity } from 'react-icons/fi';
import { MdOutlineFeedback, MdTranslate } from 'react-icons/md';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LanguageSelector } from './languageSelector';
import MainNavigation from './mainNav';
import MobileMenu from './mobileMenu';
import { FeedbackPopover } from './feedback/feedback';
import { useConfig } from '@/config/config';
import SearchTrigger from './SearchTrigger';
import { cn } from '@/utils/shadcn';

export function Header({ menu }: { menu: HeaderQuery }) {
  return (
    <Container>
      <div className="g-flex-none">
        <Logo />
      </div>
      <div className="g-flex-auto">
        <MainNavigation menu={menu} />
      </div>
      <div className="g-flex-none g-flex">
        <SearchTrigger />
        <LanguageSelector
          trigger={
            <Button variant="ghost" asChild className="g-text-xl g-px-2 g-mx-0.5 g-opacity-80">
              <span>
                <MdTranslate />
              </span>
            </Button>
          }
        />
        <FeedbackPopover
          trigger={
            <Button variant="ghost" asChild className="g-text-xl g-px-2 g-mx-0.5 g-opacity-80">
              <span>
                <MdOutlineFeedback />
              </span>
            </Button>
          }
        />
        <Button variant="ghost" asChild className="g-text-xl g-px-2 g-mx-0.5">
          <DynamicLink to="/system-health" className="g-opacity-80">
            <FiActivity />
          </DynamicLink>
        </Button>
        <div className="g-inline-block lg:g-hidden">
          <MobileMenu menu={menu} />
        </div>
        <ProfileOrLogin />
      </div>
    </Container>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  const config = useConfig();
  const isRoot = useIsRoot();

  return (
    <div
      className={cn('g-flex g-flex-none g-items-center g-p-2 g-px-4 g-z-30', {
        'g-absolute g-w-full g-text-white hover:g-bg-[#00000048]': isRoot,
        'transparent-test-stripes': config.testSite,
      })}
    >
      {children}
    </div>
  );
}

function Logo() {
  const config = useConfig();
  const isRoot = useIsRoot();

  return (
    <DynamicLink
      as={NavLink}
      to="/"
      className={cn('g-py-2 g-relative g-text-primary-500', {
        'g-text-white': isRoot,
        'test-box': config.testSite,
      })}
    >
      <GbifLogoIcon style={{ fontSize: 25 }} />
    </DynamicLink>
  );
}

function ProfileOrLogin() {
  const { user, isLoggedIn } = useUser();

  if (isLoggedIn && user) {
    return (
      <Button asChild className="g-text-sm lg:g-inline-block g-hidden" variant="outline">
        <Link to="/user/profile">{user.userName}</Link>
      </Button>
    );
  }

  return <LoginButton />;
}

function LoginButton() {
  const { pathname, search } = useLocation();
  const returnUrl = encodeURIComponent(`${pathname}${search}`);

  return (
    <Button asChild className="g-text-sm lg:g-inline-block g-hidden" variant="outline">
      <Link to={`/user/login?returnUrl=${returnUrl}`}>Login</Link>
    </Button>
  );
}

function useIsRoot() {
  const { locale } = useI18n();
  const location = useLocation();
  const pathname = location.pathname;
  //remove / slash from start and begining
  const path = pathname.replace(/^\/|\/$/g, '');
  // if path is empty, it means we are on the root page. Or if path equals the locale code
  const isRoot = path === '' || path === locale.code;

  return isRoot;
}

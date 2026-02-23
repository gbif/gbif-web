import { GbifLogoIcon } from '@/components/icons/icons';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import {
  HeaderQuery,
  StatusPageIndicatorQuery,
  StatusPageIndicatorQueryVariables,
} from '@/gql/graphql';
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
import useQuery from '@/hooks/useQuery';
import { useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavOverflow } from '@/hooks/useNavOverflow';

export function Header({ menu }: { menu: HeaderQuery }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);
  const { isOverflowing, hasMeasured } = useNavOverflow(containerRef, contentRef, rightSideRef);

  // Before JS measurement, fall back to CSS `lg:` breakpoint classes (same as before).
  // After measurement, use the JS boolean to toggle visibility.
  const showMobile = hasMeasured ? isOverflowing : undefined;

  return (
    <Container>
      <div className="g-flex-none">
        <Logo />
      </div>
      <div className="g-flex-auto g-min-w-0" ref={containerRef}>
        <div
          className={cn('g-w-max', {
            'g-hidden lg:g-block': showMobile === undefined,
            'g-h-0 g-overflow-hidden g-pointer-events-none': showMobile === true,
            'g-block': showMobile === false,
          })}
          aria-hidden={showMobile === undefined ? undefined : showMobile || undefined}
          ref={contentRef}
        >
          <MainNavigation menu={menu} />
        </div>
      </div>
      <div className="g-flex-none g-flex" ref={rightSideRef}>
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
        <StatusIndicator />
        <div
          className={cn({
            'g-inline-block lg:g-hidden': showMobile === undefined,
            'g-inline-block': showMobile === true,
            'g-hidden': showMobile === false,
          })}
        >
          <MobileMenu menu={menu} />
        </div>
        <div
          className={cn({
            'lg:g-inline-block g-hidden': showMobile === undefined,
            'g-hidden': showMobile === true,
            'g-inline-block': showMobile === false,
          })}
        >
          <ProfileOrLogin />
        </div>
      </div>
    </Container>
  );
}

const STATUS_PAGE_QUERY = /* GraphQL */ `
  query statusPageIndicator {
    statusPage {
      notificationIcon {
        color
        showNotification
      }
    }
  }
`;

function StatusIndicator() {
  const { data, load } = useQuery<StatusPageIndicatorQuery, StatusPageIndicatorQueryVariables>(
    STATUS_PAGE_QUERY,
    { notifyOnErrors: false, throwAllErrors: false, lazyLoad: true }
  );

  // refresh every 45 seconds unless there is a notification, then every 10 seconds
  useEffect(() => {
    // if it isn't set, then just ignore. This is relevant as we do not have a status page for all environments
    if (!load || !import.meta.env.PUBLIC_STATUS_PAGE_URL) {
      return;
    }
    const hasNotification = data?.statusPage?.notificationIcon?.showNotification;
    const frequency = hasNotification ? 10000 : 45000;
    const interval = setInterval(() => {
      load({ keepDataWhileLoading: true });
    }, frequency);

    // load at first mount as well
    load({ keepDataWhileLoading: true });

    return () => clearInterval(interval);
  }, [load, data?.statusPage?.notificationIcon?.showNotification]);

  return (
    <Button variant="ghost" asChild className="g-text-xl g-px-2 g-mx-0.5 g-relative">
      <a
        href={import.meta.env.PUBLIC_STATUS_PAGE_URL ?? 'http://status.gbif.org/'}
        className="g-opacity-80"
      >
        <FiActivity />
        {data?.statusPage?.notificationIcon?.showNotification && (
          <span
            style={{ backgroundColor: data.statusPage.notificationIcon.color }}
            className={cn('g-absolute g-top-2 g-end-2 g-w-2 g-h-2 g-rounded-full')}
          ></span>
        )}
      </a>
    </Button>
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
      <Button asChild className="g-text-sm" variant="outline">
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
    <Button asChild className="g-text-sm" variant="outline">
      <Link to={`/user/login?returnUrl=${returnUrl}`}>
        <FormattedMessage id="profile.loginText" defaultMessage="Login" />
      </Link>
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

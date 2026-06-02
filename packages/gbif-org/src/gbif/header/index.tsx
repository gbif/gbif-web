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
import { NavLink, useLocation } from 'react-router-dom';
import { LanguageSelector } from './languageSelector';
import MainNavigation from './mainNav';
import MobileMenu from './mobileMenu';
import { FeedbackPopover } from './feedback/feedback';
import { useConfig } from '@/config/config';
import SearchTrigger from './SearchTrigger';
import { cn } from '@/utils/shadcn';
import useQuery from '@/hooks/useQuery';
import { useEffect, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavOverflow } from '@/hooks/useNavOverflow';

export function Header({ menu }: { menu: HeaderQuery }) {
  const intl = useIntl();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);
  const { isOverflowing, hasMeasured } = useNavOverflow(containerRef, contentRef, rightSideRef);

  // Before JS measurement, fall back to CSS `lg:` breakpoint classes (same as before).
  // After measurement, use the JS boolean to toggle visibility.
  const showMobile = hasMeasured ? isOverflowing : undefined;
  // When the desktop nav is collapsed it is still in the DOM. Mark it as `inert`
  // so it cannot receive focus or be read by assistive tech.
  const desktopNavInert = showMobile === true ? { inert: '' } : {};

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
          {...desktopNavInert}
        >
          <MainNavigation menu={menu} />
        </div>
      </div>
      <div className="g-flex-none g-flex" ref={rightSideRef}>
        <SearchTrigger />
        <div
          className={cn({
            'lg:g-inline-block g-hidden': showMobile === undefined,
            'g-hidden': showMobile === true,
            'g-inline-block': showMobile === false,
          })}
        >
          <LanguageSelector
            trigger={
              <Button
                variant="ghost"
                className="g-text-xl g-px-2 g-mx-0.5 g-opacity-80 g-min-h-11 g-min-w-11"
                aria-label={intl.formatMessage({
                  id: 'header.changeLanguage',
                  defaultMessage: 'Change language',
                })}
              >
                <MdTranslate aria-hidden="true" />
              </Button>
            }
          />
          <FeedbackPopover
            trigger={
              <Button
                variant="ghost"
                className="g-text-xl g-px-2 g-mx-0.5 g-opacity-80 g-min-h-11 g-min-w-11"
                aria-label={intl.formatMessage({
                  id: 'header.feedback',
                  defaultMessage: 'Send feedback',
                })}
              >
                <MdOutlineFeedback aria-hidden="true" />
              </Button>
            }
          />
          <StatusIndicator />
        </div>
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
  const intl = useIntl();
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

  const hasNotification = !!data?.statusPage?.notificationIcon?.showNotification;
  const statusLabel = hasNotification
    ? intl.formatMessage({
        id: 'header.systemStatusWithNotification',
        defaultMessage: 'System status (active notification)',
      })
    : intl.formatMessage({
        id: 'header.systemStatus',
        defaultMessage: 'System status',
      });

  return (
    <Button
      variant="ghost"
      asChild
      className="g-text-xl g-px-2 g-mx-0.5 g-relative g-min-h-11 g-min-w-11"
    >
      <a
        href={import.meta.env.PUBLIC_STATUS_PAGE_URL ?? 'http://status.gbif.org/'}
        className="g-opacity-80"
        aria-label={statusLabel}
      >
        <FiActivity aria-hidden="true" />
        {hasNotification && (
          <span
            style={{ backgroundColor: data!.statusPage!.notificationIcon!.color }}
            className={cn('g-absolute g-top-2 g-end-2 g-w-2 g-h-2 g-rounded-full')}
            aria-hidden="true"
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
      className={cn('g-flex g-flex-none g-items-center g-p-2 g-px-4 g-z-30 g-pe-2', {
        'g-absolute g-w-full g-text-white hover:g-bg-[#00000048]': isRoot,
        'transparent-test-stripes': config.testSite,
      })}
    >
      {children}
    </div>
  );
}

function Logo() {
  const intl = useIntl();
  const config = useConfig();
  const isRoot = useIsRoot();

  return (
    <DynamicLink
      as={NavLink}
      to="/"
      aria-label={intl.formatMessage({
        id: 'header.homeLinkLabel',
        defaultMessage: 'GBIF home',
      })}
      className={cn(
        'g-py-2 g-relative g-text-primary-500 g-inline-flex g-items-center g-min-h-11',
        {
          'g-text-white': isRoot,
          'test-box': config.testSite,
        }
      )}
    >
      {/* <GbifLogoIcon style={{ fontSize: 25 }} aria-hidden="true" focusable="false" /> */}
      <img
        src={isRoot ? '/img/logo-web-gbif-nav-white.svg' : '/img/logo-web-gbif-nav-white-bg.svg'}
        alt=""
        aria-hidden="true"
        style={{ height: 25 }}
      />
    </DynamicLink>
  );
}

function ProfileOrLogin() {
  const intl = useIntl();
  const { user, isLoggedIn } = useUser();

  if (isLoggedIn && user) {
    return (
      <Button asChild className="g-text-sm" variant="outline">
        <DynamicLink
          to="/user/profile"
          aria-label={intl.formatMessage(
            {
              id: 'header.profileLinkLabel',
              defaultMessage: 'Profile page for {userName}',
            },
            { userName: user.userName }
          )}
        >
          {user.userName}
        </DynamicLink>
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
      <DynamicLink to={`/user/login?returnUrl=${returnUrl}`}>
        <FormattedMessage id="profile.loginText" defaultMessage="Login" />
      </DynamicLink>
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

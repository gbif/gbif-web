import { GbifLogoIcon } from '@/components/icons/icons';
import { Link, NavLink } from 'react-router-dom';
import { MainNavigation } from './mainNav';
import { HeaderQuery } from '@/gql/graphql';
import { DynamicLink } from '@/components/dynamicLink';
import { MobileMenu } from './mobileMenu';
import { MdOutlineFeedback, MdSearch, MdTranslate } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { FiActivity } from 'react-icons/fi';
import { LanguageSelector } from './languageSelector';
import { FeedbackPopover } from './feedback';

export function Header({ menu }: { menu: HeaderQuery }) {
  return (
    <div className="g-flex g-items-center g-p-2 g-px-4">
      <div className="g-flex-none g-text-primary-500">
        <DynamicLink as={NavLink} to="/" className="g-p-2">
          <GbifLogoIcon style={{ fontSize: 25 }} />
        </DynamicLink>
      </div>
      <div className="g-flex-auto">
        <MainNavigation menu={menu} />
      </div>
      <div className="g-flex-none g-flex">
        <Button variant="ghost" asChild className="g-text-xl g-px-2 g-mx-0.5">
          <span className="g-opacity-80">
            <MdSearch />
          </span>
        </Button>
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
          <Link to="/system-health" className="g-opacity-80">
            <FiActivity />
          </Link>
        </Button>
        <div className="g-inline-block lg:g-hidden">
          <MobileMenu menu={menu} />
        </div>
        <Button asChild className="g-text-sm lg:g-inline-block g-hidden" variant="outline">
          <Link to="/login">Login</Link>
        </Button>
      </div>
    </div>
  );
}

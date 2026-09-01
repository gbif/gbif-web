import { RssLink } from '@/components/cardHeaderActions/rssLink';
import { BaseHeaderActionLink } from '@/components/cardHeaderActions/baseHeaderActionLink';
import { MdAdd } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { useConfig } from '@/config/config';
import { ResourceSortDropdown } from './resourceSortDropdown';
import { ResourceSortValue } from './useResourceSort';

type Props = {
  activeTab: string;
  sort?: ResourceSortValue;
  onSortChange?: (sort: ResourceSortValue) => void;
  hasQuery?: boolean;
};

export function HeaderActionButtons({ activeTab, sort, onSortChange, hasQuery }: Props) {
  const { v1Endpoint } = useConfig();

  const v1WebcalEndpoint = v1Endpoint
    .replace('https://', 'webcal://')
    .replace('http://', 'webcal://');

  return (
    <div className="g-flex g-flex-wrap g-items-center g-gap-x-4">
      {activeTab === 'news' && <RssLink rssUrl={`${v1Endpoint}/newsroom/news/rss`} />}
      {activeTab === 'dataUse' && <RssLink rssUrl={`${v1Endpoint}/newsroom/uses/rss`} />}
      {activeTab === 'event' && (
        <>
          <BaseHeaderActionLink icon={MdAdd} url="/suggest-event">
            <FormattedMessage id="resourceSearch.suggestEvent" defaultMessage="Suggest event" />
          </BaseHeaderActionLink>
          <BaseHeaderActionLink
            icon={MdAdd}
            url={`${v1WebcalEndpoint}/newsroom/events/calendar/upcoming.ics`}
          >
            <FormattedMessage
              id="resourceSearch.subscribeToCalendar"
              defaultMessage="Subscribe to calendar"
            />
          </BaseHeaderActionLink>
          <RssLink rssUrl={`${v1Endpoint}/newsroom/events/upcoming.xml`} />
        </>
      )}
      {/* Event sorting is driven by the upcoming/past filter instead, so the generic sort control doesn't apply there. */}
      {sort && onSortChange && activeTab !== 'event' && (
        <ResourceSortDropdown sort={sort} onChange={onSortChange} hasQuery={!!hasQuery} />
      )}
    </div>
  );
}

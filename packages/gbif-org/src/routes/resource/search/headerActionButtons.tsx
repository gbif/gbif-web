import { RssLink } from '@/components/cardHeaderActions/rssLink';
import { BaseHeaderActionLink } from '@/components/cardHeaderActions/baseHeaderActionLink';
import { MdAdd } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { useConfig } from '@/config/config';

type Props = {
  activeTab: string;
};

export function HeaderActionButtons({ activeTab }: Props) {
  const { v1Endpoint } = useConfig();

  const v1WebcalEndpoint = v1Endpoint
    .replace('https://', 'webcal://')
    .replace('http://', 'webcal://');

  return (
    <div className="g-flex g-flex-wrap g-gap-x-4">
      {activeTab === 'news' && <RssLink rssUrl={`${v1Endpoint}/newsroom/news/rss`} />}
      {activeTab === 'dataUse' && <RssLink rssUrl={`${v1Endpoint}/dataUse/rss`} />}
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
    </div>
  );
}

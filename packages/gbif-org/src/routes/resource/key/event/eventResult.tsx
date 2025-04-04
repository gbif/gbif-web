import { GbifLogoIcon } from '@/components/icons/icons';
import { ResultCard } from '@/components/resultCards/index';
import { Button } from '@/components/ui/button';
import { EventResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { MdCalendarMonth, MdCalendarToday, MdLink, MdLocationPin } from 'react-icons/md';
import { FormattedDate, FormattedMessage } from 'react-intl';

fragmentManager.register(/* GraphQL */ `
  fragment EventResult on MeetingEvent {
    id
    title
    excerpt
    country
    location
    venue
    start
    end
    primaryLink {
      url
    }
    gbifsAttendee
    allDayEvent
  }
`);

type Props = {
  event: EventResultFragment;
  className?: string;
};

export function EventResult({ event, className }: Props) {
  const primaryLink = event.primaryLink?.url ?? `/event/${event.id}`;

  return (
    <ResultCard.Container className={className}>
      <ResultCard.Header
        title={
          <span className="g-flex g-items-center g-flex-wrap g-gap-2">
            {event.title}
            {event.primaryLink?.url && <MdLink className="g-inline-block g-align-middle" />}
            {isPast(event) && (
              <span className="g-inline-flex g-items-center g-bg-red-100 g-text-red-800 g-text-xs g-font-medium g-px-2.5 g-py-0.5 g-rounded dark:g-bg-red-900 dark:g-text-red-300">
                <FormattedMessage id="resourceSearch.past" />
              </span>
            )}
            {isCurrent(event) && (
              <span className="g-inline-block g-items-center g-bg-green-100 g-text-green-800 g-text-xs g-font-medium g-px-2.5 g-py-0.5 g-rounded dark:g-bg-green-900 dark:g-text-green-300">
                <FormattedMessage id="resourceSearch.happeningNow" />
              </span>
            )}
          </span>
        }
        link={primaryLink}
        contentType="cms.contentType.event"
      />

      <div className="g-flex-auto">
        <ResultCard.Content>
          {event.excerpt}
          <EventMetadata event={event} />
        </ResultCard.Content>
      </div>
    </ResultCard.Container>
  );
}

function EventMetadata({ event }: Pick<Props, 'event'>) {
  // event starts and ends the same day
  const sameDay = event?.start?.substring(0, 10) === event?.end?.substring(0, 10);

  return (
    <ResultCard.Metadata className="g-mt-2">
      <Location {...event} />
      <div className="g-flex g-items-center">
        <MdCalendarToday className="g-me-2" />
        {/* format start and end dates. if same day, then only show time. if different day, then show date and time. */}
        <FormattedDate value={event.start} year="numeric" month="short" day="numeric" />
        {/* if starts and ends same day and not an allDayEvent, then show time interval */}
        {sameDay && !event.allDayEvent && (
          <>
            {' '}
            <FormattedDate value={event.start} hour="numeric" minute="numeric" />
          </>
        )}
        {event.end && !sameDay && (
          <>
            {' - '}
            <FormattedDate value={event.end} year="numeric" month="short" day="numeric" />
          </>
        )}
      </div>
      {event.gbifsAttendee && (
        <div>
          <GbifLogoIcon className="g-me-2" />
          <FormattedMessage id="cms.resource.gbifWillAttend" />
        </div>
      )}
      <div className="g-mt-2 g-flex g-gap-4">
        {!isPast(event) && (
          <Button asChild variant="secondary">
            <a
              href={`https://www.gbif.org/api/newsroom/events/${event.id}.ics`}
              className="g-flex g-gap-2"
            >
              <MdCalendarMonth />
              <FormattedMessage id="cms.resource.addToCalendar" />
            </a>
          </Button>
        )}
        {event.primaryLink?.url && (
          <Button asChild variant="ghost">
            <a href={`/event/${event.id}`}>
              <FormattedMessage id="phrases.seeDetails" />
            </a>
          </Button>
        )}
      </div>
    </ResultCard.Metadata>
  );
}

function Location({
  country,
  location,
  venue,
}: Pick<EventResultFragment, 'country' | 'location' | 'venue'>) {
  //if no values is present then return null
  if (!country && !location && !venue) return null;

  return (
    <div className="g-flex g-items-center">
      <MdLocationPin className="g-me-2" />
      {/* if country then add formatted message with country name */}
      <div className="classification">
        {country && (
          <span>
            <FormattedMessage id={`enums.countryCode.${country}`} />
          </span>
        )}
        {/* if location then add location as pure string */}
        {location && <span>{location}</span>}
        {/* if venue then add venue as trusted html */}
        {venue && <span dangerouslySetInnerHTML={{ __html: venue }} />}
      </div>
    </div>
  );
}

function isPast(event: EventResultFragment) {
  return new Date(event.end || event.start) < new Date();
}

function isCurrent(event: EventResultFragment) {
  const now = new Date();

  // If there is no end date, just assume the event lasts the whole day
  if (!event.end) {
    const end = new Date(event.start);
    end.setHours(23, 59, 59, 999);
    return new Date(event.start) <= now && new Date(end) >= now;
  }

  return new Date(event.start) <= now && new Date(event.end) >= now;
}

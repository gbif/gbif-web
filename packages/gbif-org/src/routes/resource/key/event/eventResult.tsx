import { Button } from '@/components/ui/button';
import { MdCalendarMonth, MdCalendarToday, MdLink, MdLocationPin } from 'react-icons/md';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { GbifLogoIcon } from '@/components/icons/icons';
import { EventResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';

fragmentManager.register(/* GraphQL */ `
  fragment EventResult on Event {
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
};

export function EventResult({ event }: Props) {
  // event starts and ends the same day
  const sameDay = event?.start?.substring(0, 10) === event?.end?.substring(0, 10);
  const primaryLink = event.primaryLink?.url ?? `/event/${event.id}`;

  return (
    <article className="bg-slate-50 p-4 flex flex-col rounded border mb-4">
      <div className="pb-1">
        <h3 className="inline">
          <a className="text-base font-semibold" href={primaryLink}>
            {event.title}{' '}
            {event.primaryLink?.url && <MdLink className="inline-block ml-1 align-middle" />}
          </a>
        </h3>
        {isPast(event) && (
          <span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium ms-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
            <FormattedMessage id="Past" />
          </span>
        )}
        {isCurrent(event) && (
          <span className="inline-block items-center bg-green-100 text-green-800 text-xs font-medium ms-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
            <FormattedMessage id="Happening now" />
          </span>
        )}
      </div>

      <div className="flex-auto">
        <div className="font-normal text-slate-500 text-sm">{event.excerpt}</div>
        <div className="text-sm text-slate-500 mt-2">
          <Location {...event} />
          <div className="flex items-center">
            <MdCalendarToday className="me-2" />
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
              <GbifLogoIcon className="me-2" />{' '}
              <FormattedMessage id="cms.resource.gbifWillAttend" />
            </div>
          )}
          <div className="mt-2">
            {!isPast(event) && (
              <Button asChild variant="secondary">
                <a
                  href={`https://www.gbif.org/api/newsroom/events/${event.id}.ics`}
                  className="flex gap-2"
                >
                  <MdCalendarMonth />
                  <FormattedMessage id="cms.resource.addToCalendar" />
                </a>
              </Button>
            )}
            {event.primaryLink?.url && (
              <Button className="ms-4" asChild variant="ghost">
                <a href={`/event/${event.id}`}>
                  <FormattedMessage id="phrases.seeDetails" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
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
    <div className="flex items-center">
      <MdLocationPin className="me-2" />
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

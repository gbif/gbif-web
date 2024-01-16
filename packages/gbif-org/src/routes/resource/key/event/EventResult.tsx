import { Button } from '@/components/ui/button';
import { MdCalendarMonth, MdCalendarToday, MdLink, MdLocationPin } from 'react-icons/md';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { GbifLogoIcon } from '@/components/icons/icons';

// TODO: daniel - isn't there a better way to do this? Seems insane to define it again. Shouldn't I be able to use the genereated type?
type EventFragment = {
  id: string;
  title: string;
  excerpt?: string | null;
  start: string;
  end?: string;
  country?: string | null;
  location?: string | null;
  venue?: string | null;
  primaryLink?: { url?: string | null } | null;
  gbifsAttendee?: string | null;
  allDayEvent?: boolean | null;
};

export function EventResult({ event }: { event: EventFragment }) {
  // event starts and ends the same day
  const sameDay = event?.start?.substring(0, 10) === event?.end?.substring(0, 10);
  const primaryLink = event.primaryLink?.url ?? `/event/${event.id}`;
  
  return (
    <article className="bg-slate-50 p-4 flex rounded border mb-4">
      <div className="flex-none me-4 min-w-20">
        <a href={primaryLink} className="block overflow-hidden rounded-md text-sm border-slate-300 border text-center" tabIndex={-1}>
          <div className="bg-slate-400 text-slate-100 p-2">
            <FormattedDate value={event.start} day="numeric" month="short" />
          </div>
          <div className="bg-slate-50 text-slate-800 p-2">
            <FormattedDate value={event.start} year="numeric" />
          </div>
        </a>
      </div>
      <div className="flex-auto">
        <h3 className="text-base font-semibold">
          <a href={primaryLink}>
            {event.title} {event.primaryLink?.url && <MdLink className="inline-block" />}
          </a>
        </h3>
        <div className="font-normal text-slate-500 text-sm">{event.excerpt}</div>
        <div className="text-sm text-slate-500 mt-2">
          {getLocation({ country: event.country, location: event.location, venue: event.venue })}
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
            {!sameDay && (
              <>
                {' - '}
                <FormattedDate value={event.end} year="numeric" month="short" day="numeric" />
              </>
            )}
          </div>
          {event.gbifsAttendee && (
            <div>
              <GbifLogoIcon className="me-2" /> <FormattedMessage id="cms.resource.gbifWillAttend" />
            </div>
          )}
          <div className="mt-2">
            <Button asChild variant="secondary">
              <a href={`https://www.gbif.org/api/newsroom/events/${event.id}.ics`}>
                <MdCalendarMonth /> <span className="pl-2"><FormattedMessage id="cms.resource.addToCalendar" /></span>
              </a>
            </Button>
            {event.primaryLink?.url && (
              <Button className="ms-4" asChild variant="ghost">
                <a href={`/event/${event.id}`}><FormattedMessage id="phrases.seeDetails" /></a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function getLocation({
  country,
  location,
  venue,
}: {
  country: string | null | undefined;
  location: string | null | undefined;
  venue: string | null | undefined;
}) {
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

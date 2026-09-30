import { RenderIfChildren } from '@/components/renderIfChildren';
import { Button } from '@/components/ui/button';
import { EventPageFragment } from '@/gql/graphql';
import { ArticleBanner } from '@/routes/resource/key/components/articleBanner';
import { fragmentManager } from '@/services/fragmentManager';
import { MdCalendarMonth } from 'react-icons/md';
import { FormattedDate, FormattedDateTimeRange, FormattedMessage, FormattedTime } from 'react-intl';
import { LongDate, longDateFormatProps, toWallClock } from '@/components/dateFormats';
import { useLoaderData, useLocation } from 'react-router-dom';
import { ArticleAuxiliary } from '../components/articleAuxiliary';
import { ArticleBody } from '../components/articleBody';
import { ArticleFooterWrapper } from '../components/articleFooterWrapper';
import { ArticleIntro } from '../components/articleIntro';
import { ArticlePreTitle } from '../components/articlePreTitle';
import { ArticleSkeleton } from '../components/articleSkeleton';
import { ArticleTextContainer } from '../components/articleTextContainer';
import { ArticleTitle } from '../components/articleTitle';
import { Documents } from '../components/documents';
import { KeyValuePair } from '../components/keyValuePair';
import { PageContainer } from '../components/pageContainer';
import { SecondaryLinks } from '../components/secondaryLinks';
import {
  createResourceLoaderWithRedirect,
  ResourceLoaderResult,
} from '../createResourceLoaderWithRedirect';
import { useNotifyOfPartialDataIfErrors } from '@/routes/rootErrorPage';
import { LuClock4 } from 'react-icons/lu';
import { Location as LocationComponent } from './eventResult';
import { DynamicLink } from '@/reactRouterPlugins';
import PageMetaData from '@/components/PageMetaData';
import { useConfig } from '@/config/config';

export const EventPageSkeleton = ArticleSkeleton;

fragmentManager.register(/* GraphQL */ `
  fragment EventPage on MeetingEvent {
    id
    title
    summary
    excerpt
    body
    primaryImage {
      ...ArticleBanner
    }
    primaryLink {
      label
      url
    }
    secondaryLinks {
      label
      url
    }
    location
    country
    start
    end
    eventLanguage
    venue
    allDayEvent
    documents {
      ...DocumentPreview
    }
  }
`);

export const eventPageLoader = createResourceLoaderWithRedirect({
  fragment: 'EventPage',
  resourceType: 'MeetingEvent',
});

export function EventPage() {
  const { data, errors } = useLoaderData() as ResourceLoaderResult<EventPageFragment>;
  useNotifyOfPartialDataIfErrors(errors);
  const { resource } = data;
  const { v1Endpoint } = useConfig();

  // Wall-clock dates in the authored offset, formatted as UTC => identical on server and client
  const { date: startDate, offsetLabel } = toWallClock(resource.start);
  const endDate = resource.end ? toWallClock(resource.end).date : undefined;

  const location = useLocation();

  return (
    <article>
      <PageMetaData
        title={resource.title}
        description={resource.excerpt}
        path={location.pathname}
        imageUrl={resource.primaryImage?.file.normal}
        imageAlt={resource.primaryImage?.description}
      />

      <PageContainer topPadded bottomPadded className="g-bg-white">
        <ArticleTextContainer className="g-mb-10">
          <ArticlePreTitle
            clickable
            secondary={
              <span>
                <EventDateRange start={startDate} end={endDate} />
              </span>
            }
          >
            <DynamicLink to="/resource/search?contentType=event">
              <FormattedMessage id="cms.contentType.event" />
            </DynamicLink>
          </ArticlePreTitle>

          <ArticleTitle dir="auto" dangerouslySetTitle={{ __html: resource.title }} />

          {resource.summary && (
            <ArticleIntro dangerouslySetIntro={{ __html: resource.summary }} className="g-mt-2" />
          )}

          <Button className="g-mt-4" asChild>
            <a href={`${v1Endpoint}/newsroom/events/${resource.id}.ics`} className="g-flex g-gap-2">
              <MdCalendarMonth />
              <FormattedMessage id="cms.resource.addToCalendar" />
            </a>
          </Button>

          <div className="g-flex g-flex-wrap g-items-center g-gap-4 g-pt-4 g-text-sm g-text-gray-600">
            <span className="g-flex g-items-center g-gap-2">
              <MdCalendarMonth />

              <EventDateRange start={startDate} end={endDate} />
            </span>

            {!resource.allDayEvent && (
              <span className="g-flex g-items-center g-gap-2">
                <LuClock4 />
                <EventTimeRange start={startDate} end={endDate} offsetLabel={offsetLabel} />
              </span>
            )}

            <LocationComponent
              country={resource.country}
              location={resource.location}
              venue={resource.venue}
            />
          </div>
        </ArticleTextContainer>

        <ArticleBanner className="g-mt-8 g-mb-6" image={resource?.primaryImage} />

        <ArticleTextContainer>
          {resource.body && (
            <ArticleBody dangerouslySetBody={{ __html: resource.body }} className="g-mt-2" />
          )}

          <ArticleFooterWrapper>
            {resource.secondaryLinks && (
              <ArticleAuxiliary>
                <SecondaryLinks links={resource.secondaryLinks} />
              </ArticleAuxiliary>
            )}

            {resource.documents && (
              <ArticleAuxiliary>
                <Documents documents={resource.documents} />
              </ArticleAuxiliary>
            )}

            <RenderIfChildren className="g-flex g-flex-col g-gap-1 g-mt-8">
              {resource.venue && (
                <KeyValuePair
                  label={<FormattedMessage id="cms.resource.venue" />}
                  value={<FormattedMessage id={resource.venue} />}
                />
              )}

              {resource.location && (
                <KeyValuePair
                  label={<FormattedMessage id="cms.resource.location" />}
                  value={resource.location}
                />
              )}

              {resource.country && (
                <KeyValuePair
                  label={<FormattedMessage id="cms.resource.country" />}
                  value={<FormattedMessage id={`enums.countryCode.${resource.country}`} />}
                />
              )}

              <KeyValuePair
                label={<FormattedMessage id="cms.resource.when" />}
                value={
                  <DateTimeRange
                    start={startDate}
                    end={endDate}
                    allDay={resource.allDayEvent ?? undefined}
                    offsetLabel={offsetLabel}
                  />
                }
              />

              {resource.eventLanguage && (
                <KeyValuePair
                  label={<FormattedMessage id="cms.resource.language" />}
                  value={resource.eventLanguage}
                />
              )}
            </RenderIfChildren>
          </ArticleFooterWrapper>
        </ArticleTextContainer>
      </PageContainer>
    </article>
  );
}

type RangeProps = {
  start: Date;
  end?: Date;
};

// Dates here are wall-clock dates (see toWallClock) so UTC getters are the correct ones
const isSameDate = (a: Date, b: Date) =>
  a.getUTCDate() === b.getUTCDate() &&
  a.getUTCMonth() === b.getUTCMonth() &&
  a.getUTCFullYear() === b.getUTCFullYear();

export function EventDateRange({ start, end }: RangeProps) {
  if (end && !isSameDate(start, end))
    return <FormattedDateTimeRange from={start} to={end} {...longDateFormatProps} />;

  return <LongDate value={start} />;
}

export function EventTimeRange({ start, end, offsetLabel }: RangeProps & { offsetLabel?: string }) {
  const timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  } as const;

  const label = offsetLabel ? ` ${offsetLabel}` : '';

  if (!end)
    return (
      <>
        <FormattedTime value={start} {...timeOptions} />
        {label}
      </>
    );

  // Make a copy of the end date and overwrite the date/month/year with the start date
  const mockEnd = new Date(end);
  mockEnd.setUTCFullYear(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());

  return (
    <>
      <FormattedDateTimeRange from={start} to={mockEnd} {...timeOptions} />
      {label}
    </>
  );
}

function DateTimeRange({
  start,
  end,
  allDay,
  offsetLabel,
}: RangeProps & { allDay: boolean | undefined; offsetLabel: string }) {
  const dateOptions = {
    ...longDateFormatProps,
    hour12: false,
  } as const;
  const timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  } as const;

  if (end && allDay) return <FormattedDateTimeRange from={start} to={end} {...dateOptions} />;
  if (end)
    return (
      <>
        <FormattedDateTimeRange from={start} to={end} {...dateOptions} {...timeOptions} />{' '}
        {offsetLabel}
      </>
    );
  if (allDay) return <FormattedDate value={start} {...dateOptions} />;
  return (
    <>
      <FormattedDate value={start} {...dateOptions} {...timeOptions} /> {offsetLabel}
    </>
  );
}

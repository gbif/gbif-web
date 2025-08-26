import { ClientSideOnly } from '@/components/clientSideOnly';
import { RenderIfChildren } from '@/components/renderIfChildren';
import { Button } from '@/components/ui/button';
import { EventPageFragment } from '@/gql/graphql';
import { ArticleBanner } from '@/routes/resource/key/components/articleBanner';
import { fragmentManager } from '@/services/fragmentManager';
import { Helmet } from 'react-helmet-async';
import { MdCalendarMonth } from 'react-icons/md';
import { FormattedDate, FormattedDateTimeRange, FormattedMessage, FormattedTime } from 'react-intl';
import { useLoaderData } from 'react-router-dom';
import { ArticleAuxiliary } from '../components/articleAuxiliary';
import { ArticleBody } from '../components/articleBody';
import { ArticleFooterWrapper } from '../components/articleFooterWrapper';
import { ArticleIntro } from '../components/articleIntro';
import { ArticleOpenGraph } from '../components/articleOpenGraph';
import { ArticlePreTitle } from '../components/articlePreTitle';
import { ArticleSkeleton } from '../components/articleSkeleton';
import { ArticleTextContainer } from '../components/articleTextContainer';
import { ArticleTitle } from '../components/articleTitle';
import { Documents } from '../components/documents';
import { KeyValuePair } from '../components/keyValuePair';
import { PageContainer } from '../components/pageContainer';
import { SecondaryLinks } from '../components/secondaryLinks';
import { createResourceLoaderWithRedirect } from '../createResourceLoaderWithRedirect';

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
  const { resource } = useLoaderData() as { resource: EventPageFragment };

  const startDate = new Date(resource.start);
  const endDate = resource.end ? new Date(resource.end) : undefined;

  return (
    <article>
      <ArticleOpenGraph resource={resource} />

      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <PageContainer topPadded bottomPadded className="g-bg-white">
        <ArticleTextContainer className="g-mb-10">
          <ArticlePreTitle className="g-flex g-items-center g-gap-4 g-mt-2">
            <ClientSideOnly>
              <span>
                <DateRange start={startDate} end={endDate} />
              </span>
              {!resource.allDayEvent && (
                <span>
                  <TimeRange start={startDate} end={endDate} />
                </span>
              )}
            </ClientSideOnly>
            {resource.country && <FormattedMessage id={`enums.topics.${resource.country}`} />}
          </ArticlePreTitle>

          <ArticleTitle dangerouslySetTitle={{ __html: resource.title }} />

          {resource.summary && (
            <ArticleIntro dangerouslySetIntro={{ __html: resource.summary }} className="g-mt-2" />
          )}

          <Button className="g-mt-4" asChild>
            <a
              href={`https://www.gbif.org/api/newsroom/events/${resource.id}.ics`}
              className="g-flex g-gap-2"
            >
              <MdCalendarMonth />
              <FormattedMessage id="cms.resource.addToCalendar" />
            </a>
          </Button>
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
                  value={<FormattedMessage id={`enums.topics.${resource.country}`} />}
                />
              )}

              <KeyValuePair
                label={<FormattedMessage id="cms.resource.when" />}
                value={
                  <ClientSideOnly>
                    <DateTimeRange
                      start={startDate}
                      end={endDate}
                      allDay={resource.allDayEvent ?? undefined}
                    />
                  </ClientSideOnly>
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

const isSameDate = (a: Date, b: Date) =>
  a.getDate() === b.getDate() &&
  a.getMonth() === b.getMonth() &&
  a.getFullYear() === b.getFullYear();

function DateRange({ start, end }: RangeProps) {
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' } as const;

  if (end && !isSameDate(start, end))
    return <FormattedDateTimeRange from={start} to={end} {...dateOptions} />;

  return <FormattedDate value={start} {...dateOptions} />;
}

function TimeRange({ start, end }: RangeProps) {
  const timeOptions = { hour: 'numeric', minute: 'numeric' } as const;

  if (!end) return <FormattedTime value={start} {...timeOptions} />;

  // Make a copy of the end date and overwrite the date/month/year with the start date
  const mockEnd = new Date(end);
  mockEnd.setDate(start.getDate());
  mockEnd.setMonth(start.getMonth());
  mockEnd.setFullYear(start.getFullYear());

  return <FormattedDateTimeRange from={start} to={mockEnd} {...timeOptions} />;
}

function DateTimeRange({ start, end, allDay }: RangeProps & { allDay: boolean | undefined }) {
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' } as const;
  const timeOptions = { hour: 'numeric', minute: 'numeric' } as const;

  if (end && allDay) return <FormattedDateTimeRange from={start} to={end} {...dateOptions} />;
  if (end)
    return <FormattedDateTimeRange from={start} to={end} {...dateOptions} {...timeOptions} />;
  if (allDay) return <FormattedDate value={start} {...dateOptions} />;
  return <FormattedDate value={start} {...dateOptions} {...timeOptions} />;
}

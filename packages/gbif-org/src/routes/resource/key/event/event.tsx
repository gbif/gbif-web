import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { EventQuery, EventQueryVariables } from '@/gql/graphql';
import { ArticleContainer } from '@/routes/resource/key/components/ArticleContainer';
import { ArticleBanner } from '@/routes/resource/key/components/ArticleBanner';
import { ArticlePreTitle } from '../components/ArticlePreTitle';
import { ArticleTitle } from '../components/ArticleTitle';
import { ArticleIntro } from '../components/ArticleIntro';
import { ArticleTextContainer } from '../components/ArticleTextContainer';
import { ArticleBody } from '../components/ArticleBody';
import { Button } from '@/components/ui/button';
import { FormattedDate, FormattedDateTimeRange, FormattedMessage, FormattedTime } from 'react-intl';
import { KeyValuePair } from '../components/KeyValuePair';
import { MdCalendarMonth } from 'react-icons/md';
import { SecondaryLinks } from '../components/SecondaryLinks';
import { ArticleAuxiliary } from '../components/ArticleAuxiliary';
import { required } from '@/utils/required';
import { useLoaderData } from 'react-router-dom';
import { ArticleSkeleton } from '../components/ArticleSkeleton';
import { ClientSideOnly } from '@/components/ClientSideOnly';

const EVENT_QUERY = /* GraphQL */ `
  query Event($key: String!) {
    event(id: $key) {
      id
      title
      summary
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
    }
  }
`;

export async function eventPageLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key provided in the url');

  return graphql.query<EventQuery, EventQueryVariables>(EVENT_QUERY, { key });
}

export function EventPage() {
  const { data } = useLoaderData() as { data: EventQuery };

  if (data.event == null) throw new Error('404');
  const resource = data.event;

  const startDate = new Date(resource.start);
  const endDate = resource.end ? new Date(resource.end) : undefined;

  return (
    <>
      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <ArticleContainer>
        <ArticleTextContainer className="mb-10">
          <ArticlePreTitle className="flex items-center gap-4 mt-2">
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

          <ArticleTitle>{resource.title}</ArticleTitle>

          {resource.summary && (
            <ArticleIntro dangerouslySetInnerHTML={{ __html: resource.summary }} className="mt-2" />
          )}

          <Button className="mt-4" asChild>
            <a
              href={`https://www.gbif.org/api/newsroom/events/${resource.id}.ics`}
              className="flex gap-2"
            >
              <MdCalendarMonth />
              <FormattedMessage id="cms.resource.addToCalendar" />
            </a>
          </Button>
        </ArticleTextContainer>

        <ArticleBanner className="mt-8 mb-6" image={resource?.primaryImage} />

        <ArticleTextContainer>
          {resource.body && (
            <ArticleBody dangerouslySetInnerHTML={{ __html: resource.body }} className="mt-2" />
          )}

          <hr className="my-8" />

          {resource.secondaryLinks && (
            <ArticleAuxiliary>
              <SecondaryLinks className="mb-4" links={resource.secondaryLinks} />
            </ArticleAuxiliary>
          )}

          {resource.location && (
            <KeyValuePair
              label={<FormattedMessage id="cms.resource.location" />}
              value={resource.location}
            />
          )}

          {resource.country && (
            <KeyValuePair
              className="mt-1"
              label={<FormattedMessage id="cms.resource.country" />}
              value={<FormattedMessage id={`enums.topics.${resource.country}`} />}
            />
          )}

          <KeyValuePair
            className="mt-1"
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
        </ArticleTextContainer>
      </ArticleContainer>
    </>
  );
}

export function EventPageSkeleton() {
  return <ArticleSkeleton />;
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

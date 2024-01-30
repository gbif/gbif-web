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
import { FormattedMessage } from 'react-intl';
import { useI18n } from '@/contexts/i18n';
import { KeyValuePair } from '../components/KeyValuePair';
import { MdCalendarMonth } from 'react-icons/md';
import { SecondaryLinks } from '../components/SecondaryLinks';
import { ArticleAuxiliary } from '../components/ArticleAuxiliary';
import { required } from '@/utils/required';
import { useLoaderData } from 'react-router-dom';

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
    }
  }
`;

export async function eventLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key provided in the url');

  return graphql.query<EventQuery, EventQueryVariables>(EVENT_QUERY, { key });
}

export function Event() {
  const { data } = useLoaderData() as { data: EventQuery };
  const { locale } = useI18n();

  if (data.event == null) throw new Error('404');
  const resource = data.event;

  const startDate = new Date(resource.start);
  const endDate = new Date(resource.end);

  return (
    <>
      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <ArticleContainer>
        <ArticleTextContainer className="mb-10">
          <ArticlePreTitle className="flex items-center gap-4 mt-2">
            <span>{getDateRange(startDate, endDate, locale.code)}</span>
            <span>{getTimeRange(startDate, endDate, locale.code)}</span>
            {resource.country && <FormattedMessage id={`enums.topics.${resource.country}`} />}
          </ArticlePreTitle>

          <ArticleTitle>{resource.title}</ArticleTitle>

          {resource.summary && (
            <ArticleIntro dangerouslySetInnerHTML={{ __html: resource.summary }} className="mt-2" />
          )}

          <Button className="mt-4" asChild>
            <a href={`https://www.gbif.org/api/newsroom/events/${resource.id}.ics`}>
              <MdCalendarMonth />{' '}
              <span className="pl-2">
                <FormattedMessage id="cms.resource.addToCalendar" />
              </span>
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
            value={getDateAndTimeRange(startDate, endDate, locale.code)}
          />
        </ArticleTextContainer>
      </ArticleContainer>
    </>
  );
}

// Examples of return value:
// 10 - 13 October 2023
// 14 December 2023
function getDateRange(startDate: Date, endDate: Date, locale: string): string {
  const startDay = startDate.getDate();
  const startMonth = startDate.toLocaleString(locale, { month: 'long' });
  const startYear = startDate.getFullYear();

  const endDay = endDate.getDate();
  const endMonth = endDate.toLocaleString(locale, { month: 'long' });
  const endYear = endDate.getFullYear();

  if (startMonth === endMonth && startYear === endYear) {
    return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
  }

  if (startYear === endYear) {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
  }

  return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
}

// Examples of return value:
// 15:00 - 16:30 CET
// 09:00 - 19:00 CEST
function getTimeRange(startDate: Date, endDate: Date, locale: string): string {
  const startHour = startDate.getHours().toString().padStart(2, '0');
  const startMinute = startDate.getMinutes().toString().padStart(2, '0');
  const endHour = endDate.getHours().toString().padStart(2, '0');
  const endMinute = endDate.getMinutes().toString().padStart(2, '0');

  const timeZone = getTimeZoneFromDateAndLocale(startDate, locale);

  return `${startHour}:${startMinute} - ${endHour}:${endMinute} ${timeZone}`;
}

// Examples of return value:
// 10 October 2023 09:00 - 13 October 2023 19:00
// 14 December 2023 15:00 - 16:30
function getDateAndTimeRange(startDate: Date, endDate: Date, locale: string): string {
  const dateRange = getDateRange(startDate, endDate, locale);
  const timeRange = getTimeRange(startDate, endDate, locale);

  return `${dateRange} ${timeRange}`;
}

function getTimeZoneFromDateAndLocale(date: Date, locale: string): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    timeZoneName: 'short',
  });
  const parts = formatter.formatToParts(date);
  const timeZonePart = parts.find((part) => part.type === 'timeZoneName');

  return timeZonePart?.value ?? '';
}

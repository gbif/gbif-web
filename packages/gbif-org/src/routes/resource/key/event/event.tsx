import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { EventQuery, EventQueryVariables } from '@/gql/graphql';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
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

const { load, useTypedLoaderData } = createGraphQLHelpers<
  EventQuery,
  EventQueryVariables
>(/* GraphQL */ `
  query Event($key: String!) {
    event(id: $key) {
      id
      title
      summary
      body
      primaryImage {
        file {
          url
          normal: thumbor(width: 1200, height: 500)
          mobile: thumbor(width: 800, height: 400)
        }
        description
        title
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
`);

export function Event() {
  const { data } = useTypedLoaderData();
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
              <MdCalendarMonth /> <span className="pl-2">Add to calender</span>
            </a>
          </Button>
        </ArticleTextContainer>

        <ArticleBanner className="mt-8 mb-6" image={resource?.primaryImage ?? null} />

        <ArticleTextContainer>
          {resource.body && (
            <ArticleBody dangerouslySetInnerHTML={{ __html: resource.body }} className="mt-2" />
          )}

          <hr className="my-8" />

          {resource.secondaryLinks && (
            <SecondaryLinks className="mb-4" links={resource.secondaryLinks} />
          )}

          <KeyValuePair
            label={<FormattedMessage id="event.location" />}
            value={resource.location}
          />

          <KeyValuePair
            className="mt-1"
            label={<FormattedMessage id="event.countryOrArea" />}
            value={<FormattedMessage id={`enums.topics.${resource.country}`} />}
          />

          <KeyValuePair
            className="mt-1"
            label={<FormattedMessage id="event.when" />}
            value={getDateAndTimeRange(startDate, endDate, locale.code)}
          />
        </ArticleTextContainer>
      </ArticleContainer>
    </>
  );
}

export async function eventLoader({ request, params, config, locale }: LoaderArgs) {
  const key = params.key;
  if (key == null) throw new Error('No key provided in the url');

  return load({
    endpoint: config.graphqlEndpoint,
    signal: request.signal,
    variables: {
      key,
    },
    locale: locale.cmsLocale || locale.code,
  });
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

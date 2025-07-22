import { Tabs } from '@/components/tabs';
import { Button } from '@/components/ui/button';
import countryCodes from '@/enums/basic/country.json';
import { NotFoundError } from '@/errors';
import {
  CountNewsQuery,
  CountNewsQueryVariables,
  CountProjectsQuery,
  CountProjectsQueryVariables,
  ParticipantQuery,
  ParticipantQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { LoaderArgs } from '@/reactRouterPlugins';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { required } from '@/utils/required';
import { MdDownload as DownloadIcon } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { Outlet, useLoaderData, useParams } from 'react-router-dom';

export function countryKeyLoader({ params, graphql }: LoaderArgs) {
  const countryCode = required(params.countryCode, 'No countryCode was provided in the URL');

  // Validate country code
  if (!countryCodes.includes(countryCode)) {
    throw new NotFoundError();
  }

  return graphql.query<ParticipantQuery, ParticipantQueryVariables>(PARTICIPANT_QUERY, {
    countryCode,
  });
}

export function CountryKeyLayout() {
  const { countryCode } = useParams();

  // This can't happen as long as the page is used on the correct route.
  if (!countryCode) throw new Error('No countryCode was provided in the URL');

  const { data } = useLoaderData() as { data: ParticipantQuery };

  const hasProjects = useHasProjects(countryCode);
  const hasNews = useHasNews(countryCode);
  const participant = data.nodeCountry;

  return (
    <article>
      <PageContainer topPadded className="g-bg-white">
        <ArticleTextContainer className="g-max-w-screen-xl">
          <div className="g-flex g-justify-between g-gap-4 g-flex-col md:g-flex-row g-items-start md:g-items-end">
            <div>
              {participant == null && (
                <ArticlePreTitle>
                  <FormattedMessage id="country.country" />
                </ArticlePreTitle>
              )}

              {participant?.participationStatus && (
                <ArticlePreTitle>
                  <FormattedMessage
                    id={`participant.participationStatus.description.${participant.participationStatus}`}
                    values={{
                      REGION: (
                        <FormattedMessage id={`enums.gbifRegion.${participant.gbifRegion}`} />
                      ),
                    }}
                  />
                </ArticlePreTitle>
              )}

              <p className="g-text-sm g-text-gray-500">
                <FormattedMessage
                  id="country.countryNamingDisclaimer"
                  values={{
                    ISO_STANDARD_LINK_TEXT: (
                      <a href="https://www.iso.org/obp/ui/#search" className="g-text-primary-500">
                        <FormattedMessage
                          id="country.isoStandardLinkText"
                          defaultMessage="ISO 3166-1 standard"
                        />
                      </a>
                    ),
                  }}
                />
              </p>

              <div className="g-flex g-gap-4 g-items-center">
                <ArticleTitle>
                  <FormattedMessage id={`enums.countryCode.${countryCode}`} />
                </ArticleTitle>
                <img className="g-h-8" src={`/flags/${countryCode}.png`} />
              </div>
            </div>

            <Button size="sm" className="g-flex g-gap-2" asChild>
              <a
                href={
                  import.meta.env.PUBLIC_ANALYTICS_FILES_URL +
                  `/country/${countryCode}/GBIF_CountryReport_${countryCode}.pdf`
                }
              >
                <DownloadIcon className="g-w-4 g-h-4" />
                <FormattedMessage id="country.activityReport" defaultMessage="Activity Report" />
              </a>
            </Button>
          </div>

          <div className="g-border-b g-mt-4" />
          <Tabs
            links={[
              {
                to: 'summary',
                children: <FormattedMessage id="country.tabs.summary" defaultMessage="Summary" />,
              },
              {
                to: 'about',
                children: (
                  <FormattedMessage id="country.tabs.dataAbout" defaultMessage="Data about" />
                ),
              },
              {
                to: 'publishing',
                children: (
                  <FormattedMessage
                    id="country.tabs.dataPublishing"
                    defaultMessage="Data publishing"
                  />
                ),
              },
              {
                to: 'participation',
                children: (
                  <FormattedMessage
                    id="country.tabs.participation"
                    defaultMessage="Participation"
                  />
                ),
                hidden: participant?.participationStatus !== 'VOTING',
              },
              {
                to: 'alien-species',
                children: (
                  <FormattedMessage id="country.tabs.alienSpecies" defaultMessage="Alien species" />
                ),
              },
              {
                to: 'publications/from',
                children: (
                  <FormattedMessage
                    id="country.tabs.publicationsFrom"
                    defaultMessage="Publications from"
                  />
                ),
              },
              {
                to: 'publications/about',
                children: (
                  <FormattedMessage
                    id="country.tabs.publicationsAbout"
                    defaultMessage="Publications about"
                  />
                ),
              },
              {
                to: 'projects',
                children: <FormattedMessage id="country.tabs.projects" defaultMessage="Projects" />,
                hidden: !hasProjects,
              },
              {
                to: 'news',
                children: <FormattedMessage id="country.tabs.news" defaultMessage="News" />,
                hidden: !hasNews,
              },
            ]}
          />
        </ArticleTextContainer>
      </PageContainer>
      <Outlet />
    </article>
  );
}

const PARTICIPANT_QUERY = /* GraphQL */ `
  query Participant($countryCode: String!) {
    nodeCountry(countryCode: $countryCode) {
      title
      address
      gbifRegion
      participationStatus
      participant {
        membershipStart
        nodeEstablishmentDate
      }
      ...ParticipantSummary
      ...CountryKeyParticipation
    }
  }
`;

function useHasProjects(countryCode: string) {
  const { data } = useQuery<CountProjectsQuery, CountProjectsQueryVariables>(COUNT_PROJECTS_QUERY, {
    variables: {
      countryCode: countryCode,
    },
  });

  return data?.resourceSearch?.documents.total > 0;
}

const COUNT_PROJECTS_QUERY = /* GraphQL */ `
  query CountProjects($countryCode: JSON!) {
    resourceSearch(
      contentType: PROJECT
      predicate: { key: "contractCountry", type: equals, value: $countryCode }
    ) {
      documents(size: 0) {
        total
      }
    }
  }
`;

function useHasNews(countryCode: string) {
  const { data } = useQuery<CountNewsQuery, CountNewsQueryVariables>(COUNT_NEWS_QUERY, {
    variables: {
      countryCode: countryCode,
    },
  });

  return data?.resourceSearch?.documents.total > 0;
}

const COUNT_NEWS_QUERY = /* GraphQL */ `
  query CountNews($countryCode: JSON!) {
    resourceSearch(
      contentType: NEWS
      predicate: { key: "countriesOfCoverage", type: equals, value: $countryCode }
    ) {
      documents(size: 0) {
        total
      }
    }
  }
`;

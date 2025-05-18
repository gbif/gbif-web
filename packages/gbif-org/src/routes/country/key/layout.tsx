import { defaultDateFormatProps } from '@/components/headerComponents';
import { Tabs } from '@/components/tabs';
import { Button } from '@/components/ui/button';
import {
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
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Outlet, useLoaderData, useParams } from 'react-router-dom';

export function countryKeyLoader({ params, graphql }: LoaderArgs) {
  const countryCode = required(params.countryCode, 'No countryCode was provided in the URL');

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

  const participant = data.nodeCountry;

  return (
    <article>
      <PageContainer topPadded className="g-bg-white">
        <ArticleTextContainer className="g-max-w-screen-xl">
          <div className="g-flex g-justify-between g-items-end">
            <div>
              {participant == null && (
                <ArticlePreTitle>
                  <FormattedMessage id="TODO" defaultMessage="Country" />
                </ArticlePreTitle>
              )}

              {participant?.participationStatus && (
                <ArticlePreTitle
                  secondary={
                    <FormattedMessage
                      id="TODO"
                      defaultMessage="Memeber since {DATE}"
                      values={{
                        DATE: (
                          <FormattedDate
                            value={participant.participant?.membershipStart ?? undefined}
                            {...defaultDateFormatProps}
                          />
                        ),
                      }}
                    />
                  }
                >
                  <FormattedMessage id="TODO" defaultMessage="A GBIF Voting participant" />
                </ArticlePreTitle>
              )}

              <div className="g-flex g-gap-4 g-items-center">
                <ArticleTitle>
                  <FormattedMessage id={`enums.countryCode.${countryCode}`} />
                </ArticleTitle>
                <img className="g-h-8" src={`/flags/${countryCode}.png`} />
              </div>
            </div>

            <Button size="sm" className="g-flex g-gap-2" asChild>
              {/* TODO: move base url to env */}
              <a
                href={`https://analytics-files.gbif.org/country/${countryCode}/GBIF_CountryReport_${countryCode}.pdf`}
              >
                <FormattedMessage id="TODO" defaultMessage="Activity Report" />
                <DownloadIcon className="g-w-4 g-h-4" />
              </a>
            </Button>
          </div>

          <div className="g-border-b g-mt-4" />
          <Tabs
            links={[
              {
                to: 'summary',
                children: <FormattedMessage id="TODO" defaultMessage="Summary" />,
              },
              {
                to: 'about',
                children: <FormattedMessage id="TODO" defaultMessage="Data about" />,
              },
              {
                to: 'publishing',
                children: <FormattedMessage id="TODO" defaultMessage="Data publishing" />,
              },
              {
                to: 'participation',
                children: <FormattedMessage id="TODO" defaultMessage="Participation" />,
                hidden: !participant,
              },
              {
                to: 'alien-species',
                children: <FormattedMessage id="TODO" defaultMessage="Alien species" />,
              },
              {
                to: 'publications/from',
                children: <FormattedMessage id="TODO" defaultMessage="Publications from" />,
              },
              {
                to: 'publications/about',
                children: <FormattedMessage id="TODO" defaultMessage="Publications about" />,
              },
              {
                to: 'projects',
                children: <FormattedMessage id="TODO" defaultMessage="Projects" />,
                hidden: !hasProjects,
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

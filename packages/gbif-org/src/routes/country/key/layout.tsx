import { defaultDateFormatProps } from '@/components/headerComponents';
import { Tabs } from '@/components/tabs';
import { ParticipantQuery, ParticipantQueryVariables } from '@/gql/graphql';
import { LoaderArgs } from '@/reactRouterPlugins';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { required } from '@/utils/required';
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
  const { data } = useLoaderData() as { data: ParticipantQuery };

  const participant = data.nodeCountry;
  const headOfDelegation = participant?.contacts?.find(
    (contact) => contact?.type === 'HEAD_OF_DELEGATION'
  );

  return (
    <article>
      <PageContainer topPadded className="g-bg-white">
        <ArticleTextContainer className="g-max-w-screen-xl">
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
              },
              {
                to: 'TODO',
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
      ...CountryKeySummary
    }
  }
`;

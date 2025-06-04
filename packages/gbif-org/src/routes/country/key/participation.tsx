import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { CountryKeyParticipationFragment } from '@/gql/graphql';
import { ArticleBody } from '@/routes/resource/key/components/articleBody';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { fragmentManager } from '@/services/fragmentManager';
import { FormattedMessage } from 'react-intl';
import { useCountryKeyLoaderData } from '.';
import { Contacts } from './components/contacts';
import { EmptyCountryTab } from './components/emptyCountryTab';
import { ParticipantSummary } from './components/participantSummary';

export function CountryKeyParticipation() {
  const { data } = useCountryKeyLoaderData();
  const nodeCountry = data?.nodeCountry;

  if (!nodeCountry) {
    return (
      <EmptyCountryTab
        title={<FormattedMessage id="TODO" defaultMessage="Not a participant" />}
        description={
          <FormattedMessage id="TODO" defaultMessage="This country is not a participant of GBIF" />
        }
      />
    );
  }

  const body = nodeCountry.participant ? createBody(nodeCountry.participant) : '';

  return (
    <>
      <ArticleContainer className="g-bg-slate-100 g-pt-4">
        <ArticleTextContainer className="g-max-w-screen-xl g-flex g-flex-col g-gap-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <FormattedMessage id="participant.participantSummary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ParticipantSummary participant={nodeCountry} showSocialLinksSection />
            </CardContent>
          </Card>
        </ArticleTextContainer>
      </ArticleContainer>
      <ArticleContainer className="g-pt-4">
        <ArticleTextContainer>
          {body && <ArticleBody dangerouslySetBody={{ __html: body }} />}
        </ArticleTextContainer>
      </ArticleContainer>
      <ArticleContainer className="g-bg-slate-100 g-pt-4">
        <ArticleTextContainer className="g-max-w-screen-xl g-flex g-flex-col g-gap-4">
          <Contacts
            contacts={nodeCountry.contacts}
            nodeTitle={nodeCountry.title}
            nodeAddress={nodeCountry.address}
          />
        </ArticleTextContainer>
      </ArticleContainer>
    </>
  );
}

fragmentManager.register(/* GraphQL */ `
  fragment CountryKeyParticipation on Node {
    participant {
      progressAndPlans
      nodeMission
      nodeFunding
      nodeHistory
      nodeStructure
    }
    ...NodeContacts
  }
`);

// Done this way to let the g-prose class and ArticleBody component do the styling
function createBody(participant: NonNullable<CountryKeyParticipationFragment['participant']>) {
  let body = '';

  if (participant.progressAndPlans) {
    body += `<h3>Progress and Plans</h3>`;
    body += participant.progressAndPlans;
  }

  if (participant.nodeMission) {
    body += `<h3>Mission</h3>`;
    body += participant.nodeMission;
  }

  if (participant.nodeFunding) {
    body += `<h3>Funding</h3>`;
    body += participant.nodeFunding;
  }

  if (participant.nodeHistory) {
    body += `<h3>History</h3>`;
    body += participant.nodeHistory;
  }

  if (participant.nodeStructure) {
    body += `<h3>Structure</h3>`;
    body += participant.nodeStructure;
  }

  return body;
}

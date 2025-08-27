import {
  ContactActions,
  ContactAvatar,
  ContactContent,
  ContactDescription,
  ContactEmail,
  ContactHeader,
  ContactHeaderContent,
  ContactTelephone,
  ContactTitle,
} from '@/components/contact';
import { PaginationFooter } from '@/components/pagination';
import Properties, { Property } from '@/components/properties';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  NodeDatasetsQuery,
  NodeDatasetsQueryVariables,
  NodeDetailsFragment,
  NodePublishersQuery,
  NodePublishersQueryVariables,
  ParticipantDetailsFragment,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DatasetResult } from '@/routes/dataset/datasetResult';
import { PublisherResult } from '@/routes/publisher/publisherResult';
import { useEffect, useState } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { useParticipantKeyLoaderData } from '.';

export function ParticipantKeyAbout() {
  const { data } = useParticipantKeyLoaderData();
  const { participant } = data;
  if (!participant) throw new Error('Participant data is not available');

  return (
    <div>
      <ParticipantNodeDescription participant={participant} node={participant.node} />
      <NodeContacts node={participant?.node} />
      <NodePublishers nodeKey={participant.node?.key} />
      <NodeData nodeKey={participant.node?.key} />
    </div>
  );
}

const DATASET_QUERY = /* GraphQL */ `
  query NodeDatasets($key: ID!, $limit: Int!, $offset: Int!) {
    node(key: $key) {
      dataset(limit: $limit, offset: $offset) {
        limit
        offset
        count
        endOfRecords
        results {
          ...DatasetResult
        }
      }
    }
  }
`;

const PUBLISHER_QUERY = /* GraphQL */ `
  query NodePublishers($key: ID!, $limit: Int!, $offset: Int!) {
    node(key: $key) {
      publisher: organization(limit: $limit, offset: $offset) {
        limit
        offset
        count
        endOfRecords
        results {
          ...PublisherResult
        }
      }
    }
  }
`;

export function NodeData({ nodeKey }: { nodeKey?: string }) {
  const [offset, setOffset] = useState(0);

  const { data, load, error, loading } = useQuery<NodeDatasetsQuery, NodeDatasetsQueryVariables>(
    DATASET_QUERY,
    {
      throwAllErrors: false,
      notifyOnErrors: true,
      lazyLoad: true,
    }
  );

  useEffect(() => {
    // load datasets and refresh when pages change
    if (!nodeKey) return;

    load({
      variables: {
        key: nodeKey,
        limit: 5,
        offset,
      },
    });
  }, [nodeKey, offset, load]);

  const datasets = data?.node?.dataset;

  const isLoading = loading || (!data && !error);
  if ((datasets?.count ?? 0) < 1) return null;

  return (
    <>
      <CardHeader id="datasetList">
        <CardTitle>
          {!isLoading ? (
            <FormattedMessage id="counts.nDatasets" values={{ total: datasets?.count }} />
          ) : (
            <Skeleton>Loading</Skeleton>
          )}
        </CardTitle>
      </CardHeader>
      {isLoading && <CardListSkeleton />}
      {datasets &&
        !isLoading &&
        !error &&
        datasets.results.map((item) => <DatasetResult key={item.key} dataset={item} />)}

      {datasets?.count && datasets?.count > datasets?.limit && (
        <PaginationFooter
          offset={datasets.offset}
          count={datasets.count}
          limit={datasets.limit}
          onChange={(x) => setOffset(x)}
        />
      )}
    </>
  );
}

export function NodePublishers({ nodeKey }: { nodeKey?: string }) {
  const [offset, setOffset] = useState(0);

  const { data, load, error, loading } = useQuery<
    NodePublishersQuery,
    NodePublishersQueryVariables
  >(PUBLISHER_QUERY, {
    throwAllErrors: false,
    notifyOnErrors: true,
    lazyLoad: true,
  });

  useEffect(() => {
    // load datasets and refresh when pages change
    if (!nodeKey) return;

    load({
      variables: {
        key: nodeKey,
        limit: 5,
        offset,
      },
    });
  }, [nodeKey, offset, load]);

  const publishers = data?.node?.publisher;
  const isLoading = loading || (!data && !error);
  if ((publishers?.count ?? 0) < 1) return null;
  return (
    <>
      <CardHeader id="publisherList">
        <CardTitle>
          {!isLoading ? (
            <FormattedMessage
              id="counts.nEndorsedPublishers"
              values={{ total: publishers?.count }}
            />
          ) : (
            <Skeleton>Loading</Skeleton>
          )}
        </CardTitle>
      </CardHeader>
      {isLoading && <CardListSkeleton />}
      {publishers &&
        !isLoading &&
        !error &&
        publishers.results
          .filter((x) => x)
          .map((item) => <PublisherResult key={item?.key} publisher={item} />)}

      {publishers?.count && publishers?.count > publishers?.limit && (
        <PaginationFooter
          offset={publishers.offset}
          count={publishers.count}
          limit={publishers.limit}
          onChange={(x) => setOffset(x)}
        />
      )}
    </>
  );
}

export function NodeContacts({ node }: { node?: NodeDetailsFragment | null }) {
  if (!node?.contacts || node.contacts.length === 0) return null;
  return (
    <Card className="g-mb-4">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="phrases.headers.contacts" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="g-flex g-flex-wrap -g-m-2">
          {node?.contacts &&
            node?.contacts.map((contact) => {
              if (!contact) return null;
              return (
                <Card
                  className="g-px-2 g-py-2 md:g-px-4 md:g-py-3 g-flex-auto g-w-1/2 g-max-w-sm g-min-w-xs g-m-2 [&:target]:bg-red-500"
                  id={`contact${contact.key}`}
                  key={contact.key}
                >
                  <ContactHeader>
                    <ContactAvatar
                      firstName={contact.firstName}
                      lastName={contact.lastName}
                      organization={contact?.organization}
                    />
                    <ContactHeaderContent>
                      <ContactTitle
                        firstName={contact.firstName}
                        lastName={contact.lastName}
                      ></ContactTitle>
                      {contact.type && (
                        <ContactDescription>
                          <FormattedMessage id={`enums.gbifRole.${contact.type}`} />
                        </ContactDescription>
                      )}
                    </ContactHeaderContent>
                  </ContactHeader>
                  <ContactContent className="g-mb-2"></ContactContent>
                  <ContactActions>
                    {contact.email &&
                      contact.email.map((email) => <ContactEmail email={email} key={email} />)}
                    {contact.phone &&
                      contact.phone.map((tel) => <ContactTelephone tel={tel} key={tel} />)}
                  </ContactActions>
                </Card>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}

export function ParticipantNodeDescription({
  participant,
  node,
}: {
  participant?: ParticipantDetailsFragment | null;
  node?: NodeDetailsFragment | null;
}) {
  const headOfDelegation = node?.headOfDelegation?.[4];
  const participantNodeManager = node?.participantNodeManager?.[0];

  return (
    <Card className="g-mb-4">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="phrases.headers.description" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {node?.key === '7f48e0c8-5c96-49ec-b972-30748e339115' && (
            <div className="g-prose g-mb-4">
              <p>
                The Participant Node Managers Committee is a body that can endorse an institution to
                publish data through the GBIF network. Wherever possible, a national Node or
                thematic network is preferred to endorse an institution to help ensure the most
                relevant technical and administrative support is given. In the absence of such a
                suitable Node the committee can endorse publishers. To request endorsement please
                contact the <a href="mailto:helpdesk@gbif.org">GBIF Helpdesk</a>.
              </p>
            </div>
          )}
          <Properties className={'dataProse [&_a]:g-underline [&_a]:g-text-primary-500'}>
            <Property
              labelId="participant.memberStatus"
              value={participant?.participationStatus}
              formatter={(value) => (
                <FormattedMessage
                  id={`enums.participationStatus.${value}`}
                  defaultMessage={value}
                />
              )}
            />
            <Property
              labelId="participant.gbifParticipantSince"
              value={participant?.membershipStart}
              formatter={(v) => <FormattedDate value={v} year="numeric" />}
            />
            <Property
              labelId="participant.gbifRegion"
              value={participant?.gbifRegion}
              formatter={(v) => (
                <FormattedMessage id={`enums.gbifRegion.${v}`} defaultMessage={v} />
              )}
            />
            {headOfDelegation && (
              <Property
                labelId="participant.headOfDelegation"
                value={`${headOfDelegation.firstName} ${headOfDelegation.lastName}`}
                formatter={(v) => <Link to={`#contact${headOfDelegation.key}`}>{v}</Link>}
              />
            )}
            {!headOfDelegation && (
              <Property labelId="participant.headOfDelegation" value="Pending appointment">
                <span className="g-text-slate-500">
                  <FormattedMessage id="participant.pending" />
                </span>
              </Property>
            )}
            <Property
              labelId="participant.nodeName"
              value={participant?.title}
              formatter={(v) => <Link to={`#nodeAddress`}>{v}</Link>}
            />
            <Property
              labelId="participant.nodeEstablished"
              value={participant?.nodeEstablishmentDate}
              formatter={(v) => <FormattedDate value={v} year="numeric" />}
            />
            {participantNodeManager && (
              <Property
                labelId="participant.participantNodeManager"
                value={`${participantNodeManager.firstName} ${participantNodeManager.lastName}`}
                formatter={(v) => <Link to={`#contact${participantNodeManager.key}`}>{v}</Link>}
              />
            )}
            {!participantNodeManager && (
              <Property labelId="participant.participantNodeManager" value="Pending appointment">
                <span className="g-text-slate-500">
                  <FormattedMessage id="participant.pending" />
                </span>
              </Property>
            )}
          </Properties>
        </div>
      </CardContent>
    </Card>
  );
}

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
import EmptyValue from '@/components/emptyValue';
import { PaginationFooter } from '@/components/pagination';
import Properties, { Property } from '@/components/properties';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { InstallationDatasetsQuery, InstallationDatasetsQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { DatasetResult } from '@/routes/dataset/datasetResult';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useInstallationKeyLoaderData } from '.';

export function InstallationKeyAbout() {
  const { data } = useInstallationKeyLoaderData();
  const [offset, setOffset] = useState(0);

  const { installation } = data;

  const {
    data: datasetData,
    load,
    error,
    loading,
  } = useQuery<InstallationDatasetsQuery, InstallationDatasetsQueryVariables>(DATASET_QUERY, {
    throwAllErrors: false,
    notifyOnErrors: true,
    lazyLoad: true,
  });

  useEffect(() => {
    // load datasets and refresh when pages change
    if (!installation?.key) return;

    load({
      variables: {
        installation: installation.key,
        limit: 5,
        offset,
      },
    });
  }, [installation?.key, offset, load]);

  const datasets = datasetData?.installation?.dataset;

  if (!installation) throw new Error('Installation data is not available');
  if (!error && (loading || !datasetData)) return <CardListSkeleton />;

  console.log(installation);
  return (
    <div>
      <Card className="g-mb-4">
        <CardHeader>
          <CardTitle>
            <FormattedMessage id="phrases.headers.description" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="g-prose g-mb-6">
            {installation.description && (
              <div dangerouslySetInnerHTML={{ __html: installation.description }}></div>
            )}
            {!installation.description && <EmptyValue id={'phrases.notProvided'} />}
          </div>

          <div>
            <Properties className="dataProse [&_a]:g-underline" useDefaultTermWidths>
              <Property labelId={'installation.installationType'} value={installation.type}>
                <FormattedMessage id={`enums.installationType.${installation.type}`} />
              </Property>
              {installation.organization && (
                <Property labelId={'installation.hostedBy'} value={installation.organization}>
                  <DynamicLink
                    to={`/publisher/${installation.organization.key}`}
                    pageId="publisherKey"
                    variables={{ key: installation.organization.key }}
                    className="g-underline"
                  >
                    {installation.organization.title}
                  </DynamicLink>
                </Property>
              )}
              <Property
                labelId={'installation.endpoints'}
                value={installation.endpoints?.map((x) => x?.url)}
                formatter={(value: string) => (
                  <a href={value} target="_blank" rel="noopener noreferrer" className="g-underline">
                    {value}
                  </a>
                )}
              />
            </Properties>
          </div>
        </CardContent>
      </Card>

      {installation.contacts && installation.contacts.length > 0 && (
        <Card className="g-mb-4">
          <CardHeader>
            <CardTitle>
              <FormattedMessage id="phrases.headers.contacts" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="g-flex g-flex-wrap -g-m-2">
              {installation.contacts?.map((contact) => {
                return (
                  <Card className="g-px-2 g-py-2 md:g-px-4 md:g-py-3 g-flex-auto g-max-w-sm g-min-w-xs g-m-2">
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
                            <FormattedMessage id={`enums.role.${contact.type}`} />
                          </ContactDescription>
                        )}
                      </ContactHeaderContent>
                    </ContactHeader>
                    <ContactContent className="g-mb-2"></ContactContent>
                    <ContactActions>
                      {contact.email &&
                        contact.email.map((email) => <ContactEmail email={email} />)}
                      {contact.phone && contact.phone.map((tel) => <ContactTelephone tel={tel} />)}
                    </ContactActions>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {installation.dataset.count > 0 && (
        <>
          <CardHeader>
            <CardTitle>
              <FormattedMessage
                id="counts.nHostedDatasets"
                values={{ total: installation.dataset.count }}
              />
            </CardTitle>
          </CardHeader>
          {datasets &&
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
      )}
    </div>
  );
}

const DATASET_QUERY = /* GraphQL */ `
  query InstallationDatasets($installation: ID!, $limit: Int!, $offset: Int!) {
    installation(key: $installation) {
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

import { Failed, HelpText, HelpTextSkeleton } from '@/components/helpText';
import { Card } from '@/components/ui/smallCard';
import useQuery from '@/hooks/useQuery';
import { FormattedMessage } from 'react-intl';
import { DerivedDatasetAboutQuery, DerivedDatasetAboutQueryVariables } from '@/gql/graphql';
import { useEffect } from 'react';

const DERIVED_DATASET_ABOUT = /* GraphQL */ `
  query DerivedDatasetAbout($key: String!) {
    resource(id: $key) {
      ... on Tool {
        id
        title
        summary
        body
      }
    }
  }
`;

export function AboutContent() {
  return (
    <div>
      <div className="g-prose g-text-sm [&_h3]:g-m-0 [&_h3]:g-text-sm">
        <DerivedDatasetHelpText includeTitle />
      </div>
    </div>
  );
}

export function ApiContent({ id = '10.15468/dd.jdja49' }: { id?: string }) {
  return (
    <div className="g-text-sm g-prose">
      <div className="g-prose g-text-sm [&_h3]:g-m-0 [&_h3]:g-text-sm">
        <HelpText identifier={'api-access'} includeTitle />
      </div>
      <h4>
        <FormattedMessage id="apiHelp.examples" />
      </h4>
      <Card className="g-p-2 g-mb-2">
        <FormattedMessage id="apiHelp.singleDerivedDataset" /> <br />
        <a href={`https://api.gbif.org/v1/derivedDataset/${id}`}>
          https://api.gbif.org/v1/derivedDataset/{id}
        </a>
      </Card>
      <Card className="g-p-2 g-mb-2">
        <FormattedMessage id="apiHelp.derivedDatasetContributingDatasets" /> <br />
        <a href={`https://api.gbif.org/v1/derivedDataset/${id}/datasets`}>
          https://api.gbif.org/v1/derivedDataset/{id}/datasets
        </a>
      </Card>
    </div>
  );
}

export function DerivedDatasetHelpText({
  includeTitle,
  children,
  ...props
}: {
  includeTitle?: boolean;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const { data, error, loading, load } = useQuery<
    DerivedDatasetAboutQuery,
    DerivedDatasetAboutQueryVariables
  >(DERIVED_DATASET_ABOUT, { lazyLoad: true, variables: { key: '3mWxb8muy3eUjT1KRmtpXy' } });

  useEffect(() => {
    load({ key: '3mWxb8muy3eUjT1KRmtpXy' });
  }, [load]);

  const failed = !loading && error;
  return (
    <div {...props}>
      {(!data || loading) && <HelpTextSkeleton includeTitle={true} />}
      {failed && (
        <div style={{ textAlign: 'center' }}>
          <div>
            <Failed />
          </div>
        </div>
      )}
      {!loading && !error && (
        <>
          {children}
          {data?.resource?.body && (
            <div dangerouslySetInnerHTML={{ __html: data?.resource?.body }} />
          )}
        </>
      )}
    </div>
  );
}

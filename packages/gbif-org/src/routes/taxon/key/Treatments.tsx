import { Table } from '@/components/dashboard/shared';
import { HyperText } from '@/components/hyperText';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { TreatmentsQuery, TreatmentsQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { useEffect, useState } from 'react';
import { MdLink } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';
import { Paging } from './VernacularNameTable';

const limit = 10;

const Treatments = ({ taxonKey }: { taxonKey: string }) => {
  const [offset, setOffset] = useState(0);
  const intl = useIntl();
  const { data, load, loading, error } = useQuery<TreatmentsQuery, TreatmentsQueryVariables>(
    TREATMENTS_QUERY,
    {
      lazyLoad: true,
      throwAllErrors: true,
    }
  );
  /*   useEffect(() => {
    if (error) {
      toast({
        title: 'Unable to load treatments',
        description: error.message,
        variant: 'destructive',
      });
      console.error(error);
    }
  }, [error]); */

  useEffect(() => {
    if (taxonKey) {
      load({
        variables: {
          key: taxonKey,
        },
      });
    }
  }, [taxonKey, load]);

  return !error && data?.taxon?.treatments?.length ? (
    <Card className="g-mb-4" id="treatments">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="taxon.treatments" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="g-text-sm g-text-slate-500 g-mb-1">
          {!loading && data?.taxon?.treatments?.length && (
            <>
              <FormattedMessage
                id="counts.nResults"
                values={{ total: data?.taxon?.treatments?.length || 0 }}
              />
            </>
          )}
        </div>
        <div style={{ overflow: 'auto' }}>
          <Table removeBorder={false}>
            <tbody className="[&_td]:g-align-baseline [&_th]:g-text-sm [&_th]:g-font-normal">
              {data?.taxon?.treatments?.slice(offset, offset + limit).map((treatment, i) => (
                <tr key={i}>
                  <td>
                    <div className="g-mt-1 g-mb-1">
                      <div className="g-flex g-text-sm g-text-slate-500 g-mb-1">
                        <div className="g-flex-auto" />
                        <a href={treatment?.link} target="_blank" rel="noreferrer">
                          <MdLink /> {treatment?.publisherTitle}
                        </a>
                      </div>
                      <HyperText text={treatment?.citation} />
                      <div className="g-text-sm g-text-slate-500 g-mt-1">
                        <FormattedMessage id={`taxon.source`} />:{' '}
                        <DynamicLink pageId="datasetKey" variables={{ key: treatment?.datasetKey }}>
                          {treatment?.datasetTitle}
                        </DynamicLink>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paging
            next={() => setOffset(offset + limit)}
            prev={() => setOffset(offset - limit)}
            isFirstPage={offset === 0}
            isLastPage={offset + limit >= (data?.taxon?.treatments?.length || 0)}
          />
        </div>
      </CardContent>
    </Card>
  ) : null;
};

export default Treatments;

const TREATMENTS_QUERY = /* GraphQL */ `
  query Treatments($key: ID!) {
    taxon(key: $key) {
      key
      rank
      scientificName
      treatments {
        sourceTaxon {
          key
          nubKey
        }
        publisherKey
        publisherTitle
        publisherHomepage
        datasetTitle
        datasetKey
        citation
        link
      }
    }
  }
`;

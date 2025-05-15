import { Count } from '@/components/count';
import { Table } from '@/components/dashboard/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { InvasiveTaxonQuery, InvasiveTaxonQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Paging } from './VernacularNameTable';

const DEFAULT_LIMIT = 10;

export function InvasiveInCountries({ taxonKey }: { taxonKey: string }) {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const { data, load, loading, error } = useQuery<InvasiveTaxonQuery, InvasiveTaxonQueryVariables>(
    INVASIVE_TAXON,
    {
      lazyLoad: true,
      throwAllErrors: true,
    }
  );
  useEffect(() => {
    if (taxonKey) {
      load({
        variables: {
          key: taxonKey,
        },
      });
    }
  }, [taxonKey, load]);
  return loading || data?.taxon?.invasiveInCountries?.length === 0 ? null : (
    <Card className="g-mb-4" id="invasiveInCountries">
      <CardHeader>
        <CardTitle>
          <FormattedMessage
            id="taxon.recordedAsIntrodicedInNcontries"
            values={{ total: data?.taxon?.invasiveInCountries?.length }}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="g-text-sm g-text-slate-500 g-mb-1">
          <>
            <FormattedMessage
              id="counts.nResults"
              values={{ total: data?.taxon?.invasiveInCountries?.length || 0 }}
            />
            {(data?.taxon?.invasiveInCountries?.length || 0) > limit && (
              <Button
                variant="link"
                onClick={() => {
                  setLimit(data?.taxon?.invasiveInCountries?.length || 0);
                  setOffset(0);
                }}
              >
                <FormattedMessage id="taxon.showAll" />
              </Button>
            )}
            {limit > DEFAULT_LIMIT && (
              <Button
                variant="link"
                onClick={() => {
                  setLimit(DEFAULT_LIMIT);
                  setOffset(0);
                }}
              >
                <FormattedMessage id="taxon.showLess" />
              </Button>
            )}
          </>
        </div>
        <div style={{ overflow: 'auto' }}>
          <Table removeBorder={false}>
            <thead className="[&_th]:g-text-sm [&_th]:g-font-normal [&_th]:g-py-2 [&_th]:g-text-slate-500">
              <tr>
                <th className="g-text-start">
                  <FormattedMessage id={`taxon.recordedAsIntroducedIn`} />
                </th>
                <th className="g-text-start">
                  <FormattedMessage id={`taxon.accordingTo`} />
                </th>
                <th className="g-text-start">
                  <FormattedMessage id={`taxon.evidenceOfImpact`} />
                </th>
                <th className="g-text-start">
                  <FormattedMessage id={`taxon.occurrencesInGbif`} />
                </th>
              </tr>
            </thead>
            <tbody className="[&_td]:g-align-baseline [&_th]:g-text-sm [&_th]:g-font-normal">
              {data?.taxon?.invasiveInCountries?.slice(offset, offset + limit).map((e, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <FormattedMessage
                        id={`enums.countryCode.${e.country}`}
                        defaultMessage={e.country}
                      />
                    </td>
                    <td>
                      <DynamicLink pageId="datasetKey" variables={{ key: e.datasetKey }}>
                        {e.dataset}
                      </DynamicLink>
                    </td>

                    <td>
                      <DynamicLink
                        pageId="datasetKey"
                        variables={{ key: `${e.datasetKey}/species/${e?.taxonKey}/verbatim` }}
                      >
                        <FormattedMessage
                          id={`enums.yesNo.${e.isInvasive}`}
                          defaultMessage={e.isInvasive}
                        />
                      </DynamicLink>
                    </td>
                    <td>
                      {!e?.isSubCountry ? (
                        <Count
                          v1Endpoint="/occurrence/search"
                          params={{
                            taxonKey: e?.nubKey,
                            country: e.country,
                            limit: 0,
                          }}
                        />
                      ) : (
                        <FormattedMessage id="phrases.unknown" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Paging
            next={() => setOffset(offset + limit)}
            prev={() => setOffset(offset - limit)}
            isFirstPage={offset === 0}
            isLastPage={offset + limit >= (data?.taxon?.invasiveInCountries?.length || 0)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

const INVASIVE_TAXON = /* GraphQL */ `
  query InvasiveTaxon($key: ID!) {
    taxon(key: $key) {
      key
      invasiveInCountries {
        country
        isSubCountry
        datasetKey
        dataset
        scientificName
        nubKey
        taxonKey
        isInvasive
      }
    }
  }
`;

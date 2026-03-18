import { Count } from '@/components/count';
import { Table } from '@/components/dashboard/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { TaxonKeyQuery } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { FormattedMessage } from 'react-intl';
import { Paging } from './VernacularNameTable';
import { useState } from 'react';

const DEFAULT_LIMIT = 10;

export function InvasiveInCountries({ taxonInfo }: { taxonInfo: TaxonKeyQuery['taxonInfo'] }) {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  if (!taxonInfo?.taxon?.relatedInfo?.griis?.length) return null;

  const areaCount = taxonInfo.taxon.relatedInfo.griis.length ?? 0;

  return (
    <Card className="g-mb-4" id="invasiveInCountries">
      <CardHeader>
        <CardTitle>
          <FormattedMessage
            id="taxon.recordedAsIntrodicedInNcontries"
            values={{ total: areaCount }}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="g-text-sm g-text-slate-500 g-mb-1">
          <>
            <FormattedMessage id="counts.nResults" values={{ total: areaCount || 0 }} />
            {(areaCount || 0) > limit && (
              <Button
                variant="link"
                onClick={() => {
                  setLimit(areaCount);
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
                <th className="g-text-start g-whitespace-nowrap">
                  {/* <FormattedMessage id={`taxon.recordedAsIntroducedIn`} /> */}
                  Introduced in
                </th>
                <th className="g-text-start g-whitespace-nowrap">
                  <FormattedMessage id={`taxon.accordingTo`} />
                </th>
                {/* <th className="g-text-start">
                  <FormattedMessage id={`taxon.establishmentMeans`} />
                </th> */}
                <th className="g-text-end g-whitespace-nowrap">
                  <FormattedMessage id={`taxon.occurrencesInGbif`} />
                </th>
              </tr>
            </thead>
            <tbody className="[&_td]:g-align-baseline [&_th]:g-text-sm [&_th]:g-font-normal">
              {taxonInfo?.taxon?.relatedInfo?.griis?.slice(offset, offset + limit).map((e, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <FormattedMessage
                        id={`enums.countryCode.${e.countryCode}`}
                        defaultMessage={e.countryCode + ''}
                      />
                      {e.locality && !e.isCountry && (
                        <div className="g-text-slate-700 g-text-sm">{e.locality}</div>
                      )}
                    </td>
                    <td>
                      <DynamicLink
                        pageId="datasetKey"
                        variables={{ key: e.datasetKey }}
                        className="g-text-primary-500"
                      >
                        {e.dataset?.title || e.datasetKey}
                      </DynamicLink>
                    </td>

                    {/* <td>{e.establishmentMeans}</td> */}
                    <td className="g-text-end">
                      {e?.isCountry ? (
                        <Count
                          v1Endpoint="/occurrence/search"
                          params={{
                            taxonKey: taxonInfo?.taxon?.taxonID,
                            country: e.countryCode,
                            limit: 0,
                          }}
                        />
                      ) : (
                        <span className="g-text-slate-500">
                          <FormattedMessage id="phrases.unknown" />
                        </span>
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
            isLastPage={offset + limit >= areaCount}
          />
        </div>
      </CardContent>
    </Card>
  );
}

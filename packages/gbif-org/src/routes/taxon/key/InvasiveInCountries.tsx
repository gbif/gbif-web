import { Count } from '@/components/count';
import { Table } from '@/components/dashboard/shared';
import { SlowTaxonQuery } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Paging } from './VernacularNameTable';
const limit = 10;

export function InvasiveInCountries({ slowTaxon }: { slowTaxon: SlowTaxonQuery }) {
  const [offset, setOffset] = useState(0);

  return (
    <>
      <div className="g-text-sm g-text-slate-500 g-mb-1">
        <>
          <FormattedMessage
            id="counts.nResults"
            values={{ total: slowTaxon?.taxon?.invasiveInCountries?.length || 0 }}
          />
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
            {slowTaxon?.taxon?.invasiveInCountries?.slice(offset, offset + limit).map((e, i) => {
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
          isLastPage={offset + limit >= (slowTaxon?.taxon?.invasiveInCountries?.length || 0)}
        />
      </div>
    </>
  );
}

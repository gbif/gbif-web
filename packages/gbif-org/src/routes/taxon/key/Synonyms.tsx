import { Table } from '@/components/dashboard/shared';
import { Skeleton } from '@/components/ui/skeleton';

import { DynamicLink } from '@/reactRouterPlugins';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Paging } from './VernacularNameTable';
const limit = 10;

const Synonyms = ({ slowTaxon, total, loading, taxonKey }) => {
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (slowTaxon?.taxon?.synonyms?.results) {
      const synonyms = slowTaxon?.taxon?.synonyms?.results ?? [];
      const combinations = slowTaxon?.taxon?.combinations ?? [];

      const homoTypicSynonymKeys = new Set();
      for (let i = 0; i < combinations.length; i++) {
        homoTypicSynonymKeys.add(combinations?.[i]?.key);
      }

      for (let i = 0; i < synonyms.length; i++) {
        if (
          homoTypicSynonymKeys.has(synonyms[i].key) ||
          synonyms[i].key === slowTaxon?.taxon?.basionymKey
        ) {
          synonyms[i].taxonomicStatus = 'HOMOTYPIC_SYNONYM';
        }
      }
      setData(synonyms?.sort((a, b) => (a.taxonomicStatus === 'HOMOTYPIC_SYNONYM' ? -1 : 1)));
    }
  }, [
    taxonKey,
    slowTaxon?.taxon?.synonyms?.results,
    slowTaxon?.taxon?.combinations,
    slowTaxon?.taxon?.basionymKey,
  ]);

  if (total > 0 && (loading || !slowTaxon?.taxon?.synonyms?.results)) {
    return (
      <div>
        {Array.from({ length: total }).map((x, i) => (
          <React.Fragment key={i}>
            <Skeleton className="g-h-6" style={{ marginBottom: 12 }} />
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="g-text-sm g-text-slate-500 g-mb-1">
        {(loading || !slowTaxon?.taxon?.synonyms?.results) && (
          <Skeleton className="g-h-6 g-mb-2" style={{ width: '100px' }} />
        )}
        {!loading && slowTaxon?.taxon?.synonyms?.results && (
          <>
            <FormattedMessage
              id="counts.nResults"
              values={{ total: slowTaxon?.taxon?.synonyms?.results.length }}
            />
          </>
        )}
      </div>
      {!loading && (
        <div style={{ overflow: 'auto' }}>
          <Table removeBorder={false}>
            <tbody className="[&_td]:g-align-baseline [&_th]:g-text-sm [&_th]:g-font-normal">
              {data.slice(offset, offset + limit).map((e, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <div className="g-text-sm g-text-slate-500">
                        <span className="g-mr-1">
                          {e.taxonomicStatus == 'HOMOTYPIC_SYNONYM' ? '≡' : '='}
                        </span>
                        <DynamicLink pageId="speciesKey" variables={{ key: e?.key.toString() }}>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: e?.formattedName || e?.scientificName,
                            }}
                          />
                        </DynamicLink>
                      </div>
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
            isLastPage={offset + limit >= data.length}
          />
        </div>
      )}
    </>
  );
};

export default Synonyms;

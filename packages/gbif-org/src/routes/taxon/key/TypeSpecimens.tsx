import { Table } from '@/components/dashboard/shared';
import { Skeleton } from '@/components/ui/skeleton';
import { VocabularyValue } from '@/components/vocabularyValue';
import { TaxonTypeSpecimensQuery, TaxonTypeSpecimensQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import DNAsequence from './DNAsequence';
import { Paging } from './VernacularNameTable';
import { typeSpecimenPredicate } from './taxonUtil';

const limit = 10;

const TypeMaterial = ({ taxonKey, total }: { taxonKey: number; total: number }) => {
  const [offset, setOffset] = useState(0);
  const intl = useIntl();
  const {
    data: typeSecimens,
    load: typeSpecimensLoad,
    loading,
  } = useQuery<TaxonTypeSpecimensQuery, TaxonTypeSpecimensQueryVariables>(TYPE_MATERIAL_QUERY, {
    lazyLoad: true,
    throwAllErrors: true,
  });

  useEffect(() => {
    if (taxonKey) {
      typeSpecimensLoad({
        variables: {
          predicate: typeSpecimenPredicate(taxonKey),
          size: 50,
          from: 0,
        },
      });
    }
  }, [taxonKey, typeSpecimensLoad]);

  if (total && !typeSecimens?.occurrenceSearch?.documents?.total) {
    return (
      <div>
        {Array.from({ length: total }).map((x, i) => (
          <React.Fragment key={i}>
            <Skeleton className="g-h-6" style={{ marginBottom: 12, width: '60%' }} />
            <Skeleton className="g-h-6" style={{ marginBottom: 12 }} />
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="g-text-sm g-text-slate-500 g-mb-1">
        {!loading && typeSecimens?.occurrenceSearch?.documents?.total && (
          <>
            <FormattedMessage
              id="counts.nResults"
              values={{ total: typeSecimens?.occurrenceSearch?.documents?.total || total }}
            />
          </>
        )}
      </div>
      <div style={{ overflow: 'auto' }}>
        <Table removeBorder={false}>
          <tbody className="[&_td]:g-align-baseline [&_th]:g-text-sm [&_th]:g-font-normal">
            {typeSecimens?.occurrenceSearch?.documents?.results
              .slice(offset, offset + limit)
              .map((occ, i) =>
                occ?.typeStatus
                  ?.filter((ts) => !!ts)
                  .map((ts, j) => (
                    <tr key={`${i}-${j}`}>
                      <td>
                        <VocabularyValue vocabulary="TypeStatus" value={ts} />{' '}
                        <FormattedMessage id={`taxon.specimenIsTypeOf`} />{' '}
                        <span>{occ.typifiedName || occ.scientificName}</span>
                        {/* <FormattedMessage
                          id={`taxon.specimenIsTypeOf`}
                          values={{
                            typeStatus: intl.formatMessage({ id: `enums.typeStatus.${ts}` }),
                            name: occ.typifiedName || occ.scientificName,
                          }}
                        /> */}
                        {occ.recordedBy && (
                          <span>
                            <span className="g-m-1">{occ.recordedBy}</span>
                            {occ.year && <span className="g-m-1"> ({occ.year})</span>}
                            {occ.country && <span className="g-m-1"> {occ.country}</span>}.
                          </span>
                        )}
                        <DynamicLink
                          pageId="occurrenceKey"
                          variables={{ key: occ?.key ? occ.key.toString() : '' }}
                        >
                          {occ.catalogNumber && (
                            <span className="g-text-sm g-text-slate-500 g-ml-1">
                              {occ.institutionCode && (
                                <span className="g-m-1">{occ.institutionCode}</span>
                              )}
                              {occ.collectionCode && (
                                <span className="g-m-1"> {occ.collectionCode}</span>
                              )}
                              <span className="g-m-1"> {occ.catalogNumber}</span>
                            </span>
                          )}
                          {!occ.catalogNumber && (
                            <span className="g-text-sm g-text-slate-500 g-ml-1">
                              {occ.occurrenceID}
                            </span>
                          )}
                        </DynamicLink>
                        {occ.extensions?.dnaDerivedData?.[0]?.dna_sequence && (
                          <DNAsequence
                            sequence={occ.extensions?.dnaDerivedData?.[0].dna_sequence}
                            marker={occ.extensions?.dnaDerivedData?.[0]?.['MIXS:0000044']}
                            limit={200}
                            className={''}
                          />
                        )}
                        {occ?.dataset && (
                          <div className="g-text-sm g-text-slate-500">
                            <FormattedMessage id={`taxon.source`} />:{' '}
                            <DynamicLink pageId="datasetKey" variables={{ key: occ?.dataset?.key }}>
                              {occ?.dataset?.title}
                            </DynamicLink>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
              )}
          </tbody>
        </Table>
        <Paging
          next={() => setOffset(offset + limit)}
          prev={() => setOffset(offset - limit)}
          isFirstPage={offset === 0}
          isLastPage={offset + limit >= typeSecimens?.occurrenceSearch?.documents?.total}
        />
      </div>
    </>
  );
};

export default TypeMaterial;

const TYPE_MATERIAL_QUERY = /* GraphQL */ `
  query TaxonTypeSpecimens($from: Int, $size: Int, $predicate: Predicate) {
    occurrenceSearch(predicate: $predicate) {
      _meta
      documents(from: $from, size: $size) {
        from
        size
        total
        results {
          key
          taxonKey
          scientificName
          typeStatus
          typifiedName
          catalogNumber
          recordedBy
          year
          country
          institutionCode
          collectionCode
          occurrenceID
          dataset {
            key
            title
          }
          extensions {
            dnaDerivedData
          }
        }
      }
    }
  }
`;

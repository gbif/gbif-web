import { Table } from '@/components/dashboard/shared';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { VocabularyValue } from '@/components/vocabularyValue';
import {
  PredicateType,
  TaxonKeyQuery,
  TaxonTypeSpecimensQuery,
  TaxonTypeSpecimensQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import DNAsequence from './DNAsequence';
import { Paging } from '@/components/paging';
import { ConceptValue } from '@/components/conceptValue';
import { Tag } from '@/components/resultCards';
import { BulletList } from '@/components/bulletList';
import { MdPerson } from 'react-icons/md';

const DEFAULT_LIMIT = 10;

const TypeMaterial = ({
  taxonInfo,
  onHasData,
}: {
  taxonInfo: TaxonKeyQuery['taxonInfo'];
  onHasData?: (hasData: boolean) => void;
}) => {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [filteredData, setFilteredData] = useState<
    (TaxonTypeSpecimensQuery['occurrenceSearch']['documents']['results'][number] | null)[]
  >([]);
  const [isSynonym, setIsSynonym] = useState(false);
  const { data: typeSecimens, load: typeSpecimensLoad } = useQuery<
    TaxonTypeSpecimensQuery,
    TaxonTypeSpecimensQueryVariables
  >(TYPE_MATERIAL_QUERY, {
    lazyLoad: true,
    throwAllErrors: true,
  });

  useEffect(() => {
    if (!taxonInfo?.taxon) return;
    const { taxon } = taxonInfo;
    const { acceptedNameUsageID, taxonID } = taxon;
    const synonym = !!acceptedNameUsageID && acceptedNameUsageID !== taxonID;
    setIsSynonym(synonym);
    if (taxonInfo.taxon.taxonID) {
      setFilteredData([]);
      typeSpecimensLoad({
        variables: {
          predicate: getTypeSpecimenPredicate({
            taxonKey: synonym ? acceptedNameUsageID : taxonID,
            checklistKey: taxon.datasetKey,
          }),
          size: 50,
          from: 0,
        },
      });
    }
  }, [taxonInfo, typeSpecimensLoad]);

  useEffect(() => {
    if (
      typeSecimens?.occurrenceSearch?.documents.results &&
      typeSecimens.occurrenceSearch.documents.results.length
    ) {
      setFilteredData(
        (typeSecimens?.occurrenceSearch?.documents?.results || []).filter((x) => {
          if (!isSynonym) {
            return x?.classification?.usage?.rank === taxonInfo?.taxon?.taxonRank;
          } else {
            return (
              x?.originalUsageMatch?.usage?.key === (taxonInfo?.taxon?.taxonID || '').toString() &&
              x?.originalUsageMatch?.diagnostics?.matchType === 'EXACT' &&
              (x?.originalUsageMatch?.diagnostics?.confidence ?? 0) > 90
            );
          }
        })
      );
    } else {
      onHasData?.(false);
    }
  }, [typeSecimens?.occurrenceSearch?.documents?.results, isSynonym, taxonInfo, onHasData]);

  useEffect(() => {
    onHasData?.(filteredData.length > 0);
  }, [filteredData.length, onHasData]);

  return filteredData.length > 0 ? (
    <Card className="g-mb-4" id="typeMaterial">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="taxon.typeMaterial" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="g-text-sm g-text-slate-500 g-mb-1">
          <>
            <FormattedMessage id="counts.nResults" values={{ total: filteredData.length }} />
            {filteredData.length > limit && (
              <Button
                variant="link"
                onClick={() => {
                  setLimit(filteredData.length);
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
          <ul>
            {filteredData.slice(offset, offset + limit).map((occ, i) =>
              occ?.typeStatus
                ?.filter((ts) => !!ts)
                .map((ts, j) => (
                  <li key={`${i}-${j}`} className="g-mb-4">
                    <Tag type="INFO" className="g-me-1">
                      <ConceptValue vocabulary="TypeStatus" name={ts} />
                    </Tag>
                    <DynamicLink
                      className="g-underline"
                      pageId="occurrenceKey"
                      variables={{ key: occ?.key ? occ.key.toString() : '' }}
                    >
                      <span>
                        {occ?.originalUsageMatch?.usage?.name ||
                          occ.typifiedName ||
                          occ.classification.usage.name}
                      </span>
                    </DynamicLink>
                    {occ.recordedBy && (
                      <span>
                        <span className="g-mx-1">{occ.recordedBy}</span>
                        {occ.year && <span className="g-mx-1"> ({occ.year})</span>}
                        {occ.country && <span className="g-mx-1"> {occ.country}</span>}.
                      </span>
                    )}

                    {occ.catalogNumber && (
                      <BulletList className="g-text-sm g-text-slate-500">
                        {occ.institutionCode && <li>{occ.institutionCode}</li>}
                        {occ.collectionCode && <li> {occ.collectionCode}</li>}
                        <li> {occ.catalogNumber}</li>
                      </BulletList>
                    )}

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
                        <DynamicLink
                          className="g-underline"
                          pageId="datasetKey"
                          variables={{ key: occ?.dataset?.key }}
                        >
                          {occ?.dataset?.title}
                        </DynamicLink>
                      </div>
                    )}
                  </li>
                ))
            )}
          </ul>
          <Paging
            next={() => setOffset(offset + limit)}
            prev={() => setOffset(offset - limit)}
            isFirstPage={offset === 0}
            isLastPage={offset + limit >= typeSecimens?.occurrenceSearch?.documents?.total}
          />
        </div>
      </CardContent>
    </Card>
  ) : null;
};

export default function TypeMaterialCard({
  taxonInfo,
  onHasData,
}: {
  taxonInfo: TaxonKeyQuery['taxonInfo'];
  onHasData?: (hasData: boolean) => void;
}) {
  return (
    <ErrorBoundary type="BLOCK" errorMessage={<FormattedMessage id="taxon.errors.typeMaterial" />}>
      <TypeMaterial taxonInfo={taxonInfo} onHasData={onHasData} />
    </ErrorBoundary>
  );
}

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
          originalUsageMatch {
            diagnostics {
              matchType
              confidence
            }

            usage {
              name
              key
            }
          }
          classification {
            usage {
              name
              rank
            }
          }
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

function getTypeSpecimenPredicate({
  taxonKey,
  checklistKey,
}: {
  taxonKey: string;
  checklistKey?: string;
}) {
  return {
    type: PredicateType.And,
    predicates: [
      {
        type: PredicateType.Not,
        predicate: {
          type: PredicateType.Equals,
          key: 'typeStatus',
          value: 'NotAType',
        },
      },
      {
        type: PredicateType.Not,
        predicate: {
          type: PredicateType.Equals,
          key: 'datasetKey',
          value: '55b9ac33-0532-46d3-9796-c4c157f2b097',
        },
      },
      {
        type: PredicateType.IsNotNull,
        key: 'typeStatus',
      },
      {
        type: PredicateType.Equals,
        key: 'taxonKey',
        value: taxonKey,
        checklistKey: checklistKey,
      },
    ],
  };
}

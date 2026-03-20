import { ErrorBlock } from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import rankEnum from '@/enums/basic/rank.json';
import {
  TaxonKeyQuery,
  TaxonPageChildrenQuery,
  TaxonPageChildrenQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
// import { getChildren } from '../search/views/tree/treeUtil';

const primaryChecklist = '7ddf754f-d193-4cc9-b351-99906754a03b'; // TODO taxonapi: move to env file
const fmIndex = rankEnum.indexOf('FAMILY');

const isFamilyOrAbove = (rank: string) => {
  return rank === 'UNRANKED' || rankEnum.indexOf(rank) <= fmIndex;
};
const ClassificationSideBar = ({ taxonInfo }: { taxonInfo: TaxonKeyQuery['taxonInfo'] }) => {
  const [limit, setLimit] = useState(20);
  const { data, error, loading, load } = useQuery<
    TaxonPageChildrenQuery,
    TaxonPageChildrenQueryVariables
  >(CHILDREN, {
    lazyLoad: true,
  });
  const isPrimaryTaxonomy = taxonInfo?.taxon?.datasetKey === primaryChecklist;

  useEffect(() => {
    if (taxonInfo?.taxon?.taxonID && taxonInfo?.taxon?.datasetKey) {
      load({
        variables: { key: taxonInfo.taxon.taxonID, datasetKey: taxonInfo.taxon.datasetKey, limit },
      });
    }
  }, [taxonInfo?.taxon?.taxonID, taxonInfo?.taxon?.datasetKey, limit, load]);

  // const cancelChildrenRef = useRef(null);

  //   useEffect(() => {
  //     // setChildren([]);
  //     setOffset(0);
  //     setEndOfRecords(false);
  //     if (taxon?.key) {
  //       if (typeof cancelChildrenRef.current === 'function') {
  //         cancelChildrenRef.current();
  //       }
  //       loadChildren({ key: taxon.key, limit, offset: 0, keepExisting: false });
  //     }
  //   }, [taxon?.key]);

  //   const loadChildren = async ({
  //     key,
  //     limit,
  //     offset,
  //     keepExisting = false,
  //   }: {
  //     key: string;
  //     limit: number;
  //     offset: number;
  //     keepExisting?: boolean;
  //   }) => {
  //     try {
  //       setChildrenLoading(true);
  //       const { promise, cancel } = getChildren({ key, limit, offset });
  //       cancelChildrenRef.current = cancel;
  //       const tx = await promise;

  //       cancelChildrenRef.current = null;
  //       setChildren([...(keepExisting ? children : []), ...(tx.children.results || [])]);
  //       setOffset(tx.children.offset + limit);
  //       setEndOfRecords(tx.children.endOfRecords);
  //       setChildrenLoading(false);
  //     } catch (error) {
  //       setChildrenLoading(false);
  //       if (error !== 'CANCEL_REQUEST') {
  //         setError(error);
  //       }

  //       console.error('Error loading children:', error);
  //     }
  //   };
  // )

  if (!taxonInfo?.classification) return null;
  const taxon = taxonInfo.taxon;
  if (!taxon) return null;
  const classification = [...(taxonInfo.classification ?? [])].reverse();
  const children = data?.taxon?.children;

  return (
    <div className="g-mb-2">
      <div>
        <ul>
          {classification.map((parent, idx) => (
            <li key={parent.taxonID}>
              <div className="g-text-sm g-text-slate-500">
                <FormattedMessage
                  id={`enums.taxonRank.${parent.taxonRank}`}
                  defaultMessage={parent.taxonRank || ''}
                />
              </div>{' '}
              <DynamicLink
                className={`g-underline g-pointer-events-auto g.ml-${idx} ${
                  !isFamilyOrAbove(parent.taxonRank ?? '') ? 'g-italic' : ''
                }`}
                // TODO: This link is using two methods of navigation (pageid + variables method and to method). One should be removed
                pageId={isPrimaryTaxonomy ? 'speciesKey' : 'datasetKey'}
                variables={
                  isPrimaryTaxonomy
                    ? { key: parent.taxonID }
                    : { key: `${taxon?.datasetKey}/species/${parent.taxonID}` }
                }
              >
                {parent?.scientificName}
              </DynamicLink>
            </li>
          ))}
        </ul>
      </div>
      <div
        style={{ borderLeftColor: 'rgb(var(--primary500))', borderLeftWidth: '4px' }}
        className="g-pl-2 g-mb-2 g-mt-2 "
      >
        <div style={{ width: '65px' }} className="g-text-sm g-text-slate-500">
          <FormattedMessage
            id={`enums.taxonRank.${taxon.taxonRank}`}
            defaultMessage={taxon.taxonRank || ''}
          />
        </div>{' '}
        <span className={`${!isFamilyOrAbove(taxon.taxonRank) ? 'g-italic' : ''}`}>
          {taxon?.scientificName}
        </span>
      </div>
      {error && (
        <ErrorBlock
          errorMessage={
            <FormattedMessage
              id="taxon.errors.classificationChildren"
              defaultMessage="Error loading children of this Taxon"
            />
          }
        />
      )}

      {children && children.count > 0 && (
        <div style={{ paddingLeft: '20px' }}>
          <ul>
            {children?.results.map((child, idx) => (
              <li key={child.taxonID}>
                {child?.taxonRank !== children?.results[idx - 1]?.taxonRank && (
                  <div
                    style={{ width: '65px' }}
                    className={`g-text-sm g-text-slate-500 ${idx > 0 ? 'g-mt-2' : ''}`}
                  >
                    <FormattedMessage
                      id={`enums.taxonRank.${child.taxonRank}`}
                      defaultMessage={child.taxonRank || ''}
                    />
                  </div>
                )}
                <DynamicLink
                  className={`g-underline g-pointer-events-auto g.ml-${idx}`}
                  pageId={isPrimaryTaxonomy ? 'speciesKey' : 'datasetKey'}
                  variables={
                    isPrimaryTaxonomy
                      ? { key: child.taxonID }
                      : { key: `${taxon.datasetKey}/species/${child.taxonID}` }
                  }
                >
                  <span className={`${!isFamilyOrAbove(child.taxonRank) ? 'g-italic' : ''}`}>
                    {child?.scientificName}
                  </span>
                </DynamicLink>{' '}
                {(child.children ?? 0) > 0 && (
                  <>({<FormattedNumber value={child.children ?? 0} />})</>
                )}
              </li>
            ))}
          </ul>
          {!children.endOfRecords && (
            <Button
              disabled={loading}
              type="button"
              variant="link"
              onClick={() => setLimit(limit + 20)}
            >
              {loading ? (
                <FormattedMessage id="search.loading" />
              ) : (
                <FormattedMessage id="search.loadMore" />
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassificationSideBar;

const CHILDREN = /* GraphQL */ `
  query TaxonPageChildren($key: ID!, $datasetKey: ID!, $limit: Int, $offset: Int) {
    taxon(key: $key, datasetKey: $datasetKey) {
      children(limit: $limit, offset: $offset) {
        offset
        limit
        endOfRecords
        count
        results {
          taxonID
          scientificName
          taxonRank
          children
        }
      }
    }
  }
`;

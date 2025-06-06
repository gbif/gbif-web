import { ErrorBlock } from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import rankEnum from '@/enums/basic/rank.json';
import { DynamicLink } from '@/reactRouterPlugins';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { getChildren } from '../search/views/tree/treeUtil';

const fmIndex = rankEnum.indexOf('FAMILY');

const isFamilyOrAbove = (rank: string) => {
  return rank === 'UNRANKED' || rankEnum.indexOf(rank) <= fmIndex;
};
const ClassificationSideBar = ({ taxon }) => {
  const [children, setChildren] = useState([]);
  const [childrenLoading, setChildrenLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [endOfRecords, setEndOfRecords] = useState(false);
  const [error, setError] = useState(null);
  const limit = 50;

  const cancelChildrenRef = useRef(null);

  useEffect(() => {
    setChildren([]);
    setOffset(0);
    setEndOfRecords(false);
    if (taxon?.key) {
      if (typeof cancelChildrenRef.current === 'function') {
        cancelChildrenRef.current();
      }
      loadChildren({ key: taxon.key, limit, offset: 0, keepExisting: false });
    }
  }, [taxon?.key]);

  const loadChildren = async ({
    key,
    limit,
    offset,
    keepExisting = false,
  }: {
    key: string;
    limit: number;
    offset: number;
    keepExisting?: boolean;
  }) => {
    try {
      setChildrenLoading(true);
      const { promise, cancel } = getChildren({ key, limit, offset });
      cancelChildrenRef.current = cancel;
      const tx = await promise;

      cancelChildrenRef.current = null;
      setChildren([...(keepExisting ? children : []), ...(tx.children.results || [])]);
      setOffset(tx.children.offset + limit);
      setEndOfRecords(tx.children.endOfRecords);
      setChildrenLoading(false);
    } catch (error) {
      setChildrenLoading(false);
      if (error !== 'CANCEL_REQUEST') {
        setError(error);
      }

      console.error('Error loading children:', error);
    }
  };
  return (
    <div className="g-mb-2">
      <div>
        <ul>
          {taxon.parents.map((parent, idx) => (
            <li key={parent.key}>
              <div className="g-text-sm g-text-slate-500">
                <FormattedMessage
                  id={`enums.taxonRank.${parent.rank}`}
                  defaultMessage={parent.rank || ''}
                />
              </div>{' '}
              <DynamicLink
                className={`g-underline g-pointer-events-auto g.ml-${idx} ${
                  !isFamilyOrAbove(parent.rank) ? 'g-italic' : ''
                }`}
                // TODO: This link is using two methods of navigation (pageid + variables method and to method). One should be removed
                pageId={taxon?.key === taxon?.nubKey ? 'speciesKey' : 'datasetKey'}
                variables={
                  taxon?.key === taxon?.nubKey
                    ? { key: parent.key }
                    : { key: `${taxon.datasetKey}/species/${parent.key}` }
                }
              >
                {parent?.canonicalName || parent?.scientificName}
                {/*                 <span dangerouslySetInnerHTML={{ __html: parent.formattedName }} />
                 */}{' '}
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
            id={`enums.taxonRank.${taxon.rank}`}
            defaultMessage={taxon.rank || ''}
          />
        </div>{' '}
        <span className={`${!isFamilyOrAbove(taxon.rank) ? 'g-italic' : ''}`}>
          {taxon?.canonicalName || taxon?.scientificName}
        </span>
        {/*         <span dangerouslySetInnerHTML={{ __html: taxon?.formattedName }} />
         */}{' '}
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

      {!error && children.length > 0 && (
        <div style={{ paddingLeft: '20px' }}>
          {/* <span className="g-text-sm g-text-slate-500 g-mb-1">
            <FormattedMessage id="taxon.immediateChildren" />
          </span> */}
          <ul>
            {children.map((child, idx) => (
              <li key={child.key}>
                {child?.rank !== children?.[idx - 1]?.rank && (
                  <div
                    style={{ width: '65px' }}
                    className={`g-text-sm g-text-slate-500 ${idx > 0 ? 'g-mt-2' : ''}`}
                  >
                    <FormattedMessage
                      id={`enums.taxonRank.${child.rank}`}
                      defaultMessage={child.rank || ''}
                    />
                  </div>
                )}
                <DynamicLink
                  className={`g-underline g-pointer-events-auto g.ml-${idx}`}
                  // TODO: This link is using two methods of navigation (pageid + variables method and to method). One should be removed
                  pageId={taxon?.key === taxon?.nubKey ? 'speciesKey' : 'datasetKey'}
                  variables={
                    taxon?.key === taxon?.nubKey
                      ? { key: child.key }
                      : { key: `${taxon.datasetKey}/species/${child.key}` }
                  }
                >
                  <span className={`${!isFamilyOrAbove(child.rank) ? 'g-italic' : ''}`}>
                    {child?.canonicalName || child?.scientificName}
                  </span>
                  {/*                   <span dangerouslySetInnerHTML={{ __html: child?.formattedName }} />
                   */}
                </DynamicLink>{' '}
                {child.numDescendants > 0 && (
                  <>({<FormattedNumber value={child.numDescendants} />})</>
                )}
              </li>
            ))}
          </ul>
          {!endOfRecords && (
            <Button
              disabled={childrenLoading}
              type="button"
              variant="link"
              onClick={() => loadChildren({ key: taxon.key, limit, offset, keepExisting: true })}
            >
              {childrenLoading ? (
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

import { Button } from '@/components/ui/button';
import { DynamicLink } from '@/reactRouterPlugins';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { getChildren } from '../search/views/tree/treeUtil';

import rankEnum from '@/enums/basic/rank.json';

const fmIndex = rankEnum.indexOf('FAMILY');

const isFamilyOrAbove = (rank: string) => {
  return rank === 'UNRANKED' || rankEnum.indexOf(rank) <= fmIndex;
};
const ClassificationSideBar = ({ taxon }) => {
  const [children, setChildren] = useState([]);
  const [childrenLoading, setChildrenLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [endOfRecords, setEndOfRecords] = useState(false);
  const limit = 25;

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

      console.error('Error loading children:', error);
    }
  };
  return (
    <>
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
                to={`/species/${parent.key}`}
                pageId="speciesKey"
                variables={{ key: parent.key }}
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
      {children.length > 0 && (
        <div style={{ paddingLeft: '20px' }}>
          <span className="g-text-sm g-text-slate-500 g-mb-1">
            <FormattedMessage id="taxon.immediateChildren" />
          </span>
          <ul>
            {children.map((child, idx) => (
              <li key={child.key}>
                <div style={{ width: '65px' }} className="g-text-sm g-text-slate-500">
                  <FormattedMessage
                    id={`enums.taxonRank.${child.rank}`}
                    defaultMessage={child.rank || ''}
                  />
                </div>{' '}
                <DynamicLink
                  className={`g-underline g-pointer-events-auto g.ml-${idx}`}
                  // TODO: This link is using two methods of navigation (pageid + variables method and to method). One should be removed
                  to={`/species/${child.key}`}
                  pageId="speciesKey"
                  variables={{ key: child.key }}
                >
                  <span className={`${!isFamilyOrAbove(child.rank) ? 'g-italic' : ''}`}>
                    {child?.canonicalName || child?.scientificName}
                  </span>{' '}
                  {/*                   <span dangerouslySetInnerHTML={{ __html: child?.formattedName }} />
                   */}{' '}
                </DynamicLink>{' '}
                {child.numDescendants > 0 && <>({child.numDescendants})</>}
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
    </>
  );
};

export default ClassificationSideBar;

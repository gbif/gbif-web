import { DynamicLink } from '@/reactRouterPlugins';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { getChildren } from '../search/views/tree/treeUtil';
const ClassificationSideBar = ({ taxon }) => {
  const [children, setChildren] = useState([]);
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
      const { promise, cancel } = getChildren({ key, limit, offset });
      cancelChildrenRef.current = cancel;
      const tx = await promise;
      cancelChildrenRef.current = null;
      setChildren([...(keepExisting ? children : []), ...(tx.children.results || [])]);
      setOffset(tx.children.offset + limit);
      setEndOfRecords(tx.children.endOfRecords);
    } catch (error) {
      console.error('Error loading children:', error);
    }
  };
  return (
    <>
      <div>
        <ul>
          {taxon.parents.map((parent, idx) => (
            <li key={parent.key}>
              <div className="g-text-xsm g-text-slate-500">
                <FormattedMessage
                  id={`enums.taxonRank.${parent.rank}`}
                  defaultMessage={parent.rank || ''}
                />
              </div>{' '}
              <DynamicLink
                className={`g-underline g-pointer-events-auto g.ml-${idx}`}
                // TODO: This link is using two methods of navigation (pageid + variables method and to method). One should be removed
                to={`/species/${parent.key}`}
                pageId="speciesKey"
                variables={{ key: parent.key }}
              >
                {parent.scientificName}
              </DynamicLink>
            </li>
          ))}
        </ul>
      </div>
      <div
        style={{ borderLeftColor: 'rgb(var(--primary500))', borderLeftWidth: '4px' }}
        className="g-pl-2 g-mb-2 g-mt-2"
      >
        <div style={{ width: '65px' }} className="g-text-sm g-text-slate-500">
          <FormattedMessage
            id={`enums.taxonRank.${taxon.rank}`}
            defaultMessage={taxon.rank || ''}
          />
        </div>{' '}
        {taxon?.scientificName}
      </div>
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
                {child.scientificName}
              </DynamicLink>
            </li>
          ))}
        </ul>
        {!endOfRecords && (
          <button
            className="g-text-sm g-text-slate-500 g-mt-2 g-underline"
            onClick={() => loadChildren({ key: taxon.key, limit, offset, keepExisting: true })}
          >
            <FormattedMessage id="actions.loadMore" />
          </button>
        )}
      </div>
    </>
  );
};

export default ClassificationSideBar;

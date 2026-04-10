import { FilterIcon } from '@/components/icons/icons';
import { TaxonChildrenQuery, TaxonChildrenQueryVariables } from '@/gql/graphql';
import { useQuery } from '@/hooks/useQuery';
import {
  createContext,
  useContext,
  useState,
  useId,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

// --- TYPES ---
export interface TaxonData {
  taxonID: string;
  label: string;
  rank: string;
  status?: string;
  childrenCount: number;
  children?: TaxonData[];
}

interface TreeItemContextProps {
  isExpanded: boolean;
  toggle: () => void;
  childrenCount: number;
  contentId: string;
  buttonId: string;
  children: TaxonData[] | null;
  error: Error | null;
  loading: boolean;
  loadMore: () => void;
  endOfRecords: boolean;
}

const LIMIT = 10;

const TreeItemContext = createContext<TreeItemContextProps | undefined>(undefined);

const useTreeItem = () => {
  const context = useContext(TreeItemContext);
  if (!context) throw new Error('Tree sub-components must be used within a TreeItem');
  return context;
};

// --- COMPONENTS ---

/** * 1. THE ROOT LIST (<ul>)
 */
export const Tree = ({ children }: { children: ReactNode }) => (
  <nav className="g-w-full g-max-w-3xl" aria-label="Taxonomy Explorer">
    {/* The top-level list */}
    <ul className="g-m-0 g-p-0 g-list-none">{children}</ul>
  </nav>
);

const TAXON_CHILDREN = /* GraphQL */ `
  query TaxonChildren($limit: Int, $offset: Int, $datasetKey: ID, $key: ID!) {
    taxon(datasetKey: $datasetKey, key: $key) {
      children(limit: $limit, offset: $offset) {
        count
        endOfRecords
        limit
        offset
        results {
          taxonID
          label: scientificName
          rank: taxonRank
          status: taxonomicStatus
          childrenCount: children
        }
      }
    }
  }
`;

/** * 2. THE LIST ITEM (<li>)
 * This must wrap both the Header and any nested Groups.
 */
export const TreeItem = ({
  children,
  childrenCount,
  defaultExpanded = false,
  taxonID,
}: {
  children: ReactNode;
  childrenCount: number;
  defaultExpanded?: boolean;
  taxonID: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentId = useId();
  const buttonId = useId();
  const { data, error, loading, load } = useQuery<TaxonChildrenQuery, TaxonChildrenQueryVariables>(
    TAXON_CHILDREN,
    { lazyLoad: true }
  );
  const [offset, setOffset] = useState(0);
  const [decendants, setDecendants] = useState<TaxonData[]>([]);

  const toggle = () => {
    if (isExpanded) {
      setOffset(0);
      setDecendants([]);
    }
    setIsExpanded(!isExpanded);
  };

  const loadMore = useCallback(() => {
    if (isExpanded && childrenCount > 0) {
      const newOffset = offset + LIMIT;
      load({ variables: { key: taxonID, limit: LIMIT, offset: newOffset } });
      setOffset(newOffset);
    }
  }, [taxonID, load, offset, isExpanded, childrenCount]);

  useEffect(() => {
    if (data?.taxon?.children?.results) {
      const results = data?.taxon?.children?.results as TaxonData[];
      // make sure we only add each unique taxonID once
      setDecendants((prev) => [
        ...prev,
        ...(results?.filter((r) => !prev.some((p) => p.taxonID === r.taxonID)) ?? []),
      ]);
    }
  }, [data]);

  useEffect(() => {
    if (isExpanded && childrenCount > 0) {
      load({ variables: { key: taxonID, limit: LIMIT, offset: 0 } });
    }
  }, [load, taxonID, isExpanded, childrenCount]);

  return (
    <TreeItemContext.Provider
      value={{
        isExpanded,
        toggle,
        childrenCount,
        contentId,
        buttonId,
        children: decendants,
        error: error ?? null,
        loading,
        loadMore,
        endOfRecords: data?.taxon?.children?.endOfRecords ?? false,
      }}
    >
      <li className="g-list-none g-relative">{children}</li>
    </TreeItemContext.Provider>
  );
};

/** * 3. THE ITEM HEADER
 * Usually contains the toggle and the labels/actions.
 */
export const TreeHeader = ({ children }: { children: ReactNode }) => (
  <div className="g-flex g-gap-2 g-px-2 g-py-1 g-rounded-md hover:g-bg-gray-50 g-group g-items-center">
    {children}
  </div>
);

export const TreeNodeLabel = ({ datasetKey, taxon }: { datasetKey: string; taxon: TaxonData }) => (
  <div className="g-flex-1 g-flex g-items-center g-justify-between">
    <div className="g-flex-1 g-flex g-items-start">
      <div className="g-flex-grow">
        {/* TODO taxonapi: fix the link so it accounts for primary vs dataset */}
        <Link
          to={`/dataset/${datasetKey}/taxon/${taxon.taxonID}`}
          className="g-text-primary-700 g-whitespace-nowrap"
        >
          <span dangerouslySetInnerHTML={{ __html: taxon.label }} />
        </Link>
      </div>
      <div className="g-text-gray-500 g-ms-3 g-flex-none">
        <FormattedMessage id={`enums.taxonRank.${taxon.rank}`} />
      </div>
    </div>
  </div>
);

/** * 4. THE NESTED LIST (<ul>)
 * Lives inside the parent <li>, creating the hierarchy.
 */
export const TreeGroup = ({
  nodeRender,
}: {
  nodeRender: ({ child }: { child: TaxonData }) => ReactNode;
}) => {
  const { isExpanded, contentId, buttonId, children, endOfRecords, loading, error, loadMore } =
    useTreeItem();
  return (
    <ul
      id={contentId}
      role="region"
      aria-labelledby={buttonId}
      hidden={!isExpanded} // Follows the Edge bug fix from your reference
      className={`g-m-0 g-list-none g-ps-1 g-ms-1 md:g-ps-2`}
      // className={`g-m-0 g-pl-4 g-list-none g-border-l g-border-gray-300 g-ms-5`}
    >
      {children?.map((child) => nodeRender({ child }))}
      {loading && <li className="g-py-2 g-text-sm g-text-gray-500">Loading...</li>}
      {!loading && !endOfRecords && (
        <li className="g-text-sm g-text-primary-500 g-ps-4">
          <button onClick={() => loadMore()}>Load more</button>
        </li>
      )}
    </ul>
  );
};

/** * 5. THE TOGGLE
 */
export const TreeToggle = () => {
  const { isExpanded, toggle, childrenCount, contentId, buttonId } = useTreeItem();

  if (childrenCount === 0) return <div className="g-w-6" aria-hidden="true" />;

  return (
    <button
      id={buttonId}
      type="button"
      aria-expanded={isExpanded}
      aria-controls={contentId}
      onClick={toggle}
      className="g-flex g-items-center g-justify-center g-w-[1.5em] g-h-[1.5em] g-rounded hover:g-bg-gray-200 g-text-gray-400"
    >
      <svg
        className={`g-w-[.75em] g-h-[.75em] g-transition-transform ${isExpanded ? 'g-rotate-90' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        <path d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
};

export const GotToNode = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="g-flex g-items-center g-justify-center g-w-6 g-h-6 g-rounded hover:g-bg-gray-200 g-text-gray-400"
    >
      <FilterIcon />
    </button>
  );
};

import {
  DatasetRootsQuery,
  DatasetRootsQueryVariables,
  TaxonParentsQuery,
  TaxonParentsQueryVariables,
} from '@/gql/graphql';
import {
  GotToNode,
  TaxonData,
  Tree,
  TreeGroup,
  TreeHeader,
  TreeItem,
  TreeNodeLabel,
  TreeToggle,
} from './components/decomposed';
import { ReactNode, useContext, useEffect } from 'react';
import useQuery from '@/hooks/useQuery';
import { useSearchContext } from '@/contexts/search';
import { FilterContext } from '@/contexts/filter';

const DATASET_ROOTS = /* GraphQL */ `
  query DatasetRoots($limit: Int, $offset: Int, $datasetKey: ID) {
    datasetRoots(datasetKey: $datasetKey, limit: $limit, offset: $offset) {
      count
      results {
        taxonID
        label: scientificName
        rank: taxonRank
        status: taxonomicStatus
        childrenCount: children
      }
    }
  }
`;

const PARENTS = /* GraphQL */ `
  query TaxonParents($datasetKey: ID, $key: ID!) {
    taxon(datasetKey: $datasetKey, key: $key) {
      parentTree {
        taxonID
        label: scientificName
        childrenCount: children
        status: taxonomicStatus
        rank: taxonRank
      }
    }
  }
`;

export function SearchPageTree({ entityDrawerPrefix }: { entityDrawerPrefix: string }) {
  const { scope } = useSearchContext();
  const datasetKey = scope?.datasetKey?.[0];
  const currentFilterContext = useContext(FilterContext);
  const taxonId = currentFilterContext.filter?.must?.taxonId?.[0];

  return (
    <div className="g-p-4">
      <TaxonTree datasetKey={datasetKey!} taxonKey={taxonId} />
    </div>
  );
}

export function TaxonTree({
  datasetKey,
  taxonKey,
  excludeParents,
}: {
  datasetKey: string;
  taxonKey: string;
  excludeParents?: boolean;
}) {
  const { setField } = useContext(FilterContext);

  const { data, error, loading, load } = useQuery<DatasetRootsQuery, DatasetRootsQueryVariables>(
    DATASET_ROOTS,
    { lazyLoad: true }
  );

  const {
    data: parentData,
    error: parentError,
    loading: parentLoading,
    load: loadParents,
  } = useQuery<TaxonParentsQuery, TaxonParentsQueryVariables>(PARENTS, { lazyLoad: true });

  useEffect(() => {
    if (!taxonKey) {
      load({ variables: { datasetKey, limit: 100, offset: 0 } });
    } else if (!excludeParents) {
      loadParents({ variables: { datasetKey, key: taxonKey } });
    }
  }, [datasetKey, taxonKey, load, loadParents]);

  if (!taxonKey) {
    return (
      <Tree>
        {data?.datasetRoots?.results.map((root) => (
          <TaxonomicNode
            key={root.taxonID}
            data={root}
            defaultExpanded={data?.datasetRoots?.results.length === 1}
            datasetKey={datasetKey}
          />
        ))}
      </Tree>
    );
  }

  const tip = parentData?.taxon?.parentTree?.[0];
  const classification = parentData?.taxon?.parentTree?.slice(1) ?? [];

  if (!parentData && parentLoading) {
    return <div>Loading...</div>;
  }

  if (parentError) {
    return <div>Error loading taxon data</div>;
  }

  if (!tip) {
    return <div>Taxon not found</div>;
  }
  return (
    <>
      <div>
        <Tree>
          {/* reduce the position to a nested list of taxons, where each taxon is a child of the previous one. This way we can "pre-expand" the tree down to the currently selected taxon. The taxon should simply be a list item with a ul for the child etc. No styling*/}
          {classification.reduce(
            (child, taxon) => {
              return (
                <li key={taxon.taxonID} id={taxon.taxonID}>
                  <TreeHeader>
                    {/* <GotToNode
                  onClick={() => {
                    setField('taxonId', [taxon.taxonID]);
                  }}
                /> */}
                    <TreeNodeLabel taxon={taxon} datasetKey={datasetKey} />
                  </TreeHeader>
                  <ul
                    role="region"
                    aria-labelledby={taxon.taxonID}
                    className={`g-m-0 g-list-none g-ps-1 g-ms-1 md:g-ps-2`}
                  >
                    {child}
                  </ul>
                </li>
              );
            },
            <TaxonomicNode defaultExpanded={true} data={tip} datasetKey={datasetKey} />
          )}
        </Tree>
      </div>
    </>
  );
}

export const TaxonomicNode = ({
  data,
  defaultExpanded = false,
  datasetKey,
}: {
  data: TaxonData;
  defaultExpanded?: boolean;
  children?: ReactNode;
  datasetKey: string;
}) => {
  const hasChildren = data.childrenCount > 0;

  return (
    <TreeItem
      childrenCount={data.childrenCount}
      taxonID={data.taxonID}
      defaultExpanded={defaultExpanded}
    >
      <TreeHeader>
        <TreeToggle />
        <TreeNodeLabel taxon={data} datasetKey={datasetKey} />
      </TreeHeader>

      {/* The "Sub-branch" list (nested inside the LI) */}
      {hasChildren && (
        <TreeGroup
          nodeRender={({ child }) => (
            <TaxonomicNode
              key={child.taxonID}
              data={child}
              defaultExpanded={false}
              datasetKey={datasetKey}
            />
          )}
        />
      )}
    </TreeItem>
  );
};

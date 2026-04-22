import {
  DatasetRootsQuery,
  DatasetRootsQueryVariables,
  TaxonParentsQuery,
  TaxonParentsQueryVariables,
} from '@/gql/graphql';
import {
  TaxonData,
  Tree,
  TreeGroup,
  TreeHeader,
  TreeItem,
  TreeNodeLabel,
  TreeToggle,
} from './components/treeComponents';
import { useContext, useEffect, useMemo } from 'react';
import useQuery from '@/hooks/useQuery';
import { useSearchContext } from '@/contexts/search';
import { FilterContext } from '@/contexts/filter';
import { ErrorMessage } from '@/components/errorMessage';
import { SkeletonParagraph } from '@/components/ui/skeleton';

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

export function SearchPageTree({
  entityDrawerPrefix: _entityDrawerPrefix,
}: {
  entityDrawerPrefix: string;
}) {
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

export function TaxonTree({ datasetKey, taxonKey }: { datasetKey: string; taxonKey: string }) {
  const { data, load } = useQuery<DatasetRootsQuery, DatasetRootsQueryVariables>(DATASET_ROOTS, {
    lazyLoad: true,
  });

  const {
    data: parentData,
    error: parentError,
    loading: parentLoading,
    load: loadParents,
  } = useQuery<TaxonParentsQuery, TaxonParentsQueryVariables>(PARENTS, { lazyLoad: true });

  useEffect(() => {
    if (!taxonKey) {
      load({ variables: { datasetKey, limit: 100, offset: 0 } });
    } else {
      loadParents({ variables: { datasetKey, key: taxonKey } });
    }
  }, [datasetKey, taxonKey, load, loadParents]);

  const parentTree = useMemo(() => {
    return [...(parentData?.taxon?.parentTree ?? [])]?.reverse();
  }, [parentData]);

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

  const tip = parentTree[0];
  const classification = parentTree.slice(1) ?? [];

  if (parentError && !parentLoading) {
    return <ErrorMessage>Error loading taxon data</ErrorMessage>;
  }

  if (!parentData || parentLoading) {
    return <SkeletonParagraph lines={6} />;
  }

  if (!tip) {
    return <ErrorMessage>Taxon not found</ErrorMessage>;
  }

  return (
    <Tree>
      {classification.reduce(
        (child, taxon) => (
          <li key={taxon.taxonID} id={taxon.taxonID}>
            <TreeHeader>
              <TreeNodeLabel taxon={taxon} datasetKey={datasetKey} />
            </TreeHeader>
            <ul
              role="region"
              aria-labelledby={taxon.taxonID}
              className="g-m-0 g-list-none g-ps-1 g-ms-1 md:g-ps-2"
            >
              {child}
            </ul>
          </li>
        ),
        <TaxonomicNode defaultExpanded={true} data={tip} datasetKey={datasetKey} />
      )}
    </Tree>
  );
}

export const TaxonomicNode = ({
  data,
  defaultExpanded = false,
  datasetKey,
}: {
  data: TaxonData;
  defaultExpanded?: boolean;
  datasetKey: string;
}) => {
  const childrenCount = data.childrenCount ?? 0;
  const hasChildren = childrenCount > 0;

  return (
    <TreeItem
      childrenCount={childrenCount}
      taxonID={data.taxonID}
      defaultExpanded={defaultExpanded}
      datasetKey={datasetKey}
    >
      <TreeHeader>
        <TreeToggle />
        <TreeNodeLabel taxon={data} datasetKey={datasetKey} />
      </TreeHeader>

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

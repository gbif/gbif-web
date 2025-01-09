import { getAsQuery } from '@/components/filters/filterTools';
import { FilterContext } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import { useStringParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import { useContext, useEffect, useState } from 'react';
import { ControlledTreeEnvironment, Tree, TreeItem, TreeItemIndex } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
import { searchConfig } from '../../searchConfig';
import TreeNode from './treeNode';

type ItemsType = Record<string, TreeItem>;

const CHILDREN_SEARCH_QUERY = /* GraphQL */ `
  query TaxonChildren($key: ID!, $limit: Int, $offset: Int) {
    taxon(key: $key) {
      key
      scientificName
      children(limit: $limit, offset: $offset) {
        limit
        endOfRecords
        offset
        results {
          key
          numDescendants
          scientificName
          formattedName
        }
      }
    }
  }
`;

const CHECKLIST_ROOTS = /* GraphQL */ `
  query RootSearch($datasetKey: ID!, $offset: Int, $limit: Int) {
    checklistRoots(datasetKey: $datasetKey, offset: $offset, limit: $limit) {
      offset
      endOfRecords
      results {
        key
        nubKey
        scientificName
        formattedName
        kingdom
        children {
          limit
          endOfRecords
          results {
            key
            parentKey
            numDescendants
            scientificName
          }
        }
        phylum
        class
        order
        family
        genus
        species
        taxonomicStatus
        rank
        datasetKey
        dataset {
          title
        }
        accepted
        acceptedKey
        numDescendants
        vernacularNames(limit: 2, language: "eng") {
          results {
            vernacularName
            source
            sourceTaxonKey
          }
        }
      }
    }
  }
`;

export function TaxonTree({ size: defaultSize = 100 }) {
  const searchContext = useSearchContext();
  const { filter, filterHash } = useContext(FilterContext);
  const [, setPreviewKey] = useStringParam({ key: 'entity' });

  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>([]);
  const [focusedItem, setFocusedItem] = useState<TreeItemIndex | null>(null);
  const [items, setItems] = useState<ItemsType>({});
  const currentFilterContext = useContext(FilterContext);
  const { scope } = useSearchContext();
  const {
    data: rootData,
    loading,
    load,
  } = useQuery(CHECKLIST_ROOTS, {
    lazyLoad: true,
    throwAllErrors: true,
  });

  const {
    data: childrenData,
    loading: childrenLoading,
    load: loadChildren,
  } = useQuery(CHILDREN_SEARCH_QUERY, {
    lazyLoad: true,
    throwAllErrors: true,
  });

  const [size, setSize] = useState(defaultSize);

  useEffect(() => {
    setSize(defaultSize);
  }, [currentFilterContext.filterHash, defaultSize]);

  useEffect(() => {
    load({
      keepDataWhileLoading: true,
      variables: { datasetKey: scope?.datasetKey?.[0], limit: size },
    });
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilterContext.filterHash, scope, load, size]);

  useEffect(() => {
    const query = getAsQuery({ filter, searchContext, searchConfig });
    console.log(query);

    // We use a filterHash to trigger a reload when the filter changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, filterHash, searchContext, filter, searchConfig]);

  useEffect(() => {
    if (rootData?.checklistRoots?.results) {
      setItems(
        rootData?.checklistRoots.results.reduce(
          (acc, cur) => {
            acc[cur.key] = {
              index: cur.key,
              canMove: false,
              isFolder: cur.numDescendants > 0,
              children: cur.children.results.map((item) => item.key),
              data: cur,
              canRename: false,
            };
            if (cur.children.endOfRecords === false) {
              const loadMoreChildrenNode = {
                index: `${cur.key}-load-more`,
                canMove: false,
                isFolder: false,
                data: {},
                canRename: false,
              };
              items[loadMoreChildrenNode.index] = loadMoreChildrenNode;
              acc[cur.key].children.push(loadMoreChildrenNode.index);
            }
            for (let i = 0; i < cur.children.results.length; i++) {
              acc[cur.children.results[i].key] = {
                index: cur.children.results[i].key,
                canMove: false,
                isFolder: cur.children.results[i].numDescendants > 0,
                children: [],
                data: cur.children.results[i],
                canRename: false,
              };
            }
            return acc;
          },
          {
            root: {
              index: 'root',
              canMove: false,
              isFolder: true,
              children: rootData?.checklistRoots.results.map((item) => item.key),
              data: 'Root item',
              canRename: false,
            },
          }
        )
      );
    }
  }, [rootData]);

  useEffect(() => {
    if (childrenData?.taxon?.children?.results) {
      const parent = items[childrenData?.taxon?.key];
      if (parent?.children?.[parent?.children?.length - 1]?.toString().endsWith('load-more')) {
        parent.children.pop();
        delete items[`${parent?.data?.key}-load-more`];
      }
      parent.data.childOffset = childrenData?.taxon?.children?.offset;
      parent.children = [
        ...(parent.children || []),
        ...childrenData?.taxon?.children?.results.map((item) => item.key),
      ];
      if (childrenData?.taxon?.children?.endOfRecords === true) {
        parent.data.endOfChildren = true;
      } else {
        parent.data.endOfChildren = false;
        const loadMoreChildrenNode = {
          index: `${parent?.data?.key}-load-more`,
          canMove: false,
          isFolder: false,
          data: {},
          canRename: false,
        };
        items[loadMoreChildrenNode.index] = loadMoreChildrenNode;
        parent.children.push(loadMoreChildrenNode.index);
      }
      setItems({
        ...items,
        ...childrenData?.taxon?.children?.results.reduce((acc, cur) => {
          acc[cur.key] = {
            index: cur.key,
            canMove: false,
            isFolder: cur.numDescendants > 0,
            data: cur,
            canRename: false,
          };
          return acc;
        }, {}),
      });
    }
  }, [childrenData]);

  return (
    <ControlledTreeEnvironment
      items={items}
      getItemTitle={() => items?.data?.scientificName}
      renderItemTitle={(props) => (
        <TreeNode
          item={props.item}
          loadChildren={loadChildren}
          items={items}
          showPreview={setPreviewKey}
        />
      )}
      loading={loading}
      viewState={{
        ['tree-1']: {
          focusedItem,
          expandedItems,
        },
      }}
      onFocusItem={(item) => setFocusedItem(item.index)}
      onExpandItem={(item) => {
        if (!item.data.endOfChildren) {
          loadChildren({
            keepDataWhileLoading: true,
            variables: { key: item.data.key, limit: 25, offset: item.data.childOffset || 0 },
          });
        }
        setExpandedItems([...expandedItems, item.index]);
      }}
      onCollapseItem={(item) => {
        setExpandedItems(
          expandedItems.filter((expandedItemIndex) => expandedItemIndex !== item.index)
        );
      }}
      /*     onSelectItems={items => setSelectedItems(items)}
       */
    >
      <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
    </ControlledTreeEnvironment>
  );
}

import { getAsQuery } from '@/components/filters/filterTools';
import { FilterContext } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import { RootSearchQuery, RootSearchQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { useEntityDrawer } from '@/routes/occurrence/search/views/browseList/useEntityDrawer';
import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { ControlledTreeEnvironment, Tree, TreeItem, TreeItemIndex } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
import { searchConfig } from '../../searchConfig';
import TreeNode from './treeNode';
import { getChildren, getParents, ItemsType, reducer } from './treeUtil';
export const childLimit = 10;

const CHECKLIST_ROOTS = /* GraphQL */ `
  query RootSearch($datasetKey: ID!, $offset: Int, $limit: Int) {
    checklistRoots(datasetKey: $datasetKey, offset: $offset, limit: $limit) {
      offset
      endOfRecords
      results {
        key
        nubKey
        scientificName
        formattedName(useFallback: true)
        kingdom
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
const TreeContext = createContext<TreeItemIndex[]>([]);

export function TaxonTree() {
  const searchContext = useSearchContext();
  const [loadingTreeNodes, setLoadingTreeNodes] = useState<TreeItemIndex[]>([]);
  const { filter, filterHash } = useContext(FilterContext);
  const [, setPreviewKey] = useEntityDrawer();
  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>([]);
  const [focusedItem, setFocusedItem] = useState<TreeItemIndex | null>(null);
  const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([]);
  const [items, dispatch] = useReducer(reducer, {});

  const [higherTaxonKey, setHigherTaxonKey] = useState<string | null>(null);
  const [rootsLoaded, setRootsLoaded] = useState(false);
  const currentFilterContext = useContext(FilterContext);
  const { scope } = useSearchContext();
  const {
    data: rootData,
    loading,
    load,
  } = useQuery<RootSearchQuery, RootSearchQueryVariables>(CHECKLIST_ROOTS, {
    lazyLoad: true,
    throwAllErrors: true,
  });

  useEffect(() => {
    load({
      keepDataWhileLoading: true,
      variables: { datasetKey: scope?.datasetKey?.[0], limit: childLimit },
    });
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilterContext.filterHash, scope, load]);

  useEffect(() => {
    const query = getAsQuery({
      filter,
      searchContext,
      searchConfig,
    });
    if (query?.higherTaxonKey?.[0]) {
      setHigherTaxonKey(query?.higherTaxonKey?.[0]);
    }
    // We use a filterHash to trigger a reload when the filter changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterHash, searchContext, searchConfig]);

  useEffect(() => {
    if (higherTaxonKey && rootsLoaded) {
      loadParents({ key: higherTaxonKey });
    }
    // We use a filterHash to trigger a reload when the filter changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [higherTaxonKey, rootsLoaded]);
  useEffect(() => {}, [items, loadingTreeNodes]);
  useEffect(() => {
    if (rootData?.checklistRoots?.results) {
      dispatch({
        type: 'initRoots',
        payload: rootData?.checklistRoots.results.reduce(
          (acc, cur) => {
            acc[cur.key] = {
              index: cur.key,
              canMove: false,
              isFolder: (cur?.numDescendants ?? 0) > 0,
              children: [],
              data: {
                ...cur,
              },
              canRename: false,
            };
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
          } as Record<TreeItemIndex, TreeItem>
        ),
      });

      setRootsLoaded(true);
    }
  }, [rootData]);

  const loadChildren = async ({
    key,
    limit,
    offset,
  }: {
    key: string;
    limit: number;
    offset: number;
  }) => {
    try {
      const { promise, cancel } = getChildren({ key, limit, offset });
      const taxon = await promise;
      setLoadingTreeNodes(loadingTreeNodes.filter((node) => node !== `${key}-load-more`));
      if (taxon?.children?.results) {
        let parent;
        if (items[taxon.key]) {
          parent = { ...items[taxon.key] };
        } else {
          parent = {
            index: taxon.key,
            canMove: false,
            isFolder: taxon.numDescendants && taxon.numDescendants > 0,
            children: [],
            data: taxon,
            canRename: false,
          };
        }
        if (parent?.children?.[parent?.children?.length - 1]?.toString().endsWith('load-more')) {
          parent.children = parent.children.slice(0, -1);
        }
        parent.data.childOffset = taxon?.children?.offset + taxon?.children?.limit;
        const childKeys = taxon?.children?.results.map((item) => item.key);
        const childKeySet = new Set<TreeItemIndex>(childKeys);
        parent.children = [
          ...(parent?.children?.filter((id) => !childKeySet.has(id)) || []),
          ...childKeys,
        ];
        if (taxon?.children?.endOfRecords === true) {
          parent.data.endOfChildren = true;
          dispatch({ type: 'deleteItem', payload: `${parent?.data?.key}-load-more` });
        } else {
          parent.data.endOfChildren = false;
          const loadMoreChildrenNode = {
            index: `${parent?.data?.key}-load-more`,
            canMove: false,
            isFolder: false,
            data: {},
            canRename: false,
          };
          // items[loadMoreChildrenNode.index] = loadMoreChildrenNode;
          dispatch({
            type: 'setItems',
            payload: { [loadMoreChildrenNode.index]: loadMoreChildrenNode },
          });
          parent.children.push(loadMoreChildrenNode.index);
        }
        const newItems = {
          [parent.data.key]: parent,
          ...taxon?.children?.results.reduce((acc, cur) => {
            acc[cur.key] = {
              index: cur.key,
              canMove: false,
              isFolder: (cur?.numDescendants ?? 0) > 0,
              children: [...(items[cur.key]?.children || [])],
              data: cur,
              canRename: false,
            };
            return acc;
          }, {} as Record<TreeItemIndex, TreeItem>),
        };
        dispatch({ type: 'setItems', payload: newItems as ItemsType });
        // setItems(newItems);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadParents = async ({ key }: { key: string }) => {
    try {
      const { promise, cancel } = getParents({ key, limit: childLimit, offset: 0 });
      const taxon = await promise;
      const parents = [...(taxon?.parents || []), taxon?.acceptedTaxon || taxon];
      // const parents = taxon?.parents || [];
      const data = parents.reduce((acc, parent, idx) => {
        const nexParent = parents[idx + 1];
        const nextParentIsInfirstPageOfChildren = !!parent?.children?.results.find(
          ({ key, acceptedKey }) => key === nexParent?.key /* || acceptedKey === nexParent?.key */
        );
        acc[parent.key] = {
          index: parent.key,
          canMove: false,
          isFolder: true,
          children: nextParentIsInfirstPageOfChildren
            ? parent?.children?.results.map((c) => c.key as TreeItemIndex)
            : [
                nexParent?.key as TreeItemIndex,
                ...(parent?.children?.results || []).map((c) => c.key as TreeItemIndex),
              ],
          data: {
            ...parent,
            childOffset: (parent?.children?.offset || 0) + (parent?.children?.limit || 0),
            endOfChildren: parent?.children?.endOfRecords,
          },
          canRename: false,
        };

        if (!!parent?.children && !parent.children.endOfRecords) {
          const loadMoreChildrenNode = {
            index: `${parent.key}-load-more`,
            canMove: false,
            isFolder: false,
            data: {},
            canRename: false,
          };
          acc[loadMoreChildrenNode.index] = loadMoreChildrenNode;
          if (acc[parent.key]?.children) {
            acc[parent.key].children?.push(loadMoreChildrenNode.index as TreeItemIndex);
          }
        }

        parent?.children?.results.forEach((child) => {
          acc[child.key] = {
            index: child.key,
            canMove: false,
            isFolder: (child?.numDescendants ?? 0) > 0,
            children: [],
            data: child,
            canRename: false,
          };
        });

        return acc;
      }, {} as Record<TreeItemIndex, TreeItem>);
      dispatch({ type: 'setItems', payload: data });
      setExpandedItems([
        ...new Set([
          ...expandedItems,
          ...(parents || []).map((parent) => parent?.key as TreeItemIndex),
        ]),
      ]);
      setSelectedItems([(taxon?.acceptedTaxon?.key || taxon?.key) as TreeItemIndex]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TreeContext.Provider value={loadingTreeNodes}>
      <ControlledTreeEnvironment
        items={items}
        getItemTitle={() => items?.data?.scientificName}
        renderItemTitle={(props) => (
          <TreeNode
            setSelectedItems={setSelectedItems}
            loadingTreeNodes={loadingTreeNodes}
            setLoadingTreeNodes={setLoadingTreeNodes}
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
            selectedItems,
          },
        }}
        onFocusItem={(item) => setFocusedItem(item.index)}
        onExpandItem={async (item) => {
          setExpandedItems([...new Set([...expandedItems, item.index])]);
          if (!item.data.endOfChildren) {
            dispatch({
              type: 'setItems',
              payload: {
                [item.index]: { ...item, children: [`${item.index}-skeleton`] },
                [`${item.index}-skeleton`]: {
                  index: `${item.index}-skeleton`,
                  canMove: false,
                  isFolder: false,
                  data: {},
                  canRename: false,
                },
              },
            });
            await loadChildren({
              key: item.data.key,
              limit: childLimit,
              offset: item.data.childOffset || 0,
            });
          }
          // When the user expands an item, we want to remove all selections
          setSelectedItems([item.data.key]);
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
    </TreeContext.Provider>
  );
}

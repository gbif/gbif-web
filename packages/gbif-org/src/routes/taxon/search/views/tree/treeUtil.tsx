import { GraphQLService } from '@/services/graphQLService';
import { CANCEL_REQUEST } from '@/utils/fetchWithCancel';
import { TreeItem, TreeItemIndex } from 'react-complex-tree';
interface GetChildrenParams {
  key: string;
  limit: number;
  offset: number;
}
type ItemsType = Record<string, TreeItem>;

export const getChildren = ({ key, limit, offset }: GetChildrenParams) => {
  const abortController = new AbortController();
  const graphqlService = new GraphQLService({
    endpoint: import.meta.env.PUBLIC_GRAPHQL_ENDPOINT,
    abortSignal: abortController.signal,
    locale: 'en',
  });

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
  const promise = graphqlService.query(CHILDREN_SEARCH_QUERY, { key, limit, offset });
  return {
    promise: promise.then((res) => res.json()).then((response) => response?.data?.taxon),
    cancel: () => abortController.abort(CANCEL_REQUEST),
  };
};

export const getParents = ({
  key,
  limit,
  offset,
}: {
  key: string;
  limit: number;
  offset: number;
}) => {
  const abortController = new AbortController();
  const graphqlService = new GraphQLService({
    endpoint: import.meta.env.PUBLIC_GRAPHQL_ENDPOINT,
    abortSignal: abortController.signal,
    locale: 'en',
  });

  const TAXON_PARENT_KEYS = /* GraphQL */ `
    query TaxonParentKeys($key: ID!, $limit: Int, $offset: Int) {
      taxon(key: $key) {
        key
        parents {
          key
          numDescendants
          scientificName
          formattedName
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
    }
  `;
  const promise = graphqlService.query(TAXON_PARENT_KEYS, { key, limit, offset });
  return {
    promise: promise.then((res) => res.json()).then((response) => response?.data?.taxon),
    cancel: () => abortController.abort(CANCEL_REQUEST),
  };
};

interface Action<T = unknown> {
  type: string;
  payload: T;
}

interface InitRootsAction extends Action<ItemsType> {
  type: 'initRoots';
  payload: ItemsType;
}

interface SetChildrenAction extends Action {
  type: 'setChildren';
  payload: {
    key: string;
    children: TreeItem[];
  };
}

interface SetItemsAction extends Action {
  type: 'setItems';
  payload: ItemsType;
}

interface DeleteItemAction extends Action {
  type: 'deleteItem';
  payload: string;
}

type ReducerAction = InitRootsAction | SetChildrenAction | SetItemsAction | DeleteItemAction;

export const reducer = (items: ItemsType, action: ReducerAction): ItemsType => {
  switch (action.type) {
    case 'initRoots':
      return { ...items, ...action.payload };
    case 'setChildren':
      return {
        ...items,
        [action.payload.key]: {
          ...items[action.payload.key],
          children: action?.payload?.children as unknown as TreeItemIndex[],
        },
      };
    case 'setItems':
      return { ...items, ...action.payload };
    case 'deleteItem': {
      const newItems = { ...items };
      delete newItems[action.payload];
      return newItems;
    }
    default:
      throw new Error(`Unknown action type: ${(action as ReducerAction).type}`);
  }
};
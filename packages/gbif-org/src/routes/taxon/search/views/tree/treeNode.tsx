import { FormattedNumber } from '@/components/dashboard/shared';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/utils/shadcn';
import { TreeItem, TreeItemIndex } from 'react-complex-tree';
import { GoSidebarExpand } from 'react-icons/go';
import { FormattedMessage } from 'react-intl';
import { childLimit } from './tree';
import styles from './treeNode.module.css';

export const TreeNode = ({
  item,
  loadChildren,
  items,
  showPreview,
  loadingTreeNodes,
  setLoadingTreeNodes,
  setSelectedItems,
}: {
  item: TreeItem;
  loadChildren: (arg: { key: string; limit: number; offset: number }) => void;
  items: { [key: TreeItemIndex]: TreeItem };
  showPreview: (id: string) => void;
  loadingTreeNodes: TreeItemIndex[];
  setLoadingTreeNodes: (nodes: TreeItemIndex[]) => void;
  setSelectedItems: (nodes: TreeItemIndex[]) => void;
}) => {
  if (item.index.toString().endsWith('load-more')) {
    return loadingTreeNodes?.includes(item.index.toString()) ? (
      <Spinner className="g-m-2" />
    ) : (
      <div
        className={cn(styles.loadMoreTreeNode)}
        onClick={() => {
          setLoadingTreeNodes([...loadingTreeNodes, item.index.toString()]);
          const parent = items[item.index.toString().replace('-load-more', '')];
          loadChildren({
            key: parent.data.key,
            limit: childLimit,
            offset: parent.data.childOffset || 0,
          });
        }}
      >
        <FormattedMessage id="taxon.loadMore" defaultMessage="More..." />
      </div>
    );
  } else if (item.index.toString().endsWith('skeleton')) {
    return <Spinner className="g-m-2" />;
  } else {
    return (
      <div className="g-flex g-justify-between g-relative">
        <span
          dangerouslySetInnerHTML={{ __html: item.data.formattedName || item.data.scientificName }}
        />{' '}
        {item.data.numDescendants > 0 && (
          <span className="g-ml-1">
            (<FormattedNumber value={item.data.numDescendants} />)
          </span>
        )}
        {typeof showPreview === 'function' && (
          <div
            className="g-pr-3 g-pl-1 hover:g-text-primary-500 g-flex g-items-center g-pointer-events-auto"
            onClick={(e) => {
              // Prevent the parent link from being triggered
              e.preventDefault();
              if (item.data.key) {
                setSelectedItems([item.data.key]);
                showPreview(item.data.key.toString());
              }
            }}
          >
            <SimpleTooltip i18nKey="filterSupport.viewDetails" side="right">
              <div className="g-flex g-items-center">
                <GoSidebarExpand size={16} />
              </div>
            </SimpleTooltip>
          </div>
        )}
      </div>
    );
  }
};

export default TreeNode;

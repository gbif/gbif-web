import { SimpleTooltip } from '@/components/simpleTooltip';
import { GoSidebarExpand } from 'react-icons/go';
import { childLimit } from './tree';
import { TreeSkeleton } from './treePresentation';

export const TreeNode = ({
  item,
  loadChildren,
  items,
  showPreview,
  loadingTreeNodes,
  setLoadingTreeNodes,
}) => {
  if (item.index.toString().endsWith('load-more')) {
    return loadingTreeNodes?.includes(item.index.toString()) ? (
      <TreeSkeleton />
    ) : (
      <div
        onClick={() => {
          setLoadingTreeNodes([...loadingTreeNodes, item.index.toString()]);
          const parent = items[item.index.replace('-load-more', '')];
          loadChildren({
            key: parent.data.key,
            limit: childLimit,
            offset: parent.data.childOffset || 0,
          });
        }}
      >
        More..
      </div>
    );
  } else if (item.index.toString().endsWith('skeleton')) {
    return <TreeSkeleton />;
  } else {
    return (
      <div className="g-flex g-justify-between g-relative">
        <span
          dangerouslySetInnerHTML={{ __html: item.data.formattedName || item.data.scientificName }}
        />{' '}
        {item.data.numDescendants > 0 && `(${item.data.numDescendants})`}{' '}
        {typeof showPreview === 'function' && (
          <div
            className="g-pr-3 g-pl-1 hover:g-text-primary-500 g-flex g-items-center g-pointer-events-auto"
            onClick={(e) => {
              // Prevent the parent link from being triggered
              if (item.data.key) showPreview(`t_${item.data.key.toString()}`);
              e.preventDefault();
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

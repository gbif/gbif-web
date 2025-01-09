import { SimpleTooltip } from '@/components/simpleTooltip';
import { GoSidebarExpand } from 'react-icons/go';

export const TreeNode = ({ item, loadChildren, items, showPreview }) => {
  return item.index.toString().endsWith('load-more') ? (
    <div
      onClick={() => {
        const parent = items[item.index.replace('-load-more', '')];
        loadChildren({
          keepDataWhileLoading: true,
          variables: {
            key: parent.data.key,
            limit: 25,
            offset: (parent.data.childOffset || 0) + 25,
          },
        });
      }}
    >
      More..
    </div>
  ) : (
    <div className="g-flex g-justify-between g-relative">
      <span
        dangerouslySetInnerHTML={{ __html: item.data.formattedName || item.data.scientificName }}
      />{' '}
      {item.data.numDescendants > 0 && `(${item.data.numDescendants})`}{' '}
      {typeof showPreview === 'function' && (
        <button
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
        </button>
      )}
    </div>
  );
};

export default TreeNode;

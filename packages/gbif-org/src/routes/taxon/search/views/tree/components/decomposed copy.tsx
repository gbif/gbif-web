import React, { createContext, useContext, useState, useId, ReactNode } from 'react';

// --- CONTEXT ---
interface TreeItemContextProps {
  isExpanded: boolean;
  toggle: () => void;
  hasChildren: boolean;
}
const TreeItemContext = createContext<TreeItemContextProps | undefined>(undefined);
const useTreeItem = () => {
  const context = useContext(TreeItemContext);
  if (!context) throw new Error('Tree components must be used within a TreeItem');
  return context;
};

// --- COMPONENTS ---

/** * .occurrenceTaxonomyTree
 */
export const Tree = ({ children }: { children: ReactNode }) => (
  <nav className="g-block g-overflow-auto g-p-4 g-bg-white g-font-sans g-text-[13px]">
    <ul className="g-m-0 g-p-0 g-list-none g-occurrenceTaxonomyTree">{children}</ul>
  </nav>
);

/** * .occurrenceTaxonomyTree li
 */
export const TreeItem = ({
  children,
  hasChildren,
  defaultExpanded = false,
}: {
  children: ReactNode;
  hasChildren: boolean;
  defaultExpanded?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <TreeItemContext.Provider
      value={{ isExpanded, toggle: () => setIsExpanded(!isExpanded), hasChildren }}
    >
      <li className="g-relative g-pl-[0.75em] g-ml-[10px] g-mt-[0.5em] g-list-none g-group">
        {/* The GBIF .pipe element */}
        <div
          className={`
          g-pipe g-absolute g-left-0 g-bg-[#dcdcdc] g-w-px
          g-top-[0.75em] g-bottom-[-1.35em]
          group-first:g-top-[-0.6em]
          group-last:g-display-none
          group-only:g-block group-only:g-bottom-initial group-only:g-h-[1.4em]
        `}
        />
        {children}
      </li>
    </TreeItemContext.Provider>
  );
};

/** * .occurrenceTaxonomyTree .title
 */
export const TreeHeader = ({
  label,
  count,
  onSearch,
}: {
  label: string;
  count: string | number;
  onSearch?: () => void;
}) => {
  const { toggle, hasChildren } = useTreeItem();

  return (
    <div className="g-relative g-inline-block g-bg-[#f7f7f7] g-border g-border-[#dcdcdc] g-whitespace-nowrap g-mt-[-1px]">
      {/* Horizontal connector line: .title:after */}
      <div className="g-absolute g-top-[0.75em] g-left-[-0.75em] g-h-px g-bg-[#dcdcdc] g-w-[0.75em]" />

      {/* Main Label: Toggles the tree */}
      <button
        onClick={hasChildren ? toggle : undefined}
        className={`g-inline-block g-px-1 g-py-[2px] g-font-medium g-text-inherit hover:g-bg-white g-transition-colors ${hasChildren ? 'g-cursor-pointer' : 'g-cursor-default'}`}
      >
        {label}
      </button>

      {/* Count/Filter: .occurrenceTaxonomyTree__filter */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSearch?.();
        }}
        className="g-inline-block g-px-1 g-py-[2px] g-border-l g-border-[#dcdcdc] g-text-[#919191] hover:g-bg-white g-transition-colors"
      >
        {count.toLocaleString()}
      </button>
    </div>
  );
};

/** * .sub-menu
 */
export const TreeGroup = ({ children }: { children: ReactNode }) => {
  const { isExpanded } = useTreeItem();
  if (!isExpanded) return null;

  return <ul className="g-pl-0 g-list-none g-sub-menu">{children}</ul>;
};

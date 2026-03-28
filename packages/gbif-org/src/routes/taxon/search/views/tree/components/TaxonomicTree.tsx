import React, { useState, useId, ReactNode } from 'react';

export interface BaseTaxonNode {
  taxonID: string;
  label: string;
  children?: BaseTaxonNode[];
}

interface RenderNodeProps<T extends BaseTaxonNode> {
  node: T;
  isExpanded: boolean;
  hasChildren: boolean;
  toggle: () => void;
}

interface TreeProps<T extends BaseTaxonNode> {
  data: T[];
  renderNode: (props: RenderNodeProps<T>) => ReactNode;
  defaultExpanded?: boolean;
}

function TreeNode<T extends BaseTaxonNode>({
  node,
  renderNode,
  defaultExpanded = false,
}: {
  node: T;
  renderNode: TreeProps<T>['renderNode'];
  defaultExpanded?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentId = useId();
  const buttonId = useId();
  const hasChildren = !!(node.children && node.children.length > 0);

  return (
    <li className="g-list-none">
      <div className="g-group g-flex g-items-center g-gap-2 g-py-1.5 g-px-2 g-rounded-md hover:g-bg-gray-50 g-transition-colors">
        {/* Expander Trigger */}
        <div className="g-w-6 g-flex g-items-center g-justify-center">
          {hasChildren ? (
            <button
              id={buttonId}
              type="button"
              aria-expanded={isExpanded}
              aria-controls={contentId}
              onClick={() => setIsExpanded(!isExpanded)}
              className="g-flex g-items-center g-justify-center g-w-6 g-h-6 g-rounded g-text-gray-400 hover:g-text-primary-600 hover:g-bg-gray-200 g-transition-all"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={`g-w-3 g-h-3 g-transform g-transition-transform ${isExpanded ? 'g-rotate-90' : ''}`}
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
              <span className="g-sr-only">
                {isExpanded ? 'Collapse' : 'Expand'} {node.label}
              </span>
            </button>
          ) : (
            <div className="g-w-1.5 g-h-1.5 g-rounded-full g-bg-gray-300" />
          )}
        </div>

        {/* Custom Node Content Area */}
        <div className="g-flex-1">
          {renderNode({
            node,
            isExpanded,
            hasChildren,
            toggle: () => setIsExpanded(!isExpanded),
          })}
        </div>
      </div>

      {/* Nested Branch */}
      {hasChildren && (
        <div
          id={contentId}
          role="region"
          aria-labelledby={buttonId}
          className={`${isExpanded ? 'g-block' : 'g-hidden'} g-ml-3 g-pl-3 g-border-l g-border-gray-200`}
        >
          <ul className="g-mt-1">
            {node.children?.map((child) => (
              <TreeNode key={child.id} node={child as T} renderNode={renderNode} />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export function TaxonomicTree<T extends BaseTaxonNode>(props: TreeProps<T>) {
  return (
    <nav
      className="g-w-full g-max-w-2xl g-bg-white g-p-4 g-rounded-lg g-shadow-sm"
      aria-label="Taxonomy Navigation"
    >
      <ul className="g-m-0 g-p-0">
        {props.data.map((rootNode) => (
          <TreeNode key={rootNode.id} node={rootNode} renderNode={props.renderNode} />
        ))}
      </ul>
    </nav>
  );
}

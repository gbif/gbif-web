import React from 'react';

interface ExpandableSectionProps {
  icon: React.ReactNode;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  summary?: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export default function ExpandableSection({
  icon,
  title,
  description,
  summary,
  isExpanded,
  onToggle,
  children,
}: ExpandableSectionProps) {
  return (
    <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200">
      <button
        onClick={onToggle}
        className="g-w-full g-p-6 g-text-left g-flex g-items-center g-justify-between hover:g-bg-gray-50 g-transition-colors"
      >
        <div className="g-flex g-items-center g-gap-3">
          {icon}
          <div>
            <h3 className="g-font-semibold g-text-gray-900">{title}</h3>
            <p className="g-text-sm g-text-gray-600">{description}</p>
          </div>
        </div>
        {summary && <div className="g-hidden md:g-block g-text-sm g-text-gray-500">{summary}</div>}
      </button>

      {isExpanded && (
        <div className="g-border-t g-border-gray-200 g-p-2 md:g-p-6 g-bg-slate-50">{children}</div>
      )}
    </div>
  );
}

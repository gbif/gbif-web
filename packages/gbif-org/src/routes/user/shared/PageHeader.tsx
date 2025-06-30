import React from 'react';

interface PageTitleProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}

export function PageTitle({ title, subtitle, className = '' }: PageTitleProps) {
  return (
    <div className={`g-text-center ${className}`}>
      <h1 className="g-text-3xl g-font-bold g-text-gray-900">{title}</h1>
      {subtitle && <p className="g-text-gray-500 g-mt-2">{subtitle}</p>}
    </div>
  );
}

interface FormHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function FormHeader({ title, subtitle, icon: Icon, className = '' }: FormHeaderProps) {
  return (
    <div className={`g-text-center g-space-y-6 ${className}`}>
      {Icon && (
        <div className="g-flex g-justify-center">
          <Icon className="g-h-16 g-w-16 g-text-primary-600" />
        </div>
      )}
      <div>
        <h1 className="g-text-3xl g-font-bold g-text-gray-900">{title}</h1>
        {subtitle && <p className="g-text-gray-500 g-mt-2">{subtitle}</p>}
      </div>
    </div>
  );
}

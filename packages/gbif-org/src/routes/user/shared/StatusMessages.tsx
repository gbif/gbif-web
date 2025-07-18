import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/shadcn';
import React from 'react';
import { MdCheckCircle } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { commonClasses } from './utils';

interface LoadingStateProps {
  title: React.ReactNode;
  message: React.ReactNode;
}

export function LoadingState({ title, message }: LoadingStateProps) {
  return (
    <div className="g-text-center g-space-y-6">
      <div className="g-flex g-justify-center">
        <svg
          className={cn(commonClasses.icon.medium, 'g-animate-spin g-text-primary-600')}
          viewBox="0 0 24 24"
        >
          <circle
            className="g-opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="g-opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      <h1 className="g-text-3xl g-font-bold g-text-gray-900">{title}</h1>
      <p className="g-text-gray-500">{message}</p>
    </div>
  );
}

interface SuccessStateProps {
  title: React.ReactNode;
  message: React.ReactNode;
  successMessage: string;
  successMessageId: string;
  primaryAction?: {
    to: string;
    text: string;
  };
  secondaryAction?: {
    to: string;
    text: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
}

export function SuccessState({
  title,
  message,
  successMessage,
  successMessageId,
  primaryAction,
  secondaryAction,
}: SuccessStateProps) {
  return (
    <div className="g-text-center g-space-y-6">
      <div className="g-flex g-justify-center">
        <MdCheckCircle className={cn(commonClasses.icon.large, 'g-text-green-500')} />
      </div>
      <div>
        <h1 className="g-text-3xl g-font-bold g-text-gray-900">{title}</h1>
        <p className="g-text-gray-500 g-mt-2">{message}</p>
      </div>
      <div className={commonClasses.messageBox.success}>
        <FormattedMessage id={successMessageId} defaultMessage={successMessage} />
      </div>
      <div className="g-space-y-3">
        {primaryAction && (
          <Link to={primaryAction.to} className={cn('g-w-full', buttonVariants())}>
            {primaryAction.text}
          </Link>
        )}
        {secondaryAction && (
          <Link
            to={secondaryAction.to}
            className={cn('g-w-full', buttonVariants({ variant: 'outline' }))}
          >
            {secondaryAction.icon && <secondaryAction.icon className="g-mr-2 g-h-4 g-w-4" />}
            {secondaryAction.text}
          </Link>
        )}
      </div>
    </div>
  );
}

interface ErrorStateProps {
  title: React.ReactNode;
  message: React.ReactNode;
  error: string;
  errorMessageId: string;
  helpText?: React.ReactNode;
  primaryAction?: {
    to: string;
    text: string;
  };
  secondaryAction?: {
    to: string;
    text: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
}

export function ErrorState({
  title,
  message,
  error,
  errorMessageId,
  helpText,
  primaryAction,
  secondaryAction,
}: ErrorStateProps) {
  return (
    <div className="g-text-center g-space-y-6">
      <div>
        <h1 className="g-text-3xl g-font-bold g-text-gray-900">{title}</h1>
        <p className="g-text-gray-500 g-mt-2">{message}</p>
      </div>
      <div className={commonClasses.messageBox.error}>
        <FormattedMessage id={errorMessageId} defaultMessage={error} />
      </div>
      <div className="g-space-y-3">
        {helpText && <p className="g-text-sm g-text-gray-600">{helpText}</p>}
        <div className="g-space-y-3">
          {primaryAction && (
            <Link to={primaryAction.to} className={cn(buttonVariants(), 'g-me-2')}>
              {primaryAction.text}
            </Link>
          )}
          {secondaryAction && (
            <Link to={secondaryAction.to} className={buttonVariants({ variant: 'outline' })}>
              <span className="g-flex-inline g-items-center">
                {secondaryAction.icon && <secondaryAction.icon className="g-mr-2 g-h-4 g-w-4" />}
                {secondaryAction.text}
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';
import { cn, commonClasses } from './utils';

interface FormInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string | false;
  touched?: boolean;
  autoComplete?: string;
  disabled?: boolean;
}

export function FormInput({
  id,
  label,
  type,
  value,
  onChange,
  onBlur,
  placeholder,
  icon: Icon,
  error,
  touched,
  autoComplete,
  disabled = false,
}: FormInputProps) {
  const hasError = touched && error;

  return (
    <div>
      <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-1" htmlFor={id}>
        {label}
      </label>
      <div className="g-relative">
        <Icon className={commonClasses.icon.inputIcon} />
        <input
          type={type}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={cn(
            commonClasses.input.base,
            commonClasses.input.withIcon,
            hasError ? commonClasses.input.error : commonClasses.input.normal
          )}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
        />
      </div>
      {hasError && <p className="g-mt-1 g-text-sm g-text-red-600">{error}</p>}
    </div>
  );
}

interface FormSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  touched?: boolean;
}

export function FormSelect({
  id,
  label,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  icon: Icon,
  error,
  touched,
}: FormSelectProps) {
  const hasError = touched && error;

  return (
    <div>
      <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-1" htmlFor={id}>
        {label}
      </label>
      <div className="g-relative">
        <div className="g-absolute g-left-3 g-top-1/2 g-transform g--translate-y-1/2 g-text-gray-400 g-z-10">
          <Icon className="g-h-5 g-w-5" />
        </div>
        <Select
          value={value}
          onValueChange={(value) => onChange(value)}
          onOpenChange={(open) => {
            if (!open) {
              onBlur();
            }
          }}
        >
          <SelectTrigger
            className={cn(
              commonClasses.input.base,
              'g-pl-10 g-h-11',
              hasError
                ? 'g-border-red-500 focus:g-border-red-500 focus:g-ring-red-500'
                : 'g-border-gray-300 focus:g-border-indigo-500 focus:g-ring-indigo-500'
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {hasError && <p className="g-mt-1 g-text-sm g-text-red-600">{error}</p>}
    </div>
  );
}

interface FormButtonProps {
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function FormButton({
  type = 'button',
  variant = 'primary',
  disabled = false,
  isLoading = false,
  children,
  onClick,
  className,
}: FormButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        commonClasses.button[variant],
        disabled && commonClasses.button.disabled,
        className
      )}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <span className="g-flex g-items-center">
          <svg className="g-animate-spin g-h-5 g-w-5 g-mr-3" viewBox="0 0 24 24">
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
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

interface ErrorMessageProps {
  error: string;
  errorMessageId?: string;
}

export function ErrorMessage({ error, errorMessageId }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <div className={commonClasses.messageBox.error}>
      {errorMessageId ? <FormattedMessage id={errorMessageId} defaultMessage={error} /> : error}
    </div>
  );
}

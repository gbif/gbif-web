import { Button, ButtonProps } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/utils/shadcn';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { commonClasses } from './utils';

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
        <Input
          type={type}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={cn(commonClasses.input.withIcon, {
            'g-border-red-500': hasError,
          })}
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
  label: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string | false;
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
              'g-pl-10',
              hasError
                ? 'g-border-red-500 focus:g-border-red-500 focus:g-ring-red-500'
                : 'g-border-gray-300 focus:g-border-primary-500 focus:g-ring-primary-500'
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
  variant?: ButtonProps['variant'];
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function FormButton({
  type = 'button',
  variant = 'default',
  disabled = false,
  isLoading = false,
  children,
  onClick,
  className,
}: FormButtonProps) {
  return (
    <Button
      variant={variant}
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled || isLoading}
      isLoading={isLoading}
    >
      {children}
    </Button>
  );
}

interface ErrorMessageProps {
  errorMessageId: string;
  defaultMessage?: string;
  className?: string;
}

export function ErrorMessage({ errorMessageId, defaultMessage, className }: ErrorMessageProps) {
  if (!errorMessageId) return null;

  return (
    <div className={cn(commonClasses.messageBox.error, className)}>
      <FormattedMessage id={errorMessageId} defaultMessage={defaultMessage ?? errorMessageId} />
    </div>
  );
}

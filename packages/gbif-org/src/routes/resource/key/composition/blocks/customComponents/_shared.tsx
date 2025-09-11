import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/utils/shadcn';
import { FieldPath, FieldValues, useFormContext } from 'react-hook-form';
import { z } from 'zod';

export const RequiredStringSchema = z.string().min(1, '#validation.required');
export const RequiredEmailSchema = RequiredStringSchema.email('#validation.invalidEmail');
export const OptionalStringSchema = z.string().optional();
export const RequiredCheckboxSchema = z.literal(true, {
  errorMap: () => ({ message: '#validation.checkboxRequired' }),
});
export const RequiredYesOrNoSchema = z.enum(['yes', 'no'], {
  errorMap: () => ({ message: '#validation.pleaseSelectAValue' }),
});

type RadioItemProps = {
  value: string;
  label: React.ReactNode;
};

export function RadioItem({ value, label }: RadioItemProps) {
  return (
    <FormItem className="g-flex g-items-start g-space-x-3 g-space-y-0">
      <FormControl>
        <RadioGroupItem value={value} />
      </FormControl>
      <FormLabel className="g-font-normal g-mt-0">{label}</FormLabel>
    </FormItem>
  );
}

export function Required() {
  return <span>*</span>;
}

type CheckboxFieldProps<Inputs extends FieldValues> = {
  name: FieldPath<Partial<Inputs>>;
  label: React.ReactNode;
  className?: string;
};

export function createTypedCheckboxField<Inputs extends FieldValues>() {
  return function CheckboxField({ name, label, className }: CheckboxFieldProps<Inputs>) {
    const form = useFormContext<Partial<Inputs>>();

    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            <div className="g-flex g-flex-row g-space-x-3 g-space-y-0 g-cursor-pointer">
              <FormControl>
                <Checkbox checked={field.value as boolean} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="g-font-normal g-leading-4 g-cursor-pointer">{label}</FormLabel>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };
}

type TextFieldProps<Inputs extends FieldValues> = {
  name: FieldPath<Partial<Inputs>>;
  label?: React.ReactNode;
  descriptionPosition?: 'above' | 'below';
  description?: React.ReactNode;
  textarea?: boolean;
  required?: boolean;
  className?: string;
  type?: 'text' | 'email';
  autoComplete?: string;
  defaultValue?: unknown;
  placeholder?: string;
};

export function createTypedTextField<Inputs extends FieldValues>() {
  return function TextField({
    name,
    label,
    description,
    descriptionPosition = 'above',
    textarea = false,
    required = false,
    className,
    type = 'text',
    autoComplete,
    defaultValue = '',
    placeholder,
  }: TextFieldProps<Inputs>) {
    const form = useFormContext<Partial<Inputs>>();

    return (
      <FormField
        control={form.control}
        name={name}
        // @ts-ignore (I don't know how to only allow fieldPath that are strings, so this could potentially be a number/boolean/etc)
        defaultValue={defaultValue}
        render={({ field }) => (
          <FormItem className={cn('g-flex-1', className)}>
            {label && (
              <FormLabel>
                {label}
                {required && <Required />}
              </FormLabel>
            )}
            {descriptionPosition === 'above' && description && (
              <FormDescription>{description}</FormDescription>
            )}
            <FormControl>
              {textarea ? (
                /* @ts-ignore (I don't know how to only allow fieldPath that are strings, so this could potentially be a number/boolean/etc) */
                <Textarea placeholder={placeholder} rows={8} {...field} />
              ) : (
                /* @ts-ignore (I don't know how to only allow fieldPath that are strings, so this could potentially be a number/boolean/etc) */
                <Input
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  type={type}
                  {...field}
                />
              )}
            </FormControl>
            {descriptionPosition === 'below' && description && (
              <FormDescription>{description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };
}

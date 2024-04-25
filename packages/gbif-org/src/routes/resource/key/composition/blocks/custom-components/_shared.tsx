import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/utils/shadcn';
import { FieldPath, FieldValues, useFormContext } from 'react-hook-form';
import { z } from 'zod';

export const RequiredStringSchema = z.string().min(1, 'validation.required');
export const RequiredEmailSchema = RequiredStringSchema.email('validation.invalidEmail');
export const OptionalStringSchema = z.string().optional();

type RadioItemProps = {
  value: string;
  label: React.ReactNode;
};

export function RadioItem({ value, label }: RadioItemProps) {
  return (
    <FormItem className="flex items-center space-x-3 space-y-0">
      <FormControl defaultChecked={false}>
        <RadioGroupItem value={value} />
      </FormControl>
      <FormLabel className="font-normal">{label}</FormLabel>
    </FormItem>
  );
}

export function Required() {
  return <span>*</span>;
}

type CheckboxFieldProps<Inputs extends FieldValues> = {
  name: FieldPath<Partial<Inputs>>;
  label: React.ReactNode;
};

export function createTypedCheckboxField<Inputs extends FieldValues>() {
  return function CheckboxField({ name, label }: CheckboxFieldProps<Inputs>) {
    const form = useFormContext<Partial<Inputs>>();

    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex-1">
            <div className="flex flex-row items-start space-x-3 space-y-0 cursor-pointer">
              <FormControl>
                <Checkbox checked={field.value as boolean} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="font-normal leading-4 cursor-pointer">{label}</FormLabel>
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
  }: TextFieldProps<Inputs>) {
    const form = useFormContext<Partial<Inputs>>();

    return (
      <FormField
        control={form.control}
        name={name}
        // @ts-ignore (I don't know how to only allow fieldPath that are strings, so this could potentially be a number/boolean/etc)
        defaultValue=""
        render={({ field }) => (
          <FormItem className={cn('flex-1', className)}>
            {label && (
              <FormLabel className="font-normal">
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
                <Textarea rows={8} {...field} />
              ) : (
                /* @ts-ignore (I don't know how to only allow fieldPath that are strings, so this could potentially be a number/boolean/etc) */
                <Input autoComplete={autoComplete} type={type} {...field} />
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

import { Control, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { Checkbox } from '../ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { BaseFilter } from './baseFilter';
import { MultiOptionsFilter, Option } from './types';
import { z } from 'zod';
import { Button } from '../ui/button';
import React from 'react';

const FormSchema = z.object({
  values: z.array(z.string()),
});

type FormValues = z.infer<typeof FormSchema>;

type Props = {
  filter: MultiOptionsFilter;
  onSubmit: SubmitHandler<FormValues>;
};

export function MultiOptionsFilterComponent({ filter, onSubmit }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      values: filter.selectedValues,
    },
  });

  // Rest the form when the popover is opend
  React.useEffect(() => {
    if (isOpen) {
      form.reset({ values: filter.selectedValues });
    }
  }, [isOpen, filter.selectedValues, form.reset]);

  const selectedOptions: Option[] = React.useMemo(
    () => filter.options.filter((option) => filter.selectedValues.includes(option.value)),
    [filter.options, filter.selectedValues]
  );

  return (
    <BaseFilter
      name={filter.name}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      selectedOptions={selectedOptions}
    >
      <Form {...form}>
        <div className="flex items-center justify-between pb-2">
          <span className="text-sm text-gray-400 block">
            <SelectedCount control={form.control} /> selected
          </span>

          <ClearButton control={form.control} onClick={() => form.reset({ values: [] })} />
        </div>
        <form
          onSubmit={form.handleSubmit((data) => {
            onSubmit(data);
            setIsOpen(false);
          })}
        >
          <FormField
            control={form.control}
            name="values"
            render={() => (
              <FormItem>
                {filter.options.map((option) => (
                  <FormField
                    key={option.value}
                    control={form.control}
                    name="values"
                    render={({ field }) => (
                      <FormItem key={option.value} className="flex items-center space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.value)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, option.value])
                                : field.onChange(
                                    field.value?.filter((value) => value !== option.value)
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal pl-2 cursor-pointer">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </FormItem>
            )}
          />
          <div className="pt-6 flex items-center justify-end space-x-4">
            <Button type="reset" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>

            <Button type="submit">Apply</Button>
          </div>
        </form>
      </Form>
    </BaseFilter>
  );
}

// This component exists because it scopes the rerender of the selected options count to a single text node
function SelectedCount({ control }: { control: Control<FormValues, any> }) {
  const options = useWatch({ control, name: 'values' });
  return <>{options.length}</>;
}

function ClearButton({
  control,
  onClick,
}: {
  control: Control<FormValues, any>;
  onClick?: () => void;
}) {
  const options = useWatch({ control, name: 'values' });
  if (options.length === 0) return null;
  return (
    <Button className="p-0 h-4" variant="linkDestructive" onClick={onClick}>
      Clear
    </Button>
  );
}

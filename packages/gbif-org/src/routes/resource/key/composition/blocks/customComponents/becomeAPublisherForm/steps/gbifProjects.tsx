import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { cn } from '@/utils/shadcn';
import { useFormContext } from 'react-hook-form';
import { RadioItem } from '../../_shared';
import { Inputs, TextField } from '../becomeAPublisherForm';

export function GbifProjects() {
  const form = useFormContext<Partial<Inputs>>();

  return (
    <>
      <p className="g-pb-2 g-text-sm">
        For example: Biodiversity Information for Development (BID), Biodiversity Information Fund
        for Asia (BIFA), Capacity Enhancement Support Programme (CESP).
      </p>
      <FormField
        control={form.control}
        name="gbifProjects.type"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                className="g-flex g-flex-col g-space-y-1 g-pt-2"
              >
                <RadioItem value="yes" label="Yes" />

                <ProjectIdentifier />

                <RadioItem value="no" label="No" />
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

function ProjectIdentifier() {
  const form = useFormContext<Partial<Inputs>>();
  const hidden = form.watch('gbifProjects.type') !== 'yes';

  return (
    <TextField
      name="gbifProjects.projectIdentifier"
      label="Project identifier"
      className={cn('g-pl-6', { 'g-hidden': hidden })}
      description="Please enter the project identifier - e.g. BID-CA2016-0000-NAC"
      descriptionPosition="above"
    />
  );
}

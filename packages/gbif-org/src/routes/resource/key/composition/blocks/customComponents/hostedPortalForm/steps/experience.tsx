import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { useFormContext } from 'react-hook-form';
import { RadioItem } from '../../_shared';
import { Inputs } from '../hostedPortalForm';

export function Experience() {
  const form = useFormContext<Partial<Inputs>>();

  return (
    <FormField
      control={form.control}
      name="experience"
      render={({ field }) => (
        <FormItem className="g-space-y-3">
          <FormDescription>
            We will be managing the hosted portals in GitHub. You will need to author content using
            Markdown and YAML. This is not difficult and we can direct you to documentation and
            provide support in getting started if needed. Please state your level of experience with
            these:
          </FormDescription>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} className="g-flex g-flex-col g-space-y-1">
              <RadioItem
                value="has_plenty_experience"
                label="I am comfortable with using GitHub, Markdown and YAML to author web content"
              />
              <RadioItem
                value="has_limited_experience"
                label="I have some experience but would like some help to get started"
              />
              <RadioItem
                value="has_no_experience"
                label="I have never used GitHub, Markdown or YAML to author web content"
              />
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

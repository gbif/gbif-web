import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { Inputs, TextField } from '../mdtForm';
export function TimeLine() {
  const form = useFormContext<Partial<Inputs>>();

  return (
    <>
      <p className="g-pb-2 g-text-sm">
        <FormattedMessage
          id="mdt.describeTimeline"
          defaultMessage="Please let us know if there is a deadline for configuring this installation."
        />
      </p>
      <FormField
        control={form.control}
        name="timeline"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <TextField textarea={true} name="timeline" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { Inputs, TextField } from '../mdtForm';
export function ContentProviders() {
  const form = useFormContext<Partial<Inputs>>();

  return (
    <>
      <p className="g-pb-2 g-text-sm">
        <FormattedMessage
          id="mdt.describeContentProviders"
          defaultMessage="Please describe who you anticipate publishing data, and if you already have publishers ready to use the service."
        />
      </p>
      <FormField
        control={form.control}
        name="content_providers"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <TextField textarea={true} name="content_providers" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

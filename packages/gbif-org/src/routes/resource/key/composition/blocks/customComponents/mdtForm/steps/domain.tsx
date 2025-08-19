import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { Inputs, TextField } from '../mdtForm';
export function Domain() {
  const form = useFormContext<Partial<Inputs>>();

  return (
    <>
      <p className="g-pb-2 g-text-sm">
        <FormattedMessage
          id="mdt.doYouHaveADomain"
          defaultMessage="If you have your own domain that you want to use for the installation, enter it here (e.g. mdt.gbif.xx)
"
        />
      </p>
      <FormField
        control={form.control}
        name="domain"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <TextField name="domain" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

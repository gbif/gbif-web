import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { Inputs, TextField } from '../mdtForm';
export function Description() {
  const form = useFormContext<Partial<Inputs>>();

  return (
    <>
      <p className="g-pb-2 g-text-sm">
        <FormattedMessage
          id="mdt.installation_name"
          defaultMessage="Please let us know how this installation should be named; e.g. “GBIF.us Metabarcoding Datasets”, “GBIF Africa Metabarcoding Datasets”, “Acme Metabarcoding Converter”"
        />
      </p>
      <FormField
        control={form.control}
        name="installation_name"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <TextField name="installation_name" />
            </FormControl>
          </FormItem>
        )}
      />
      <p className="g-mt-4 g-text-sm">
        <FormattedMessage
          id="mdt.description"
          defaultMessage="Please give a short description of your installation. This will be visible on the 'about' page."
        />
      </p>
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <TextField textarea={true} name="description" />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { RadioItem } from '../../_shared';
import { Inputs } from '../mdtForm';

export function ModeOfOperation() {
  const form = useFormContext<Partial<Inputs>>();

  return (
    <FormField
      control={form.control}
      name="Mode_of_operation"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} className="g-flex g-flex-col g-space-y-1">
              <RadioItem
                value={'publishing'}
                label={<FormattedMessage id="mdt.publishing" defaultMessage="Publishing mode" />}
              />
              <p>
                Users of the tool can be enabled to register datasets in GBIF on behalf of the
                organizations to which they have been associated. In this mode, the tool operates in
                a similar manner to an IPT, and is a publishing platform into GBIF where datasets
                become hosted by GBIF within the tool.
              </p>

              <RadioItem
                value={'conversion_only'}
                label={
                  <FormattedMessage
                    id="mdt.conversion_only"
                    defaultMessage="Conversion-only mode"
                  />
                }
              />
              <p>
                Users of the tool can use the tool to shape their dataset, but must download the
                resulting dataset and submit it to another repository, such as a GBIF IPT
                installation, in order to publish to GBIF. This may be appropriate in situations
                where there are concerns of having GBIF host datasets. A tool may be converted from
                conversion-only mode to publishing mode later.{' '}
              </p>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

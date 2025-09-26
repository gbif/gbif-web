import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { RadioItem, Required } from '../../_shared';
import { Inputs } from '../mdtForm';

export function ModeOfOperation() {
  const form = useFormContext<Partial<Inputs>>();

  return (
    <div>
      <FormField
        control={form.control}
        name="Mode_of_operation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <FormattedMessage id="mdt.whatBestDescribesYourApplication" />
              <Required />
            </FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="g-flex g-flex-col g-space-y-1"
              >
                <RadioItem value="publishing" label={<FormattedMessage id="mdt.publishing" />} />
                <p className="g-text-sm">
                  <FormattedMessage id="mdt.publishingDescription" />
                </p>

                <RadioItem
                  value="conversion_only"
                  label={<FormattedMessage id="mdt.conversionOnly" />}
                />
                <p className="g-text-sm">
                  <FormattedMessage id="mdt.conversionOnlyDescription" />{' '}
                </p>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

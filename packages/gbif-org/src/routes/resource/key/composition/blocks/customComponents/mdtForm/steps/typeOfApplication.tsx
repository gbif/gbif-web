import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { RadioItem, Required } from '../../_shared';
import { Inputs, TextField } from '../mdtForm';

export function TypeOfApplication() {
  const { control, watch } = useFormContext<Partial<Inputs>>();
  const type = watch('type');

  return (
    <>
      <FormField
        control={control}
        name="type"
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
                <RadioItem
                  value={'National_installation'}
                  label={<FormattedMessage id="mdt.nationalInstallation" />}
                />
                <RadioItem
                  value={'Thematic_node_installation'}
                  label={<FormattedMessage id="mdt.thematicNodeInstallation" />}
                />
                <RadioItem
                  value={'Regional_installation'}
                  label={<FormattedMessage id="mdt.regionalInstallation" />}
                />
                <RadioItem
                  value={'Group_installation'}
                  label={<FormattedMessage id="mdt.groupInstallation" />}
                />
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {type === 'Group_installation' && (
        <>
          <p className="g-my-4 g-text-sm">
            <FormattedMessage id="mdt.groupInstallExplainer" />
          </p>
          <TextField
            textarea
            name="group_publisher_description"
            label={<FormattedMessage id="mdt.groupPublisherDescription" />}
          />
        </>
      )}
    </>
  );
}

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { RadioItem } from '../../_shared';
import { Inputs, TextField } from '../mdtForm';

export function TypeOfApplication() {
  const form = useFormContext<Partial<Inputs>>();
  const watch = useWatch();
  const [showGroupDescription, setShowGroupDescription] = useState(false);
  useEffect(() => {
    if (watch.type === 'Group_installation') {
      setShowGroupDescription(true);
    } else {
      form.setValue('group_publisher_description', '');
      setShowGroupDescription(false);
    }
  }, [form, watch.type]);
  return (
    <>
      <p className="g-pb-2 g-text-sm">
        <FormattedMessage
          id="mdt.typeOfApplication"
          defaultMessage="What best describes your application?"
        />
      </p>
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} className="g-flex g-flex-col g-space-y-1">
                <RadioItem
                  value={'National_installation'}
                  label={
                    <FormattedMessage
                      id="mdt.National_installation"
                      defaultMessage="A national installation."
                    />
                  }
                />

                <RadioItem
                  value={'Thematic_node_installation'}
                  label={
                    <FormattedMessage
                      id="mdt.Thematic_node_installation"
                      defaultMessage="An installation to support your thematic Node."
                    />
                  }
                />
                <RadioItem
                  value={'Regional_installation'}
                  label={
                    <FormattedMessage
                      id="mdt.Regional_installation"
                      defaultMessage="An installation for a GBIF Region (application to be submitted only by the regional representative Node Manager)."
                    />
                  }
                />
                <RadioItem
                  value={'Group_installation'}
                  label={
                    <FormattedMessage
                      id="mdt.Group_installation"
                      defaultMessage="An installation for a group of publishers within our nodes network."
                    />
                  }
                />
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {showGroupDescription && (
        <>
          {' '}
          <p className="g-mt-8 g-text-sm">
            The programme is intended primarily to support node and regional installations, rather
            than e.g. an installation for every publishing organization. However, we know there may
            be cases where an alternative to a Node or regional installation may be more suitable to
            bring significant amounts of data. Can you please justify why you feel this is needed?
          </p>{' '}
          <FormField
            control={form.control}
            name="group_publisher_description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextField
                    textarea={true}
                    name="group_publisher_description"
                    label={
                      <FormattedMessage
                        id="mdt.group_publisher_description"
                        defaultMessage="Please describe which data publisher(s) and/or GBIF participants will be involved"
                      />
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </>
  );
}

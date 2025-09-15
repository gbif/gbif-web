import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { cn } from '@/utils/shadcn';
import { useFormContext } from 'react-hook-form';
import { RadioItem } from '../../_shared';
import { Inputs, TextField } from '../hostedPortalForm';
import { FormattedMessage } from 'react-intl';

export function NodeContact() {
  const form = useFormContext<Partial<Inputs>>();

  return (
    <FormField
      control={form.control}
      name="nodeContact.type"
      render={({ field }) => (
        <FormItem className="g-space-y-3">
          <FormControl>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="g-flex g-flex-col g-space-y-1"
            >
              <RadioItem
                value="I_am_the_node_manager"
                label={
                  <FormattedMessage
                    id="hostedPortalApplication.nodeContact.iAmNodeManager"
                    defaultMessage="I am the Node Manager"
                  />
                }
              />

              <RadioItem
                value="Node_manager_contacted"
                label={
                  <FormattedMessage
                    id="hostedPortalApplication.nodeContact.yesContacted"
                    defaultMessage="Yes, I am in contact with a Node Manager about this application"
                  />
                }
              />

              <NodeManager />

              <RadioItem
                value="No_contact_to_node_manager"
                label={
                  <FormattedMessage
                    id="hostedPortalApplication.nodeContact.noContact"
                    defaultMessage="I have not yet contacted a Node Manager about this application"
                  />
                }
              />
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function NodeManager() {
  const form = useFormContext<Partial<Inputs>>();
  const nodeContactType = form.watch('nodeContact.type');

  return (
    <TextField
      name="nodeContact.nodeManager"
      className={cn('g-pl-6', { 'g-hidden': nodeContactType !== 'Node_manager_contacted' })}
      description={
        <FormattedMessage
          id="hostedPortalApplication.nodeContact.nodeManagerDescription"
          defaultMessage="Please state which Node Manager"
        />
      }
      descriptionPosition="above"
    />
  );
}

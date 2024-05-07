import { useFormContext } from 'react-hook-form';
import { Inputs, TextField } from '../HostedPortalForm';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { RadioItem } from '../../_shared';
import { cn } from '@/utils/shadcn';

export function NodeContact() {
  const form = useFormContext<Partial<Inputs>>();

  return (
    <FormField
      control={form.control}
      name="nodeContact.type"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormControl>
            <RadioGroup onValueChange={field.onChange} className="flex flex-col space-y-1">
              <RadioItem value="I_am_the_node_manager" label="I am the Node Manager" />

              <RadioItem
                value="Node_manager_contacted"
                label="Yes, I am in contact with a Node Manager about this application"
              />

              <NodeManager />

              <RadioItem
                value="No_contact_to_node_manager"
                label="I have not yet contacted a Node Manager about this application"
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
      className={cn('pl-6', { hidden: nodeContactType !== 'Node_manager_contacted' })}
      description="Please state which Node Manager"
      descriptionPosition="above"
    />
  );
}

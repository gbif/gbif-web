import { useFormContext } from 'react-hook-form';
import { CheckboxField, Inputs, TextField } from '../BecomeAPublisherForm';
import { DynamicLink } from '@/components/DynamicLink';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioItem } from '../../_shared';
import { RadioGroup } from '@/components/ui/radio-group';

export function WhatAndHow() {
  const form = useFormContext<Partial<Inputs>>();
  const toolPlanned = form.watch('whatAndHow.toolPlanned');

  return (
    <>
      <p className="text-sm">
        Help us understand what kind of data you plan to publish, and what support you may need.
      </p>
      <p className="text-sm pt-2">
        GBIF.org supports publication of four types of data, explained{' '}
        <DynamicLink to="/dataset-classes">here.</DynamicLink> Responsibility for formatting the
        data and hosting the original datasets remains with the data publisher, but we can help you
        find appropriate technical solutions.
      </p>

      <p className="text-sm font-medium pt-4">Which types of data do you expect to publish?</p>

      <div className="flex justify-start md:justify-between flex-wrap pt-2">
        <CheckboxField
          className="mb-2 mr-4"
          name="whatAndHow.resourceMetadata"
          label="Resource metadata"
        />
        <CheckboxField
          className="mb-2 mr-4"
          name="whatAndHow.checklistData"
          label="Checklist data"
        />
        <CheckboxField
          className="mb-2 mr-4"
          name="whatAndHow.occurrenceOnlyData"
          label="Occurrence-only data"
        />
        <CheckboxField
          className="mb-2 mr-4"
          name="whatAndHow.samplingEventData"
          label="Sampling-event data"
        />
      </div>

      <TextField
        className="pt-2"
        name="whatAndHow.description"
        label="Data description"
        description="What kinds of relevant data do you have that you intend to publish through GBIF? Please give a brief description."
        required
        textarea
      />

      <FormField
        control={form.control}
        name="whatAndHow.serverCapable"
        render={({ field }) => (
          <FormItem className="space-y-2 pt-4">
            <FormLabel>
              Do you have EITHER the capacity to run a live server, OR access to a server, through
              which you will make your original dataset available to GBIF.org?
            </FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} className="flex flex-row space-x-4">
                <RadioItem value="yes" label="Yes" />
                <RadioItem value="no" label="No" />
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="whatAndHow.toolPlanned"
        render={({ field }) => (
          <FormItem className="space-y-2 pt-4">
            <FormLabel>
              Are you planning to install and run publishing software (such as the{' '}
              <DynamicLink to="/ipt">Integrated Publishing Toolkit – IPT</DynamicLink> to publish
              your data directly to GBIF.org?
            </FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} className="flex flex-row space-x-4 mt-1">
                <RadioItem value="yes" label="Yes" />
                <RadioItem value="no" label="No" />
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {toolPlanned === 'yes' && (
        <p className="text-orange-400 text-sm pt-2">
          In this case, it is recommended that you first try reusing an existing trusted{' '}
          <a
            href="https://github.com/gbif/ipt/wiki/dataHostingCentres#data-hosting-centres"
            target="_blank"
          >
            IPT data hosting centre
          </a>
        </p>
      )}

      <FormField
        control={form.control}
        name="whatAndHow.doYouNeedHelpPublishing"
        render={({ field }) => (
          <FormItem className="space-y-2 pt-4">
            <FormLabel>Do you need help in publishing your data?</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} className="flex flex-row space-x-4 mt-1">
                <RadioItem value="yes" label="Yes" />
                <RadioItem value="no" label="No" />
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

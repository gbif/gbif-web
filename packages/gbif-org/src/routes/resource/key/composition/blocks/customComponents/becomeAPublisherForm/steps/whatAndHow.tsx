import { useFormContext } from 'react-hook-form';
import { CheckboxField, Inputs, TextField } from '../becomeAPublisherForm';
import { DynamicLink } from '@/reactRouterPlugins';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioItem } from '../../_shared';
import { RadioGroup } from '@/components/ui/radio-group';

export function WhatAndHow() {
  const form = useFormContext<Partial<Inputs>>();
  const toolPlanned = form.watch('whatAndHow.toolPlanned');

  return (
    <>
      <p className="g-text-sm">
        Help us understand what kind of data you plan to publish, and what support you may need.
      </p>
      <p className="g-text-sm g-pt-2">
        GBIF.org supports publication of four types of data, explained{' '}
        <DynamicLink to="/dataset-classes">here.</DynamicLink> Responsibility for formatting the
        data and hosting the original datasets remains with the data publisher, but we can help you
        find appropriate technical solutions.
      </p>

      <p className="g-text-sm g-font-medium g-pt-4">
        Which types of data do you expect to publish?
      </p>

      <div className="g-flex g-justify-start md:g-justify-between g-flex-wrap g-pt-2">
        <CheckboxField
          className="g-mb-2 g-mr-4"
          name="whatAndHow.resourceMetadata"
          label="Resource metadata"
        />
        <CheckboxField
          className="g-mb-2 g-mr-4"
          name="whatAndHow.checklistData"
          label="Checklist data"
        />
        <CheckboxField
          className="g-mb-2 g-mr-4"
          name="whatAndHow.occurrenceOnlyData"
          label="Occurrence-only data"
        />
        <CheckboxField
          className="g-mb-2 g-mr-4"
          name="whatAndHow.samplingEventData"
          label="Sampling-event data"
        />
      </div>

      <TextField
        className="g-pt-2"
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
          <FormItem className="g-space-y-2 g-pt-4">
            <FormLabel>
              Do you have EITHER the capacity to run a live server, OR access to a server, through
              which you will make your original dataset available to GBIF.org?
            </FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} className="g-flex g-flex-row g-space-x-4">
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
          <FormItem className="g-space-y-2 g-pt-4">
            <FormLabel>
              Are you planning to install and run publishing software (such as the{' '}
              <DynamicLink to="/ipt">Integrated Publishing Toolkit – IPT</DynamicLink> to publish
              your data directly to GBIF.org?
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                className="g-flex g-flex-row g-space-x-4 g-mt-1"
              >
                <RadioItem value="yes" label="Yes" />
                <RadioItem value="no" label="No" />
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {toolPlanned === 'yes' && (
        <p className="g-text-orange-400 g-text-sm g-pt-2">
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
          <FormItem className="g-space-y-2 g-pt-4">
            <FormLabel>Do you need help in publishing your data?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                className="g-flex g-flex-row g-space-x-4 g-mt-1"
              >
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

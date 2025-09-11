import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { cn } from '@/utils/shadcn';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { RadioItem } from '../../_shared';
import { CheckboxField, Inputs, TextField } from '../becomeAPublisherForm';
import styles from './style.module.css';

export function WhatAndHow() {
  const form = useFormContext<Partial<Inputs>>();
  const toolPlanned = form.watch('whatAndHow.toolPlanned');

  return (
    <>
      <p className="g-text-sm">
        <FormattedMessage
          id="eoi.helpUsUnderstand"
          defaultMessage="Help us understand what kind of data you plan to publish, and what support you may need"
        />
      </p>
      <p className={cn(`${styles.endorsementFormLabel}`, 'g-text-sm g-pt-2')}>
        <FormattedMessage
          id="eoi.publOfFourTypesOfData"
          defaultMessage="GBIF.org supports publication of four types of data, explained [here.](/dataset-classes) Responsibility for formatting the data and hosting the original datasets remains with the data publisher, but we can help you find appropriate technical solutions."
        >
          {(data) => <span dangerouslySetInnerHTML={{ __html: data }} />}
        </FormattedMessage>
      </p>

      <p className="g-text-sm g-font-medium g-pt-4">
        <FormattedMessage
          id="eoi.whichTypesOfData"
          defaultMessage="Which types of data do you expect to publish?"
        />
      </p>

      <div className="g-flex g-justify-start md:g-justify-between g-flex-wrap g-pt-2">
        <CheckboxField
          className="g-mb-2 g-mr-4"
          name="whatAndHow.resourceMetadata"
          label={<FormattedMessage id="eoi.resourcesMetaData" defaultMessage="Resource metadata" />}
        />
        <CheckboxField
          className="g-mb-2 g-mr-4"
          name="whatAndHow.checklistData"
          label={<FormattedMessage id="eoi.checkListData" defaultMessage="Checklist data" />}
        />
        <CheckboxField
          className="g-mb-2 g-mr-4"
          name="whatAndHow.occurrenceOnlyData"
          label={
            <FormattedMessage id="eoi.occurrenceOnlyData" defaultMessage="Occurrence-only data" />
          }
        />
        <CheckboxField
          className="g-mb-2 g-mr-4"
          name="whatAndHow.samplingEventData"
          label={
            <FormattedMessage id="eoi.samplingEventData" defaultMessage="Sampling-event data" />
          }
        />
      </div>

      <TextField
        className="g-pt-2"
        name="whatAndHow.description"
        label={<FormattedMessage id="eoi.expectedDataTitle" defaultMessage="Data description" />}
        description={
          <FormattedMessage
            id="eoi.expectedDataContent"
            defaultMessage="What kinds of relevant data do you have that you intend to publish through GBIF? Please give a brief description."
          />
        }
        required
        textarea
      />

      <FormField
        control={form.control}
        name="whatAndHow.serverCapable"
        render={({ field }) => (
          <FormItem className="g-space-y-2 g-pt-4">
            <FormLabel>
              <FormattedMessage
                id="eoi.doYouHaveCapacity"
                defaultMessage="Do you have EITHER the capacity to run a live server, OR access to a server, through
              which you will make your original dataset available to GBIF.org?"
              />
            </FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="g-flex g-flex-row g-space-x-4"
              >
                <RadioItem
                  value="yes"
                  label={<FormattedMessage id="eoi.yes" defaultMessage="Yes" />}
                />
                <RadioItem
                  value="no"
                  label={<FormattedMessage id="eoi.no" defaultMessage="No" />}
                />
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
            <FormLabel className={cn(`${styles.endorsementFormLabel}`)}>
              <FormattedMessage
                id="eoi.areYouPlanningToInstallAndRun"
                defaultMessage={`Are you planning to install and run publishing software (such as the{' '}
              <DynamicLink to="/ipt">Integrated Publishing Toolkit – IPT</DynamicLink> to publish
              your data directly to GBIF.org?`}
              >
                {(data) => <span dangerouslySetInnerHTML={{ __html: data }} />}
              </FormattedMessage>
            </FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="g-flex g-flex-row g-space-x-4 g-mt-1"
              >
                <RadioItem
                  value="yes"
                  label={<FormattedMessage id="eoi.yes" defaultMessage="Yes" />}
                />
                <RadioItem
                  value="no"
                  label={<FormattedMessage id="eoi.no" defaultMessage="No" />}
                />
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {toolPlanned === 'yes' && (
        <p className={cn(`${styles.endorsementFormLabel}`, 'g-text-orange-400 g-text-sm g-pt-2')}>
          <FormattedMessage
            id="eoi.reuseTrustedIPThosting"
            defaultMessage={`In this case, it is recommended that you first try reusing an existing trusted [IPT data hosting centre](https://github.com/gbif/ipt/wiki/dataHostingCentres#data-hosting-centres)`}
          >
            {(data) => <span dangerouslySetInnerHTML={{ __html: data }} />}
          </FormattedMessage>
        </p>
      )}

      <FormField
        control={form.control}
        name="whatAndHow.doYouNeedHelpPublishing"
        render={({ field }) => (
          <FormItem className="g-space-y-2 g-pt-4">
            <FormLabel>
              <FormattedMessage
                id="eoi.doYouNeedHelpPublishing"
                defaultMessage="Do you need help in publishing your data?"
              />
            </FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="g-flex g-flex-row g-space-x-4 g-mt-1"
              >
                <RadioItem
                  value="yes"
                  label={<FormattedMessage id="eoi.yes" defaultMessage="Yes" />}
                />
                <RadioItem
                  value="no"
                  label={<FormattedMessage id="eoi.no" defaultMessage="No" />}
                />
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

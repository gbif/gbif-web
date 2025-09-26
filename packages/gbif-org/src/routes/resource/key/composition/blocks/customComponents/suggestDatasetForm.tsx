import { ClientSideOnly } from '@/components/clientSideOnly';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { useConfig } from '@/config/config';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { z } from 'zod';
import { BlockContainer } from '../_shared';
import {
  createTypedCheckboxField,
  createTypedTextField,
  OptionalStringSchema,
  RadioItem,
  RequiredStringSchema,
} from './_shared';

const Schema = z.object({
  title: RequiredStringSchema,
  datasetLink: z.string().url().optional().or(z.literal('')),
  region: RequiredStringSchema,
  taxon: RequiredStringSchema,
  datasetImportance: OptionalStringSchema,
  priority: z.enum(['high', 'medium', 'low']).optional(),
  datasetBibliographicDoi: z.string().url().optional().or(z.literal('')),
  type: z.enum(['undefined', 'OCCURRENCE', 'CHECKLIST', 'SAMPLING_EVENT', 'METADATA']),
  license: z.enum(['CC0_1_0', 'CC_BY_4_0', 'CC_BY_NC_4_0', 'UNSPECIFIED', 'UNSUPPORTED']),
  datasetHolderContact: OptionalStringSchema,
  userContact: OptionalStringSchema,
  comments: OptionalStringSchema,
});

export type Inputs = z.infer<typeof Schema>;

export const CheckboxField = createTypedCheckboxField<Inputs>();
export const TextField = createTypedTextField<Inputs>();

export function SuggestDatasetForm() {
  const { toast } = useToast();
  const config = useConfig();
  const { formatMessage } = useIntl();

  const form = useForm<Inputs>({
    resolver: zodResolver(Schema),
    mode: 'onBlur',
  });

  const onSubmit = useMemo(
    () =>
      form.handleSubmit((data: Inputs) => {
        fetch(`${config.formsEndpoint}/suggest-dataset`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then(async (response) => {
            if (!response.ok) throw response;
            const json = await response.json();

            toast({
              title: formatMessage({ id: 'suggestDataset.successTitle' }),
              description: formatMessage({ id: 'suggestDataset.successMessage' }),
              action: (
                <ToastAction altText="View issue on GitHub" asChild>
                  <a target="_blank" href={json.link}>
                    <FormattedMessage id="suggestDataset.viewIssue" />
                  </a>
                </ToastAction>
              ),
            });
          })
          .catch((error) => {
            console.error(error);
            toast({
              title: formatMessage({ id: 'suggestDataset.errorTitle' }),
              description: formatMessage({ id: 'suggestDataset.errorMessage' }),
              variant: 'destructive',
            });
          });
      }),
    [form, toast, formatMessage, config.formsEndpoint]
  );

  return (
    <BlockContainer className="g-p-0 g-overflow-visible">
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="g-max-w-3xl g-bg-white g-m-auto g-flex g-flex-col g-gap-4"
        >
          <SideBySide>
            <TextField
              name="title"
              required
              placeholder={formatMessage({ id: 'suggestDataset.titlePlaceholder' })}
              label={<FormattedMessage id="suggestDataset.title" />}
            />

            <TextField
              name="datasetLink"
              placeholder={formatMessage({ id: 'suggestDataset.datasetLinkPlaceholder' })}
              label={<FormattedMessage id="suggestDataset.datasetLink" />}
            />
          </SideBySide>

          <SideBySide>
            <TextField
              name="region"
              required
              placeholder={formatMessage({ id: 'suggestDataset.regionPlaceholder' })}
              label={<FormattedMessage id="suggestDataset.region" />}
            />

            <TextField
              name="taxon"
              required
              placeholder={formatMessage({ id: 'suggestDataset.taxonPlaceholder' })}
              label={<FormattedMessage id="suggestDataset.taxon" />}
            />
          </SideBySide>

          <SideBySide>
            <TextField
              className="flex-1"
              name="datasetImportance"
              label={<FormattedMessage id="suggestDataset.datasetImportance" />}
              textarea
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="g-space-y-3 g-flex-1">
                  <FormLabel>
                    <FormattedMessage id="suggestDataset.priority" />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      className="g-flex g-flex-col g-space-y-1"
                    >
                      <RadioItem
                        value="high"
                        label={<FormattedMessage id="suggestDataset.priorityHigh" />}
                      />

                      <RadioItem
                        value="medium"
                        label={<FormattedMessage id="suggestDataset.priorityMedium" />}
                      />
                      <RadioItem
                        value="low"
                        label={<FormattedMessage id="suggestDataset.priorityLow" />}
                      />
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SideBySide>

          <TextField
            label={<FormattedMessage id="suggestDataset.bibliographicReference" />}
            placeholder={formatMessage({
              id: 'suggestDataset.bibliographicReferencePlaceholder',
            })}
            name="datasetBibliographicDoi"
          />

          <SideBySide>
            <FormField
              control={form.control}
              name="license"
              defaultValue="UNSPECIFIED"
              render={({ field }) => (
                <FormItem className="g-space-y-3 g-flex-1">
                  <FormLabel>
                    <FormattedMessage id="suggestDataset.license" />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      className="g-flex g-flex-col g-space-y-1"
                    >
                      <RadioItem
                        value="CC0_1_0"
                        label={<FormattedMessage id="enums.license.CC0_1_0" />}
                      />
                      <RadioItem
                        value="CC_BY_4_0"
                        label={<FormattedMessage id="enums.license.CC_BY_4_0" />}
                      />
                      <RadioItem
                        value="CC_BY_NC_4_0"
                        label={<FormattedMessage id="enums.license.CC_BY_NC_4_0" />}
                      />
                      <RadioItem
                        value="UNSPECIFIED"
                        label={<FormattedMessage id="enums.license.UNSPECIFIED" />}
                      />
                      <RadioItem
                        value="UNSUPPORTED"
                        label={<FormattedMessage id="suggestDataset.licenseNotOpen" />}
                      />
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              defaultValue="undefined"
              render={({ field }) => (
                <FormItem className="g-space-y-3 g-flex-1">
                  <FormLabel>
                    <FormattedMessage id="suggestDataset.datasetType" />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      className="g-flex g-flex-col g-space-y-1"
                    >
                      <RadioItem
                        value="undefined"
                        label={<FormattedMessage id="suggestDataset.datasetTypeUnknown" />}
                      />
                      <RadioItem
                        value="OCCURRENCE"
                        label={<FormattedMessage id="enums.datasetType.OCCURRENCE" />}
                      />
                      <RadioItem
                        value="CHECKLIST"
                        label={<FormattedMessage id="enums.datasetType.CHECKLIST" />}
                      />
                      <RadioItem
                        value="SAMPLING_EVENT"
                        label={<FormattedMessage id="enums.datasetType.SAMPLING_EVENT" />}
                      />
                      <RadioItem
                        value="METADATA"
                        label={<FormattedMessage id="enums.datasetType.METADATA" />}
                      />
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SideBySide>

          <SideBySide>
            <TextField
              name="datasetHolderContact"
              label={<FormattedMessage id="suggestDataset.datasetHolderContact" />}
              placeholder={formatMessage({
                id: 'suggestDataset.datasetHolderContactPlaceholder',
              })}
              description={<FormattedMessage id="suggestDataset.datasetHolderContactDescription" />}
              descriptionPosition="below"
            />

            <TextField
              name="userContact"
              label={<FormattedMessage id="suggestDataset.userContact" />}
              placeholder={formatMessage({ id: 'suggestDataset.userContactPlaceholder' })}
              description={<FormattedMessage id="suggestDataset.userContactDescription" />}
              descriptionPosition="below"
            />
          </SideBySide>

          <TextField
            name="comments"
            placeholder={formatMessage({ id: 'suggestDataset.commentsPlaceholder' })}
            label={<FormattedMessage id="suggestDataset.comments" />}
            textarea
          />

          <div>
            <Button type="submit">
              <FormattedMessage id="suggestDataset.submitButton" />
            </Button>
          </div>
        </form>
      </Form>
    </BlockContainer>
  );
}

function SideBySide({ children }: { children: React.ReactNode }) {
  return <div className="g-flex sm:g-flex-row g-flex-col g-gap-4">{children}</div>;
}

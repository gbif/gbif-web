import { z } from 'zod';
import {
  OptionalStringSchema,
  RadioItem,
  Required,
  RequiredStringSchema,
  createTypedCheckboxField,
  createTypedTextField,
} from './_shared';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { BlockContainer } from '../_shared';
import { ClientSideOnly } from '@/components/ClientSideOnly';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';

const Schema = z.object({
  title: RequiredStringSchema,
  datasetLink: z.string().url().optional().or(z.literal('')),
  region: RequiredStringSchema,
  taxon: RequiredStringSchema,
  datasetImportance: OptionalStringSchema,
  priority: z.enum(['high', 'medium', 'low']).optional(),
  datasetBibliographicDoi: z.string().url().optional().or(z.literal('')),
  type: z.enum(['undefined', 'OCCURRENCE', 'CHECKLIST', 'SAMPLING_EVENT', 'METADATA']),
  license: z.enum(['CC0 1.0', 'CC-BY 4.0', 'CC-BY-NC 4.0', 'Unspecified', 'Not open']),
  datasetHolderContact: OptionalStringSchema,
  userContact: OptionalStringSchema,
  comments: OptionalStringSchema,
});

export type Inputs = z.infer<typeof Schema>;

export const CheckboxField = createTypedCheckboxField<Inputs>();
export const TextField = createTypedTextField<Inputs>();

export function SuggestDatasetForm() {
  const { toast } = useToast();

  const form = useForm<Inputs>({
    resolver: zodResolver(Schema),
    mode: 'onBlur',
  });

  const onSubmit = useMemo(
    () =>
      form.handleSubmit((data: Inputs) => {
        fetch('http://localhost:4001/forms/suggest-dataset', {
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
              title: 'Thank you for your submission!',
              description:
                'We will review your dataset suggestion and get back to you as soon as possible.',
              action: (
                <ToastAction altText="View issue on GitHub" asChild>
                  <a target="_blank" href={json.link}>
                    View Issue
                  </a>
                </ToastAction>
              ),
            });
          })
          .catch((error) => {
            console.error(error);
            toast({
              title: 'An error occurred while submitting your dataset suggestion',
              description: 'Please try again later',
              variant: 'destructive',
            });
          });
      }),
    [form, toast]
  );

  return (
    <BlockContainer className="bg-gray-100">
      <ClientSideOnly>
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="max-w-3xl bg-white shadow p-4 m-auto flex flex-col gap-4"
          >
            <div className="flex gap-4">
              <TextField
                name="title"
                placeholder="Dataset name"
                label={
                  <span>
                    Title
                    <Required />
                  </span>
                }
              />

              <TextField
                name="datasetLink"
                placeholder="Where can we find the data"
                label="Internet link to data"
              />
            </div>

            <div className="flex gap-4">
              <TextField
                name="region"
                placeholder="E.g. 'Middle east' or 'Borneo'"
                label={
                  <span>
                    Geographic coverage
                    <Required />
                  </span>
                }
              />

              <TextField
                name="taxon"
                placeholder="E.g. 'Lepidoptera' or 'mushrooms'"
                label={
                  <span>
                    Taxonomic scope
                    <Required />
                  </span>
                }
              />
            </div>

            <div className="flex gap-4">
              <TextField
                className="flex-1"
                name="datasetImportance"
                label="Why is this dataset important"
                textarea
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="space-y-3 flex-1">
                    <FormLabel>How would you rate its importance</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        className="flex flex-col space-y-1"
                      >
                        <RadioItem
                          value="high"
                          label="Essential — GBIF have no data in this area"
                        />

                        <RadioItem
                          value="medium"
                          label="Important — GBIF have little data in this area"
                        />
                        <RadioItem
                          value="low"
                          label="It would be a nice supplement to the existing data"
                        />
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <TextField
              label="Bibliographic reference"
              placeholder="Link to related article if any"
              name="datasetBibliographicDoi"
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="license"
                defaultValue="Unspecified"
                render={({ field }) => (
                  <FormItem className="space-y-3 flex-1">
                    <FormLabel>Licence information</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        className="flex flex-col space-y-1"
                      >
                        <RadioItem value="CC0 1.0" label="CC0 1.0" />
                        <RadioItem value="CC-BY 4.0" label="CC BY 4.0" />
                        <RadioItem value="CC-BY-NC 4.0" label="CC BY-NC 4.0" />
                        <RadioItem value="Unspecified" label="Unspecified" />
                        <RadioItem value="Not open" label="Not an open licence" />
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
                  <FormItem className="space-y-3 flex-1">
                    <FormLabel>Dataset type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        className="flex flex-col space-y-1"
                      >
                        <RadioItem value="undefined" label="Unknown" />
                        <RadioItem value="OCCURRENCE" label="Occurrence" />
                        <RadioItem value="CHECKLIST" label="Checklist" />
                        <RadioItem value="SAMPLING_EVENT" label="Sampling event" />
                        <RadioItem value="METADATA" label="Metadata" />
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <TextField
                name="datasetHolderContact"
                label="Dataholders contact information"
                placeholder="E.g e-mail"
                description="These details will be public"
                descriptionPosition="below"
              />

              <TextField
                name="userContact"
                label="Your contact information"
                placeholder="E.g e-mail or Github username"
                description="These details will be public"
                descriptionPosition="below"
              />
            </div>

            <TextField
              name="comments"
              placeholder="Additional comments if any"
              label="Comments"
              textarea
            />

            <div>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </ClientSideOnly>
    </BlockContainer>
  );
}

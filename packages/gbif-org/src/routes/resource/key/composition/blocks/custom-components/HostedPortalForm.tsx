import { useEffect } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BlockContainer } from '../_shared';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { RadioGroup } from '@/components/ui/radio-group';
import { DynamicLink } from '@/components/DynamicLink';
import { cn } from '@/utils/shadcn';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useQuery from '@/hooks/useQuery';
import { ParticipantsQuery } from '@/gql/graphql';
import { notNull } from '@/utils/notNull';
import {
  OptionalStringSchema,
  RadioItem,
  Required,
  RequiredEmailSchema,
  RequiredStringSchema,
  createTypedCheckboxField,
  createTypedTextField,
} from './_shared';

const TextField = createTypedTextField<Inputs>();
const CheckboxField = createTypedCheckboxField<Inputs>();

// Validation translations
// validation.required
// validation.invalidEmail
// validation.mustSelectOneOption
// validation.mustAcceptTerms

const Schema = z.object({
  primaryContact: z.object({
    name: RequiredStringSchema,
    email: RequiredEmailSchema,
  }),
  hostedPortalName: RequiredStringSchema,
  applicationType: z.discriminatedUnion(
    'type',
    [
      z.object({
        type: z.literal('National_portal'),
        participantNode: z.object({
          name: RequiredStringSchema,
          countryCode: RequiredStringSchema,
        }),
      }),
      z.object({
        type: z.literal('Other_type_of_portal'),
        publisherDescription: RequiredStringSchema,
      }),
    ],
    {
      required_error: 'validation.mustSelectOneOption',
      invalid_type_error: 'validation.mustSelectOneOption',
    }
  ),
  nodeContact: z.discriminatedUnion(
    'type',
    [
      z.object({ type: z.literal('I_am_the_node_manager') }),
      z.object({ type: z.literal('Node_manager_contacted'), nodeManager: RequiredStringSchema }),
      z.object({ type: z.literal('No_contact_to_node_manager') }),
    ],
    {
      required_error: 'validation.mustSelectOneOption',
      invalid_type_error: 'validation.mustSelectOneOption',
    }
  ),
  nodeManager: OptionalStringSchema,
  dataScope: RequiredStringSchema,
  userGroup: RequiredStringSchema,
  timelines: OptionalStringSchema,
  languages: RequiredStringSchema,
  experience: z.enum(['has_plenty_experience', 'has_limited_experience', 'has_no_experience'], {
    required_error: 'validation.mustSelectOneOption',
    invalid_type_error: 'validation.mustSelectOneOption',
  }),
  termsAccepted: z.literal(true, {
    invalid_type_error: 'validation.mustAcceptTerms',
    required_error: 'validation.mustAcceptTerms',
  }),
});

type Inputs = z.infer<typeof Schema>;

export function HostedPortalForm() {
  const form = useForm<Inputs>({
    resolver: zodResolver(Schema),
    mode: 'onTouched',
  });

  const onSubmit = (data: Inputs) => {
    fetch('http://localhost:4001/forms/hosted-portal-application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          alert('Form submitted');
          form.reset();
        } else {
          alert('Form submission failed');
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Form submission failed');
      });
  };

  return (
    <BlockContainer>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-3xl m-auto flex flex-col gap-10"
        >
          <PrimaryContact />
          <HostedPortalName />
          <ApplicationType />
          <NodeContact />
          <DescriptionOfDataScope />
          <UserGroupAndNeeds />
          <Timelines />
          <Languages />
          <ExperienceLevel />
          <Terms />
          <SubmitButton />
        </form>
      </Form>
    </BlockContainer>
  );
}

function PrimaryContact() {
  return (
    <fieldset>
      <legend className="text-md font-semibold">
        1. Primary contact for this application
        <Required />
      </legend>

      <div className="flex gap-4">
        <TextField name="primaryContact.name" label="Name" required />

        <TextField name="primaryContact.email" label="Email" required />
      </div>
    </fieldset>
  );
}

function HostedPortalName() {
  return (
    <TextField
      name="hostedPortalName"
      label={
        <span className="text-md font-semibold">
          2. Hosted portal name
          <Required />
        </span>
      }
    />
  );
}

function ApplicationType() {
  const form = useFormContext<Partial<Inputs>>();

  return (
    <FormField
      control={form.control}
      name="applicationType.type"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-md font-semibold">
            3. Type of application
            <Required />
          </FormLabel>
          <FormDescription>What best describes your proposed portal?</FormDescription>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} className="flex flex-col space-y-1">
              <RadioItem value="National_portal" label="A national biodiversity portal." />

              <ParticipantNode />

              <RadioItem
                value="Other_type_of_portal"
                label="Another type of portal to showcase data available in GBIF"
              />

              <PublisherDescription />
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function PublisherDescription() {
  const form = useFormContext<Partial<Inputs>>();
  const applicationType = form.watch('applicationType.type');

  return (
    <TextField
      name="applicationType.publisherDescription"
      label="Publisher description"
      required
      descriptionPosition="above"
      description="Please describe which data publisher(s) and/or GBIF participants will be involved"
      textarea
      className={cn('pl-6', { hidden: applicationType !== 'Other_type_of_portal' })}
    />
  );
}

const PARTICIPANTS_QUERY = /* GraphQL */ `
  query Participants {
    participantSearch(limit: 1000) {
      endOfRecords
      results {
        id
        name
        countryCode
      }
    }
  }
`;

function ParticipantNode() {
  const form = useFormContext<Partial<Inputs>>();
  const applicationType = form.watch('applicationType');

  const { load, data, loading, error } = useQuery<ParticipantsQuery, null>(PARTICIPANTS_QUERY, {
    lazyLoad: true,
  });

  useEffect(() => {
    if (applicationType?.type === 'National_portal' && data == null) {
      load();
    }
  }, [applicationType?.type, data, load]);

  return (
    <FormField
      control={form.control}
      name="applicationType.participantNode"
      render={({ field }) => (
        <FormItem className={cn('pl-6', applicationType?.type === 'National_portal' || 'hidden')}>
          <FormLabel className="font-normal">
            Participant country
            <Required />
          </FormLabel>
          <FormDescription>
            Note that national portals will exclusively be offered to countries participating in
            GBIF. <br />
            Please select which participant country this application relates to. Please see the{' '}
            <DynamicLink to="/the-gbif-network" className="underline">
              list of participants
            </DynamicLink>{' '}
            for contact information
          </FormDescription>
          <Select
            onValueChange={(value) =>
              field.onChange({
                name: value,
                countryCode: data?.participantSearch?.results?.find(
                  (p) => p != null && p.name === value
                )?.countryCode,
              })
            }
            value={field.value?.name}
            defaultValue={field.value?.name}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Click to select" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {error && <span>Error</span>}
              {loading && <span>Loading</span>}
              {data?.participantSearch?.results
                .map((participant) => participant?.name)
                .filter(notNull)
                .map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function NodeContact() {
  const form = useFormContext<Partial<Inputs>>();

  return (
    <FormField
      control={form.control}
      name="nodeContact.type"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-md font-semibold">
            4. Are you in contact with a GBIF Participant Node Manager about this application?
            <Required />
          </FormLabel>
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

function DescriptionOfDataScope() {
  return (
    <TextField
      name="dataScope"
      label={
        <span className="text-md font-semibold">
          5. Description of the data scope for the proposed portal
          <Required />
        </span>
      }
      textarea
      descriptionPosition="above"
      description="Note that hosted portals can only display occurrence records that are already shared on GBIF.org and organized to the GBIF backbone taxonomy. Briefly describe the scope of the occurrence data that you would like to display on a GBIF hosted portal, including, for example, the geographic, taxonomic and temporal scope or other parameters. Approximately how many datasets and records currently available from GBIF.org meet this scope? Please include links to GBIF.org searches as appropriate."
    />
  );
}

function UserGroupAndNeeds() {
  return (
    <TextField
      name="userGroup"
      label={
        <span className="text-md font-semibold">
          6. User group and needs
          <Required />
        </span>
      }
      textarea
      descriptionPosition="above"
      description="Have you identified a group of users for the portal? How would you describe their needs? Please also explain how you have identified the user group and their needs. If the portal is replacing an existing website, please provide a link if available and explain why you think a hosted portal would be a better solution."
    />
  );
}

function Timelines() {
  return (
    <TextField
      name="timelines"
      label={<span className="text-md font-semibold">7. Timelines</span>}
      textarea
      descriptionPosition="above"
      description="Are there any timelines you need to keep with regards to the deployment, promotion and ongoing use of the portal?"
    />
  );
}

function Languages() {
  return (
    <TextField
      name="languages"
      label={
        <span className="text-md font-semibold">
          7. Languages
          <Required />
        </span>
      }
      textarea
      descriptionPosition="above"
      description="What languages would you like your hosted portal to be available in? Please note that you will need to translate your own content and menu, and may need to contribute translations for common elements such as data search components for languages other than English if they are not already available."
    />
  );
}

function ExperienceLevel() {
  const form = useFormContext<Partial<Inputs>>();

  return (
    <FormField
      control={form.control}
      name="experience"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-md font-semibold">
            9. Level of experience with related tools and languages
            <Required />
          </FormLabel>
          <FormDescription>
            We will be managing the hosted portals in GitHub. You will need to author content using
            Markdown and YAML. This is not difficult and we can direct you to documentation and
            provide support in getting started if needed. Please state your level of experience with
            these:
          </FormDescription>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} className="flex flex-col space-y-1">
              <RadioItem
                value="has_plenty_experience"
                label="I am comfortable with using GitHub, Markdown and YAML to author web content"
              />
              <RadioItem
                value="has_limited_experience"
                label="I have some experience but would like some help to get started"
              />
              <RadioItem
                value="has_no_experience"
                label="I have never used GitHub, Markdown or YAML to author web content"
              />
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function Terms() {
  return (
    <div className="space-y-3">
      <span className="text-md font-semibold">
        Terms
        <Required />
      </span>
      <CheckboxField
        name="termsAccepted"
        label="I have read the service agreement and data processor agreement and I accept these terms and conditions for the hosted portal I plan to launch."
      />
    </div>
  );
}

function SubmitButton() {
  const form = useFormContext<Partial<Inputs>>();

  const { isLoading, isSubmitting } = form.formState;
  const buttonDisabled = isLoading || isSubmitting;

  return (
    <Button className="w-min" type="submit" disabled={buttonDisabled}>
      Submit
    </Button>
  );
}

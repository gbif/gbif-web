import { z } from 'zod';
import {
  OptionalStringSchema,
  RadioItem,
  RequiredEmailSchema,
  RequiredStringSchema,
  Required,
  createTypedCheckboxField,
  createTypedTextField,
} from './_shared';
import { useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { DynamicLink } from '@/components/DynamicLink';
import { cn } from '@/utils/shadcn';
import { RadioGroup } from '@/components/ui/radio-group';
import {
  OrganizationOption,
  OrganizationSearchSugget,
} from '@/components/SearchSelect/OrganizationSearchSuggest';
import React, { useEffect } from 'react';
import { ClientSideOnly } from '@/components/ClientSideOnly';
import useQuery from '@/hooks/useQuery';
import {
  NodeType,
  OrganizationPreviewQuery,
  OrganizationPreviewQueryVariables,
  ParticipationStatus,
} from '@/gql/graphql';
import { TimeAgo } from '@/components/TimeAgo';
import { ConditionalWrapper } from '@/components/ConditionalWrapper';
import { CoordinatesPicker } from '@/components/CoordinatesPicker';
import { ParticipantSelect } from '@/components/Select/ParticipantSelect';
import { Button } from '@/components/ui/button';

const CheckboxField = createTypedCheckboxField<Inputs>();
const TextField = createTypedTextField<Inputs>();

const ContactSchema = z.object({
  firstName: RequiredStringSchema,
  lastName: RequiredStringSchema,
  email: RequiredEmailSchema,
  phone: OptionalStringSchema,
});

const Schema = z.object({
  myOrganizationInNotAPublisher: z.boolean(),
  termsAndConditions: z.object({
    dataPublishederAgreement: z.boolean(),
    confirmRegistration: z.boolean(),
    dataWillBePublic: z.boolean(),
  }),
  organizationDetails: z.object({
    name: RequiredStringSchema,
    homePage: z.string().url().optional(),
    email: z.string().email().optional(),
    phone: OptionalStringSchema,
    address: RequiredStringSchema,
    city: RequiredStringSchema,
    province: OptionalStringSchema,
    postalCode: OptionalStringSchema,
    country: RequiredStringSchema,
    logo: z.string().url().optional(),
    description: RequiredStringSchema,
    coordinates: z.object({
      lat: z.number(),
      lon: z.number(),
    }),
  }),
  endorsingNode: z.object({
    type: z.enum(['help_me_with_endorsement', 'marine_data_publishers']),
    organization: z.object({ id: z.string(), name: z.string() }),
  }),
  gbifProjects: z.discriminatedUnion('type', [
    z.object({ type: z.literal('yes'), projectIdentifier: OptionalStringSchema }),
    z.object({ type: z.literal('no') }),
  ]),
  mainContact: ContactSchema,
  extraContacts: z.object({
    administrative: z.boolean().optional(),
    technical: z.boolean().optional(),
  }),
  administrativeContact: ContactSchema.optional(),
  technicalContact: ContactSchema.optional(),
  whatAndHow: z.object({
    resourceMetadata: z.boolean().optional(),
    checklistData: z.boolean().optional(),
    occurrenceOnlyData: z.boolean().optional(),
    samplingEventData: z.boolean().optional(),
    description: RequiredStringSchema,
    externalServer: z.enum(['yes', 'no']),
    planningToUsePublishingSoftware: z.enum(['yes', 'no']),
    needHelp: z.enum(['yes', 'no']),
  }),
});

type Inputs = z.infer<typeof Schema>;

export function BecomeAPublisherForm() {
  const form = useForm<Inputs>({
    resolver: zodResolver(Schema),
    mode: 'onTouched',
  });

  const onSubmit = (data: Inputs) => {
    fetch('http://localhost:4001/forms/become-a-publisher', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          alert('Organization registered');
          form.reset();
        } else {
          alert('Failed to register organization');
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Failed to register organization');
      });
  };

  return (
    <ClientSideOnly>
      <BlockContainer>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, console.error)}
            className="max-w-3xl m-auto flex flex-col gap-4"
          >
            <MyOrganizationInNotAPublisher />
            <TermsAndConditions />
            <OrganizationDetails />
            <EndorsingNode />
            <GbifProjects />
            <MainContact />
            <AdministrativeContact />
            <TechnicalContact />
            <WhatAndHow />
            <SubmitButton />
          </form>
        </Form>
      </BlockContainer>
    </ClientSideOnly>
  );
}

function MyOrganizationInNotAPublisher() {
  const [organization, setOrganization] = React.useState<OrganizationOption | null | undefined>();
  const form = useFormContext<Partial<Inputs>>();
  const searchSuggestHidden = form.watch('myOrganizationInNotAPublisher');

  return (
    <div className="border shadow-sm">
      <div className={cn({ hidden: searchSuggestHidden })}>
        <div className="p-4">
          <p className="pb-2">
            First, please see if your organization is already registered as a GBIF publisher.
          </p>

          <OrganizationSearchSugget
            setSelected={setOrganization}
            selected={organization}
            noSelectionPlaceholder="Search for your organization"
          />
        </div>

        {organization && <OrganizationPreview id={organization.key} />}

        <hr />
      </div>

      <div className="p-4">
        <CheckboxField
          name="myOrganizationInNotAPublisher"
          label="My organization is not already registered."
        />
      </div>
    </div>
  );
}

const ORGANIZATION_PREVIEW_QUERY = /* GraphQL */ `
  query OrganizationPreview($key: ID!) {
    organization(key: $key) {
      title
      created
      contacts {
        email
        firstName
        lastName
      }
      description
    }
  }
`;

function OrganizationPreview({ id, className }: { id: string; className?: string }) {
  const { data } = useQuery<OrganizationPreviewQuery, OrganizationPreviewQueryVariables>(
    ORGANIZATION_PREVIEW_QUERY,
    { variables: { key: id } }
  );

  const organization = data?.organization;
  const contact = organization?.contacts?.[0];

  return (
    <div className={cn('bg-gray-100 p-4', className)}>
      <p className="text-sm text-gray-800">
        If you are affiliated with the selected organization, you should approach the contact for
        practical knowledge of data publishing.
      </p>
      {organization && (
        <div className="bg-white mt-2 border">
          <DynamicLink to={`/publisher/${id}`}>
            <h3 className="p-2 text-base font-semibold text-blue-500 hover:underline">
              {organization.title}
            </h3>
          </DynamicLink>

          <hr />

          <div className="p-2">
            {organization.created && (
              <span className="text-xs block text-primary-600">
                Joined <TimeAgo date={new Date(organization.created)} />
              </span>
            )}

            {contact && (
              <span className="block text-xs">
                Contact:{' '}
                <ConditionalWrapper
                  condition={typeof contact.email?.[0] === 'string'}
                  wrapper={(children) => (
                    <a
                      className="text-blue-500 hover:underline"
                      href={`mailto:${contact.email?.[0]}`}
                    >
                      {children}
                    </a>
                  )}
                >
                  {contact.firstName} {contact.lastName}
                </ConditionalWrapper>
              </span>
            )}

            {organization.description && <p className="text-xs mt-1">{organization.description}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function TermsAndConditions() {
  const form = useFormContext<Partial<Inputs>>();
  const hidden = !form.watch('myOrganizationInNotAPublisher');

  return (
    <div className={cn('border shadow-sm p-4', { hidden })}>
      <fieldset>
        <legend className="text-md font-semibold pb-2">
          Terms and conditions
          <Required />
        </legend>

        <div className="space-y-4">
          <CheckboxField
            name="termsAndConditions.dataPublishederAgreement"
            label={
              <>
                I have read and understood{' '}
                <DynamicLink to="/terms/data-publisher">
                  GBIF's Data Publisher Agreement
                </DynamicLink>{' '}
                and agree to its terms.
              </>
            }
          />

          <CheckboxField
            name="termsAndConditions.confirmRegistration"
            label="I understand that I am seeking registration on behalf of my organization, and confirm that the responsible authorities of my organization are aware of this registration."
          />

          <CheckboxField
            name="termsAndConditions.dataWillBePublic"
            label="I understand that my organizational information, including the contact details provided, will be made publicly available through GBIF.org."
          />
        </div>
      </fieldset>
    </div>
  );
}

function OrganizationDetails() {
  const hidden = !useTermsAccepted();

  return (
    <div className={cn('border shadow-sm p-4', { hidden })}>
      <fieldset>
        <legend className="text-md font-semibold pb-2">Organization details</legend>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <TextField name="organizationDetails.name" label="Organization name" required />

            <TextField name="organizationDetails.homePage" label="Home page" />
          </div>

          <div className="flex gap-4">
            <TextField name="organizationDetails.email" label="Email" />

            <TextField
              name="organizationDetails.phone"
              label="Phone"
              description="Organization email e.g. secretariat@fibg-museum.org"
              descriptionPosition="below"
            />
          </div>

          <TextField name="organizationDetails.address" label="Address" required />

          <div className="flex gap-4">
            <TextField name="organizationDetails.city" label="City" required />

            <TextField name="organizationDetails.province" label="Province" />

            <TextField name="organizationDetails.postalCode" label="Postal code" />
          </div>

          <div className="flex gap-4">
            {/* TODO: should be dropdown */}
            <TextField name="organizationDetails.country" label="Country" required />

            <TextField
              name="organizationDetails.logo"
              label="Logo"
              descriptionPosition="below"
              description="E.g. http://my.organization.org/images/logo.png"
            />
          </div>

          <TextField
            name="organizationDetails.description"
            label="Description"
            required
            textarea
            descriptionPosition="above"
            description={
              <>
                In <strong>English</strong>, please briefly describe the scope of your
                institution/organization in relation to GBIF's mission (e.g. collection holdings,
                research focus, biodiversity information management, etc.). This description will
                appear on your publisher page. You may also wish to include a version in another
                language, but English is required.
              </>
            }
          />

          <FormField
            name="organizationDetails.coordinates"
            render={({ field }) => (
              <CoordinatesPicker
                coordinates={field.value}
                setCoordinates={field.onChange}
                instructions="Click on the map to add your organization"
              />
            )}
          />
        </div>
      </fieldset>
    </div>
  );
}

function EndorsingNode() {
  const form = useFormContext<Partial<Inputs>>();
  const hidden = !useTermsAccepted();

  return (
    <div className={cn('border shadow-sm p-4', { hidden })}>
      <fieldset>
        <legend className="text-md font-semibold">Endorsing node</legend>
        <FormField
          control={form.control}
          name="endorsingNode.type"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                To support publishers and review data quality all publishers are associated with a
                GBIF node. Please check the suggestion below, and correct it if needed:
              </FormDescription>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} className="flex flex-col space-y-1">
                  <RadioItem value="help_me_with_endorsement" label="Help me with endorsement" />

                  <RadioItem
                    value="marine_data_publishers"
                    label="Marine data publishers: request endorsement for OBIS (Ocean Biogeographic Information System) related data"
                  />
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endorsingNode.organization"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                If endorsement through the country node suggested above is not the right option,
                please check this list of associated participants for multinational or thematic
                networks:
              </FormDescription>
              <ParticipantSelect
                selected={field.value}
                onChange={field.onChange}
                filters={{
                  type: NodeType.Other,
                  participationStatus: ParticipationStatus.Associate,
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </fieldset>
    </div>
  );
}

function GbifProjects() {
  const form = useFormContext<Partial<Inputs>>();
  const hidden = !useTermsAccepted();

  return (
    <FormField
      control={form.control}
      name="gbifProjects.type"
      render={({ field }) => (
        <FormItem className={cn('border shadow-sm p-4', { hidden })}>
          <FormLabel className="text-md font-semibold">
            Are you associated with a project funded by a GBIF programme ?
          </FormLabel>
          <FormDescription>
            To support publishers and review data quality all publishers are associated with a GBIF
            node. Please check the suggestion below, and correct it if needed:
          </FormDescription>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} className="flex flex-col space-y-1">
              <RadioItem value="yes" label="Yes" />

              <ProjectIdentifier />

              <RadioItem value="no" label="No" />
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function ProjectIdentifier() {
  const form = useFormContext<Partial<Inputs>>();
  const hidden = form.watch('gbifProjects.type') !== 'yes';

  return (
    <TextField
      name="gbifProjects.projectIdentifier"
      label="Project identifier"
      className={cn('pl-6', { hidden })}
      description="Please enter the project identifier - e.g. BID-CA2016-0000-NAC"
      descriptionPosition="above"
    />
  );
}

function ContactForm({
  contact,
}: {
  contact: 'mainContact' | 'administrativeContact' | 'technicalContact';
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <TextField name={`${contact}.firstName`} label="First name" required />

        <TextField name={`${contact}.lastName`} label="Last name" required />
      </div>

      <div className="flex gap-4">
        <TextField required name={`${contact}.email`} label="Email" />

        <TextField
          name={`${contact}.phone`}
          label="Phone"
          description="Remember to prefix with country code"
          descriptionPosition="below"
        />
      </div>
    </div>
  );
}

function MainContact() {
  const hidden = !useTermsAccepted();

  return (
    <div className={cn('border shadow-sm p-4', { hidden })}>
      <fieldset>
        <legend className="text-md font-semibold">Contacts</legend>

        <span>We need to know how to keep in touch with you.</span>

        <ContactForm contact="mainContact" />

        <p className="pt-4 text-sm">
          People move on! Please add at least one alternate contact, and consider using a generic
          email e.g. helpdesk@a.com that will always reach an appropriate person.
        </p>

        <div className="flex gap-4 pt-4">
          <CheckboxField name="extraContacts.administrative" label="Add administrative contact" />
          <CheckboxField name="extraContacts.technical" label="Add technical contact" />
        </div>
      </fieldset>
    </div>
  );
}

function AdministrativeContact() {
  const form = useFormContext<Partial<Inputs>>();
  const hidden = !useTermsAccepted() || !form.watch('extraContacts.administrative');

  // Unregister the field if hidden. If not the validation will fail as the otherwise optional object is filled with invalid values
  useEffect(() => {
    if (hidden) form.unregister('administrativeContact');
  }, [hidden, form]);

  if (hidden) return null;

  return (
    <div className={cn('border shadow-sm p-4', { hidden })}>
      <fieldset>
        <legend className="text-md font-semibold">Administrative contact</legend>

        <span>
          Who can we approach for questions about your organization, for example how you appear on
          our web pages, data licensing issues etc.
        </span>

        <ContactForm contact="administrativeContact" />
      </fieldset>
    </div>
  );
}

function TechnicalContact() {
  const form = useFormContext<Partial<Inputs>>();
  const hidden = !useTermsAccepted() || !form.watch('extraContacts.technical');

  // Unregister the field if hidden. If not the validation will fail as the otherwise optional object is filled with invalid values
  useEffect(() => {
    if (hidden) form.unregister('technicalContact');
  }, [hidden, form]);

  if (hidden) return null;

  return (
    <div className={cn('border shadow-sm p-4', { hidden })}>
      <fieldset>
        <legend className="text-md font-semibold">Technical contact</legend>

        <span>
          Who can we approach for technical information such as sending passwords to register data
          publishing tools?
        </span>

        <ContactForm contact="technicalContact" />
      </fieldset>
    </div>
  );
}

function WhatAndHow() {
  const form = useFormContext<Partial<Inputs>>();
  const hidden = !useTermsAccepted();
  const planningToUsePublishingSoftware = form.watch('whatAndHow.planningToUsePublishingSoftware');

  return (
    <div className={cn('border shadow-sm p-4', { hidden })}>
      <fieldset>
        <legend className="text-md font-semibold">What and how</legend>

        <p>
          Help us understand what kind of data you plan to publish, and what support you may need.
        </p>
        <br />
        <p>
          GBIF.org supports publication of four types of data, explained{' '}
          <DynamicLink to="/dataset-classes">here.</DynamicLink> Responsibility for formatting the
          data and hosting the original datasets remains with the data publisher, but we can help
          you find appropriate technical solutions.
        </p>
        <br />
        <p>Which types of data do you expect to publish?</p>

        <div className="flex pt-4">
          <CheckboxField name="whatAndHow.resourceMetadata" label="Resource metadata" />
          <CheckboxField name="whatAndHow.checklistData" label="Checklist data" />
          <CheckboxField name="whatAndHow.occurrenceOnlyData" label="Occurrence-only data" />
          <CheckboxField name="whatAndHow.samplingEventData" label="Sampling-event data" />
        </div>

        <TextField
          className="pt-8"
          name="whatAndHow.description"
          label="Data description"
          description="What kinds of relevant data do you have that you intend to publish through GBIF? Please give a brief description."
          required
          textarea
        />

        <FormField
          control={form.control}
          name="whatAndHow.externalServer"
          render={({ field }) => (
            <FormItem className="space-y-3 pt-2">
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
          name="whatAndHow.planningToUsePublishingSoftware"
          render={({ field }) => (
            <FormItem className="space-y-3 pt-2">
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

        {planningToUsePublishingSoftware === 'yes' && (
          <p className="text-orange-400">
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
          name="whatAndHow.needHelp"
          render={({ field }) => (
            <FormItem className="space-y-3 pt-2">
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
      </fieldset>
    </div>
  );
}

function useTermsAccepted() {
  const form = useFormContext<Partial<Inputs>>();
  const myOrganizationInNotAPublisher = form.watch('myOrganizationInNotAPublisher');
  const termsAndConditions = form.watch('termsAndConditions');

  return (
    myOrganizationInNotAPublisher &&
    termsAndConditions?.dataPublishederAgreement &&
    termsAndConditions?.confirmRegistration &&
    termsAndConditions?.dataWillBePublic
  );
}

function SubmitButton() {
  const form = useFormContext<Partial<Inputs>>();
  const hidden = !useTermsAccepted();
  const { isLoading, isSubmitting } = form.formState;
  const buttonDisabled = isLoading || isSubmitting;

  if (hidden) return null;

  return (
    <Button className="w-min" type="submit" disabled={buttonDisabled}>
      <span className="whitespace-nowrap">Register organization</span>
    </Button>
  );
}

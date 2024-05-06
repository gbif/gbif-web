import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  RequiredStringSchema,
  RequiredEmailSchema,
  OptionalStringSchema,
  createTypedCheckboxField,
  createTypedTextField,
} from '../_shared';
import { useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { Step, StepperForm } from '@/components/StepperForm';
import { withIndex } from '@/utils/withIndex';
import { BlockContainer } from '../../_shared';
import { ClientSideOnly } from '@/components/ClientSideOnly';
import { PrimaryContact } from './steps/PrimaryContact';
import { HostedPortalName } from './steps/HostedPortalName';
import { ApplicationType } from './steps/ApplicationType';

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

export type Inputs = z.infer<typeof Schema>;

export const CheckboxField = createTypedCheckboxField<Inputs>();
export const TextField = createTypedTextField<Inputs>();

export function HostedPortalForm() {
  const form = useForm<Inputs>({
    resolver: zodResolver(Schema),
    mode: 'onBlur',
  });

  const onSubmit = useMemo(
    () =>
      form.handleSubmit((data: Inputs) => {
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
      }),
    [form]
  );

  const STEPS: Step[] = useMemo(
    () =>
      withIndex([
        {
          title: 'Primary contact',
          heading: 'Primary contact for this application',
          component: PrimaryContact,
          fieldset: true,
          validationPath: 'primaryContact',
        },
        {
          title: 'Portal name',
          heading: 'Hosted portal name',
          component: HostedPortalName,
          validationPath: 'hostedPortalName',
        },
        {
          title: 'Application type',
          heading: 'Type of application',
          component: ApplicationType,
          fieldset: true,
          validationPath: 'applicationType',
        },
        {
          title: 'Node contact',
          heading: 'Contact with node manager',
          component: Dummy,
          fieldset: true,
          validationPath: 'nodeContact',
        },
        {
          title: 'Data scope',
          heading: 'Description of the data scope for the proposed portal',
          component: Dummy,
          validationPath: 'dataScope',
        },
        {
          title: 'User group',
          heading: 'User group and needs',
          component: Dummy,
          validationPath: 'userGroup',
        },
        {
          title: 'Timelines',
          heading: 'Timelines',
          component: Dummy,
          validationPath: 'timelines',
        },
        {
          title: 'Languages',
          heading: 'Languages',
          component: Dummy,
          validationPath: 'languages',
        },
        {
          title: 'Experience',
          heading: 'Level of experience with related tools and languages',
          component: Dummy,
          validationPath: 'experience',
        },
        {
          title: 'Terms',
          heading: 'Terms and conditions',
          component: Dummy,
          validationPath: 'termsAccepted',
        },
      ]),
    []
  );

  return (
    <BlockContainer>
      <ClientSideOnly>
        <StepperForm form={form} onSubmit={onSubmit} steps={STEPS} />
      </ClientSideOnly>
    </BlockContainer>
  );
}

function Dummy() {
  return <span>Dummy</span>;
}

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
import { ClientSideOnly } from '@/components/clientSideOnly';
import { PrimaryContact } from './steps/PrimaryContact';
import { HostedPortalName } from './steps/HostedPortalName';
import { ApplicationType } from './steps/ApplicationType';
import { DataScope } from './steps/DataScope';
import { UserGroup } from './steps/UserGroup';
import { Timelines } from './steps/Timelines';
import { Languages } from './steps/Languages';
import { Experience } from './steps/Experience';
import { NodeContact } from './steps/NodeContact';
import { Terms } from './steps/Terms';
import { useToast } from '@/components/ui/use-toast';
import { useConfig } from '@/contexts/config/config';

const Schema = z.object({
  primaryContact: z.object({
    name: RequiredStringSchema,
    email: RequiredEmailSchema,
    github: OptionalStringSchema,
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

type Props = {
  className?: string;
}

export function HostedPortalForm({ className }: Props) {
  const { toast } = useToast();
  const config = useConfig();

  const form = useForm<Inputs>({
    resolver: zodResolver(Schema),
    mode: 'onBlur',
  });

  const onSubmit = useMemo(
    () =>
      form.handleSubmit((data: Inputs) => {
        fetch(`${config.formsEndpoint}/hosted-portal-application`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (!response.ok) throw response;

            toast({
              title: 'Thank you for submitting your application',
              description: 'We will be in touch soon',
            });
          })
          .catch((error) => {
            console.error(error);
            toast({
              title: 'Failed to submit application',
              description: 'Please try again later',
              variant: 'destructive',
            });
          });
      }),
    [form, toast, config.formsEndpoint]
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
          heading:
            'Are you in contact with a GBIF Participant Node Manager about this application?',
          component: NodeContact,
          fieldset: true,
          validationPath: 'nodeContact',
        },
        {
          title: 'Data scope',
          heading: 'Description of the data scope for the proposed portal',
          component: DataScope,
          validationPath: 'dataScope',
        },
        {
          title: 'User group',
          heading: 'User group and needs',
          component: UserGroup,
          validationPath: 'userGroup',
        },
        {
          title: 'Timelines',
          heading: 'Timelines',
          component: Timelines,
          validationPath: 'timelines',
        },
        {
          title: 'Languages',
          heading: 'Languages',
          component: Languages,
          validationPath: 'languages',
        },
        {
          title: 'Experience',
          heading: 'Level of experience with related tools and languages',
          component: Experience,
          validationPath: 'experience',
        },
        {
          title: 'Terms',
          heading: 'Terms and conditions',
          component: Terms,
          validationPath: 'termsAccepted',
        },
      ]),
    []
  );

  return (
    <BlockContainer className={className}>
      <ClientSideOnly>
        <StepperForm form={form} onSubmit={onSubmit} steps={STEPS} />
      </ClientSideOnly>
    </BlockContainer>
  );
}

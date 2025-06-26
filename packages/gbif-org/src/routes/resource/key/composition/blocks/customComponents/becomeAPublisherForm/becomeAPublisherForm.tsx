import { ClientSideOnly } from '@/components/clientSideOnly';
import { Step, StepperForm } from '@/components/stepperForm';
import { useToast } from '@/components/ui/use-toast';
import { useConfig } from '@/config/config';
import { cn } from '@/utils/shadcn';
import { withIndex } from '@/utils/withIndex';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { z } from 'zod';
import { BlockContainer } from '../../_shared';
import {
  createTypedCheckboxField,
  createTypedTextField,
  OptionalStringSchema,
  RequiredEmailSchema,
  RequiredStringSchema,
} from '../_shared';
import { CheckRegistration } from './steps/checkRegistration';
import { Contacts } from './steps/contacts';
import { Endorsment } from './steps/endorsement';
import { GbifProjects } from './steps/gbifProjects';
import { OrganizationAddress } from './steps/organizationAddress';
import { OrganizationDetails } from './steps/organizationDetails';
import { TermsAndConditions } from './steps/termsAndConditions';
import { WhatAndHow } from './steps/whatAndHow';
import { useSuggestedNodeCountry } from './useSuggestedNodeCountry';
const ContactSchema = z.object({
  firstName: RequiredStringSchema,
  lastName: RequiredStringSchema,
  email: RequiredEmailSchema,
  phone: OptionalStringSchema,
});

const Schema = z.object({
  checkRegistration: z.boolean(),
  termsAndConditions: z.object({
    dataPublishederAgreement: z.boolean(),
    confirmRegistration: z.boolean(),
    dataWillBePublic: z.boolean(),
  }),
  organizationDetails: z.object({
    name: RequiredStringSchema,
    homePage: z.string().url().optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
    phone: OptionalStringSchema,
    logo: z.string().url().optional().or(z.literal('')),
    description: RequiredStringSchema,
  }),
  organizationAddress: z.object({
    address: RequiredStringSchema,
    city: RequiredStringSchema,
    province: OptionalStringSchema,
    postalCode: OptionalStringSchema,
    country: RequiredStringSchema,
    coordinates: z.object({
      lat: z.number(),
      lon: z.number(),
    }),
  }),
  endorsingNode: z.string(),
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
    serverCapable: z.enum(['yes', 'no']),
    toolPlanned: z.enum(['yes', 'no']),
    doYouNeedHelpPublishing: z.enum(['yes', 'no']),
  }),
});

export type Inputs = z.infer<typeof Schema>;

export const CheckboxField = createTypedCheckboxField<Inputs>();
export const TextField = createTypedTextField<Inputs>();

type Props = {
  className?: string;
};

export function BecomeAPublisherForm({ className }: Props) {
  const { toast } = useToast();
  const config = useConfig();
  const intl = useIntl();
  const form = useForm<Inputs>({
    resolver: zodResolver(Schema),
    mode: 'onBlur',
  });

  const onSubmit = useMemo(
    () =>
      form.handleSubmit((data: Inputs) => {
        fetch(`${config.formsEndpoint}/become-a-publisher`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (!response.ok) throw response;

            toast({
              title: 'Thank you for registering your organization',
              description: 'We will be in touch soon',
            });
          })
          .catch((error) => {
            toast({
              title: 'Failed to register organization',
              description: 'Please try again later',
              variant: 'destructive',
            });
            console.error(error);
          });
      }),
    [form, toast, config.formsEndpoint]
  );

  const { suggestedNodeCountry, updateSuggestedNodeCountry } = useSuggestedNodeCountry();

  const STEPS: Step[] = useMemo(
    () =>
      withIndex([
        {
          title: intl.formatMessage({
            id: 'eoi.checkRegistration',
            defaultMessage: 'Check registration',
          }),
          component: CheckRegistration,
          validationPath: 'checkRegistration',
        },
        {
          title: intl.formatMessage({
            id: 'eoi.termsAndConditions',
            defaultMessage: 'Terms & Conditions',
          }), //'Terms & Conditions',
          component: TermsAndConditions,
          fieldset: true,
          validationPath: 'termsAndConditions',
        },
        {
          title: intl.formatMessage({
            id: 'eoi.organisationDetails',
            defaultMessage: 'Organization Details',
          }), //'Organization Details',
          component: OrganizationDetails,
          fieldset: true,
          validationPath: 'organizationDetails',
        },
        {
          title: intl.formatMessage({
            id: 'eoi.organisationAddress',
            defaultMessage: 'Organization Address',
          }), //'Organization Address',
          component: () => (
            <OrganizationAddress updateSuggestedNodeCountry={updateSuggestedNodeCountry} />
          ),
          fieldset: true,
          validationPath: 'organizationAddress',
        },
        {
          title: intl.formatMessage({
            id: 'eoi.endorsement',
            defaultMessage: 'Endorsement',
          }), //'Endorsement',
          component: () => <Endorsment suggestedNodeCountry={suggestedNodeCountry} />,
          fieldset: true,
          validationPath: 'endorsingNode',
        },
        {
          title: intl.formatMessage({
            id: 'eoi.gbifProjects',
            defaultMessage: 'GBIF projects',
          }), //'GBIF projects',
          component: GbifProjects,
          heading: 'Are you associated with a project funded by a GBIF programme?',
          validationPath: 'gbifProjects',
        },
        {
          title: intl.formatMessage({
            id: 'eoi.contacts',
            defaultMessage: 'Contacts',
          }), //'Contacts',
          component: Contacts,
          fieldset: true,
          validationPath: ['mainContact', 'administrativeContact', 'technicalContact'],
        },
        {
          title: intl.formatMessage({
            id: 'eoi.whatAndHow',
            defaultMessage: 'What and How',
          }), //'What and How',
          component: WhatAndHow,
          fieldset: true,
        },
      ]),
    [updateSuggestedNodeCountry, suggestedNodeCountry]
  );

  return (
    <BlockContainer className={cn('g-bg-white g-overflow-visible', className)}>
      <ClientSideOnly>
        <StepperForm form={form} onSubmit={onSubmit} steps={STEPS} />
      </ClientSideOnly>
    </BlockContainer>
  );
}

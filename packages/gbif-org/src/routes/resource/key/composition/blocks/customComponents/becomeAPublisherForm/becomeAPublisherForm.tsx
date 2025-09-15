import { ValidParticipant } from '@/components/select/participantSelect';
import { Step, StepperForm } from '@/components/stepperForm';
import { useToast } from '@/components/ui/use-toast';
import { useConfig } from '@/config/config';
import { cn } from '@/utils/shadcn';
import { withIndex } from '@/utils/withIndex';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm, UseFormGetValues } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { z } from 'zod';
import { BlockContainer } from '../../_shared';
import {
  createTypedCheckboxField,
  createTypedTextField,
  OptionalStringSchema,
  RequiredCheckboxSchema,
  RequiredEmailSchema,
  RequiredStringSchema,
  RequiredYesOrNoSchema,
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
import { useUser } from '@/contexts/UserContext';

const ContactSchema = z.object({
  firstName: RequiredStringSchema,
  lastName: RequiredStringSchema,
  email: RequiredEmailSchema,
  phone: OptionalStringSchema,
});

// Using # to indicate the error messages should be treated as a translation key
const Schema = z.object({
  checkRegistration: RequiredCheckboxSchema,
  termsAndConditions: z.object({
    dataPublishederAgreement: RequiredCheckboxSchema,
    confirmRegistration: RequiredCheckboxSchema,
    dataWillBePublic: RequiredCheckboxSchema,
  }),
  organizationDetails: z.object({
    name: RequiredStringSchema,
    homePage: z.string().url('#validation.invalidWebsiteAddress').optional().or(z.literal('')),
    email: z.string().email('#validation.invalidEmail').optional().or(z.literal('')),
    phone: OptionalStringSchema,
    logo: z.string().url('#validation.invalidURL').optional().or(z.literal('')),
    description: RequiredStringSchema,
  }),
  organizationAddress: z.object({
    address: RequiredStringSchema,
    city: RequiredStringSchema,
    province: OptionalStringSchema,
    postalCode: OptionalStringSchema,
    country: z.string({
      errorMap: () => ({
        message: '#eoi.validationError.pleaseSelectTheCountryOfYourOrganization',
      }),
    }),
    coordinates: z.object(
      {
        lat: z.number(),
        lon: z.number(),
      },
      { errorMap: () => ({ message: '#eoi.validationError.pleaseSelectYourOrganizationOnTheMap' }) }
    ),
  }),
  endorsingNode: z.string({
    errorMap: () => ({ message: '#validation.pleaseSelectAValue' }),
  }),
  gbifProjects: z.object(
    {
      type: RequiredYesOrNoSchema,
      projectIdentifier: OptionalStringSchema,
    },
    {
      errorMap: () => ({ message: '#validation.pleaseSelectAValue' }),
    }
  ),
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
    serverCapable: RequiredYesOrNoSchema,
    toolPlanned: RequiredYesOrNoSchema,
    doYouNeedHelpPublishing: RequiredYesOrNoSchema,
  }),
});

const defaultValues = {
  checkRegistration: false,
  termsAndConditions: {
    dataPublishederAgreement: false,
    confirmRegistration: false,
    dataWillBePublic: false,
  },
  whatAndHow: {
    resourceMetadata: false,
    checklistData: false,
    occurrenceOnlyData: false,
    samplingEventData: false,
  },
};

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
  const { user } = useUser();
  const restored = useMemo(() => getProgressFromSessionStorage('become-a-publisher-draft'), []);

  const form = useForm<Inputs>({
    resolver: zodResolver(Schema),
    mode: 'onBlur',
    defaultValues: restored?.values || defaultValues,
  });

  // Used by the Endorsement step, but hoisted here to save and restore from session storage
  const [participant, setParticipant] = useState<ValidParticipant | undefined>(
    restored?.participant
  );

  const { getValues } = form;
  useSaveProgressInSessionStorage('become-a-publisher-draft', getValues, participant);

  const onSubmit = useMemo(
    () =>
      form.handleSubmit((data: Inputs) => {
        fetch(`${config.formsEndpoint}/become-a-publisher`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.graphqlToken}`,
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (!response.ok) throw response;

            toast({
              title: intl.formatMessage({
                id: 'eoi.thankYouForYourregistration',
                defaultMessage: 'Thank you for registering your organization',
              }),
              description: intl.formatMessage({
                id: 'eoi.weWillBeInTouchSoon',
                defaultMessage: 'We will be in touch soon',
              }),
            });
          })
          .catch((error) => {
            toast({
              title: intl.formatMessage({
                id: 'eoi.failedToRegisterOrganization',
                defaultMessage: 'Failed to register organization',
              }),
              description: intl.formatMessage({
                id: 'eoi.pleaseTryAgainLater',
                defaultMessage: 'Please try again later',
              }),
              variant: 'destructive',
            });
            console.error(error);
          });
      }),
    [form, toast, config.formsEndpoint, intl]
  );

  const { suggestedNodeCountry, updateSuggestedNodeCountry } = useSuggestedNodeCountry();

  const country = form.watch('organizationAddress.country');
  useEffect(() => {
    if (country) {
      updateSuggestedNodeCountry(country);
    }
  }, [country, updateSuggestedNodeCountry]);

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
          component: OrganizationAddress,
          fieldset: true,
          validationPath: 'organizationAddress',
        },
        {
          title: intl.formatMessage({
            id: 'eoi.endorsement',
            defaultMessage: 'Endorsement',
          }), //'Endorsement',
          component: () => (
            <Endorsment
              suggestedNodeCountry={suggestedNodeCountry}
              participant={participant}
              setParticipant={setParticipant}
            />
          ),
          fieldset: true,
          validationPath: 'endorsingNode',
        },
        {
          title: intl.formatMessage({
            id: 'eoi.gbifProjects',
            defaultMessage: 'GBIF projects',
          }), //'GBIF projects',
          component: GbifProjects,
          heading: intl.formatMessage({
            id: 'eoi.associatedWithGbifProgramme',
            defaultMessage: 'Are you associated with a project funded by a GBIF programme?',
          }),
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
    [suggestedNodeCountry, participant, setParticipant, intl]
  );

  return (
    <BlockContainer className={cn('g-bg-white g-overflow-visible', className)}>
      <StepperForm form={form} onSubmit={onSubmit} steps={STEPS} />
    </BlockContainer>
  );
}

function useSaveProgressInSessionStorage(
  key: string,
  getValues: UseFormGetValues<Inputs>,
  participant?: ValidParticipant
) {
  useEffect(() => {
    const handler = () => {
      const values = getValues();
      window.sessionStorage.setItem(key, JSON.stringify({ values, participant }));
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [key, getValues, participant]);
}

function getProgressFromSessionStorage(key: string) {
  const draft = window.sessionStorage.getItem(key);
  if (draft) {
    try {
      const parsed = JSON.parse(draft);
      return parsed;
    } catch (e) {
      console.error('Failed to parse become-a-publisher draft', e);
    }
  }
}

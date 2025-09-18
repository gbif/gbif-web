import { ValidParticipant } from '@/components/select/participantSelect';
import { Step, StepperForm } from '@/components/stepperForm';
import { useToast } from '@/components/ui/use-toast';
import { useConfig } from '@/config/config';
import { cn } from '@/utils/shadcn';
import { withIndex } from '@/utils/withIndex';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
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
import {
  clearSavedFormProgress,
  getFormProgress,
  useSaveFormProgress,
} from '@/hooks/useSaveFormProgress';
import { ProtectedForm } from '@/components/protectedForm';
import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { FormSuccess } from '@/components/formSuccess';

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

const STORAGE_KEY = 'become-a-publisher-draft';

type Props = {
  className?: string;
};

export function BecomeAPublisherForm({ className }: Props) {
  const [state, setState] = useState<'ready' | 'success'>('ready');

  return (
    <ProtectedForm
      className="g-mt-4"
      title={<FormattedMessage id="eoi.loginToRegisterOrganization.title" />}
      message={<FormattedMessage id="eoi.loginToRegisterOrganization.message" />}
    >
      <BlockContainer className={cn('g-bg-white g-overflow-visible g-px-0', className)}>
        {state === 'ready' && (
          <StaticRenderSuspence>
            <InternalForm onSuccess={() => setState('success')} />
          </StaticRenderSuspence>
        )}
        {state === 'success' && (
          <FormSuccess
            title={<FormattedMessage id="eoi.thankYouForYourRegistration" />}
            message={<FormattedMessage id="phrases.weWillBeInTouchSoon" />}
            resetMessage={<FormattedMessage id="eoi.registerAnotherOrganization" />}
            onReset={() => setState('ready')}
          />
        )}
      </BlockContainer>
    </ProtectedForm>
  );
}

type InternalFormProps = {
  onSuccess: () => void;
};

function InternalForm({ onSuccess }: InternalFormProps) {
  const restored = useMemo(() => getFormProgress(STORAGE_KEY), []);

  const form = useForm<Inputs>({
    resolver: zodResolver(Schema),
    mode: 'onBlur',
    defaultValues: restored?.values || defaultValues,
  });

  // Used by the Endorsement step, but hoisted here to save and restore from session storage
  const [participant, setParticipant] = useState<ValidParticipant | undefined>(
    restored?.participant
  );

  // Save form progress to session storage
  const { getValues } = form;
  const getState = useCallback(
    () => ({ values: getValues(), participant }),
    [getValues, participant]
  );
  useSaveFormProgress(STORAGE_KEY, getState);

  const { suggestedNodeCountry, updateSuggestedNodeCountry } = useSuggestedNodeCountry();

  // Sync the suggested node country when the country changes
  const country = form.watch('organizationAddress.country');
  useEffect(() => {
    if (country) {
      updateSuggestedNodeCountry(country);
    }
  }, [country, updateSuggestedNodeCountry]);

  const intl = useIntl();

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

  const onSubmit = useSubmit({ onSuccess, reset: form.reset });

  return <StepperForm form={form} onSubmit={form.handleSubmit(onSubmit)} steps={STEPS} />;
}

type UseSubmitArgs = {
  onSuccess: () => void;
  reset: () => void;
};

function useSubmit({ onSuccess, reset }: UseSubmitArgs) {
  const intl = useIntl();
  const { user } = useUser();
  const { toast } = useToast();
  const config = useConfig();

  return useCallback(
    (data: Inputs) => {
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

          clearSavedFormProgress(STORAGE_KEY);
          reset();
          onSuccess();
        })
        .catch((error) => {
          toast({
            title: intl.formatMessage({
              id: 'eoi.failedToRegisterOrganization',
              defaultMessage: 'Failed to register organization',
            }),
            description: intl.formatMessage({
              id: 'phrases.pleaseTryAgainLater',
              defaultMessage: 'Please try again later',
            }),
            variant: 'destructive',
          });
          console.error(error);
        });
    },
    [toast, config.formsEndpoint, intl, user?.graphqlToken, onSuccess, reset]
  );
}

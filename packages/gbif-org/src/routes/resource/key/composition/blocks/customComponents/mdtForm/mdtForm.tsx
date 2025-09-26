import { Step, StepperForm } from '@/components/stepperForm';
import { useToast } from '@/components/ui/use-toast';
import { useConfig } from '@/config/config';
import { withIndex } from '@/utils/withIndex';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { z } from 'zod';
import { BlockContainer } from '../../_shared';
import {
  createTypedCheckboxField,
  createTypedTextField,
  RequiredCheckboxSchema,
  RequiredEmailSchema,
  RequiredStringSchema,
} from '../_shared';
import { ContentProviders } from './steps/contentProviders';
import { Description } from './steps/description';
import { Domain } from './steps/domain';
import { ModeOfOperation } from './steps/modeOfOperation';
import { Terms } from './steps/terms';
import { TimeLine } from './steps/timeline';
import { TypeOfApplication } from './steps/typeOfApplication';
import { ProtectedForm } from '@/components/protectedForm';
import { useUser } from '@/contexts/UserContext';
import {
  clearSavedFormProgress,
  getFormProgress,
  useSaveFormProgress,
} from '@/hooks/useSaveFormProgress';
import { ValidParticipant } from '@/components/select/participantSelect';
import { PrimaryContact } from './steps/primaryContact';
import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { FormSuccess } from '@/components/formSuccess';

// Build schema as base fields AND a discriminated union on `type` so
// `group_publisher_description` becomes required only for `Group_installation`.
const BaseSchema = z.object({
  person_name: RequiredStringSchema,
  email: RequiredEmailSchema,
  participant: z.object(
    {
      title: z.string(),
      country: z.string().optional(),
    },
    { errorMap: () => ({ message: '#validation.pleaseSelectAValue' }) }
  ),
  installation_name: RequiredStringSchema,
  description: RequiredStringSchema,
  Mode_of_operation: z.enum(['publishing', 'conversion_only'], {
    errorMap: () => ({ message: '#validation.pleaseSelectAValue' }),
  }),
  content_providers: RequiredStringSchema,
  timeline: z.string().optional(),
  domain: z.string().optional(),
  have_read_the_service_agreement: RequiredCheckboxSchema,
  will_provide_feedback: RequiredCheckboxSchema,
  will_participate_in_quarterly_webinars: RequiredCheckboxSchema,
  will_ensure_datasets_published_will_remain_online: RequiredCheckboxSchema,
});

const TypeSchema = z.discriminatedUnion(
  'type',
  [
    z.object({
      type: z.literal('Group_installation'),
      group_publisher_description: RequiredStringSchema,
    }),
    z.object({
      type: z.literal('National_installation'),
    }),
    z.object({
      type: z.literal('Thematic_node_installation'),
    }),
    z.object({
      type: z.literal('Regional_installation'),
    }),
  ],
  {
    errorMap: () => ({ message: '#validation.pleaseSelectAValue' }),
  }
);

const Schema = BaseSchema.and(TypeSchema);

export type Inputs = z.infer<typeof Schema>;

export const CheckboxField = createTypedCheckboxField<Inputs>();
export const TextField = createTypedTextField<Inputs>();

const STORAGE_KEY = 'mdt-application-draft';

export function MdtForm() {
  const [state, setState] = useState<'ready' | 'success'>('ready');
  const intl = useIntl();

  return (
    <ProtectedForm
      className="g-my-8 g-max-w-3xl g-mx-auto g-bg-gray-50"
      title={intl.formatMessage({ id: 'mdt.protectedTitle' })}
      message={intl.formatMessage({ id: 'mdt.protectedMessage' })}
    >
      <BlockContainer className="g-bg-white g-overflow-visible g-px-0">
        {state === 'ready' && (
          <StaticRenderSuspence>
            <InternalForm onSuccess={() => setState('success')} />
          </StaticRenderSuspence>
        )}
        {state === 'success' && (
          <FormSuccess
            className="g-my-8 g-max-w-3xl g-mx-auto"
            title={intl.formatMessage({ id: 'mdt.successTitle' })}
            message={intl.formatMessage({ id: 'mdt.successMessage' })}
            resetMessage={intl.formatMessage({ id: 'mdt.successReset' })}
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
  const [participant, setParticipant] = useState<ValidParticipant | undefined>(
    restored?.participant
  );

  const form = useForm<Inputs>({
    resolver: zodResolver(Schema),
    mode: 'onBlur',
    defaultValues: {
      have_read_the_service_agreement: false,
      will_provide_feedback: false,
      will_participate_in_quarterly_webinars: false,
      will_ensure_datasets_published_will_remain_online: false,
      ...restored?.values,
    },
  });

  // Persist form progress to session storage
  const { getValues } = form;
  const getState = useCallback(
    () => ({ values: getValues(), participant }),
    [getValues, participant]
  );
  useSaveFormProgress(STORAGE_KEY, getState);

  const intl = useIntl();

  const STEPS: Step[] = useMemo(
    () =>
      withIndex([
        {
          title: intl.formatMessage({
            id: 'mdt.primaryContact',
            defaultMessage: 'Contact information',
          }),
          heading: intl.formatMessage({ id: 'mdt.primaryContactHeading' }),
          component: () => (
            <PrimaryContact participant={participant} setParticipant={setParticipant} />
          ),
          validationPath: ['person_name', 'email', 'participant'],
        },
        {
          title: intl.formatMessage({
            id: 'mdt.description',
            defaultMessage: 'Description',
          }),
          heading: intl.formatMessage({ id: 'mdt.descriptionHeading' }),
          component: Description,
          fieldset: true,
          validationPath: ['installation_name', 'description'],
        },
        {
          title: intl.formatMessage({
            id: 'mdt.typeOfApplication',
            defaultMessage: 'Type',
          }),
          heading: intl.formatMessage({ id: 'mdt.typeOfApplicationHeading' }),
          component: TypeOfApplication,
          fieldset: true,
          validationPath: ['type', 'group_publisher_description'],
        },
        {
          title: intl.formatMessage({
            id: 'mdt.modeOfOperation',
            defaultMessage: 'Mode of operation',
          }),
          component: ModeOfOperation,
          fieldset: true,
          validationPath: 'Mode_of_operation',
        },
        {
          title: intl.formatMessage({
            id: 'mdt.anticipatedUsers',
            defaultMessage: 'Content providers',
          }),
          heading: intl.formatMessage({ id: 'mdt.anticipatedUsersHeading' }),
          component: ContentProviders,
          fieldset: true,
          validationPath: 'content_providers',
        },
        {
          title: intl.formatMessage({
            id: 'mdt.timeline',
            defaultMessage: 'Timeline',
          }),
          component: TimeLine,
          validationPath: 'timeline',
        },
        {
          title: intl.formatMessage({
            id: 'mdt.domain',
            defaultMessage: 'Domain',
          }),
          component: Domain,
          fieldset: true,
          validationPath: 'domain',
        },
        {
          title: intl.formatMessage({
            id: 'mdt.terms',
            defaultMessage: 'Terms',
          }),
          component: Terms,
          fieldset: true,
          validationPath: 'terms',
        },
      ]),
    [intl, participant, setParticipant]
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
      fetch(`${config.formsEndpoint}/mdt-application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user?.graphqlToken ? `Bearer ${user.graphqlToken}` : '',
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
            title: intl.formatMessage({ id: 'mdt.submitErrorTitle' }),
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

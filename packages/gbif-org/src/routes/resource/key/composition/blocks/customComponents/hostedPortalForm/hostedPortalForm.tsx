import { Step, StepperForm } from '@/components/stepperForm';
import { useToast } from '@/components/ui/use-toast';
import { useConfig } from '@/config/config';
import { withIndex } from '@/utils/withIndex';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BlockContainer } from '../../_shared';
import {
  createTypedCheckboxField,
  createTypedTextField,
  OptionalStringSchema,
  RequiredCheckboxSchema,
  RequiredEmailSchema,
  RequiredStringSchema,
} from '../_shared';
import { ApplicationType } from './steps/applicationType';
import { DataScope } from './steps/dataScope';
import { Experience } from './steps/experience';
import { HostedPortalName } from './steps/hostedPortalName';
import { Languages } from './steps/languages';
import { NodeContact } from './steps/nodeContact';
import { PrimaryContact } from './steps/primaryContact';
import { Terms } from './steps/terms';
import { Timelines } from './steps/timelines';
import { UserGroup } from './steps/userGroup';
import { useUser } from '@/contexts/UserContext';
import {
  clearSavedFormProgress,
  getFormProgress,
  useSaveFormProgress,
} from '@/hooks/useSaveFormProgress';
import { FormattedMessage, useIntl } from 'react-intl';
import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { ProtectedForm } from '@/components/protectedForm';
import { FormSuccess } from '@/components/formSuccess';

// Using # to indicate the error messages should be treated as a translation key
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
        participantNode: z.object(
          {
            name: RequiredStringSchema,
            countryCode: RequiredStringSchema,
          },
          { errorMap: () => ({ message: '#validation.pleaseSelectAValue' }) }
        ),
      }),
      z.object({
        type: z.literal('Other_type_of_portal'),
        publisherDescription: RequiredStringSchema,
      }),
    ],
    { errorMap: () => ({ message: '#validation.pleaseSelectAValue' }) }
  ),
  nodeContact: z.discriminatedUnion(
    'type',
    [
      z.object({ type: z.literal('I_am_the_node_manager') }),
      z.object({ type: z.literal('Node_manager_contacted'), nodeManager: RequiredStringSchema }),
      z.object({ type: z.literal('No_contact_to_node_manager') }),
    ],
    { errorMap: () => ({ message: '#validation.pleaseSelectAValue' }) }
  ),
  nodeManager: OptionalStringSchema,
  dataScope: RequiredStringSchema,
  userGroup: RequiredStringSchema,
  timelines: OptionalStringSchema,
  languages: RequiredStringSchema,
  experience: z.enum(['has_plenty_experience', 'has_limited_experience', 'has_no_experience'], {
    errorMap: () => ({ message: '#validation.pleaseSelectAValue' }),
  }),
  termsAccepted: RequiredCheckboxSchema,
});

export type Inputs = z.infer<typeof Schema>;

export const CheckboxField = createTypedCheckboxField<Inputs>();
export const TextField = createTypedTextField<Inputs>();

const STORAGE_KEY = 'hosted-portal-application-draft';

export function HostedPortalForm() {
  const [state, setState] = useState<'ready' | 'success'>('ready');

  return (
    <ProtectedForm
      className="g-my-8 g-max-w-3xl g-mx-auto g-bg-gray-50"
      title={
        <FormattedMessage
          id="hostedPortalApplication.protectedFormTitle"
          defaultMessage="You need an account to request a hosted portal"
        />
      }
      message={
        <FormattedMessage
          id="hostedPortalApplication.protectedFormMessage"
          defaultMessage="Log in or create an account to continue requesting a hosted portal."
        />
      }
    >
      <BlockContainer className="g-overflow-visible g-px-0">
        {state === 'ready' && (
          <StaticRenderSuspence>
            <InternalForm onSuccess={() => setState('success')} />
          </StaticRenderSuspence>
        )}
        {state === 'success' && (
          <FormSuccess
            className="g-my-8 g-max-w-3xl g-mx-auto"
            title={
              <FormattedMessage
                id="hostedPortalApplication.thankYouForYourApplication"
                defaultMessage="Thank you for submitting your application"
              />
            }
            message={<FormattedMessage id="phrases.weWillBeInTouchSoon" />}
            resetMessage={<FormattedMessage id="hostedPortalApplication.createNewApplication" />}
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
  const intl = useIntl();
  const restored = useMemo(() => getFormProgress(STORAGE_KEY), []);

  const form = useForm<Inputs>({
    resolver: zodResolver(Schema),
    mode: 'onBlur',
    defaultValues: restored || {},
  });

  useSaveFormProgress(STORAGE_KEY, form.getValues);

  const STEPS: Step[] = useMemo(
    () =>
      withIndex([
        {
          title: intl.formatMessage({
            id: 'hostedPortalApplication.primaryContact',
            defaultMessage: 'Primary contact',
          }),
          heading: intl.formatMessage({
            id: 'hostedPortalApplication.primaryContactHeading',
            defaultMessage: 'Primary contact for this application',
          }),
          component: PrimaryContact,
          fieldset: true,
          validationPath: 'primaryContact',
        },
        {
          title: intl.formatMessage({
            id: 'hostedPortalApplication.portalName',
            defaultMessage: 'Portal name',
          }),
          heading: intl.formatMessage({
            id: 'hostedPortalApplication.hostedPortalName',
            defaultMessage: 'Hosted portal name',
          }),
          component: HostedPortalName,
          validationPath: 'hostedPortalName',
        },
        {
          title: intl.formatMessage({
            id: 'hostedPortalApplication.applicationType',
            defaultMessage: 'Application type',
          }),
          heading: intl.formatMessage({
            id: 'hostedPortalApplication.typeOfApplication',
            defaultMessage: 'Type of application',
          }),
          component: ApplicationType,
          fieldset: true,
          validationPath: 'applicationType',
        },
        {
          title: intl.formatMessage({
            id: 'hostedPortalApplication.nodeContact',
            defaultMessage: 'Node contact',
          }),
          heading: intl.formatMessage({
            id: 'hostedPortalApplication.nodeContactHeading',
            defaultMessage:
              'Are you in contact with a GBIF Participant Node Manager about this application?',
          }),
          component: NodeContact,
          fieldset: true,
          validationPath: 'nodeContact',
        },
        {
          title: intl.formatMessage({
            id: 'hostedPortalApplication.dataScope',
            defaultMessage: 'Data scope',
          }),
          heading: intl.formatMessage({
            id: 'hostedPortalApplication.dataScopeHeading',
            defaultMessage: 'Description of the data scope for the proposed portal',
          }),
          component: DataScope,
          validationPath: 'dataScope',
        },
        {
          title: intl.formatMessage({
            id: 'hostedPortalApplication.userGroup',
            defaultMessage: 'User group',
          }),
          heading: intl.formatMessage({
            id: 'hostedPortalApplication.userGroupHeading',
            defaultMessage: 'User group and needs',
          }),
          component: UserGroup,
          validationPath: 'userGroup',
        },
        {
          title: intl.formatMessage({
            id: 'hostedPortalApplication.timelines',
            defaultMessage: 'Timelines',
          }),
          component: Timelines,
          validationPath: 'timelines',
        },
        {
          title: intl.formatMessage({
            id: 'hostedPortalApplication.languages',
            defaultMessage: 'Languages',
          }),

          component: Languages,
          validationPath: 'languages',
        },
        {
          title: intl.formatMessage({
            id: 'hostedPortalApplication.experience',
            defaultMessage: 'Experience',
          }),
          heading: intl.formatMessage({
            id: 'hostedPortalApplication.experienceHeading',
            defaultMessage: 'Level of experience with related tools and languages',
          }),
          component: Experience,
          validationPath: 'experience',
        },
        {
          title: intl.formatMessage({
            id: 'hostedPortalApplication.terms',
            defaultMessage: 'Terms',
          }),
          heading: intl.formatMessage({
            id: 'hostedPortalApplication.termsHeading',
            defaultMessage: 'Terms and conditions',
          }),
          component: Terms,
          validationPath: 'termsAccepted',
        },
      ]),
    [intl]
  );

  const onSubmit = useSubmit({ reset: form.reset, onSuccess });

  return <StepperForm form={form} onSubmit={form.handleSubmit(onSubmit)} steps={STEPS} />;
}

type UseSubmitArgs = {
  onSuccess: () => void;
  reset: () => void;
};

function useSubmit({ onSuccess, reset }: UseSubmitArgs) {
  const { toast } = useToast();
  const config = useConfig();
  const { user } = useUser();
  const intl = useIntl();

  return useCallback(
    (data: Inputs) => {
      fetch(`${config.formsEndpoint}/hosted-portal-application`, {
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
          console.error(error);
          toast({
            title: intl.formatMessage({
              id: 'hostedPortalApplication.failedToSubmitApplication',
              defaultMessage: 'Failed to submit application',
            }),
            description: intl.formatMessage({
              id: 'phrases.pleaseTryAgainLater',
              defaultMessage: 'Please try again later',
            }),
            variant: 'destructive',
          });
        });
    },
    [toast, config.formsEndpoint, user?.graphqlToken, intl, reset, onSuccess]
  );
}

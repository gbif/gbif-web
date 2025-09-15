import { ClientSideOnly } from '@/components/clientSideOnly';
import { Step, StepperForm } from '@/components/stepperForm';
import { useToast } from '@/components/ui/use-toast';
import { useConfig } from '@/config/config';
import { withIndex } from '@/utils/withIndex';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BlockContainer } from '../../_shared';
import {
  createTypedCheckboxField,
  createTypedTextField,
  OptionalStringSchema,
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
import { getFormProgress, useSaveFormProgress } from '@/hooks/useSaveFormProgress';
import { useIntl } from 'react-intl';

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

const STORAGE_KEY = 'hosted-portal-application-draft';

type Props = {
  className?: string;
};

export function HostedPortalForm({ className }: Props) {
  const { toast } = useToast();
  const config = useConfig();
  const { user } = useUser();
  const intl = useIntl();
  const restored = useMemo(() => getFormProgress(STORAGE_KEY), []);

  const form = useForm<Inputs>({
    resolver: zodResolver(Schema),
    mode: 'onBlur',
    defaultValues: restored || {},
  });

  useSaveFormProgress(STORAGE_KEY, form.getValues);

  const onSubmit = useMemo(
    () =>
      form.handleSubmit((data: Inputs) => {
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

            toast({
              title: intl.formatMessage({
                id: 'hostedPortalApplication.thankYouForYourApplication',
                defaultMessage: 'Thank you for submitting your application',
              }),
              description: intl.formatMessage({
                id: 'phrases.weWillBeInTouchSoon',
                defaultMessage: 'We will be in touch soon',
              }),
            });
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
      }),
    [form, toast, config.formsEndpoint, user?.graphqlToken, intl]
  );

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

  return (
    <BlockContainer className={className}>
      <ClientSideOnly>
        <StepperForm form={form} onSubmit={onSubmit} steps={STEPS} />
      </ClientSideOnly>
    </BlockContainer>
  );
}

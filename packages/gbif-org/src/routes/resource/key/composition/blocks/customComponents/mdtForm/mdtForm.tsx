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
  RequiredEmailSchema,
  RequiredStringSchema,
} from '../_shared';
import { ContentProviders } from './steps/contentProviders';
import { Description } from './steps/description';
import { Domain } from './steps/domain';
import { ModeOfOperation } from './steps/modeOfOperation';
import { PrimaryContact } from './steps/primaryContact';
import { Terms } from './steps/terms';
import { TimeLine } from './steps/timeline';
import { TypeOfApplication } from './steps/typeOfApplication';

const Schema = z.object({
  person_name: RequiredStringSchema,
  email: RequiredEmailSchema,
  installation_name: RequiredStringSchema,
  description: z.string().max(2000).optional(),
  participantTitle: z.string(),
  participantCountry: z.string(),
  type: z.enum([
    'National_installation',
    'Thematic_node_installation',
    'Regional_installation',
    'Group_installation',
  ]),
  group_publisher_description: z.string().max(2000).optional(),
  Mode_of_operation: z.enum(['publishing', 'conversion_only']),
  content_providers: z.string().max(2000).optional(),
  timeline: z.string().max(2000).optional(),
  domain: z.string().optional(),
  have_read_the_service_agreement: z.boolean().default(false),
  will_provide_feedback: z.boolean().default(false),
  will_participate_in_quarterly_webinars: z.boolean().default(false),
  will_ensure_datasets_published_will_remain_online: z.boolean().default(false),
});

export type Inputs = z.infer<typeof Schema>;

export const CheckboxField = createTypedCheckboxField<Inputs>();
export const TextField = createTypedTextField<Inputs>();

type Props = {
  className?: string;
};

export function MdtForm({ className }: Props) {
  const { toast } = useToast();
  const config = useConfig();
  const intl = useIntl();
  const form = useForm<Inputs>({
    resolver: zodResolver(Schema),
    mode: 'onBlur',
  });

  /*   const onSubmit = () => {
    try {
      console.log(form.getValues());
      console.log('test');
    } catch (error) {
      console.error(error);
    }
  }; */
  const onSubmit = useMemo(
    () =>
      form.handleSubmit((data: Inputs) => {
        // console.log(data);
        fetch(`${config.formsEndpoint}/mdt-application`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (!response.ok) throw response;

            toast({
              title: 'Thank you for your application',
              description: 'We will be in touch soon',
            });

            form.reset();
          })
          .catch((error) => {
            toast({
              title: 'Failed to register application',
              description: 'Please try again later',
              variant: 'destructive',
            });
            console.error(error);
          });
      }),
    [form, toast, config.formsEndpoint]
  );

  /*   const { suggestedNodeCountry, updateSuggestedNodeCountry } = useSuggestedNodeCountry();
   */
  const STEPS: Step[] = useMemo(
    () =>
      withIndex([
        {
          title: intl.formatMessage({
            id: 'mdt.primaryContact',
            defaultMessage: 'Contact information',
          }),
          component: PrimaryContact,
          validationPath: 'primaryContact',
        },
        {
          title: intl.formatMessage({
            id: 'mdt.description',
            defaultMessage: 'Description',
          }), //'Terms & Conditions',
          component: Description,
          fieldset: true,
          validationPath: 'description',
        },
        {
          title: intl.formatMessage({
            id: 'mdt.typeOfApplication',
            defaultMessage: 'Type',
          }), //'Organization Details',
          component: TypeOfApplication,
          fieldset: true,
          validationPath: 'typeOfApplication',
        },
        {
          title: intl.formatMessage({
            id: 'mdt.modeOfOperation',
            defaultMessage: 'Mode of operation',
          }), //'Organization Address',
          component: ModeOfOperation,
          fieldset: true,
          validationPath: 'modeOfOperation',
        },
        {
          title: intl.formatMessage({
            id: 'mdt.anticipatedUsers',
            defaultMessage: 'Content providers',
          }), //'Endorsement',
          component: ContentProviders,
          fieldset: true,
          validationPath: 'contentProviders',
        },
        {
          title: intl.formatMessage({
            id: 'mdt.timeLine',
            defaultMessage: 'Timeline',
          }), //'GBIF projects',
          component: TimeLine,
          heading: 'Please let us know if there is a deadline for configuring this installation.',
          validationPath: 'timeline',
        },
        {
          title: intl.formatMessage({
            id: 'mdt.domain',
            defaultMessage: 'Domain',
          }), //'Contacts',
          component: Domain,
          fieldset: true,
          validationPath: 'domain',
        },
        {
          title: intl.formatMessage({
            id: 'mdt.terms',
            defaultMessage: 'Terms',
          }), //'What and How',
          component: Terms,
          fieldset: true,
        },
      ]),
    [
      /* updateSuggestedNodeCountry, suggestedNodeCountry */
    ]
  );

  return (
    <BlockContainer className={cn('g-bg-white g-overflow-visible', className)}>
      <ClientSideOnly>
        <StepperForm form={form} onSubmit={onSubmit} steps={STEPS} />
      </ClientSideOnly>
    </BlockContainer>
  );
}

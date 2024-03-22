import { useMemo } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { DynamicLink } from '@/components/DynamicLink';
import { cn } from '@/utils/shadcn';

const RequiredStringSchemaFn = () => z.string().min(1, 'This field is required');
const RequiredEmailSchemaFn = () => RequiredStringSchemaFn().email('This is not a valid email');
const OptionalStringSchemaFn = () => z.string().optional();

// This is a function so we can inject the selected language for data validation
const SchemaFn = () =>
  z
    .object({
      primaryContact: z.object({
        name: RequiredStringSchemaFn(),
        email: RequiredEmailSchemaFn(),
      }),
      hostedPortalName: RequiredStringSchemaFn(),
      applicationType: z.enum(['national', 'another']),
      participantNode: OptionalStringSchemaFn(),
      publisherDescription: OptionalStringSchemaFn(),
      inContactWithGbifParticipantNodeManager: z.enum(['iAmTheNodeManager', 'yes', 'no']),
      nodeManager: OptionalStringSchemaFn(),
      descriptionOfDataScope: RequiredStringSchemaFn(),
      userGroupAndNeeds: RequiredStringSchemaFn(),
      timelines: OptionalStringSchemaFn(),
      languages: RequiredStringSchemaFn(),
      experienceLevel: z.enum(['comfortable', 'someHelp', 'none']),
      terms: z.boolean(),
    })
    .superRefine((data, context) => {
      // Make sure participantNode is provided if applicationType is national
      if (
        data.applicationType === 'national' &&
        !RequiredStringSchemaFn().safeParse(data.participantNode).success
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This field is required',
          path: ['participantNode'],
        });
      }

      // Make sure publisherDescription is provided if applicationType is another
      if (
        data.applicationType === 'another' &&
        !RequiredStringSchemaFn().safeParse(data.publisherDescription).success
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This field is required',
          path: ['publisherDescription'],
        });
      }

      // Make sure nodeManager is provided if inContactWithGbifParticipantNodeManager is yes
      if (
        data.inContactWithGbifParticipantNodeManager === 'yes' &&
        !RequiredStringSchemaFn().safeParse(data.nodeManager).success
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This field is required',
          path: ['nodeManager'],
        });
      }
    });

type Inputs = z.infer<ReturnType<typeof SchemaFn>>;

export function HostedPortalForm() {
  const schema = useMemo(() => SchemaFn(), []);
  const form = useForm<Inputs>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      primaryContact: {
        name: '',
        email: '',
      },
      hostedPortalName: '',
      // applicationType: 'national',
      participantNode: '',
      publisherDescription: '',
      // inContactWithGbifParticipantNodeManager: 'iAmTheNodeManager',
      nodeManager: '',
      descriptionOfDataScope: '',
      userGroupAndNeeds: '',
      timelines: '',
      languages: '',
      // experienceLevel: 'comfortable',
      terms: false,
    },
  });

  const onSubmit = () => (data: Inputs) => {
    console.log(data);
  };

  return (
    <BlockContainer>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-3xl m-auto flex flex-col gap-10"
        >
          <PrimaryContact />
          <HostedPortalName />
          <ApplicationType />
          <InContactWithGbifParticipantNodeManager />
          <DescriptionOfDataScope />
          <UserGroupAndNeeds />
          <Timelines />
          <Languages />
          <ExperienceLevel />
          <Terms />
          <SubmitButton />
        </form>
      </Form>
    </BlockContainer>
  );
}

function PrimaryContact() {
  const form = useFormContext<Inputs>();

  return (
    <fieldset>
      <legend className="text-md font-semibold">
        1. Primary contact for this application
        <Required />
      </legend>

      <div className="flex gap-4">
        <FormField
          control={form.control}
          name="primaryContact.name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="font-normal">
                Name
                <Required />
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="primaryContact.email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="font-normal">
                Email
                <Required />
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </fieldset>
  );
}

function HostedPortalName() {
  const form = useFormContext<Inputs>();

  return (
    <FormField
      control={form.control}
      name="hostedPortalName"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-md font-semibold">
            2. Hosted portal name
            <Required />
          </FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function ApplicationType() {
  const form = useFormContext<Inputs>();
  const applicationType = form.watch('applicationType');

  return (
    <FormField
      control={form.control}
      name="applicationType"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-md font-semibold">
            3. Type of application
            <Required />
          </FormLabel>
          <FormDescription>What best describes your proposed portal?</FormDescription>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} className="flex flex-col space-y-1">
              <RadioItem value="national" label="A national biodiversity portal." />

              <FormField
                control={form.control}
                name="participantNode"
                render={({ field }) => (
                  <FormItem className={cn('pl-6', applicationType === 'national' || 'hidden')}>
                    <FormLabel className="font-normal">
                      Participant country
                      <Required />
                    </FormLabel>
                    <FormDescription>
                      Note that national portals will exclusively be offered to countries
                      participating in GBIF. <br />
                      Please select which participant country this application relates to. Please
                      see the{' '}
                      <DynamicLink to="/the-gbif-network" className="underline">
                        list of participants
                      </DynamicLink>{' '}
                      for contact information
                    </FormDescription>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <RadioItem
                value="another"
                label="Another type of portal to showcase data available in GBIF"
              />

              <FormField
                control={form.control}
                name="publisherDescription"
                render={({ field }) => (
                  <FormItem className={cn('pl-6', applicationType === 'another' || 'hidden')}>
                    <FormLabel className="font-normal">
                      Publisher description
                      <Required />
                    </FormLabel>
                    <FormDescription>
                      Please describe which data publisher(s) and/or GBIF participants will be
                      involved
                    </FormDescription>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function InContactWithGbifParticipantNodeManager() {
  const form = useFormContext<Inputs>();
  const inContactWithGbifParticipantNodeManager = form.watch(
    'inContactWithGbifParticipantNodeManager'
  );

  return (
    <FormField
      control={form.control}
      name="inContactWithGbifParticipantNodeManager"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-md font-semibold">
            4. Are you in contact with a GBIF Participant Node Manager about this application?
            <Required />
          </FormLabel>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} className="flex flex-col space-y-1">
              <RadioItem value="iAmTheNodeManager" label="I am the Node Manager" />

              <RadioItem
                value="yes"
                label="Yes, I am in contact with a Node Manager about this application"
              />

              {inContactWithGbifParticipantNodeManager === 'yes' && (
                <FormField
                  control={form.control}
                  name="nodeManager"
                  render={({ field }) => (
                    <FormItem className="pl-6">
                      <FormDescription>Please state which Node Manager</FormDescription>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <RadioItem
                value="no"
                label="I have not yet contacted a Node Manager about this application"
              />
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function DescriptionOfDataScope() {
  const form = useFormContext<Inputs>();

  return (
    <FormField
      control={form.control}
      name="descriptionOfDataScope"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-md font-semibold">
            5. Description of the data scope for the proposed portal
            <Required />
          </FormLabel>
          <FormDescription>
            Note that hosted portals can only display occurrence records that are already shared on
            GBIF.org and organized to the GBIF backbone taxonomy. Briefly describe the scope of the
            occurrence data that you would like to display on a GBIF hosted portal, including, for
            example, the geographic, taxonomic and temporal scope or other parameters. Approximately
            how many datasets and records currently available from GBIF.org meet this scope? Please
            include links to GBIF.org searches as appropriate.
          </FormDescription>
          <FormControl>
            <Textarea {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function UserGroupAndNeeds() {
  const form = useFormContext<Inputs>();

  return (
    <FormField
      control={form.control}
      name="userGroupAndNeeds"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-md font-semibold">
            6. User group and needs
            <Required />
          </FormLabel>
          <FormDescription>
            Have you identified a group of users for the portal? How would you describe their needs?
            Please also explain how you have identified the user group and their needs. If the
            portal is replacing an existing website, please provide a link if available and explain
            why you think a hosted portal would be a better solution.
          </FormDescription>
          <FormControl>
            <Textarea {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function Timelines() {
  const form = useFormContext<Inputs>();

  return (
    <FormField
      control={form.control}
      name="timelines"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-md font-semibold">7. Timelines</FormLabel>
          <FormDescription>
            Are there any timelines you need to keep with regards to the deployment, promotion and
            ongoing use of the portal?
          </FormDescription>
          <FormControl>
            <Textarea {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function Languages() {
  const form = useFormContext<Inputs>();

  return (
    <FormField
      control={form.control}
      name="languages"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-md font-semibold">
            8. Languages
            <Required />
          </FormLabel>
          <FormDescription>
            What languages would you like your hosted portal to be available in? Please note that
            you will need to translate your own content and menu, and may need to contribute
            translations for common elements such as data search components for languages other than
            English if they are not already available.
          </FormDescription>
          <FormControl>
            <Textarea {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function ExperienceLevel() {
  const form = useFormContext<Inputs>();

  return (
    <FormField
      control={form.control}
      name="experienceLevel"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-md font-semibold">
            9. Level of experience with related tools and languages
            <Required />
          </FormLabel>
          <FormDescription>
            We will be managing the hosted portals in GitHub. You will need to author content using
            Markdown and YAML. This is not difficult and we can direct you to documentation and
            provide support in getting started if needed. Please state your level of experience with
            these:
          </FormDescription>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} className="flex flex-col space-y-1">
              <RadioItem
                value="comfortable"
                label="I am comfortable with using GitHub, Markdown and YAML to author web content"
              />
              <RadioItem
                value="someHelp"
                label="I have some experience but would like some help to get started"
              />
              <RadioItem
                value="none"
                label="I have never used GitHub, Markdown or YAML to author web content"
              />
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function Terms() {
  const form = useFormContext<Inputs>();

  return (
    <div className="space-y-3">
      <span className="text-md font-semibold">
        Terms
        <Required />
      </span>
      <FormField
        control={form.control}
        name="terms"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormLabel className="font-normal leading-4">
              I have read the service agreement and data processor agreement and I accept these
              terms and conditions for the hosted portal I plan to launch.
            </FormLabel>
          </FormItem>
        )}
      />
    </div>
  );
}

function SubmitButton() {
  const form = useFormContext<Inputs>();

  const { isDirty, isLoading, isSubmitting } = form.formState;
  const buttonDisabled = isDirty || isLoading || isSubmitting;

  return (
    <Button className="w-min" type="submit" disabled={buttonDisabled}>
      Submit
    </Button>
  );
}

type RadioItemProps = {
  value: string;
  label: React.ReactNode;
};

function RadioItem({ value, label }: RadioItemProps) {
  return (
    <FormItem className="flex items-center space-x-3 space-y-0">
      <FormControl>
        <RadioGroupItem value={value} />
      </FormControl>
      <FormLabel className="font-normal">{label}</FormLabel>
    </FormItem>
  );
}

function Required() {
  return <span>*</span>;
}

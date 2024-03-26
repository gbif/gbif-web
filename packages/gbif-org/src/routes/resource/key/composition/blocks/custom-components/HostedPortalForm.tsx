import { useMemo, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useQuery from '@/hooks/useQuery';
import { ParticipantsQuery } from '@/gql/graphql';
import { notNull } from '@/utils/notNull';

const RequiredStringSchemaFn = () => z.string().min(1, 'This field is required');
const RequiredEmailSchemaFn = () => RequiredStringSchemaFn().email('This is not a valid email');
const OptionalStringSchemaFn = () => z.string().optional();

// This is a function so we can inject the selected language for data validation
const SchemaFn = () =>
  z.object({
    primaryContact: z.object({
      name: RequiredStringSchemaFn(),
      email: RequiredEmailSchemaFn(),
    }),
    hostedPortalName: RequiredStringSchemaFn(),
    applicationType: z.discriminatedUnion('type', [
      z.object({ type: z.literal('National_portal'), participantNode: RequiredStringSchemaFn() }),
      z.object({ type: z.literal('Other_type_of_portal'), publisherDescription: RequiredStringSchemaFn() }),
    ]),
    nodeContact: z.discriminatedUnion('type', [
      z.object({ type: z.literal('I_am_the_node_manager') }),
      z.object({ type: z.literal('Node_manager_contacted'), nodeManager: RequiredStringSchemaFn() }),
      z.object({ type: z.literal('No_contact_to_node_manager') }),
    ]),
    nodeManager: OptionalStringSchemaFn(),
    dataScope: RequiredStringSchemaFn(),
    userGroup: RequiredStringSchemaFn(),
    timelines: OptionalStringSchemaFn(),
    languages: RequiredStringSchemaFn(),
    experience: z.enum(['has_plenty_experience', 'has_limited_experience', 'has_no_experience']),
    termsAccepted: z.literal(true),
  });

type Inputs = z.infer<ReturnType<typeof SchemaFn>>;

export function HostedPortalForm() {
  const schema = useMemo(() => SchemaFn(), []);
  const form = useForm<Inputs>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

  const onSubmit = (data: Inputs) => {
    console.log(createMarkdown(data));
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
          <NodeContact />
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
  const form = useFormContext<Partial<Inputs>>();

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
          defaultValue=''
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
          defaultValue=''
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
  const form = useFormContext<Partial<Inputs>>();

  return (
    <FormField
      control={form.control}
      name="hostedPortalName"
      defaultValue=''
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
  const form = useFormContext<Partial<Inputs>>();

  return (
    <FormField
      control={form.control}
      name="applicationType.type"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-md font-semibold">
            3. Type of application
            <Required />
          </FormLabel>
          <FormDescription>What best describes your proposed portal?</FormDescription>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} className="flex flex-col space-y-1">
              <RadioItem value="National_portal" label="A national biodiversity portal." />

              <ParticipantNode />

              <RadioItem
                value="Other_type_of_portal"
                label="Another type of portal to showcase data available in GBIF"
              />

              <PublisherDescription />
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function PublisherDescription() {
  const form = useFormContext<Partial<Inputs>>();
  const applicationType = form.watch('applicationType');

  return (
    <FormField
      control={form.control}
      defaultValue=""
      name="applicationType.publisherDescription"
      render={({ field }) => (
        <FormItem className={cn('pl-6', applicationType?.type === 'Other_type_of_portal' || 'hidden')}>
          <FormLabel className="font-normal">
            Publisher description
            <Required />
          </FormLabel>
          <FormDescription>
            Please describe which data publisher(s) and/or GBIF participants will be involved
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

const PARTICIPANTS_QUERY = /* GraphQL */ `
  query Participants {
    participantSearch(limit: 1000) {
      endOfRecords
      results {
        id
        name
      }
    }
  }
`;

function ParticipantNode() {
  const form = useFormContext<Partial<Inputs>>();
  const applicationType = form.watch('applicationType');

  const { load, data, loading, error } = useQuery<ParticipantsQuery, null>(PARTICIPANTS_QUERY, {
    lazyLoad: true,
  });

  useEffect(() => {
    if (applicationType?.type === 'National_portal' && data == null) {
      load();
    }
  }, [applicationType?.type, data, load]);

  return (
    <FormField
      control={form.control}
      name="applicationType.participantNode"
      defaultValue=""
      render={({ field }) => (
        <FormItem className={cn('pl-6', applicationType?.type === 'National_portal' || 'hidden')}>
          <FormLabel className="font-normal">
            Participant country
            <Required />
          </FormLabel>
          <FormDescription>
            Note that national portals will exclusively be offered to countries participating in
            GBIF. <br />
            Please select which participant country this application relates to. Please see the{' '}
            <DynamicLink to="/the-gbif-network" className="underline">
              list of participants
            </DynamicLink>{' '}
            for contact information
          </FormDescription>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Click to select" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {error && <span>Error</span>}
              {loading && <span>Loading</span>}
              {data?.participantSearch?.results
                .map((participant) => participant?.name)
                .filter(notNull)
                .map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function NodeContact() {
  const form = useFormContext<Partial<Inputs>>();

  return (
    <FormField
      control={form.control}
      name="nodeContact.type"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-md font-semibold">
            4. Are you in contact with a GBIF Participant Node Manager about this application?
            <Required />
          </FormLabel>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} className="flex flex-col space-y-1">
              <RadioItem value="I_am_the_node_manager" label="I am the Node Manager" />

              <RadioItem
                value="Node_manager_contacted"
                label="Yes, I am in contact with a Node Manager about this application"
              />

              <NodeManager />

              <RadioItem
                value="No_contact_to_node_manager"
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

function NodeManager() {
  const form = useFormContext<Partial<Inputs>>();
  const nodeContactType = form.watch(
    'nodeContact.type'
  );

  return (
    <FormField
      control={form.control}
      defaultValue=''
      name="nodeContact.nodeManager"
      render={({ field }) => (
        <FormItem
          className={cn(
            'pl-6',
            nodeContactType === 'Node_manager_contacted' || 'hidden'
          )}
        >
          <FormDescription>Please state which Node Manager</FormDescription>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function DescriptionOfDataScope() {
  const form = useFormContext<Partial<Inputs>>();

  return (
    <FormField
      control={form.control}
      defaultValue=''
      name="dataScope"
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
  const form = useFormContext<Partial<Inputs>>();

  return (
    <FormField
      control={form.control}
      defaultValue=''
      name="userGroup"
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
  const form = useFormContext<Partial<Inputs>>();

  return (
    <FormField
      control={form.control}
      defaultValue=''
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
  const form = useFormContext<Partial<Inputs>>();

  return (
    <FormField
      defaultValue=''
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
  const form = useFormContext<Partial<Inputs>>();

  return (
    <FormField
      control={form.control}
      name="experience"
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
                value="has_plenty_experience"
                label="I am comfortable with using GitHub, Markdown and YAML to author web content"
              />
              <RadioItem
                value="has_limited_experience"
                label="I have some experience but would like some help to get started"
              />
              <RadioItem
                value="has_no_experience"
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
  const form = useFormContext<Partial<Inputs>>();

  return (
    <div className="space-y-3">
      <span className="text-md font-semibold">
        Terms
        <Required />
      </span>
      <FormField
        control={form.control}
        name="termsAccepted"
        render={({ field }) => (
          <FormItem >
            <div className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="font-normal leading-4">
                I have read the service agreement and data processor agreement and I accept these
                terms and conditions for the hosted portal I plan to launch.
              </FormLabel>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function SubmitButton() {
  const form = useFormContext<Partial<Inputs>>();

  const { isLoading, isSubmitting } = form.formState;
  const buttonDisabled = isLoading || isSubmitting;

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

function createMarkdown(data: Inputs) {
  const humanReadable = (value: string) => value.replace(/_/g, " ");

  return `
    ## ${data.hostedPortalName}

    Contact name: ${data.primaryContact.name}
    Contact email: [${data.primaryContact.email}](mailto:${data.primaryContact.email})

    **Application type**
    *Type*: ${humanReadable(data.applicationType.type)}

    *Involved parties*: ${data.applicationType.type === 'National_portal' ? data.applicationType.participantNode : data.applicationType.publisherDescription}

    *Node contact*: ${data.nodeContact.type === 'Node_manager_contacted' ? `${data.nodeContact.nodeManager} - ` : ''}${humanReadable(data.nodeContact.type)}

    **Data scope**
    ${data.dataScope}

    **User group**
    ${data.userGroup}

    **Timelines**
    ${data.timelines ?? 'Not specified'}

    **Languages**
    ${data.languages}

    **Experience**
    ${humanReadable(data.experience)}

    **Portal name**
    ${data.hostedPortalName}

    **Status of application**
    * [ ] The node manager has been contacted
    * [ ] Data scope clearly defined
    * [ ] User group - the community seems well defined
    * [ ] Any GrSciColl issues has been addressed

  <details>
  <summary>JSON details</summary>

  \`\`\`json
  ${JSON.stringify(data, null, 2)}
  \`\`\`
  </details>
  `;
}
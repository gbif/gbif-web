import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { Inputs, TextField } from '../HostedPortalForm';
import { RadioGroup } from '@/components/ui/radio-group';
import { RadioItem, Required } from '../../_shared';
import { cn } from '@/utils/shadcn';
import useQuery from '@/hooks/useQuery';
import { ParticipantsQuery } from '@/gql/graphql';
import { useEffect } from 'react';
import { DynamicLink } from '@/components/DynamicLink';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { notNull } from '@/utils/notNull';

export function ApplicationType() {
  const form = useFormContext<Partial<Inputs>>();

  return (
    <FormField
      control={form.control}
      name="applicationType.type"
      render={({ field }) => (
        <FormItem className="space-y-3">
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

const PARTICIPANTS_QUERY = /* GraphQL */ `
  query Participants {
    participantSearch(limit: 1000) {
      endOfRecords
      results {
        id
        name
        countryCode
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
          <Select
            onValueChange={(value) =>
              field.onChange({
                name: value,
                countryCode: data?.participantSearch?.results?.find(
                  (p) => p != null && p.name === value
                )?.countryCode,
              })
            }
            value={field.value?.name}
            defaultValue={field.value?.name}
          >
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

function PublisherDescription() {
  const form = useFormContext<Partial<Inputs>>();
  const applicationType = form.watch('applicationType.type');

  return (
    <TextField
      name="applicationType.publisherDescription"
      label="Publisher description"
      required
      descriptionPosition="above"
      description="Please describe which data publisher(s) and/or GBIF participants will be involved"
      textarea
      className={cn('pl-6', { hidden: applicationType !== 'Other_type_of_portal' })}
    />
  );
}

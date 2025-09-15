import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Country, ParticipantsQuery, ParticipationStatus } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { notNull } from '@/utils/notNull';
import { cn } from '@/utils/shadcn';
import { useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { RadioItem, Required } from '../../_shared';
import { Inputs, TextField } from '../hostedPortalForm';

export function ApplicationType() {
  const form = useFormContext<Partial<Inputs>>();

  return (
    <FormField
      control={form.control}
      name="applicationType.type"
      render={({ field }) => (
        <FormItem className="g-space-y-3">
          <FormDescription>
            <FormattedMessage
              id="hostedPortalApplication.applicationTypeDescription"
              defaultMessage="What best describes your proposed portal?"
            />
          </FormDescription>
          <FormControl>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="g-flex g-flex-col g-space-y-1"
            >
              <RadioItem
                value="National_portal"
                label={
                  <FormattedMessage
                    id="hostedPortalApplication.applicationType.nationalPortal"
                    defaultMessage="A national biodiversity portal."
                  />
                }
              />

              <ParticipantNode />

              <RadioItem
                value="Other_type_of_portal"
                label={
                  <FormattedMessage
                    id="hostedPortalApplication.applicationType.otherType"
                    defaultMessage="Another type of portal to showcase data available in GBIF"
                  />
                }
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
    participantSearch(limit: 1000, type: COUNTRY) {
      endOfRecords
      results {
        id
        name
        countryCode
        participationStatus
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

  const options = useMemo(() => {
    return data?.participantSearch?.results
      .filter(isValidParticipantNode)
      .filter(
        ({ participationStatus }) =>
          participationStatus !== ParticipationStatus.Observer &&
          participationStatus !== ParticipationStatus.Former
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  return (
    <FormField
      control={form.control}
      name="applicationType.participantNode"
      render={({ field }) => (
        <FormItem
          className={cn('g-pl-6', applicationType?.type === 'National_portal' || 'g-hidden')}
        >
          <FormLabel className="g-font-normal">
            <FormattedMessage
              id="hostedPortalApplication.applicationType.participantCountry"
              defaultMessage="Participant country"
            />
            <Required />
          </FormLabel>
          <FormDescription>
            <FormattedMessage
              id="hostedPortalApplication.applicationType.participantCountryDescription"
              defaultMessage="Note that national portals will exclusively be offered to countries participating in GBIF. Please select which participant country this application relates to. Please see the list of participants for contact information."
            />{' '}
            <DynamicLink to="/the-gbif-network" className="g-underline">
              <FormattedMessage
                id="hostedPortalApplication.listOfParticipants"
                defaultMessage="list of participants"
              />
            </DynamicLink>
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
              {options
                ?.map((participant) => participant?.name)
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
      label={
        <FormattedMessage
          id="hostedPortalApplication.applicationType.publisherDescriptionLabel"
          defaultMessage="Publisher description"
        />
      }
      required
      descriptionPosition="above"
      description={
        <FormattedMessage
          id="hostedPortalApplication.applicationType.publisherDescriptionDescription"
          defaultMessage="Please describe which data publisher(s) and/or GBIF participants will be involved"
        />
      }
      textarea
      className={cn('g-pl-6', { 'g-hidden': applicationType !== 'Other_type_of_portal' })}
    />
  );
}

type ValidParticipant = {
  id: string;
  name: string;
  countryCode: Country;
  participationStatus: ParticipationStatus;
};

function isValidParticipantNode(
  value: NonNullable<ParticipantsQuery['participantSearch']>['results'][number]
): value is ValidParticipant {
  if (!value) return false;
  if (!value.id) return false;
  if (!value.name) return false;
  if (!value.countryCode) return false;
  if (!value.participationStatus) return false;
  return true;
}

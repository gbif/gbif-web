import { SimpleTooltip } from '@/components/simpleTooltip';
import { GbifNetworkParticipantsQuery, ParticipationStatus } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useEffect, useMemo, useState } from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';
import { FilterButtonGroup } from '@/components/filterButtonGroup';
import { Table, Th } from '@/components/clientTable';
import { cn } from '@/utils/shadcn';

type SortField = 'name' | 'type' | 'memberSince' | 'region';
type SortDirection = 'asc' | 'desc';

type Participant = NonNullable<
  NonNullable<GbifNetworkParticipantsQuery['nodeSearch']>['results']
>[number];

type ExtendedParticipant = Participant & {
  membershipStart?: string | null; // Add membershipStart as a top-level field
};

type ParticipantType = ParticipationStatus | 'OTHER_ASSOCIATE' | 'UNKNOWN';

const uniqueRegions = ['AFRICA', 'ASIA', 'EUROPE', 'LATIN_AMERICA', 'NORTH_AMERICA', 'OCEANIA'];
const types = ['AFFILIATE', 'OTHER_ASSOCIATE', 'VOTING'];

const regionOptions = uniqueRegions.map((region) => ({
  key: `region_${region}`,
  label: <FormattedMessage id={`enums.gbifRegion.${region}`} />,
}));

const typeOptions = types.map((type) => ({
  key: `type_${type}`,
  label: <FormattedMessage id={`gbifNetwork.participationType.${type}`} />,
}));

const filterOptions = [...regionOptions, ...typeOptions];

export default function Participants({ listData }: { listData: GbifNetworkParticipantsQuery }) {
  const { formatMessage } = useIntl();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [participants, setParticipants] = useState<ExtendedParticipant[]>([]);

  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const selectedRegion = selectedFilter?.startsWith('region_')
    ? selectedFilter.replace('region_', '')
    : null;
  const selectedType = selectedFilter?.startsWith('type_')
    ? (selectedFilter.replace('type_', '') as ParticipantType)
    : null;

  // reformat response to a list of participants + a lookup for countries participation status
  useEffect(() => {
    if (listData) {
      // first remove all nodes that have a participation status of FORMER or OBSERVER
      const activeNodes = listData?.nodeSearch?.results
        .filter(
          (node) =>
            node &&
            node?.participant &&
            node?.participant?.participationStatus !== 'FORMER' &&
            node.participant.participationStatus !== 'OBSERVER'
        )
        .map((x) => ({ ...x, membershipStart: x?.participant?.membershipStart?.substring(0, 4) }))
        // add new field with calculated participation type
        .map((x) => {
          let participationType: ParticipantType = x.participant?.participationStatus ?? 'UNKNOWN';
          if (participationType === 'ASSOCIATE' && x.type === 'OTHER') {
            participationType = 'OTHER_ASSOCIATE';
          }
          return { ...x, participationType };
        });
      setParticipants(activeNodes ?? []);
    }
  }, [listData]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedParticipants = useMemo(() => {
    let filtered = participants;

    if (selectedRegion) {
      filtered = filtered.filter((p) => p.participant?.gbifRegion === selectedRegion);
    }

    if (selectedType) {
      filtered = filtered.filter((p) => p.participationType === selectedType);
    }

    return [...filtered].sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;

      switch (sortField) {
        case 'name':
          return multiplier * (a.participant?.name ?? '').localeCompare(b.participant?.name ?? '');
        case 'type':
          return (
            multiplier *
            formatMessage({
              id: `gbifNetwork.participationType.${a?.participationType ?? 'UNKNOWN'}`,
            }).localeCompare(
              formatMessage({
                id: `gbifNetwork.participationType.${b?.participationType ?? 'UNKNOWN'}`,
              })
            )
          );
        case 'memberSince':
          return multiplier * (a.membershipStart - b.membershipStart);
        case 'region':
          return (
            multiplier *
            (a.participant?.gbifRegion ?? '').localeCompare(b.participant?.gbifRegion ?? '')
          );
        default:
          return 0;
      }
    });
  }, [participants, selectedRegion, sortField, sortDirection, formatMessage, selectedType]);

  return (
    <div>
      {/* Region Filter */}
      <ArticleTextContainer>
        <div className="g-mb-6">
          <FilterButtonGroup
            options={filterOptions}
            selectedValue={selectedFilter}
            onSelect={setSelectedFilter}
            allLabel={<FormattedMessage id="gbifNetwork.all" />}
            clearLabel={<FormattedMessage id="gbifNetwork.clear" />}
          />
        </div>
      </ArticleTextContainer>

      {/* Summary Section */}
      <Summary filteredAndSortedParticipants={filteredAndSortedParticipants} />

      <Table>
        <thead>
          <tr>
            <Th
              className="g-text-left g-min-w-[200px] g-max-w-[400px]"
              sortable
              field="name"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            >
              <FormattedMessage id="gbifNetwork.participant" />
            </Th>
            <Th
              className="g-text-start"
              sortable
              field="type"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            >
              <FormattedMessage id="gbifNetwork.type" />
            </Th>
            <Th
              className="g-text-end"
              sortable
              field="memberSince"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            >
              <FormattedMessage id="gbifNetwork.memberSince" />
            </Th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedParticipants.map((participant, index) => (
            <tr key={index}>
              <td className="g-font-medium g-text-gray-900">
                <DynamicLink
                  pageId={participant.type === 'COUNTRY' ? 'countryKey' : 'participantKey'}
                  variables={
                    participant.type === 'COUNTRY'
                      ? { countryCode: participant.country }
                      : { key: participant.participant.id }
                  }
                >
                  {participant.participant?.name}
                </DynamicLink>
              </td>
              <td>
                <span
                  className={cn(
                    'g-inline-flex g-whitespace-nowrap g-items-center g-px-2.5 g-py-0.5 g-rounded-full g-text-xs g-font-medium',
                    'g-bg-blue-100 g-text-blue-800',
                    {
                      'g-bg-purple-100 g-text-purple-800':
                        participant.participationType === 'VOTING',
                      'g-bg-yellow-100 g-text-yellow-800':
                        participant.participationType === 'ASSOCIATE',
                    }
                  )}
                >
                  <FormattedMessage
                    id={`gbifNetwork.participationType.${participant.participationType}`}
                  />
                  {participant.participationType === 'AFFILIATE' && (
                    <SimpleTooltip title={<FormattedMessage id="gbifNetwork.affiliateHelp" />}>
                      <MdInfoOutline className="g-ms-1" />
                    </SimpleTooltip>
                  )}
                </span>
              </td>
              <td className="g-text-end">{participant.membershipStart}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

function Summary({
  filteredAndSortedParticipants,
}: {
  filteredAndSortedParticipants: ExtendedParticipant[];
}) {
  const typeCounts = useMemo(() => {
    const counts: Record<ParticipantType, number> = {
      VOTING: 0,
      AFFILIATE: 0,
      ASSOCIATE: 0,
      OTHER_ASSOCIATE: 0,
      FORMER: 0,
      OBSERVER: 0,
      UNKNOWN: 0,
    };

    filteredAndSortedParticipants.forEach((p) => {
      if (p.participationType) {
        counts[p.participationType]++;
      }
    });

    return counts;
  }, [filteredAndSortedParticipants]);

  return (
    <ArticleTextContainer>
      <div className="g-mb-6 g-p-4 g-bg-gray-50 g-rounded-lg">
        <div className="g-text-sm g-text-gray-700">
          <span className="g-font-semibold">
            <FormattedMessage
              id="counts.nParticipants"
              values={{ total: filteredAndSortedParticipants.length }}
            />
          </span>
          {(typeCounts.VOTING > 0 ||
            typeCounts.ASSOCIATE > 0 ||
            typeCounts.AFFILIATE > 0 ||
            typeCounts.OTHER_ASSOCIATE > 0) && <span className="g-mx-2">—</span>}
          {typeCounts.VOTING > 0 && (
            <span className="g-mr-3">
              <FormattedMessage
                id="counts.nVotingParticipants"
                values={{ total: typeCounts.VOTING }}
              />
            </span>
          )}
          {typeCounts.ASSOCIATE > 0 && (
            <span className="g-mr-3">
              <FormattedMessage
                id="counts.nAssociateParticipants"
                values={{ total: typeCounts.ASSOCIATE }}
              />
            </span>
          )}
          {typeCounts.AFFILIATE > 0 && (
            <span className="g-mr-3">
              <FormattedMessage
                id="counts.nAffiliateParticipants"
                values={{ total: typeCounts.AFFILIATE }}
              />
            </span>
          )}
          {typeCounts.OTHER_ASSOCIATE > 0 && (
            <span className="g-mr-3">
              <FormattedMessage
                id="counts.nOtherAssociateParticipants"
                values={{ total: typeCounts.OTHER_ASSOCIATE }}
              />
            </span>
          )}
        </div>
      </div>
    </ArticleTextContainer>
  );
}

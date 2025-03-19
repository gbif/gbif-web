import { SimpleTooltip } from '@/components/simpleTooltip';
import { Button } from '@/components/ui/button';
import { GbifNetworkParticipantsQuery, ParticipationStatus } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useEffect, useMemo, useState } from 'react';
import { MdClear, MdInfoOutline } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';
import { Th } from './Table';

type SortField = 'name' | 'type' | 'memberSince' | 'region';
type SortDirection = 'asc' | 'desc';

type Participant = NonNullable<
  NonNullable<GbifNetworkParticipantsQuery['nodeSearch']>['results']
>[number];

type ExtendedParticipant = Participant & {
  membershipStart?: string | null; // Add membershipStart as a top-level field
};

type ParticipantType = ParticipationStatus | 'OTHER_ASSOCIATE' | 'UNKNOWN';

export default function Participants({ listData }: { listData: GbifNetworkParticipantsQuery }) {
  const { formatMessage } = useIntl();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ParticipantType | null>(null);
  const [participants, setParticipants] = useState<ExtendedParticipant[]>([]);

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
        })
        // remove region from affiliate nodes
        .map((x) => {
          if (x.participationType === 'AFFILIATE' || x.participationType === 'ASSOCIATE') {
            return { ...x, participant: { ...x.participant, gbifRegion: null } };
          }
          return x;
        });
      setParticipants(activeNodes ?? []);
    }
  }, [listData]);

  const uniqueRegions = ['AFRICA', 'ASIA', 'EUROPE', 'LATIN_AMERICA', 'NORTH_AMERICA', 'OCEANIA'];
  const types = ['AFFILIATE', 'OTHER_ASSOCIATE'];

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
              id: `gbifNetwork.participationType.${a?.participationType ?? 'UNKNOWN'}.title`,
            }).localeCompare(
              formatMessage({
                id: `gbifNetwork.participationType.${b?.participationType ?? 'UNKNOWN'}.title`,
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
          <div className="g-flex g-flex-wrap g-gap-2">
            <button
              onClick={() => {
                setSelectedType(null);
                setSelectedRegion(null);
              }}
              className={`g-px-4 g-py-2 g-text-sm g-font-medium g-rounded-md g-transition-colors
                    ${
                      !selectedRegion && !selectedType
                        ? 'g-bg-primary-600 g-text-white'
                        : 'g-bg-white g-text-gray-700 g-border g-border-gray-300 hover:g-bg-gray-50'
                    }`}
            >
              <FormattedMessage id="phrases.all" />
            </button>
            {uniqueRegions.map((region) => (
              <Button
                key={region}
                onClick={() => {
                  setSelectedType(null);
                  setSelectedRegion(region);
                }}
                variant={selectedRegion === region ? 'default' : 'primaryOutline'}
                xclassName={`g-px-4 g-py-2 g-text-sm g-font-medium g-rounded-md g-transition-colors
                      ${
                        selectedRegion === region
                          ? 'g-bg-primary-500 g-text-white'
                          : 'g-bg-white g-text-gray-700 g-border g-border-gray-300 hover:g-bg-gray-50'
                      }`}
              >
                <FormattedMessage id={`enums.region.${region}`} />
              </Button>
            ))}
            {types.map((type) => (
              <Button
                onClick={() => {
                  setSelectedType(type);
                  setSelectedRegion(null);
                }}
                variant={selectedRegion === type ? 'default' : 'primaryOutline'}
                xclassName={`g-px-4 g-py-2 g-text-sm g-font-medium g-rounded-md g-transition-colors
                      ${
                        selectedType === type
                          ? 'g-bg-primary-500 g-text-white'
                          : 'g-bg-white g-text-gray-700 g-border g-border-gray-300 hover:g-bg-gray-50'
                      }`}
              >
                <FormattedMessage id={`gbifNetwork.participationType.${type}.title`} />
              </Button>
            ))}
            {(selectedRegion || selectedType) && (
              <button
                onClick={() => {
                  setSelectedRegion(null);
                  setSelectedType(null);
                }}
                className="g-flex g-items-center g-gap-1 g-px-3 g-py-2 g-text-sm g-font-medium g-text-red-600 g-bg-red-50 g-rounded-md hover:g-bg-red-100 g-transition-colors"
              >
                <MdClear className="g-h-4 g-w-4" />
                <FormattedMessage id="phrases.clear" />
              </button>
            )}
          </div>
        </div>
      </ArticleTextContainer>
      <div className="g-max-w-full g-m-auto">
        <div className="g-overflow-auto">
          <table>
            <thead>
              <Th
                className="g-text-left g-min-w-[200px] g-max-w-[400px]"
                sortable
                field="name"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                <FormattedMessage id="Participant" />
              </Th>
              <Th
                className="g-text-start"
                sortable
                field="type"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                <FormattedMessage id="Type" />
              </Th>
              <Th
                className="g-text-end"
                sortable
                field="memberSince"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                <FormattedMessage id="Member since" />
              </Th>
            </thead>
            <tbody>
              {filteredAndSortedParticipants.map((participant, index) => (
                <tr key={index}>
                  <td className="g-font-medium g-text-gray-900">
                    <DynamicLink
                      pageId={participant.type === 'COUNTRY' ? 'countryKey' : 'participantKey'}
                      variables={{
                        key:
                          participant.type === 'COUNTRY'
                            ? participant.country
                            : participant.participant.id,
                      }}
                    >
                      {participant.participant?.name}
                    </DynamicLink>
                  </td>
                  <td>
                    <span
                      className={`g-inline-flex g-whitespace-nowrap g-items-center g-px-2.5 g-py-0.5 g-rounded-full g-text-xs g-font-medium
                          ${
                            participant.participationType === 'VOTING'
                              ? 'g-bg-purple-100 g-text-purple-800'
                              : participant.participationType === 'ASSOCIATE'
                              ? 'g-bg-yellow-100 g-text-yellow-800'
                              : 'g-bg-blue-100 g-text-blue-800'
                          }`}
                    >
                      <FormattedMessage
                        id={`gbifNetwork.participationType.${participant.participationType}.title`}
                      />
                      {participant.participationType === 'AFFILIATE' && (
                        <SimpleTooltip
                          title={
                            <FormattedMessage id="gbifNetwork.participationType.AFFILIATE.description" />
                          }
                        >
                          <MdInfoOutline className="g-ms-1" />
                        </SimpleTooltip>
                      )}
                    </span>
                  </td>
                  <td className="g-text-end">{participant.membershipStart}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

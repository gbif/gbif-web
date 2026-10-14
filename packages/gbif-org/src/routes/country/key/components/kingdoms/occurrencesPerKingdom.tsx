import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  OccurrencesPerKingdomQuery,
  OccurrencesPerKingdomQueryVariables,
  PredicateType,
} from '@/gql/graphql';
import { notNull } from '@/utils/notNull';
import { useChecklistKey } from '@/hooks/useChecklistKey';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { useMemo } from 'react';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import animaliaIconUrl from './icons/animalia.svg';
import archaeaIconUrl from './icons/archaea.svg';
import bacteriaIconUrl from './icons/bacteria.svg';
import chromistaIconUrl from './icons/chromista.svg';
import fungiIconUrl from './icons/fungi.svg';
import plantaeIconUrl from './icons/plantae.svg';
import protozoaIconUrl from './icons/protozoa.svg';
import unknownIconUrl from './icons/unknown.svg';
import virusesIconUrl from './icons/viruses.svg';

type KingdomInfo = { id: number; icon: string };

const kingdomsByName: Record<string, KingdomInfo> = {
  animalia: { id: 1, icon: animaliaIconUrl },
  plantae: { id: 6, icon: plantaeIconUrl },
  fungi: { id: 5, icon: fungiIconUrl },
  chromista: { id: 4, icon: chromistaIconUrl },
  protozoa: { id: 7, icon: protozoaIconUrl },
};

// The Catalogue of Life splits archaea, bacteria and viruses into several kingdoms. Group them by name.
const archaeaKingdoms = [
  'thermoproteati',
  'methanobacteriati',
  'promethearchaeati',
  'nanobdellati',
];
const bacteriaKingdoms = ['pseudomonadati', 'bacillati', 'fusobacteriati', 'thermotogati'];

// Kingdom names can carry authorship, e.g. "Bacillati (Gibbons & Murray, 1978) Oren & Göker 2024"
function getKingdomInfo(name: string): KingdomInfo | undefined {
  const firstWord = name.split(' ')[0].toLowerCase();
  if (kingdomsByName[firstWord]) return kingdomsByName[firstWord];
  if (archaeaKingdoms.includes(firstWord) || firstWord.startsWith('archaea')) {
    return { id: 2, icon: archaeaIconUrl };
  }
  if (bacteriaKingdoms.includes(firstWord) || firstWord.startsWith('bacteria')) {
    return { id: 3, icon: bacteriaIconUrl };
  }
  if (firstWord.endsWith('virae') || firstWord.startsWith('virus')) {
    return { id: 8, icon: virusesIconUrl };
  }
  return undefined;
}

type Props = {
  type: 'publishedBy' | 'about';
  countryCode: string;
};

export function OccurrencesPerKingdom({ countryCode, type }: Props) {
  const { formatMessage, messages } = useIntl();
  const checklistKey = useChecklistKey();

  const predicate = useMemo(() => {
    return {
      key: type === 'publishedBy' ? 'publishingCountry' : 'country',
      type: PredicateType.Equals,
      value: countryCode,
    };
  }, [countryCode, type]);

  const { data } = useQuery<OccurrencesPerKingdomQuery, OccurrencesPerKingdomQueryVariables>(
    QUERY,
    {
      variables: { predicate, checklistKey },
    }
  );

  const kingdoms = data?.occurrenceSearch?.facet?.kingdomKey?.filter(notNull).map((kingdom) => {
    const name = kingdom.taxonMatch?.usage?.name ?? kingdom.key;
    const info = getKingdomInfo(name);
    const messageId = `enums.kingdomKey.${info?.id}`;
    return {
      key: kingdom.key,
      count: kingdom.count,
      icon: info?.icon ?? unknownIconUrl,
      title: info && messages[messageId] ? formatMessage({ id: messageId }) : name.split(' ')[0],
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <FormattedMessage
            id="dashboard.occurrencesPerField"
            values={{
              FIELD: <FormattedMessage id="dashboard.kingdom" />,
            }}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="g-flex g-gap-8 g-justify-around g-flex-wrap">
        {kingdoms == null
          ? placeholderKingdoms.map((kingdom) => (
              <KingdomItem key={kingdom.title} title={kingdom.title} icon={kingdom.icon} />
            ))
          : kingdoms.map((kingdom) => {
              const searchParams: Record<string, string> = {
                taxonKey: kingdom.key,
              };

              if (checklistKey) searchParams.checklistKey = checklistKey;

              if (type === 'publishedBy') {
                searchParams.publishingCountry = countryCode;
              } else {
                searchParams.country = countryCode;
              }

              return (
                <DynamicLink
                  key={kingdom.key}
                  pageId="occurrenceSearch"
                  searchParams={searchParams}
                  className="g-group"
                >
                  <KingdomItem title={kingdom.title} icon={kingdom.icon} count={kingdom.count} />
                </DynamicLink>
              );
            })}
      </CardContent>
    </Card>
  );
}

const placeholderKingdoms = [
  { title: 'Animalia', icon: animaliaIconUrl },
  { title: 'Plantae', icon: plantaeIconUrl },
  { title: 'Fungi', icon: fungiIconUrl },
];

function KingdomItem({ title, icon, count }: { title: string; icon: string; count?: number }) {
  return (
    <div className="g-flex g-flex-row g-items-center g-gap-2 g-min-w-44">
      <div className="g-size-16 g-p-0.5 g-bg-primary-500 group-hover:g-bg-primary-700 g-rounded-full g-flex g-items-center g-justify-evenly">
        <img src={icon} alt={title} />
      </div>
      <div className="g-flex g-flex-col">
        <span className="g-text-sm">{title}</span>
        <span className="g-text-sm g-font-bold">
          {count == null ? (
            <div className="g-flex g-flex-row g-h-5 g-w-26 g-items-center">
              <Skeleton className="g-w-full g-h-4" />
            </div>
          ) : (
            <FormattedNumber value={count} />
          )}
        </span>
        <span className="g-text-xs">
          <FormattedMessage id="dashboard.occurrences" />
        </span>
      </div>
    </div>
  );
}

const QUERY = /* GraphQL */ `
  query OccurrencesPerKingdom($predicate: Predicate, $checklistKey: ID) {
    occurrenceSearch(predicate: $predicate) {
      facet {
        kingdomKey(checklistKey: $checklistKey, size: 30) {
          key
          count
          taxonMatch(checklistKey: $checklistKey) {
            usage {
              name
            }
          }
        }
      }
    }
  }
`;

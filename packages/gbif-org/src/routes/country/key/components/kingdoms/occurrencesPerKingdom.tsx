import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  OccurrencesPerKingdomQuery,
  OccurrencesPerKingdomQueryVariables,
  PredicateType,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { notNull } from '@/utils/notNull';
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

export const kingdoms = [
  { id: 1, title: 'Animalia', icon: animaliaIconUrl },
  { id: 6, title: 'Plantae', icon: plantaeIconUrl },
  { id: 5, title: 'Fungi', icon: fungiIconUrl },
  { id: 2, title: 'Archaea', icon: archaeaIconUrl },
  { id: 3, title: 'Bacteria', icon: bacteriaIconUrl },
  { id: 4, title: 'Chromista', icon: chromistaIconUrl },
  { id: 7, title: 'Protozoa', icon: protozoaIconUrl },
  { id: 8, title: 'Viruses', icon: virusesIconUrl },
  { id: 0, title: 'incertae sedis', icon: unknownIconUrl },
];

type Props = {
  type: 'publishedBy' | 'about';
  countryCode: string;
};

export function OccurrencesPerKingdom({ countryCode, type }: Props) {
  const { formatMessage } = useIntl();

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
      variables: { predicate },
    }
  );

  const kingdomCountRecord = data?.occurrenceSearch?.facet?.kingdomKey?.reduce((acc, kingdom) => {
    if (!kingdom) return acc;
    acc[kingdom.key] = kingdom.count;
    return acc;
  }, {} as Record<string, number>);

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
        {kingdoms.filter(notNull).map((kingdom) => {
          const searchParams: Record<string, string> = {
            taxonKey: kingdom.id.toString(),
          };

          if (type === 'publishedBy') {
            searchParams.publishingCountry = countryCode;
          } else {
            searchParams.country = countryCode;
          }

          const translatedKingdom = formatMessage({
            id: `enums.kingdomKey.${kingdom.id}`,
          });

          return (
            <DynamicLink
              key={kingdom.id}
              pageId="occurrenceSearch"
              searchParams={searchParams}
              className="g-group"
            >
              <div key={kingdom.id} className="g-flex g-flex-row g-items-center g-gap-2 g-min-w-44">
                <div className="g-size-16 g-p-0.5 g-bg-primary-500 group-hover:g-bg-primary-700 g-rounded-full g-flex g-items-center g-justify-evenly">
                  <img src={kingdom.icon} alt={translatedKingdom} />
                </div>
                <div className="g-flex g-flex-col">
                  <span className="g-text-sm">{translatedKingdom}</span>
                  <span className="g-text-sm g-font-bold">
                    {kingdomCountRecord == null ? (
                      <div className="g-flex g-flex-row g-h-5 g-w-26 g-items-center">
                        <Skeleton className="g-w-full g-h-4" />
                      </div>
                    ) : (
                      <FormattedNumber value={kingdomCountRecord[kingdom.id.toString()] ?? 0} />
                    )}
                  </span>
                  <span className="g-text-xs">
                    <FormattedMessage id="dashboard.occurrences" />
                  </span>
                </div>
              </div>
            </DynamicLink>
          );
        })}
      </CardContent>
    </Card>
  );
}

const QUERY = /* GraphQL */ `
  query OccurrencesPerKingdom($predicate: Predicate) {
    occurrenceSearch(predicate: $predicate) {
      facet {
        kingdomKey {
          key
          count
        }
      }
    }
  }
`;

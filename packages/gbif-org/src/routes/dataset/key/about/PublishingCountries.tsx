import { BulletList } from '@/components/bulletList';
import { FormattedNumber } from '@/components/dashboard/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import {
  DatasetPublishingCountriesQuery,
  DatasetPublishingCountriesQueryVariables,
  PredicateType,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

const PUBLISHING_COUNTRIES = /* GraphQL */ `
  query datasetPublishingCountries($sitePredicate: Predicate) {
    occurrenceSearch(predicate: $sitePredicate) {
      facet {
        countryCode(size: 500) {
          key
          count
        }
      }
    }
  }
`;

export function PublishingCountries({ datasetKey }: { datasetKey: string }) {
  const [showAll, setShowAll] = useState(false);
  const { data, load, error } = useQuery<
    DatasetPublishingCountriesQuery,
    DatasetPublishingCountriesQueryVariables
  >(PUBLISHING_COUNTRIES, {
    throwAllErrors: false,
    lazyLoad: true,
    notifyOnErrors: false,
  });

  useEffect(() => {
    load({
      variables: {
        sitePredicate: {
          type: PredicateType.And,
          predicates: [
            {
              type: PredicateType.Equals,
              key: 'DATASET_KEY',
              value: datasetKey,
            },
          ],
        },
      },
    });
  }, [datasetKey, load]);

  if (!data || error) return null;
  return (
    <Card className="g-mb-4 gbif-word-break" id="registration">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="dataset.publishingCountriesAreas" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BulletList>
          {data?.occurrenceSearch?.facet?.countryCode
            ?.filter((country) => country)
            ?.slice(0, showAll ? undefined : 10)
            .map((country) => (
              <li key={country?.key}>
                <DynamicLink
                  pageId="occurrenceSearch"
                  searchParams={{
                    datasetKey,
                    country: country?.key,
                  }}
                >
                  <FormattedMessage id={`enums.countryCode.${country?.key}`} />
                  <span className="g-text-slate-500 g-ms-1">
                    <FormattedNumber value={country?.count} />
                  </span>
                </DynamicLink>
              </li>
            ))}
        </BulletList>
        {!showAll && (data?.occurrenceSearch?.facet?.countryCode?.length ?? 0) > 10 && (
          <Button
            size="sm"
            variant="primaryOutline"
            className="g-mt-2"
            onClick={() => setShowAll(!showAll)}
          >
            <FormattedMessage id="phrases.showAll" /> (
            <FormattedNumber value={data?.occurrenceSearch?.facet?.countryCode?.length} />)
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

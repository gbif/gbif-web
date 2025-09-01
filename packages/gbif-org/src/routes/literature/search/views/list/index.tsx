import { ClientSideOnly } from '@/components/clientSideOnly';
import { getAsQuery } from '@/components/filters/filterTools';
import { NoRecords } from '@/components/noDataMessages';
import { PaginationFooter } from '@/components/pagination';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { FilterContext } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import { LiteratureListSearchQuery, LiteratureListSearchQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { LiteratureResult } from '@/routes/literature/literatureResult';
import { isPositiveNumber } from '@/utils/isPositiveNumber';
import { notNull } from '@/utils/notNull';
import { useContext, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { searchConfig } from '../../searchConfig';

const LITERATURE_SEARCH_QUERY = /* GraphQL */ `
  query LiteratureListSearch($predicate: Predicate, $size: Int, $from: Int) {
    literatureSearch(predicate: $predicate, size: $size, from: $from) {
      documents {
        size
        from
        total
        results {
          ...LiteratureResult
        }
      }
    }
  }
`;

export function LiteratureListView() {
  const [offset, setOffset] = useState(0);
  const filterContext = useContext(FilterContext);
  const searchContext = useSearchContext();

  const { filter, filterHash } = filterContext || { filter: { must: {} } };

  const { data, load, loading } = useQuery<
    LiteratureListSearchQuery,
    LiteratureListSearchQueryVariables
  >(LITERATURE_SEARCH_QUERY, {
    throwAllErrors: true,
    lazyLoad: true,
    forceLoadingTrueOnMount: true,
  });

  useEffect(() => {
    const query = getAsQuery({ filter, searchContext, searchConfig });
    load({
      variables: {
        ...query,
        size: 20,
        from: offset,
      },
    });
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, offset, filterHash, searchContext]);

  const literature = useMemo(
    () => data?.literatureSearch?.documents?.results.filter(notNull) ?? [],
    [data]
  );

  return (
    <div>
      {loading && (
        <>
          <CardHeader>
            <Skeleton className="g-max-w-64">
              <CardTitle>
                <FormattedMessage id="phrases.loading" />
              </CardTitle>
            </Skeleton>
          </CardHeader>
          <CardListSkeleton />
        </>
      )}
      {!loading && data?.literatureSearch?.documents.total === 0 && (
        <>
          <NoRecords />
        </>
      )}
      {isPositiveNumber(data?.literatureSearch?.documents.total) && (
        <>
          <CardHeader id="literature">
            <CardTitle>
              <FormattedMessage
                id="counts.nResults"
                values={{ total: data.literatureSearch.documents.total }}
              />
            </CardTitle>
          </CardHeader>
          <ClientSideOnly>
            {literature &&
              literature.map((item) => (
                <LiteratureResult literature={item} />
                // <article className="g-m-2 g-border g-border-solid g-p-2 g-bg-white" key={item.id}>
                //   <h2 className="g-font-bold">{item.title}</h2>
                //   <p className="g-text-slate-600 g-text-sm">{item.excerpt}</p>
                //   {item?.identifiers?.doi && (
                //     <Button asChild>
                //       <a href={`https://doi.org/${item.identifiers.doi}`}>More</a>
                //     </Button>
                //   )}
                // </article>
              ))}

            {data.literatureSearch.documents.total > data.literatureSearch.documents.size && (
              <PaginationFooter
                offset={data.literatureSearch.documents.from}
                count={data.literatureSearch.documents.total}
                limit={data.literatureSearch.documents.size}
                onChange={(x) => setOffset(x)}
                anchor="literatures"
              />
            )}
          </ClientSideOnly>
        </>
      )}
    </div>
  );
}

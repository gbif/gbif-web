import {
  ContentType,
  PredicateType,
  ResourceSearchQuery,
  ResourceSearchQueryVariables,
} from '@/gql/graphql';
import { useIntParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import useUpdateEffect from '@/hooks/useUpdateEffect';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import {
  extractValidResources,
  RESOURCE_SEARCH_QUERY,
  ResourceSearchResults,
} from '@/routes/resource/search/resourceSearch';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

export function CountryKeyNews() {
  const { countryCode } = useParams();
  const [offset, setOffset] = useIntParam({ key: 'offset', defaultValue: 0, hideDefault: true });

  const { data, load, loading } = useQuery<ResourceSearchQuery, ResourceSearchQueryVariables>(
    RESOURCE_SEARCH_QUERY,
    {
      throwAllErrors: true,
      lazyLoad: true,
      forceLoadingTrueOnMount: true,
    }
  );

  useEffect(() => {
    load({
      variables: {
        contentType: [ContentType.News],
        predicate: {
          type: PredicateType.Equals,
          key: 'countriesOfCoverage',
          value: countryCode,
        },
        size: 20,
        from: offset,
      },
    });
  }, [load, offset, countryCode]);

  const resources = useMemo(() => extractValidResources(data), [data]);

  const { total, size } = data?.resourceSearch?.documents || {};

  useUpdateEffect(() => {
    window.scrollTo(0, 0);
  }, [offset]);

  return (
    <ArticleContainer className="g-bg-slate-100 g-flex">
      <ArticleTextContainer className="g-flex-auto g-w-full">
        <ResourceSearchResults
          loading={loading}
          resources={resources}
          activeTab={'news'}
          total={total}
          size={size}
          offset={offset}
          setOffset={setOffset}
          disableHeaderActionButtons
        />
      </ArticleTextContainer>
    </ArticleContainer>
  );
}

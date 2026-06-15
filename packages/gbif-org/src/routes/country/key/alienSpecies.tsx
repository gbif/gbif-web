import { DatasetSearchQuery, DatasetSearchQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DATASET_SEARCH_QUERY, DatasetResults } from '@/routes/dataset/search/datasetSearch';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntParam } from '@/hooks/useParam';

const PUBLIC_ISSG_PUBLISHER_KEY =
  import.meta.env.PUBLIC_ISSG_PUBLISHER_KEY ?? 'cdef28b1-db4e-4c58-aa71-3c5238c2d0b5';
export function CountryKeyAlienSpecies() {
  const { countryCode } = useParams();
  const [offset, setOffset] = useIntParam({ key: 'offset', defaultValue: 0, hideDefault: true });
  const [tsvUrl, setTsvUrl] = useState('');

  const { data, error, load, loading } = useQuery<DatasetSearchQuery, DatasetSearchQueryVariables>(
    DATASET_SEARCH_QUERY,
    {
      throwAllErrors: true,
      lazyLoad: true,
      forceLoadingTrueOnMount: true,
    }
  );

  useEffect(() => {
    const keyword = `country_${countryCode}`;
    const downloadUrl = `${
      import.meta.env.PUBLIC_API_V1
    }/dataset/search/export?format=TSV&keyword=${keyword}&publishingOrg=${PUBLIC_ISSG_PUBLISHER_KEY}`;
    setTsvUrl(downloadUrl);

    load({
      variables: {
        query: {
          keyword: [keyword],
          publishingOrg: [PUBLIC_ISSG_PUBLISHER_KEY],
          limit: 20,
          offset,
        },
      },
    });
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, offset]);

  const datasets = data?.datasetSearch;

  return (
    <ArticleContainer className="g-bg-slate-100 g-flex">
      <ArticleTextContainer className="g-flex-auto g-w-full">
        <DatasetResults
          loading={loading}
          datasets={datasets}
          setOffset={setOffset}
          tsvUrl={tsvUrl}
        />
      </ArticleTextContainer>
    </ArticleContainer>
  );
}

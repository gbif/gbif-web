import { SuggestFnProps, SuggestResponseType } from '@/components/filters/suggest';
import { CANCEL_REQUEST, fetchWithCancel } from './fetchWithCancel';
import { Classification } from '@/components/classification';
import { FormattedMessage } from 'react-intl';
import { GraphQLService } from '@/services/graphQLService';
import { SimpleTooltip } from '@/components/simpleTooltip';

export type SuggestionItem = {
  key: string;
  title?: string;
  description?: string;
};

export type SuggestConfig = {
  render?: (item: SuggestionItem) => React.ReactNode;
  getSuggestions: (props: SuggestFnProps) => SuggestResponseType;
  placeholder?: string;
  getStringValue?: (item: SuggestionItem) => string;
};

export const institutionKeySuggest: SuggestConfig = {
  getSuggestions: ({ q, siteConfig }: SuggestFnProps): SuggestResponseType => {
    const { cancel, promise } = fetchWithCancel(
      `${siteConfig.v1Endpoint}/grscicoll/institution/suggest?limit=20&q=${q}`
    );
    const result = promise
      .then((res) => res.json())
      .then((data) => {
        return data.map((item: { key: string; name: string }) => ({
          key: item.key,
          title: item.name,
        }));
      });
    return { cancel, promise: result };
  },
};

export const collectionKeySuggest = {
  getSuggestions: ({ q, siteConfig }: SuggestFnProps): SuggestResponseType => {
    const { cancel, promise } = fetchWithCancel(
      `${siteConfig.v1Endpoint}/grscicoll/collection/suggest?limit=20&q=${q}`
    );
    const result = promise
      .then((res) => res.json())
      .then((data) => {
        return data.map((item: { key: string; name: string }) => ({
          key: item?.key,
          title: item?.name,
        }));
      });
    return { cancel, promise: result };
  },
};

export const datasetKeySuggest = {
  getSuggestions: ({ q, siteConfig }: SuggestFnProps): SuggestResponseType => {
    const { cancel, promise } = fetchWithCancel(
      `${siteConfig.v1Endpoint}/dataset/suggest?limit=20&q=${q}`
    );
    const result = promise.then((res) => res.json());
    return { cancel, promise: result };
  },
};

export const datasetKeyOccurrenceSuggest = {
  getSuggestions: ({ q, siteConfig, searchContext }: SuggestFnProps): SuggestResponseType => {
    const abortController = new AbortController();
    const graphqlService = new GraphQLService({
      endpoint: siteConfig.graphqlEndpoint,
      abortSignal: abortController.signal,
      locale: 'en',
    });

    const rootPredicate = searchContext?.scope;
    const SEARCH = `
    query keywordSearch($predicate: Predicate, $size: Int){
      occurrenceSearch(predicate: $predicate) {
        facet {
          datasetKey(size: $size) {
            key
            count
            dataset {
              title
            }
          }
        }
      }
    }
    `;
    const qPredicate = {
      type: 'like',
      key: 'datasetTitle',
      value: `*${(q ?? '').replace(/\s/, '*')}*`,
    };

    let predicate = qPredicate;
    if (rootPredicate) {
      predicate = {
        type: 'and',
        predicates: [rootPredicate, qPredicate],
      };
    }
    const variables = {
      size: 10,
      predicate,
    };
    const promise = graphqlService.query(SEARCH, variables);
    return {
      promise: promise
        .then((res) => res.json())
        .then((response) => {
          return response.data?.occurrenceSearch?.facet?.datasetKey.map((i) => ({
            ...i,
            title: i.dataset.title,
          }));
        }),
      cancel: () => abortController.abort(CANCEL_REQUEST),
    };
  },
};

export const publisherKeySuggest = {
  getSuggestions: ({ q, siteConfig }: SuggestFnProps): SuggestResponseType => {
    const { cancel, promise } = fetchWithCancel(
      `${siteConfig.v1Endpoint}/organization/suggest?limit=20&q=${q}`
    );
    const result = promise.then((res) => res.json());
    return { cancel, promise: result };
  },
};

export const publisherKeyOccurrenceSuggest = {
  getSuggestions: ({ q, siteConfig, searchContext }: SuggestFnProps): SuggestResponseType => {
    const abortController = new AbortController();
    const graphqlService = new GraphQLService({
      endpoint: siteConfig.graphqlEndpoint,
      abortSignal: abortController.signal,
      locale: 'en',
    });

    const rootPredicate = searchContext?.scope;
    const SEARCH = `
    query keywordSearch($predicate: Predicate, $size: Int){
      occurrenceSearch(predicate: $predicate) {
        facet {
          results: publishingOrg(size: $size) {
            key
            count
            item: publisher {
              title
            }
          }
        }
      }
    }
    `;
    const qPredicate = {
      type: 'like',
      key: 'publisherTitle',
      value: `*${(q ?? '').replace(/\s/, '*')}*`,
    };

    let predicate = qPredicate;
    if (rootPredicate) {
      predicate = {
        type: 'and',
        predicates: [rootPredicate, qPredicate],
      };
    }
    const variables = {
      size: 10,
      predicate,
    };
    const promise = graphqlService.query(SEARCH, variables);
    return {
      promise: promise
        .then((res) => res.json())
        .then((response) => {
          return response.data?.occurrenceSearch?.facet?.results.map((i) => ({
            ...i,
            title: i.item.title,
          }));
        }),
      cancel: () => abortController.abort(CANCEL_REQUEST),
    };
  },
};

export const networkKeySuggest = {
  getSuggestions: ({ q, siteConfig }: SuggestFnProps): SuggestResponseType => {
    const { cancel, promise } = fetchWithCancel(`${siteConfig.v1Endpoint}/network?limit=20&q=${q}`);
    const result = promise
      .then((res) => res.json())
      .then((data) => {
        return data.results.map((item: { key: string; title: string }) => ({
          key: item?.key,
          title: item?.title,
        }));
      });
    return { cancel, promise: result };
  },
};

function TaxonDetailsLabel(taxon) {
  console.log(taxon);
  const ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'].map(
    (rank, i) => {
      return taxon[rank] && rank !== taxon.rank.toLowerCase() ? (
        <span key={rank}>{taxon[rank]}</span>
      ) : null;
    }
  );

  return (
    <div style={{ maxWidth: '100%' }}>
      <div style={{ color: '#aaa', fontSize: '0.85em' }}>
        <Classification>{ranks}</Classification>
      </div>
    </div>
  );
}

export const taxonKeySuggest = {
  render: (item: SuggestionItem) => {
    return (
      <div>
        {item.status !== 'ACCEPTED' && <SimpleTooltip title={<span><FormattedMessage id={`enums.taxonomicStatus.${item.status}`} /></span>}>
          <span style={{ display: 'inline-block', marginRight: 8, width: 8, height: 8, borderRadius: 4, background: 'orange' }}></span>
        </SimpleTooltip>}
        {item.title}
        <div>
          <TaxonDetailsLabel {...item} />
        </div>
      </div>
    );
  },
  getSuggestions: ({ q, siteConfig }: SuggestFnProps): SuggestResponseType => {
    const { cancel, promise } = fetchWithCancel(
      `${siteConfig.v1Endpoint}/species/suggest?limit=20&q=${q}`
    );
    const result = promise
      .then((res) => res.json())
      .then((data) => {
        return data.map((item: { key: string; scientificName: string }) => ({
          key: item?.key,
          title: item?.scientificName,
          ...item,
        }));
      });
    return { cancel, promise: result };
  },
};

export const gadGidSuggest = {
  getSuggestions: ({ q, siteConfig }: SuggestFnProps): SuggestResponseType => {
    const { cancel, promise } = fetchWithCancel(
      `${siteConfig.v1Endpoint}/geocode/gadm/search?limit=100&q=${q}`
    );
    const result = promise
      .then((res) => res.json())
      .then((data) => {
        return data.results.map(
          (item: { id: string; name: string; higherRegions?: { name: string }[] }) => ({
            ...item,
            key: item?.id,
            title: item?.name,
            description: item?.higherRegions && item?.higherRegions?.length > 0 && (
              <Classification style={{ opacity: 0.8 }}>
                {item.higherRegions.map((x) => (
                  <span>{x.name}</span>
                ))}
              </Classification>
            ),
          })
        );
      });
    return { cancel, promise: result };
  },
};

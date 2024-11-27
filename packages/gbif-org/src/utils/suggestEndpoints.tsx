import { SuggestFnProps, SuggestResponseType } from '@/components/filters/suggest';
import { CANCEL_REQUEST, fetchWithCancel } from './fetchWithCancel';
import { Classification } from '@/components/classification';
import { FormattedMessage } from 'react-intl';
import { GraphQLService } from '@/services/graphQLService';

export type SuggestionItem = {
  key: string;
  title: string;
  description?: string;
};

export function institutionKeySuggest({ q, siteConfig }: SuggestFnProps): SuggestResponseType {
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
}

export function collectionKeySuggest({ q, siteConfig }: SuggestFnProps): SuggestResponseType {
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
}

export function datasetKeySuggest({ q, siteConfig }: SuggestFnProps): SuggestResponseType {
  const { cancel, promise } = fetchWithCancel(
    `${siteConfig.v1Endpoint}/dataset/suggest?limit=20&q=${q}`
  );
  const result = promise.then((res) => res.json());
  return { cancel, promise: result };
}

export function datasetKeyOccurrenceSuggest({
  q,
  siteConfig,
  searchContext,
}: SuggestFnProps): SuggestResponseType {
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
}

export function publisherKeySuggest({ q, siteConfig }: SuggestFnProps): SuggestResponseType {
  const { cancel, promise } = fetchWithCancel(
    `${siteConfig.v1Endpoint}/organization/suggest?limit=20&q=${q}`
  );
  const result = promise.then((res) => res.json());
  return { cancel, promise: result };
}

export function publisherKeyOccurrenceSuggest({
  q,
  siteConfig,
  searchContext,
}: SuggestFnProps): SuggestResponseType {
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
}

export function networkKeySuggest({ q, siteConfig }: SuggestFnProps): SuggestResponseType {
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
}

function TaxonDetailsLabel(taxon) {
  const ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'].map(
    (rank, i) => {
      return taxon[rank] && rank !== taxon.rank.toLowerCase() ? (
        <span key={rank}>{taxon[rank]}</span>
      ) : null;
    }
  );

  return (
    <div style={{ maxWidth: '100%' }}>
      {taxon.status !== 'ACCEPTED' && (
        <div>
          <span className="g-px-1 g-text-xs g-rounded-lg g-bg-orange-400 g-text-white">
            <FormattedMessage id={`enums.taxonomicStatus.${taxon.status}`} />
          </span>
        </div>
      )}
      <div style={{ color: '#aaa', fontSize: '0.85em' }}>
        <Classification>{ranks}</Classification>
      </div>
    </div>
  );
}

export function taxonKeySuggest({ q, siteConfig }: SuggestFnProps): SuggestResponseType {
  const { cancel, promise } = fetchWithCancel(
    `${siteConfig.v1Endpoint}/species/suggest?limit=20&q=${q}`
  );
  const result = promise
    .then((res) => res.json())
    .then((data) => {
      return data.map((item: { key: string; scientificName: string }) => ({
        key: item?.key,
        title: item?.scientificName,
        description: <TaxonDetailsLabel {...item} />,
      }));
    });
  return { cancel, promise: result };
}

export function gadGidSuggest({ q, siteConfig }: SuggestFnProps): SuggestResponseType {
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
}

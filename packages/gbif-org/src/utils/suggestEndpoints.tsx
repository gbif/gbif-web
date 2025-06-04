import { Classification } from '@/components/classification';
import { SuggestFnProps, SuggestResponseType } from '@/components/filters/suggest';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { GraphQLService } from '@/services/graphQLService';
import { FormattedMessage } from 'react-intl';
import { CANCEL_REQUEST, fetchWithCancel } from './fetchWithCancel';
import { stringify } from './querystring';

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

export function TaxonDetailsLabel(taxon) {
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
        {item.status !== 'ACCEPTED' && (
          <SimpleTooltip
            title={
              <span>
                <FormattedMessage id={`enums.taxonomicStatus.${item.status}`} />
              </span>
            }
          >
            <span
              style={{
                display: 'inline-block',
                marginRight: 8,
                width: 8,
                height: 8,
                borderRadius: 4,
                background: 'orange',
              }}
            ></span>
          </SimpleTooltip>
        )}
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

export const taxonKeyVernacularSuggest = {
  placeholder: 'search.placeholders.default',
  // how to get the list of suggestion data
  getSuggestions: ({ q, siteConfig, currentLocale }: SuggestFnProps): SuggestResponseType => {
    const language = currentLocale.iso3LetterCode ?? 'eng';

    const abortController = new AbortController();
    const graphqlService = new GraphQLService({
      endpoint: siteConfig.graphqlEndpoint,
      abortSignal: abortController.signal,
      locale: 'en',
    });

    const SEARCH = `
      query($q: String, $language: Language, $datasetKey: ID) {
        taxonSuggestions( q: $q, language: $language, datasetKey: $datasetKey) {
          key
          scientificName
          vernacularName
          taxonomicStatus
          acceptedNameOf
          classification {
            name
          }
        }
      }    
    `;
    const promise = graphqlService.query(SEARCH, {
      q,
      language: language,
      datasetKey: siteConfig.vernacularNames?.datasetKey,
    });
    return {
      promise: promise
        .then((res) => res.json())
        .then((response) => {
          return response.data?.taxonSuggestions.map((i) => ({ ...i, title: i.scientificName }));
        }),
      cancel: () => abortController.abort(CANCEL_REQUEST),
    };
  },
  // how to map the results to a single string value
  // how to display the individual suggestions in the list
  render: (suggestion: SuggestionItem) => {
    const ranks = suggestion.classification.map((rank, i) => <span key={i}>{rank.name}</span>);

    return (
      <div style={{ maxWidth: '100%' }}>
        <div className="g-line-clamp-2">
          {suggestion.taxonomicStatus !== 'ACCEPTED' && (
            <span
              className="g-inline-block g-me-1 g-bg-orange-400 g-text-xs g-rounded g-px-0.5 g-text-white"
              style={{
                fontSize: '10px',
              }}
            >
              <FormattedMessage id={`enums.taxonomicStatus.${suggestion.taxonomicStatus}`} />
            </span>
          )}
          <span>{suggestion.scientificName}</span>
        </div>
        {suggestion.vernacularName && (
          <div className="g-text-slate-500 g-line-clamp-2 g-text-xs">
            <div>
              <FormattedMessage id="filterSupport.commonName" />:{' '}
              <span className="g-text-slate-500">{suggestion.vernacularName}</span>
            </div>
          </div>
        )}
        {!suggestion.vernacularName && suggestion.acceptedNameOf && (
          <div className="g-text-slate-500 g-line-clamp-2 g-text-xs">
            <div>
              <FormattedMessage id="filterSupport.acceptedNameOf" />:{' '}
              <span className="g-text-slate-500">{suggestion.acceptedNameOf}</span>
            </div>
          </div>
        )}
        <div className="g-text-slate-400 g-text-xs g-mt-1.5">
          <Classification>{ranks}</Classification>
        </div>
      </div>
    );
  },
};

export const gadGidSuggest = {
  getSuggestions: ({ q, siteConfig }: SuggestFnProps): SuggestResponseType => {
    const gadmSuggest = siteConfig?.suggest?.gadm;
    const extraParams = gadmSuggest?.type === 'PARAMS' ? stringify(gadmSuggest?.value ?? {}) : '';
    const { cancel, promise } = fetchWithCancel(
      `${siteConfig.v1Endpoint}/geocode/gadm/search?limit=100&q=${q}&${extraParams}`
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
              <Classification>
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
  render: function GadmGidSuggestItem(suggestion: SuggestionItem) {
    return (
      <div className="g-max-w-full">
        <div>{suggestion.title}</div>
        {suggestion?.higherRegions?.length > 0 && (
          <Classification className="g-text-slate-500">
            {suggestion.higherRegions.map((x) => (
              <span>{x.name}</span>
            ))}
          </Classification>
        )}
      </div>
    );
  },
};

export const institutionCodeSuggest = {
  getSuggestions: ({ q, siteConfig }: SuggestFnProps): SuggestResponseType => {
    const { cancel, promise } = fetchWithCancel(
      `${siteConfig.v1Endpoint}/occurrence/search/institutionCode?limit=100&q=${q}`
    );
    const result = promise
      .then((res) => res.json())
      .then((data) => {
        return data.map((item: string) => ({
          key: item,
          title: item,
        }));
      });
    return { cancel, promise: result };
  },
};

export const collectionCodeSuggest = {
  getSuggestions: ({ q, siteConfig }: SuggestFnProps): SuggestResponseType => {
    const { cancel, promise } = fetchWithCancel(
      `${siteConfig.v1Endpoint}/occurrence/search/collectionCode?limit=100&q=${q}`
    );
    const result = promise
      .then((res) => res.json())
      .then((data) => {
        return data.map((item: string) => ({
          key: item,
          title: item,
        }));
      });
    return { cancel, promise: result };
  },
};

export const recordNumberSuggest = {
  getSuggestions: ({ q, siteConfig }: SuggestFnProps): SuggestResponseType => {
    const { cancel, promise } = fetchWithCancel(
      `${siteConfig.v1Endpoint}/occurrence/search/recordNumber?limit=100&q=${q}`
    );
    const result = promise
      .then((res) => res.json())
      .then((data) => {
        return data.map((item: string) => ({
          key: item,
          title: item,
        }));
      });
    return { cancel, promise: result };
  },
};

// for use with vocabulary endpoints
export type VocabularyType = {
  name: string;
  label: { key: number; value: string; language: string }[];
};
function extractTitle(vocabularyLocale: string) {
  return (response: {
    data: {
      results: VocabularyType[];
    };
  }) => {
    // transform result labels to an object with language as keys
    const results = response?.results?.map((result) => {
      const labels = result.label.reduce((acc: Record<string, string>, label) => {
        acc[label.language] = label.value;
        return acc;
      }, {});
      return {
        ...result,
        title: labels[vocabularyLocale] || labels.en || result.name || 'Unknown',
      };
    });
    return { data: { ...response.data, results } };
  };
}

export const establishmentMeansSuggest = vocabularySuggest('EstablishmentMeans');
export const institutionDisciplineSuggest = vocabularySuggest('Discipline');
export const institutionTypeSuggest = vocabularySuggest('InstitutionType');
export const preservationTypeSuggest = vocabularySuggest('PreservationType');
export const pathwaySuggest = vocabularySuggest('Pathway');
export const degreeOfEstablishmentSuggest = vocabularySuggest('DegreeOfEstablishment');
export const collectionContentTypeSuggest = vocabularySuggest('CollectionContentType');
export const typeStatusSuggest = vocabularySuggest('TypeStatus');

function vocabularySuggest(vocabularyName: string) {
  return {
    getSuggestions: ({ q, siteConfig, currentLocale }: SuggestFnProps): SuggestResponseType => {
      const vocabularyLocale = currentLocale.vocabularyLocale ?? currentLocale.localeCode ?? 'en';
      const { cancel, promise } = fetchWithCancel(
        `${siteConfig.v1Endpoint}/vocabularies/${vocabularyName}/concepts?limit=100&q=${q}&lang=${vocabularyLocale}`
      );
      const result = promise
        .then((res) => res.json())
        .then(extractTitle(vocabularyLocale))
        .then((response) => {
          return response.data.results.map((item) => ({
            key: item.name,
            title: item.title,
          }));
        });
      return { cancel, promise: result };
    },
  };
}

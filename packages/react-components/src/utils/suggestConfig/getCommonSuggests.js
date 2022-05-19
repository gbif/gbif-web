import React from 'react';
import { matchSorter } from 'match-sorter';
import countryCodes from '../../enums/basic/country.json';
import { Classification, Tooltip } from '../../components';
import { FormattedMessage } from 'react-intl';

const BACKBONE_KEY = 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c';

export const suggestStyle = { whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' };

export function getCommonSuggests({ context, suggestStyle, rootPredicate }) {
  const { client, formatMessage } = context;
  
  const countries = countryCodes.map(code => ({
    title: formatMessage({ id: `enums.countryCode.${code}` }),
    key: code
  }));

  return {
    countryCode: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => {
        return {
          cancel: () => null,
          promise: (async () => {
            return {data: matchSorter(countries, q, {keys: ['title', 'key']})};
          })()
        }
      },
      // how to map the results to a single string value
      getValue: suggestion => suggestion.title,
      // how to display the individual suggestions in the list
      render: function CountrySuggestItem(suggestion) {
        return <div style={{}}>
          <div style={suggestStyle}>
            {suggestion.title}
          </div>
        </div>
      }
    },
    institutionCode: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => {
        const { promise, cancel } = client.v1Get(`/occurrence/search/institutionCode?limit=8&q=${q}`);
        return {
          promise: promise.then(response => ({
            data: response.data.map(i => ({ key: i, title: i }))
          })),
          cancel
        }
      },
      // how to map the results to a single string value
      getValue: suggestion => suggestion.title,
      // how to display the individual suggestions in the list
      render: function InstitutionCodeSuggestItem(suggestion) {
        return <div style={suggestStyle}>
            {suggestion.title}
          </div>
        
      }
    },
    establishmentMeans: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q, localeContext }) => {
        const vocabularyLocale = localeContext?.localeMap?.vocabulary || 'en';
        const { promise, cancel } = client.v1Get(`/vocabularies/EstablishmentMeans/concepts?limit=100&q=${q}&locale=${vocabularyLocale}`);
        return {
          promise: promise.then(response => ({
            data: response.data.results.map(i => ({ key: i.name, title: i.label[vocabularyLocale] || i.label.en }))
          })),
          cancel
        }
      },
      // how to map the results to a single string value
      getValue: suggestion => suggestion.title,
      // how to display the individual suggestions in the list
      render: function CatalogNumberSuggestItem(suggestion) {
        return <div style={suggestStyle}>
            {suggestion.title}
          </div>
      }
    },
    catalogNumber: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => {
        const { promise, cancel } = client.v1Get(`/occurrence/search/catalogNumber?limit=8&q=${q}`);
        return {
          promise: promise.then(response => ({
            data: response.data.map(i => ({ key: i, title: i }))
          })),
          cancel
        }
      },
      // how to map the results to a single string value
      getValue: suggestion => suggestion.title,
      // how to display the individual suggestions in the list
      render: function CatalogNumberSuggestItem(suggestion) {
        return <div style={suggestStyle}>
            {suggestion.title}
          </div>
      }
    },
    datasetKey: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => client.v1Get(`/dataset/suggest?limit=8&q=${q}`),
      // how to map the results to a single string value
      getValue: suggestion => suggestion.title,
      // how to display the individual suggestions in the list
      render: function DatasetSuggestItem(suggestion) {
        return <div style={{}}>
          <div style={suggestStyle}>
            {suggestion.title}
          </div>
        </div>
      }
    },
    datasetKeyFromOccurrenceIndex: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q, size = 100 }) => {
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
          "type": "like",
          "key": "datasetTitle",
          "value": `*${q.replace(/\s/, '*')}*`
        }

        let predicate = qPredicate;
        if (rootPredicate) {
          predicate = {
            type: 'and',
            predicates: [rootPredicate, qPredicate]
          }
        }
        const variables = {
          size,
          predicate
        };
        const { promise, cancel } = client.query({ query: SEARCH, variables });
        return {
          promise: promise.then(response => {
            return {
              data: response.data?.occurrenceSearch?.facet?.datasetKey.map(i => ({ ...i, title: i.dataset.title })),
              rawData: response.data
            }
          }),
          cancel
        }
      },
      // how to map the results to a single string value
      getValue: suggestion => suggestion.title,
      // how to display the individual suggestions in the list
      render: function DatasetSuggestItem(suggestion) {
        return <div style={suggestStyle}>
          {suggestion.title}
          {/* <div style={{ fontSize: '0.85em', color: '#aaa' }}>{suggestion.count} results</div> */}
        </div>
      }
    },
    publisherKey: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => client.v1Get(`/organization/suggest?limit=8&q=${q}`),
      // how to map the results to a single string value
      getValue: suggestion => suggestion.title,
      // how to display the individual suggestions in the list
      render: function PublisherSuggestItem(suggestion) {
        return <div style={{ maxWidth: '100%' }}>
          <div style={suggestStyle}>
            {suggestion.title}
          </div>
        </div>
      }
    },
    publisherKeyFromOccurrenceIndex: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q, size = 100 }) => {
        const SEARCH = `
          query keywordSearch($predicate: Predicate, $size: Int){
            occurrenceSearch(predicate: $predicate) {
              facet {
                publishingOrg(size: $size) {
                  key
                  publisher {
                    title
                  }
                }
              }
            }
          }
          `;
        const qPredicate = {
          "type": "like",
          "key": "publisherTitle",
          "value": `*${q.replace(/\s/, '*')}*`
        }

        let predicate = qPredicate;
        if (rootPredicate) {
          predicate = {
            type: 'and',
            predicates: [rootPredicate, qPredicate]
          }
        }
        const variables = {
          size,
          predicate
        };
        const { promise, cancel } = client.query({ query: SEARCH, variables });
        return {
          promise: promise.then(response => {
            return {
              data: response.data?.occurrenceSearch?.facet?.publishingOrg.map(i => ({ ...i, title: i.publisher.title })),
              rawData: response.data
            }
          }),
          cancel
        }
      },
      // how to map the results to a single string value
      getValue: suggestion => suggestion.title,
      // how to display the individual suggestions in the list
      render: function PublisherSuggestItem(suggestion) {
        return <div style={suggestStyle}>
          {suggestion.title}
          {/* <div style={{ fontSize: '0.85em', color: '#aaa' }}>{suggestion.count} results</div> */}
        </div>
      }
    },
    taxonKey: {
      //What placeholder to show
      // placeholder: 'Search by scientific name',
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => client.v1Get(`/species/suggest?datasetKey=${BACKBONE_KEY}&limit=20&q=${q}`),
      // how to map the results to a single string value
      getValue: suggestion => suggestion.scientificName,
      // how to display the individual suggestions in the list
      render: function ScientificNameSuggestItem(suggestion) {
        const ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'].map((rank, i) => {
            return suggestion[rank] && rank !== suggestion.rank.toLowerCase() ? <span key={rank}>{suggestion[rank]}</span> : null;
          });

        return <div style={{ maxWidth: '100%'}}>
          <div style={suggestStyle}>
          {suggestion.status !== 'ACCEPTED' && <Tooltip title={<span><FormattedMessage id={`enums.taxonomicStatus.${suggestion.status}`} /></span>}>
              <span style={{display: 'inline-block', marginRight: 8, width: 8, height: 8, borderRadius: 4, background: 'orange'}}></span>
            </Tooltip>}
            {suggestion.scientificName}
          </div>
          <div style={{ color: '#aaa', fontSize: '0.85em' }}>
            <Classification>
              {ranks}
            </Classification>
          </div>
        </div>
      }
    },
    recordedBy: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => {
        const { promise, cancel } = client.v1Get(`/occurrence/search/recordedBy?limit=8&q=${q}`);
        return {
          promise: promise.then(response => ({
            data: response.data.map(i => ({ key: i, title: i }))
            })),
          cancel
        }
      },
      // how to map the results to a single string value
      getValue: suggestion => suggestion.title,
      // how to display the individual suggestions in the list
      render: function RecordedBySuggestItem(suggestion) {
        return <div style={suggestStyle}>
          {suggestion.title}
        </div>
      }
    },
    recordedByWildcard: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q, size = 100 }) => {
        const SEARCH = `
          query keywordSearch($predicate: Predicate, $size: Int){
            occurrenceSearch(predicate: $predicate) {
              facet {
                recordedBy(size: $size) {
                  key
                  count
                }
              }
            }
          }
          `;
        const qPredicate = {
          "type": "like",
          "key": "recordedBy",
          "value": q
        }
        let predicate = qPredicate;
        if (rootPredicate) {
          predicate = {
            type: 'and',
            predicates: [rootPredicate, qPredicate]
          }
        }
        const variables = {
          size,
          predicate,
          include
        };
        const {promise, cancel} = client.query({query: SEARCH, variables});
        return {
          promise: promise.then(response => {
            return {
              data: response.data?.occurrenceSearch?.facet?.recordedBy.map(i => ({ ...i, title: i.key })),
              rawData: response.data
            }
          }),
          cancel
        }
      },
      // how to map the results to a single string value
      getValue: suggestion => suggestion.title,
      // how to display the individual suggestions in the list
      render: function RecordedBySuggestItem(suggestion) {
        return <div style={suggestStyle}>
            {suggestion.title}
            <div style={{fontSize: '0.85em', color: '#aaa'}}>{suggestion.count} results</div>
          </div>
      }
    },
    recordNumber: {
    //What placeholder to show
    placeholder: 'search.placeholders.default',
    // how to get the list of suggestion data
    getSuggestions: ({ q }) => {
      const { promise, cancel } = client.v1Get(`/occurrence/search/recordNumber?limit=8&q=${q}`);
      return {
        promise: promise.then(response => ({
          data: response.data.map(i => ({ key: i, title: i }))
        })),
        cancel
      }
    },
    // how to map the results to a single string value
    getValue: suggestion => suggestion.title,
    // how to display the individual suggestions in the list
    render: function RecordNumberSuggestItem(suggestion) {
      return <div style={suggestStyle}>
          {suggestion.title}
        </div>
      
    }
  },
  gadmGid: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => {
        const { promise, cancel } = client.v1Get(`/geocode/gadm/search?limit=100&q=${q}`);
        return {
          promise: promise.then(response => {
            return {
              data: response.data.results.map(x => ({title: x.name, key: x.id, ...x}))
            }
          }),
          cancel
        }
      },
      // how to map the results to a single string value
      getValue: suggestion => suggestion.title,
      // how to display the individual suggestions in the list
      render: function GadmGidSuggestItem(suggestion) {
        return <div style={ { maxWidth: '100%' } }>
          <div style={suggestStyle}>
            {suggestion.title}
          </div>
          {suggestion?.higherRegions?.length > 0 && <Classification style={{opacity: .8}}>
            {suggestion.higherRegions.map(x => <span>{x.name}</span>)}
          </Classification>}
        </div>
      }
    },
    institutionKey: {
    //What placeholder to show
    placeholder: 'search.placeholders.default',
    // how to get the list of suggestion data
    getSuggestions: ({ q }) => {
      const { promise, cancel } = client.v1Get(`/grscicoll/institution/suggest?limit=8&q=${q}`);
      return {
        promise: promise.then(response => ({
          data: response.data.map(i => ({ title: i.name, ...i }))
        })),
        cancel
      }
    },
    // how to map the results to a single string value
    getValue: suggestion => suggestion.title,
    // how to display the individual suggestions in the list
    render: function institutionKeySuggestItem(suggestion) {
      return <div style={suggestStyle}>
          {suggestion.title}
          <div>Code: {suggestion.code}</div>
        </div>
      
    }
  },
  networkKey: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => client.v1Get(`/network/suggest?limit=20&q=${q}`),
      // how to map the results to a single string value
      getValue: suggestion => suggestion.title,
      // how to display the individual suggestions in the list
      render: function NetworkKeySuggestItem(suggestion) {
        return <div style={ { maxWidth: '100%' } }>
          <div style={suggestStyle}>
            {suggestion.title}
          </div>
        </div>
      }
    },
    // -- Add suggests above this line (required by plopfile.js) --
  }
}
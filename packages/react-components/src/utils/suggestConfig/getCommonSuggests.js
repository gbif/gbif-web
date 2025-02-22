import { matchSorter } from 'match-sorter';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Classification, Tooltip } from '../../components';
import countryCodes from '../../enums/basic/country.json';

const BACKBONE_KEY = 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c';

export const suggestStyle = {
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  width: '100%',
  overflow: 'hidden',
};

export function getCommonSuggests({ context, suggestStyle, rootPredicate }) {
  const { client, formatMessage } = context;

  const countries = countryCodes.map((code) => ({
    title: formatMessage({ id: `enums.countryCode.${code}` }),
    key: code,
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
            return { data: matchSorter(countries, q, { keys: ['title', 'key'] }) };
          })(),
        };
      },
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function CountrySuggestItem(suggestion) {
        return (
          <div style={{}}>
            <div style={suggestStyle}>{suggestion.title}</div>
          </div>
        );
      },
    },
    institutionCode: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => {
        const { promise, cancel } = client.v1Get(
          `/occurrence/search/institutionCode?limit=8&q=${q}`,
        );
        return {
          promise: promise.then((response) => ({
            data: response.data.map((i) => ({ key: i, title: i })),
          })),
          cancel,
        };
      },
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function InstitutionCodeSuggestItem(suggestion) {
        return <div style={suggestStyle}>{suggestion.title}</div>;
      },
    },
    establishmentMeans: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q, localeContext }) => {
        const vocabularyLocale = localeContext?.localeMap?.vocabulary || 'en';
        const { promise, cancel } = client.v1Get(
          `/vocabularies/EstablishmentMeans/concepts?limit=100&q=${q}&lang=${vocabularyLocale}`,
        );
        return {
          promise: promise.then(extractTitle(vocabularyLocale)).then((response) => ({
            data: response.data.results.map((i) => ({ key: i.name, title: i.title })),
          })),
          cancel,
        };
      },
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function CatalogNumberSuggestItem(suggestion) {
        return <div style={suggestStyle}>{suggestion.title}</div>;
      },
    },
    typeStatusVocab: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q, localeContext }) => {
        const vocabularyLocale = localeContext?.localeMap?.vocabulary || 'en';
        const { promise, cancel } = client.v1Get(
          `/vocabularies/TypeStatus/concepts?limit=100&q=${q}&lang=${vocabularyLocale}`,
        );
        return {
          promise: promise.then(extractTitle(vocabularyLocale)).then((response) => ({
            data: response.data.results.map((i) => ({ key: i.name, title: i.title })),
          })),
          cancel,
        };
      },
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function CatalogNumberSuggestItem(suggestion) {
        return <div style={suggestStyle}>{suggestion.title}</div>;
      },
    },
    preservationType: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q, localeContext }) => {
        const vocabularyLocale = localeContext?.localeMap?.vocabulary || 'en';
        const { promise, cancel } = client.v1Get(
          `/vocabularies/PreservationType/concepts?limit=100&q=${q}&lang=${vocabularyLocale}`,
        );
        return {
          promise: promise.then(extractTitle(vocabularyLocale)).then((response) => ({
            data: response.data.results.map((i) => ({ key: i.name, title: i.title })),
          })),
          cancel,
        };
      },
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function CatalogNumberSuggestItem(suggestion) {
        return <div style={suggestStyle}>{suggestion.title}</div>;
      },
    },
    discipline: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q, localeContext }) => {
        const vocabularyLocale = localeContext?.localeMap?.vocabulary || 'en';
        const { promise, cancel } = client.v1Get(
          `/vocabularies/Discipline/concepts?limit=100&q=${q}&lang=${vocabularyLocale}`,
        );
        return {
          promise: promise.then(extractTitle(vocabularyLocale)).then((response) => ({
            data: response.data.results.map((i) => ({ key: i.name, title: i.title })),
          })),
          cancel,
        };
      },
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function CatalogNumberSuggestItem(suggestion) {
        return <div style={suggestStyle}>{suggestion.title}</div>;
      },
    },
    institutionType: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q, localeContext }) => {
        const vocabularyLocale = localeContext?.localeMap?.vocabulary || 'en';
        const { promise, cancel } = client.v1Get(
          `/vocabularies/InstitutionType/concepts?limit=100&q=${q}&lang=${vocabularyLocale}`,
        );
        return {
          promise: promise.then(extractTitle(vocabularyLocale)).then((response) => ({
            data: response.data.results.map((i) => ({ key: i.name, title: i.title })),
          })),
          cancel,
        };
      },
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function CatalogNumberSuggestItem(suggestion) {
        return <div style={suggestStyle}>{suggestion.title}</div>;
      },
    },
    collectionContentType: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q, localeContext }) => {
        const vocabularyLocale = localeContext?.localeMap?.vocabulary || 'en';
        const { promise, cancel } = client.v1Get(
          `/vocabularies/CollectionContentType/concepts?limit=100&q=${q}&lang=${vocabularyLocale}`,
        );
        return {
          promise: promise.then(extractTitle(vocabularyLocale)).then((response) => ({
            data: response.data.results.map((i) => ({ key: i.name, title: i.title })),
          })),
          cancel,
        };
      },
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function CatalogNumberSuggestItem(suggestion) {
        return <div style={suggestStyle}>{suggestion.title}</div>;
      },
    },
    eventType: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q, localeContext }) => {
        const vocabularyLocale = localeContext?.localeMap?.vocabulary || 'en';
        // const { promise, cancel } = client.v1Get(`/vocabularies/EventType/concepts?limit=100&q=${q}&locale=${vocabularyLocale}`);
        const { promise, cancel } = client.v1Get(
          `/vocabularies/EventType/concepts/suggest?limit=100&q=${q}&locale=${vocabularyLocale}`,
        );
        return {
          promise: promise.then((response) => ({
            // data: response.data.results.map(i => ({ key: i.name, title: i.label[vocabularyLocale] || i.label.en }))
            data: response.data.map((i) => ({
              key: i.name,
              title: i.label[vocabularyLocale] || i.label.en,
            })),
          })),
          cancel,
        };
      },
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function CatalogNumberSuggestItem(suggestion) {
        return <div style={suggestStyle}>{suggestion.title}</div>;
      },
    },
    catalogNumber: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => {
        const { promise, cancel } = client.v1Get(`/occurrence/search/catalogNumber?limit=8&q=${q}`);
        return {
          promise: promise.then((response) => ({
            data: response.data.map((i) => ({ key: i, title: i })),
          })),
          cancel,
        };
      },
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function CatalogNumberSuggestItem(suggestion) {
        return <div style={suggestStyle}>{suggestion.title}</div>;
      },
    },
    datasetKey: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => client.v1Get(`/dataset/suggest?limit=8&q=${q}`),
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function DatasetSuggestItem(suggestion) {
        return (
          <div style={{}}>
            <div style={suggestStyle}>{suggestion.title}</div>
          </div>
        );
      },
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
          type: 'like',
          key: 'datasetTitle',
          value: `*${q.replace(/\s/, '*')}*`,
        };

        let predicate = qPredicate;
        if (rootPredicate) {
          predicate = {
            type: 'and',
            predicates: [rootPredicate, qPredicate],
          };
        }
        const variables = {
          size,
          predicate,
        };
        const { promise, cancel } = client.query({ query: SEARCH, variables });
        return {
          promise: promise.then((response) => {
            return {
              data: response.data?.occurrenceSearch?.facet?.datasetKey.map((i) => ({
                ...i,
                title: i.dataset.title,
              })),
              rawData: response.data,
            };
          }),
          cancel,
        };
      },
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function DatasetSuggestItem(suggestion) {
        return (
          <div style={suggestStyle}>
            {suggestion.title}
            {/* <div style={{ fontSize: '0.85em', color: '#aaa' }}>{suggestion.count} results</div> */}
          </div>
        );
      },
    },
    datasetKeyFromEventIndex: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q, size = 100 }) => {
        const SEARCH = `
          query keywordSearch($predicate: Predicate, $size: Int){
            eventSearch(predicate: $predicate) {
              facet {
                datasetKey(size: $size) {
                  key
                  count
                  datasetTitle
                }
              }
            }
          }
          `;
        const qPredicate = {
          type: 'like',
          key: 'datasetTitle',
          value: `*${q.replace(/\s/, '*')}*`,
        };

        let predicate = qPredicate;
        if (rootPredicate) {
          predicate = {
            type: 'and',
            predicates: [rootPredicate, qPredicate],
          };
        }
        const variables = {
          size,
          predicate,
        };
        const { promise, cancel } = client.query({ query: SEARCH, variables });
        return {
          promise: promise.then((response) => {
            return {
              data: response.data?.eventSearch?.facet?.datasetKey.map((i) => ({
                ...i,
                title: i.datasetTitle,
              })),
              rawData: response.data,
            };
          }),
          cancel,
        };
      },
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function DatasetSuggestItem(suggestion) {
        return (
          <div style={suggestStyle}>
            {suggestion.title}
            {/* <div style={{ fontSize: '0.85em', color: '#aaa' }}>{suggestion.count} results</div> */}
          </div>
        );
      },
    },
    publisherKey: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => client.v1Get(`/organization/suggest?limit=8&q=${q}`),
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function PublisherSuggestItem(suggestion) {
        return (
          <div style={{ maxWidth: '100%' }}>
            <div style={suggestStyle}>{suggestion.title}</div>
          </div>
        );
      },
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
          type: 'like',
          key: 'publisherTitle',
          value: `*${q.replace(/\s/, '*')}*`,
        };

        let predicate = qPredicate;
        if (rootPredicate) {
          predicate = {
            type: 'and',
            predicates: [rootPredicate, qPredicate],
          };
        }
        const variables = {
          size,
          predicate,
        };
        const { promise, cancel } = client.query({ query: SEARCH, variables });
        return {
          promise: promise.then((response) => {
            return {
              data: response.data?.occurrenceSearch?.facet?.publishingOrg.map((i) => ({
                ...i,
                title: i.publisher.title,
              })),
              rawData: response.data,
            };
          }),
          cancel,
        };
      },
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function PublisherSuggestItem(suggestion) {
        return (
          <div style={suggestStyle}>
            {suggestion.title}
            {/* <div style={{ fontSize: '0.85em', color: '#aaa' }}>{suggestion.count} results</div> */}
          </div>
        );
      },
    },
    taxonKey: {
      //What placeholder to show
      // placeholder: 'Search by scientific name',
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) =>
        client.v1Get(`/species/suggest?datasetKey=${BACKBONE_KEY}&limit=20&q=${q}`),
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.scientificName,
      // how to display the individual suggestions in the list
      render: function ScientificNameSuggestItem(suggestion) {
        const ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'].map(
          (rank, i) => {
            return suggestion[rank] && rank !== suggestion.rank.toLowerCase() ? (
              <span key={rank}>{suggestion[rank]}</span>
            ) : null;
          },
        );

        return (
          <div style={{ maxWidth: '100%' }}>
            <div style={suggestStyle}>
              {suggestion.status !== 'ACCEPTED' && (
                <Tooltip
                  title={
                    <span>
                      <FormattedMessage id={`enums.taxonomicStatus.${suggestion.status}`} />
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
                </Tooltip>
              )}
              {suggestion.scientificName}
            </div>
            <div style={{ color: '#aaa', fontSize: '0.85em' }}>
              <Classification>{ranks}</Classification>
            </div>
          </div>
        );
      },
    },
    taxonKeyVernacular: {
      //What placeholder to show
      // placeholder: 'Search by scientific name',
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q, localeContext }) => {
        const language = localeContext?.localeMap?.iso3LetterCode ?? 'eng';
        const SEARCH = `
          query($q: String, $language: Language){
            taxonSuggestions( q: $q, language: $language) {
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
        const { promise, cancel } = client.query({
          query: SEARCH,
          variables: { q, language: language },
        });
        return {
          promise: promise.then((response) => {
            return {
              data: response.data?.taxonSuggestions.map((i) => i),
            };
          }),
          cancel,
        };
      },
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.scientificName,
      // how to display the individual suggestions in the list
      render: function ScientificNameSuggestItem(suggestion) {
        const ranks = suggestion.classification.map((rank, i) => <span key={i}>{rank.name}</span>);

        const commonNameTranslation = formatMessage({ id: `filterSupport.commonName` });
        const acceptedNameOfTranslation = formatMessage({ id: `filterSupport.acceptedNameOf` });

        return (
          <div style={{ maxWidth: '100%' }}>
            <div style={suggestStyle}>
              {suggestion.taxonomicStatus !== 'ACCEPTED' && (
                <Tooltip
                  title={
                    <span>
                      <FormattedMessage
                        id={`enums.taxonomicStatus.${suggestion.taxonomicStatus}`}
                      />
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
                </Tooltip>
              )}
              {suggestion.scientificName}
            </div>
            {suggestion.vernacularName && (
              <div style={{ marginBottom: 8, color: '#888', fontSize: '0.85em', lineHeight: 1.2 }}>
                <div>
                  {commonNameTranslation}:{' '}
                  <span style={{ color: '#555' }}>{suggestion.vernacularName}</span>
                </div>
              </div>
            )}
            {!suggestion.vernacularName && suggestion.acceptedNameOf && (
              <div style={{ marginBottom: 8, color: '#888', fontSize: '0.85em', lineHeight: 1.2 }}>
                <div>
                  {acceptedNameOfTranslation}:{' '}
                  <span style={{ color: '#555' }}>{suggestion.acceptedNameOf}</span>
                </div>
              </div>
            )}
            <div style={{ color: '#aaa', fontSize: '0.85em' }}>
              <Classification>{ranks}</Classification>
            </div>
          </div>
        );
      },
    },
    eventTaxonKey: {
      //What placeholder to show
      // placeholder: 'Search by scientific name',
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => client.esApiGet(`/event/suggest/taxonKey?q=${q}`),
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.scientificName,
      // how to display the individual suggestions in the list
      render: function ScientificNameSuggestItem(suggestion) {
        const ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'].map(
          (rank, i) => {
            return suggestion[rank] && rank !== suggestion.rank.toLowerCase() ? (
              <span key={rank}>{suggestion[rank]}</span>
            ) : null;
          },
        );

        return (
          <div style={{ maxWidth: '100%' }}>
            <div style={suggestStyle}>{suggestion.scientificName}</div>
            <div style={{ color: '#aaa', fontSize: '0.85em' }}>
              <Classification>{ranks}</Classification>
            </div>
          </div>
        );
      },
    },
    recordedBy: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => {
        const { promise, cancel } = client.v1Get(`/occurrence/search/recordedBy?limit=8&q=${q}`);
        return {
          promise: promise.then((response) => ({
            data: response.data.map((i) => ({ key: i, title: i })),
          })),
          cancel,
        };
      },
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function RecordedBySuggestItem(suggestion) {
        return <div style={suggestStyle}>{suggestion.title}</div>;
      },
    },
    recordedByWildcard: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q, size = 100 }) => {
        const SEARCH = `
          query keywordSearch($predicate: Predicate, $size: Int, $include: String){
            occurrenceSearch(predicate: $predicate) {
              facet {
                recordedBy(size: $size, include: $include) {
                  key
                  count
                }
              }
            }
          }
          `;
        const qPredicate = {
          type: 'like',
          key: 'recordedBy',
          value: q,
        };
        let includePattern = q
          .replace(/\*/g, '.*')
          .replace(/\?/, '.')
          .replace(/([\?\+\|\{\}\[\]\(\)\"\\])/g, (m, p1) => '\\' + p1);
        includePattern = includePattern.toLowerCase();

        let predicate = qPredicate;
        if (rootPredicate) {
          predicate = {
            type: 'and',
            predicates: [rootPredicate, qPredicate],
          };
        }
        const variables = {
          size,
          predicate,
          include: includePattern,
        };
        const { promise, cancel } = client.query({ query: SEARCH, variables });
        return {
          promise: promise.then((response) => {
            return {
              data: response.data?.occurrenceSearch?.facet?.recordedBy.map((i) => ({
                ...i,
                title: i.key,
              })),
              rawData: response.data,
            };
          }),
          cancel,
        };
      },
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function RecordedBySuggestItem(suggestion) {
        return (
          <div style={suggestStyle}>
            {suggestion.title}
            <div style={{ fontSize: '0.85em', color: '#aaa' }}>{suggestion.count} results</div>
          </div>
        );
      },
    },
    recordNumber: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => {
        const { promise, cancel } = client.v1Get(`/occurrence/search/recordNumber?limit=8&q=${q}`);
        return {
          promise: promise.then((response) => ({
            data: response.data.map((i) => ({ key: i, title: i })),
          })),
          cancel,
        };
      },
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function RecordNumberSuggestItem(suggestion) {
        return <div style={suggestStyle}>{suggestion.title}</div>;
      },
    },
    gadmGid: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => {
        const { promise, cancel } = client.v1Get(`/geocode/gadm/search?limit=100&q=${q}`);
        return {
          promise: promise.then((response) => {
            return {
              data: response.data.results.map((x) => ({ title: x.name, key: x.id, ...x })),
            };
          }),
          cancel,
        };
      },
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function GadmGidSuggestItem(suggestion) {
        return (
          <div style={{ maxWidth: '100%' }}>
            <div style={suggestStyle}>{suggestion.title}</div>
            {suggestion?.higherRegions?.length > 0 && (
              <Classification style={{ opacity: 0.8 }}>
                {suggestion.higherRegions.map((x) => (
                  <span>{x.name}</span>
                ))}
              </Classification>
            )}
          </div>
        );
      },
    },
    institutionKey: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => {
        const { promise, cancel } = client.v1Get(
          `/grscicoll/search?entityType=INSTITUTION&displayOnNHCPortal=true&limit=8&q=${q}`,
        );
        return {
          promise: promise.then((response) => ({
            data: response.data.map((i) => ({ title: i.name, ...i })),
          })),
          cancel,
        };
      },
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function institutionKeySuggestItem(suggestion) {
        return (
          <div style={suggestStyle}>
            {suggestion.title}
            <div>Code: {suggestion.code}</div>
          </div>
        );
      },
    },
    collectionKey: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => {
        const { promise, cancel } = client.v1Get(
          `/grscicoll/search?entityType=COLLECTION&displayOnNHCPortal=true&limit=8&q=${q}`,
        );
        return {
          promise: promise.then((response) => ({
            data: response.data.map((i) => ({ title: i.name, ...i })),
          })),
          cancel,
        };
      },
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function CollectionKeySuggestItem(suggestion) {
        return (
          <div style={suggestStyle}>
            {suggestion.title}
            <div>Code: {suggestion.code}</div>
          </div>
        );
      },
    },
    networkKey: {
      //What placeholder to show
      placeholder: 'search.placeholders.default',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => client.v1Get(`/network/suggest?limit=20&q=${q}`),
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function NetworkKeySuggestItem(suggestion) {
        return (
          <div style={{ maxWidth: '100%' }}>
            <div style={suggestStyle}>{suggestion.title}</div>
          </div>
        );
      },
    },
    eventLocationId: {
      //What placeholder to show
      placeholder: 'search.placeholders.locationID',
      // how to get the list of suggestion data
      getSuggestions: ({ q, size = 100 }) => {
        const SEARCH = `
          query keywordSearch($predicate: Predicate, $size: Int){
            eventSearch(predicate: $predicate) {
              facet {
                locationID(size: $size) {
                  key
                  count
                }
              }
            }
          }
          `;
        const qPredicate = {
          type: 'like',
          key: 'locationID',
          value: `*${q.replace(/\s/, '*')}*`,
        };

        let predicate = qPredicate;
        if (rootPredicate) {
          predicate = {
            type: 'and',
            predicates: [rootPredicate, qPredicate],
          };
        }
        const variables = {
          size,
          predicate,
        };
        const { promise, cancel } = client.query({ query: SEARCH, variables });
        return {
          promise: promise.then((response) => {
            return {
              data: response.data?.eventSearch?.facet?.locationID.map((i) => ({
                ...i,
                title: i.key,
              })),
              rawData: response.data,
            };
          }),
          cancel,
        };
      },
      // how to map the results to a single string value
      getValue: (suggestion) => suggestion.title,
      // how to display the individual suggestions in the list
      render: function LocationIdSuggestItem(suggestion) {
        return (
          <div style={suggestStyle}>
            {suggestion.title}
            <div style={{ fontSize: '0.85em', color: '#aaa' }}>{suggestion.count} results</div>
          </div>
        );
      },
    },
    // -- Add suggests above this line (required by plopfile.js) --
  };
}

const extractTitle = (vocabularyLocale) => {
  return (response) => {
    // transform result labels to an object with language as keys
    const results = response.data.results.map((result) => {
      const labels = result.label.reduce((acc, label) => {
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
};

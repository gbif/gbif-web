// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState, useContext } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Layout from './Layout';
import { FilterState } from "../../widgets/Filter/state";
import { Root } from "../../components";
import OccurrenceContext from './config/OccurrenceContext';
import { ApiContext } from '../../dataManagement/api';
import { commonLabels, config2labels } from '../../utils/labelMaker';
import { getCommonSuggests, suggestStyle } from '../../utils/suggestConfig/getCommonSuggests';
import { commonFilters, filterBuilder } from '../../utils/filterBuilder';
import predicateConfig from './config/predicateConfig';
// import history from './history';
// import qs from 'querystringify';

// merge with hardcoded. A configuration for how to transform a filter to a predicate
const filter2predicate_custom = {
  // filterHandle: {defaultKey: string, defaultType: string, transformValue: function}
  // better documentation for how this could/should be configured and what the defaults and fallbacks are
  // defaultKey: what predicate type will be used if nothing else defined
  // defaultType: what predicate type will be used if nothing else defined
  // transformValue: an optional function to transform the values with before turning into a predicate
  taxonKey: {
    defaultKey: 'taxonKey'
  },
  year: {
    defaultType: 'equals'
  },
  basisOfRecord: {
    transformValue: x => enum_case(x)
  },
  geometry: {
    defaultType: 'within'
  },
  myFieldMustHaveValueFilter: {
    transformValue: x => ({ type: 'isNotNull', key: x })
  }
}

// custom suggest endpoints
const suggestConfig_custom = {
  /*
  suggestHandle: {
    placeholder: string with translation path
    endpointTemplate: func (q, apis) => string that should be fetched GET
    getValue: func(suggestion) return value - how to get a display value from a suggestion result
    render: component. will be used to display the individual suggesitons in the dropdown. the props are the suggestion
  }
  */
  datasetTitle: {
    //What placeholder to show
    placeholder: 'Search by dataset', // this should be a translations string
    // how to get the list of suggestion data
    endpointTemplate: (q, apis) => `${apis.v1}/dataset/suggest?limit=8&q=${q}`,
    // how to map the results to a single string value
    getValue: suggestion => suggestion.title,
    // how to display the individual suggestions in the list
    render: function DatasetSuggestItem(suggestion) {
      return <div style={{ maxWidth: '100%' }}>
        <div style={suggestStyle}>
          {suggestion.title}
        </div>
      </div>
    }
  }
}

const filterWidgets_custom = {
  // all filters must have a button and a widget/popover
  taxonKey: {
    type: 'AUTOCOMPLETE',
    config: {
      filterHandle: 'taxonKey', // what filter does the widget manage
      id2labelHandle: 'taxonKey', // define how to show a human readable label for values
      suggestHandle: 'scientificName', // what suggest config to use for the autocomplete
      filterCounts: 'filter.taxonKey.counts', // translation path to display names with counts. e.g. "3 scientific names"
      filterName: 'filter.taxonKey.name',// translation path to a title for the popover and the button
      filterDescription: 'filter.taxonKey.description', // translation path for the filter description
      hasOptionDescriptions: true // add menu item to toggle option help texts
    }
  },
  basisOfRecord: {
    type: 'FIXED_OPTIONS',
    config: {
      filterHandle: 'basisOfRecord',
      id2labelHandle: 'basisOfRecord',
      ariaLabel: 'widgets.taxonKey.buttonAction',
      filterCounts: 'filter.bor.counts',
      title: 'filter.bor.name',
      description: 'filter.bor.description',
      hasOptionDescriptions: true,
      options: {
        type: 'FIXED_LIST', // FIXED_LIST | ENDPOINT | GQL | CUSTOM
        getList: lang => [{ label: 'Iagttagelse', id: 'OBSERVATION', desc: 'some desc' }],
        query: lang => `query{ui{filters{basisOfRecord(lang:${lang})}}}`,
        endpoint: (lang, api) => `${env.apiV1}/enumerations/basic/Country`,
        reduce: (results, lang) => result[lang], // optionally transform data returned from API
        custom: lang => [],
        cache: true, //is it okay to cache the response locally. In most cases it does not make sense to reload all the time for enumerations
      }
    }
  },
  subtrate: {
    type: 'FACET',
    config: {

    }
  },
  repatriated: {
    type: 'FIXED_OPTIONS',
    config: {
      singleSelect: true
    }
  },
  year: {
    type: 'NUMBER_RANGE',
    config: {}
  },
  eDna: {
    type: 'SEMI_CUSTOM', // do what you like within this popover and standard trigger button 
    config: {}
  },
  random: {
    type: 'CUSTOM',// escape hatch - do what you like
    config: {}
  }
}

const filterConfig = {
  // endpoint: 'http://labs.gbif.org:7011',
  // set root filter to data from naturalis
  // rootPredicate: { type: 'equals', key: 'publishingOrganizationKey', value: '396d5f30-dea9-11db-8ab4-b8a03c50a862' },
  rootPredicate: { type: 'in', key: 'taxonKey', values: [4, 5, 7] },
  defaultVisibleFilters: ['taxonKey', 'year'],
  filters: {
    test: {
      Button: props => <button>{JSON.stringify(props, null, 2)}</button>,
    }
  },
  customSuggests: {
    nameOfSuggest: {
      //config of suggest
    }
  },
  customFilters: {
    month: {
      // type of filter: VOCABULARY, SUGGEST, RANGE, ... CUSTOM_BASIC, CUSTOM
      type: 'VOCABULARY',
      // config specific for this type
      config: {
        getOptions: async ({ filters, locale }) => {
          return {
            options: [
              { name: '1', help: 'First month of the year', label: 'January' },
              { name: '2', help: 'Second month of the year', label: 'Febrary' },
              { name: '3', help: 'Third month of the year', label: 'March' },
            ],
            definition: 'What month did the occurrence take place',
            label: 'Month',
            hasOptionHelp: false
          }
        },
      },
      // how to map the filter to a query
      // predicateAdapter: {},
      // custom text for this filter
      translation: {
        en: {
          name: 'Month',
          count: '{num, plural, one {month} other {# months}}'
        }
      }
    },
    random: {
      type: 'CUSTOM',
      config: {
        content: ({ filter, theme }) => {
          return <>
            <h2>Custom random filter</h2>
            <pre>{JSON.stringify(filter, null, 2)}</pre>
            <button onClick={() => console.log('apply some filter')}>Add random filter</button>
          </>
        },
        displayName: ({ value, locale }) => { title: 'Test display name' },
      },
      translation: {
        en: {
          name: 'Month',
          count: '{num, plural, one {month} other {# months}}'
        }
      }
    }
  }
};

function buildConfig({ labelConfig, getSuggestConfig, filterWidgetConfig, customConfig }, context) {
  const { labels = {}, getSuggests = () => ({}), filters: customFilters = {}, adapters = {} } = customConfig;
  const mergedLabels = { ...labelConfig, ...labels };
  const mergedFilters = { ...filterWidgetConfig, ...customFilters };
  const suggestConfigMap = getSuggestConfig({ context, suggestStyle });
  const suggestConfigMapCustom = getSuggests({ client: context.client, suggestStyle });
  const mergedSuggest = { ...suggestConfigMap, ...suggestConfigMapCustom };
  const labelMap = config2labels(mergedLabels, context.client);
  const filters = filterBuilder({ filterWidgetConfig: mergedFilters, labelMap, suggestConfigMap: mergedSuggest, context });
  return {
    labelMap,
    suggestConfigMap,
    filters,
    defaultVisibleFilters: ['taxonKey', 'year', 'datasetKey', 'countryCode'],
    rootPredicate: { type: 'in', key: 'taxonKey', values: [4, 5, 7] },
    predicateConfig
  }
}

function OccurrenceSearch({ config: customConfig = {}, ...props }) {
  const [filter, setFilter] = useState({ must: { basisOfRecord: ['HUMAN_OBSERVATION'], taxonKey: [2609958] } });
  const apiContext = useContext(ApiContext);
  const { formatMessage } = useIntl();
  const [config] = useState(() => {
    return buildConfig({
      labelConfig: commonLabels,
      getSuggestConfig: getCommonSuggests,
      filterWidgetConfig: commonFilters,
      customConfig
    }, { client: apiContext, formatMessage });
  });

  console.log(config);
  //   console.log(`%c 
  //  ,_,
  // (O,O)
  // (   )  Powered by GBIF
  // -"-"-

  // All GBIF mediated data is freely available through our APIs. 
  // https://www.gbif.org/developer/summary

  // All GBIF source code is open source.
  // https://github.com/gbif

  // If your interest is the rendered HTML, then you might be developing a plugin. Let us know if you need custom markup, we would love to know what you are building.
  // helpdesk@gbif.org
  // `, 'color: green; font-weight: bold;');

  // const esQuery = compose(filter).build();

  // it is already wrapped in locale provider and an rtl provider and a theme provider.
  // add an api context, a prefilter and configuration of custom filters
  // the API context caries information about endpoints
  return (
    <Root>
      <OccurrenceContext.Provider value={config}>
        <FilterState filter={filter} onChange={setFilter}>
          <Layout config={config} {...props}></Layout>
        </FilterState>
      </OccurrenceContext.Provider>
    </Root>
  );
}

// OccurrenceSearch.propTypes = {
//   theme: PropTypes.object,
//   settings: PropTypes.object,
//   locale: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
//   messages: PropTypes.object
// };

export default OccurrenceSearch;
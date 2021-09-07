import React, { useContext, useState } from 'react';
import { useIntl } from 'react-intl';
import { ApiContext } from '../../dataManagement/api';
import { filterBuilder } from './filterBuilder';
import { FilterState } from '../../widgets/Filter/state'
import { config2labels, rangeOrEqualLabel } from '../labelMaker';
// import readme from './README.md';
// import { StyledProse } from '../../components/typography/StyledProse';

const labelConfig = {
  taxonKey: {
    type: 'GQL',
    query: `query label($id: ID!){
      taxon(key: $id) {
        formattedName
      }
    }`,
    transform: result => ({ title: result.data.taxon.formattedName }),
    isHtmlResponse: true
  },
  year: {
    type: 'CUSTOM',
    component: rangeOrEqualLabel('interval.year')
  },
  basisOfRecord: {
    type: 'TRANSLATION',
    template: id => `enums.basisOfRecord.${id}`
  },
}

function getSuggestConfig({ client }) {
  return {
    taxonKey: {
      //What placeholder to show
      placeholder: 'Search by scientific name',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => client.v1Get(`/species/suggest?limit=8&q=${q}`),
      // how to map the results to a single string value
      getValue: suggestion => suggestion.scientificName,
      // how to display the individual suggestions in the list
      render: function ScientificNameSuggestItem(suggestion) {
        return <div style={{ maxWidth: '100%' }}>
          <div>
            {suggestion.scientificName}
          </div>
          {/* <div style={{ color: '#aaa', fontSize: '0.85em' }}>
            <Classification taxon={suggestion} />
          </div> */}
        </div>
      }
    }
  }
}

const filterWidgetConfig = {
  taxonKey: {
    type: 'SUGGEST',
    config: {
      std: {
        filterHandle: 'taxonKey',// if nothing else provided, then this is the filterName used
        id2labelHandle: 'taxonKey',
        translations: {
          count: 'filter.taxonKey.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.taxonKey.name',// translation path to a title for the popover and the button
          description: 'filter.taxonKey.description', // translation path for the filter description
        },
      },
      specific: {
        suggestHandle: 'taxonKey',
      }
    }
  },
  year: {
    type: 'NUMBER_RANGE',
    config: {
      std: {
        filterHandle: 'year',
        id2labelHandle: 'year',
        translations: {
          count: 'filter.year.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.year.name',// translation path to a title for the popover and the button
          description: 'filter.year.description', // translation path for the filter description
        }
      },
      specific: {
        placeholder: 'search.placeholders.range'
      }
    }
  },
  basisOfRecord: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'basisOfRecord',
        id2labelHandle: 'basisOfRecord',
        translations: {
          count: 'filter.basisOfRecord.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.basisOfRecord.name',// translation path to a title for the popover and the button
        }
      },
      specific: {
        // options: ['HUMAN_OBSERVATION', 'OBSERVATION', 'LIVING_SPECIMEN'],
        options: [{key: 'HUMAN_OBSERVATION', desc: 'An observation made by a human being'}, {key: 'OBSERVATION'}, {key: 'LIVING_SPECIMEN'}],
        hasOptionDescriptions: true,
        showOptionHelp: true,
        description: 'filter.basisOfRecord.description', // translation path for the filter description
      }
    }
  },
  // lifeStage: {
  //   type: 'VOCAB',
  //   config: {
  //     std: {
  //       filterHandle: 'lifeStage',
  //       id2labelHandle: 'lifeStage',
  //       translations: {
  //         count: 'filter.lifeStage.count', // translation path to display names with counts. e.g. "3 scientific names"
  //         name: 'filter.lifeStage.name',// translation path to a title for the popover and the button
  //       }
  //     },
  //     specific: {
  //       options: [{key: 'HUMAN_OBSERVATION', desc: 'An observation made by a human being'}, {key: 'OBSERVATION'}, {key: 'LIVING_SPECIMEN'}],
  //       hasOptionDescriptions: true,
  //       showOptionHelp: true,
  //       description: 'filter.lifeStage.description', // translation path for the filter description
  //     }
  //   }
  // },
  recordedBy: {
    type: 'KEYWORD_SEARCH',
    config: {
      std: {
        filterHandle: 'recordedBy',
        id2labelHandle: 'recordedBy',
        translations: {
          count: 'filter.recordedBy.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'filter.recordedBy.name',// translation path to a title for the popover and the button
          description: 'filter.recordedBy.description', // translation path for the filter description
        }
      },
      specific: {
        searchHandle: 'recordedBy',
        query: `
          query keywordSearch($predicate: Predicate, $size: Int){
            occurrenceSearch(predicate: $predicate) {
              cardinality {
                recordedBy
              }
              facet {
                recordedBy(size: $size) {
                  key
                  count
                }
              }
            }
          }
        `,
        queryKey: 'recordedBy'
      }
    }
  }
}

function buildConfig({ labelConfig, getSuggestConfig, filterWidgetConfig }, context) {
  const labelMap = config2labels(labelConfig, context.client);
  const suggestConfigMap = getSuggestConfig({ client: context.client });
  const filters = filterBuilder({ filterWidgetConfig, labelMap, suggestConfigMap, context });
  return {
    labelMap,
    suggestConfigMap,
    filters
  }
}

// for reasons beyond me storybook cannot read context in its main story. you have to nest it in a component
export const Example = () => <ExampleNested />

const ExampleNested = () => {
  const [filter, setFilter] = useState({ must: {} });
  const apiContext = useContext(ApiContext);
  const { formatMessage } = useIntl();
  const [config] = useState(() => {
    return buildConfig({
      labelConfig, getSuggestConfig, filterWidgetConfig
    }, { client: apiContext, formatMessage });
  });
  
  return <FilterState filter={filter} onChange={setFilter}>
    <config.filters.year.Button />
    <config.filters.taxonKey.Button />
    <config.filters.basisOfRecord.Button />
    {/* <config.filters.lifeStage.Button /> */}
    <config.filters.recordedBy.Button />
    <h2>Filter</h2>
    <pre>{JSON.stringify(filter, null, 2)}</pre>
  </FilterState>
}

Example.story = {
  name: 'Filter config',
};

export default {
  title: 'Utils/Filters from config',
};
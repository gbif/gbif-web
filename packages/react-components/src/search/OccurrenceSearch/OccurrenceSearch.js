// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState, useContext } from 'react';
import { useIntl, FormattedNumber } from 'react-intl';
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
import ThemeContext from '../../style/themes/ThemeContext';
import { IconFeatures } from '../../components';
import { useUrlState } from '../../dataManagement/state/useUrlState';


// import history from './history';
// import qs from 'querystringify';

const tableConfig = {
  columns: [
    {
      trKey: 'filter.taxonKey.name',
      filterKey: 'taxonKey', // optional
      value: {
        key: 'gbifClassification.usage.formattedName',
        formatter: (value, occurrence) => <span dangerouslySetInnerHTML={{ __html: value }}></span>
      },
      width: 'wide'
    },
    {
      trKey: 'tableHeaders.features',
      value: {
        key: 'features',
        formatter: (value, occurrence) => {
          return <IconFeatures iconsOnly
          stillImageCount={occurrence.stillImageCount}
          movingImageCount={occurrence.movingImageCount}
          soundCount={occurrence.soundCount}
          typeStatus={occurrence.typeStatus}
          isSequenced={occurrence.volatile.features.isSequenced}
          isTreament={occurrence.volatile.features.isTreament}
          isClustered={occurrence.volatile.features.isClustered}
          isSamplingEvent={occurrence.volatile.features.isSamplingEvent}
          issueCount={occurrence?.issues?.length}
        />
        }
      }
    },
    {
      trKey: 'filter.countryCode.name',
      filterKey: 'countryCode', //optional
      value: {
        key: 'countryCode',
        labelHandle: 'countryCode'
      }
    },
    {
      trKey: 'filter.coordinates.name',
      value: {
        key: 'coordinates',
        formatter: (value, occurrence) => {
          if (!occurrence.coordinates) return null;
          return <span>
            (<FormattedNumber value={occurrence.coordinates.lat} maximumSignificantDigits={4}/>, <FormattedNumber value={occurrence.coordinates.lon} maximumSignificantDigits={4}/>)
          </span>
        }
      }
    },
    {
      trKey: 'filter.year.name',
      filterKey: 'year', //optional
      value: {
        key: 'year'
      }
    },
    {
      trKey: 'filter.basisOfRecord.name',
      filterKey: 'basisOfRecord', //optional
      value: {
        key: 'basisOfRecord',
        labelHandle: 'basisOfRecord'
      }
    },
    {
      trKey: 'filter.datasetKey.name',
      filterKey: 'datasetKey', //optional
      value: {
        key: 'datasetTitle',
      },
      width: 'wide'
    }
  ]
};

function buildConfig({ labelConfig, getSuggestConfig, filterWidgetConfig, customConfig }, context) {
  const { 
    labels = {}, 
    getSuggests = () => ({}), 
    filters: customFilters = {}, 
    adapters = {} } = customConfig;
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
    defaultVisibleFilters: customConfig.defaultVisibleFilters || ['q', 'eventId', 'occurrenceIssue', 'taxonKey', 'year'],
    // rootPredicate: { type: 'in', key: 'basisOfRecord', values: ['PRESERVED_SPECIMEN', 'FOSSIL_SPECIMEN', 'MATERIAL_SAMPLE', 'LIVING_SPECIMEN'] },
    rootPredicate: customConfig.rootPredicate,//{ type: 'isNotNull', key: 'typeStatus' },
    // rootPredicate: { type: 'in', key: 'taxonKey', values: [4, 5, 7] },
    // rootPredicate: { type: 'equals', key: 'taxonKey', value: 44 },
    // rootPredicate: { type: 'and', predicates: [
    //   {type: 'equals', key: 'taxonKey', value: 44},
    //   {type: 'not', predicate: {type: 'equals', key: 'taxonKey', value: 212}}
    // ] },
    predicateConfig,
    tableConfig
  }
}

function OccurrenceSearch({ config: customConfig = {}, ...props }) {
  const theme = useContext(ThemeContext);
  const [filter, setFilter] = useUrlState({param: 'filter', base64encode: true});
  // const [filter, setFilter] = useState({ must: { taxonKey: [2609958] } });
  
  // let filter = { must: { taxonKey: [2609958] } };
  // const setFilter = () => {};

  console.log('filter from occ search', filter); 
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
    <Root dir={theme.dir}>
      <OccurrenceContext.Provider value={config}>
        <FilterState filter={filter || {}} onChange={setFilter}>
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
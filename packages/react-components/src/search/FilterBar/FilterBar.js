/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React, { useContext } from 'react';
import get from 'lodash/get';
import union from 'lodash/union';
import { withFilter } from '../../widgets/Filter/state';
import ThemeContext from '../../style/themes/ThemeContext';
import { Trigger as MetaFilter } from '../../widgets/Filter/types/MetaFilter';

// const availableFilters = [
//   taxonFilter, datasetFilter, publisherFilter,
//   borFilter, countryFilter, typeStatusFilter,
//   yearFilter, elevationFilter
// ];

/*
Would it make sense to split things more into seperate config files for more reuse
autocomplete on taxonKey is likely to be used for more than just filters I image
DisplayTitles are likely used many places (e.g. table cells, but then again we hope to use graphql to resolve the titles)

suggest configs are env specific. They should be generated from config/env

in other project I seperated filter config from widget config
so the filters would have a config with
  filterKey
    translations
    display names
    mapping to query
  
and a widget config that are used to set the filter. translations and displaynames might be reused.
dataset: {
  filterName: "dataset", // what filter should it set
  type: "FILTER", // what kind of filter (for gerenating the widget)
  title: "Dataset",
  description: "tx.path.description",
  component: props => (
    <FacetWidget {...props} filterID="dataset" suggestID="dataset" title="Dataset" description="What dataset should the occurrences come from"/>
  )
},

multiple widgets can edit the same filters. 
it makes sense to split filter presentation from widget configuration

// merge with custom filters/widgets/suggests
so given an occurrence config, then below is generated and made available through context?

a generic query composer that takes a config and a filter, to generate the queries needed.

filterConfig:
  key
  how to map to query
  how to present to user (values, filter title, counts)

suggestConfig:
  key
  endpoint,
  getValue,
  render,
  placeholder

filterWidgetConfig: 
  type: vocabulary | suggest | location | ...
  config: { specific per type } // many values are probably shared. such as title, aboutText etc.
  popover component?
  button component (using filterConfig)

displayTitles:
  how to display values (taxonKey:1, basisOfRecord:observation)
  is this used elsewhere than filters? I guess it could, but would be nice not having to.
  at some point, this might be extendable/configurable as well.

these filter buttons should show
to create triggerButton, we need the filterConfig (filterName, trKeys, DisplayName)

wrap them


Even in its simplest form we need a component to set filters
a config for how to transform it to a query
a config for how to display its values/names

when creating a custom filter, it would be useful to be able to add everything in one place
custom filter
translations
predicateMapping
{
  filter: {
    type,
    config
  },
  translations: {
    name
    count
  }
}
*/

function getVisibleFilters(currentFilter, commonFilters) {
  const visibleFilters = union(commonFilters,
    Object.keys(get(currentFilter, 'must', {})),
    Object.keys(get(currentFilter, 'must_not', {})));
  return visibleFilters;
}

const FilterBar = ({
  className = '',
  config,
  filter,
  ...props
}) => {
  const theme = useContext(ThemeContext);
  const prefix = theme.prefix || 'gbif';
  const elementName = 'filterBar';

  const visibleFilters = getVisibleFilters(filter, config.defaultVisibleFilters);
  const availableFilters = visibleFilters.map(x => config.filters[x]);
  return <div className={`${className} ${prefix}-${elementName}`} css={css`${style(theme)}`} {...props}>
    {availableFilters.map((x, i) => {
      if (!x) return null; // if no widget is defined for this filter, then do not show anything
      return <x.Button key={i} />
    })}
    <div>
      <MetaFilter />
    </div>
  </div>
}

FilterBar.propTypes = {
}

export const style = (theme) => css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  >div {
    max-width: 100%;
    margin-right: 4px; 
    margin-bottom: 4px;
  }
`;

const mapContextToProps = ({ filter }) => ({ filter });
export default withFilter(mapContextToProps)(FilterBar);
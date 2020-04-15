import React, { useContext, useCallback } from "react";
import PropTypes from 'prop-types';
// import { useIntl } from 'react-intl';
import { FormattedMessage } from 'react-intl';
import { FilterButton } from '../../../components/Button';
import FilterContext from './state/FilterContext';
import displayValue from '../displayNames/displayValue';

export const TriggerButton = React.forwardRef(({ options, filterName, displayValueAs, loading, ...props }, ref) => {
  const currentFilterContext = useContext(FilterContext);
  // const {formatMessage: f} = useIntl();
  
  const onClear = useCallback(() => {
    currentFilterContext.setField(filterName, [])
  },
  [currentFilterContext, filterName]);
  
  const DisplayValue = displayValue(displayValueAs || filterName).component;
  
  return <FilterButton 
    loading={loading} 
    isActive={options.length > 0}
    onClearRequest={onClear}
    {...props}
    >
      {options.length === 1 ? 
        <DisplayValue id={options[0]} /> : 
        <FormattedMessage
          id={`${options.length === 0 ? 'filterName' : 'filterCount'}.${filterName}`}
          defaultMessage={'Loading'}
          values={{ num: options.length }}
        />
          // f({id: `filterName.${filterName}`}) : 
          // f({id: `filterCount.${filterName}`}, {num: options.length})
      }
    </FilterButton>
});

TriggerButton.displayName = 'TriggerButton';
TriggerButton.propTypes = {
  options: PropTypes.array,
  loading: PropTypes.bool,
  filterName: PropTypes.string,
  displayValueAs: PropTypes.string,
}
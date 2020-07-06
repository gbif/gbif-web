import React, { useContext, useCallback } from "react";
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FilterButton } from '../../../components/Button';
import { FilterContext } from '../state';

export const TriggerButton = React.forwardRef(({ options, filterHandle, translations = {}, DisplayName, loading, ...props }, ref) => {
  const currentFilterContext = useContext(FilterContext);
  const { 
    count = `filter.${filterHandle}.count`, 
    name = `filter.${filterHandle}.name` } = translations;

  const onClear = useCallback(() => {
    currentFilterContext.setField(filterHandle, [])
  },
    [currentFilterContext, filterHandle]);

  return <FilterButton
    loading={loading}
    isActive={options.length > 0}
    onClearRequest={onClear}
    ref={ref}
    {...props}
  >
    {options.length === 1 ?
      <DisplayName id={options[0]} /> :
      <FormattedMessage
        id={options.length === 0 ? name : count}
        // defaultMessage={`[${filterHandle}]`}
        values={{ num: options.length }}
      />
    }
  </FilterButton>
});

TriggerButton.displayName = 'TriggerButton';
TriggerButton.propTypes = {
  options: PropTypes.array,
  loading: PropTypes.bool,
  filterName: PropTypes.string,
  DisplayName: PropTypes.any,
}
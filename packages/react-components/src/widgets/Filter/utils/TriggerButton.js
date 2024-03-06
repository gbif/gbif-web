import { css, jsx } from '@emotion/react';
import React, { useContext, useCallback } from "react";
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FilterButton } from '../../../components/Button';
import { FilterContext } from '../state';

export const TriggerButton = React.forwardRef(({ hideSingleValues, onClear: customClear, getCount, mustOptions = [], mustNotOptions = [], filterHandle, translations = {}, DisplayName = ({ id }) => <>{id}</>, loading, ...props }, ref) => {
  const currentFilterContext = useContext(FilterContext);
  const {
    count = `filters.${filterHandle}.count`,
    isNotNull = `filters.${filterHandle}.isNotNull`,
    isNull = `filters.${filterHandle}.isNull`,
    name = `filters.${filterHandle}.name` } = translations;

  const onClear = useCallback(() => {
    if (customClear) {
      customClear({currentFilterContext, filterHandle});
    } else {
      currentFilterContext.setFullField(filterHandle, [], []);
    }
  }, [currentFilterContext, filterHandle]);

  let TextSummary;
  let isNegated = mustNotOptions.length > 0;

  const options = mustOptions.concat(mustNotOptions);
  if (options.length === 0) {
    // has nothing set
    TextSummary = <FormattedMessage
      id={name}
    />
  } else if (mustOptions.length > 0 && mustNotOptions.length > 0) {
    // has both must and must not
    TextSummary = <span>Complex filter</span>
    isNegated = false;
  } else if (options[0]?.type === 'isNotNull') {
    // it is a statement about existence
    isNegated = false;
    if (mustNotOptions.length > 0) {
      // TextSummary = <FormattedMessage
      //   id={isNull}
      //   defaultMessage={`Does not have: ${filterHandle}`}
      // />
      TextSummary = <>
        <FormattedMessage
          id={name} /> : <FormattedMessage id={'filterSupport.nullOrNot.isNull'} />
      </>
    } else {
      // TextSummary = <FormattedMessage
      //   id={isNotNull}
      //   defaultMessage={`Have: ${filterHandle}`}
      // />
      TextSummary = <>
        <FormattedMessage
          id={name} /> : <FormattedMessage id={'filterSupport.nullOrNot.isNotNull'} />
      </>
    }
  } else if (options.length === 1 && !hideSingleValues) {
    // exactly one option
    TextSummary = <>
      <FormattedMessage
        id={name} /> : <DisplayName id={options[0]} />
    </>
  } else if (options.length > 1 || (hideSingleValues && options.length === 1)) {
    // multiple selected
    // TextSummary = <FormattedMessage
    //   id={count}
    //   defaultMessage={count}
    //   values={{ num: options.length }}
    // />

    TextSummary = <><FormattedMessage
      id={name}
    />
      <span css={css`
        background-color: #00000033;
        border-radius: 10px;
        padding: 3px 5px;
        margin-inline-start: 8px;
        font-size: 85%;
        font-weight: bold;
        line-height: 85%;
      `}>{options.length}</span>
    </>
  }

  let filterCount = options.length;
  if (getCount) {
    const customCount = getCount({ filter: currentFilterContext.filter, filterHandle })
    filterCount = customCount;
    if (customCount > 0) {
      TextSummary = <><FormattedMessage
        id={name}
      />
        <span css={css`
        background-color: #00000033;
        border-radius: 10px;
        padding: 3px 5px;
        margin-inline-start: 8px;
        font-size: 85%;
        font-weight: bold;
        line-height: 85%;
      `}>{customCount}</span>
      </>
    }
  }

  return <FilterButton
    loading={loading}
    isActive={filterCount > 0}
    onClearRequest={onClear}
    ref={ref}
    truncate={filterCount < (hideSingleValues ? 1 : 2)}
    isNegated={isNegated}
    {...props}
  >
    {TextSummary}
  </FilterButton>
});

TriggerButton.displayName = 'TriggerButton';
TriggerButton.propTypes = {
  options: PropTypes.array,
  loading: PropTypes.bool,
  filterName: PropTypes.string,
  DisplayName: PropTypes.any,
}
/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from "react";
import { nanoid } from 'nanoid';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import PopoverFilter from './PopoverFilter';

import { Suggest, Option, Filter, SummaryBar, FilterBody, Footer, Exists } from '../utils';

export const FilterContent = ({ config, LabelFromID, trName, hide, labelledById, onApply, onCancel, onFilterChange, focusRef, filterHandle, initFilter }) => {
  const [id] = React.useState(nanoid);

  if (config.dontWrapInStdFilter) {
    const componentProps = {
      formId: id, 
      config, LabelFromID, trName, hide, labelledById, onApply, onCancel, onFilterChange, focusRef, filterHandle, initFilter,
      standardComponents: { SummaryBar, FilterBody, Footer, Suggest, Option }
    };
    return <config.component {...componentProps} />;
  }

  return <Filter
    labelledById={labelledById}
    onApply={onApply}
    onCancel={onCancel}
    title={<FormattedMessage
      id={trName || `filter.${filterHandle}.name`}
      defaultMessage={filterHandle}
    />}
    hasHelpTexts={config.hasOptionDescriptions}
    aboutText={config.description && <FormattedMessage
      id={config.description}
      defaultMessage={config.description}
    />}
    supportsExist={config.supportsExist}
    onFilterChange={onFilterChange}
    filterName={filterHandle}
    formId={id}
    defaultFilter={initFilter}
  >
    {({ filter, toggle, setFullField, checkedMap, formId, summaryProps, footerProps, isExistenceFilter }) => {
      if (isExistenceFilter) {
        return <Exists {...{ footerProps, setFullField, onApply, onCancel, filter, hide, filterHandle }} />
      }
      const componentProps = {
        filter,
        toggle,
        setFullField,
        checkedMap,
        formId,
        summaryProps,
        footerProps,
        isExistenceFilter,
        filterHandle,
        onApply,
        onCancel,
        hide,
        focusRef,
        LabelFromID,
        standardComponents: { SummaryBar, FilterBody, Footer, Suggest, Option }
      };

      return <config.component {...componentProps} />;
    }}
  </Filter>
};

FilterContent.propTypes = {
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
  onFilterChange: PropTypes.func,
  hide: PropTypes.func,
  focusRef: PropTypes.any,
  vocabulary: PropTypes.object,
  initFilter: PropTypes.object,
  filterHandle: PropTypes.string
};

export function Popover({ filterHandle, LabelFromID, translations = {}, config, ...props }) {
  return (
    <PopoverFilter
      {...props}
      content={<FilterContent
        filterHandle={filterHandle}
        LabelFromID={LabelFromID}
        trName={translations.name}
        config={config} />}
    />
  );
}

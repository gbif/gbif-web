
import { jsx } from '@emotion/react';
import React from "react";
import { nanoid } from 'nanoid';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import PopoverFilter from './PopoverFilter';

import { FilterState, FilterContext } from '../state';
import { Suggest, Option, Filter, SummaryBar, FilterBody, Footer, Exists } from '../utils';

export const FilterContent = ({ config, translations, LabelFromID, hide, labelledById, onApply, onCancel, onFilterChange, focusRef, filterHandle, initFilter }) => {
  const [id] = React.useState(nanoid);

  if (config.dontWrapInStdFilter) {
    const componentProps = {
      formId: id, 
      config, LabelFromID, translations, hide, labelledById, onApply, onCancel, onFilterChange, focusRef, filterHandle, initFilter,
      standardComponents: { SummaryBar, FilterBody, Footer, Suggest, Option },
      FilterState, FilterContext
    };
    return <config.component {...componentProps} />;
  }

  return <Filter
    labelledById={labelledById}
    onApply={onApply}
    onCancel={onCancel}
    title={<FormattedMessage
      id={translations?.name || `filters.${filterHandle}.name`}
      defaultMessage={translations?.name}
    />}
    hasHelpTexts={config.hasOptionDescriptions}
    supportsExist={config.supportsExist}
    aboutText={translations.description && <FormattedMessage
      id={translations.description || `filters.${filterHandle}.description`}
      defaultMessage={translations.description}
    />}
    supportsExist={config.supportsExist}
    onFilterChange={onFilterChange}
    filterName={filterHandle}
    formId={id}
    defaultFilter={initFilter}
    defaultHelpVisible={config.showOptionHelp}
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
        translations={translations}
        translations={translations}
        config={config} />}
    />
  );
}

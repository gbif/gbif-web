import React from 'react';
import { FormattedMessage } from 'react-intl';
import isUndefined from 'lodash/isUndefined';

export function rangeOrEqualLabel(path) {
  return ({ id: value }) => {
    if (value?.type === 'range') {
      let translationKey;
      const from = value?.value?.gte || value?.value?.gt;
      const to = value?.value?.lte || value?.value?.lt;
      if (isUndefined(from)) {
        translationKey = 'lt';
      } else if (isUndefined(to)) {
        translationKey = 'gt';
      } else {
        translationKey = 'between';
      }
      return <FormattedMessage
        id={`${path}.${translationKey}`}
        defaultMessage={'Filter name'}
        values={{ from, to }}
      />
    } else if (value?.type === 'equals') {
      return <FormattedMessage
        id={`${path}.e`}
        defaultMessage={'Filter name'}
        values={{ from: value.value }}
      />
    } else {
      return <FormattedMessage
        id={`invalidValue`}
        defaultMessage={'Invalid value'}
      />
    }
  }
}
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import labelMaker from './labelMaker';
import { rangeOrEqualLabel } from './rangeOrEqualLabel';

export function config2labels(config, apiContext, localeContext) {
  return Object.keys(config).reduce((acc, cur) => {
    acc[cur] = config2label(cur, config[cur], apiContext, localeContext);
    return acc;
  }, {});
}

export function config2label(name, config = {}, apiContext, localeContext) {
  switch (config.type) {
    case 'TRANSLATION': {
      return ({ id }) => <FormattedMessage
        id={config.template(id)}
        defaultMessage={prettifyEnum(id)}
      />
    }
    case 'TRANSFORM': {
      return ({ id }) => {
        const intl = useIntl()
        return <>{config.transform({ id, locale: intl.locale })}</>
      }
    }
    case 'GQL': {
      const fetchFunction = ({ id }) => apiContext
        .get(apiContext.gql.endpoint, { params: { query: config.query, variables: { id } } })
        .promise
        .then(res => res.data)
        .then(config.transform || (x => x));
      const Label = labelMaker(fetchFunction, { isHtmlResponse: config.isHtmlResponse });
      return Label;

    }
    case 'ENDPOINT': {
      const fetchFunction = ({ id, locale }) => apiContext
        .get(config.template({ id, api: apiContext }))
        .promise
        .then(res => res.data)
        .then((result) => config.transform ? config.transform(result, { localeContext }) : result);

      const Label = labelMaker(fetchFunction);
      return Label;
    }
    case 'CUSTOM_ENDPOINT': {
      const Label = labelMaker(config.get);
      return Label;
    }
    case 'NUMBER_RANGE': {
      return rangeOrEqualLabel(config.path)
    }
    case 'CUSTOM': {
      return config.component;
    }
    default: return ({ id }) => typeof id === 'object' ? id.value : id;
  }
}

export function prettifyEnum(text) {
  return typeof text === 'string'
    ? text.charAt(0) + text.slice(1).toLowerCase().replace(/_/g, ' ')
    : 'Unknown';
}
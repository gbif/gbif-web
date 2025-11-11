import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '../../dataManagement/api';
import { ErrorImage } from '../Icons/Icons';
import LocaleContext from '../../dataManagement/LocaleProvider/LocaleContext';
import { FormattedMessage } from 'react-intl';
import { StripeLoader } from '../Loaders';

export function HelpText({
  identifier,
  includeTitle,
  children,
  ...props
}) {
  const { title, body, error, loading } = useHelp(identifier);

  return <div {...props}>
    {loading && <div><StripeLoader active={true} /></div>}
    {!loading && error && <div style={{textAlign: 'center'}}>
      <ErrorImage style={{width: 150, maxWidth: '100%'}}/>
      <div><FormattedMessage id="phrases.failedToLoadData" /></div>
    </div>}
    {!loading && !error && <>
      {includeTitle && <h3>{title}</h3>}
      {children}
      <div dangerouslySetInnerHTML={{ __html: body }}></div>
    </>}
  </div>
};

HelpText.propTypes = {
  as: PropTypes.element
};

const HELP = `
query($identifier: String!, $locale: String) {
  help(identifier: $identifier, locale: $locale) {
    id
    identifier
    title
    body
    excerpt
  }
}
`;

export function useHelp(helpIdentifier) {
  const { data, error, loading, load } = useQuery(HELP, { lazyLoad: true });
  const { localeMap } = useContext(LocaleContext);

  useEffect(() => {
    if (helpIdentifier) {
      load({ keepDataWhileLoading: false, variables: { identifier: helpIdentifier, locale: localeMap?.cms } });
    }
  }, [helpIdentifier, localeMap?.cms]);
  const { title, body, identifier, id } = data?.help || {};

  if (error) {
    console.error(`Unable to load help text for ${helpIdentifier}`, error);
  }

  return { title, body, identifier, id, error, loading: loading || !data };
}
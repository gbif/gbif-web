
import { jsx } from '@emotion/react';
import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';
import { Properties } from "../../../components";
import { Header } from './Header';
import { HyperText } from '../../../components';
import { Group } from './Groups';
const { Term, Value } = Properties;

export function Extensions({
  data,
  loading,
  error,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);

  if (Object.keys(data?.occurrence?.extensions || {}).length === 0) {
    return <div>no extensions to display</div>
  }

  return <div style={{ padding: '12px 0' }}>
    <Header data={data} />
    {Object.keys(data?.occurrence?.extensions).map(extensionName => {
      const extension = data.occurrence.extensions[extensionName];
      if (!extension || !Array.isArray(extension) || extension.length === 0) return null;

      return <Group label={`occurrenceDetails.extensions.${extensionName}.name`} defaultOpen={true}>
        {extension.map(group => {
          const fields = Object.keys(group);
          return <Properties css={css.extensionProperties} dense={true} >
            {fields
              .map(fieldName => <React.Fragment key={fieldName}>
                <Term>
                  <FormattedMessage id={`occurrenceDetails.extensions.${extensionName}.properties.${fieldName}`} defaultMessage={fieldName} />
                </Term>
                <Value>
                  <HyperText text={group[fieldName]} inline />
                </Value>
              </React.Fragment>)}
          </Properties>
        })}
      </Group>
    })}
  </div>
};
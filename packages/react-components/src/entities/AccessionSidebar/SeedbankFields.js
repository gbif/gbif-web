import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { Properties } from '../../components';
import ThemeContext from '../../style/themes/ThemeContext';

const { Term: T, Value: V } = Properties;

export function SeedbankFields({ event, fields }) {
  const seedbank = event.extensions?.seedbank;
  const theme = useContext(ThemeContext);

  return (
    <Properties style={{ fontSize: 12 }} horizontal dense>
      {fields.map((field) => (
        <React.Fragment key={field}>
          <T>
            <FormattedMessage
              id={`extensions.seedbank.fields.${field}.name`}
              defaultMessage={field}
            />
          </T>
          <V style={{ color: seedbank[field] ? theme.color : '#aaa' }}>
            {seedbank[field] || 'Not Supplied'}
            {seedbank[field] && (
              <FormattedMessage
                id={`extensions.seedbank.fields.${field}.unit`}
                defaultMessage=' '
              />
            )}
          </V>
        </React.Fragment>
      ))}
    </Properties>
  );
}

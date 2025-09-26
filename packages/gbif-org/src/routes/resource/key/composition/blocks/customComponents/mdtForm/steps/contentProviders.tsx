import { FormattedMessage } from 'react-intl';
import { TextField } from '../mdtForm';

export function ContentProviders() {
  return (
    <TextField
      textarea
      required
      name="content_providers"
      label={<FormattedMessage id="mdt.describeContentProviders" />}
    />
  );
}

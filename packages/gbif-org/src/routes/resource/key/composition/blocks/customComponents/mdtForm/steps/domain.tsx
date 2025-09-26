import { FormattedMessage } from 'react-intl';
import { TextField } from '../mdtForm';

export function Domain() {
  return <TextField name="domain" label={<FormattedMessage id="mdt.doYouHaveADomain" />} />;
}

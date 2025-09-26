import { FormattedMessage } from 'react-intl';
import { TextField } from '../mdtForm';

export function Description() {
  return (
    <div className="g-flex g-flex-col g-gap-4">
      <TextField
        required
        name="installation_name"
        label={<FormattedMessage id="mdt.installationName" />}
        description={<FormattedMessage id="mdt.installationNameDescription" />}
      />

      <TextField
        required
        name="description"
        textarea
        label={<FormattedMessage id="mdt.descriptionLabel" />}
        description={<FormattedMessage id="mdt.descriptionDescription" />}
      />
    </div>
  );
}

import { FormattedMessage } from 'react-intl';
import { TextField } from '../mdtForm';

export function TimeLine() {
  return (
    <TextField label={<FormattedMessage id="mdt.describeTimeline" />} textarea name="timeline" />
  );
}

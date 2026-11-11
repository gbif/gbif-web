import { FormattedMessage } from 'react-intl';
import type { ValidatorErrorKind } from './data/validatorApi';

export function ValidatorErrorMessage({ kind }: { kind: ValidatorErrorKind }) {
  switch (kind) {
    case 'badRequest':
      return (
        <FormattedMessage
          id="tools.dataValidator.errors.badRequest"
          defaultMessage="The file could not be processed, or it may be missing if you provided a URL."
        />
      );
    case 'unauthorized':
      return (
        <FormattedMessage
          id="tools.dataValidator.errors.unauthorized"
          defaultMessage="You do not have access. Please check that you are signed in with the account that started the validation."
        />
      );
    case 'notFound':
      return (
        <FormattedMessage
          id="tools.dataValidator.errors.notFound"
          defaultMessage="The validation was not found. If you believe this is an error, please report it."
        />
      );
    case 'tooLarge':
      return (
        <FormattedMessage
          id="tools.dataValidator.errors.tooLarge"
          defaultMessage="The file is too large to be processed by the data validator."
        />
      );
    case 'unsupported':
      return (
        <FormattedMessage
          id="tools.dataValidator.errors.unsupported"
          defaultMessage="Unsupported file type. The file could not be processed."
        />
      );
    default:
      return (
        <FormattedMessage
          id="tools.dataValidator.errors.generic"
          defaultMessage="Something went wrong. Please try again later."
        />
      );
  }
}

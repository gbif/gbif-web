import { IntlShape } from 'react-intl';

export interface ValidationErrors {
  [key: string]: string | false;
}

export interface TouchedFields {
  [key: string]: boolean;
}

export const validateUsername = (
  username: string,
  formatMessage: IntlShape['formatMessage']
): string | false => {
  if (!username) {
    return formatMessage({ id: 'profile.usernameRequired' });
  }
  if (!/^[a-z0-9_.-]{3,64}$/.test(username)) {
    return formatMessage({ id: 'profile.invalidUsername' });
  }
  return false;
};

export const validateEmail = (
  email: string,
  formatMessage: IntlShape['formatMessage']
): string | false => {
  if (!email) {
    return formatMessage({ id: 'profile.emailRequired' });
  }
  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return formatMessage({ id: 'profile.invalidEmail' });
  }
  return false;
};

export const validatePassword = (
  password: string,
  formatMessage: IntlShape['formatMessage']
): string | false => {
  if (!password) {
    return formatMessage({ id: 'profile.passwordRequired' });
  }
  if (password.length < 6) {
    return formatMessage({ id: 'profile.passwordLength' });
  }
  if (password.length > 256) {
    return formatMessage({ id: 'profile.passwordMaxLength' });
  }
  return false;
};

export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string,
  formatMessage: IntlShape['formatMessage']
): string | false => {
  if (!confirmPassword) {
    return formatMessage({ id: 'profile.repeatPassword' });
  }
  if (password !== confirmPassword) {
    return formatMessage({ id: 'profile.passwordsNotIdentical' });
  }
  return false;
};

export const validateRequired = (
  value: string,
  fieldName: string,
  formatMessage: IntlShape['formatMessage']
): string | false => {
  if (!value) {
    return formatMessage({ id: `profile.${fieldName}Required` });
  }
  return false;
};

export const validateName = (
  name: string,
  fieldName: string,
  formatMessage: IntlShape['formatMessage']
): string | false => {
  // Allow empty names (optional field)
  if (!name) {
    return false;
  }
  if (name.length > 100) {
    return formatMessage({ id: `profile.${fieldName}TooLong` });
  }
  return false;
};

export const hasFormErrors = (errors: ValidationErrors): boolean => {
  return Object.values(errors).some((error) => error);
};

export const getErrorMessage = (error: string): string => {
  if (!error) return '';
  switch (error) {
    case 'INVALID_REQUEST':
      return 'profile.error.INVALID_REQUEST';
    case 'UPDATE_FAILED':
      return 'profile.error.FAILED';
    case 'PASSWORD_UPDATE_FAILED':
      return 'profile.error.PASSWORD_UPDATE_FAILED';
    case 'VALIDATION_ERROR':
      return 'profile.error.VALIDATION_ERROR';
    case 'SERVER_ERROR':
      return 'profile.error.FAILED';
    case 'INVALID_CURRENT_PASSWORD':
      return 'profile.error.INVALID_CURRENT_PASSWORD';
    default:
      return 'profile.error.FAILED';
  }
};

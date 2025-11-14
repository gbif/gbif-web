import config from '../config';

export default async function validateDownloadPredicate(predicate) {
  if (!predicate || typeof predicate !== 'object') {
    return { valid: false, message: 'Predicate must be a valid object.' };
  }
  return fetch(`${config.apiv1}/occurrence/search/predicate/toesquery`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      predicate,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        try {
          return response.text().then((errorMessage) => {
            return {
              valid: false,
              message:
                typeof errorMessage === 'string'
                  ? errorMessage
                  : 'The predicate could not be parsed.',
            };
          });
        } catch (error) {
          return {
            valid: false,
            message: 'The predicate could not be parsed.',
          };
        }
      }
      return {
        valid: true,
        message: 'The predicate is valid.',
      };
    })
    .catch((error) => {
      return {
        valid: false,
        message: 'The predicate is invalid.',
      };
    });
}

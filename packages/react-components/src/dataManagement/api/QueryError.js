import isArray from 'lodash/isArray';

export class QueryError extends Error {
  constructor({message, graphQLErrors, networkError, isCanceled}) {
    super(message);
    this.graphQLErrors = graphQLErrors || [];
    this.networkError = networkError || null;
    this.isCanceled = isCanceled || false;
    
    // Generate an error message based on errors if no explicit message is provided
    const generateErrorMessage = err => {
      let message = '';
      // If we have GraphQL errors present, add that to the error message.
      if (isArray(err.graphQLErrors)) {
        err.graphQLErrors.forEach(graphQLError => {
          const errorMessage = graphQLError
            ? graphQLError.message
            : 'Error message not found.';
          message += `GraphQL error: ${errorMessage}\n`;
        });
      }

      if (err.networkError) {
        message += 'Network error: ' + err.networkError.message + '\n';

        // If we have an error list present, add that to the error message.
        const responseErrors = err?.networkError?.data?.errors;
        if (isArray(responseErrors)) {
          responseErrors.forEach(graphQLError => {
            const errorMessage = graphQLError
              ? graphQLError.message
              : 'Error message not found.';
            message += `GraphQL error: ${errorMessage}\n`;
          });
        }
      }

      // strip newline from the end of the message
      message = message.replace(/\n$/, '');
      return message;
    };

    this.message = message ? message : generateErrorMessage(this);
    
    let errorMap = {};
    if (isArray(graphQLErrors)) {
      graphQLErrors.forEach(graphQLError => {
        const where = (graphQLError?.path || []).join('.');
        const status = graphQLError.extensions.response.status || 500;
        const message = graphQLError.message;
        errorMap[where] = {
          where, status, message
        }
      });
    }

    this.errorPaths = errorMap;
  }
}
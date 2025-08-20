import { GraphQLError } from 'graphql';

export class NotFoundError extends GraphQLError {
  constructor(message = '404: Not Found') {
    super(message, {
      extensions: {
        code: 'NOT_FOUND',
        http: {
          status: 404,
        },
      },
    });
  }
}

export default { NotFoundError };

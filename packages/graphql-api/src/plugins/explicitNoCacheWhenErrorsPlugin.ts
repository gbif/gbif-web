import { ApolloServerPlugin } from '@apollo/server';

export const explicitNoCacheWhenErrorsPlugin: ApolloServerPlugin = {
  async requestDidStart() {
    let error = false;
    return {
      async didEncounterErrors() {
        error = true;
      },
      async willSendResponse({ response }) {
        if (error) {
          response.http?.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate',
          );
          response.http?.headers.set('Pragma', 'no-cache');
          response.http?.headers.set('Expires', '0');
        }
      },
    };
  },
};

import { PluginDefinition } from 'apollo-server-core';
import extractUser from '#/helpers/auth/extractUser';

const headerBasedCachePlugin: PluginDefinition = {
  async requestDidStart() {
    return {
      async willSendResponse({ request, response }) {
        // if there is an auth header or a preview header, then set cache control headers to no caching
        const authHeader = request.http?.headers.get('authorization');
        const user = await extractUser(authHeader);
        const preview = request.http?.headers.get('preview');
        const isPreview = typeof preview === 'string' && preview !== 'false';
        if (user || isPreview) {
          response.http?.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, max-age=0',
          );
          response.http?.headers.set('Pragma', 'no-cache');
          response.http?.headers.set('Expires', '0');
        }
      },
    };
  },
};

export default headerBasedCachePlugin;

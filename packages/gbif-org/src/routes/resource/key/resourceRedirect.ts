import { NotFoundError } from '@/errors';
import { ResourceRedirectQuery, ResourceRedirectQueryVariables } from '@/gql/graphql';
import { LoaderArgs } from '@/reactRouterPlugins';
import { required } from '@/utils/required';
import { redirect } from 'react-router-dom';

const RESOURCE_REDIRECT_QUERY = /* GraphQL */ `
  query ResourceRedirect($id: String!) {
    resource(id: $id) {
      __typename
    }
  }
`;

// The purpose of this loader is to redirect from /resource/:key to the appropriate resource page.
export async function resourceRedirectLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'Key is required');
  console.log('[REDIRECT-DEBUG] resourceRedirectLoader called with key:', key);

  const response = await graphql.query<ResourceRedirectQuery, ResourceRedirectQueryVariables>(
    RESOURCE_REDIRECT_QUERY,
    { id: key }
  );
  const { data, errors } = await response.json();

  if (errors?.some((error) => error.message === '404: Not Found')) {
    throw new NotFoundError();
  }

  if (data.resource == null) throw new NotFoundError();

  switch (data.resource.__typename) {
    case 'Article':
      console.log('[REDIRECT-DEBUG] resourceRedirect redirecting to:', `/article/${key}`);
      return redirect(`/article/${key}`);
    case 'Composition':
      console.log('[REDIRECT-DEBUG] resourceRedirect redirecting to:', `/composition/${key}`);
      return redirect(`/composition/${key}`);
    case 'DataUse':
      console.log('[REDIRECT-DEBUG] resourceRedirect redirecting to:', `/data-use/${key}`);
      return redirect(`/data-use/${key}`);
    case 'Document':
      console.log('[REDIRECT-DEBUG] resourceRedirect redirecting to:', `/document/${key}`);
      return redirect(`/document/${key}`);
    case 'MeetingEvent':
      console.log('[REDIRECT-DEBUG] resourceRedirect redirecting to:', `/event/${key}`);
      return redirect(`/event/${key}`);
    case 'News':
      console.log('[REDIRECT-DEBUG] resourceRedirect redirecting to:', `/news/${key}`);
      return redirect(`/news/${key}`);
    case 'Programme':
      console.log('[REDIRECT-DEBUG] resourceRedirect redirecting to:', `/programme/${key}`);
      return redirect(`/programme/${key}`);
    case 'GbifProject':
      console.log('[REDIRECT-DEBUG] resourceRedirect redirecting to:', `/project/${key}`);
      return redirect(`/project/${key}`);
    case 'Tool':
      console.log('[REDIRECT-DEBUG] resourceRedirect redirecting to:', `/tool/${key}`);
      return redirect(`/tool/${key}`);
  }

  throw new Error(`There is no redirect for this resource type. (${data.resource.__typename})`);
}

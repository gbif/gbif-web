import { ResourceRedirectQuery, ResourceRedirectQueryVariables } from '@/gql/graphql';
import { LoaderArgs } from '@/types';
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

  const response = await graphql.query<ResourceRedirectQuery, ResourceRedirectQueryVariables>(
    RESOURCE_REDIRECT_QUERY,
    { id: key }
  );
  const { data, errors } = await response.json();

  if (errors?.some((error) => error.message === '404: Not Found')) {
    throw new Error('404');
  }

  if (data.resource == null) throw new Error('404');

  switch (data.resource.__typename) {
    case 'Article':
      return redirect(`/article/${key}`);
    case 'Composition':
      return redirect(`/composition/${key}`);
    case 'DataUse':
      return redirect(`/data-use/${key}`);
    case 'Document':
      return redirect(`/document/${key}`);
    case 'MeetingEvent':
      return redirect(`/event/${key}`);
    case 'News':
      return redirect(`/news/${key}`);
    case 'Programme':
      return redirect(`/programme/${key}`);
    case 'GbifProject':
      return redirect(`/project/${key}`);
    case 'Tool':
      return redirect(`/tool/${key}`);
  }

  throw new Error(`There is no redirect for this resource type. (${data.resource.__typename})`);
}

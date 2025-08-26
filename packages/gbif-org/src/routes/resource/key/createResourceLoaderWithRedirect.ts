import { UnexpectedLoaderError } from '@/errors';
import { QueryError } from '@/hooks/useQuery';
import { LoaderArgs } from '@/reactRouterPlugins';
import { throwCriticalErrors } from '@/routes/rootErrorPage';
import { fragmentManager } from '@/services/fragmentManager';
import { required } from '@/utils/required';
import { slugify } from '@/utils/slugify';
import { redirect } from 'react-router-dom';
import { z } from 'zod';

fragmentManager.register(/* GraphQL */ `
  fragment ResourceRedirectDetails on Resource {
    __typename
    ... on Article {
      id
      title
      urlAlias
    }
    ... on Composition {
      id
      maybeTitle: title
      urlAlias
    }
    ... on DataUse {
      id
      title
    }
    ... on Document {
      id
      title
    }
    ... on MeetingEvent {
      id
      title
    }
    ... on News {
      id
      title
    }
    ... on Programme {
      id
      title
    }
    ... on GbifProject {
      id
      title
    }
    ... on Tool {
      id
      title
    }
  }
`);

const ResourceTypeSchema = z.union([
  z.literal('Article'),
  z.literal('Composition'),
  z.literal('DataUse'),
  z.literal('Document'),
  z.literal('MeetingEvent'),
  z.literal('News'),
  z.literal('Programme'),
  z.literal('GbifProject'),
  z.literal('Tool'),
]);

const DataSchema = z.object({
  resource: z
    .object({
      __typename: ResourceTypeSchema,
      id: z.string(),
      urlAlias: z.string().nullable().optional(),
    })
    .and(z.object({ title: z.string() }).or(z.object({ maybeTitle: z.string().nullable() }))),
});

type ResourceType = z.infer<typeof ResourceTypeSchema>;

export const redirectMapper: Record<ResourceType, (key: string, slug: string | null) => string> = {
  Article: (key, slug) => `/article/${key}/${slug}`,
  Composition: (key, slug) => `/composition/${key}/${slug}`,
  DataUse: (key, slug) => `/data-use/${key}/${slug}`,
  Document: (key, slug) => `/document/${key}/${slug}`,
  MeetingEvent: (key, slug) => `/event/${key}/${slug}`,
  News: (key, slug) => `/news/${key}/${slug}`,
  Programme: (key, slug) => `/programme/${key}/${slug}`,
  GbifProject: (key, slug) => `/project/${key}/${slug}`,
  Tool: (key, slug) => `/tool/${key}/${slug}`,
};

// If you want to override the default query see how it is done in project.tsx
type Options =
  | { query: string; resourceType: ResourceType }
  | { fragment: string; resourceType: ResourceType };

export function createResourceLoaderWithRedirect(options: Options) {
  const query = createQuery(options);

  return async function loader({ params, graphql, locale, request }: LoaderArgs) {
    const key = required(params.key, 'No key provided in the url');

    const response = await graphql.query(query, { key });

    const { errors, data } = await response.json();
    throwCriticalErrors({
      path404: ['resource'],
      errors,
      requiredObjects: [data?.resource],
    });

    if (errors) {
      throw new QueryError({ graphQLErrors: errors, query, variables: { key } });
    }

    // Validate the structure of the response
    const parseResult = DataSchema.safeParse(data);
    if (parseResult.success === false) {
      console.error(parseResult.error);
      throw new UnexpectedLoaderError();
    }
    const { resource } = parseResult.data;

    // Get the slugifiedTitle from the resource
    const title = 'title' in resource ? resource.title : resource.maybeTitle;
    const slugifiedTitle = typeof title === 'string' ? slugify(title) : null;

    // If the resource has a urlAlias and is at the correct url, return the resource
    if (
      typeof resource.urlAlias === 'string' &&
      request.url.split('?')[0].endsWith(resource.urlAlias)
    ) {
      return data;
    }

    // If the resource has a urlAlias and is not at the correct url, redirect to the correct url
    if (typeof resource.urlAlias === 'string') {
      let redirectUrl = resource.urlAlias;
      if (!locale.default) redirectUrl = `/${locale.code}${redirectUrl}`;

      return redirectWithPreservedPreview(request, redirectUrl);
    }

    // If the resource type and the slugified key are correct, return the resource
    if (options.resourceType === resource.__typename && params.slug === slugifiedTitle) {
      return data;
    }

    // If the resource type is correct and there is no slugified key, return the resource
    if (options.resourceType === resource.__typename && slugifiedTitle === null) {
      return data;
    }

    // Redirect to the correct url
    let redirectUrl = redirectMapper[resource.__typename](key, slugifiedTitle);
    if (!locale.default) redirectUrl = `/${locale.code}${redirectUrl}`;

    return redirectWithPreservedPreview(request, redirectUrl);
  };
}

function createQuery(options: Options): string {
  if ('query' in options) return options.query;

  return `
    query ${options.resourceType}($key: String!) {
      resource(id: $key) {
        ...ResourceRedirectDetails
        ... on ${options.resourceType} {
          ...${options.fragment}
        }
      }
    }
  `;
}

function redirectWithPreservedPreview(request: Request, url: string) {
  // Preserve the preview=true query param if it is present, still respecting other query params
  if (request.url.includes('preview=true')) {
    url += (url.includes('?') ? '&' : '?') + 'preview=true';
  }

  return redirect(url);
}

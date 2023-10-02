import { GraphQLError } from "graphql";
import { ContentfulDetailService } from "#/helpers/contentful/ContentfulDetailService";
import { getHtml } from "#/helpers/utils";
import { Project } from "#/helpers/contentful/mappers/project";

type PartialContext = {
    dataSources: {
        contentfulDetailService: ContentfulDetailService
    }
    language?: string
}

type ProjectQueryArgs = {
    id: string
    preview?: boolean
}

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
    Query: {
        project: async (_: unknown, args: ProjectQueryArgs, context: PartialContext): Promise<Project> => {
            const entry = await context.dataSources.contentfulDetailService.getById(args.id, args.preview, context.language);
            if (entry == null) throw new GraphQLError(`There is no project entry with an id of ${args.id}`);
            if (entry.contentType !== 'project') throw new GraphQLError(`The entry with an id of ${args.id} is not a project entry`);
            return entry;
        }
    },
    CMSProject: {
        body: (src): string | undefined => getHtml(src.body),
        createdAt: (src): string => src.createdAt.toISOString(),
        start: (src): string | undefined => src.start?.toISOString(),
        end: (src): string | undefined => src.end?.toISOString(),
        // events: async (src, _, context): Promise<Event[]> => {
        //     if (src.eventIds.length === 0) return [];
        //     const events = await Promise.all(src.eventIds.map(id => context.dataSources.contentfulDetailService.getById(id, false, context.language)));
        //     return events.filter<Event>((event): event is Event => event != null && event.contentType === 'event');
        // },
    } as Record<string, (src: Project, args: unknown, context: PartialContext) => unknown>
}


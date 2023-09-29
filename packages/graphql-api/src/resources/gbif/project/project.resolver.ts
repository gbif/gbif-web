import { GraphQLError } from "graphql";
import { ContentfulDetailService } from "#/helpers/contentful/ContentfulDetailService";
import { Project } from "#/helpers/contentful/contentTypes/project";
import { Partner } from "#/helpers/contentful/contentTypes/partner";
import { getHtml } from "#/helpers/utils";
import { Asset } from "#/helpers/contentful/contentTypes/asset";
import { Call } from "#/helpers/contentful/contentTypes/call";
import { Event } from "#/helpers/contentful/contentTypes/event";

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
        id: (src): string => src.id,
        leadPartner: (src): Partner | undefined => src.leadPartner,
        title: (src): string => src.title,
        body: (src): string | undefined => getHtml(src.body),
        gbifRegion: (src): string => src.gbifRegion,
        createdAt: (src): string => src.createdAt.toISOString(),
        start: (src): string | undefined => src.start?.toISOString(),
        end: (src): string | undefined => src.end?.toISOString(),
        matchingFunds: (src): number | undefined => src.matchingFunds,
        primaryImage: (src): Asset | undefined => src.primaryImage,
        fundsAllocated: (src): number | undefined => src.fundsAllocated,
        officialTitle: (src): string | undefined => src.officialTitle,
        leadContact: (src): string | undefined => src.leadContact,
        searchable: (src): boolean => src.searchable,
        contractCountry: (src): string => src.contractCountry,
        call: (src): Call | undefined => src.call,
        gbifProgrammeAcronym: (src): string => src.gbifProgrammeAcronym,
        projectId: (src): string | undefined => src.projectId,
        additionalPartners: (src): Partner[] => src.additionalPartners,
        status: (src): string => src.status,
        homepage: (src): boolean => src.homepage,
        keywords: (src): string[] => src.keywords,
        documents: (src): Asset[] => src.documents,
        events: async (src, _, context): Promise<Event[]> => {
            if (src.eventIds.length === 0) return [];
            const events = await Promise.all(src.eventIds.map(id => context.dataSources.contentfulDetailService.getById(id, false, context.language)));
            return events.filter<Event>((event): event is Event => event != null && event.contentType === 'event');
        },
    } as Record<string, (src: Project, args: unknown, context: PartialContext) => unknown>
}


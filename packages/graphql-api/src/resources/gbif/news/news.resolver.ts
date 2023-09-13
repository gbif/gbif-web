import { GraphQLError } from "graphql";
import { News } from "#/helpers/contentful/contentTypes/news";
import { Asset } from "#/helpers/contentful/contentTypes/asset";
import { Link } from "#/helpers/contentful/contentTypes/link";
import { ContentfulService } from "#/helpers/contentful/ContentfulService";

interface PartialContext {
    dataSources: {
        contentfulService: ContentfulService;
    }
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
        news: async (_: unknown, args: { id: string }, context: PartialContext): Promise<News> => {
            const entity = await context.dataSources.contentfulService.getEntityById(args.id);
            if (entity == null) throw new GraphQLError(`There is no news entry with an id of ${args.id}`);
            if (entity.contentType !== 'news') throw new GraphQLError(`The entry with an id of ${args.id} is not a news entry`);
            return entity;
        }
    },
    News: {
        id: (src): string => src.id,
        title: (src): string => src.title,
        summary: (src): string | undefined => src.summary,
        body: (src): string | undefined => src.body,
        primaryImage: async (src, _, context): Promise<Asset | undefined> => {
            if (src.primaryImage == null) return;
            if ('file' in src.primaryImage) return src.primaryImage;

            // Get the asset from contentful
            const asset = await context.dataSources.contentfulService.getAssetById(src.primaryImage.id);
            if (asset == null) throw new GraphQLError(`There is no asset with an id of ${src.primaryImage.id}`);
            if (asset.contentType !== 'asset') throw new GraphQLError(`The asset with an id of ${src.primaryImage.id} is not a asset`);
            return asset;
        },
        primaryLink: async (src, _, context): Promise<Link | undefined> => {
            if (src.primaryLink == null) return;
            if ('url' in src.primaryLink) return src.primaryLink;

            // Get the link from contentful
            const entity = await context.dataSources.contentfulService.getEntityById(src.primaryLink.id);
            if (entity == null) throw new GraphQLError(`There is no entry with an id of ${src.primaryLink.id}`);
            if (entity.contentType !== 'link') throw new GraphQLError(`The entry with an id of ${src.primaryLink.id} is not a link entry`);
            return entity;
        },
        secondaryLinks: (src, _, context): Promise<Array<Link | undefined>> => Promise.all(src.secondaryLinks.map(async link => {
            if ('url' in link) return link;

            // Get the link from contentful
            const entity = await context.dataSources.contentfulService.getEntityById(link.id);
            if (entity == null) throw new GraphQLError(`There is no entry with an id of ${link.id}`);
            if (entity.contentType !== 'link') throw new GraphQLError(`The entry with an id of ${link.id} is not a link entry`);
            return entity;
        })),
        citation: (src): string | undefined => src.citation,
        countriesOfCoverage: (src): string[] => src.countriesOfCoverage,
        topics: (src, _, context): Promise<Array<string | undefined>> => Promise.all(src.topics.map(async topic => {
            if ('contentType' in topic) return topic.term;

            // Get the topic from contentful
            const entity = await context.dataSources.contentfulService.getEntityById(topic.id);
            if (entity == null) throw new GraphQLError(`There is no entry with an id of ${topic.id}`);
            if (entity.contentType !== 'topic') throw new GraphQLError(`The entry with an id of ${topic.id} is not a topic entry`);
            return entity.term;
        })),
        purposes: (src, _, context): Promise<Array<string | undefined>> => Promise.all(src.purposes.map(async purpose => {
            if ('contentType' in purpose) return purpose.term;

            // Get the purposes from contentful
            const entity = await context.dataSources.contentfulService.getEntityById(purpose.id);
            if (entity == null) throw new GraphQLError(`There is no entry with an id of ${purpose.id}`);
            if (entity.contentType !== 'purpose') throw new GraphQLError(`The entry with an id of ${purpose.id} is not a purpose entry`);
            return entity.term;
        })),
        audiences: (src, _, context): Promise<Array<string | undefined>> => Promise.all(src.audiences.map(async audience => {
            if ('contentType' in audience) return audience.term;

            // Get the audience from contentful
            const entity = await context.dataSources.contentfulService.getEntityById(audience.id);
            if (entity == null) throw new GraphQLError(`There is no entry with an id of ${audience.id}`);
            if (entity.contentType !== 'audience') throw new GraphQLError(`The entry with an id of ${audience.id} is not a audience entry`);
            return entity.term;
        })),
        keywords: (src): string[] => src.keywords,
        searchable: (src): boolean => src.searchable,
        homepage: (src): boolean  => src.homepage,
    } as Record<string, (src: News, args: unknown, context: PartialContext) => unknown>
}


import getAnnotationUrl from './utils';

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    feedbackOptions: (parent, { pageType, key }, { dataSources }) => {
      if (!pageType || !key) return null;
      if (pageType === 'occurrenceKey') {
        return dataSources.occurrenceAPI
          .getOccurrenceByKey({ key })
          .then((occurrence) => {
            if (!occurrence) return null;
            const { datasetKey } = occurrence;
            return dataSources.datasetAPI
              .getDatasetByKey({ key: datasetKey })
              .then((dataset) => {
                if (!dataset) return null;
                const contact = (dataset?.contacts ?? [])?.find(
                  (c) =>
                    c.type === 'ADMINISTRATIVE_POINT_OF_CONTACT' &&
                    c?.email?.[0] &&
                    (c?.firstName || c?.lastName || c?.organization),
                );
                const annotation = getAnnotationUrl(occurrence);
                const contactName =
                  contact && (contact?.firstName || contact?.lastName)
                    ? `${contact?.firstName ?? ''} ${
                        contact?.lastName ?? ''
                      }`.trim()
                    : null;

                return {
                  contactEmail: contact?.email?.[0],
                  contactName: contact
                    ? contactName ?? contact?.organization
                    : null,
                  externalServiceName: annotation?.name,
                  externalServiceUrl: annotation?.url,
                };
              });
          });
      }
      return null;
    },
  },
};

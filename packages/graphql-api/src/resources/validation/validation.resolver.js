import interpretationRemark from '@/helpers/enums/interpretationRemark';

const severityByRemark = interpretationRemark.reduce((acc, remark) => {
  acc[remark.id] = remark.severity;
  return acc;
}, {});

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    userValidations: (
      parent,
      { username, limit = 10, offset = 0 },
      { dataSources },
      info,
    ) => {
      info.cacheControl.setCacheHint({
        maxAge: 0,
        scope: 'PRIVATE',
      });
      return dataSources.validationAPI.getUsersValidation({
        username,
        query: { limit, offset, sortBy: 'created:DESC' },
      });
    },
    validation: (parent, { key }, { dataSources }, info) => {
      info.cacheControl.setCacheHint({ maxAge: 0, scope: 'PRIVATE' });
      return dataSources.validationAPI.getValidation(key);
    },
    validationEvaluationCategories: async (parent, args, { dataSources }) => {
      const categories = await dataSources.validationAPI.getEvaluationCategories();
      return Array.isArray(categories)
        ? categories.filter((category) => typeof category === 'string')
        : [];
    },
  },
  Validation: {
    eml: ({ key }, args, { dataSources }, info) => {
      info.cacheControl.setCacheHint({ maxAge: 0, scope: 'PRIVATE' });
      return dataSources.validationAPI.getEml(key);
    },
  },
  ValidationFile: {
    extension: ({ rowType }, args, { dataSources }) =>
      dataSources.dwcExtensionAPI.getExtension(rowType),
  },
  ValidationIssue: {
    // ChecklistBank issues share names with occurrence remarks, but not their severity
    severity: ({ issue, issueCategory }) => {
      if (issueCategory === 'CLB_INTERPRETATION_BASED') return null;
      return severityByRemark[issue] ?? null;
    },
  },
};

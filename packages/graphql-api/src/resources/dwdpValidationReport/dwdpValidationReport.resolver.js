export default {
  Query: {
    dwdpValidationReport: async (parent, { datasetKey, attempt }, { dataSources }) => {
      const report = await dataSources.dwdpValidationReportAPI.getValidationReport({
        datasetKey,
        attempt,
      });
      if (!report) return null;
      return {
        ...report,
        datasetKey,
        attempt,
        raw: report,
      };
    },
  },
};

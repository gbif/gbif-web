import { RESTDataSource } from '@/RESTDataSource';

// Wraps the registry's dataset validation report endpoint
// (GET /dataset/{datasetKey}/validationreport[/{attempt}]).
class DwdpValidationReportAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
    this.config = config;
  }

  willSendRequest(path, request) {
    request.headers['User-Agent'] = this.context.userAgent;
    if (this.context.referer) request.headers.referer = this.context.referer;
    if (this.context.requestId) request.headers['x-request-id'] = this.context.requestId;
  }

  // Fetch the validation report for a dataset. Without an attempt, the
  // registry returns the report for the latest crawl attempt.
  async getValidationReport({ datasetKey, attempt }) {
    const path = attempt
      ? `/dataset/${datasetKey}/validationreport/${attempt}`
      : `/dataset/${datasetKey}/validationreport`;
    return this.get(path).catch((err) => {
      // No report exists yet for this dataset/attempt.
      if (err?.extensions?.response?.status === 404) {
        return null;
      }
      throw err;
    });
  }
}

export default DwdpValidationReportAPI;

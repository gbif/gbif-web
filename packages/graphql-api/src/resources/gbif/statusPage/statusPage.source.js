import { RESTDataSource } from 'apollo-datasource-rest';
import { getDefaultAgent } from '#/requestAgents';

class StatusPageAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.statusPage;
  }

  willSendRequest(request) {
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
    if (this.baseURL) {
      request.agent = getDefaultAgent(this.baseURL, request.path);
    }
  }

  async getStatus() {
    if (!this.baseURL) {
      throw new Error('StatusPage URL not configured for this environment');
    }
    return this.get('/api/v2/summary.json');
  }
}

export default StatusPageAPI;

import { RESTDataSource } from 'apollo-datasource-rest';
import Bottleneck from 'bottleneck';

class ThrottledRESTDataSource extends RESTDataSource {
  constructor(options = {}) {
    super();

    // Configure bottleneck with sensible defaults
    this.limiter = new Bottleneck({
      maxConcurrent: options.maxConcurrent ?? 3, // Maximum concurrent requests
      minTime: options.minTime ?? 200, // Minimum amount in ms between requests
    });

    this.limiter.on('failed', async (error, jobInfo) => {
      // Retry on rate limit errors (429). We could also add test for server errors (5xx) but won't for now. In cases where the service fails, it is probably better to just give it a rest
      if (
        error.extensions?.response?.status === 429 &&
        jobInfo.retryCount < 2 // retry 2 times
      ) {
        return 1000; // wait x ms before retrying
      }
      // Don't retry other errors
      return undefined;
    });

    this.limiter.on('retry', (error, jobInfo) => {
      // This is called when a job is retried
    });
  }

  // Throttle GET requests - apollo-datasource-rest v3 signature
  async get(path, params, { throttle, ...init } = {}) {
    if (throttle) {
      return this.limiter.schedule({ id: `GET ${path}` }, () =>
        super.get(path, params, init),
      );
    }
    return super.get(path, params, init);
  }

  // Throttle POST requests - apollo-datasource-rest v3 signature
  async post(path, body, { throttle, ...init } = {}) {
    if (throttle) {
      return this.limiter.schedule({ id: `POST ${path}` }, () =>
        super.post(path, body, init),
      );
    }
    return super.post(path, body, init);
  }

  // Throttle PUT requests
  async put(path, body, { throttle, ...init } = {}) {
    if (throttle) {
      return this.limiter.schedule({ id: `PUT ${path}` }, () =>
        super.put(path, body, init),
      );
    }
    return super.put(path, body, init);
  }

  // Throttle PATCH requests
  async patch(path, body, { throttle, ...init } = {}) {
    if (throttle) {
      return this.limiter.schedule({ id: `PATCH ${path}` }, () =>
        super.patch(path, body, init),
      );
    }
    return super.patch(path, body, init);
  }

  // Throttle DELETE requests
  async delete(path, params, { throttle, ...init } = {}) {
    if (throttle) {
      return this.limiter.schedule({ id: `DELETE ${path}` }, () =>
        super.delete(path, params, init),
      );
    }
    return super.delete(path, params, init);
  }

  // Optional: Method to update limiter settings at runtime
  updateLimiterSettings(newSettings) {
    return this.limiter.updateSettings(newSettings);
  }
}

export default ThrottledRESTDataSource;

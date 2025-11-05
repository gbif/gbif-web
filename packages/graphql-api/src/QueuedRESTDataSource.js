import { RESTDataSource } from 'apollo-datasource-rest';
import PQueue from 'p-queue';

class QueuedRESTDataSource extends RESTDataSource {
  constructor(options = {}) {
    super();
    this.queue = new PQueue({
      concurrency: options.concurrency ?? 10, // Maximum concurrent requests
    });
  }

  // EnQueue GET requests - apollo-datasource-rest v3 signature
  async get(path, params, { enQueue, ...init } = {}) {
    if (enQueue) {
      return this.queue.add(() => super.get(path, params, init));
    }
    return super.get(path, params, init);
  }

  // EnQueue POST requests - apollo-datasource-rest v3 signature
  async post(path, body, { enQueue, ...init } = {}) {
    if (enQueue) {
      return this.queue.add(() => super.post(path, body, init));
    }
    return super.post(path, body, init);
  }

  // EnQueue PUT requests
  async put(path, body, { enQueue, ...init } = {}) {
    if (enQueue) {
      return this.queue.add(() => super.put(path, body, init));
    }
    return super.put(path, body, init);
  }

  // EnQueue PATCH requests
  async patch(path, body, { enQueue, ...init } = {}) {
    if (enQueue) {
      return this.queue.add(() => super.patch(path, body, init));
    }
    return super.patch(path, body, init);
  }

  // EnQueue DELETE requests
  async delete(path, params, { enQueue, ...init } = {}) {
    if (enQueue) {
      return tthis.queue.add(() => super.delete(path, params, init));
    }
    return super.delete(path, params, init);
  }
}

export default QueuedRESTDataSource;

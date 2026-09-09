import { RESTDataSource } from '@/RESTDataSource';

// Wraps the public GBIF validation/sequence endpoint (api.gbif.org/v1/validation/sequence).
// One GET per sequence; the resolver fans a batch out in parallel. Responses are deterministic
// per sequence and therefore cacheable.
class SequenceValidationAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
    this.config = config;
  }

  willSendRequest(path, request) {
    if (this.context.userAgent) request.headers['User-Agent'] = this.context.userAgent;
    if (this.context.referer) request.headers.referer = this.context.referer;
    if (this.context.requestId) request.headers['x-request-id'] = this.context.requestId;
  }

  // Validate/normalise a single raw nucleotide sequence.
  async validateSequence(sequence) {
    return this.get('/validation/sequence', { sequence });
  }
}

export default SequenceValidationAPI;

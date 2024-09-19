import { Agent as HttpAgent } from 'node:http';
import { AgentOptions, Agent as HttpsAgent } from 'node:https';

function createGetAgentFn(httpsAgent: HttpsAgent, httpAgent: HttpAgent) {
  return (baseUrl: string) =>
    baseUrl.startsWith('https') ? httpsAgent : httpAgent;
}

const baseOptions: AgentOptions = {
  keepAlive: true,
  maxSockets: 8000,
};

const httpsOccurrenceAgent = new HttpsAgent(baseOptions);
const httpOccurrenceAgent = new HttpAgent(baseOptions);
export const getOccurrenceAgent = createGetAgentFn(
  httpsOccurrenceAgent,
  httpOccurrenceAgent,
);

const httpsTaxonAgent = new HttpsAgent(baseOptions);
const httpTaxonAgent = new HttpAgent(baseOptions);
export const getTaxonAgent = createGetAgentFn(httpsTaxonAgent, httpTaxonAgent);

const httpsDefaultAgent = new HttpsAgent(baseOptions);
const httpDefaultAgent = new HttpAgent(baseOptions);
export const getDefaultAgent = createGetAgentFn(
  httpsDefaultAgent,
  httpDefaultAgent,
);

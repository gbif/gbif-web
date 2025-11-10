import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import hash from 'object-hash';
import tools from './tools';
import toolHandler from './toolHandler';
import { McpError } from '../handlers/utils';
import GBIFMCPServer from './remote';
import config from '#/config';
import { createChartConfig, getAllKeys, getChartConfig } from './store';
import ask from './agents/claude';

import example2 from './mock/example2.json';

export default (router, server) => {
  const mcpServer = new GBIFMCPServer(server);

  // for asking for charts based on text queries
  router.post('/chart/query', async (req, res) => {
    const { predicate, q: query } = req.body;
    const queryId = hash({ query }).replace(' ', '_');
    createChartConfig(queryId, { predicate, query, charts: [] });
    // ask llm to generate charts
    const response = await ask({ query, queryId });
    const charts = getChartConfig(queryId);
    return res.json({
      queryId,
      charts,
      llm: response,
    });
    // return res.json(example2);
  });

  // for getting saved chart configurations
  router.get('/chart/key/:key', async (req, res) => {
    const { key } = req.params;
    try {
      if (key === '_list') {
        const keys = getAllKeys();
        return res.json({ keys });
      }
      const chartConfig = getChartConfig(key);
      if (chartConfig) {
        res.json(chartConfig);
      } else {
        return res.json(example2);
        // res.status(404).json({ message: 'Chart config not found' });
      }
    } catch (error) {
      console.error('Error fetching chart config:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // MCP Tool Configuration Endpoint for stdio-mcp
  router.get('/chart/config', async (req, res) => {
    // check that there is an auth header with correct token
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const queryId = authHeader && authHeader.split(' ')[2];
    if (config.mcpApiToken && token !== config.mcpApiToken) {
      if (config.debug) console.log('Unauthorized access to MCP config');
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (config.debug) console.log('Fetching MCP tool configuration');
    res.json({
      tools,
    });
  });

  // MCP Tool Execution Endpoint for stdio-mcp
  router.post('/chart/execute', async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const queryId = authHeader && authHeader.split(' ')[2];
    if (config.mcpApiToken && token !== config.mcpApiToken) {
      if (config.debug) console.log('Unauthorized access to MCP config');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (config.debug) console.log('Fetching MCP tools execution');
    const { tool, arguments: args } = req.body;
    try {
      const result = await toolHandler({ tool, args, queryId, server });
      if (config.debug) console.log('send result of execution');
      res.json(result);
    } catch (error) {
      if (config.debug) console.log(error);
      if (error instanceof McpError) {
        res.status(500).json({
          message: error.message ?? 'Internal Server Error',
        });
      } else {
        res.status(500).json({
          message: 'Internal Server Error',
        });
      }
    }
  });

  router.post('/chart', async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const queryId = authHeader && authHeader.split(' ')[2];
    if (config.mcpApiToken && token !== config.mcpApiToken) {
      if (config.debug) console.log('Unauthorized access to MCP config');
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // () => 'unknown-session',
        enableJsonResponse: true,
      });

      res.on('close', () => {
        transport.close();
      });

      await mcpServer.server.connect(transport);
      await transport.handleRequest(req, res, {
        ...req.body,
        params: {
          ...req.body.params,
          queryId: queryId || 'unknown',
        },
      });
    } catch (error) {
      if (config.debug) console.error('Error handling MCP request:', error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: 'Internal server error',
          },
          id: null,
        });
      }
    }
  });
};

import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import tools from './tools';
import toolHandler from './toolHandler';
import { McpError } from '../handlers/utils';
import GBIFMCPServer from './remote';
import config from '#/config';

export default (router, server) => {
  const mcpServer = new GBIFMCPServer(server);

  // MCP Tool Configuration Endpoint for stdio-mcp
  router.get('/chart/config', async (req, res) => {
    if (config.debug) console.log('Fetching MCP tool configuration');
    res.json({
      tools,
    });
  });

  // MCP Tool Execution Endpoint for stdio-mcp
  router.post('/chart/execute', async (req, res) => {
    if (config.debug) console.log('Fetching MCP tools execution');
    const { tool, arguments: args } = req.body;
    try {
      const result = await toolHandler(tool, args, server);
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
    try {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
      });

      res.on('close', () => {
        transport.close();
      });

      await mcpServer.server.connect(transport);
      await transport.handleRequest(req, res, req.body);
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

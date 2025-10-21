import { Router } from 'express';
import tools from './tools';
import toolHandler from './toolHandler';
import { McpError } from './handlers/utils';
import mcpServer from './remote';
import config from '#/config';

const router = Router();

export default (app) => {
  app.use('/mcp', router);

  // MCP Protocol Endpoint
  router.post('/', async (req, res) => {
    if (config.debug) console.log('Handling MCP protocol request');
    await mcpServer.handleMCPRequest(req, res);
  });

  // MCP Tool Configuration Endpoint for stdio-mcp
  router.get('/config', async (req, res) => {
    if (config.debug) console.log('Fetching MCP tool configuration');
    res.json({
      tools,
    });
  });

  // MCP Tool Execution Endpoint for stdio-mcp
  router.post('/execute', async (req, res) => {
    if (config.debug) console.log('Fetching MCP tools execution');
    const { tool, arguments: args } = req.body;
    try {
      const result = await toolHandler(tool, args);
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
};

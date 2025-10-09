import { Router } from 'express';
import tools from './tools';
import toolHandler, { McpError } from './toolHandler';

const router = Router();

export default (app) => {
  app.use('/mcp', router);

  router.get('/config', async (req, res) => {
    console.log('Fetching MCP tool configuration');
    res.json({
      tools,
    });
  });

  router.post('/execute', async (req, res) => {
    console.log('Fetching MCP tools execution');
    const { tool, arguments: args } = req.body;
    try {
      const result = await toolHandler(tool, args);
      console.log('send result of execution');
      res.json(result);
    } catch (error) {
      console.log(error);
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

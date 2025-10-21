import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import tools from './tools';
import toolHandler from './toolHandler';
import config from '#/config';

const SERVER_NAME = 'gbif-experimental-mcp-server';
const SERVER_VERSION = '0.1.0';

class GBIFMCPServer {
  server: Server;

  constructor() {
    this.server = new Server({ name: SERVER_NAME, version: SERVER_VERSION }, {
      capabilities: { tools },
    } as any);

    this.setupHandlers();
    this.setupErrorHandling();
  }

  setupHandlers() {
    // Forward tool calls to remote handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;
        const result = await toolHandler(name, args);
        return result;
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing tool: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      if (config.debug) console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async handleMCPRequest(req: any, res: any) {
    try {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
      });

      res.on('close', () => {
        transport.close();
      });

      await this.server.connect(transport);
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
  }
}

// Export singleton instance
const mcpServer = new GBIFMCPServer();
export default mcpServer;

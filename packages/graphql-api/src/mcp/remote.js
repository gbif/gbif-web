import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import tools from './tools';
import toolHandler from './toolHandler';

const SERVER_NAME = 'gbif-experimental-mcp-server';
const SERVER_VERSION = '0.1.0';

class GBIFMCPServer {
  server;

  constructor() {
    this.server = new Server(
      { name: SERVER_NAME, version: SERVER_VERSION },
      { capabilities: { tools: {} } },
    );

    this.setupHandlers();
    this.setupErrorHandling();
  }

  setupHandlers() {
    // List available tools (from remote)
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return { tools };
    });

    // Forward tool calls to remote handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;
        const result = await toolHandler(name, args);
        return result;
      } catch (error) {
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
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }
}

const mcpServer = new GBIFMCPServer();
export default mcpServer;
